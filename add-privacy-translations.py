#!/usr/bin/env python3
"""
Inject ~52 privacy-page translation keys into LanguageContext.tsx
for all 20 locales, and add them to the TranslationKey type union.
"""

import re, sys, os

FILE = os.path.join(os.path.dirname(__file__), "client/src/contexts/LanguageContext.tsx")

# ────────────────────────────────────────────────────────────────────────────
# 1. Define all 52 new keys with translations for each locale
# ────────────────────────────────────────────────────────────────────────────
KEYS: dict[str, dict[str, str]] = {}

def k(key: str, translations: dict[str, str]):
    KEYS[key] = translations

# ── Section titles ─────────────────────────────────────────────────────────
k('privacy.section.overview', {
    'en': 'Overview',
    'es': 'Descripción general',
    'fr': 'Aperçu',
    'de': 'Überblick',
    'it': 'Panoramica',
    'pt': 'Visão geral',
    'ru': 'Обзор',
    'ar': 'نظرة عامة',
    'hi': 'अवलोकन',
    'tr': 'Genel Bakış',
    'nl': 'Overzicht',
    'pl': 'Przegląd',
    'sv': 'Översikt',
    'id': 'Ikhtisar',
    'vi': 'Tổng quan',
    'th': 'ภาพรวม',
    'zh-CN': '概述',
    'zh-TW': '概述',
    'ja': '概要',
    'ko': '개요',
})

k('privacy.section.dataCollected', {
    'en': 'Information We Collect',
    'es': 'Información que recopilamos',
    'fr': 'Informations que nous collectons',
    'de': 'Informationen, die wir erheben',
    'it': 'Informazioni che raccogliamo',
    'pt': 'Informações que coletamos',
    'ru': 'Информация, которую мы собираем',
    'ar': 'المعلومات التي نجمعها',
    'hi': 'हमारे द्वारा एकत्रित जानकारी',
    'tr': 'Topladığımız Bilgiler',
    'nl': 'Informatie die wij verzamelen',
    'pl': 'Informacje, które zbieramy',
    'sv': 'Information vi samlar in',
    'id': 'Informasi yang Kami Kumpulkan',
    'vi': 'Thông tin chúng tôi thu thập',
    'th': 'ข้อมูลที่เรารวบรวม',
    'zh-CN': '我们收集的信息',
    'zh-TW': '我們收集的資訊',
    'ja': '収集する情報',
    'ko': '수집하는 정보',
})

k('privacy.section.cookies', {
    'en': 'Cookies',
    'es': 'Cookies',
    'fr': 'Cookies',
    'de': 'Cookies',
    'it': 'Cookie',
    'pt': 'Cookies',
    'ru': 'Файлы cookie',
    'ar': 'ملفات تعريف الارتباط',
    'hi': 'कुकीज़',
    'tr': 'Çerezler',
    'nl': 'Cookies',
    'pl': 'Pliki cookie',
    'sv': 'Kakor (cookies)',
    'id': 'Cookie',
    'vi': 'Cookie',
    'th': 'คุกกี้',
    'zh-CN': 'Cookie',
    'zh-TW': 'Cookie',
    'ja': 'Cookie',
    'ko': '쿠키',
})

k('privacy.section.thirdParties', {
    'en': 'Third-Party Services',
    'es': 'Servicios de terceros',
    'fr': 'Services tiers',
    'de': 'Dienste von Drittanbietern',
    'it': 'Servizi di terze parti',
    'pt': 'Serviços de terceiros',
    'ru': 'Сторонние сервисы',
    'ar': 'خدمات الطرف الثالث',
    'hi': 'तृतीय-पक्ष सेवाएँ',
    'tr': 'Üçüncü Taraf Hizmetleri',
    'nl': 'Diensten van derden',
    'pl': 'Usługi stron trzecich',
    'sv': 'Tredjepartstjänster',
    'id': 'Layanan Pihak Ketiga',
    'vi': 'Dịch vụ bên thứ ba',
    'th': 'บริการของบุคคลที่สาม',
    'zh-CN': '第三方服务',
    'zh-TW': '第三方服務',
    'ja': 'サードパーティサービス',
    'ko': '제3자 서비스',
})

k('privacy.section.dataSecurity', {
    'en': 'Data Security',
    'es': 'Seguridad de los datos',
    'fr': 'Sécurité des données',
    'de': 'Datensicherheit',
    'it': 'Sicurezza dei dati',
    'pt': 'Segurança dos dados',
    'ru': 'Безопасность данных',
    'ar': 'أمان البيانات',
    'hi': 'डेटा सुरक्षा',
    'tr': 'Veri Güvenliği',
    'nl': 'Gegevensbeveiliging',
    'pl': 'Bezpieczeństwo danych',
    'sv': 'Datasäkerhet',
    'id': 'Keamanan Data',
    'vi': 'Bảo mật dữ liệu',
    'th': 'ความปลอดภัยของข้อมูล',
    'zh-CN': '数据安全',
    'zh-TW': '資料安全',
    'ja': 'データセキュリティ',
    'ko': '데이터 보안',
})

k('privacy.section.yourRights', {
    'en': 'Your Rights',
    'es': 'Tus derechos',
    'fr': 'Vos droits',
    'de': 'Ihre Rechte',
    'it': 'I tuoi diritti',
    'pt': 'Seus direitos',
    'ru': 'Ваши права',
    'ar': 'حقوقك',
    'hi': 'आपके अधिकार',
    'tr': 'Haklarınız',
    'nl': 'Uw rechten',
    'pl': 'Twoje prawa',
    'sv': 'Dina rättigheter',
    'id': 'Hak Anda',
    'vi': 'Quyền của bạn',
    'th': 'สิทธิ์ของคุณ',
    'zh-CN': '您的权利',
    'zh-TW': '您的權利',
    'ja': 'あなたの権利',
    'ko': '귀하의 권리',
})

k('privacy.section.childrensPrivacy', {
    'en': "Children's Privacy",
    'es': 'Privacidad infantil',
    'fr': 'Confidentialité des enfants',
    'de': 'Datenschutz für Kinder',
    'it': 'Privacy dei minori',
    'pt': 'Privacidade infantil',
    'ru': 'Конфиденциальность детей',
    'ar': 'خصوصية الأطفال',
    'hi': 'बच्चों की गोपनीयता',
    'tr': 'Çocukların Gizliliği',
    'nl': 'Privacy van kinderen',
    'pl': 'Prywatność dzieci',
    'sv': 'Barns integritet',
    'id': 'Privasi Anak',
    'vi': 'Quyền riêng tư trẻ em',
    'th': 'ความเป็นส่วนตัวของเด็ก',
    'zh-CN': '儿童隐私',
    'zh-TW': '兒童隱私',
    'ja': 'お子様のプライバシー',
    'ko': '아동 개인정보 보호',
})

k('privacy.section.changes', {
    'en': 'Changes to This Policy',
    'es': 'Cambios en esta política',
    'fr': 'Modifications de cette politique',
    'de': 'Änderungen dieser Richtlinie',
    'it': 'Modifiche a questa informativa',
    'pt': 'Alterações nesta política',
    'ru': 'Изменения в этой политике',
    'ar': 'التغييرات على هذه السياسة',
    'hi': 'इस नीति में परिवर्तन',
    'tr': 'Bu Politikadaki Değişiklikler',
    'nl': 'Wijzigingen in dit beleid',
    'pl': 'Zmiany w tej polityce',
    'sv': 'Ändringar i denna policy',
    'id': 'Perubahan Kebijakan Ini',
    'vi': 'Thay đổi chính sách này',
    'th': 'การเปลี่ยนแปลงนโยบายนี้',
    'zh-CN': '本政策的变更',
    'zh-TW': '本政策的變更',
    'ja': 'このポリシーの変更',
    'ko': '본 정책의 변경',
})

k('privacy.section.contact', {
    'en': 'Contact',
    'es': 'Contacto',
    'fr': 'Contact',
    'de': 'Kontakt',
    'it': 'Contatti',
    'pt': 'Contato',
    'ru': 'Контакты',
    'ar': 'اتصل بنا',
    'hi': 'संपर्क',
    'tr': 'İletişim',
    'nl': 'Contact',
    'pl': 'Kontakt',
    'sv': 'Kontakt',
    'id': 'Kontak',
    'vi': 'Liên hệ',
    'th': 'ติดต่อ',
    'zh-CN': '联系我们',
    'zh-TW': '聯絡我們',
    'ja': 'お問い合わせ',
    'ko': '연락처',
})

# ── Overview content ───────────────────────────────────────────────────────
k('privacy.overview.p1', {
    'en': 'Doodle Games Hub ("we", "us", or "our") is an independent fan site that aggregates and presents interactive Google Doodle games. We are not affiliated with, endorsed by, or connected to Google LLC in any way.',
    'es': 'Doodle Games Hub ("nosotros" o "nuestro") es un sitio de fans independiente que reúne y presenta juegos interactivos de Google Doodle. No estamos afiliados, respaldados ni conectados con Google LLC de ninguna manera.',
    'fr': 'Doodle Games Hub (« nous » ou « notre ») est un site de fans indépendant qui rassemble et présente des jeux Google Doodle interactifs. Nous ne sommes en aucun cas affiliés, approuvés ou liés à Google LLC.',
    'de': 'Doodle Games Hub („wir" oder „uns") ist eine unabhängige Fan-Website, die interaktive Google-Doodle-Spiele sammelt und präsentiert. Wir sind in keiner Weise mit Google LLC verbunden, von Google unterstützt oder mit Google assoziiert.',
    'it': 'Doodle Games Hub ("noi" o "nostro") è un sito di fan indipendente che raccoglie e presenta giochi interattivi di Google Doodle. Non siamo in alcun modo affiliati, approvati o collegati a Google LLC.',
    'pt': 'Doodle Games Hub ("nós" ou "nosso") é um site de fãs independente que agrega e apresenta jogos interativos do Google Doodle. Não somos afiliados, endossados ou conectados à Google LLC de nenhuma forma.',
    'ru': 'Doodle Games Hub («мы» или «наш») — независимый фан-сайт, собирающий и представляющий интерактивные игры Google Doodle. Мы никак не связаны с Google LLC, не одобрены и не поддерживаются ею.',
    'ar': 'Doodle Games Hub ("نحن" أو "موقعنا") هو موقع معجبين مستقل يجمع ألعاب Google Doodle التفاعلية ويقدمها. نحن غير تابعين أو معتمدين أو مرتبطين بشركة Google LLC بأي شكل.',
    'hi': 'Doodle Games Hub ("हम" या "हमारा") एक स्वतंत्र प्रशंसक साइट है जो इंटरैक्टिव Google Doodle गेम्स को एकत्र और प्रस्तुत करती है। हम किसी भी तरह से Google LLC से संबद्ध, समर्थित या जुड़े नहीं हैं।',
    'tr': 'Doodle Games Hub ("biz" veya "bizim") interaktif Google Doodle oyunlarını bir araya getiren ve sunan bağımsız bir hayran sitesidir. Google LLC ile hiçbir şekilde bağlantılı, onaylanmış veya ilişkili değiliz.',
    'nl': 'Doodle Games Hub ("wij" of "ons") is een onafhankelijke fansite die interactieve Google Doodle-spellen verzamelt en presenteert. Wij zijn op geen enkele manier verbonden met, goedgekeurd door of gerelateerd aan Google LLC.',
    'pl': 'Doodle Games Hub („my" lub „nasz") to niezależna strona fanowska, która gromadzi i prezentuje interaktywne gry Google Doodle. Nie jesteśmy w żaden sposób powiązani z Google LLC, ani przez nią wspierani.',
    'sv': 'Doodle Games Hub ("vi" eller "vår") är en oberoende fansida som samlar och presenterar interaktiva Google Doodle-spel. Vi är inte på något sätt anslutna till, godkända av eller kopplade till Google LLC.',
    'id': 'Doodle Games Hub ("kami") adalah situs penggemar independen yang mengumpulkan dan menyajikan permainan Google Doodle interaktif. Kami tidak berafiliasi, didukung, atau terhubung dengan Google LLC dengan cara apa pun.',
    'vi': 'Doodle Games Hub ("chúng tôi") là trang web người hâm mộ độc lập tổng hợp và giới thiệu các trò chơi Google Doodle tương tác. Chúng tôi không liên kết, được chứng thực hoặc kết nối với Google LLC dưới bất kỳ hình thức nào.',
    'th': 'Doodle Games Hub ("เรา") เป็นเว็บไซต์แฟนไซต์อิสระที่รวบรวมและนำเสนอเกม Google Doodle แบบอินเทอร์แอคทีฟ เราไม่ได้สังกัด ได้รับการรับรอง หรือเชื่อมต่อกับ Google LLC แต่อย่างใด',
    'zh-CN': 'Doodle Games Hub（"我们"）是一个独立的粉丝网站，汇集并展示互动式 Google Doodle 游戏。我们与 Google LLC 没有任何关联、认可或联系。',
    'zh-TW': 'Doodle Games Hub（「我們」）是一個獨立的粉絲網站，匯集並展示互動式 Google Doodle 遊戲。我們與 Google LLC 沒有任何關聯、認可或聯繫。',
    'ja': 'Doodle Games Hub（「当サイト」）は、インタラクティブな Google Doodle ゲームを集めて紹介する独立したファンサイトです。Google LLC とは一切関係がなく、承認や提携もありません。',
    'ko': 'Doodle Games Hub("우리" 또는 "당사")는 인터랙티브 Google Doodle 게임을 모아서 소개하는 독립적인 팬 사이트입니다. Google LLC와 어떤 식으로도 제휴, 보증 또는 연결되어 있지 않습니다.',
})

k('privacy.overview.p2', {
    'en': 'This Privacy Policy explains what information we collect (very little), how we use it, and your rights regarding that information. By using this site, you agree to the practices described here.',
    'es': 'Esta Política de Privacidad explica qué información recopilamos (muy poca), cómo la usamos y tus derechos respecto a esa información. Al usar este sitio, aceptas las prácticas aquí descritas.',
    'fr': 'Cette Politique de Confidentialité explique quelles informations nous collectons (très peu), comment nous les utilisons et vos droits concernant ces informations. En utilisant ce site, vous acceptez les pratiques décrites ici.',
    'de': 'Diese Datenschutzrichtlinie erklärt, welche Informationen wir erheben (sehr wenige), wie wir sie verwenden und welche Rechte Sie bezüglich dieser Informationen haben. Durch die Nutzung dieser Website stimmen Sie den hier beschriebenen Praktiken zu.',
    'it': 'Questa Informativa sulla Privacy spiega quali informazioni raccogliamo (molto poche), come le utilizziamo e i tuoi diritti riguardo a tali informazioni. Utilizzando questo sito, accetti le pratiche qui descritte.',
    'pt': 'Esta Política de Privacidade explica quais informações coletamos (muito poucas), como as usamos e seus direitos em relação a essas informações. Ao usar este site, você concorda com as práticas aqui descritas.',
    'ru': 'Эта Политика конфиденциальности объясняет, какую информацию мы собираем (очень мало), как мы её используем и ваши права в отношении этой информации. Используя этот сайт, вы соглашаетесь с описанными здесь практиками.',
    'ar': 'توضح سياسة الخصوصية هذه المعلومات التي نجمعها (القليل جدًا)، وكيفية استخدامها، وحقوقك المتعلقة بتلك المعلومات. باستخدام هذا الموقع، فإنك توافق على الممارسات الموصوفة هنا.',
    'hi': 'यह गोपनीयता नीति बताती है कि हम कौन सी जानकारी एकत्र करते हैं (बहुत कम), हम इसका उपयोग कैसे करते हैं, और उस जानकारी के संबंध में आपके अधिकार। इस साइट का उपयोग करके, आप यहाँ वर्णित प्रथाओं से सहमत होते हैं।',
    'tr': 'Bu Gizlilik Politikası hangi bilgileri topladığımızı (çok az), nasıl kullandığımızı ve bu bilgilerle ilgili haklarınızı açıklar. Bu siteyi kullanarak burada açıklanan uygulamaları kabul etmiş olursunuz.',
    'nl': 'Dit Privacybeleid legt uit welke informatie wij verzamelen (zeer weinig), hoe wij deze gebruiken en uw rechten met betrekking tot die informatie. Door deze site te gebruiken, gaat u akkoord met de hier beschreven praktijken.',
    'pl': 'Niniejsza Polityka Prywatności wyjaśnia, jakie informacje zbieramy (bardzo niewiele), jak je wykorzystujemy oraz jakie masz prawa dotyczące tych informacji. Korzystając z tej strony, zgadzasz się na opisane tu praktyki.',
    'sv': 'Denna integritetspolicy förklarar vilken information vi samlar in (väldigt lite), hur vi använder den och dina rättigheter gällande den informationen. Genom att använda denna webbplats godkänner du de metoder som beskrivs här.',
    'id': 'Kebijakan Privasi ini menjelaskan informasi apa yang kami kumpulkan (sangat sedikit), cara kami menggunakannya, dan hak Anda terkait informasi tersebut. Dengan menggunakan situs ini, Anda menyetujui praktik yang dijelaskan di sini.',
    'vi': 'Chính sách Bảo mật này giải thích thông tin chúng tôi thu thập (rất ít), cách chúng tôi sử dụng và quyền của bạn liên quan đến thông tin đó. Bằng cách sử dụng trang web này, bạn đồng ý với các thông lệ được mô tả ở đây.',
    'th': 'นโยบายความเป็นส่วนตัวนี้อธิบายว่าเรารวบรวมข้อมูลอะไรบ้าง (น้อยมาก) ใช้อย่างไร และสิทธิ์ของคุณเกี่ยวกับข้อมูลนั้น การใช้เว็บไซต์นี้ถือว่าคุณยอมรับแนวปฏิบัติที่อธิบายไว้ที่นี่',
    'zh-CN': '本隐私政策说明我们收集哪些信息（非常少）、如何使用这些信息，以及您对这些信息的权利。使用本网站即表示您同意此处描述的做法。',
    'zh-TW': '本隱私政策說明我們收集哪些資訊（非常少）、如何使用這些資訊，以及您對這些資訊的權利。使用本網站即表示您同意此處描述的做法。',
    'ja': 'このプライバシーポリシーでは、当サイトが収集する情報（非常に少量）、その使用方法、およびその情報に関するあなたの権利について説明します。このサイトを利用することで、ここに記載された慣行に同意したものとみなされます。',
    'ko': '이 개인정보처리방침은 우리가 수집하는 정보(매우 적음), 사용 방법 및 해당 정보에 관한 귀하의 권리를 설명합니다. 이 사이트를 사용함으로써 여기에 설명된 관행에 동의하는 것입니다.',
})

