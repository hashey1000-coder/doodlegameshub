#!/usr/bin/env python3
"""Add back the 3 game translations to all 19 translation files."""
import os

trans_dir = "client/src/data/translations"

# Translations per language
# Format: { lang: { slug: { title, description, controls } } }

GAMES = {}

# ── SPANISH ──
GAMES['es'] = {
  'quick-draw': {
    'title': 'Quick, Draw! de Google',
    'description': (
      '\u00bfPuede una red neuronal aprender a reconocer tus garabatos? Quick, Draw! '
      'es un experimento de IA de Google que te desaf\u00eda a dibujar objetos cotidianos '
      'en menos de 20 segundos mientras un modelo de aprendizaje autom\u00e1tico intenta '
      'adivinar lo que est\u00e1s dibujando en tiempo real.\n\n'
      'Quick, Draw! fue creado como un experimento de IA para ayudar a entrenar la red '
      'neuronal de Google en reconocimiento de im\u00e1genes dibujadas a mano. Cada garabato '
      'que los jugadores env\u00edan se convierte en parte de un enorme conjunto de datos de '
      'c\u00f3digo abierto que investigadores de todo el mundo utilizan para mejorar los '
      'modelos de aprendizaje autom\u00e1tico.'
    ),
    'controls': (
      'Se te da una palabra y 20 segundos para dibujarla con el rat\u00f3n o el dedo. '
      'Empieza a dibujar cuando comience el temporizador \u2014 la IA analiza tus trazos '
      'en tiempo real y grita sus predicciones. Si adivina correctamente, pasas a la '
      'siguiente palabra. Seis rondas en total.'
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 Mapa de Viento y Clima',
    'description': (
      'Explora el planeta entero en un hermoso globo 3D animado que visualiza patrones '
      'de viento en tiempo real, condiciones clim\u00e1ticas y corrientes oce\u00e1nicas. '
      'Gira el globo, ac\u00e9rcate a cualquier regi\u00f3n y observa las hipn\u00f3ticas '
      'corrientes de aire animadas.\n\n'
      'Impulsado por pron\u00f3sticos de supercomputadoras actualizados cada tres horas, '
      'este globo interactivo utiliza datos atmosf\u00e9ricos del Sistema de Pron\u00f3stico '
      'Global de NOAA y datos oce\u00e1nicos de OSCAR. Creado por Cameron Beccario, el '
      'proyecto visualiza terabytes de datos cient\u00edficos en una animaci\u00f3n '
      'fascinante en tiempo real.'
    ),
    'controls': (
      'Haz clic y arrastra para girar el globo. Desplaza para acercar y alejar. '
      'Haz clic en cualquier lugar para ver la velocidad del viento, temperatura y '
      'coordenadas locales. Usa el men\u00fa (texto "earth" inferior izquierdo) para '
      'cambiar entre capas atmosf\u00e9ricas.'
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera de Google',
    'description': (
      'Crea tu propia obra maestra oper\u00edstica con cuatro adorables blobs cantantes '
      'impulsados por aprendizaje autom\u00e1tico en este experimento de Google Arts & '
      'Culture de David Li. Arrastra los blobs arriba y abajo para cambiar el tono, '
      'izquierda y derecha para cambiar los sonidos vocales.\n\n'
      'Creado por el artista y programador David Li en colaboraci\u00f3n con cuatro '
      'cantantes de \u00f3pera reales, Blob Opera utiliza aprendizaje autom\u00e1tico '
      'entrenado con sus voces reales para generar armon\u00edas realistas. Gan\u00f3 un '
      'premio Webby y se convirti\u00f3 en uno de los experimentos m\u00e1s virales de '
      'Google Arts & Culture.'
    ),
    'controls': (
      'Haz clic y arrastra cualquiera de los cuatro blobs arriba o abajo para cambiar '
      'su tono. Arrastra izquierda y derecha para cambiar el sonido vocal que cantan. '
      'Los otros tres blobs armonizan autom\u00e1ticamente usando aprendizaje autom\u00e1tico. '
      'Pulsa el bot\u00f3n de grabar para capturar tu actuaci\u00f3n.'
    ),
  },
}

# ── FRENCH ──
GAMES['fr'] = {
  'quick-draw': {
    'title': 'Quick, Draw! de Google',
    'description': (
      "Un r\u00e9seau de neurones peut-il apprendre \u00e0 reconna\u00eetre vos "
      "gribouillages ? Quick, Draw! est une exp\u00e9rience d'IA de Google qui vous "
      "d\u00e9fie de dessiner des objets du quotidien en moins de 20 secondes pendant "
      "qu'un mod\u00e8le d'apprentissage automatique tente de deviner ce que vous dessinez "
      "en temps r\u00e9el.\n\n"
      "Quick, Draw! a \u00e9t\u00e9 cr\u00e9\u00e9 comme une exp\u00e9rience d'IA pour "
      "aider \u00e0 entra\u00eener le r\u00e9seau de neurones de Google \u00e0 la "
      "reconnaissance d'images dessin\u00e9es \u00e0 la main. Chaque gribouillage soumis "
      "par les joueurs fait partie d'un immense ensemble de donn\u00e9es open source "
      "utilis\u00e9 par des chercheurs du monde entier."
    ),
    'controls': (
      "On vous donne un mot et 20 secondes pour le dessiner avec la souris ou le doigt. "
      "Commencez \u00e0 dessiner d\u00e8s que le minuteur d\u00e9marre \u2014 l'IA analyse "
      "vos traits en temps r\u00e9el et crie ses devinettes. Si elle devine correctement, "
      "vous passez au mot suivant. Six tours au total."
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 Carte des Vents et M\u00e9t\u00e9o',
    'description': (
      "Explorez la plan\u00e8te enti\u00e8re sur un magnifique globe 3D anim\u00e9 qui "
      "visualise les courants de vent en temps r\u00e9el, les conditions "
      "m\u00e9t\u00e9orologiques et les courants oc\u00e9aniques. Faites tourner le globe, "
      "zoomez sur n'importe quelle r\u00e9gion et observez les flux d'air anim\u00e9s "
      "fascinants.\n\n"
      "Aliment\u00e9 par des pr\u00e9visions de supercalculateurs mises \u00e0 jour toutes "
      "les trois heures, ce globe interactif utilise des donn\u00e9es atmosph\u00e9riques "
      "du Global Forecast System de NOAA et des donn\u00e9es oc\u00e9aniques d'OSCAR. "
      "Cr\u00e9\u00e9 par Cameron Beccario, le projet transforme des t\u00e9raoctets de "
      "donn\u00e9es scientifiques en une animation captivante en temps r\u00e9el."
    ),
    'controls': (
      "Cliquez et faites glisser pour faire tourner le globe. D\u00e9filez pour zoomer. "
      "Cliquez n'importe o\u00f9 pour voir la vitesse du vent, la temp\u00e9rature et les "
      'coordonn\u00e9es locales. Utilisez le menu (texte "earth" en bas \u00e0 gauche) '
      "pour changer de couche atmosph\u00e9rique."
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera de Google',
    'description': (
      "Cr\u00e9ez votre propre chef-d'\u0153uvre op\u00e9ratique avec quatre adorables "
      "blobs chanteurs propuls\u00e9s par l'apprentissage automatique dans cette "
      "exp\u00e9rience Google Arts & Culture de David Li. Faites glisser les blobs de "
      "haut en bas pour changer la hauteur, de gauche \u00e0 droite pour changer les "
      "sons de voyelles.\n\n"
      "Cr\u00e9\u00e9 par l'artiste et programmeur David Li en collaboration avec quatre "
      "vrais chanteurs d'op\u00e9ra, Blob Opera utilise l'apprentissage automatique "
      "entra\u00een\u00e9 sur leurs voix r\u00e9elles pour g\u00e9n\u00e9rer des "
      "harmonies r\u00e9alistes. Il a remport\u00e9 un prix Webby et est devenu l'une "
      "des exp\u00e9riences les plus virales de Google Arts & Culture."
    ),
    'controls': (
      "Cliquez et faites glisser l'un des quatre blobs de haut en bas pour changer sa "
      "hauteur. Faites glisser de gauche \u00e0 droite pour changer le son de voyelle "
      "qu'ils chantent. Les trois autres blobs s'harmonisent automatiquement gr\u00e2ce "
      "\u00e0 l'apprentissage automatique. Appuyez sur le bouton d'enregistrement pour "
      "capturer votre performance."
    ),
  },
}

# ── GERMAN ──
GAMES['de'] = {
  'quick-draw': {
    'title': 'Quick, Draw! von Google',
    'description': (
      'Kann ein neuronales Netzwerk lernen, deine Kritzeleien zu erkennen? Quick, Draw! '
      'ist Googles KI-Experiment, das dich herausfordert, allt\u00e4gliche Objekte in '
      'unter 20 Sekunden zu zeichnen, w\u00e4hrend ein Machine-Learning-Modell in '
      'Echtzeit versucht zu erraten, was du zeichnest.\n\n'
      'Quick, Draw! wurde als KI-Experiment entwickelt, um Googles neuronales Netzwerk '
      'bei der Erkennung handgezeichneter Bilder zu trainieren. Jede Kritzelei, die '
      'Spieler einreichen, wird Teil eines riesigen Open-Source-Datensatzes, den Forscher '
      'weltweit nutzen, um Machine-Learning-Modelle zu verbessern.'
    ),
    'controls': (
      'Dir wird ein Wort gegeben und du hast 20 Sekunden, es mit der Maus oder dem Finger '
      'zu zeichnen. Beginne sofort zu zeichnen, wenn der Timer startet \u2014 die KI '
      'analysiert deine Striche in Echtzeit und ruft ihre Vermutungen. Wenn sie richtig '
      'r\u00e4t, geht es zum n\u00e4chsten Wort. Sechs Runden insgesamt.'
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 Wind- & Wetterkarte',
    'description': (
      'Erkunde den gesamten Planeten auf einem wundersch\u00f6n animierten 3D-Globus, '
      'der Windmuster in Echtzeit, Wetterbedingungen und Meeresstr\u00f6mungen '
      'visualisiert. Drehe den Globus, zoome in jede Region und beobachte die '
      'faszinierenden animierten Luftstr\u00f6me.\n\n'
      'Angetrieben von Supercomputer-Vorhersagen, die alle drei Stunden aktualisiert '
      'werden, nutzt dieser interaktive Globus atmosph\u00e4rische Daten des Global '
      'Forecast System der NOAA und Ozeandaten von OSCAR. Erstellt von Cameron Beccario, '
      'verwandelt das Projekt Terabytes wissenschaftlicher Daten in eine endlos '
      'faszinierende Echtzeit-Animation.'
    ),
    'controls': (
      'Klicke und ziehe, um den Globus zu drehen. Scrolle zum Zoomen. Klicke irgendwo, '
      'um lokale Windgeschwindigkeit, Temperatur und Koordinaten zu sehen. Verwende das '
      'Men\u00fc (Text "earth" unten links), um zwischen atmosph\u00e4rischen Schichten '
      'zu wechseln.'
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera von Google',
    'description': (
      'Erstelle dein eigenes ML-gest\u00fctztes Opern-Meisterwerk mit vier entz\u00fcckenden '
      'singenden Blobs in diesem Google Arts & Culture Experiment von David Li. Ziehe die '
      'Blobs hoch und runter, um die Tonh\u00f6he zu \u00e4ndern, links und rechts, um die '
      'Vokalklänge zu \u00e4ndern.\n\n'
      'Erstellt vom K\u00fcnstler und Programmierer David Li in Zusammenarbeit mit vier '
      'echten Operns\u00e4ngern, nutzt Blob Opera maschinelles Lernen, das auf ihren '
      'tats\u00e4chlichen Stimmen trainiert wurde, um realistische Harmonien zu erzeugen. '
      'Es gewann einen Webby Award und wurde eines der viralsten Experimente von Google '
      'Arts & Culture.'
    ),
    'controls': (
      'Klicke und ziehe einen der vier Blobs hoch oder runter, um seine Tonh\u00f6he zu '
      '\u00e4ndern. Ziehe links und rechts, um den Vokalklang zu \u00e4ndern, den sie '
      'singen. Die anderen drei Blobs harmonisieren automatisch durch maschinelles Lernen. '
      'Dr\u00fccke den Aufnahmeknopf, um deine Performance aufzunehmen.'
    ),
  },
}

# ── ITALIAN ──
GAMES['it'] = {
  'quick-draw': {
    'title': 'Quick, Draw! di Google',
    'description': (
      "Una rete neurale pu\u00f2 imparare a riconoscere i tuoi scarabocchi? Quick, Draw! "
      "\u00e8 l'esperimento di IA di Google che ti sfida a disegnare oggetti di tutti i "
      "giorni in meno di 20 secondi mentre un modello di apprendimento automatico cerca di "
      "indovinare cosa stai disegnando in tempo reale.\n\n"
      "Quick, Draw! \u00e8 stato creato come esperimento di IA per aiutare a formare la rete "
      "neurale di Google nel riconoscimento di immagini disegnate a mano. Ogni scarabocchio "
      "inviato dai giocatori diventa parte di un enorme dataset open source utilizzato da "
      "ricercatori di tutto il mondo."
    ),
    'controls': (
      "Ti viene data una parola e 20 secondi per disegnarla con il mouse o il dito. Inizia "
      "a disegnare appena parte il timer \u2014 l'IA analizza i tuoi tratti in tempo reale "
      "e grida le sue ipotesi. Se indovina correttamente, passi alla parola successiva. Sei "
      "turni in totale."
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 Mappa Vento e Meteo',
    'description': (
      "Esplora l'intero pianeta su un bellissimo globo 3D animato che visualizza i modelli "
      "di vento in tempo reale, le condizioni meteo e le correnti oceaniche. Gira il globo, "
      "ingrandisci qualsiasi regione e osserva le ipnotiche correnti d'aria animate.\n\n"
      "Alimentato da previsioni di supercomputer aggiornate ogni tre ore, questo globo "
      "interattivo utilizza dati atmosferici dal Global Forecast System della NOAA e dati "
      "oceanici da OSCAR. Creato da Cameron Beccario, il progetto trasforma terabyte di "
      "dati scientifici in un'animazione affascinante in tempo reale."
    ),
    'controls': (
      'Clicca e trascina per ruotare il globo. Scorri per ingrandire e rimpicciolire. '
      'Clicca ovunque per vedere velocit\u00e0 del vento, temperatura e coordinate locali. '
      'Usa il menu (testo "earth" in basso a sinistra) per cambiare tra i livelli '
      'atmosferici.'
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera di Google',
    'description': (
      "Crea il tuo capolavoro operistico alimentato dal ML con quattro adorabili blob "
      "cantanti in questo esperimento Google Arts & Culture di David Li. Trascina i blob "
      "su e gi\u00f9 per cambiare l'intonazione, sinistra e destra per cambiare i suoni "
      "vocalici.\n\n"
      "Creato dall'artista e programmatore David Li in collaborazione con quattro veri "
      "cantanti d'opera, Blob Opera utilizza l'apprendimento automatico addestrato sulle "
      "loro voci reali per generare armonie realistiche. Ha vinto un premio Webby ed \u00e8 "
      "diventato uno degli esperimenti pi\u00f9 virali di Google Arts & Culture."
    ),
    'controls': (
      "Clicca e trascina uno dei quattro blob su o gi\u00f9 per cambiarne l'intonazione. "
      "Trascina sinistra e destra per cambiare il suono vocalico che cantano. Gli altri tre "
      "blob si armonizzano automaticamente usando l'apprendimento automatico. Premi il "
      "pulsante di registrazione per catturare la tua esibizione."
    ),
  },
}

# ── PORTUGUESE ──
GAMES['pt'] = {
  'quick-draw': {
    'title': 'Quick, Draw! do Google',
    'description': (
      'Uma rede neural pode aprender a reconhecer seus rabiscos? Quick, Draw! \u00e9 o '
      'experimento de IA do Google que desafia voc\u00ea a desenhar objetos do cotidiano '
      'em menos de 20 segundos enquanto um modelo de aprendizado de m\u00e1quina tenta '
      'adivinhar o que voc\u00ea est\u00e1 desenhando em tempo real.\n\n'
      'Quick, Draw! foi criado como um experimento de IA para ajudar a treinar a rede '
      'neural do Google em reconhecimento de imagens desenhadas \u00e0 m\u00e3o. Cada '
      'rabisco enviado pelos jogadores se torna parte de um enorme conjunto de dados de '
      'c\u00f3digo aberto usado por pesquisadores do mundo todo.'
    ),
    'controls': (
      'Voc\u00ea recebe uma palavra e tem 20 segundos para desenh\u00e1-la com o mouse ou '
      'o dedo. Comece a desenhar assim que o timer come\u00e7ar \u2014 a IA analisa seus '
      'tra\u00e7os em tempo real e grita seus palpites. Se ela acertar, voc\u00ea avan\u00e7a '
      'para a pr\u00f3xima palavra. Seis rodadas no total.'
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 Mapa de Vento e Clima',
    'description': (
      'Explore o planeta inteiro em um lindo globo 3D animado que visualiza padr\u00f5es '
      'de vento em tempo real, condi\u00e7\u00f5es clim\u00e1ticas e correntes '
      'oce\u00e2nicas. Gire o globo, amplie qualquer regi\u00e3o e observe os '
      'hipn\u00f3ticos fluxos de ar animados.\n\n'
      'Alimentado por previs\u00f5es de supercomputadores atualizadas a cada tr\u00eas '
      'horas, este globo interativo utiliza dados atmosf\u00e9ricos do Global Forecast '
      'System da NOAA e dados oce\u00e2nicos do OSCAR. Criado por Cameron Beccario, o '
      'projeto transforma terabytes de dados cient\u00edficos em uma anima\u00e7\u00e3o '
      'fascinante em tempo real.'
    ),
    'controls': (
      'Clique e arraste para girar o globo. Role para aproximar e afastar. Clique em '
      'qualquer lugar para ver velocidade do vento, temperatura e coordenadas locais. '
      'Use o menu (texto "earth" no canto inferior esquerdo) para alternar entre as '
      'camadas atmosf\u00e9ricas.'
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera do Google',
    'description': (
      'Crie sua pr\u00f3pria obra-prima oper\u00edstica com quatro ador\u00e1veis blobs '
      'cantantes impulsionados por aprendizado de m\u00e1quina neste experimento do Google '
      'Arts & Culture de David Li. Arraste os blobs para cima e para baixo para mudar o '
      'tom, esquerda e direita para mudar os sons vocais.\n\n'
      'Criado pelo artista e programador David Li em colabora\u00e7\u00e3o com quatro '
      'cantores de \u00f3pera reais, Blob Opera usa aprendizado de m\u00e1quina treinado '
      'em suas vozes reais para gerar harmonias realistas. Ganhou um pr\u00eamio Webby e '
      'se tornou um dos experimentos mais virais do Google Arts & Culture.'
    ),
    'controls': (
      'Clique e arraste qualquer um dos quatro blobs para cima ou para baixo para mudar '
      'o tom. Arraste esquerda e direita para mudar o som vocal que cantam. Os outros '
      'tr\u00eas blobs se harmonizam automaticamente usando aprendizado de m\u00e1quina. '
      'Pressione o bot\u00e3o de grava\u00e7\u00e3o para capturar sua performance.'
    ),
  },
}

# ── RUSSIAN ──
GAMES['ru'] = {
  'quick-draw': {
    'title': 'Quick, Draw! \u043e\u0442 Google',
    'description': (
      '\u041c\u043e\u0436\u0435\u0442 \u043b\u0438 \u043d\u0435\u0439\u0440\u043e\u043d'
      '\u043d\u0430\u044f \u0441\u0435\u0442\u044c \u043d\u0430\u0443\u0447\u0438\u0442'
      '\u044c\u0441\u044f \u0440\u0430\u0441\u043f\u043e\u0437\u043d\u0430\u0432\u0430'
      '\u0442\u044c \u0432\u0430\u0448\u0438 \u0440\u0438\u0441\u0443\u043d\u043a\u0438? '
      'Quick, Draw! \u2014 \u044d\u0442\u043e \u044d\u043a\u0441\u043f\u0435\u0440\u0438'
      '\u043c\u0435\u043d\u0442 Google \u0441 \u0418\u0418, \u043a\u043e\u0442\u043e\u0440'
      '\u044b\u0439 \u0431\u0440\u043e\u0441\u0430\u0435\u0442 \u0432\u0430\u043c '
      '\u0432\u044b\u0437\u043e\u0432 \u043d\u0430\u0440\u0438\u0441\u043e\u0432\u0430'
      '\u0442\u044c \u043e\u0431\u044b\u0447\u043d\u044b\u0435 \u043f\u0440\u0435\u0434'
      '\u043c\u0435\u0442\u044b \u0437\u0430 20 \u0441\u0435\u043a\u0443\u043d\u0434.'
      '\n\nQuick, Draw! \u0431\u044b\u043b \u0441\u043e\u0437\u0434\u0430\u043d \u043a'
      '\u0430\u043a \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442 '
      '\u0441 \u0418\u0418 \u0434\u043b\u044f \u043e\u0431\u0443\u0447\u0435\u043d\u0438'
      '\u044f \u043d\u0435\u0439\u0440\u043e\u043d\u043d\u043e\u0439 \u0441\u0435\u0442'
      '\u0438 Google.'
    ),
    'controls': (
      '\u0412\u0430\u043c \u0434\u0430\u044e\u0442 \u0441\u043b\u043e\u0432\u043e \u0438 '
      '20 \u0441\u0435\u043a\u0443\u043d\u0434, \u0447\u0442\u043e\u0431\u044b '
      '\u043d\u0430\u0440\u0438\u0441\u043e\u0432\u0430\u0442\u044c \u0435\u0433\u043e '
      '\u043c\u044b\u0448\u044c\u044e \u0438\u043b\u0438 \u043f\u0430\u043b\u044c\u0446'
      '\u0435\u043c. \u041d\u0430\u0447\u0438\u043d\u0430\u0439\u0442\u0435 \u0440\u0438'
      '\u0441\u043e\u0432\u0430\u0442\u044c, \u043a\u0430\u043a \u0442\u043e\u043b\u044c'
      '\u043a\u043e \u0437\u0430\u043f\u0443\u0441\u0442\u0438\u0442\u0441\u044f '
      '\u0442\u0430\u0439\u043c\u0435\u0440. \u0412\u0441\u0435\u0433\u043e \u0448\u0435'
      '\u0441\u0442\u044c \u0440\u0430\u0443\u043d\u0434\u043e\u0432.'
    ),
  },
  'google-earth-flight-simulator': {
    'title': 'Earth \u2014 \u041a\u0430\u0440\u0442\u0430 \u0432\u0435\u0442\u0440\u043e\u0432 \u0438 \u043f\u043e\u0433\u043e\u0434\u044b',
    'description': (
      '\u0418\u0441\u0441\u043b\u0435\u0434\u0443\u0439\u0442\u0435 \u0432\u0441\u044e '
      '\u043f\u043b\u0430\u043d\u0435\u0442\u0443 \u043d\u0430 \u043a\u0440\u0430\u0441'
      '\u0438\u0432\u043e\u043c \u0430\u043d\u0438\u043c\u0438\u0440\u043e\u0432\u0430'
      '\u043d\u043d\u043e\u043c 3D-\u0433\u043b\u043e\u0431\u0443\u0441\u0435, '
      '\u0432\u0438\u0437\u0443\u0430\u043b\u0438\u0437\u0438\u0440\u0443\u044e\u0449'
      '\u0435\u043c \u043f\u0430\u0442\u0442\u0435\u0440\u043d\u044b \u0432\u0435\u0442'
      '\u0440\u0430 \u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e\u043c '
      '\u0432\u0440\u0435\u043c\u0435\u043d\u0438.\n\n'
      '\u0421\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0439 \u041a\u044d\u043c\u0435'
      '\u0440\u043e\u043d\u043e\u043c \u0411\u0435\u043a\u043a\u0430\u0440\u0438\u043e, '
      '\u043f\u0440\u043e\u0435\u043a\u0442 \u043f\u0440\u0435\u0432\u0440\u0430\u0449'
      '\u0430\u0435\u0442 \u0442\u0435\u0440\u0430\u0431\u0430\u0439\u0442\u044b '
      '\u043d\u0430\u0443\u0447\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445 '
      '\u0432 \u0430\u043d\u0438\u043c\u0430\u0446\u0438\u044e.'
    ),
    'controls': (
      '\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0438 \u043f\u0435\u0440\u0435\u0442'
      '\u0430\u0449\u0438\u0442\u0435 \u0434\u043b\u044f \u0432\u0440\u0430\u0449\u0435'
      '\u043d\u0438\u044f \u0433\u043b\u043e\u0431\u0443\u0441\u0430. '
      '\u041f\u0440\u043e\u043a\u0440\u0443\u0442\u0438\u0442\u0435 \u0434\u043b\u044f '
      '\u043c\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043e\u0432\u0430\u043d'
      '\u0438\u044f. \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 '
      '\u043c\u0435\u043d\u044e (\u0442\u0435\u043a\u0441\u0442 "earth" \u0432\u043d\u0438'
      '\u0437\u0443 \u0441\u043b\u0435\u0432\u0430) \u0434\u043b\u044f \u043f\u0435\u0440'
      '\u0435\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f \u043c\u0435\u0436\u0434'
      '\u0443 \u0441\u043b\u043e\u044f\u043c\u0438.'
    ),
  },
  'blob-opera': {
    'title': 'Blob Opera \u043e\u0442 Google',
    'description': (
      '\u0421\u043e\u0437\u0434\u0430\u0439\u0442\u0435 \u0441\u043e\u0431\u0441\u0442'
      '\u0432\u0435\u043d\u043d\u044b\u0439 \u043e\u043f\u0435\u0440\u043d\u044b\u0439 '
      '\u0448\u0435\u0434\u0435\u0432\u0440 \u0441 \u0447\u0435\u0442\u044b\u0440\u044c'
      '\u043c\u044f \u043e\u0447\u0430\u0440\u043e\u0432\u0430\u0442\u0435\u043b\u044c'
      '\u043d\u044b\u043c\u0438 \u043f\u043e\u044e\u0449\u0438\u043c\u0438 \u0431\u043b'
      '\u043e\u0431\u0430\u043c\u0438 \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 '
      '\u043c\u0430\u0448\u0438\u043d\u043d\u043e\u0433\u043e \u043e\u0431\u0443\u0447'
      '\u0435\u043d\u0438\u044f.\n\n'
      '\u041e\u043d \u043f\u043e\u043b\u0443\u0447\u0438\u043b \u043f\u0440\u0435\u043c'
      '\u0438\u044e Webby \u0438 \u0441\u0442\u0430\u043b \u043e\u0434\u043d\u0438\u043c '
      '\u0438\u0437 \u0441\u0430\u043c\u044b\u0445 \u0432\u0438\u0440\u0443\u0441\u043d'
      '\u044b\u0445 \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442'
      '\u043e\u0432 Google Arts & Culture.'
    ),
    'controls': (
      '\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0438 \u043f\u0435\u0440\u0435\u0442'
      '\u0430\u0449\u0438\u0442\u0435 \u043b\u044e\u0431\u043e\u0433\u043e \u0438\u0437 '
      '\u0447\u0435\u0442\u044b\u0440\u0451\u0445 \u0431\u043b\u043e\u0431\u043e\u0432 '
      '\u0432\u0432\u0435\u0440\u0445 \u0438\u043b\u0438 \u0432\u043d\u0438\u0437. '
      '\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043a\u043d\u043e\u043f\u043a\u0443 '
      '\u0437\u0430\u043f\u0438\u0441\u0438 \u0434\u043b\u044f \u0441\u043e\u0445\u0440'
      '\u0430\u043d\u0435\u043d\u0438\u044f \u0432\u044b\u0441\u0442\u0443\u043f\u043b'
      '\u0435\u043d\u0438\u044f.'
    ),
  },
}

# ── ARABIC ──
GAMES['ar'] = {
  'quick-draw': {
    'title': 'Quick, Draw! من جوجل',
    'description': 'هل يمكن لشبكة عصبية أن تتعلم التعرف على رسوماتك؟ Quick, Draw! هي تجربة ذكاء اصطناعي من جوجل تتحداك لرسم أشياء يومية في أقل من 20 ثانية بينما يحاول نموذج التعلم الآلي تخمين ما ترسمه في الوقت الفعلي.\n\nتم إنشاء Quick, Draw! كتجربة ذكاء اصطناعي للمساعدة في تدريب شبكة جوجل العصبية على التعرف على الصور المرسومة يدوياً.',
    'controls': 'يُعطى لك كلمة و20 ثانية لرسمها باستخدام الماوس أو الإصبع. ابدأ بالرسم فور بدء المؤقت — يحلل الذكاء الاصطناعي خطوطك في الوقت الفعلي ويصرخ بتخميناته. إذا خمّن بشكل صحيح، تنتقل للكلمة التالية. ست جولات إجمالاً.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — خريطة الرياح والطقس',
    'description': 'استكشف الكوكب بأكمله على كرة أرضية ثلاثية الأبعاد متحركة تعرض أنماط الرياح في الوقت الفعلي وظروف الطقس وتيارات المحيط. أدر الكرة الأرضية، قرّب أي منطقة وشاهد تدفقات الهواء المتحركة الساحرة.\n\nمدعوم بتنبؤات الحواسيب الفائقة المحدثة كل ثلاث ساعات. أنشأه كاميرون بيكاريو لتحويل تيرابايت من البيانات العلمية إلى رسوم متحركة ساحرة في الوقت الفعلي.',
    'controls': 'انقر واسحب لتدوير الكرة الأرضية. مرر للتقريب والتبعيد. انقر في أي مكان لرؤية سرعة الرياح ودرجة الحرارة والإحداثيات المحلية. استخدم القائمة (نص "earth" أسفل اليسار) للتبديل بين الطبقات الجوية.',
  },
  'blob-opera': {
    'title': 'بلوب أوبرا من جوجل',
    'description': 'أنشئ تحفتك الأوبرالية الخاصة مع أربعة كائنات غنائية لطيفة مدعومة بالتعلم الآلي في هذه التجربة من Google Arts & Culture لـ David Li.\n\nفاز بجائزة Webby وأصبح من أكثر تجارب Google Arts & Culture انتشاراً.',
    'controls': 'انقر واسحب أياً من الكائنات الأربعة لأعلى أو لأسفل لتغيير نغمتها. اسحب لليسار واليمين لتغيير صوت الحرف المتحرك الذي تغنيه. تتناغم الكائنات الثلاثة الأخرى تلقائياً باستخدام التعلم الآلي. اضغط زر التسجيل لحفظ أدائك.',
  },
}

# ── HINDI ──
GAMES['hi'] = {
  'quick-draw': {
    'title': 'Quick, Draw! गूगल का',
    'description': 'क्या एक न्यूरल नेटवर्क आपके स्केच पहचानना सीख सकता है? Quick, Draw! गूगल का AI प्रयोग है जो आपको 20 सेकंड में रोज़मर्रा की वस्तुएं बनाने की चुनौती देता है।\n\nQuick, Draw! को गूगल के न्यूरल नेटवर्क को हाथ से बनाई गई छवियों की पहचान में प्रशिक्षित करने के लिए बनाया गया था।',
    'controls': 'आपको एक शब्द दिया जाता है और माउस या उंगली से इसे बनाने के लिए 20 सेकंड मिलते हैं। टाइमर शुरू होते ही बनाना शुरू करें — AI रीयल टाइम में आपके स्ट्रोक का विश्लेषण करता है। कुल छह राउंड।',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — हवा और मौसम मानचित्र',
    'description': 'एक सुंदर एनिमेटेड 3D ग्लोब पर पूरे ग्रह का अन्वेषण करें जो रीयल-टाइम हवा के पैटर्न, मौसम की स्थिति और समुद्री धाराओं को विज़ुअलाइज़ करता है।\n\nहर तीन घंटे अपडेट होने वाले सुपरकंप्यूटर पूर्वानुमानों द्वारा संचालित। कैमरन बेकारियो द्वारा बनाया गया।',
    'controls': 'ग्लोब घुमाने के लिए क्लिक करें और खींचें। ज़ूम करने के लिए स्क्रॉल करें। हवा की गति, तापमान और निर्देशांक देखने के लिए कहीं भी क्लिक करें। वायुमंडलीय परतों के बीच स्विच करने के लिए मेनू का उपयोग करें।',
  },
  'blob-opera': {
    'title': 'ब्लॉब ऑपेरा गूगल का',
    'description': 'David Li के इस Google Arts & Culture प्रयोग में चार प्यारे गाने वाले ब्लॉब्स के साथ अपनी खुद की ML-संचालित ऑपेरा रचना बनाएं।\n\nइसने Webby Award जीता और Google Arts & Culture के सबसे वायरल प्रयोगों में से एक बन गया।',
    'controls': 'किसी भी चार ब्लॉब को ऊपर या नीचे खींचकर उसकी पिच बदलें। बाएं और दाएं खींचकर स्वर ध्वनि बदलें। अन्य तीन ब्लॉब मशीन लर्निंग का उपयोग करके स्वचालित रूप से सामंजस्य बनाते हैं। अपना प्रदर्शन कैप्चर करने के लिए रिकॉर्ड बटन दबाएं।',
  },
}

# ── DUTCH ──
GAMES['nl'] = {
  'quick-draw': {
    'title': 'Quick, Draw! van Google',
    'description': 'Kan een neuraal netwerk leren je tekeningen te herkennen? Quick, Draw! is Googles AI-experiment dat je uitdaagt om alledaagse voorwerpen te tekenen in minder dan 20 seconden terwijl een machine learning-model in real-time probeert te raden wat je tekent.\n\nQuick, Draw! werd gecreëerd als een AI-experiment om Googles neurale netwerk te helpen trainen in het herkennen van handgetekende afbeeldingen.',
    'controls': 'Je krijgt een woord en 20 seconden om het te tekenen met je muis of vinger. Begin te tekenen zodra de timer start — de AI analyseert je streken in real-time en roept zijn gissingen. Als het correct raadt, ga je naar het volgende woord. Zes rondes in totaal.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Wind- & Weerkaart',
    'description': 'Verken de hele planeet op een prachtig geanimeerde 3D-bol die windpatronen in real-time, weersomstandigheden en oceaanstromingen visualiseert. Draai de bol, zoom in op elke regio en bekijk de betoverende geanimeerde luchtstromen.\n\nAangedreven door supercomputervoorspellingen die elke drie uur worden bijgewerkt. Gemaakt door Cameron Beccario.',
    'controls': 'Klik en sleep om de bol te draaien. Scroll om in en uit te zoomen. Klik ergens om lokale windsnelheid, temperatuur en coördinaten te zien. Gebruik het menu ("earth" tekst linksonder) om te wisselen tussen atmosferische lagen.',
  },
  'blob-opera': {
    'title': 'Blob Opera van Google',
    'description': 'Creëer je eigen ML-aangedreven opera-meesterwerk met vier schattige zingende blobs in dit Google Arts & Culture experiment van David Li.\n\nHet won een Webby Award en werd een van de meest virale experimenten van Google Arts & Culture.',
    'controls': 'Klik en sleep een van de vier blobs omhoog of omlaag om de toonhoogte te veranderen. Sleep links en rechts om het klinkergeluid te veranderen. De andere drie blobs harmoniseren automatisch met machine learning. Druk op de opnameknop om je optreden vast te leggen.',
  },
}

# ── POLISH ──
GAMES['pl'] = {
  'quick-draw': {
    'title': 'Quick, Draw! od Google',
    'description': 'Czy sieć neuronowa może nauczyć się rozpoznawać Twoje rysunki? Quick, Draw! to eksperyment AI Google, który rzuca Ci wyzwanie narysowania codziennych przedmiotów w mniej niż 20 sekund.\n\nQuick, Draw! został stworzony jako eksperyment AI, aby pomóc w trenowaniu sieci neuronowej Google w rozpoznawaniu ręcznie rysowanych obrazów.',
    'controls': 'Dostajesz słowo i 20 sekund na narysowanie go myszą lub palcem. Zacznij rysować, gdy timer wystartuje — AI analizuje Twoje kreski w czasie rzeczywistym i wykrzykuje swoje domysły. Sześć rund łącznie.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Mapa wiatrów i pogody',
    'description': 'Odkrywaj całą planetę na pięknie animowanym globusie 3D, który wizualizuje wzorce wiatru w czasie rzeczywistym, warunki pogodowe i prądy oceaniczne.\n\nStworzony przez Camerona Beccario, projekt przekształca terabajty danych naukowych w fascynującą animację w czasie rzeczywistym.',
    'controls': 'Kliknij i przeciągnij, aby obrócić globus. Przewiń, aby przybliżyć i oddalić. Kliknij gdziekolwiek, aby zobaczyć lokalną prędkość wiatru, temperaturę i współrzędne. Użyj menu (tekst "earth" w lewym dolnym rogu), aby przełączać między warstwami atmosferycznymi.',
  },
  'blob-opera': {
    'title': 'Blob Opera od Google',
    'description': 'Stwórz własne arcydzieło operowe z czterema uroczymi śpiewającymi blobami napędzanymi uczeniem maszynowym w tym eksperymencie Google Arts & Culture Davida Li.\n\nZdobył nagrodę Webby i stał się jednym z najbardziej viralowych eksperymentów Google Arts & Culture.',
    'controls': 'Kliknij i przeciągnij dowolnego z czterech blobów w górę lub w dół, aby zmienić tonację. Przeciągnij w lewo i w prawo, aby zmienić dźwięk samogłoski. Pozostałe trzy bloby harmonizują automatycznie za pomocą uczenia maszynowego. Naciśnij przycisk nagrywania, aby zapisać swój występ.',
  },
}

# ── INDONESIAN ──
GAMES['id'] = {
  'quick-draw': {
    'title': 'Quick, Draw! dari Google',
    'description': 'Bisakah jaringan saraf belajar mengenali coretanmu? Quick, Draw! adalah eksperimen AI Google yang menantangmu menggambar objek sehari-hari dalam waktu kurang dari 20 detik sementara model machine learning mencoba menebak gambarmu secara real-time.\n\nQuick, Draw! dibuat sebagai eksperimen AI untuk membantu melatih jaringan saraf Google dalam pengenalan gambar tangan.',
    'controls': 'Kamu diberi kata dan 20 detik untuk menggambarnya dengan mouse atau jari. Mulai menggambar saat timer dimulai — AI menganalisis goresanmu secara real-time dan meneriakkan tebakannya. Jika benar, kamu lanjut ke kata berikutnya. Enam ronde total.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Peta Angin & Cuaca',
    'description': 'Jelajahi seluruh planet di globe 3D animasi yang memvisualisasikan pola angin real-time, kondisi cuaca, dan arus laut. Putar globe, perbesar wilayah mana saja, dan saksikan aliran udara animasi yang memukau.\n\nDidukung oleh prakiraan superkomputer yang diperbarui setiap tiga jam. Dibuat oleh Cameron Beccario.',
    'controls': 'Klik dan seret untuk memutar globe. Scroll untuk memperbesar dan memperkecil. Klik di mana saja untuk melihat kecepatan angin lokal, suhu, dan koordinat. Gunakan menu (teks "earth" kiri bawah) untuk beralih antar lapisan atmosfer.',
  },
  'blob-opera': {
    'title': 'Blob Opera dari Google',
    'description': 'Buat mahakarya opera kamu sendiri dengan empat blob penyanyi menggemaskan yang didukung machine learning dalam eksperimen Google Arts & Culture oleh David Li.\n\nMemenangkan Webby Award dan menjadi salah satu eksperimen paling viral Google Arts & Culture.',
    'controls': 'Klik dan seret salah satu dari empat blob ke atas atau ke bawah untuk mengubah nada. Seret ke kiri dan kanan untuk mengubah suara vokal. Tiga blob lainnya berharmoni secara otomatis menggunakan machine learning. Tekan tombol rekam untuk menyimpan pertunjukanmu.',
  },
}

# ── JAPANESE ──
GAMES['ja'] = {
  'quick-draw': {
    'title': 'Quick, Draw!（Google）',
    'description': 'ニューラルネットワークはあなたの落書きを認識できるでしょうか？Quick, Draw!はGoogleのAI実験で、20秒以内に日常のオブジェクトを描くチャレンジです。機械学習モデルがリアルタイムであなたの絵を推測します。\n\nQuick, Draw!はGoogleのニューラルネットワークを手描き画像認識で訓練するためのAI実験として作られました。',
    'controls': 'お題の単語が表示され、マウスや指で20秒以内に描きます。タイマーが始まったらすぐに描き始めてください — AIがリアルタイムであなたのストロークを分析し推測を叫びます。正解なら次のお題へ。全6ラウンド。',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — 風と天気マップ',
    'description': 'リアルタイムの風のパターン、気象条件、海流を美しくアニメーション化した3Dグローブで地球全体を探索しましょう。グローブを回転させ、任意の地域にズームして、魅惑的な空気の流れのアニメーションを観察できます。\n\n3時間ごとに更新されるスーパーコンピューターの予報に基づいています。Cameron Beccaroが作成。',
    'controls': 'クリック＆ドラッグでグローブを回転。スクロールでズーム。任意の場所をクリックして風速、気温、座標を確認。メニュー（左下の"earth"テキスト）で大気層を切り替え。',
  },
  'blob-opera': {
    'title': 'Blob Opera（Google）',
    'description': 'David LiによるGoogle Arts & Cultureの実験で、4体の愛らしい歌うブロブとMLパワードのオペラ傑作を作りましょう。ブロブを上下にドラッグしてピッチを、左右にドラッグして母音の音を変えます。\n\nWebby Awardを受賞し、Google Arts & Cultureで最もバイラルな実験の一つとなりました。',
    'controls': '4体のブロブのいずれかを上下にクリック＆ドラッグしてピッチを変更。左右にドラッグして母音サウンドを変更。他の3体は機械学習で自動的にハーモニーを奏でます。録音ボタンでパフォーマンスを保存。',
  },
}

# ── KOREAN ──
GAMES['ko'] = {
  'quick-draw': {
    'title': 'Quick, Draw! (구글)',
    'description': '신경망이 당신의 낙서를 인식할 수 있을까요? Quick, Draw!는 구글의 AI 실험으로, 20초 안에 일상 사물을 그리는 동안 머신러닝 모델이 실시간으로 추측합니다.\n\nQuick, Draw!는 구글의 신경망을 손으로 그린 이미지 인식에 훈련시키기 위해 만들어졌습니다.',
    'controls': '단어가 주어지고 마우스나 손가락으로 20초 안에 그립니다. 타이머가 시작되면 바로 그리기 시작하세요 — AI가 실시간으로 획을 분석하고 추측을 외칩니다. 맞추면 다음 단어로 이동. 총 6라운드.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — 바람과 날씨 지도',
    'description': '실시간 바람 패턴, 기상 조건, 해류를 아름답게 시각화하는 3D 지구본에서 전 세계를 탐험하세요. 지구본을 돌리고, 원하는 지역을 확대하고, 매혹적인 공기 흐름 애니메이션을 감상하세요.\n\n3시간마다 업데이트되는 슈퍼컴퓨터 예보를 기반으로 합니다. Cameron Beccario가 제작.',
    'controls': '클릭 앤 드래그로 지구본 회전. 스크롤로 확대/축소. 아무 곳이나 클릭하여 풍속, 기온, 좌표 확인. 메뉴("earth" 텍스트, 좌하단)로 대기층 전환.',
  },
  'blob-opera': {
    'title': 'Blob Opera (구글)',
    'description': 'David Li의 Google Arts & Culture 실험에서 4개의 사랑스러운 노래하는 블롭으로 ML 기반 오페라 걸작을 만들어보세요.\n\nWebby Award를 수상하고 Google Arts & Culture에서 가장 바이럴한 실험 중 하나가 되었습니다.',
    'controls': '4개의 블롭 중 하나를 위아래로 드래그하여 피치를 변경. 좌우로 드래그하여 모음 사운드 변경. 나머지 3개 블롭이 머신러닝으로 자동 하모니. 녹음 버튼으로 퍼포먼스 저장.',
  },
}

# ── SWEDISH ──
GAMES['sv'] = {
  'quick-draw': {
    'title': 'Quick, Draw! från Google',
    'description': 'Kan ett neuralt nätverk lära sig känna igen dina klotter? Quick, Draw! är Googles AI-experiment som utmanar dig att rita vardagliga föremål på under 20 sekunder medan en maskininlärningsmodell försöker gissa vad du ritar i realtid.\n\nQuick, Draw! skapades som ett AI-experiment för att hjälpa till att träna Googles neurala nätverk på handritad bildigenkänning.',
    'controls': 'Du får ett ord och 20 sekunder att rita det med musen eller fingret. Börja rita så fort timern startar — AI:n analyserar dina streck i realtid och ropar ut sina gissningar. Om den gissar rätt går du vidare till nästa ord. Sex rundor totalt.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Vind- & väderkarta',
    'description': 'Utforska hela planeten på en vackert animerad 3D-glob som visualiserar vindmönster i realtid, väderförhållanden och havsströmmar. Snurra globen, zooma in på valfri region och se fascinerande animerade luftströmmar.\n\nDriven av superdatorprognoser som uppdateras var tredje timme. Skapad av Cameron Beccario.',
    'controls': 'Klicka och dra för att rotera globen. Scrolla för att zooma. Klicka var som helst för att se lokal vindhastighet, temperatur och koordinater. Använd menyn ("earth"-text nere till vänster) för att växla mellan atmosfäriska lager.',
  },
  'blob-opera': {
    'title': 'Blob Opera från Google',
    'description': 'Skapa ditt eget ML-drivna operamästerverk med fyra bedårande sjungande blobbar i detta Google Arts & Culture-experiment av David Li.\n\nVann ett Webby Award och blev ett av Google Arts & Cultures mest virala experiment.',
    'controls': 'Klicka och dra någon av de fyra blobbarna upp eller ner för att ändra tonhöjd. Dra vänster och höger för att ändra vokalljud. De andra tre blobbarna harmoniserar automatiskt med maskininlärning. Tryck på inspelningsknappen för att spara din föreställning.',
  },
}

# ── THAI ──
GAMES['th'] = {
  'quick-draw': {
    'title': 'Quick, Draw! จาก Google',
    'description': 'เครือข่ายประสาทเทียมสามารถเรียนรู้ที่จะจดจำภาพวาดของคุณได้หรือไม่? Quick, Draw! คือการทดลอง AI ของ Google ที่ท้าทายให้คุณวาดวัตถุในชีวิตประจำวันภายใน 20 วินาที ขณะที่โมเดล Machine Learning พยายามเดาว่าคุณกำลังวาดอะไรแบบเรียลไทม์\n\nQuick, Draw! สร้างขึ้นเพื่อช่วยฝึกเครือข่ายประสาทเทียมของ Google ในการจดจำภาพวาดด้วยมือ',
    'controls': 'คุณจะได้รับคำและมีเวลา 20 วินาทีในการวาดด้วยเมาส์หรือนิ้ว เริ่มวาดทันทีที่ตัวจับเวลาเริ่ม — AI วิเคราะห์เส้นของคุณแบบเรียลไทม์และตะโกนคำเดาของมัน ถ้าเดาถูก คุณจะไปยังคำถัดไป ทั้งหมดหกรอบ',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — แผนที่ลมและสภาพอากาศ',
    'description': 'สำรวจโลกทั้งใบบนลูกโลก 3D แอนิเมชันสวยงามที่แสดงรูปแบบลมแบบเรียลไทม์ สภาพอากาศ และกระแสน้ำมหาสมุทร หมุนลูกโลก ซูมเข้าไปในพื้นที่ใดก็ได้ และชมกระแสลมแอนิเมชันที่น่าหลงใหล\n\nขับเคลื่อนด้วยการพยากรณ์จากซูเปอร์คอมพิวเตอร์ที่อัพเดททุกสามชั่วโมง สร้างโดย Cameron Beccario',
    'controls': 'คลิกแล้วลากเพื่อหมุนลูกโลก เลื่อนเพื่อซูมเข้าออก คลิกที่ใดก็ได้เพื่อดูความเร็วลม อุณหภูมิ และพิกัดท้องถิ่น ใช้เมนู (ข้อความ "earth" ซ้ายล่าง) เพื่อสลับระหว่างชั้นบรรยากาศ',
  },
  'blob-opera': {
    'title': 'Blob Opera จาก Google',
    'description': 'สร้างผลงานชิ้นเอกโอเปร่าของคุณเองด้วย blob นักร้องน่ารักสี่ตัวที่ขับเคลื่อนด้วย Machine Learning ในการทดลอง Google Arts & Culture ของ David Li\n\nได้รับรางวัล Webby Award และกลายเป็นหนึ่งในการทดลองที่แพร่กระจายมากที่สุดของ Google Arts & Culture',
    'controls': 'คลิกแล้วลาก blob ใดก็ได้ขึ้นหรือลงเพื่อเปลี่ยนระดับเสียง ลากซ้ายและขวาเพื่อเปลี่ยนเสียงสระ blob อีกสามตัวจะประสานเสียงอัตโนมัติด้วย Machine Learning กดปุ่มบันทึกเพื่อบันทึกการแสดงของคุณ',
  },
}

# ── TURKISH ──
GAMES['tr'] = {
  'quick-draw': {
    'title': "Quick, Draw! Google'dan",
    'description': "Bir sinir ağı çizimlerinizi tanımayı öğrenebilir mi? Quick, Draw! Google'un yapay zeka deneyi olup, sizi 20 saniyeden kısa sürede günlük nesneler çizmeye davet ediyor. Bu sırada bir makine öğrenimi modeli ne çizdiğinizi gerçek zamanlı tahmin etmeye çalışıyor.\n\nQuick, Draw! Google'un sinir ağını el çizimi tanımada eğitmeye yardımcı olmak için oluşturuldu.",
    'controls': 'Size bir kelime verilir ve fare veya parmağınızla 20 saniyede çizmeniz gerekir. Zamanlayıcı başladığında çizmeye başlayın — yapay zeka çizgilerinizi gerçek zamanlı analiz eder ve tahminlerini bağırır. Doğru tahmin ederse sonraki kelimeye geçersiniz. Toplam altı tur.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Rüzgar ve Hava Haritası',
    'description': "Gerçek zamanlı rüzgar kalıplarını, hava koşullarını ve okyanus akıntılarını görselleştiren güzel animasyonlu 3D küre üzerinde tüm gezegeni keşfedin. Küreyi döndürün, herhangi bir bölgeye yakınlaşın ve büyüleyici animasyonlu hava akımlarını izleyin.\n\nÜç saatte bir güncellenen süper bilgisayar tahminleriyle desteklenmektedir. Cameron Beccario tarafından oluşturuldu.",
    'controls': 'Küreyi döndürmek için tıklayıp sürükleyin. Yakınlaşmak ve uzaklaşmak için kaydırın. Yerel rüzgar hızını, sıcaklığı ve koordinatları görmek için herhangi bir yere tıklayın. Atmosfer katmanları arasında geçiş yapmak için menüyü (sol alttaki "earth" metni) kullanın.',
  },
  'blob-opera': {
    'title': "Blob Opera Google'dan",
    'description': "David Li'nin bu Google Arts & Culture deneyinde makine öğrenimi destekli dört sevimli şarkı söyleyen blob ile kendi opera şaheserinizi yaratın.\n\nWebby Ödülü kazandı ve Google Arts & Culture'ın en viral deneylerinden biri oldu.",
    'controls': 'Dört blobdan herhangi birini yukarı veya aşağı sürükleyerek ses perdesini değiştirin. Sola ve sağa sürükleyerek ünlü sesini değiştirin. Diğer üç blob makine öğrenimi kullanarak otomatik olarak uyum sağlar. Performansınızı kaydetmek için kayıt düğmesine basın.',
  },
}

# ── VIETNAMESE ──
GAMES['vi'] = {
  'quick-draw': {
    'title': 'Quick, Draw! từ Google',
    'description': 'Mạng thần kinh có thể học nhận dạng hình vẽ nguệch ngoạc của bạn không? Quick, Draw! là thí nghiệm AI của Google thách thức bạn vẽ các vật thể hàng ngày trong dưới 20 giây trong khi mô hình machine learning cố gắng đoán bạn đang vẽ gì theo thời gian thực.\n\nQuick, Draw! được tạo ra để giúp huấn luyện mạng thần kinh của Google nhận dạng hình ảnh vẽ tay.',
    'controls': 'Bạn được cho một từ và 20 giây để vẽ bằng chuột hoặc ngón tay. Bắt đầu vẽ ngay khi bộ đếm thời gian bắt đầu — AI phân tích nét vẽ theo thời gian thực và hét lên dự đoán. Nếu đoán đúng, bạn chuyển sang từ tiếp theo. Tổng cộng sáu vòng.',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — Bản đồ Gió và Thời tiết',
    'description': 'Khám phá toàn bộ hành tinh trên quả địa cầu 3D hoạt hình đẹp mắt trực quan hóa mô hình gió thời gian thực, điều kiện thời tiết và dòng chảy đại dương. Xoay quả cầu, phóng to bất kỳ vùng nào và xem các dòng không khí hoạt hình mê hoặc.\n\nĐược hỗ trợ bởi dự báo siêu máy tính cập nhật mỗi ba giờ. Được tạo bởi Cameron Beccario.',
    'controls': 'Nhấp và kéo để xoay quả cầu. Cuộn để phóng to thu nhỏ. Nhấp bất kỳ đâu để xem tốc độ gió, nhiệt độ và tọa độ địa phương. Dùng menu (chữ "earth" góc trái dưới) để chuyển đổi giữa các tầng khí quyển.',
  },
  'blob-opera': {
    'title': 'Blob Opera từ Google',
    'description': 'Tạo kiệt tác opera ML của riêng bạn với bốn blob ca hát đáng yêu trong thí nghiệm Google Arts & Culture của David Li.\n\nĐoạt giải Webby Award và trở thành một trong những thí nghiệm lan truyền nhất của Google Arts & Culture.',
    'controls': 'Nhấp và kéo bất kỳ blob nào lên hoặc xuống để thay đổi cao độ. Kéo trái phải để thay đổi nguyên âm. Ba blob còn lại tự động hòa âm bằng machine learning. Nhấn nút ghi âm để lưu màn trình diễn.',
  },
}

# ── CHINESE SIMPLIFIED ──
GAMES['zh-CN'] = {
  'quick-draw': {
    'title': 'Quick, Draw!（谷歌）',
    'description': '神经网络能学会识别你的涂鸦吗？Quick, Draw! 是谷歌的 AI 实验，挑战你在 20 秒内画出日常物品，同时机器学习模型实时猜测你在画什么。\n\nQuick, Draw! 旨在帮助训练谷歌的神经网络进行手绘图像识别。',
    'controls': '你会得到一个词语，用鼠标或手指在 20 秒内画出来。计时器开始后立即画 —— AI 实时分析你的笔画并喊出猜测。猜对了就进入下一个词。共六轮。',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — 风与天气地图',
    'description': '在精美动画 3D 地球仪上探索整个星球，实时可视化风型、天气状况和洋流。旋转地球仪，缩放任何区域，观看迷人的动画气流。\n\n由每三小时更新一次的超级计算机预报驱动。由 Cameron Beccario 创建。',
    'controls': '点击拖动旋转地球仪。滚动缩放。点击任意位置查看当地风速、温度和坐标。使用菜单（左下角"earth"文字）切换大气层。',
  },
  'blob-opera': {
    'title': 'Blob Opera（谷歌）',
    'description': '在 David Li 的 Google Arts & Culture 实验中，用四个可爱的 ML 驱动歌唱 Blob 创造你自己的歌剧杰作。\n\n获得 Webby 大奖，成为 Google Arts & Culture 最具传播力的实验之一。',
    'controls': '点击拖动四个 Blob 中的任意一个上下改变音高。左右拖动改变元音。其他三个 Blob 通过机器学习自动和声。按录制按钮保存表演。',
  },
}

# ── CHINESE TRADITIONAL ──
GAMES['zh-TW'] = {
  'quick-draw': {
    'title': 'Quick, Draw!（Google）',
    'description': '神經網路能學會辨識你的塗鴉嗎？Quick, Draw! 是 Google 的 AI 實驗，挑戰你在 20 秒內畫出日常物品，同時機器學習模型即時猜測你在畫什麼。\n\nQuick, Draw! 旨在幫助訓練 Google 的神經網路進行手繪圖像辨識。',
    'controls': '你會得到一個詞語，用滑鼠或手指在 20 秒內畫出來。計時器開始後立即畫 —— AI 即時分析你的筆畫並喊出猜測。猜對了就進入下一個詞。共六輪。',
  },
  'google-earth-flight-simulator': {
    'title': 'Earth — 風與天氣地圖',
    'description': '在精美動畫 3D 地球儀上探索整個星球，即時視覺化風型、天氣狀況和洋流。旋轉地球儀，縮放任何區域，觀看迷人的動畫氣流。\n\n由每三小時更新一次的超級電腦預報驅動。由 Cameron Beccario 創建。',
    'controls': '點擊拖動旋轉地球儀。滾動縮放。點擊任意位置查看當地風速、溫度和座標。使用選單（左下角"earth"文字）切換大氣層。',
  },
  'blob-opera': {
    'title': 'Blob Opera（Google）',
    'description': '在 David Li 的 Google Arts & Culture 實驗中，用四個可愛的 ML 驅動歌唱 Blob 創造你自己的歌劇傑作。\n\n獲得 Webby 大獎，成為 Google Arts & Culture 最具傳播力的實驗之一。',
    'controls': '點擊拖動四個 Blob 中的任意一個上下改變音高。左右拖動改變母音。其他三個 Blob 透過機器學習自動和聲。按錄製按鈕保存表演。',
  },
}


def build_entry(slug, data):
    """Build a TypeScript translation entry string."""
    title = data['title'].replace("'", "\\'")
    desc = data['description'].replace('`', '\\`').replace('${', '\\${')
    ctrl = data['controls'].replace('`', '\\`').replace('${', '\\${')
    return f"  '{slug}': {{\n    title: '{title}',\n    description: `{desc}`,\n    controls: `{ctrl}`,\n  }},"


def main():
    count = 0
    for fname in sorted(os.listdir(trans_dir)):
        if not fname.endswith('.ts'):
            continue
        lang = fname.replace('.ts', '')
        if lang not in GAMES:
            print(f"  WARNING: No translations for {lang}, skipping")
            continue
        
        fpath = os.path.join(trans_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        stripped = content.rstrip()
        if not stripped.endswith('};'):
            print(f"  ERROR: {fname} doesn't end with }};")
            continue

        # Check if already has quick-draw
        if "'quick-draw'" in content:
            print(f"  SKIP: {fname} already has quick-draw")
            continue
        
        data = GAMES[lang]
        entries = []
        for slug in ['quick-draw', 'google-earth-flight-simulator', 'blob-opera']:
            entries.append(build_entry(slug, data[slug]))
        
        block = '\n' + '\n'.join(entries) + '\n'
        
        # Insert before the closing };
        new_content = stripped[:-2].rstrip() + '\n' + block.lstrip('\n') + '};\n'
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        count += 1
        print(f"  ✅ {fname}: added 3 game translations")
    
    print(f"\nDone! Updated {count} translation files.")


if __name__ == '__main__':
    main()
