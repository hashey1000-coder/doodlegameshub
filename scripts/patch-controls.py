#!/usr/bin/env python3
"""
Patch all 19 translation files to add `controls` translations.

Reads English controls from games.ts, generates translations for each language,
and inserts the `controls:` field after each game's `description:` field.
"""

import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES_PATH = os.path.join(ROOT, 'client/src/data/games.ts')
TRANS_DIR = os.path.join(ROOT, 'client/src/data/translations')

# ─── Extract English controls from games.ts ───
with open(GAMES_PATH, 'r') as f:
    content = f.read()

games_section = content[:content.index('CATEGORIES')]
slugs = re.findall(r"slug:\s*'([^']+)'", games_section)
controls_list = re.findall(r'controls:\s*`([^`]+)`', games_section)
EN = {}
for s, c in zip(slugs, controls_list):
    EN[s] = c.strip().replace('\n', ' ')

print(f"Extracted {len(EN)} games' controls from games.ts")

# ─── Ordered phrase replacement maps per language ───
# Keys are ordered from longest to shortest match to avoid partial replacements.
# Each language maps English phrases → translated phrases.

LANGS = {
  'es': [
    ('Use the Arrow Keys or WASD', 'Usa las flechas o WASD'),
    ('Use Arrow Keys or WASD', 'Usa las flechas o WASD'),
    ('Use the Left and Right Arrow Keys', 'Usa las flechas izquierda y derecha'),
    ('Left and Right Arrow keys', 'flechas izquierda y derecha'),
    ('Left and Right Arrow Keys', 'flechas izquierda y derecha'),
    ('Left/Right Arrow Keys', 'flechas izquierda/derecha'),
    ('Use the Arrow Keys', 'Usa las flechas'),
    ('Use Arrow Keys', 'Usa las flechas'),
    ('the Left Arrow', 'la flecha izquierda'),
    ('the Right Arrow', 'la flecha derecha'),
    ('the Up Arrow', 'la flecha arriba'),
    ('the Down Arrow', 'la flecha abajo'),
    ('Left Arrow', 'flecha izquierda'),
    ('Right Arrow', 'flecha derecha'),
    ('Up Arrow', 'flecha arriba'),
    ('Down Arrow', 'flecha abajo'),
    ('Arrow Keys', 'flechas'),
    ('Click or tap each', 'Haz clic o toca cada'),
    ('Click or tap to', 'Haz clic o toca para'),
    ('Click or tap on', 'Haz clic o toca en'),
    ('Click or tap', 'Haz clic o toca'),
    ('click or tap', 'haz clic o toca'),
    ('Click and drag your mouse', 'Haz clic y arrastra el ratón'),
    ('Click and drag upward', 'Haz clic y arrastra hacia arriba'),
    ('Click and drag any', 'Haz clic y arrastra cualquier'),
    ('Click and drag to', 'Haz clic y arrastra para'),
    ('Click and drag on', 'Haz clic y arrastra en'),
    ('Click and drag', 'Haz clic y arrastra'),
    ('click and drag', 'haz clic y arrastra'),
    ('Click and hold', 'Haz clic y mantén pulsado'),
    ('Click or press Space', 'Haz clic o pulsa Espacio'),
    ('Click through the', 'Haz clic en los'),
    ('Click on objects', 'Haz clic en objetos'),
    ('Click on buildings', 'Haz clic en edificios'),
    ('Click on the', 'Haz clic en el'),
    ('Click on any', 'Haz clic en cualquier'),
    ('Click on a', 'Haz clic en un'),
    ('Click on', 'Haz clic en'),
    ('click on', 'haz clic en'),
    ('Click the command', 'Haz clic en los bloques de comando'),
    ('Click the record', 'Haz clic en el disco'),
    ('Click the clapperboard', 'Haz clic en la claqueta'),
    ('Click the Play button', 'Haz clic en el botón Reproducir'),
    ('Click the', 'Haz clic en'),
    ('click the', 'haz clic en'),
    ('Click a square', 'Haz clic en un cuadro'),
    ('Click any empty', 'Haz clic en cualquier'),
    ('Click again', 'Haz clic de nuevo'),
    ('click again', 'haz clic de nuevo'),
    ('Click rapidly', 'Haz clic rápidamente'),
    ('click rapidly', 'haz clic rápidamente'),
    ('Click individual', 'Haz clic en las'),
    ('Click to', 'Haz clic para'),
    ('click to', 'haz clic para'),
    ('Click', 'Haz clic'),
    ('click', 'haz clic'),
    ('Press and hold the Left Arrow', 'Mantén pulsada la flecha izquierda'),
    ('Press and hold', 'Mantén pulsado'),
    ('Press Space or the Up Arrow', 'Pulsa Espacio o la flecha arriba'),
    ('Press Space or click', 'Pulsa Espacio o haz clic'),
    ('Press Space to restart', 'Pulsa Espacio para reiniciar'),
    ('Press Space to fire', 'Pulsa Espacio para disparar'),
    ('Press Space', 'Pulsa Espacio'),
    ('press Space', 'pulsa Espacio'),
    ('Press Enter', 'Pulsa Enter'),
    ('press Enter', 'pulsa Enter'),
    ('Press the Left Arrow', 'Pulsa la flecha izquierda'),
    ('Press the Right Arrow', 'Pulsa la flecha derecha'),
    ('Press the Up Arrow', 'Pulsa la flecha arriba'),
    ('Press the Down Arrow', 'Pulsa la flecha abajo'),
    ('Press the keys shown on screen', 'Pulsa las teclas que aparecen en pantalla'),
    ('Press the', 'Pulsa la'),
    ('press the', 'pulsa la'),
    ('Press Z or click', 'Pulsa Z o haz clic'),
    ('Press Z', 'Pulsa Z'),
    ('Tilt your device or use', 'Inclina tu dispositivo o usa'),
    ('Hover your mouse over', 'Pasa el ratón por encima de'),
    ('Move your mouse left and right', 'Mueve el ratón a izquierda y derecha'),
    ('Move your mouse up and down', 'Mueve el ratón arriba y abajo'),
    ('Move your mouse', 'Mueve el ratón'),
    ('move your mouse', 'mueve el ratón'),
    ('your mouse or finger', 'el ratón o el dedo'),
    ('your mouse or using', 'el ratón o usando'),
    ('using your mouse', 'usando el ratón'),
    ('your mouse', 'el ratón'),
    ('the mouse', 'el ratón'),
    ('Type your answer into the text box', 'Escribe tu respuesta en el cuadro de texto'),
    ('type your answer using the keyboard', 'escribe tu respuesta usando el teclado'),
    ('Draw on the canvas', 'Dibuja en el lienzo'),
    ('Draw the symbol', 'Dibuja el símbolo'),
    ('Draw', 'Dibuja'),
    ('draw the symbol', 'dibuja el símbolo'),
    ('draw it', 'dibújalo'),
    ('on screen', 'en pantalla'),
    ('on-screen', 'en pantalla'),
    ('On mobile', 'En móvil'),
    ('on mobile', 'en móvil'),
    ('Drag code blocks', 'Arrastra bloques de código'),
    ('Drag left or right', 'Arrastra a izquierda o derecha'),
    ('Drag on the', 'Arrastra en el'),
    ('drag to set', 'arrastra para ajustar'),
    ('Drag', 'Arrastra'),
    ('drag', 'arrastra'),
    ('swipe on mobile', 'desliza en móvil'),
    ('Swipe', 'Desliza'),
    ('swipe', 'desliza'),
    ('tap the screen to jump', 'toca la pantalla para saltar'),
    ('tap the screen', 'toca la pantalla'),
    ('tap the correct', 'toca el/la correcto/a'),
    ('tap to', 'toca para'),
    ('Tap', 'Toca'),
    ('tap', 'toca'),
    ('Left-click a tile', 'Haz clic izquierdo en una casilla'),
    ('Left-click', 'Haz clic izquierdo'),
    ('Right-click', 'Haz clic derecho'),
    ('right-click', 'haz clic derecho'),
    ('long-press', 'mantén pulsado'),
    ('Rapidly alternate pressing', 'Alterna rápidamente pulsando'),
    ('Each mini-game has its own controls', 'Cada minijuego tiene sus propios controles'),
    ('Each sport has unique controls shown on screen', 'Cada deporte tiene controles únicos en pantalla'),
    ('controls shown on screen', 'controles en pantalla'),
    ('The game starts slowly and speeds up', 'El juego empieza lento y se acelera'),
    ('The game ends when', 'El juego termina cuando'),
    ('The game ends', 'El juego termina'),
    ('the game ends', 'el juego termina'),
    ('The game accelerates over time', 'El juego se acelera con el tiempo'),
    ('game over', 'fin del juego'),
    ('You get three', 'Tienes tres'),
    ('You have three', 'Tienes tres'),
    ("You're trying to guess", 'Estás intentando adivinar'),
    ('You are given a word', 'Se te da una palabra'),
    ('you want to turn', 'quieras girar'),
    ('you can eat them', 'puedes comerlos'),
    ('your composition', 'tu composición'),
    ('your throw', 'tu tiro'),
    ('your program', 'tu programa'),
    ('your bat', 'tu bate'),
    ('your snake', 'tu serpiente'),
    ('your horse', 'tu caballo'),
    ('your cannon', 'tu cañón'),
    ('your ghost', 'tu fantasma'),
    ('your sequence', 'tu secuencia'),
    ('your hand', 'tu mano'),
    ('your witch', 'tu bruja'),
    ('your penguin', 'tu pingüino'),
    ('your own', 'tu propia'),
    ('your bucket', 'tu cubo'),
    ('your athlete', 'tu atleta'),
    ('your elf', 'tu elfo'),
    ('the ball', 'la pelota'),
    ('the bat', 'el bate'),
    ('the screen', 'la pantalla'),
    ('the grid', 'la cuadrícula'),
    ('the cube', 'el cubo'),
    ('the puzzle', 'el puzzle'),
    ('the round', 'la ronda'),
    ('the level', 'el nivel'),
    ('the music', 'la música'),
    ('score', 'puntuación'),
    ('points', 'puntos'),
    ('Watch for', 'Observa'),
    ('Watch the', 'Observa el'),
    ('to jump over', 'para saltar sobre'),
    ('to jump', 'para saltar'),
    ('to duck under', 'para agacharte bajo'),
    ('to duck', 'para agacharte'),
    ('to fire', 'para disparar'),
    ('to shoot at', 'para disparar a'),
    ('to interact with', 'para interactuar con'),
    ('to interact', 'para interactuar'),
    ('to collect them', 'para recogerlos'),
    ('to collect', 'para recoger'),
    ('to place', 'para colocar'),
    ('to score runs', 'para anotar carreras'),
    ('to score', 'para anotar'),
    ('to win', 'para ganar'),
    ('to restart', 'para reiniciar'),
    ('to play notes', 'para tocar notas'),
    ('to play', 'para jugar'),
    ('to start', 'para empezar'),
    ('to select', 'para seleccionar'),
    ('to submit', 'para enviar'),
    ('to change', 'para cambiar'),
    ('to adjust', 'para ajustar'),
    ('to rotate', 'para rotar'),
    ('to create', 'para crear'),
    ('to draw', 'para dibujar'),
    ('to record', 'para grabar'),
    ('to aim', 'para apuntar'),
    ('to steer', 'para dirigir'),
    ('to swim', 'para nadar'),
    ('to fly', 'para volar'),
    ('to run', 'para correr'),
    ('to guide', 'para guiar'),
    ('to move', 'para mover'),
    ('to make', 'para hacer'),
    ('to add', 'para añadir'),
    ('to set', 'para establecer'),
    ('Avoid hitting', 'Evita chocar con'),
    ('Avoid the', 'Evita los'),
    ('Avoid', 'Evita'),
    ('avoid', 'evita'),
    ('Collect the', 'Recoge los'),
    ('Collect', 'Recoge'),
    ('collect', 'recoge'),
    ('Complete all', 'Completa todos'),
    ('Complete the', 'Completa el'),
    ('Reach the goal', 'Alcanza la meta'),
    ('Reach', 'Alcanza'),
    ('reach', 'alcanza'),
    ('Reveal all', 'Revela todas'),
    ('power-ups', 'potenciadores'),
    ('power-up', 'potenciador'),
    ('Power Pellet', 'Potenciador'),
    ('bonus points', 'puntos extra'),
    ('each level', 'cada nivel'),
    ('each round', 'cada ronda'),
    ('each scene', 'cada escena'),
    ('each ghost', 'cada fantasma'),
    ('each step', 'cada paso'),
    ('obstacles', 'obstáculos'),
    ('enemies', 'enemigos'),
    ('puzzle', 'puzzle'),
    ('level', 'nivel'),
    ('timer', 'temporizador'),
    ('record button', 'botón de grabación'),
    ('immediately', 'inmediatamente'),
    ('automatically', 'automáticamente'),
    ('continuously', 'continuamente'),
    ('temporarily', 'temporalmente'),
    ('carefully', 'cuidadosamente'),
    ('precisely', 'con precisión'),
    ('correctly', 'correctamente'),
    ('successfully', 'exitosamente'),
    ('Try to', 'Intenta'),
    ('try to', 'intenta'),
    ('If too many', 'Si demasiados'),
  ],

  'fr': [
    ('Use the Arrow Keys or WASD', 'Utilisez les touches fléchées ou WASD'),
    ('Use Arrow Keys or WASD', 'Utilisez les touches fléchées ou WASD'),
    ('Use the Arrow Keys', 'Utilisez les touches fléchées'),
    ('Use Arrow Keys', 'Utilisez les touches fléchées'),
    ('the Left and Right Arrow Keys', 'les touches Flèche Gauche et Droite'),
    ('Left and Right Arrow keys', 'touches Flèche Gauche et Droite'),
    ('Left/Right Arrow Keys', 'touches Flèche Gauche/Droite'),
    ('the Left Arrow', 'la Flèche Gauche'),
    ('the Right Arrow', 'la Flèche Droite'),
    ('the Up Arrow', 'la Flèche Haut'),
    ('the Down Arrow', 'la Flèche Bas'),
    ('Arrow Keys', 'touches fléchées'),
    ('Click or tap each', 'Cliquez ou appuyez sur chaque'),
    ('Click or tap to', 'Cliquez ou appuyez pour'),
    ('Click or tap', 'Cliquez ou appuyez'),
    ('click or tap', 'cliquez ou appuyez'),
    ('Click and drag your mouse', 'Cliquez et faites glisser la souris'),
    ('Click and drag upward', 'Cliquez et faites glisser vers le haut'),
    ('Click and drag any', 'Cliquez et faites glisser n\'importe quel'),
    ('Click and drag to', 'Cliquez et faites glisser pour'),
    ('Click and drag', 'Cliquez et faites glisser'),
    ('click and drag', 'cliquez et faites glisser'),
    ('Click and hold', 'Cliquez et maintenez'),
    ('Click or press Space', 'Cliquez ou appuyez sur Espace'),
    ('Click on', 'Cliquez sur'),
    ('click on', 'cliquez sur'),
    ('Click the', 'Cliquez sur le'),
    ('click the', 'cliquez sur le'),
    ('Click through', 'Cliquez à travers'),
    ('Click a', 'Cliquez sur un'),
    ('Click any', 'Cliquez sur n\'importe quel'),
    ('Click to', 'Cliquez pour'),
    ('click to', 'cliquez pour'),
    ('Click again', 'Cliquez à nouveau'),
    ('click again', 'cliquez à nouveau'),
    ('Click rapidly', 'Cliquez rapidement'),
    ('click rapidly', 'cliquez rapidement'),
    ('Click', 'Cliquez'),
    ('click', 'cliquez'),
    ('Press and hold', 'Maintenez enfoncée'),
    ('Press Space or the Up Arrow', 'Appuyez sur Espace ou la Flèche Haut'),
    ('Press Space or click', 'Appuyez sur Espace ou cliquez'),
    ('Press Space to restart', 'Appuyez sur Espace pour recommencer'),
    ('Press Space', 'Appuyez sur Espace'),
    ('press Space', 'appuyez sur Espace'),
    ('Press Enter', 'Appuyez sur Entrée'),
    ('press Enter', 'appuyez sur Entrée'),
    ('Press the keys shown on screen', 'Appuyez sur les touches affichées à l\'écran'),
    ('Press the', 'Appuyez sur la'),
    ('press the', 'appuyez sur la'),
    ('Press Z or click', 'Appuyez sur Z ou cliquez'),
    ('Press Z', 'Appuyez sur Z'),
    ('Tilt your device or use', 'Inclinez votre appareil ou utilisez'),
    ('Hover your mouse', 'Survolez avec la souris'),
    ('Move your mouse left and right', 'Déplacez la souris à gauche et à droite'),
    ('Move your mouse up and down', 'Déplacez la souris vers le haut et le bas'),
    ('Move your mouse', 'Déplacez la souris'),
    ('move your mouse', 'déplacez la souris'),
    ('your mouse or finger', 'la souris ou le doigt'),
    ('using your mouse', 'avec la souris'),
    ('your mouse', 'la souris'),
    ('the mouse', 'la souris'),
    ('Type your answer', 'Tapez votre réponse'),
    ('type your answer', 'tapez votre réponse'),
    ('on screen', 'à l\'écran'),
    ('on-screen', 'à l\'écran'),
    ('On mobile', 'Sur mobile'),
    ('on mobile', 'sur mobile'),
    ('Drag code blocks', 'Faites glisser les blocs de code'),
    ('Drag', 'Faites glisser'),
    ('drag', 'faites glisser'),
    ('Swipe', 'Glissez'),
    ('swipe', 'glissez'),
    ('tap the screen', 'appuyez sur l\'écran'),
    ('tap', 'appuyez'),
    ('Tap', 'Appuyez'),
    ('Left-click', 'Cliquez gauche sur'),
    ('Right-click', 'Cliquez droit'),
    ('long-press', 'appuyez longuement'),
    ('Rapidly alternate pressing', 'Alternez rapidement'),
    ('The game ends when', 'Le jeu se termine quand'),
    ('The game ends', 'Le jeu se termine'),
    ('the game ends', 'le jeu se termine'),
    ('power-ups', 'bonus'),
    ('power-up', 'bonus'),
    ('Power Pellet', 'Super Pastille'),
    ('bonus points', 'points bonus'),
    ('automatically', 'automatiquement'),
    ('continuously', 'continuellement'),
    ('temporarily', 'temporairement'),
    ('carefully', 'soigneusement'),
    ('precisely', 'avec précision'),
    ('correctly', 'correctement'),
    ('immediately', 'immédiatement'),
    ('each level', 'chaque niveau'),
    ('each round', 'chaque manche'),
    ('each scene', 'chaque scène'),
    ('obstacles', 'obstacles'),
    ('enemies', 'ennemis'),
    ('to jump over', 'pour sauter par-dessus'),
    ('to jump', 'pour sauter'),
    ('to duck', 'pour se baisser'),
    ('to fire', 'pour tirer'),
    ('to interact', 'pour interagir'),
    ('to collect', 'pour collecter'),
    ('to place', 'pour placer'),
    ('to draw', 'pour dessiner'),
    ('to create', 'pour créer'),
    ('to aim', 'pour viser'),
    ('to restart', 'pour recommencer'),
    ('to move', 'pour déplacer'),
    ('to guide', 'pour guider'),
    ('to fly', 'pour voler'),
    ('Avoid', 'Évitez'),
    ('avoid', 'évitez'),
    ('Collect', 'Collectez'),
    ('collect', 'collectez'),
    ('Try to', 'Essayez de'),
    ('try to', 'essayez de'),
  ],
}