# ── Information We Collect ─────────────────────────────────────────────────
k('privacy.dataCollected.intro', {
    'en': 'We collect minimal information to operate the site:',
    'es': 'Recopilamos información mínima para operar el sitio:',
    'fr': 'Nous collectons un minimum d\'informations pour faire fonctionner le site :',
    'de': 'Wir erheben nur minimale Informationen zum Betrieb der Website:',
    'it': 'Raccogliamo informazioni minime per gestire il sito:',
    'pt': 'Coletamos informações mínimas para operar o site:',
    'ru': 'Мы собираем минимум информации для работы сайта:',
    'ar': 'نجمع الحد الأدنى من المعلومات لتشغيل الموقع:',
    'hi': 'हम साइट संचालित करने के लिए न्यूनतम जानकारी एकत्र करते हैं:',
    'tr': 'Siteyi çalıştırmak için minimum düzeyde bilgi topluyoruz:',
    'nl': 'We verzamelen minimale informatie om de site te beheren:',
    'pl': 'Zbieramy minimalne informacje do obsługi strony:',
    'sv': 'Vi samlar in minimal information för att driva webbplatsen:',
    'id': 'Kami mengumpulkan informasi minimal untuk mengoperasikan situs:',
    'vi': 'Chúng tôi thu thập thông tin tối thiểu để vận hành trang web:',
    'th': 'เรารวบรวมข้อมูลขั้นต่ำเพื่อดำเนินการเว็บไซต์:',
    'zh-CN': '我们收集最少的信息来运营本网站：',
    'zh-TW': '我們收集最少的資訊來營運本網站：',
    'ja': 'サイトの運営に必要な最小限の情報を収集しています：',
    'ko': '사이트 운영을 위해 최소한의 정보를 수집합니다:',
})

k('privacy.dataCollected.localStorageTitle', {
    'en': 'Local Storage Data',
    'es': 'Datos de almacenamiento local',
    'fr': 'Données de stockage local',
    'de': 'Lokale Speicherdaten',
    'it': 'Dati di archiviazione locale',
    'pt': 'Dados de armazenamento local',
    'ru': 'Данные локального хранилища',
    'ar': 'بيانات التخزين المحلي',
    'hi': 'स्थानीय संग्रहण डेटा',
    'tr': 'Yerel Depolama Verileri',
    'nl': 'Lokale opslaggegevens',
    'pl': 'Dane pamięci lokalnej',
    'sv': 'Lokal lagringsdata',
    'id': 'Data Penyimpanan Lokal',
    'vi': 'Dữ liệu lưu trữ cục bộ',
    'th': 'ข้อมูลที่จัดเก็บในเครื่อง',
    'zh-CN': '本地存储数据',
    'zh-TW': '本機儲存資料',
    'ja': 'ローカルストレージデータ',
    'ko': '로컬 저장소 데이터',
})

k('privacy.dataCollected.localStorageDesc', {
    'en': 'We store your preferences (dark/light mode, Kids Mode, language choice, favourite games, and daily streak) in your browser\'s localStorage. This data never leaves your device and is not transmitted to any server.',
    'es': 'Almacenamos tus preferencias (modo oscuro/claro, Modo Niños, idioma, juegos favoritos y racha diaria) en el localStorage de tu navegador. Estos datos nunca salen de tu dispositivo ni se transmiten a ningún servidor.',
    'fr': 'Nous stockons vos préférences (mode sombre/clair, Mode Enfants, choix de langue, jeux favoris et série quotidienne) dans le localStorage de votre navigateur. Ces données ne quittent jamais votre appareil et ne sont transmises à aucun serveur.',
    'de': 'Wir speichern Ihre Einstellungen (Dunkel-/Hellmodus, Kindermodus, Sprachwahl, Lieblingsspiele und tägliche Serie) im localStorage Ihres Browsers. Diese Daten verlassen nie Ihr Gerät und werden an keinen Server übertragen.',
    'it': 'Memorizziamo le tue preferenze (modalità scura/chiara, Modalità Bambini, scelta della lingua, giochi preferiti e serie giornaliera) nel localStorage del tuo browser. Questi dati non lasciano mai il tuo dispositivo e non vengono trasmessi ad alcun server.',
    'pt': 'Armazenamos suas preferências (modo escuro/claro, Modo Crianças, escolha de idioma, jogos favoritos e sequência diária) no localStorage do seu navegador. Esses dados nunca saem do seu dispositivo e não são transmitidos a nenhum servidor.',
    'ru': 'Мы сохраняем ваши настройки (тёмный/светлый режим, детский режим, выбор языка, избранные игры и ежедневную серию) в localStorage вашего браузера. Эти данные никогда не покидают ваше устройство и не передаются на серверы.',
    'ar': 'نخزن تفضيلاتك (الوضع الداكن/الفاتح، وضع الأطفال، اختيار اللغة، الألعاب المفضلة، والسلسلة اليومية) في localStorage بمتصفحك. لا تغادر هذه البيانات جهازك أبدًا ولا تُرسل إلى أي خادم.',
    'hi': 'हम आपकी प्राथमिकताओं (डार्क/लाइट मोड, किड्स मोड, भाषा चयन, पसंदीदा गेम्स और दैनिक स्ट्रीक) को आपके ब्राउज़र के localStorage में संग्रहीत करते हैं। यह डेटा कभी भी आपके डिवाइस से बाहर नहीं जाता और किसी सर्वर पर प्रेषित नहीं होता।',
    'tr': 'Tercihlerinizi (koyu/açık mod, Çocuk Modu, dil seçimi, favori oyunlar ve günlük seri) tarayıcınızın localStorage\'ında saklıyoruz. Bu veriler asla cihazınızdan ayrılmaz ve herhangi bir sunucuya iletilmez.',
    'nl': 'We slaan uw voorkeuren op (donkere/lichte modus, Kindermodus, taalkeuze, favoriete spellen en dagelijkse reeks) in de localStorage van uw browser. Deze gegevens verlaten nooit uw apparaat en worden niet naar een server verzonden.',
    'pl': 'Przechowujemy Twoje preferencje (tryb ciemny/jasny, Tryb Dziecięcy, wybór języka, ulubione gry i dzienna seria) w localStorage Twojej przeglądarki. Dane te nigdy nie opuszczają Twojego urządzenia i nie są przesyłane na żaden serwer.',
    'sv': 'Vi lagrar dina inställningar (mörkt/ljust läge, Barnläge, språkval, favoritspel och daglig svit) i din webbläsares localStorage. Dessa data lämnar aldrig din enhet och skickas inte till någon server.',
    'id': 'Kami menyimpan preferensi Anda (mode gelap/terang, Mode Anak, pilihan bahasa, game favorit, dan streak harian) di localStorage browser Anda. Data ini tidak pernah meninggalkan perangkat Anda dan tidak dikirimkan ke server mana pun.',
    'vi': 'Chúng tôi lưu trữ tùy chọn của bạn (chế độ tối/sáng, Chế độ Trẻ em, lựa chọn ngôn ngữ, trò chơi yêu thích và chuỗi ngày) trong localStorage của trình duyệt. Dữ liệu này không bao giờ rời khỏi thiết bị của bạn và không được truyền đến bất kỳ máy chủ nào.',
    'th': 'เราเก็บค่ากำหนดของคุณ (โหมดมืด/สว่าง โหมดเด็ก ภาษาที่เลือก เกมโปรด และสตรีคประจำวัน) ใน localStorage ของเบราว์เซอร์ ข้อมูลนี้จะไม่ออกจากอุปกรณ์ของคุณและไม่ถูกส่งไปยังเซิร์ฟเวอร์ใด ๆ',
    'zh-CN': '我们将您的偏好设置（深色/浅色模式、儿童模式、语言选择、收藏游戏和每日连续记录）存储在浏览器的 localStorage 中。这些数据永远不会离开您的设备，也不会传输到任何服务器。',
    'zh-TW': '我們將您的偏好設定（深色/淺色模式、兒童模式、語言選擇、收藏遊戲和每日連續紀錄）儲存在瀏覽器的 localStorage 中。這些資料永遠不會離開您的裝置，也不會傳輸到任何伺服器。',
    'ja': 'お客様の設定（ダーク/ライトモード、キッズモード、言語選択、お気に入りゲーム、デイリーストリーク）をブラウザの localStorage に保存しています。このデータはお客様のデバイスから出ることはなく、サーバーに送信されることもありません。',
    'ko': '사용자의 환경설정(다크/라이트 모드, 키즈 모드, 언어 선택, 즐겨찾기 게임, 일일 연속 기록)을 브라우저의 localStorage에 저장합니다. 이 데이터는 절대 장치를 떠나지 않으며 어떤 서버로도 전송되지 않습니다.',
})

k('privacy.dataCollected.analyticsTitle', {
    'en': 'Analytics (Anonymous)',
    'es': 'Analítica (anónima)',
    'fr': 'Analyse (anonyme)',
    'de': 'Analyse (anonym)',
    'it': 'Analisi (anonima)',
    'pt': 'Análise (anônima)',
    'ru': 'Аналитика (анонимная)',
    'ar': 'التحليلات (مجهولة الهوية)',
    'hi': 'एनालिटिक्स (गुमनाम)',
    'tr': 'Analitik (Anonim)',
    'nl': 'Analyse (anoniem)',
    'pl': 'Analityka (anonimowa)',
    'sv': 'Analys (anonym)',
    'id': 'Analitik (Anonim)',
    'vi': 'Phân tích (Ẩn danh)',
    'th': 'การวิเคราะห์ (ไม่ระบุตัวตน)',
    'zh-CN': '分析（匿名）',
    'zh-TW': '分析（匿名）',
    'ja': 'アナリティクス（匿名）',
    'ko': '분석 (익명)',
})

k('privacy.dataCollected.analyticsDesc', {
    'en': 'We use privacy-respecting analytics to understand aggregate site traffic (page views, popular games). No personally identifiable information is collected. IP addresses are anonymised before processing.',
    'es': 'Utilizamos analíticas respetuosas con la privacidad para comprender el tráfico agregado del sitio (vistas de página, juegos populares). No se recopila información personal identificable. Las direcciones IP se anonimizan antes del procesamiento.',
    'fr': 'Nous utilisons des analyses respectueuses de la vie privée pour comprendre le trafic global du site (pages vues, jeux populaires). Aucune information personnelle identifiable n\'est collectée. Les adresses IP sont anonymisées avant traitement.',
    'de': 'Wir verwenden datenschutzfreundliche Analysen, um den aggregierten Website-Traffic zu verstehen (Seitenaufrufe, beliebte Spiele). Es werden keine personenbezogenen Daten erhoben. IP-Adressen werden vor der Verarbeitung anonymisiert.',
    'it': 'Utilizziamo analisi rispettose della privacy per comprendere il traffico aggregato del sito (visualizzazioni, giochi popolari). Non vengono raccolte informazioni personali identificabili. Gli indirizzi IP vengono anonimizzati prima dell\'elaborazione.',
    'pt': 'Usamos análises que respeitam a privacidade para entender o tráfego agregado do site (visualizações, jogos populares). Nenhuma informação pessoal identificável é coletada. Os endereços IP são anonimizados antes do processamento.',
    'ru': 'Мы используем аналитику, уважающую конфиденциальность, для понимания совокупного трафика сайта (просмотры страниц, популярные игры). Персональные данные не собираются. IP-адреса анонимизируются перед обработкой.',
    'ar': 'نستخدم تحليلات تحترم الخصوصية لفهم حركة المرور الإجمالية للموقع (مشاهدات الصفحات، الألعاب الشائعة). لا يتم جمع أي معلومات تعريف شخصية. يتم إخفاء هوية عناوين IP قبل المعالجة.',
    'hi': 'हम समग्र साइट ट्रैफ़िक (पेज व्यू, लोकप्रिय गेम) को समझने के लिए गोपनीयता-सम्मानजनक एनालिटिक्स का उपयोग करते हैं। कोई व्यक्तिगत रूप से पहचान योग्य जानकारी एकत्र नहीं की जाती। IP पते प्रसंस्करण से पहले अज्ञात कर दिए जाते हैं।',
    'tr': 'Toplu site trafiğini (sayfa görüntülemeleri, popüler oyunlar) anlamak için gizliliğe saygılı analitik kullanıyoruz. Kişisel olarak tanımlanabilir bilgi toplanmaz. IP adresleri işlenmeden önce anonimleştirilir.',
    'nl': 'We gebruiken privacyvriendelijke analyses om geaggregeerd siteverkeer te begrijpen (paginaweergaven, populaire spellen). Er wordt geen persoonlijk identificeerbare informatie verzameld. IP-adressen worden geanonimiseerd vóór verwerking.',
    'pl': 'Używamy analityki szanującej prywatność, aby zrozumieć zagregowany ruch na stronie (odsłony, popularne gry). Nie zbieramy informacji umożliwiających identyfikację. Adresy IP są anonimizowane przed przetworzeniem.',
    'sv': 'Vi använder integritetsrespekterande analys för att förstå den sammanlagda webbplatstrafiken (sidvisningar, populära spel). Ingen personligt identifierbar information samlas in. IP-adresser anonymiseras innan bearbetning.',
    'id': 'Kami menggunakan analitik yang menghormati privasi untuk memahami lalu lintas situs secara agregat (tampilan halaman, game populer). Tidak ada informasi identitas pribadi yang dikumpulkan. Alamat IP dianonimkan sebelum diproses.',
    'vi': 'Chúng tôi sử dụng phân tích tôn trọng quyền riêng tư để hiểu lưu lượng truy cập tổng hợp (lượt xem trang, trò chơi phổ biến). Không thu thập thông tin nhận dạng cá nhân. Địa chỉ IP được ẩn danh trước khi xử lý.',
    'th': 'เราใช้การวิเคราะห์ที่เคารพความเป็นส่วนตัวเพื่อทำความเข้าใจทราฟฟิกของเว็บไซต์โดยรวม (ยอดดูหน้า เกมยอดนิยม) ไม่มีการรวบรวมข้อมูลที่สามารถระบุตัวตนได้ ที่อยู่ IP จะถูกทำให้เป็นนิรนามก่อนการประมวลผล',
    'zh-CN': '我们使用尊重隐私的分析工具来了解网站的整体流量（页面浏览量、热门游戏）。不收集任何个人身份信息。IP 地址在处理前会进行匿名化。',
    'zh-TW': '我們使用尊重隱私的分析工具來了解網站的整體流量（頁面瀏覽量、熱門遊戲）。不收集任何個人身份資訊。IP 位址在處理前會進行匿名化。',
    'ja': 'サイト全体のトラフィック（ページビュー、人気ゲーム）を把握するために、プライバシーを尊重したアナリティクスを使用しています。個人を特定できる情報は収集しません。IPアドレスは処理前に匿名化されます。',
    'ko': '사이트 전체 트래픽(페이지 조회수, 인기 게임)을 파악하기 위해 개인정보를 존중하는 분석을 사용합니다. 개인 식별 정보는 수집하지 않습니다. IP 주소는 처리 전에 익명화됩니다.',
})

