#!/usr/bin/env python3
"""
Comprehensive audit of game translation files.
Compares all 19 translation files against the canonical game list in games.ts.
"""

import re
import os
import json
from pathlib import Path
from collections import defaultdict

BASE = Path("/Users/hesh/Downloads/doodle-game-hub")
GAMES_TS = BASE / "client/src/data/games.ts"
TRANSLATIONS_DIR = BASE / "client/src/data/translations"

TRANSLATION_FILES = [
    "ar", "de", "es", "fr", "hi", "id", "it", "ja", "ko",
    "nl", "pl", "pt", "ru", "sv", "th", "tr", "vi", "zh-CN", "zh-TW",
]

# ─── Step 1: Extract canonical slugs from games.ts ───────────────────────────

def extract_game_data(filepath):
    """Extract slugs, titles, descriptions, and controls from games.ts"""
    content = filepath.read_text(encoding="utf-8")
    
    # Extract slug values
    slugs = re.findall(r"slug:\s*['\"]([^'\"]+)['\"]", content)
    
    # Extract game blocks with their data
    games = {}
    # Split by game objects
    game_blocks = re.split(r'\{\s*\n\s*id:', content)
    for block in game_blocks[1:]:  # skip the first split (before first game)
        slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", block)
        title_match = re.search(r"title:\s*`([^`]+)`", block)
        desc_match = re.search(r"description:\s*`", block)
        controls_match = re.search(r"controls:\s*`([^`]+)`", block)
        
        if slug_match:
            slug = slug_match.group(1)
            games[slug] = {
                "title": title_match.group(1).strip() if title_match else "",
                "has_controls": controls_match is not None,
                "controls_text": controls_match.group(1).strip() if controls_match else "",
            }
    
    return slugs, games


# ─── Step 2: Extract translation data from each .ts file ─────────────────────

def extract_translation_entries(filepath):
    """Extract slug keys and their title/description/controls from a translation file."""
    content = filepath.read_text(encoding="utf-8")
    
    entries = {}
    
    # Find all slug keys - they can be quoted or unquoted
    # Pattern: 'slug-name': { ... } or slug_name: { ... }
    # We need to find each entry block
    
    # Match patterns like:  'some-slug': {  or  someSlug: {
    slug_pattern = re.compile(r"""(?:['"]([^'"]+)['"]|(\w[\w-]*))\s*:\s*\{""")
    
    pos = 0
    while pos < len(content):
        m = slug_pattern.search(content, pos)
        if not m:
            break
        
        slug = m.group(1) or m.group(2)
        
        # Skip non-slug keys (like the export declaration variable name)
        if slug in ('Record', 'string', 'GameTranslation', 'type') or slug.endswith('_GAMES'):
            pos = m.end()
            continue
        
        # Find the matching closing brace for this entry
        brace_start = content.index('{', m.start())
        brace_count = 0
        i = brace_start
        while i < len(content):
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    break
            i += 1
        
        block = content[brace_start:i+1]
        
        # Extract title
        title_match = re.search(r"title:\s*['\"`]([^'\"`]*)['\"`]", block)
        # For backtick strings
        if not title_match:
            title_match = re.search(r"title:\s*`([^`]*)`", block)
        
        # Extract description  
        desc_match = re.search(r"description:\s*['\"`]", block)
        # Get full description text
        desc_text = ""
        desc_m = re.search(r"description:\s*(?:`((?:[^`]|\\`)*)`|'((?:[^']|\\')*)'|\"((?:[^\"]|\\\")*)\")", block, re.DOTALL)
        if desc_m:
            desc_text = desc_m.group(1) or desc_m.group(2) or desc_m.group(3) or ""
        
        # Extract controls
        controls_match = re.search(r"controls:\s*(?:`((?:[^`]|\\`)*)`|'((?:[^']|\\')*)'|\"((?:[^\"]|\\\")*)\")", block, re.DOTALL)
        controls_text = ""
        if controls_match:
            controls_text = controls_match.group(1) or controls_match.group(2) or controls_match.group(3) or ""
        
        title_text = ""
        if title_match:
            title_text = title_match.group(1)
        
        entries[slug] = {
            "title": title_text,
            "description": desc_text,
            "has_title": bool(title_text and title_text.strip()),
            "has_description": bool(desc_text and desc_text.strip()),
            "has_controls": bool(controls_text and controls_text.strip()),
            "controls": controls_text,
        }
        
        pos = i + 1
    
    return entries


# ─── Step 3: Quality checks ──────────────────────────────────────────────────

def check_identical_to_english(trans_text, eng_text):
    """Check if translation is identical to English (copy-paste without translating)."""
    if not trans_text or not eng_text:
        return False
    # Normalize whitespace for comparison
    t = ' '.join(trans_text.split())
    e = ' '.join(eng_text.split())
    return t == e


def has_non_latin_chars(text):
    """Check if text contains non-Latin characters (for CJK, Arabic, etc.)."""
    for ch in text:
        if ord(ch) > 0x024F:  # Beyond Extended Latin
            return True
    return False