def translate_controls(en_text, lang_phrases):
    """Translate English controls text using phrase replacement."""
    result = en_text
    for en_phrase, translated in lang_phrases:
        result = result.replace(en_phrase, translated)
    return result


def patch_translation_file(lang_code, lang_phrases):
    """Insert controls fields into a translation file."""
    filepath = os.path.join(TRANS_DIR, f'{lang_code}.ts')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'controls:' in content:
        print(f"  ⏭️  {lang_code}: already has controls, skipping")
        return

    # For each game entry, find the description line and add controls after it.
    # Pattern: description: 'text' OR description:\n      'text'
    # We need to insert controls after the description line(s).

    lines = content.split('\n')
    new_lines = []
    i = 0
    patched = 0

    # Track which slug we're in
    current_slug = None
    # Detect whether this file uses double quotes for keys
    uses_double = '"baseball"' in '\n'.join(lines)
    q = '"' if uses_double else "'"

    while i < len(lines):
        line = lines[i]
        new_lines.append(line)

        # Detect slug entry like  'baseball': {  or  "baseball": {  or  baseball: {
        slug_match = re.match(r'''^\s+['"]?([a-z0-9-]+)['"]?\s*:\s*\{''', line)
        if slug_match:
            current_slug = slug_match.group(1)

        # Detect description line (single-line or start of multi-line)
        if current_slug and re.match(r'^\s+description:', line):
            # Find the end of the description value
            desc_end = i
            stripped = line.rstrip()
            if stripped.endswith("',") or stripped.endswith('",'):
                desc_end = i
            else:
                # Multi-line: find the closing line
                for j in range(i + 1, min(i + 10, len(lines))):
                    sj = lines[j].rstrip()
                    if sj.endswith("',") or sj.endswith('",'):
                        # Add intermediate lines
                        for k in range(i + 1, j + 1):
                            new_lines.append(lines[k])
                        i = j
                        desc_end = j
                        break

            # Now insert controls after the description
            if current_slug in EN:
                en_ctrl = EN[current_slug]
                if lang_phrases:
                    translated = translate_controls(en_ctrl, lang_phrases)
                else:
                    translated = en_ctrl
                # Escape quotes based on the file's style
                if q == "'":
                    translated = translated.replace("'", "\\'")
                else:
                    translated = translated.replace('"', '\\"')
                new_lines.append(f"    controls: {q}{translated}{q},")
                patched += 1
            current_slug = None

        i += 1

    if patched > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        print(f"  ✅ {lang_code}: patched {patched} games with controls")
    else:
        print(f"  ⚠️  {lang_code}: no games patched")


# ─── Process all languages ───
ALL_LANGS = [
    'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi', 'tr',
    'nl', 'pl', 'sv', 'id', 'vi', 'th', 'zh-CN', 'zh-TW', 'ja', 'ko'
]

for lang in ALL_LANGS:
    phrases = LANGS.get(lang, [])
    if not phrases:
        # For languages without phrase maps, use English as fallback
        # (the hook already handles this, but having the field makes it explicit)
        pass
    patch_translation_file(lang, phrases)

print("\nDone!")