k('privacy.dataCollected.contactFormTitle', {
    'en': 'Contact Form',
    'es': 'Formulario de contacto',
    'fr': 'Formulaire de contact',
    'de': 'Kontaktformular',
    'it': 'Modulo di contatto',
    'pt': 'Formulário de contato',
    'ru': 'Контактная форма',
    'ar': 'نموذج الاتصال',
    'hi': 'संपर्क फ़ॉर्म',
    'tr': 'İletişim Formu',
    'nl': 'Contactformulier',
    'pl': 'Formularz kontaktowy',
    'sv': 'Kontaktformulär',
    'id': 'Formulir Kontak',
    'vi': 'Biểu mẫu liên hệ',
    'th': 'แบบฟอร์มติดต่อ',
    'zh-CN': '联系表单',
    'zh-TW': '聯絡表單',
    'ja': 'お問い合わせフォーム',
    'ko': '문의 양식',
})

k('privacy.dataCollected.contactFormDesc', {
    'en': 'If you submit the contact form, we collect your name, email address, and message content solely to respond to your enquiry. This information is not shared with third parties.',
    'es': 'Si envías el formulario de contacto, recopilamos tu nombre, dirección de correo electrónico y contenido del mensaje únicamente para responder a tu consulta. Esta información no se comparte con terceros.',
    'fr': 'Si vous soumettez le formulaire de contact, nous collectons votre nom, adresse e-mail et le contenu du message uniquement pour répondre à votre demande. Ces informations ne sont pas partagées avec des tiers.',
    'de': 'Wenn Sie das Kontaktformular absenden, erfassen wir Ihren Namen, Ihre E-Mail-Adresse und den Nachrichteninhalt ausschließlich zur Beantwortung Ihrer Anfrage. Diese Informationen werden nicht an Dritte weitergegeben.',
    'it': 'Se invii il modulo di contatto, raccogliamo il tuo nome, indirizzo email e contenuto del messaggio esclusivamente per rispondere alla tua richiesta. Queste informazioni non vengono condivise con terze parti.',
    'pt': 'Se você enviar o formulário de contato, coletamos seu nome, endereço de e-mail e conteúdo da mensagem exclusivamente para responder à sua consulta. Essas informações não são compartilhadas com terceiros.',
    'ru': 'Если вы отправляете контактную форму, мы собираем ваше имя, адрес электронной почты и содержание сообщения исключительно для ответа на ваш запрос. Эта информация не передаётся третьим лицам.',
    'ar': 'إذا أرسلت نموذج الاتصال، فإننا نجمع اسمك وعنوان بريدك الإلكتروني ومحتوى رسالتك فقط للرد على استفسارك. لا تتم مشاركة هذه المعلومات مع أطراف ثالثة.',
    'hi': 'यदि आप संपर्क फ़ॉर्म जमा करते हैं, तो हम केवल आपकी पूछताछ का जवाब देने के लिए आपका नाम, ईमेल पता और संदेश सामग्री एकत्र करते हैं। यह जानकारी तृतीय पक्षों के साथ साझा नहीं की जाती।',
    'tr': 'İletişim formunu gönderirseniz, yalnızca sorunuza yanıt vermek amacıyla adınızı, e-posta adresinizi ve mesaj içeriğinizi topluyoruz. Bu bilgiler üçüncü taraflarla paylaşılmaz.',
    'nl': 'Als u het contactformulier verzendt, verzamelen wij uw naam, e-mailadres en berichtinhoud uitsluitend om op uw vraag te reageren. Deze informatie wordt niet gedeeld met derden.',
    'pl': 'Jeśli prześlesz formularz kontaktowy, zbieramy Twoje imię, adres e-mail i treść wiadomości wyłącznie w celu odpowiedzi na Twoje zapytanie. Te informacje nie są udostępniane stronom trzecim.',
    'sv': 'Om du skickar kontaktformuläret samlar vi in ditt namn, e-postadress och meddelandeinnehåll enbart för att svara på din förfrågan. Denna information delas inte med tredje part.',
    'id': 'Jika Anda mengirimkan formulir kontak, kami mengumpulkan nama, alamat email, dan isi pesan Anda semata-mata untuk menanggapi pertanyaan Anda. Informasi ini tidak dibagikan kepada pihak ketiga.',
    'vi': 'Nếu bạn gửi biểu mẫu liên hệ, chúng tôi thu thập tên, địa chỉ email và nội dung tin nhắn của bạn chỉ để phản hồi yêu cầu của bạn. Thông tin này không được chia sẻ với bên thứ ba.',
    'th': 'หากคุณส่งแบบฟอร์มติดต่อ เราจะรวบรวมชื่อ ที่อยู่อีเมล และเนื้อหาข้อความของคุณเพื่อตอบกลับคำถามของคุณเท่านั้น ข้อมูลนี้จะไม่ถูกแชร์กับบุคคลที่สาม',
    'zh-CN': '如果您提交联系表单，我们会收集您的姓名、电子邮件地址和消息内容，仅用于回复您的咨询。此信息不会与第三方共享。',
    'zh-TW': '如果您提交聯絡表單，我們會收集您的姓名、電子郵件地址和訊息內容，僅用於回覆您的諮詢。此資訊不會與第三方共享。',
    'ja': 'お問い合わせフォームを送信された場合、お名前、メールアドレス、メッセージ内容をお問い合わせへの回答のみを目的として収集します。これらの情報は第三者と共有されません。',
    'ko': '문의 양식을 제출하면 문의에 답변하기 위해서만 이름, 이메일 주소, 메시지 내용을 수집합니다. 이 정보는 제3자와 공유되지 않습니다.',
})

k('privacy.dataCollected.noCollect', {
    'en': 'We do not collect: passwords, payment information, location data, device identifiers, or any sensitive personal data.',
    'es': 'No recopilamos: contraseñas, información de pago, datos de ubicación, identificadores de dispositivos ni ningún dato personal sensible.',
    'fr': 'Nous ne collectons pas : mots de passe, informations de paiement, données de localisation, identifiants d\'appareils ou toute donnée personnelle sensible.',
    'de': 'Wir erheben nicht: Passwörter, Zahlungsinformationen, Standortdaten, Gerätekennungen oder sensible personenbezogene Daten.',
    'it': 'Non raccogliamo: password, informazioni di pagamento, dati di localizzazione, identificatori del dispositivo o dati personali sensibili.',
    'pt': 'Não coletamos: senhas, informações de pagamento, dados de localização, identificadores de dispositivos ou quaisquer dados pessoais sensíveis.',
    'ru': 'Мы не собираем: пароли, платёжную информацию, данные о местоположении, идентификаторы устройств или конфиденциальные персональные данные.',
    'ar': 'لا نجمع: كلمات المرور أو معلومات الدفع أو بيانات الموقع أو معرّفات الأجهزة أو أي بيانات شخصية حساسة.',
    'hi': 'हम एकत्र नहीं करते: पासवर्ड, भुगतान जानकारी, स्थान डेटा, डिवाइस पहचानकर्ता, या कोई संवेदनशील व्यक्तिगत डेटा।',
    'tr': 'Toplamadığımız bilgiler: şifreler, ödeme bilgileri, konum verileri, cihaz tanımlayıcıları veya hassas kişisel veriler.',
    'nl': 'Wij verzamelen niet: wachtwoorden, betalingsinformatie, locatiegegevens, apparaat-ID\'s of gevoelige persoonsgegevens.',
    'pl': 'Nie zbieramy: haseł, informacji o płatnościach, danych lokalizacyjnych, identyfikatorów urządzeń ani wrażliwych danych osobowych.',
    'sv': 'Vi samlar inte in: lösenord, betalningsinformation, platsdata, enhetsidentifierare eller känsliga personuppgifter.',
    'id': 'Kami tidak mengumpulkan: kata sandi, informasi pembayaran, data lokasi, pengenal perangkat, atau data pribadi sensitif apa pun.',
    'vi': 'Chúng tôi không thu thập: mật khẩu, thông tin thanh toán, dữ liệu vị trí, mã nhận dạng thiết bị hoặc bất kỳ dữ liệu cá nhân nhạy cảm nào.',
    'th': 'เราไม่รวบรวม: รหัสผ่าน ข้อมูลการชำระเงิน ข้อมูลตำแหน่ง ตัวระบุอุปกรณ์ หรือข้อมูลส่วนบุคคลที่ละเอียดอ่อนใด ๆ',
    'zh-CN': '我们不收集：密码、支付信息、位置数据、设备标识符或任何敏感个人数据。',
    'zh-TW': '我們不收集：密碼、付款資訊、位置資料、裝置識別碼或任何敏感個人資料。',
    'ja': '当サイトは以下を収集しません：パスワード、支払い情報、位置データ、デバイス識別子、その他の機密個人データ。',
    'ko': '수집하지 않는 정보: 비밀번호, 결제 정보, 위치 데이터, 기기 식별자 또는 민감한 개인 데이터.',
})

# ── Cookies ────────────────────────────────────────────────────────────────
k('privacy.cookies.p1', {
    'en': 'This site uses only functional cookies — small files stored in your browser that are strictly necessary for the site to work (e.g. remembering your theme preference).',
    'es': 'Este sitio utiliza solo cookies funcionales — pequeños archivos almacenados en tu navegador que son estrictamente necesarios para el funcionamiento del sitio (por ejemplo, recordar tu preferencia de tema).',
    'fr': 'Ce site utilise uniquement des cookies fonctionnels — de petits fichiers stockés dans votre navigateur qui sont strictement nécessaires au fonctionnement du site (par exemple, mémoriser votre préférence de thème).',
    'de': 'Diese Website verwendet nur funktionale Cookies — kleine Dateien, die in Ihrem Browser gespeichert werden und für die Funktion der Website unbedingt erforderlich sind (z. B. zum Speichern Ihrer Theme-Einstellung).',
    'it': 'Questo sito utilizza solo cookie funzionali — piccoli file memorizzati nel browser strettamente necessari per il funzionamento del sito (ad esempio, per ricordare la preferenza del tema).',
    'pt': 'Este site usa apenas cookies funcionais — pequenos arquivos armazenados no seu navegador que são estritamente necessários para o funcionamento do site (por exemplo, lembrar sua preferência de tema).',
    'ru': 'Этот сайт использует только функциональные cookie — небольшие файлы, сохраняемые в вашем браузере, которые строго необходимы для работы сайта (например, для запоминания выбранной темы).',
    'ar': 'يستخدم هذا الموقع ملفات تعريف الارتباط الوظيفية فقط — ملفات صغيرة مخزنة في متصفحك ضرورية حصريًا لعمل الموقع (مثل تذكر تفضيل المظهر).',
    'hi': 'यह साइट केवल कार्यात्मक कुकीज़ का उपयोग करती है — आपके ब्राउज़र में संग्रहीत छोटी फ़ाइलें जो साइट के काम करने के लिए कड़ाई से आवश्यक हैं (जैसे आपकी थीम प्राथमिकता याद रखना)।',
    'tr': 'Bu site yalnızca işlevsel çerezler kullanır — tarayıcınızda saklanan ve sitenin çalışması için kesinlikle gerekli olan küçük dosyalar (örneğin tema tercihinizi hatırlamak).',
    'nl': 'Deze site gebruikt alleen functionele cookies — kleine bestanden die in uw browser worden opgeslagen en strikt noodzakelijk zijn voor de werking van de site (bijv. het onthouden van uw themavoorkeur).',
    'pl': 'Ta strona używa wyłącznie funkcjonalnych plików cookie — małych plików przechowywanych w przeglądarce, które są ściśle niezbędne do działania strony (np. zapamiętywanie preferencji motywu).',
    'sv': 'Denna webbplats använder endast funktionella kakor — små filer som lagras i din webbläsare och som är strikt nödvändiga för att webbplatsen ska fungera (t.ex. att komma ihåg ditt temainställning).',
    'id': 'Situs ini hanya menggunakan cookie fungsional — file kecil yang disimpan di browser Anda yang sangat diperlukan agar situs berfungsi (misalnya, mengingat preferensi tema Anda).',
    'vi': 'Trang web này chỉ sử dụng cookie chức năng — các tệp nhỏ được lưu trong trình duyệt của bạn cần thiết cho hoạt động của trang web (ví dụ: ghi nhớ tùy chọn giao diện của bạn).',
    'th': 'เว็บไซต์นี้ใช้เฉพาะคุกกี้ที่จำเป็นเท่านั้น — ไฟล์ขนาดเล็กที่จัดเก็บในเบราว์เซอร์ของคุณซึ่งจำเป็นอย่างยิ่งสำหรับการทำงานของเว็บไซต์ (เช่น จดจำการตั้งค่าธีมของคุณ)',
    'zh-CN': '本网站仅使用功能性 Cookie——存储在浏览器中的小文件，是网站正常运行所必需的（例如记住您的主题偏好）。',
    'zh-TW': '本網站僅使用功能性 Cookie——儲存在瀏覽器中的小檔案，是網站正常運作所必需的（例如記住您的主題偏好）。',
    'ja': '当サイトは機能性 Cookie のみを使用しています。これはブラウザに保存される小さなファイルで、サイトの動作に厳密に必要なものです（例：テーマ設定の記憶）。',
    'ko': '이 사이트는 기능적 쿠키만 사용합니다. 이는 브라우저에 저장되는 작은 파일로, 사이트 작동에 꼭 필요한 것입니다(예: 테마 설정 기억).',
})

k('privacy.cookies.p2', {
    'en': 'We do not use advertising cookies, tracking pixels, or third-party marketing cookies.',
    'es': 'No utilizamos cookies publicitarias, píxeles de seguimiento ni cookies de marketing de terceros.',
    'fr': 'Nous n\'utilisons pas de cookies publicitaires, de pixels de suivi ou de cookies marketing tiers.',
    'de': 'Wir verwenden keine Werbe-Cookies, Tracking-Pixel oder Marketing-Cookies von Drittanbietern.',
    'it': 'Non utilizziamo cookie pubblicitari, pixel di tracciamento o cookie di marketing di terze parti.',
    'pt': 'Não usamos cookies de publicidade, pixels de rastreamento ou cookies de marketing de terceiros.',
    'ru': 'Мы не используем рекламные cookie, пиксели отслеживания или маркетинговые cookie третьих сторон.',
    'ar': 'لا نستخدم ملفات تعريف الارتباط الإعلانية أو بكسلات التتبع أو ملفات تعريف الارتباط التسويقية من أطراف ثالثة.',
    'hi': 'हम विज्ञापन कुकीज़, ट्रैकिंग पिक्सेल, या तृतीय-पक्ष मार्केटिंग कुकीज़ का उपयोग नहीं करते।',
    'tr': 'Reklam çerezleri, izleme pikselleri veya üçüncü taraf pazarlama çerezleri kullanmıyoruz.',
    'nl': 'We gebruiken geen advertentiecookies, trackingpixels of marketingcookies van derden.',
    'pl': 'Nie używamy reklamowych plików cookie, pikseli śledzących ani marketingowych plików cookie stron trzecich.',
    'sv': 'Vi använder inte reklamkakor, spårningspixlar eller marknadsföringskakor från tredje part.',
    'id': 'Kami tidak menggunakan cookie iklan, piksel pelacakan, atau cookie pemasaran pihak ketiga.',
    'vi': 'Chúng tôi không sử dụng cookie quảng cáo, pixel theo dõi hoặc cookie tiếp thị của bên thứ ba.',
    'th': 'เราไม่ใช้คุกกี้โฆษณา พิกเซลติดตาม หรือคุกกี้การตลาดของบุคคลที่สาม',
    'zh-CN': '我们不使用广告 Cookie、跟踪像素或第三方营销 Cookie。',
    'zh-TW': '我們不使用廣告 Cookie、追蹤像素或第三方行銷 Cookie。',
    'ja': '広告 Cookie、トラッキングピクセル、サードパーティのマーケティング Cookie は使用していません。',
    'ko': '광고 쿠키, 추적 픽셀 또는 제3자 마케팅 쿠키를 사용하지 않습니다.',
})