# Languages that should have non-Latin characters in most translations
NON_LATIN_LANGS = {"ar", "hi", "ja", "ko", "th", "vi", "zh-CN", "zh-TW", "ru"}


# ─── Main Audit ──────────────────────────────────────────────────────────────

def main():
    print("=" * 80)
    print("  COMPREHENSIVE GAME TRANSLATION AUDIT")
    print("=" * 80)
    
    # Step 1: Get canonical data
    canonical_slugs, games_data = extract_game_data(GAMES_TS)
    canonical_set = set(canonical_slugs)
    
    print(f"\n📋 CANONICAL GAME LIST (games.ts)")
    print(f"   Total game slugs: {len(canonical_slugs)}")
    print(f"   Unique slugs:     {len(canonical_set)}")
    if len(canonical_slugs) != len(canonical_set):
        dupes = [s for s in canonical_slugs if canonical_slugs.count(s) > 1]
        print(f"   ⚠️  DUPLICATE SLUGS: {set(dupes)}")
    
    games_with_controls = {s for s, d in games_data.items() if d["has_controls"]}
    print(f"   Games with controls: {len(games_with_controls)}")
    
    print(f"\n   All slugs:")
    for i, slug in enumerate(sorted(canonical_set), 1):
        print(f"     {i:2d}. {slug}")
    
    # Step 2-5: Audit each translation file
    print("\n" + "=" * 80)
    print("  PER-FILE AUDIT RESULTS")
    print("=" * 80)
    
    summary_data = []
    all_missing = defaultdict(list)  # slug -> list of langs missing it
    all_extra = defaultdict(list)    # slug -> list of langs with extra
    
    for lang in TRANSLATION_FILES:
        filepath = TRANSLATIONS_DIR / f"{lang}.ts"
        if not filepath.exists():
            print(f"\n❌ {lang}.ts — FILE NOT FOUND!")
            continue
        
        entries = extract_translation_entries(filepath)
        entry_set = set(entries.keys())
        
        missing = canonical_set - entry_set
        extra = entry_set - canonical_set
        
        for s in missing:
            all_missing[s].append(lang)
        for s in extra:
            all_extra[s].append(lang)
        
        # Check for missing title/description
        missing_title = []
        missing_desc = []
        empty_title = []
        empty_desc = []
        missing_controls = []
        
        for slug in sorted(entry_set & canonical_set):
            e = entries[slug]
            if not e["has_title"]:
                missing_title.append(slug)
            if not e["has_description"]:
                missing_desc.append(slug)
            if not e["title"].strip():
                empty_title.append(slug)
            if not e["description"].strip():
                empty_desc.append(slug)
            # Check if game has controls in English but translation doesn't
            if slug in games_with_controls and not e["has_controls"]:
                missing_controls.append(slug)
        
        # Quality checks
        identical_titles = []
        identical_descs = []
        
        for slug in sorted(entry_set & canonical_set):
            e = entries[slug]
            if slug in games_data:
                eng = games_data[slug]
                if check_identical_to_english(e["title"], eng["title"]):
                    identical_titles.append(slug)
                # For descriptions, just check first 100 chars to avoid false negatives from whitespace
                eng_desc_short = eng.get("title", "")  # We don't have full eng desc easily
        
        # For title quality: check if non-Latin language has all-Latin title
        suspect_titles = []
        if lang in NON_LATIN_LANGS:
            for slug in sorted(entry_set & canonical_set):
                e = entries[slug]
                # Remove common English proper nouns before checking
                title_cleaned = e["title"]
                for proper in ["Google", "Doodle", "Pac-Man", "Pac Man", "Chrome", "T-Rex", 
                              "Momo", "Rubik", "Beethoven", "Bach", "Les Paul", "Moog",
                              "Turing", "Magic Cat Academy", "Pétanque", "Lotería",
                              "Halloween", "Valentine", "Qixi", "Chilseok",
                              "Doctor Who", "Oskar Fischinger", "Clara Rockmore",
                              "Santa", "Zamboni", "Komodo", "Quick Draw",
                              "Kandinsky", "Hip Hop"]:
                    title_cleaned = title_cleaned.replace(proper, "")
                title_cleaned = title_cleaned.strip(" -—:/'\"")
                if title_cleaned and len(title_cleaned) > 3 and not has_non_latin_chars(title_cleaned):
                    suspect_titles.append((slug, e["title"]))
        
        # Print results
        print(f"\n{'─' * 70}")
        print(f"  📄 {lang}.ts")
        print(f"{'─' * 70}")
        print(f"  Total entries:        {len(entry_set)}")
        print(f"  Expected entries:     {len(canonical_set)}")
        print(f"  Coverage:             {len(entry_set & canonical_set)}/{len(canonical_set)} ({100*len(entry_set & canonical_set)/len(canonical_set):.1f}%)")
        
        if missing:
            print(f"\n  ❌ MISSING SLUGS ({len(missing)}):")
            for s in sorted(missing):
                print(f"     - {s}")
        else:
            print(f"\n  ✅ No missing slugs")
        
        if extra:
            print(f"\n  ⚠️  EXTRA SLUGS ({len(extra)}) — may be removed games:")
            for s in sorted(extra):
                print(f"     - {s}")
        else:
            print(f"  ✅ No extra slugs")
        
        if missing_title:
            print(f"\n  ❌ ENTRIES MISSING TITLE ({len(missing_title)}):")
            for s in missing_title:
                print(f"     - {s}")
        
        if missing_desc:
            print(f"\n  ❌ ENTRIES MISSING DESCRIPTION ({len(missing_desc)}):")
            for s in missing_desc:
                print(f"     - {s}")
        
        if not missing_title and not missing_desc:
            print(f"  ✅ All present entries have title and description")
        
        if missing_controls:
            print(f"\n  ⚠️  MISSING CONTROLS ({len(missing_controls)}) — game has controls in English:")
            for s in missing_controls:
                print(f"     - {s}")
        else:
            print(f"  ✅ Controls coverage OK")
        
        if identical_titles:
            print(f"\n  ⚠️  TITLES IDENTICAL TO ENGLISH ({len(identical_titles)}):")
            for s in identical_titles:
                print(f"     - {s}: \"{entries[s]['title']}\"")
        
        if suspect_titles:
            print(f"\n  🔍 TITLES WITH NO NON-LATIN CHARS (may be untranslated) ({len(suspect_titles)}):")
            for s, t in suspect_titles[:10]:  # Limit output
                print(f"     - {s}: \"{t}\"")
            if len(suspect_titles) > 10:
                print(f"     ... and {len(suspect_titles) - 10} more")
        
        summary_data.append({
            "lang": lang,
            "total": len(entry_set),
            "coverage": len(entry_set & canonical_set),
            "missing": len(missing),
            "extra": len(extra),
            "missing_title": len(missing_title),
            "missing_desc": len(missing_desc),
            "missing_controls": len(missing_controls),
            "identical_titles": len(identical_titles),
        })
    
    # ─── Summary Table ────────────────────────────────────────────────────────
    print("\n\n" + "=" * 80)
    print("  SUMMARY TABLE")
    print("=" * 80)
    
    header = f"{'Lang':<8} {'Entries':>7} {'Cover':>7} {'Miss':>6} {'Extra':>6} {'NoTitle':>7} {'NoDesc':>7} {'NoCtrls':>7} {'=EngTtl':>7}"
    print(f"\n  {header}")
    print(f"  {'─' * len(header)}")
    
    for s in summary_data:
        row = (
            f"  {s['lang']:<8} "
            f"{s['total']:>7} "
            f"{s['coverage']}/{len(canonical_set):>5} "
            f"{s['missing']:>6} "
            f"{s['extra']:>6} "
            f"{s['missing_title']:>7} "
            f"{s['missing_desc']:>7} "
            f"{s['missing_controls']:>7} "
            f"{s['identical_titles']:>7}"
        )
        print(row)
    
    # ─── Cross-language missing slug report ───────────────────────────────────
    if all_missing:
        print(f"\n\n{'=' * 80}")
        print(f"  SLUGS MISSING ACROSS LANGUAGES")
        print(f"{'=' * 80}")
        for slug in sorted(all_missing.keys()):
            langs = all_missing[slug]
            print(f"\n  {slug}  — missing in {len(langs)} file(s):")
            print(f"    {', '.join(sorted(langs))}")
    
    if all_extra:
        print(f"\n\n{'=' * 80}")
        print(f"  EXTRA SLUGS ACROSS LANGUAGES")
        print(f"{'=' * 80}")
        for slug in sorted(all_extra.keys()):
            langs = all_extra[slug]
            print(f"\n  {slug}  — extra in {len(langs)} file(s):")
            print(f"    {', '.join(sorted(langs))}")
    
    # ─── Final verdict ────────────────────────────────────────────────────────
    total_missing = sum(s["missing"] for s in summary_data)
    total_extra = sum(s["extra"] for s in summary_data)
    total_no_title = sum(s["missing_title"] for s in summary_data)
    total_no_desc = sum(s["missing_desc"] for s in summary_data)
    total_no_ctrls = sum(s["missing_controls"] for s in summary_data)
    
    print(f"\n\n{'=' * 80}")
    print(f"  FINAL VERDICT")
    print(f"{'=' * 80}")
    print(f"  Games in games.ts:         {len(canonical_set)}")
    print(f"  Translation files checked: {len(TRANSLATION_FILES)}")
    print(f"  Total missing entries:     {total_missing}")
    print(f"  Total extra entries:       {total_extra}")
    print(f"  Total missing titles:      {total_no_title}")
    print(f"  Total missing descriptions:{total_no_desc}")
    print(f"  Total missing controls:    {total_no_ctrls}")
    
    if total_missing == 0 and total_extra == 0 and total_no_title == 0 and total_no_desc == 0:
        print(f"\n  🎉 ALL TRANSLATIONS ARE COMPLETE AND CONSISTENT!")
    else:
        print(f"\n  ⚠️  ISSUES FOUND — see details above")


if __name__ == "__main__":
    main()
