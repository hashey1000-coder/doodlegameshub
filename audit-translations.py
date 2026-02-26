#!/usr/bin/env python3
"""
Comprehensive audit of the translation system in LanguageContext.tsx
"""
import re
import json
from collections import OrderedDict

FILE = "client/src/contexts/LanguageContext.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()
    lines = content.split("\n")

# ─── TASK 1a: Extract all TranslationKey values ───────────────────────────────

# Find the TranslationKey type definition
tk_match = re.search(r"export type TranslationKey\s*=\s*\n(.*?);", content, re.DOTALL)
if not tk_match:
    print("ERROR: Could not find TranslationKey type")
    exit(1)

tk_block = tk_match.group(1)
# Extract all quoted keys
translation_keys = re.findall(r"'([^']+)'", tk_block)
translation_keys_set = set(translation_keys)

print("=" * 80)
print("TRANSLATION SYSTEM AUDIT REPORT")
print("=" * 80)
print(f"\n📊 Total TranslationKey count: {len(translation_keys)}")
print(f"   Unique keys: {len(translation_keys_set)}")

# Check for duplicates in the type definition
if len(translation_keys) != len(translation_keys_set):
    from collections import Counter
    counts = Counter(translation_keys)
    dupes = {k: v for k, v in counts.items() if v > 1}
    print(f"\n⚠️  DUPLICATE KEYS in TranslationKey type: {dupes}")
else:
    print("   ✅ No duplicate keys in TranslationKey type definition")

# ─── TASK 1b: Extract keys from each locale block ─────────────────────────────

# Find all locale constant blocks: const XX: TranslationMap = { ... };
locale_pattern = re.compile(
    r"^const\s+(\w+):\s*TranslationMap\s*=\s*\{(.*?)^\};",
    re.MULTILINE | re.DOTALL
)

# Map constant names to locale codes
const_to_locale = {
    "EN": "en", "ES": "es", "FR": "fr", "DE": "de", "IT": "it",
    "PT": "pt", "RU": "ru", "ZH_CN": "zh-CN", "ZH_TW": "zh-TW",
    "JA": "ja", "KO": "ko", "AR": "ar", "HI": "hi", "TR": "tr",
    "NL": "nl", "PL": "pl", "SV": "sv", "ID": "id", "VI": "vi", "TH": "th"
}

locale_blocks = {}
for m in locale_pattern.finditer(content):
    const_name = m.group(1)
    block_text = m.group(2)
    if const_name in const_to_locale:
        locale_code = const_to_locale[const_name]
        # Extract all keys from this block
        keys_in_block = re.findall(r"'([^']+)'\s*:", block_text)
        # Also extract key-value pairs for empty string & English detection
        kv_pairs = {}
        for kv_match in re.finditer(r"'([^']+)'\s*:\s*'((?:[^'\\]|\\.)*)'", block_text):
            kv_pairs[kv_match.group(1)] = kv_match.group(2)
        # Also check for template literal values (backtick strings)
        for kv_match in re.finditer(r"'([^']+)'\s*:\s*`([^`]*)`", block_text):
            kv_pairs[kv_match.group(1)] = kv_match.group(2)
        
        locale_blocks[locale_code] = {
            "keys": set(keys_in_block),
            "keys_list": keys_in_block,
            "kv": kv_pairs,
            "const_name": const_name,
            "block_start": content[:m.start()].count("\n") + 1
        }

print(f"\n📋 Found {len(locale_blocks)} locale blocks: {', '.join(sorted(locale_blocks.keys()))}")

# Check which locales are missing entirely
expected_locales = {l.strip("'\"") for l in ["en","es","fr","de","it","pt","ru","zh-CN","zh-TW","ja","ko","ar","hi","tr","nl","pl","sv","id","vi","th"]}
missing_locales = expected_locales - set(locale_blocks.keys())
if missing_locales:
    print(f"\n🚨 MISSING LOCALE BLOCKS: {missing_locales}")