k('privacy.cookies.p3', {
    'en': 'The embedded games are hosted on www.google.com and glov3.me. These third-party services may set their own cookies when you interact with the game iframe. Please review their respective privacy policies for details.',
    'es': 'Los juegos integrados están alojados en www.google.com y glov3.me. Estos servicios de terceros pueden establecer sus propias cookies cuando interactúas con el iframe del juego. Consulta sus respectivas políticas de privacidad para más detalles.',
    'fr': 'Les jeux intégrés sont hébergés sur www.google.com et glov3.me. Ces services tiers peuvent définir leurs propres cookies lorsque vous interagissez avec l\'iframe du jeu. Veuillez consulter leurs politiques de confidentialité respectives.',
    'de': 'Die eingebetteten Spiele werden auf www.google.com und glov3.me gehostet. Diese Drittanbieter können eigene Cookies setzen, wenn Sie mit dem Spiel-iFrame interagieren. Bitte lesen Sie deren jeweilige Datenschutzrichtlinien.',
    'it': 'I giochi incorporati sono ospitati su www.google.com e glov3.me. Questi servizi di terze parti possono impostare i propri cookie quando interagisci con l\'iframe del gioco. Consulta le rispettive informative sulla privacy per i dettagli.',
    'pt': 'Os jogos incorporados são hospedados em www.google.com e glov3.me. Esses serviços de terceiros podem definir seus próprios cookies quando você interage com o iframe do jogo. Consulte suas respectivas políticas de privacidade para detalhes.',
    'ru': 'Встроенные игры размещены на www.google.com и glov3.me. Эти сторонние сервисы могут устанавливать свои cookie при взаимодействии с iframe игры. Ознакомьтесь с их политиками конфиденциальности для подробностей.',
    'ar': 'الألعاب المضمنة مستضافة على www.google.com و glov3.me. قد تضع هذه الخدمات ملفات تعريف ارتباط خاصة بها عند تفاعلك مع إطار اللعبة. يرجى مراجعة سياسات الخصوصية الخاصة بها.',
    'hi': 'एम्बेडेड गेम www.google.com और glov3.me पर होस्ट किए गए हैं। जब आप गेम iframe के साथ इंटरैक्ट करते हैं तो ये तृतीय-पक्ष सेवाएँ अपनी स्वयं की कुकीज़ सेट कर सकती हैं। विवरण के लिए कृपया उनकी संबंधित गोपनीयता नीतियाँ देखें।',
    'tr': 'Gömülü oyunlar www.google.com ve glov3.me üzerinde barındırılmaktadır. Bu üçüncü taraf hizmetler, oyun iframe\'i ile etkileşim kurduğunuzda kendi çerezlerini ayarlayabilir. Ayrıntılar için ilgili gizlilik politikalarını inceleyiniz.',
    'nl': 'De ingebedde spellen worden gehost op www.google.com en glov3.me. Deze diensten van derden kunnen hun eigen cookies instellen wanneer u met het speliframe interageert. Raadpleeg hun respectieve privacybeleid voor details.',
    'pl': 'Osadzone gry są hostowane na www.google.com i glov3.me. Te usługi stron trzecich mogą ustawiać własne pliki cookie, gdy wchodzisz w interakcję z iframe gry. Sprawdź ich polityki prywatności, aby poznać szczegóły.',
    'sv': 'De inbäddade spelen finns på www.google.com och glov3.me. Dessa tredjepartstjänster kan sätta egna kakor när du interagerar med spelets iframe. Se deras respektive integritetspolicyer för detaljer.',
    'id': 'Game yang disematkan dihosting di www.google.com dan glov3.me. Layanan pihak ketiga ini dapat menetapkan cookie mereka sendiri saat Anda berinteraksi dengan iframe game. Silakan tinjau kebijakan privasi mereka masing-masing.',
    'vi': 'Các trò chơi nhúng được lưu trữ trên www.google.com và glov3.me. Các dịch vụ bên thứ ba này có thể đặt cookie riêng khi bạn tương tác với iframe trò chơi. Vui lòng xem chính sách bảo mật tương ứng của họ.',
    'th': 'เกมที่ฝังไว้โฮสต์บน www.google.com และ glov3.me บริการของบุคคลที่สามเหล่านี้อาจตั้งค่าคุกกี้ของตนเองเมื่อคุณโต้ตอบกับ iframe ของเกม โปรดตรวจสอบนโยบายความเป็นส่วนตัวของแต่ละบริการ',
    'zh-CN': '嵌入的游戏托管在 www.google.com 和 glov3.me 上。当您与游戏 iframe 交互时，这些第三方服务可能会设置自己的 Cookie。请查阅它们各自的隐私政策了解详情。',
    'zh-TW': '嵌入的遊戲託管在 www.google.com 和 glov3.me 上。當您與遊戲 iframe 互動時，這些第三方服務可能會設定自己的 Cookie。請查閱它們各自的隱私政策了解詳情。',
    'ja': '埋め込みゲームは www.google.com および glov3.me でホストされています。ゲームの iframe とやり取りする際に、これらのサードパーティサービスが独自の Cookie を設定する場合があります。詳細は各サービスのプライバシーポリシーをご確認ください。',
    'ko': '임베드된 게임은 www.google.com과 glov3.me에서 호스팅됩니다. 게임 iframe과 상호작용할 때 이러한 제3자 서비스가 자체 쿠키를 설정할 수 있습니다. 자세한 내용은 해당 개인정보처리방침을 확인하세요.',
})

k('privacy.cookies.p4', {
    'en': 'You can disable cookies in your browser settings at any time. Note that disabling cookies may affect site functionality (e.g. your preferences will not be saved between visits).',
    'es': 'Puedes desactivar las cookies en la configuración de tu navegador en cualquier momento. Ten en cuenta que desactivar las cookies puede afectar la funcionalidad del sitio (por ejemplo, tus preferencias no se guardarán entre visitas).',
    'fr': 'Vous pouvez désactiver les cookies dans les paramètres de votre navigateur à tout moment. Notez que la désactivation des cookies peut affecter le fonctionnement du site (par exemple, vos préférences ne seront pas sauvegardées entre les visites).',
    'de': 'Sie können Cookies jederzeit in Ihren Browser-Einstellungen deaktivieren. Beachten Sie, dass das Deaktivieren von Cookies die Website-Funktionalität beeinträchtigen kann (z. B. werden Ihre Einstellungen nicht zwischen Besuchen gespeichert).',
    'it': 'Puoi disabilitare i cookie nelle impostazioni del browser in qualsiasi momento. Tieni presente che la disabilitazione dei cookie può influire sulla funzionalità del sito (ad esempio, le preferenze non verranno salvate tra le visite).',
    'pt': 'Você pode desativar os cookies nas configurações do seu navegador a qualquer momento. Observe que desativar cookies pode afetar a funcionalidade do site (por exemplo, suas preferências não serão salvas entre visitas).',
    'ru': 'Вы можете отключить cookie в настройках браузера в любое время. Обратите внимание, что отключение cookie может повлиять на функциональность сайта (например, ваши настройки не будут сохраняться между посещениями).',
    'ar': 'يمكنك تعطيل ملفات تعريف الارتباط في إعدادات متصفحك في أي وقت. لاحظ أن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف الموقع (مثلاً لن يتم حفظ تفضيلاتك بين الزيارات).',
    'hi': 'आप किसी भी समय अपने ब्राउज़र सेटिंग्स में कुकीज़ को अक्षम कर सकते हैं। ध्यान दें कि कुकीज़ अक्षम करने से साइट की कार्यक्षमता प्रभावित हो सकती है (उदाहरण के लिए, आपकी प्राथमिकताएं विज़िट के बीच सहेजी नहीं जाएंगी)।',
    'tr': 'Çerezleri istediğiniz zaman tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz. Çerezleri devre dışı bırakmanın site işlevselliğini etkileyebileceğini unutmayın (örneğin tercihleriniz ziyaretler arasında kaydedilmez).',
    'nl': 'U kunt cookies op elk moment uitschakelen in uw browserinstellingen. Houd er rekening mee dat het uitschakelen van cookies de sitefunctionaliteit kan beïnvloeden (bijv. uw voorkeuren worden niet opgeslagen tussen bezoeken).',
    'pl': 'Możesz wyłączyć pliki cookie w ustawieniach przeglądarki w dowolnym momencie. Pamiętaj, że wyłączenie plików cookie może wpłynąć na funkcjonalność strony (np. preferencje nie zostaną zachowane między wizytami).',
    'sv': 'Du kan inaktivera kakor i din webbläsarinställningar när som helst. Observera att inaktivering av kakor kan påverka webbplatsens funktionalitet (t.ex. sparas inte dina inställningar mellan besök).',
    'id': 'Anda dapat menonaktifkan cookie di pengaturan browser kapan saja. Perhatikan bahwa menonaktifkan cookie dapat memengaruhi fungsionalitas situs (misalnya, preferensi Anda tidak akan disimpan antar kunjungan).',
    'vi': 'Bạn có thể tắt cookie trong cài đặt trình duyệt bất cứ lúc nào. Lưu ý rằng việc tắt cookie có thể ảnh hưởng đến chức năng trang web (ví dụ: tùy chọn của bạn sẽ không được lưu giữa các lần truy cập).',
    'th': 'คุณสามารถปิดการใช้งานคุกกี้ในการตั้งค่าเบราว์เซอร์ได้ตลอดเวลา โปรดทราบว่าการปิดคุกกี้อาจส่งผลต่อการทำงานของเว็บไซต์ (เช่น การตั้งค่าของคุณจะไม่ถูกบันทึกระหว่างการเยี่ยมชม)',
    'zh-CN': '您可以随时在浏览器设置中禁用 Cookie。请注意，禁用 Cookie 可能会影响网站功能（例如，您的偏好设置不会在访问之间保存）。',
    'zh-TW': '您可以隨時在瀏覽器設定中停用 Cookie。請注意，停用 Cookie 可能會影響網站功能（例如，您的偏好設定不會在訪問之間保存）。',
    'ja': 'ブラウザの設定からいつでも Cookie を無効にできます。Cookie を無効にすると、サイトの機能に影響が出る場合があります（例：訪問間で設定が保存されなくなります）。',
    'ko': '브라우저 설정에서 언제든지 쿠키를 비활성화할 수 있습니다. 쿠키를 비활성화하면 사이트 기능에 영향을 줄 수 있습니다(예: 방문 간 환경설정이 저장되지 않음).',
})

# ── Third-Party Services ───────────────────────────────────────────────────
k('privacy.thirdParties.intro', {
    'en': 'The site embeds content from the following third-party services:',
    'es': 'El sitio integra contenido de los siguientes servicios de terceros:',
    'fr': 'Le site intègre du contenu des services tiers suivants :',
    'de': 'Die Website bettet Inhalte der folgenden Drittanbieter ein:',
    'it': 'Il sito incorpora contenuti dai seguenti servizi di terze parti:',
    'pt': 'O site incorpora conteúdo dos seguintes serviços de terceiros:',
    'ru': 'Сайт встраивает контент из следующих сторонних сервисов:',
    'ar': 'يقوم الموقع بتضمين محتوى من خدمات الطرف الثالث التالية:',
    'hi': 'साइट निम्नलिखित तृतीय-पक्ष सेवाओं से सामग्री एम्बेड करती है:',
    'tr': 'Site, aşağıdaki üçüncü taraf hizmetlerinden içerik yerleştirir:',
    'nl': 'De site bevat inhoud van de volgende diensten van derden:',
    'pl': 'Strona osadza treści z następujących usług stron trzecich:',
    'sv': 'Webbplatsen bäddar in innehåll från följande tredjepartstjänster:',
    'id': 'Situs ini menyematkan konten dari layanan pihak ketiga berikut:',
    'vi': 'Trang web nhúng nội dung từ các dịch vụ bên thứ ba sau:',
    'th': 'เว็บไซต์ฝังเนื้อหาจากบริการของบุคคลที่สามต่อไปนี้:',
    'zh-CN': '本网站嵌入了以下第三方服务的内容：',
    'zh-TW': '本網站嵌入了以下第三方服務的內容：',
    'ja': '当サイトは以下のサードパーティサービスのコンテンツを埋め込んでいます：',
    'ko': '이 사이트는 다음 제3자 서비스의 콘텐츠를 삽입합니다:',
})

k('privacy.thirdParties.service', {
    'en': 'Service', 'es': 'Servicio', 'fr': 'Service', 'de': 'Dienst', 'it': 'Servizio',
    'pt': 'Serviço', 'ru': 'Сервис', 'ar': 'الخدمة', 'hi': 'सेवा', 'tr': 'Hizmet',
    'nl': 'Dienst', 'pl': 'Usługa', 'sv': 'Tjänst', 'id': 'Layanan', 'vi': 'Dịch vụ',
    'th': 'บริการ', 'zh-CN': '服务', 'zh-TW': '服務', 'ja': 'サービス', 'ko': '서비스',
})

k('privacy.thirdParties.purpose', {
    'en': 'Purpose', 'es': 'Propósito', 'fr': 'Objectif', 'de': 'Zweck', 'it': 'Scopo',
    'pt': 'Finalidade', 'ru': 'Назначение', 'ar': 'الغرض', 'hi': 'उद्देश्य', 'tr': 'Amaç',
    'nl': 'Doel', 'pl': 'Cel', 'sv': 'Syfte', 'id': 'Tujuan', 'vi': 'Mục đích',
    'th': 'วัตถุประสงค์', 'zh-CN': '用途', 'zh-TW': '用途', 'ja': '目的', 'ko': '목적',
})

k('privacy.thirdParties.privacyPolicy', {
    'en': 'Privacy Policy', 'es': 'Política de privacidad', 'fr': 'Politique de confidentialité',
    'de': 'Datenschutzrichtlinie', 'it': 'Informativa sulla privacy', 'pt': 'Política de privacidade',
    'ru': 'Политика конфиденциальности', 'ar': 'سياسة الخصوصية', 'hi': 'गोपनीयता नीति',
    'tr': 'Gizlilik Politikası', 'nl': 'Privacybeleid', 'pl': 'Polityka prywatności',
    'sv': 'Integritetspolicy', 'id': 'Kebijakan Privasi', 'vi': 'Chính sách bảo mật',
    'th': 'นโยบายความเป็นส่วนตัว', 'zh-CN': '隐私政策', 'zh-TW': '隱私政策',
    'ja': 'プライバシーポリシー', 'ko': '개인정보처리방침',
})

k('privacy.thirdParties.googlePurpose', {
    'en': 'Hosts original Doodle game files',
    'es': 'Aloja los archivos originales de juegos Doodle',
    'fr': 'Héberge les fichiers de jeux Doodle originaux',
    'de': 'Hostet die originalen Doodle-Spieldateien',
    'it': 'Ospita i file originali dei giochi Doodle',
    'pt': 'Hospeda os arquivos originais dos jogos Doodle',
    'ru': 'Хостит оригинальные файлы игр Doodle',
    'ar': 'يستضيف ملفات ألعاب Doodle الأصلية',
    'hi': 'मूल Doodle गेम फ़ाइलों को होस्ट करता है',
    'tr': 'Orijinal Doodle oyun dosyalarını barındırır',
    'nl': 'Host de originele Doodle-spelbestanden',
    'pl': 'Hostuje oryginalne pliki gier Doodle',
    'sv': 'Är värd för de ursprungliga Doodle-spelfilerna',
    'id': 'Menghosting file game Doodle asli',
    'vi': 'Lưu trữ các tệp trò chơi Doodle gốc',
    'th': 'โฮสต์ไฟล์เกม Doodle ต้นฉบับ',
    'zh-CN': '托管原始 Doodle 游戏文件',
    'zh-TW': '託管原始 Doodle 遊戲檔案',
    'ja': 'Doodle ゲームのオリジナルファイルをホスト',
    'ko': '오리지널 Doodle 게임 파일 호스팅',
})

k('privacy.thirdParties.glovPurpose', {
    'en': 'Mirror host for some Doodle games',
    'es': 'Host espejo para algunos juegos Doodle',
    'fr': 'Hébergeur miroir pour certains jeux Doodle',
    'de': 'Spiegelhost für einige Doodle-Spiele',
    'it': 'Host mirror per alcuni giochi Doodle',
    'pt': 'Host espelho para alguns jogos Doodle',
    'ru': 'Зеркальный хостинг для некоторых игр Doodle',
    'ar': 'مستضيف مرآة لبعض ألعاب Doodle',
    'hi': 'कुछ Doodle गेम के लिए मिरर होस्ट',
    'tr': 'Bazı Doodle oyunları için ayna sunucu',
    'nl': 'Mirrorhost voor sommige Doodle-spellen',
    'pl': 'Host lustrzany dla niektórych gier Doodle',
    'sv': 'Spegelvärd för vissa Doodle-spel',
    'id': 'Host mirror untuk beberapa game Doodle',
    'vi': 'Máy chủ phản chiếu cho một số trò chơi Doodle',
    'th': 'โฮสต์กระจกสำหรับเกม Doodle บางเกม',
    'zh-CN': '部分 Doodle 游戏的镜像主机',
    'zh-TW': '部分 Doodle 遊戲的鏡像主機',
    'ja': '一部の Doodle ゲームのミラーホスト',
    'ko': '일부 Doodle 게임의 미러 호스트',
})

k('privacy.thirdParties.fontsPurpose', {
    'en': 'Typography (loaded via CDN)',
    'es': 'Tipografía (cargada via CDN)',
    'fr': 'Typographie (chargée via CDN)',
    'de': 'Typografie (via CDN geladen)',
    'it': 'Tipografia (caricata via CDN)',
    'pt': 'Tipografia (carregada via CDN)',
    'ru': 'Типографика (загружается через CDN)',
    'ar': 'الخطوط (محملة عبر CDN)',
    'hi': 'टाइपोग्राफी (CDN के माध्यम से लोड)',
    'tr': 'Tipografi (CDN üzerinden yüklenir)',
    'nl': 'Typografie (geladen via CDN)',
    'pl': 'Typografia (ładowana przez CDN)',
    'sv': 'Typsnitt (laddade via CDN)',
    'id': 'Tipografi (dimuat melalui CDN)',
    'vi': 'Kiểu chữ (tải qua CDN)',
    'th': 'ตัวอักษร (โหลดผ่าน CDN)',
    'zh-CN': '字体（通过 CDN 加载）',
    'zh-TW': '字型（透過 CDN 載入）',
    'ja': 'タイポグラフィ（CDN 経由で読み込み）',
    'ko': '타이포그래피 (CDN을 통해 로드)',
})

k('privacy.thirdParties.seeTheirSite', {
    'en': 'See their site', 'es': 'Ver su sitio', 'fr': 'Voir leur site', 'de': 'Siehe deren Website',
    'it': 'Vedi il loro sito', 'pt': 'Veja o site deles', 'ru': 'Смотрите их сайт',
    'ar': 'انظر موقعهم', 'hi': 'उनकी साइट देखें', 'tr': 'Sitelerine bakın',
    'nl': 'Zie hun site', 'pl': 'Zobacz ich stronę', 'sv': 'Se deras webbplats',
    'id': 'Lihat situs mereka', 'vi': 'Xem trang web của họ', 'th': 'ดูเว็บไซต์ของพวกเขา',
    'zh-CN': '查看其网站', 'zh-TW': '查看其網站', 'ja': '彼らのサイトを参照', 'ko': '해당 사이트 참조',
})

k('privacy.thirdParties.noSell', {
    'en': 'We do not sell, rent, or share your personal information with any third party for marketing purposes.',
    'es': 'No vendemos, alquilamos ni compartimos tu información personal con terceros con fines de marketing.',
    'fr': 'Nous ne vendons, ne louons ni ne partageons vos informations personnelles avec des tiers à des fins marketing.',
    'de': 'Wir verkaufen, vermieten oder teilen Ihre persönlichen Daten nicht mit Dritten zu Marketingzwecken.',
    'it': 'Non vendiamo, affittiamo o condividiamo le tue informazioni personali con terze parti per scopi di marketing.',
    'pt': 'Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing.',
    'ru': 'Мы не продаём, не сдаём в аренду и не передаём вашу личную информацию третьим лицам в маркетинговых целях.',
    'ar': 'نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي طرف ثالث لأغراض تسويقية.',
    'hi': 'हम मार्केटिंग उद्देश्यों के लिए आपकी व्यक्तिगत जानकारी किसी तृतीय पक्ष को नहीं बेचते, किराए पर नहीं देते या साझा नहीं करते।',
    'tr': 'Kişisel bilgilerinizi pazarlama amacıyla hiçbir üçüncü tarafla satmıyor, kiralamıyor veya paylaşmıyoruz.',
    'nl': 'Wij verkopen, verhuren of delen uw persoonlijke informatie niet met derden voor marketingdoeleinden.',
    'pl': 'Nie sprzedajemy, nie wynajmujemy ani nie udostępniamy Twoich danych osobowych stronom trzecim w celach marketingowych.',
    'sv': 'Vi säljer, hyr ut eller delar inte din personliga information med tredje part i marknadsföringssyfte.',
    'id': 'Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga mana pun untuk tujuan pemasaran.',
    'vi': 'Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào cho mục đích tiếp thị.',
    'th': 'เราไม่ขาย ให้เช่า หรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลที่สามใด ๆ เพื่อวัตถุประสงค์ทางการตลาด',
    'zh-CN': '我们不会出于营销目的向任何第三方出售、出租或共享您的个人信息。',
    'zh-TW': '我們不會出於行銷目的向任何第三方出售、出租或分享您的個人資訊。',
    'ja': 'マーケティング目的で個人情報を第三者に販売、貸出、または共有することはありません。',
    'ko': '마케팅 목적으로 개인 정보를 제3자에게 판매, 임대 또는 공유하지 않습니다.',
})

# ── Data Security ──────────────────────────────────────────────────────────
k('privacy.dataSecurity.p1', {
    'en': 'Because this is a static website with no user accounts or server-side database, the risk surface is minimal. Your preference data lives entirely in your own browser.',
    'es': 'Dado que este es un sitio web estático sin cuentas de usuario ni base de datos del lado del servidor, la superficie de riesgo es mínima. Tus datos de preferencias residen completamente en tu propio navegador.',
    'fr': 'Comme il s\'agit d\'un site web statique sans comptes utilisateurs ni base de données côté serveur, la surface de risque est minimale. Vos données de préférence résident entièrement dans votre propre navigateur.',
    'de': 'Da dies eine statische Website ohne Benutzerkonten oder serverseitige Datenbank ist, ist die Angriffsfläche minimal. Ihre Einstellungsdaten befinden sich vollständig in Ihrem eigenen Browser.',
    'it': 'Poiché si tratta di un sito web statico senza account utente o database lato server, la superficie di rischio è minima. I dati delle tue preferenze risiedono interamente nel tuo browser.',
    'pt': 'Como este é um site estático sem contas de usuário ou banco de dados no servidor, a superfície de risco é mínima. Seus dados de preferência ficam inteiramente no seu próprio navegador.',
    'ru': 'Поскольку это статический сайт без учётных записей пользователей и серверной базы данных, поверхность риска минимальна. Ваши данные о настройках хранятся исключительно в вашем браузере.',
    'ar': 'نظرًا لأن هذا موقع ويب ثابت بدون حسابات مستخدمين أو قاعدة بيانات من جانب الخادم، فإن مساحة المخاطر ضئيلة. تبقى بيانات تفضيلاتك بالكامل في متصفحك.',
    'hi': 'चूंकि यह बिना उपयोगकर्ता खातों या सर्वर-साइड डेटाबेस वाली एक स्थिर वेबसाइट है, जोखिम की सतह न्यूनतम है। आपकी प्राथमिकता डेटा पूरी तरह से आपके अपने ब्राउज़र में रहता है।',
    'tr': 'Bu, kullanıcı hesapları veya sunucu tarafı veritabanı olmayan statik bir web sitesi olduğundan risk yüzeyi minimumdur. Tercih verileriniz tamamen kendi tarayıcınızda yaşar.',
    'nl': 'Omdat dit een statische website is zonder gebruikersaccounts of server-side database, is het risicooppervlak minimaal. Uw voorkeurgegevens bevinden zich volledig in uw eigen browser.',
    'pl': 'Ponieważ jest to statyczna strona internetowa bez kont użytkowników ani bazy danych po stronie serwera, powierzchnia ryzyka jest minimalna. Dane Twoich preferencji znajdują się wyłącznie w Twojej przeglądarce.',
    'sv': 'Eftersom detta är en statisk webbplats utan användarkonton eller databas på serversidan är riskytan minimal. Dina inställningsdata finns helt i din egen webbläsare.',
    'id': 'Karena ini adalah situs web statis tanpa akun pengguna atau basis data sisi server, permukaan risiko sangat minimal. Data preferensi Anda sepenuhnya berada di browser Anda sendiri.',
    'vi': 'Vì đây là trang web tĩnh không có tài khoản người dùng hay cơ sở dữ liệu phía máy chủ, bề mặt rủi ro là tối thiểu. Dữ liệu tùy chọn của bạn hoàn toàn nằm trong trình duyệt của bạn.',
    'th': 'เนื่องจากนี่เป็นเว็บไซต์แบบสถิตที่ไม่มีบัญชีผู้ใช้หรือฐานข้อมูลฝั่งเซิร์ฟเวอร์ พื้นผิวความเสี่ยงจึงน้อยที่สุด ข้อมูลการตั้งค่าของคุณอยู่ในเบราว์เซอร์ของคุณเองทั้งหมด',
    'zh-CN': '由于这是一个没有用户账户或服务器端数据库的静态网站，风险面非常小。您的偏好数据完全存储在您自己的浏览器中。',
    'zh-TW': '由於這是一個沒有使用者帳戶或伺服器端資料庫的靜態網站，風險面非常小。您的偏好資料完全儲存在您自己的瀏覽器中。',
    'ja': 'これはユーザーアカウントやサーバー側データベースのない静的ウェブサイトであるため、リスク面は最小限です。お客様の設定データはすべてご自身のブラウザ内に保存されます。',
    'ko': '이 사이트는 사용자 계정이나 서버 측 데이터베이스가 없는 정적 웹사이트이므로 위험 표면이 최소화됩니다. 환경설정 데이터는 전적으로 사용자의 브라우저에 저장됩니다.',
})

k('privacy.dataSecurity.p2', {
    'en': 'The site is served over HTTPS to protect data in transit. We do not store any personal data on our servers beyond what is described in the Contact Form section above.',
    'es': 'El sitio se sirve a través de HTTPS para proteger los datos en tránsito. No almacenamos ningún dato personal en nuestros servidores más allá de lo descrito en la sección de Formulario de contacto anterior.',
    'fr': 'Le site est servi via HTTPS pour protéger les données en transit. Nous ne stockons aucune donnée personnelle sur nos serveurs au-delà de ce qui est décrit dans la section Formulaire de contact ci-dessus.',
    'de': 'Die Website wird über HTTPS bereitgestellt, um Daten während der Übertragung zu schützen. Wir speichern keine persönlichen Daten auf unseren Servern über das hinaus, was im Abschnitt Kontaktformular beschrieben ist.',
    'it': 'Il sito è servito tramite HTTPS per proteggere i dati in transito. Non memorizziamo dati personali sui nostri server oltre a quanto descritto nella sezione Modulo di contatto sopra.',
    'pt': 'O site é servido via HTTPS para proteger os dados em trânsito. Não armazenamos dados pessoais em nossos servidores além do descrito na seção Formulário de contato acima.',
    'ru': 'Сайт работает через HTTPS для защиты данных при передаче. Мы не храним на серверах никаких персональных данных, кроме описанных в разделе «Контактная форма» выше.',
    'ar': 'يتم تقديم الموقع عبر HTTPS لحماية البيانات أثناء النقل. لا نخزن أي بيانات شخصية على خوادمنا بخلاف ما هو موضح في قسم نموذج الاتصال أعلاه.',
    'hi': 'ट्रांज़िट में डेटा की सुरक्षा के लिए साइट HTTPS के माध्यम से सर्व की जाती है। हम ऊपर संपर्क फ़ॉर्म अनुभाग में वर्णित से परे अपने सर्वरों पर कोई व्यक्तिगत डेटा संग्रहीत नहीं करते।',
    'tr': 'Site, aktarım sırasında verileri korumak için HTTPS üzerinden sunulmaktadır. Yukarıdaki İletişim Formu bölümünde açıklananın ötesinde sunucularımızda hiçbir kişisel veri saklamıyoruz.',
    'nl': 'De site wordt bediend via HTTPS om gegevens tijdens verzending te beschermen. Wij slaan geen persoonlijke gegevens op onze servers op buiten wat beschreven is in de sectie Contactformulier hierboven.',
    'pl': 'Strona jest serwowana przez HTTPS, aby chronić dane w tranzycie. Nie przechowujemy żadnych danych osobowych na naszych serwerach poza tym, co opisano w sekcji Formularz kontaktowy powyżej.',
    'sv': 'Webbplatsen levereras via HTTPS för att skydda data under överföring. Vi lagrar inga personuppgifter på våra servrar utöver vad som beskrivs i avsnittet Kontaktformulär ovan.',
    'id': 'Situs disajikan melalui HTTPS untuk melindungi data saat transit. Kami tidak menyimpan data pribadi apa pun di server kami selain yang dijelaskan di bagian Formulir Kontak di atas.',
    'vi': 'Trang web được phân phối qua HTTPS để bảo vệ dữ liệu khi truyền tải. Chúng tôi không lưu trữ bất kỳ dữ liệu cá nhân nào trên máy chủ ngoài những gì được mô tả trong phần Biểu mẫu liên hệ ở trên.',
    'th': 'เว็บไซต์ให้บริการผ่าน HTTPS เพื่อปกป้องข้อมูลระหว่างการส่ง เราไม่เก็บข้อมูลส่วนบุคคลใด ๆ บนเซิร์ฟเวอร์ของเรานอกเหนือจากที่อธิบายไว้ในส่วนแบบฟอร์มติดต่อด้านบน',
    'zh-CN': '网站通过 HTTPS 提供服务以保护传输中的数据。除上述联系表单部分所述外，我们不会在服务器上存储任何个人数据。',
    'zh-TW': '網站透過 HTTPS 提供服務以保護傳輸中的資料。除上述聯絡表單部分所述外，我們不會在伺服器上儲存任何個人資料。',
    'ja': 'サイトは HTTPS で提供され、転送中のデータを保護しています。上記のお問い合わせフォームセクションに記載されている以上の個人データをサーバーに保存することはありません。',
    'ko': '사이트는 전송 중 데이터를 보호하기 위해 HTTPS를 통해 제공됩니다. 위의 문의 양식 섹션에 설명된 것 이상의 개인 데이터를 서버에 저장하지 않습니다.',
})

# ── Your Rights ────────────────────────────────────────────────────────────
k('privacy.yourRights.intro', {
    'en': 'Depending on your location, you may have the following rights:',
    'es': 'Dependiendo de tu ubicación, puedes tener los siguientes derechos:',
    'fr': 'Selon votre localisation, vous pouvez disposer des droits suivants :',
    'de': 'Abhängig von Ihrem Standort haben Sie möglicherweise folgende Rechte:',
    'it': 'A seconda della tua posizione, potresti avere i seguenti diritti:',
    'pt': 'Dependendo da sua localização, você pode ter os seguintes direitos:',
    'ru': 'В зависимости от вашего местоположения вы можете иметь следующие права:',
    'ar': 'حسب موقعك، قد يكون لديك الحقوق التالية:',
    'hi': 'आपके स्थान के आधार पर, आपके पास निम्नलिखित अधिकार हो सकते हैं:',
    'tr': 'Bulunduğunuz yere bağlı olarak aşağıdaki haklara sahip olabilirsiniz:',
    'nl': 'Afhankelijk van uw locatie heeft u mogelijk de volgende rechten:',
    'pl': 'W zależności od Twojej lokalizacji możesz mieć następujące prawa:',
    'sv': 'Beroende på var du befinner dig kan du ha följande rättigheter:',
    'id': 'Tergantung lokasi Anda, Anda mungkin memiliki hak-hak berikut:',
    'vi': 'Tùy thuộc vào vị trí của bạn, bạn có thể có các quyền sau:',
    'th': 'ขึ้นอยู่กับตำแหน่งที่ตั้งของคุณ คุณอาจมีสิทธิ์ดังต่อไปนี้:',
    'zh-CN': '根据您所在的位置，您可能拥有以下权利：',
    'zh-TW': '根據您所在的位置，您可能擁有以下權利：',
    'ja': 'お住まいの地域によっては、以下の権利を有する場合があります：',
    'ko': '거주 지역에 따라 다음과 같은 권리를 가질 수 있습니다:',
})

k('privacy.yourRights.access', {
    'en': 'Right to access', 'es': 'Derecho de acceso', 'fr': 'Droit d\'accès',
    'de': 'Recht auf Auskunft', 'it': 'Diritto di accesso', 'pt': 'Direito de acesso',
    'ru': 'Право на доступ', 'ar': 'حق الوصول', 'hi': 'पहुँच का अधिकार',
    'tr': 'Erişim hakkı', 'nl': 'Recht op inzage', 'pl': 'Prawo dostępu',
    'sv': 'Rätt till tillgång', 'id': 'Hak akses', 'vi': 'Quyền truy cập',
    'th': 'สิทธิ์ในการเข้าถึง', 'zh-CN': '访问权', 'zh-TW': '存取權',
    'ja': 'アクセス権', 'ko': '접근권',
})