# ─── TASK 1c–e: Per-locale comparison ─────────────────────────────────────────

# Get English values for reference
en_kv = locale_blocks.get("en", {}).get("kv", {})

print("\n" + "=" * 80)
print("PER-LOCALE AUDIT")
print("=" * 80)

all_issues = {}

for locale_code in sorted(locale_blocks.keys()):
    info = locale_blocks[locale_code]
    keys = info["keys"]
    kv = info["kv"]
    
    missing_keys = translation_keys_set - keys
    extra_keys = keys - translation_keys_set
    
    # Check for duplicate keys within the block
    from collections import Counter
    key_counts = Counter(info["keys_list"])
    duplicate_keys = {k: v for k, v in key_counts.items() if v > 1}
    
    # Check for empty string values
    empty_values = [k for k, v in kv.items() if v.strip() == ""]
    
    # Check for suspected untranslated English (for non-English locales)
    suspected_english = []
    if locale_code != "en":
        for k, v in kv.items():
            if k in en_kv and v == en_kv[k] and len(v) > 3:
                # Skip keys that are expected to be the same (brand names, URLs, etc.)
                skip_patterns = [
                    "seo.siteName",
                    "notFound.code",
                ]
                # Also skip if value looks like a number, symbol, or brand
                if (k not in skip_patterns 
                    and not re.match(r'^[\d\s%+\-*/=<>!@#$^&()]+$', v)
                    and not re.match(r'^https?://', v)):
                    suspected_english.append((k, v))
    
    has_issues = missing_keys or extra_keys or empty_values or suspected_english or duplicate_keys
    
    issues = {
        "missing": sorted(missing_keys),
        "extra": sorted(extra_keys),
        "empty": sorted(empty_values),
        "duplicates": duplicate_keys,
        "suspected_english": sorted(suspected_english, key=lambda x: x[0]),
    }
    all_issues[locale_code] = issues
    
    print(f"\n{'─' * 60}")
    print(f"  {locale_code.upper()} ({info['const_name']}) — starts at line {info['block_start']}")
    print(f"  Keys: {len(keys)} / {len(translation_keys_set)} expected")
    print(f"{'─' * 60}")
    
    if missing_keys:
        print(f"  🚨 MISSING KEYS ({len(missing_keys)}):")
        for k in sorted(missing_keys):
            print(f"     - '{k}'")
    else:
        print(f"  ✅ No missing keys")
    
    if extra_keys:
        print(f"  ⚠️  EXTRA KEYS ({len(extra_keys)}) — not in TranslationKey type:")
        for k in sorted(extra_keys):
            print(f"     - '{k}'")
    else:
        print(f"  ✅ No extra keys")
    
    if duplicate_keys:
        print(f"  ⚠️  DUPLICATE KEYS ({len(duplicate_keys)}):")
        for k, count in sorted(duplicate_keys.items()):
            print(f"     - '{k}' appears {count} times")
    else:
        print(f"  ✅ No duplicate keys")
    
    if empty_values:
        print(f"  ⚠️  EMPTY VALUES ({len(empty_values)}):")
        for k in sorted(empty_values):
            print(f"     - '{k}'")
    else:
        print(f"  ✅ No empty values")
    
    if locale_code != "en":
        if suspected_english:
            print(f"  🔍 SUSPECTED UNTRANSLATED ({len(suspected_english)}):")
            for k, v in suspected_english[:30]:  # Limit output
                print(f"     - '{k}': \"{v[:60]}{'...' if len(v) > 60 else ''}\"")
            if len(suspected_english) > 30:
                print(f"     ... and {len(suspected_english) - 30} more")
        else:
            print(f"  ✅ No suspected untranslated English strings")

# ─── TASK 1e: zh-TW vs zh-CN comparison ──────────────────────────────────────