k('privacy.yourRights.accessDesc', {
    'en': 'Request a copy of any personal data we hold about you.',
    'es': 'Solicitar una copia de cualquier dato personal que tengamos sobre ti.',
    'fr': 'Demander une copie de toute donnée personnelle que nous détenons à votre sujet.',
    'de': 'Eine Kopie aller personenbezogenen Daten anfordern, die wir über Sie gespeichert haben.',
    'it': 'Richiedere una copia dei dati personali che deteniamo su di te.',
    'pt': 'Solicitar uma cópia de quaisquer dados pessoais que mantemos sobre você.',
    'ru': 'Запросить копию любых персональных данных, которые мы храним о вас.',
    'ar': 'طلب نسخة من أي بيانات شخصية نحتفظ بها عنك.',
    'hi': 'हमारे पास आपके बारे में मौजूद किसी भी व्यक्तिगत डेटा की प्रति का अनुरोध करें।',
    'tr': 'Hakkınızda tuttuğumuz kişisel verilerin bir kopyasını talep etme.',
    'nl': 'Een kopie opvragen van alle persoonsgegevens die wij over u bewaren.',
    'pl': 'Żądanie kopii wszelkich danych osobowych, które przechowujemy na Twój temat.',
    'sv': 'Begär en kopia av alla personuppgifter vi har om dig.',
    'id': 'Meminta salinan data pribadi apa pun yang kami miliki tentang Anda.',
    'vi': 'Yêu cầu bản sao bất kỳ dữ liệu cá nhân nào chúng tôi lưu giữ về bạn.',
    'th': 'ขอสำเนาข้อมูลส่วนบุคคลใด ๆ ที่เราเก็บเกี่ยวกับคุณ',
    'zh-CN': '请求获取我们持有的关于您的任何个人数据的副本。',
    'zh-TW': '請求取得我們持有的關於您的任何個人資料的副本。',
    'ja': '当サイトが保有するお客様の個人データのコピーを請求すること。',
    'ko': '당사가 보유한 귀하의 개인 데이터 사본을 요청할 수 있습니다.',
})

k('privacy.yourRights.erasure', {
    'en': 'Right to erasure', 'es': 'Derecho de supresión', 'fr': 'Droit à l\'effacement',
    'de': 'Recht auf Löschung', 'it': 'Diritto alla cancellazione', 'pt': 'Direito à exclusão',
    'ru': 'Право на удаление', 'ar': 'حق المحو', 'hi': 'मिटाने का अधिकार',
    'tr': 'Silme hakkı', 'nl': 'Recht op wissing', 'pl': 'Prawo do usunięcia',
    'sv': 'Rätt till radering', 'id': 'Hak penghapusan', 'vi': 'Quyền xóa',
    'th': 'สิทธิ์ในการลบ', 'zh-CN': '删除权', 'zh-TW': '刪除權',
    'ja': '消去権', 'ko': '삭제권',
})

k('privacy.yourRights.erasureDesc', {
    'en': 'Request deletion of your personal data.',
    'es': 'Solicitar la eliminación de tus datos personales.',
    'fr': 'Demander la suppression de vos données personnelles.',
    'de': 'Die Löschung Ihrer personenbezogenen Daten anfordern.',
    'it': 'Richiedere la cancellazione dei tuoi dati personali.',
    'pt': 'Solicitar a exclusão dos seus dados pessoais.',
    'ru': 'Запросить удаление ваших персональных данных.',
    'ar': 'طلب حذف بياناتك الشخصية.',
    'hi': 'अपने व्यक्तिगत डेटा को हटाने का अनुरोध करें।',
    'tr': 'Kişisel verilerinizin silinmesini talep etme.',
    'nl': 'Verzoek tot verwijdering van uw persoonsgegevens.',
    'pl': 'Żądanie usunięcia Twoich danych osobowych.',
    'sv': 'Begär radering av dina personuppgifter.',
    'id': 'Meminta penghapusan data pribadi Anda.',
    'vi': 'Yêu cầu xóa dữ liệu cá nhân của bạn.',
    'th': 'ขอให้ลบข้อมูลส่วนบุคคลของคุณ',
    'zh-CN': '请求删除您的个人数据。',
    'zh-TW': '請求刪除您的個人資料。',
    'ja': '個人データの削除を請求すること。',
    'ko': '개인 데이터의 삭제를 요청할 수 있습니다.',
})

k('privacy.yourRights.rectification', {
    'en': 'Right to rectification', 'es': 'Derecho de rectificación', 'fr': 'Droit de rectification',
    'de': 'Recht auf Berichtigung', 'it': 'Diritto di rettifica', 'pt': 'Direito de retificação',
    'ru': 'Право на исправление', 'ar': 'حق التصحيح', 'hi': 'सुधार का अधिकार',
    'tr': 'Düzeltme hakkı', 'nl': 'Recht op rectificatie', 'pl': 'Prawo do sprostowania',
    'sv': 'Rätt till rättelse', 'id': 'Hak pembetulan', 'vi': 'Quyền chỉnh sửa',
    'th': 'สิทธิ์ในการแก้ไข', 'zh-CN': '更正权', 'zh-TW': '更正權',
    'ja': '訂正権', 'ko': '정정권',
})

k('privacy.yourRights.rectificationDesc', {
    'en': 'Request correction of inaccurate personal data.',
    'es': 'Solicitar la corrección de datos personales inexactos.',
    'fr': 'Demander la correction de données personnelles inexactes.',
    'de': 'Die Berichtigung unrichtiger personenbezogener Daten anfordern.',
    'it': 'Richiedere la correzione di dati personali inesatti.',
    'pt': 'Solicitar a correção de dados pessoais imprecisos.',
    'ru': 'Запросить исправление неточных персональных данных.',
    'ar': 'طلب تصحيح البيانات الشخصية غير الدقيقة.',
    'hi': 'गलत व्यक्तिगत डेटा में सुधार का अनुरोध करें।',
    'tr': 'Yanlış kişisel verilerin düzeltilmesini talep etme.',
    'nl': 'Verzoek tot correctie van onjuiste persoonsgegevens.',
    'pl': 'Żądanie poprawienia niedokładnych danych osobowych.',
    'sv': 'Begär korrigering av felaktiga personuppgifter.',
    'id': 'Meminta koreksi data pribadi yang tidak akurat.',
    'vi': 'Yêu cầu chỉnh sửa dữ liệu cá nhân không chính xác.',
    'th': 'ขอให้แก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้อง',
    'zh-CN': '请求更正不准确的个人数据。',
    'zh-TW': '請求更正不準確的個人資料。',
    'ja': '不正確な個人データの訂正を請求すること。',
    'ko': '부정확한 개인 데이터의 정정을 요청할 수 있습니다.',
})

k('privacy.yourRights.object', {
    'en': 'Right to object', 'es': 'Derecho de oposición', 'fr': 'Droit d\'opposition',
    'de': 'Widerspruchsrecht', 'it': 'Diritto di opposizione', 'pt': 'Direito de oposição',
    'ru': 'Право на возражение', 'ar': 'حق الاعتراض', 'hi': 'आपत्ति का अधिकार',
    'tr': 'İtiraz hakkı', 'nl': 'Recht van bezwaar', 'pl': 'Prawo do sprzeciwu',
    'sv': 'Rätt att invända', 'id': 'Hak keberatan', 'vi': 'Quyền phản đối',
    'th': 'สิทธิ์ในการคัดค้าน', 'zh-CN': '反对权', 'zh-TW': '反對權',
    'ja': '異議権', 'ko': '이의제기권',
})

k('privacy.yourRights.objectDesc', {
    'en': 'Object to certain types of processing.',
    'es': 'Oponerte a ciertos tipos de procesamiento.',
    'fr': 'Vous opposer à certains types de traitement.',
    'de': 'Widerspruch gegen bestimmte Arten der Verarbeitung einlegen.',
    'it': 'Opporsi a determinati tipi di trattamento.',
    'pt': 'Opor-se a certos tipos de processamento.',
    'ru': 'Возражать против определённых видов обработки.',
    'ar': 'الاعتراض على أنواع معينة من المعالجة.',
    'hi': 'कुछ प्रकार के प्रसंस्करण पर आपत्ति करें।',
    'tr': 'Belirli işleme türlerine itiraz etme.',
    'nl': 'Bezwaar maken tegen bepaalde soorten verwerking.',
    'pl': 'Sprzeciw wobec określonych rodzajów przetwarzania.',
    'sv': 'Invända mot vissa typer av behandling.',
    'id': 'Keberatan terhadap jenis pemrosesan tertentu.',
    'vi': 'Phản đối một số loại xử lý nhất định.',
    'th': 'คัดค้านการประมวลผลบางประเภท',
    'zh-CN': '反对某些类型的处理。',
    'zh-TW': '反對某些類型的處理。',
    'ja': '特定の種類の処理に異議を唱えること。',
    'ko': '특정 유형의 처리에 이의를 제기할 수 있습니다.',
})

k('privacy.yourRights.portability', {
    'en': 'Right to portability', 'es': 'Derecho a la portabilidad', 'fr': 'Droit à la portabilité',
    'de': 'Recht auf Datenübertragbarkeit', 'it': 'Diritto alla portabilità', 'pt': 'Direito à portabilidade',
    'ru': 'Право на переносимость', 'ar': 'حق نقل البيانات', 'hi': 'पोर्टेबिलिटी का अधिकार',
    'tr': 'Taşınabilirlik hakkı', 'nl': 'Recht op overdraagbaarheid', 'pl': 'Prawo do przenoszenia',
    'sv': 'Rätt till dataportabilitet', 'id': 'Hak portabilitas', 'vi': 'Quyền di chuyển',
    'th': 'สิทธิ์ในการเคลื่อนย้ายข้อมูล', 'zh-CN': '可携权', 'zh-TW': '可攜權',
    'ja': 'ポータビリティ権', 'ko': '이동권',
})

k('privacy.yourRights.portabilityDesc', {
    'en': 'Receive your data in a portable format.',
    'es': 'Recibir tus datos en un formato portátil.',
    'fr': 'Recevoir vos données dans un format portable.',
    'de': 'Ihre Daten in einem portablen Format erhalten.',
    'it': 'Ricevere i tuoi dati in un formato portatile.',
    'pt': 'Receber seus dados em um formato portátil.',
    'ru': 'Получить ваши данные в переносимом формате.',
    'ar': 'استلام بياناتك بتنسيق قابل للنقل.',
    'hi': 'अपने डेटा को पोर्टेबल प्रारूप में प्राप्त करें।',
    'tr': 'Verilerinizi taşınabilir bir formatta alma.',
    'nl': 'Uw gegevens ontvangen in een overdraagbaar formaat.',
    'pl': 'Otrzymanie danych w przenośnym formacie.',
    'sv': 'Ta emot dina uppgifter i ett portabelt format.',
    'id': 'Menerima data Anda dalam format portabel.',
    'vi': 'Nhận dữ liệu của bạn ở định dạng di động.',
    'th': 'รับข้อมูลของคุณในรูปแบบที่พกพาได้',
    'zh-CN': '以可移植格式接收您的数据。',
    'zh-TW': '以可攜式格式接收您的資料。',
    'ja': 'ポータブルな形式でデータを受け取ること。',
    'ko': '이동 가능한 형식으로 데이터를 수신할 수 있습니다.',
})

k('privacy.yourRights.exerciseRights', {
    'en': 'To exercise any of these rights, contact us via the',
    'es': 'Para ejercer cualquiera de estos derechos, contáctanos a través de la',
    'fr': 'Pour exercer l\'un de ces droits, contactez-nous via la',
    'de': 'Um eines dieser Rechte auszuüben, kontaktieren Sie uns über die',
    'it': 'Per esercitare uno qualsiasi di questi diritti, contattaci tramite la',
    'pt': 'Para exercer qualquer um desses direitos, entre em contato através da',
    'ru': 'Для реализации любого из этих прав свяжитесь с нами через',
    'ar': 'لممارسة أي من هذه الحقوق، تواصل معنا عبر',
    'hi': 'इनमें से किसी भी अधिकार का प्रयोग करने के लिए, हमसे संपर्क करें',
    'tr': 'Bu haklardan herhangi birini kullanmak için bizimle iletişime geçin:',
    'nl': 'Om een van deze rechten uit te oefenen, neem contact met ons op via de',
    'pl': 'Aby skorzystać z któregokolwiek z tych praw, skontaktuj się z nami przez',
    'sv': 'För att utöva någon av dessa rättigheter, kontakta oss via',
    'id': 'Untuk menggunakan hak-hak ini, hubungi kami melalui',
    'vi': 'Để thực hiện bất kỳ quyền nào trong số này, hãy liên hệ với chúng tôi qua',
    'th': 'หากต้องการใช้สิทธิ์เหล่านี้ โปรดติดต่อเราผ่าน',
    'zh-CN': '要行使任何这些权利，请通过以下方式联系我们：',
    'zh-TW': '要行使任何這些權利，請透過以下方式聯繫我們：',
    'ja': 'これらの権利を行使するには、以下からお問い合わせください：',
    'ko': '이러한 권리를 행사하려면 다음을 통해 연락해 주세요:',
})

k('privacy.yourRights.contactPage', {
    'en': 'Contact page', 'es': 'Página de contacto', 'fr': 'Page de contact',
    'de': 'Kontaktseite', 'it': 'Pagina di contatto', 'pt': 'Página de contato',
    'ru': 'Страница контактов', 'ar': 'صفحة الاتصال', 'hi': 'संपर्क पृष्ठ',
    'tr': 'İletişim sayfası', 'nl': 'Contactpagina', 'pl': 'Strona kontaktowa',
    'sv': 'Kontaktsida', 'id': 'Halaman kontak', 'vi': 'Trang liên hệ',
    'th': 'หน้าติดต่อ', 'zh-CN': '联系页面', 'zh-TW': '聯絡頁面',
    'ja': 'お問い合わせページ', 'ko': '연락처 페이지',
})

# ── Children's Privacy ─────────────────────────────────────────────────────
k('privacy.childrensPrivacy.p1', {
    'en': 'This site is intended for general audiences. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.',
    'es': 'Este sitio está dirigido al público general. No recopilamos intencionalmente información personal de menores de 13 años. Si crees que un menor nos ha proporcionado información personal, contáctanos y la eliminaremos de inmediato.',
    'fr': 'Ce site est destiné au grand public. Nous ne collectons pas sciemment d\'informations personnelles auprès d\'enfants de moins de 13 ans. Si vous pensez qu\'un enfant nous a fourni des informations personnelles, veuillez nous contacter et nous les supprimerons rapidement.',
    'de': 'Diese Website richtet sich an die allgemeine Öffentlichkeit. Wir sammeln wissentlich keine personenbezogenen Daten von Kindern unter 13 Jahren. Wenn Sie glauben, dass ein Kind uns persönliche Daten übermittelt hat, kontaktieren Sie uns bitte und wir werden diese umgehend löschen.',
    'it': 'Questo sito è destinato al pubblico generico. Non raccogliamo consapevolmente informazioni personali da minori di 13 anni. Se ritieni che un bambino ci abbia fornito informazioni personali, contattaci e le elimineremo prontamente.',
    'pt': 'Este site é destinado ao público geral. Não coletamos conscientemente informações pessoais de crianças menores de 13 anos. Se você acredita que uma criança nos forneceu informações pessoais, entre em contato conosco e as excluiremos prontamente.',
    'ru': 'Этот сайт предназначен для широкой аудитории. Мы сознательно не собираем персональную информацию у детей младше 13 лет. Если вы считаете, что ребёнок предоставил нам персональную информацию, свяжитесь с нами, и мы оперативно удалим её.',
    'ar': 'هذا الموقع مخصص للجمهور العام. لا نجمع عن قصد معلومات شخصية من الأطفال دون سن 13 عامًا. إذا كنت تعتقد أن طفلاً قدم لنا معلومات شخصية، يرجى الاتصال بنا وسنحذفها على الفور.',
    'hi': 'यह साइट सामान्य दर्शकों के लिए है। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते। यदि आपको लगता है कि किसी बच्चे ने हमें व्यक्तिगत जानकारी प्रदान की है, तो कृपया हमसे संपर्क करें और हम इसे तुरंत हटा देंगे।',
    'tr': 'Bu site genel izleyiciler için tasarlanmıştır. 13 yaşın altındaki çocuklardan bilerek kişisel bilgi toplamıyoruz. Bir çocuğun bize kişisel bilgi sağladığına inanıyorsanız, lütfen bizimle iletişime geçin, derhal sileceğiz.',
    'nl': 'Deze site is bedoeld voor een breed publiek. Wij verzamelen niet bewust persoonlijke informatie van kinderen onder de 13 jaar. Als u denkt dat een kind ons persoonlijke informatie heeft verstrekt, neem dan contact met ons op en wij zullen deze onmiddellijk verwijderen.',
    'pl': 'Ta strona jest przeznaczona dla ogólnej publiczności. Nie zbieramy świadomie danych osobowych od dzieci poniżej 13 roku życia. Jeśli uważasz, że dziecko dostarczyło nam dane osobowe, skontaktuj się z nami, a niezwłocznie je usuniemy.',
    'sv': 'Denna webbplats riktar sig till allmänheten. Vi samlar inte medvetet in personuppgifter från barn under 13 år. Om du tror att ett barn har gett oss personuppgifter, vänligen kontakta oss så raderar vi dem omedelbart.',
    'id': 'Situs ini ditujukan untuk audiens umum. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah usia 13 tahun. Jika Anda yakin seorang anak telah memberikan informasi pribadi kepada kami, silakan hubungi kami dan kami akan segera menghapusnya.',
    'vi': 'Trang web này dành cho đối tượng chung. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn tin rằng trẻ em đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ và chúng tôi sẽ xóa ngay.',
    'th': 'เว็บไซต์นี้มีไว้สำหรับผู้ชมทั่วไป เราไม่ได้รวบรวมข้อมูลส่วนบุคคลจากเด็กอายุต่ำกว่า 13 ปีโดยเจตนา หากคุณเชื่อว่าเด็กได้ให้ข้อมูลส่วนบุคคลแก่เรา โปรดติดต่อเราแล้วเราจะลบข้อมูลนั้นทันที',
    'zh-CN': '本网站面向普通受众。我们不会有意收集 13 岁以下儿童的个人信息。如果您认为儿童向我们提供了个人信息，请联系我们，我们将立即删除。',
    'zh-TW': '本網站面向一般受眾。我們不會有意收集 13 歲以下兒童的個人資訊。如果您認為兒童向我們提供了個人資訊，請聯繫我們，我們將立即刪除。',
    'ja': '当サイトは一般の方を対象としています。13歳未満のお子様から意図的に個人情報を収集することはありません。お子様が当サイトに個人情報を提供したと思われる場合は、お問い合わせください。速やかに削除いたします。',
    'ko': '이 사이트는 일반 사용자를 대상으로 합니다. 13세 미만 아동의 개인 정보를 고의로 수집하지 않습니다. 아동이 개인 정보를 제공했다고 판단되면 연락해 주시면 즉시 삭제하겠습니다.',
})

k('privacy.childrensPrivacy.p2', {
    'en': 'The Kids Mode feature filters games by difficulty level (Easy only) and is a display preference stored locally in the browser — it does not involve any data collection.',
    'es': 'La función Modo Niños filtra juegos por nivel de dificultad (solo Fácil) y es una preferencia de visualización almacenada localmente en el navegador — no implica ninguna recopilación de datos.',
    'fr': 'La fonctionnalité Mode Enfants filtre les jeux par niveau de difficulté (Facile uniquement) et est une préférence d\'affichage stockée localement dans le navigateur — elle n\'implique aucune collecte de données.',
    'de': 'Die Kindermodus-Funktion filtert Spiele nach Schwierigkeitsgrad (nur Leicht) und ist eine Anzeigeeinstellung, die lokal im Browser gespeichert wird — sie beinhaltet keine Datenerfassung.',
    'it': 'La funzione Modalità Bambini filtra i giochi per livello di difficoltà (solo Facile) ed è una preferenza di visualizzazione memorizzata localmente nel browser — non comporta alcuna raccolta dati.',
    'pt': 'O recurso Modo Crianças filtra jogos por nível de dificuldade (apenas Fácil) e é uma preferência de exibição armazenada localmente no navegador — não envolve nenhuma coleta de dados.',
    'ru': 'Функция «Детский режим» фильтрует игры по уровню сложности (только лёгкие) и является настройкой отображения, хранящейся локально в браузере — она не предполагает сбора данных.',
    'ar': 'تعمل ميزة وضع الأطفال على تصفية الألعاب حسب مستوى الصعوبة (سهل فقط) وهي تفضيل عرض مخزن محليًا في المتصفح — ولا تتضمن أي جمع للبيانات.',
    'hi': 'किड्स मोड सुविधा कठिनाई स्तर (केवल आसान) के अनुसार गेम फ़िल्टर करती है और ब्राउज़र में स्थानीय रूप से संग्रहीत एक प्रदर्शन प्राथमिकता है — इसमें कोई डेटा संग्रह शामिल नहीं है।',
    'tr': 'Çocuk Modu özelliği oyunları zorluk seviyesine göre filtreler (yalnızca Kolay) ve tarayıcıda yerel olarak depolanan bir görüntüleme tercihidir — herhangi bir veri toplama içermez.',
    'nl': 'De Kindermodus-functie filtert spellen op moeilijkheidsgraad (alleen Makkelijk) en is een weergavevoorkeur die lokaal in de browser wordt opgeslagen — er vindt geen gegevensverzameling plaats.',
    'pl': 'Funkcja Tryb Dziecięcy filtruje gry według poziomu trudności (tylko Łatwe) i jest preferencją wyświetlania przechowywaną lokalnie w przeglądarce — nie obejmuje żadnego zbierania danych.',
    'sv': 'Barnlägesfunktionen filtrerar spel efter svårighetsgrad (endast Lätt) och är en visningsinställning som lagras lokalt i webbläsaren — den involverar ingen datainsamling.',
    'id': 'Fitur Mode Anak memfilter game berdasarkan tingkat kesulitan (hanya Mudah) dan merupakan preferensi tampilan yang disimpan secara lokal di browser — tidak melibatkan pengumpulan data apa pun.',
    'vi': 'Tính năng Chế độ Trẻ em lọc trò chơi theo mức độ khó (chỉ Dễ) và là tùy chọn hiển thị được lưu cục bộ trong trình duyệt — không liên quan đến việc thu thập dữ liệu.',
    'th': 'ฟีเจอร์โหมดเด็กกรองเกมตามระดับความยาก (ง่ายเท่านั้น) และเป็นการตั้งค่าการแสดงผลที่จัดเก็บในเบราว์เซอร์ — ไม่เกี่ยวข้องกับการรวบรวมข้อมูลใด ๆ',
    'zh-CN': '儿童模式功能按难度级别筛选游戏（仅限简单），这是存储在浏览器本地的显示偏好——不涉及任何数据收集。',
    'zh-TW': '兒童模式功能按難度級別篩選遊戲（僅限簡單），這是儲存在瀏覽器本機的顯示偏好——不涉及任何資料收集。',
    'ja': 'キッズモード機能は難易度（簡単のみ）でゲームをフィルタリングするもので、ブラウザにローカルに保存される表示設定です。データ収集は一切行いません。',
    'ko': '키즈 모드 기능은 난이도(쉬움만)별로 게임을 필터링하며, 브라우저에 로컬로 저장되는 표시 환경설정입니다. 데이터 수집은 포함되지 않습니다.',
})

# ── Changes ────────────────────────────────────────────────────────────────
k('privacy.changes.p1', {
    'en': 'We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of the site after changes constitutes acceptance of the updated policy.',
    'es': 'Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando lo hagamos, actualizaremos la fecha de "Última actualización" en la parte superior de esta página. El uso continuado del sitio después de los cambios constituye la aceptación de la política actualizada.',
    'fr': 'Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. Lorsque nous le faisons, nous mettrons à jour la date de « Dernière mise à jour » en haut de cette page. L\'utilisation continue du site après les modifications constitue l\'acceptation de la politique mise à jour.',
    'de': 'Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wenn wir dies tun, aktualisieren wir das Datum „Zuletzt aktualisiert" am Anfang dieser Seite. Die fortgesetzte Nutzung der Website nach Änderungen gilt als Zustimmung zur aktualisierten Richtlinie.',
    'it': 'Potremmo aggiornare questa Informativa sulla Privacy di tanto in tanto. In tal caso, aggiorneremo la data "Ultimo aggiornamento" in cima a questa pagina. L\'uso continuato del sito dopo le modifiche costituisce accettazione dell\'informativa aggiornata.',
    'pt': 'Podemos atualizar esta Política de Privacidade de tempos em tempos. Quando o fizermos, atualizaremos a data de "Última atualização" no topo desta página. O uso continuado do site após alterações constitui aceitação da política atualizada.',
    'ru': 'Мы можем время от времени обновлять эту Политику конфиденциальности. При этом мы обновим дату «Последнее обновление» в верхней части этой страницы. Продолжение использования сайта после изменений означает принятие обновлённой политики.',
    'ar': 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. عندما نفعل ذلك، سنحدّث تاريخ "آخر تحديث" في أعلى هذه الصفحة. يُعد الاستمرار في استخدام الموقع بعد التغييرات قبولاً للسياسة المحدّثة.',
    'hi': 'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। जब हम ऐसा करते हैं, तो हम इस पृष्ठ के शीर्ष पर "अंतिम अपडेट" तिथि को अपडेट करेंगे। परिवर्तनों के बाद साइट का निरंतर उपयोग अद्यतन नीति की स्वीकृति माना जाएगा।',
    'tr': 'Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Bunu yaptığımızda, bu sayfanın üst kısmındaki "Son güncelleme" tarihini güncelleyeceğiz. Değişikliklerden sonra siteyi kullanmaya devam etmeniz, güncellenen politikayı kabul ettiğiniz anlamına gelir.',
    'nl': 'We kunnen dit Privacybeleid van tijd tot tijd bijwerken. Wanneer we dat doen, werken we de datum "Laatst bijgewerkt" bovenaan deze pagina bij. Voortgezet gebruik van de site na wijzigingen houdt aanvaarding van het bijgewerkte beleid in.',
    'pl': 'Możemy od czasu do czasu aktualizować tę Politykę Prywatności. Gdy to zrobimy, zaktualizujemy datę „Ostatnia aktualizacja" na górze tej strony. Dalsze korzystanie ze strony po zmianach oznacza akceptację zaktualizowanej polityki.',
    'sv': 'Vi kan uppdatera denna integritetspolicy från tid till annan. När vi gör det uppdaterar vi datumet "Senast uppdaterad" högst upp på denna sida. Fortsatt användning av webbplatsen efter ändringar utgör godkännande av den uppdaterade policyn.',
    'id': 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Ketika kami melakukannya, kami akan memperbarui tanggal "Terakhir diperbarui" di bagian atas halaman ini. Penggunaan situs yang berkelanjutan setelah perubahan merupakan penerimaan atas kebijakan yang diperbarui.',
    'vi': 'Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Khi làm vậy, chúng tôi sẽ cập nhật ngày "Cập nhật lần cuối" ở đầu trang này. Việc tiếp tục sử dụng trang web sau các thay đổi đồng nghĩa với việc chấp nhận chính sách đã cập nhật.',
    'th': 'เราอาจอัปเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว เมื่อทำเช่นนั้น เราจะอัปเดตวันที่ "อัปเดตล่าสุด" ที่ด้านบนของหน้านี้ การใช้เว็บไซต์ต่อไปหลังจากการเปลี่ยนแปลงถือว่ายอมรับนโยบายที่อัปเดต',
    'zh-CN': '我们可能会不时更新本隐私政策。届时，我们将更新本页面顶部的"最后更新"日期。在更改后继续使用本网站即表示接受更新后的政策。',
    'zh-TW': '我們可能會不時更新本隱私政策。屆時，我們將更新本頁面頂部的「最後更新」日期。在變更後繼續使用本網站即表示接受更新後的政策。',
    'ja': '当サイトはこのプライバシーポリシーを随時更新する場合があります。その際、本ページ上部の「最終更新日」を更新します。変更後もサイトを継続して使用した場合、更新されたポリシーに同意したものとみなされます。',
    'ko': '이 개인정보처리방침을 수시로 업데이트할 수 있습니다. 그럴 경우 이 페이지 상단의 "최종 업데이트" 날짜를 업데이트합니다. 변경 후 사이트를 계속 사용하면 업데이트된 정책에 동의하는 것입니다.',
})

# ── Contact ────────────────────────────────────────────────────────────────
k('privacy.contact.p1', {
    'en': 'If you have any questions about this Privacy Policy or how we handle your data, please use our',
    'es': 'Si tienes alguna pregunta sobre esta Política de Privacidad o cómo manejamos tus datos, utiliza nuestra',
    'fr': 'Si vous avez des questions sur cette Politique de Confidentialité ou sur la façon dont nous traitons vos données, veuillez utiliser notre',
    'de': 'Wenn Sie Fragen zu dieser Datenschutzrichtlinie oder zum Umgang mit Ihren Daten haben, nutzen Sie bitte unsere',
    'it': 'Se hai domande su questa Informativa sulla Privacy o su come trattiamo i tuoi dati, utilizza la nostra',
    'pt': 'Se você tiver alguma dúvida sobre esta Política de Privacidade ou como tratamos seus dados, por favor use nossa',
    'ru': 'Если у вас есть вопросы об этой Политике конфиденциальности или о том, как мы обрабатываем ваши данные, пожалуйста, используйте нашу',
    'ar': 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو كيفية تعاملنا مع بياناتك، يرجى استخدام',
    'hi': 'यदि आपके पास इस गोपनीयता नीति या हम आपके डेटा को कैसे संभालते हैं, इसके बारे में कोई प्रश्न हैं, तो कृपया हमारे',
    'tr': 'Bu Gizlilik Politikası veya verilerinizi nasıl işlediğimiz hakkında sorularınız varsa, lütfen',
    'nl': 'Als u vragen heeft over dit Privacybeleid of hoe wij met uw gegevens omgaan, gebruik dan onze',
    'pl': 'Jeśli masz pytania dotyczące tej Polityki Prywatności lub sposobu, w jaki obchodzimy się z Twoimi danymi, skorzystaj z naszej',
    'sv': 'Om du har frågor om denna integritetspolicy eller hur vi hanterar dina uppgifter, vänligen använd vår',
    'id': 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau cara kami menangani data Anda, silakan gunakan',
    'vi': 'Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc cách chúng tôi xử lý dữ liệu của bạn, vui lòng sử dụng',
    'th': 'หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้หรือวิธีที่เราจัดการข้อมูลของคุณ กรุณาใช้',
    'zh-CN': '如果您对本隐私政策或我们如何处理您的数据有任何疑问，请使用我们的',
    'zh-TW': '如果您對本隱私政策或我們如何處理您的資料有任何疑問，請使用我們的',
    'ja': 'このプライバシーポリシーやデータの取り扱いについてご質問がある場合は、',
    'ko': '이 개인정보처리방침이나 데이터 처리 방법에 대해 질문이 있으시면',
})

k('privacy.contact.p2', {
    'en': 'For formal data protection enquiries (GDPR, CCPA, etc.), please include "Data Protection" in your message subject.',
    'es': 'Para consultas formales de protección de datos (RGPD, CCPA, etc.), incluye "Protección de Datos" en el asunto de tu mensaje.',
    'fr': 'Pour les demandes formelles de protection des données (RGPD, CCPA, etc.), veuillez inclure « Protection des données » dans l\'objet de votre message.',
    'de': 'Für formelle Datenschutzanfragen (DSGVO, CCPA usw.) geben Sie bitte „Datenschutz" im Betreff Ihrer Nachricht an.',
    'it': 'Per richieste formali di protezione dei dati (GDPR, CCPA, ecc.), includi "Protezione Dati" nell\'oggetto del tuo messaggio.',
    'pt': 'Para consultas formais de proteção de dados (LGPD, GDPR, CCPA, etc.), inclua "Proteção de Dados" no assunto da sua mensagem.',
    'ru': 'Для официальных запросов о защите данных (GDPR, CCPA и т.д.) укажите «Защита данных» в теме сообщения.',
    'ar': 'للاستفسارات الرسمية حول حماية البيانات (GDPR، CCPA، إلخ)، يرجى تضمين "حماية البيانات" في موضوع رسالتك.',
    'hi': 'औपचारिक डेटा सुरक्षा पूछताछ (GDPR, CCPA, आदि) के लिए, कृपया अपने संदेश के विषय में "डेटा सुरक्षा" शामिल करें।',
    'tr': 'Resmi veri koruma talepleri (GDPR, CCPA vb.) için lütfen mesajınızın konusuna "Veri Koruma" yazın.',
    'nl': 'Voor formele verzoeken over gegevensbescherming (AVG, CCPA, enz.) vermeld dan "Gegevensbescherming" in het onderwerp van uw bericht.',
    'pl': 'W przypadku formalnych zapytań dotyczących ochrony danych (RODO, CCPA itp.) prosimy o umieszczenie „Ochrona danych" w temacie wiadomości.',
    'sv': 'För formella dataskyddsförfrågningar (GDPR, CCPA, etc.) vänligen inkludera "Dataskydd" i ämnesraden för ditt meddelande.',
    'id': 'Untuk pertanyaan perlindungan data formal (GDPR, CCPA, dll.), harap sertakan "Perlindungan Data" di subjek pesan Anda.',
    'vi': 'Đối với các yêu cầu chính thức về bảo vệ dữ liệu (GDPR, CCPA, v.v.), vui lòng ghi "Bảo vệ Dữ liệu" trong tiêu đề tin nhắn của bạn.',
    'th': 'สำหรับการสอบถามเกี่ยวกับการคุ้มครองข้อมูลอย่างเป็นทางการ (GDPR, CCPA ฯลฯ) กรุณาระบุ "การคุ้มครองข้อมูล" ในหัวข้อข้อความของคุณ',
    'zh-CN': '如需正式的数据保护咨询（GDPR、CCPA 等），请在消息主题中包含"数据保护"。',
    'zh-TW': '如需正式的資料保護諮詢（GDPR、CCPA 等），請在訊息主題中包含「資料保護」。',
    'ja': 'データ保護に関する正式なお問い合わせ（GDPR、CCPA等）の場合は、メッセージの件名に「データ保護」を含めてください。',
    'ko': '공식 데이터 보호 문의(GDPR, CCPA 등)의 경우 메시지 제목에 "데이터 보호"를 포함해 주세요.',
})