print("\n" + "=" * 80)
print("ZH-TW vs ZH-CN COMPARISON")
print("=" * 80)

if "zh-CN" in locale_blocks and "zh-TW" in locale_blocks:
    cn_keys = locale_blocks["zh-CN"]["keys"]
    tw_keys = locale_blocks["zh-TW"]["keys"]
    cn_kv = locale_blocks["zh-CN"]["kv"]
    tw_kv = locale_blocks["zh-TW"]["kv"]
    
    cn_only = cn_keys - tw_keys
    tw_only = tw_keys - cn_keys
    
    if cn_only:
        print(f"\n  Keys in zh-CN but NOT in zh-TW ({len(cn_only)}):")
        for k in sorted(cn_only):
            print(f"    - '{k}'")
    if tw_only:
        print(f"\n  Keys in zh-TW but NOT in zh-CN ({len(tw_only)}):")
        for k in sorted(tw_only):
            print(f"    - '{k}'")
    if not cn_only and not tw_only:
        print(f"\n  ✅ zh-TW and zh-CN have identical key sets ({len(cn_keys)} keys each)")
    
    # Check if zh-TW has actual Traditional Chinese vs just copies of zh-CN
    identical_values = []
    for k in sorted(cn_keys & tw_keys):
        if k in cn_kv and k in tw_kv and cn_kv[k] == tw_kv[k]:
            # Check if value contains Chinese characters
            if re.search(r'[\u4e00-\u9fff]', cn_kv[k]):
                identical_values.append(k)
    
    if identical_values:
        print(f"\n  ⚠️  zh-TW values IDENTICAL to zh-CN ({len(identical_values)} of {len(cn_keys & tw_keys)} shared keys):")
        print(f"     (These may need Traditional Chinese conversion)")
        for k in identical_values[:20]:
            print(f"     - '{k}': \"{cn_kv[k][:50]}\"")
        if len(identical_values) > 20:
            print(f"     ... and {len(identical_values) - 20} more")
    else:
        print(f"\n  ✅ zh-TW has distinct values from zh-CN (proper Traditional Chinese)")

# ─── SUMMARY ──────────────────────────────────────────────────────────────────

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)

total_missing = sum(len(v["missing"]) for v in all_issues.values())
total_extra = sum(len(v["extra"]) for v in all_issues.values())
total_empty = sum(len(v["empty"]) for v in all_issues.values())
total_untranslated = sum(len(v["suspected_english"]) for v in all_issues.values())
total_duplicates = sum(len(v["duplicates"]) for v in all_issues.values())

print(f"\n  TranslationKey type: {len(translation_keys_set)} unique keys")
print(f"  Locale blocks found: {len(locale_blocks)}")
print(f"")
print(f"  🚨 Total missing keys across all locales:     {total_missing}")
print(f"  ⚠️  Total extra keys across all locales:       {total_extra}")
print(f"  ⚠️  Total empty values across all locales:     {total_empty}")
print(f"  ⚠️  Total duplicate keys across all locales:   {total_duplicates}")
print(f"  🔍 Total suspected untranslated strings:      {total_untranslated}")

# Per-locale summary table
print(f"\n  {'Locale':<8} {'Keys':<6} {'Missing':<9} {'Extra':<7} {'Empty':<7} {'Dupes':<7} {'Untranslated':<12}")
print(f"  {'─'*8} {'─'*6} {'─'*9} {'─'*7} {'─'*7} {'─'*7} {'─'*12}")
for lc in sorted(locale_blocks.keys()):
    info = locale_blocks[lc]
    issues = all_issues[lc]
    flag = "🚨" if issues["missing"] else "  "
    print(f"  {flag}{lc:<6} {len(info['keys']):<6} {len(issues['missing']):<9} {len(issues['extra']):<7} {len(issues['empty']):<7} {len(issues['duplicates']):<7} {len(issues['suspected_english']):<12}")

print()