# ── Disclaimer text ────────────────────────────────────────────────────────
k('privacy.disclaimerText', {
    'en': 'All Google Doodle games featured on this site are the intellectual property of Google LLC. Doodle Games Hub is an independent fan site created for educational and entertainment purposes. We do not claim ownership of any game content. If you are a rights holder and have concerns about content on this site, please',
    'es': 'Todos los juegos de Google Doodle presentados en este sitio son propiedad intelectual de Google LLC. Doodle Games Hub es un sitio de fans independiente creado con fines educativos y de entretenimiento. No reclamamos la propiedad de ningún contenido de juegos. Si eres titular de derechos y tienes inquietudes sobre el contenido de este sitio, por favor',
    'fr': 'Tous les jeux Google Doodle présentés sur ce site sont la propriété intellectuelle de Google LLC. Doodle Games Hub est un site de fans indépendant créé à des fins éducatives et de divertissement. Nous ne revendiquons la propriété d\'aucun contenu de jeu. Si vous êtes titulaire de droits et avez des préoccupations concernant le contenu de ce site, veuillez',
    'de': 'Alle auf dieser Website vorgestellten Google-Doodle-Spiele sind geistiges Eigentum von Google LLC. Doodle Games Hub ist eine unabhängige Fan-Website, die zu Bildungs- und Unterhaltungszwecken erstellt wurde. Wir erheben keinen Eigentumsanspruch auf Spielinhalte. Wenn Sie Rechteinhaber sind und Bedenken bezüglich der Inhalte dieser Website haben, bitte',
    'it': 'Tutti i giochi Google Doodle presenti su questo sito sono proprietà intellettuale di Google LLC. Doodle Games Hub è un sito di fan indipendente creato a scopo educativo e di intrattenimento. Non rivendichiamo la proprietà di alcun contenuto di gioco. Se sei un titolare di diritti e hai preoccupazioni riguardo ai contenuti di questo sito, per favore',
    'pt': 'Todos os jogos do Google Doodle apresentados neste site são propriedade intelectual do Google LLC. Doodle Games Hub é um site de fãs independente criado para fins educacionais e de entretenimento. Não reivindicamos a propriedade de nenhum conteúdo de jogo. Se você é titular de direitos e tem preocupações sobre o conteúdo deste site, por favor',
    'ru': 'Все игры Google Doodle, представленные на этом сайте, являются интеллектуальной собственностью Google LLC. Doodle Games Hub — независимый фан-сайт, созданный в образовательных и развлекательных целях. Мы не претендуем на владение каким-либо игровым контентом. Если вы являетесь правообладателем и имеете претензии к контенту на этом сайте, пожалуйста,',
    'ar': 'جميع ألعاب Google Doodle المعروضة على هذا الموقع هي ملكية فكرية لشركة Google LLC. Doodle Games Hub هو موقع معجبين مستقل تم إنشاؤه لأغراض تعليمية وترفيهية. نحن لا ندعي ملكية أي محتوى ألعاب. إذا كنت صاحب حقوق ولديك مخاوف بشأن المحتوى على هذا الموقع، يرجى',
    'hi': 'इस साइट पर प्रदर्शित सभी Google Doodle गेम्स Google LLC की बौद्धिक संपदा हैं। Doodle Games Hub शैक्षिक और मनोरंजन उद्देश्यों के लिए बनाई गई एक स्वतंत्र प्रशंसक साइट है। हम किसी भी गेम सामग्री पर स्वामित्व का दावा नहीं करते। यदि आप अधिकार धारक हैं और इस साइट की सामग्री के बारे में चिंतित हैं, तो कृपया',
    'tr': 'Bu sitede yer alan tüm Google Doodle oyunları Google LLC\'nin fikri mülkiyetidir. Doodle Games Hub, eğitim ve eğlence amaçlı oluşturulmuş bağımsız bir hayran sitesidir. Hiçbir oyun içeriği üzerinde mülkiyet iddiasında bulunmuyoruz. Hak sahibiyseniz ve bu sitedeki içerikle ilgili endişeleriniz varsa, lütfen',
    'nl': 'Alle Google Doodle-spellen op deze site zijn intellectueel eigendom van Google LLC. Doodle Games Hub is een onafhankelijke fansite gemaakt voor educatieve en entertainmentdoeleinden. Wij claimen geen eigendom van spelinhoud. Als u een rechthebbende bent en zorgen heeft over inhoud op deze site,',
    'pl': 'Wszystkie gry Google Doodle prezentowane na tej stronie są własnością intelektualną Google LLC. Doodle Games Hub to niezależna strona fanowska stworzona w celach edukacyjnych i rozrywkowych. Nie rościmy sobie prawa własności do żadnej zawartości gier. Jeśli jesteś posiadaczem praw i masz obawy dotyczące treści na tej stronie, proszę',
    'sv': 'Alla Google Doodle-spel som visas på denna webbplats är Google LLC:s immateriella egendom. Doodle Games Hub är en oberoende fansida skapad i utbildnings- och underhållningssyfte. Vi gör inga anspråk på äganderätt till spelinnehåll. Om du är rättighetsinnehavare och har farhågor om innehåll på denna webbplats, vänligen',
    'id': 'Semua game Google Doodle yang ditampilkan di situs ini adalah kekayaan intelektual Google LLC. Doodle Games Hub adalah situs penggemar independen yang dibuat untuk tujuan pendidikan dan hiburan. Kami tidak mengklaim kepemilikan atas konten game apa pun. Jika Anda adalah pemegang hak dan memiliki kekhawatiran tentang konten di situs ini, silakan',
    'vi': 'Tất cả trò chơi Google Doodle được giới thiệu trên trang web này là tài sản trí tuệ của Google LLC. Doodle Games Hub là trang web người hâm mộ độc lập được tạo cho mục đích giáo dục và giải trí. Chúng tôi không tuyên bố quyền sở hữu bất kỳ nội dung trò chơi nào. Nếu bạn là chủ sở hữu quyền và có lo ngại về nội dung trên trang web này, vui lòng',
    'th': 'เกม Google Doodle ทั้งหมดที่นำเสนอบนเว็บไซต์นี้เป็นทรัพย์สินทางปัญญาของ Google LLC Doodle Games Hub เป็นเว็บไซต์แฟนไซต์อิสระที่สร้างขึ้นเพื่อวัตถุประสงค์ทางการศึกษาและความบันเทิง เราไม่อ้างสิทธิ์ความเป็นเจ้าของเนื้อหาเกมใด ๆ หากคุณเป็นเจ้าของสิทธิ์และมีข้อกังวลเกี่ยวกับเนื้อหาบนเว็บไซต์นี้ กรุณา',
    'zh-CN': '本网站展示的所有 Google Doodle 游戏均为 Google LLC 的知识产权。Doodle Games Hub 是一个为教育和娱乐目的创建的独立粉丝网站。我们不主张对任何游戏内容的所有权。如果您是权利持有人并对本网站内容有疑虑，请',
    'zh-TW': '本網站展示的所有 Google Doodle 遊戲均為 Google LLC 的智慧財產權。Doodle Games Hub 是一個為教育和娛樂目的建立的獨立粉絲網站。我們不主張對任何遊戲內容的所有權。如果您是權利持有人並對本網站內容有疑慮，請',
    'ja': '当サイトで紹介されているすべての Google Doodle ゲームは Google LLC の知的財産です。Doodle Games Hub は教育・娯楽目的で作成された独立したファンサイトです。ゲームコンテンツの所有権を主張するものではありません。権利者の方でサイトのコンテンツについて懸念がある場合は、',
    'ko': '이 사이트에 소개된 모든 Google Doodle 게임은 Google LLC의 지적 재산입니다. Doodle Games Hub는 교육 및 엔터테인먼트 목적으로 만들어진 독립적인 팬 사이트입니다. 게임 콘텐츠에 대한 소유권을 주장하지 않습니다. 권리 보유자이시고 이 사이트의 콘텐츠에 대해 우려가 있으시면',
})

k('privacy.disclaimerContact', {
    'en': 'contact us', 'es': 'contáctanos', 'fr': 'contactez-nous', 'de': 'kontaktieren Sie uns',
    'it': 'contattaci', 'pt': 'entre em contato', 'ru': 'свяжитесь с нами', 'ar': 'اتصل بنا',
    'hi': 'हमसे संपर्क करें', 'tr': 'bizimle iletişime geçin', 'nl': 'neem contact met ons op',
    'pl': 'skontaktuj się z nami', 'sv': 'kontakta oss', 'id': 'hubungi kami', 'vi': 'liên hệ với chúng tôi',
    'th': 'ติดต่อเรา', 'zh-CN': '联系我们', 'zh-TW': '聯繫我們', 'ja': 'お問い合わせください', 'ko': '문의해 주세요',
})

k('privacy.disclaimerEnd', {
    'en': 'and we will respond promptly.',
    'es': 'y responderemos con prontitud.',
    'fr': 'et nous répondrons rapidement.',
    'de': 'und wir werden umgehend antworten.',
    'it': 'e risponderemo prontamente.',
    'pt': 'e responderemos prontamente.',
    'ru': 'и мы оперативно ответим.',
    'ar': 'وسنرد بسرعة.',
    'hi': 'और हम तुरंत जवाब देंगे।',
    'tr': 've en kısa sürede yanıt vereceğiz.',
    'nl': 'en wij zullen snel reageren.',
    'pl': 'a my odpowiemy niezwłocznie.',
    'sv': 'och vi kommer att svara snabbt.',
    'id': 'dan kami akan segera merespons.',
    'vi': 'và chúng tôi sẽ phản hồi nhanh chóng.',
    'th': 'และเราจะตอบกลับโดยเร็ว',
    'zh-CN': '我们将及时回复。',
    'zh-TW': '我們將及時回覆。',
    'ja': '速やかに対応いたします。',
    'ko': '신속하게 답변드리겠습니다.',
})

# ────────────────────────────────────────────────────────────────────────────
# 2. Read the file and inject translations
# ────────────────────────────────────────────────────────────────────────────
print(f"Reading {FILE} …")
with open(FILE, 'r', encoding='utf-8') as f:
    text = f.read()
lines = text.split('\n')

# -- a) Add to TranslationKey type union ---------------------------------
# Find the line "  // Privacy extras"
priv_extras_idx = None
for i, ln in enumerate(lines):
    if "'privacy.legal'" in ln and "'privacy.disclaimer'" in ln and "'privacy.contents'" in ln:
        priv_extras_idx = i
        break

if priv_extras_idx is None:
    print("ERROR: Could not find '// Privacy extras' type line"); sys.exit(1)

new_type_lines = [
    "  // Privacy page body keys",
    "  | 'privacy.section.overview' | 'privacy.section.dataCollected' | 'privacy.section.cookies'",
    "  | 'privacy.section.thirdParties' | 'privacy.section.dataSecurity' | 'privacy.section.yourRights'",
    "  | 'privacy.section.childrensPrivacy' | 'privacy.section.changes' | 'privacy.section.contact'",
    "  | 'privacy.overview.p1' | 'privacy.overview.p2'",
    "  | 'privacy.dataCollected.intro' | 'privacy.dataCollected.localStorageTitle' | 'privacy.dataCollected.localStorageDesc'",
    "  | 'privacy.dataCollected.analyticsTitle' | 'privacy.dataCollected.analyticsDesc'",
    "  | 'privacy.dataCollected.contactFormTitle' | 'privacy.dataCollected.contactFormDesc'",
    "  | 'privacy.dataCollected.noCollect'",
    "  | 'privacy.cookies.p1' | 'privacy.cookies.p2' | 'privacy.cookies.p3' | 'privacy.cookies.p4'",
    "  | 'privacy.thirdParties.intro' | 'privacy.thirdParties.service' | 'privacy.thirdParties.purpose'",
    "  | 'privacy.thirdParties.privacyPolicy' | 'privacy.thirdParties.googlePurpose'",
    "  | 'privacy.thirdParties.glovPurpose' | 'privacy.thirdParties.fontsPurpose'",
    "  | 'privacy.thirdParties.seeTheirSite' | 'privacy.thirdParties.noSell'",
    "  | 'privacy.dataSecurity.p1' | 'privacy.dataSecurity.p2'",
    "  | 'privacy.yourRights.intro' | 'privacy.yourRights.access' | 'privacy.yourRights.accessDesc'",
    "  | 'privacy.yourRights.erasure' | 'privacy.yourRights.erasureDesc'",
    "  | 'privacy.yourRights.rectification' | 'privacy.yourRights.rectificationDesc'",
    "  | 'privacy.yourRights.object' | 'privacy.yourRights.objectDesc'",
    "  | 'privacy.yourRights.portability' | 'privacy.yourRights.portabilityDesc'",
    "  | 'privacy.yourRights.exerciseRights' | 'privacy.yourRights.contactPage'",
    "  | 'privacy.childrensPrivacy.p1' | 'privacy.childrensPrivacy.p2'",
    "  | 'privacy.changes.p1'",
    "  | 'privacy.contact.p1' | 'privacy.contact.p2'",
    "  | 'privacy.disclaimerText' | 'privacy.disclaimerContact' | 'privacy.disclaimerEnd'",
]

# Insert after the privacy extras line
lines = lines[:priv_extras_idx+1] + new_type_lines + lines[priv_extras_idx+1:]
print(f"  → Inserted {len(new_type_lines)} type lines after line {priv_extras_idx+1}")

# -- b) Build locale → variable-name mapping
LOCALE_VAR = {
    'en': 'EN', 'es': 'ES', 'fr': 'FR', 'de': 'DE', 'it': 'IT',
    'pt': 'PT', 'ru': 'RU', 'ar': 'AR', 'hi': 'HI', 'tr': 'TR',
    'nl': 'NL', 'pl': 'PL', 'sv': 'SV', 'id': 'ID', 'vi': 'VI',
    'th': 'TH', 'zh-CN': 'ZH_CN', 'zh-TW': 'ZH_TW', 'ja': 'JA', 'ko': 'KO',
}

def escape_ts(s: str) -> str:
    """Escape for a TS single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")

def build_entries(locale: str) -> list[str]:
    result = ["  // Privacy page body"]
    for key, translations in KEYS.items():
        val = translations[locale]
        result.append(f"  '{key}': '{escape_ts(val)}',")
    return result

# -- c) For each locale, find the 'privacy.contents' line and insert after it
for locale, var_name in LOCALE_VAR.items():
    marker = "'privacy.contents':"
    insert_idx = None
    # Find the correct occurrence within this locale block
    # We know the locale blocks are in order, so find the block start first
    block_start = None
    for i, ln in enumerate(lines):
        if ln.strip().startswith(f"const {var_name}: TranslationMap") or ln.strip().startswith(f"const {var_name} :"):
            block_start = i
            break
    
    if block_start is None:
        # Try alternate search
        for i, ln in enumerate(lines):
            if f"const {var_name}:" in ln and 'TranslationMap' in ln:
                block_start = i
                break
    
    if block_start is None:
        print(f"  WARNING: Could not find block start for {var_name} ({locale}), skipping")
        continue
    
    # Now find 'privacy.contents' after block_start
    for i in range(block_start, min(block_start + 600, len(lines))):
        if marker in lines[i]:
            insert_idx = i
            break
    
    if insert_idx is None:
        print(f"  WARNING: Could not find '{marker}' for {var_name} ({locale}), skipping")
        continue
    
    entries = build_entries(locale)
    lines = lines[:insert_idx+1] + entries + lines[insert_idx+1:]
    print(f"  → {var_name} ({locale}): inserted {len(entries)} entries after line {insert_idx+1}")

# -- d) Write back
text_out = '\n'.join(lines)
with open(FILE, 'w', encoding='utf-8') as f:
    f.write(text_out)

total_new = len(KEYS)
print(f"\n✅ Done! Added {total_new} new keys × 20 locales = {total_new * 20} translation entries.")
print(f"   File now has {len(lines)} lines (was {len(text.split(chr(10)))} lines).")
