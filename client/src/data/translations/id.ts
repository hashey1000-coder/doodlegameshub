import type { GameTranslation } from '../gameTranslations';

export const ID_GAMES: Record<string, GameTranslation> = {
  baseball: {
    title: 'Google Doodle Bisbol',
    description:
      `Mainkan game baseball Google Doodle langsung di browser kamu. Cetak home run dan pecahkan rekor dalam game retro yang seru ini.\n\nGame ini diluncurkan pada 4 Juli 2019 untuk merayakan Hari Kemerdekaan Amerika dan menjadi salah satu Doodle interaktif paling populer sepanjang masa.`,
    controls: 'Klik atau ketuk untuk mengayunkan pemukul. Perhatikan pelempar dan klik pada saat yang tepat untuk memukul bola. Bidik sweet spot untuk home run. Kamu punya tiga out per inning — atur waktu pukulanmu dengan hati-hati untuk mencetak skor sebanyak mungkin.',
  },
  'doodle-cricket-game': {
    title: 'Game Kriket Doodle',
    description:
      `Nikmati game kriket Google Doodle secara online dan gratis. Cetak skor tertinggi dan jadilah juara kriket dalam mini game yang adiktif ini.\n\nDoodle ini dirilis pada 2017 untuk merayakan turnamen ICC Champions Trophy dan mengenalkan kriket kepada audiens global.`,
    controls: 'Klik atau ketuk untuk memukul bola saat dilempar. Waktu adalah segalanya — memukul terlalu cepat atau lambat akan membuat kamu meleset. Pukul bola untuk mencetak run. Permainan berakhir saat semua wicket-mu jatuh. Cobalah mencetak run sebanyak mungkin sebelum kamu keluar.',
  },
  snake: {
    title: 'Google Snake — Game Ular',
    description:
      `Mainkan game ular klasik dari Google. Makan apel, tumbuh semakin panjang, dan hindari menabrak ekormu sendiri dalam game legendaris ini.\n\nGame ular pertama kali populer di ponsel Nokia pada 1998 dan telah menjadi ikon budaya game seluler di seluruh dunia.`,
    controls: 'Gunakan tombol panah atau WASD untuk mengarahkan ular. Makan buah yang muncul di papan untuk tumbuh dan mendapat poin. Hindari dinding atau ekormu sendiri — keduanya mengakhiri permainan. Ular bergerak terus-menerus, jadi rencanakan jalurmu ke depan. Di perangkat mobile, geser ke arah yang ingin kamu belokkan.',
  },
  pacman: {
    title: 'Google Pac-Man',
    description:
      `Rasakan kembali game klasik Pac-Man versi Google Doodle. Lahap semua titik, hindari hantu, dan raih skor tertinggi.\n\nDoodle Pac-Man dirilis pada 2010 untuk merayakan ulang tahun ke-30 game arcade legendaris ciptaan Namco tahun 1980.`,
    controls: 'Gunakan tombol panah untuk menggerakkan Pac-Man melalui labirin. Makan semua titik kecil untuk menyelesaikan level. Hindari empat hantu — menyentuh satu akan mengurangi nyawa. Makan pil power besar untuk mengubah hantu menjadi biru sementara sehingga kamu bisa memakannya untuk poin ekstra. Dalam mode dua pemain, pemain 2 menggunakan W/A/S/D.',
  },
  'champion-island-games': {
    title: 'Permainan Pulau Juara — Google Doodle',
    description:
      `Jelajahi Pulau Champion dalam game petualangan RPG dari Google. Hadapi para juara legendaris dalam tujuh mini game olahraga yang epik.\n\nDibuat untuk Olimpiade Tokyo 2020, Doodle ini menampilkan animasi karya Studio 4°C dan merayakan budaya serta mitologi Jepang.`,
    controls: 'Gunakan tombol panah untuk menggerakkan Lucky di sekitar pulau. Tekan Z atau klik untuk berinteraksi dengan karakter dan masuk ke mini game. Setiap olahraga memiliki kontrol unik yang ditampilkan di layar — misalnya menekan spasi berirama untuk maraton atau mengarahkan dan menembak di panahan. Jelajahi seluruh pulau untuk menemukan ketujuh juara.',
  },
  'magic-cat-academy': {
    title: 'Akademi Kucing Ajaib',
    description:
      `Bantu kucing ajaib Momo mengalahkan hantu dengan menggambar simbol. Game Halloween Google Doodle yang seru dan menggemaskan.\n\nDirilis pada Halloween 2016, game ini terinspirasi dari budaya kucing di internet dan menjadi salah satu Doodle Halloween paling dicintai.`,
    controls: 'Klik dan seret mouse (atau geser di ponsel) untuk menggambar simbol di atas setiap hantu yang mendekat. Gambar bentuk dengan tepat untuk mengusir hantu sebelum mencapai Momo. Hantu semakin cepat dan simbol semakin kompleks seiring kemajuanmu, jadi tetap waspada dan gambar dengan cepat.',
  },
  'garden-gnomes': {
    title: 'Kurcaci Taman — Google Doodle',
    description:
      `Lemparkan kurcaci taman sejauh mungkin dalam game Google Doodle yang menyenangkan ini. Bidik dengan tepat dan pecahkan rekor jarakmu.\n\nDoodle ini diluncurkan pada 2018 untuk merayakan sejarah kurcaci taman di Jerman yang dimulai sejak abad ke-19.`,
    controls: 'Klik atau tekan spasi untuk meluncurkan gnome dari katapel. Lengan berayun otomatis — luncurkan di sudut yang tepat untuk jarak maksimum. Di udara, klik lagi untuk mengaktifkan boost. Pantul dari jamur dan objek untuk melangkah lebih jauh. Tujuannya adalah meluncurkan gnome sejauh mungkin.',
  },
  minesweeper: {
    title: 'Google Penyapu Ranjau',
    description:
      `Mainkan game Minesweeper klasik versi Google. Buka kotak, hindari ranjau, dan uji kemampuan logikamu dalam game teka-teki ini.\n\nMinesweeper pertama kali diperkenalkan pada Windows 3.1 tahun 1992 dan menjadi game bawaan paling ikonik dalam sejarah komputer.`,
    controls: 'Klik kiri pada kotak untuk membukanya. Angka menunjukkan jumlah ranjau yang berdekatan. Klik kanan (atau tekan lama di ponsel) untuk menandai kotak yang dicurigai. Gunakan angka untuk menyimpulkan kotak aman secara logis. Buka semua kotak tanpa ranjau untuk menang — tapi mengklik ranjau mengakhiri permainan.',
  },
  'tic-tac-toe': {
    title: 'Google Tic-Tac-Toe — Permainan',
    description:
      `Tantang kecerdasan buatan Google dalam permainan Tic-Tac-Toe. Sejajarkan tiga simbol untuk menang dalam game strategi yang simpel namun adiktif.\n\nTic-Tac-Toe adalah salah satu permainan strategi tertua di dunia, dengan akar sejarah yang bisa ditelusuri hingga Mesir Kuno sekitar 1300 SM.`,
    controls: 'Klik pada kotak kosong mana saja di grid 3×3 untuk menempatkan tandamu (X atau O). Bergantian dengan lawanmu. Pemain pertama yang mendapat tiga tanda berturut-turut — horizontal, vertikal, atau diagonal — menang. Jika semua sembilan kotak terisi tanpa pemenang, hasilnya seri.',
  },
  feud: {
    title: 'Google Feud',
    description:
      `Tebak saran pencarian Google yang paling populer. Uji pengetahuanmu dalam game tebak-tebakan yang lucu dan penuh kejutan ini.\n\nGoogle Feud terinspirasi dari acara TV Family Feud dan memanfaatkan data autocomplete Google yang mencerminkan tren pencarian jutaan pengguna.`,
    controls: 'Ketik jawabanmu di kotak teks dan tekan Enter untuk mengirim. Kamu mencoba menebak saran autocomplete Google paling populer untuk frasa yang diberikan. Jawaban peringkat lebih tinggi bernilai lebih banyak poin. Kamu punya jumlah percobaan terbatas setiap ronde, jadi pikirkan jawaban terpopuler terlebih dahulu.',
  },
  halloween: {
    title: 'Google Doodle Halloween',
    description:
      `Rayakan Halloween dengan game Google Doodle spesial ini. Hadapi makhluk-makhluk menakutkan dalam petualangan yang seru dan meriah.\n\nGoogle telah merilis Doodle bertema Halloween setiap tahun sejak 2000, menjadikannya salah satu tradisi Doodle yang paling dinantikan.`,
    controls: 'Gunakan tombol panah atau WASD untuk menggerakkan hantumu di peta berhantu. Lewati api roh untuk mengumpulkannya, lalu kembali ke kuali timmu untuk menyerahkannya. Tabrak hantu musuh untuk mencuri koleksi mereka. Tim dengan api terbanyak saat waktu habis menang.',
  },
  'boba-bubble-tea': {
    title: 'Game Boba Tea Google',
    description:
      `Buat boba tea dalam game Google Doodle yang interaktif ini. Campur bahan-bahan dan racik minuman yang sempurna.\n\nDoodle ini dirilis pada 2024 untuk merayakan boba tea, minuman asal Taiwan yang telah menjadi fenomena kuliner global sejak 1980-an.`,
    controls: 'Klik atau ketuk setiap pilihan bahan untuk menyesuaikan minuman boba-mu. Ikuti setiap langkah: pilih dasar teh, lalu jenis susu, tingkat kemanisan, jumlah es, dan terakhir topping. Setelah setiap pilihan, opsi berikutnya muncul. Selesaikan minumanmu dan bagikan kreasimu.',
  },
  'google-cat-game': {
    title: 'Google Cat Game — Game Kucing',
    description:
      `Bermain dengan kucing Google dalam mini game yang menggemaskan. Doodle interaktif yang lucu dan menghibur untuk semua pecinta kucing.\n\nGame kucing Google merupakan bagian dari seri Magic Cat Academy yang terinspirasi dari kecintaan budaya internet terhadap kucing.`,
    controls: 'Klik dan seret untuk menggambar simbol di atas setiap hantu sebelum mencapai Momo. Tipe hantu baru memerlukan simbol yang lebih kompleks — perhatikan bentuk yang ditampilkan. Beberapa hantu bergerak lebih cepat, jadi prioritaskan ancaman terdekat. Gambar dengan cepat dan tepat untuk melindungi Momo.',
  },
  'no-internet-dinosaur-game-google-chrome-dino': {
    title: 'Game Dinosaurus Tanpa Internet (Google Chrome Dino)',
    description:
      `Game dinosaurus T-Rex Chrome yang terkenal, bisa dimainkan secara online. Lompati kaktus dan pecahkan skor tertinggimu.\n\nGame T-Rex tersembunyi di Chrome sejak 2014 dan dimainkan sekitar 270 juta kali setiap bulannya di seluruh dunia.`,
    controls: 'Tekan spasi atau panah atas untuk melompati kaktus. Tekan panah bawah untuk merunduk di bawah pterodactyl. Di ponsel, ketuk layar untuk melompat. Game dimulai dengan lambat dan terus mempercepat seiring skor bertambah. Tidak ada akhir — bertahan selama mungkin untuk skor tertinggi.',
  },
  't-rex-run-3d': {
    title: 'T-Rex Run 3D — Lari Dinosaurus 3D',
    description:
      `Rasakan game dinosaurus Chrome dalam versi 3D. Berlari, hindari rintangan, dan bertahan selama mungkin.\n\nVersi 3D ini merupakan reinterpretasi modern dari game Chrome Dino klasik, menambahkan dimensi baru pada gameplay endless runner.`,
    controls: 'Tekan spasi atau panah atas untuk melompati kaktus dan rintangan. Tekan panah bawah untuk merunduk. Dalam mode 3D, rintangan datang dari cakrawala — perkirakan jarak dengan baik sebelum melompat. Game secara bertahap mempercepat seiring kemajuan. Bidik skor tertinggi.',
  },
  'google-santa-tracker': {
    title: 'Google Santa Tracker — Lacak Sinterklas',
    description:
      `Ikuti perjalanan Sinterklas keliling dunia dengan Google Santa Tracker. Mainkan mini game meriah dan rayakan Natal bersama.\n\nGoogle Santa Tracker dimulai pada 2004 dan telah menjadi tradisi tahunan yang menghibur jutaan keluarga di seluruh dunia selama musim liburan.`,
    controls: 'Klik bangunan dan karakter di desa meriah untuk memulai berbagai mini game dan aktivitas. Setiap mini game memiliki kontrol sendiri yang ditampilkan di layar. Gunakan mouse untuk menavigasi peta dan menjelajahi semua yang ditawarkan desa Santa.',
  },
  'blob-opera-google-game': {
    title: 'Blob Opera — Game Google',
    description:
      `Ciptakan musik opera dengan blob warna-warni dalam game Google yang interaktif ini. Buat melodi unik dan menyenangkan.\n\nBlob Opera diciptakan oleh David Li menggunakan machine learning yang dilatih dari suara empat penyanyi opera sungguhan.`,
    controls: 'Klik dan seret blob mana saja ke atas atau bawah untuk mengubah nadanya — lebih tinggi berarti nada lebih tinggi. Seret ke kiri atau kanan untuk mengubah suara vokal. Keempat blob secara otomatis berharmoni secara real-time menggunakan machine learning. Coba kombinasi berbeda untuk menciptakan karya opera yang indah.',
  },
  'space-invaders-google': {
    title: 'Space Invaders dari Google',
    description:
      `Lindungi Bumi dari penjajah luar angkasa dalam versi Google Space Invaders. Game arkade klasik yang dihadirkan kembali.\n\nSpace Invaders asli dirilis oleh Taito pada 1978 dan menjadi salah satu game arcade paling berpengaruh dalam sejarah industri video game.`,
    controls: 'Gunakan panah kiri dan kanan untuk menggerakkan meriam. Tekan spasi untuk menembak. Hancurkan semua penyerbu luar angkasa sebelum mereka mencapai dasar layar. Berlindung di balik penghalang yang bisa dihancurkan — tapi hati-hati, tembakan musuh mengikisnya. Penyerbu mempercepat saat jumlahnya berkurang.',
  },
  'celebrating-petanque': {
    title: 'Merayakan Pétanque',
    description:
      `Rayakan olahraga pétanque dengan Google Doodle ini. Lempar bolamu sedekat mungkin ke bola target dalam game ketepatan yang seru.\n\nPétanque berasal dari Provence, Prancis pada awal abad ke-20 dan kini dimainkan di lebih dari 80 negara di seluruh dunia.`,
    controls: 'Klik dan tahan untuk membidik, lalu seret untuk menyesuaikan kekuatan. Lepaskan untuk melempar bolamu ke arah cochonnet (bola target kecil). Cobalah menempatkan bolamu lebih dekat ke cochonnet daripada bola lawanmu. Kamu bisa secara strategis menabrak bola lawan menjauh. Pemain terdekat ke cochonnet memenangkan ronde.',
  },
  'dino-swords': {
    title: 'Dino Swords — Pedang Dinosaurus',
    description:
      `Mainkan game dinosaurus Chrome dengan senjata. Gunakan pedang, senjata api, dan perisai untuk menghancurkan rintangan di jalanmu.\n\nGame ini merupakan modifikasi kreatif dari Chrome Dino yang menambahkan elemen aksi, menunjukkan bagaimana komunitas gamer menginspirasi variasi game baru.`,
    controls: 'Tekan spasi atau panah atas untuk melompat. Tekan panah bawah untuk merunduk. Senjatamu saat ini aktif otomatis saat musuh dalam jangkauan. Kumpulkan power-up senjata yang muncul saat berlari untuk mengganti perlengkapan. Setiap senjata memiliki jangkauan dan kerusakan berbeda — bereksperimenlah untuk menemukan favoritmu.',
  },
  'doodle-scoville': {
    title: 'Doodle Scoville — Skala Kepedasan',
    description:
      `Pelajari skala Scoville dengan Google Doodle interaktif ini. Lemparkan bola es krim ke cabai-cabai pedas dalam game yang menyengat.\n\nDoodle ini merayakan Wilbur Scoville yang menciptakan skala kepedasan Scoville pada 1912 untuk mengukur tingkat kepedasan cabai.`,
    controls: 'Klik atau ketuk untuk melempar bola es krim ke cabai saingan. Gerakkan cabaimu ke kiri dan kanan dengan mouse atau tombol panah. Hindari serangan lawan sambil mengenai mereka dengan seranganmu. Setiap level membawa cabai yang lebih pedas dengan serangan lebih kuat. Kalahkan semua saingan untuk menjadi juara pedas.',
  },
  'doodle-valentines-day': {
    title: 'Doodle Hari Valentine',
    description:
      `Rayakan cinta dengan game Google Doodle Hari Valentine. Bantu makhluk-makhluk lucu menemukan belahan jiwanya dalam game romantis ini.\n\nGoogle pertama kali merayakan Hari Valentine dengan Doodle pada tahun 2000, dan sejak itu telah menjadi tradisi tahunan yang dinantikan.`,
    controls: 'Klik atau ketuk untuk berinteraksi dengan adegan dan memandu trenggiling dalam perjalanan pengirimannya. Klik objek dan karakter yang disorot untuk memicu animasi dan melanjutkan cerita. Game ini sebagian besar naratif — santai dan nikmati perjalanan animasi yang menawan.',
  },
  'pony-express': {
    title: 'Pony Express — Kurir Berkuda',
    description:
      `Berkuda melintasi padang gurun Amerika dalam Google Doodle Pony Express. Kumpulkan surat dan hindari rintangan di sepanjang jalan.\n\nPony Express beroperasi selama hanya 18 bulan pada 1860-1861, namun menjadi simbol legendaris keberanian dan kecepatan komunikasi di Amerika Barat.`,
    controls: 'Tekan spasi atau klik untuk membuat kudamu melompati rintangan seperti batu, pagar, dan sungai. Kumpulkan tas pos yang muncul di sepanjang jalan untuk poin ekstra. Kudamu berlari otomatis — fokus pada waktu lompatan untuk menghindari bahaya dan mengirim surat.',
  },
  'doodle-jump-2': {
    title: 'Doodle Jump 2 — Lompat Corat-coret',
    description:
      `Lompat dari platform ke platform dalam Doodle Jump 2. Naik terus semakin tinggi dan hindari jebakan dalam game lompat yang adiktif ini.\n\nSeri Doodle Jump pertama kali dirilis pada 2009 dan telah diunduh lebih dari 30 juta kali, menjadi salah satu game mobile paling ikonik.`,
    controls: 'Miringkan perangkat atau gunakan panah kiri/kanan untuk menggerakkan Doodler ke samping. Doodler otomatis melompat saat mendarat di platform. Ketuk atau klik untuk menembak monster di atasmu. Mekanik baru termasuk platform bergerak, jetpack, dan trampolin yang mengubah jalurmu.',
  },
  'doodle-history-of-pizza': {
    title: 'Doodle Sejarah Pizza',
    description:
      `Potong pizza dalam Google Doodle interaktif ini. Pelajari sejarah pizza sambil bermain game kuliner yang menyenangkan.\n\nDoodle ini merayakan pizza yang berasal dari Napoli, Italia, dan kini menjadi makanan paling populer di dunia dengan miliaran porsi disajikan setiap tahun.`,
    controls: 'Klik dan seret untuk berinteraksi dengan setiap langkah pembuatan pizza. Uleni adonan dengan klik cepat, oleskan saus dengan menyeret, dan tempatkan topping dengan mengklik. Setiap era sejarah memiliki mini game yang sedikit berbeda yang mencerminkan tradisi pizza saat itu.',
  },
  'doodle-kids-coding': {
    title: 'Doodle Coding untuk Anak',
    description:
      `Belajar pemrograman dasar dengan Google Doodle edukatif ini. Arahkan kelinci dengan menyusun blok-blok kode yang menyenangkan.\n\nDoodle coding ini dirilis pada 2017 untuk merayakan 50 tahun bahasa pemrograman Logo dan mengenalkan konsep coding kepada anak-anak.`,
    controls: 'Klik blok perintah di sebelah kiri untuk menambahkannya ke urutanmu. Susun blok dalam urutan yang benar untuk memandu kelinci Doodle ke wortel. Klik tombol play untuk menjalankan programmu dan lihat apakah kelinci mencapai tujuan. Jika tidak berhasil, atur ulang blok dan coba lagi.',
  },
  'doodle-valentines-day-2022': {
    title: 'Doodle Hari Valentine 2022',
    description:
      `Rayakan Hari Valentine 2022 dengan Google Doodle spesial ini. Mini game romantis dan menggemaskan untuk merayakan hari kasih sayang.\n\nDoodle Valentine 2022 menampilkan kisah cinta landak yang menggemaskan, melanjutkan tradisi Google merayakan hari kasih sayang dengan game interaktif.`,
    controls: 'Gunakan tombol panah atau WASD untuk menggerakkan landak melalui setiap level. Kumpulkan bunga dan hati yang tersebar di level. Hindari rintangan dan bahaya di jalanmu. Capai tujuan di akhir setiap level untuk melanjutkan kisah cinta.',
  },
  'doodle-ludwig-van-beethovens-245th-year': {
    title: 'Doodle — 245 Tahun Ludwig van Beethoven',
    description:
      `Bantu Beethoven menyusun kembali partiturnya dalam Google Doodle musikal ini. Game interaktif sebagai penghormatan kepada maestro musik klasik.\n\nLudwig van Beethoven lahir pada 1770 dan komposisinya seperti Für Elise dan Symphony No. 9 tetap menjadi karya musik klasik paling terkenal di dunia.`,
    controls: 'Klik atau ketuk lembaran musik yang beterbangan di layar untuk mengumpulkannya. Lembaran harus dikumpulkan dalam urutan yang benar untuk menyusun ulang setiap karya — dengarkan petunjuk musik untuk menentukan urutannya. Selesaikan semua komposisi untuk membantu Beethoven menyelamatkan karya-karyanya.',
  },
  'doodle-earth-day-2020': {
    title: 'Doodle Hari Bumi 2020',
    description:
      `Rayakan Hari Bumi dengan Google Doodle tentang lebah. Serbuki bunga-bunga dan temukan pentingnya lebah bagi planet kita.\n\nHari Bumi pertama kali dirayakan pada 22 April 1970 dan kini menjadi gerakan lingkungan terbesar di dunia yang melibatkan lebih dari 190 negara.`,
    controls: 'Klik panah atau geser untuk berpindah antara adegan ekosistem yang berbeda. Klik hewan, tumbuhan, dan elemen lingkungan di setiap adegan untuk menemukan fakta menarik tentang ekosistem tersebut. Jawab kuis di akhir untuk mempelajari lebih lanjut tentang jejak ekologismu.',
  },
  'doctor-who-doodle': {
    title: 'Doodle Doctor Who',
    description:
      `Berpetualang melintasi waktu bersama sang Dokter dalam Google Doodle Doctor Who. Pecahkan teka-teki dan hadapi musuh-musuh ikonik.\n\nDoodle ini dirilis pada 2013 untuk merayakan ulang tahun ke-50 serial Doctor Who, acara fiksi ilmiah terlama dalam sejarah televisi.`,
    controls: 'Gunakan tombol panah untuk menggerakkan Doctor melalui setiap era waktu. Tekan Z atau klik untuk berinteraksi dengan objek dan karakter. Kumpulkan huruf Google yang dicuri sambil menghindari Dalek dan musuh lainnya. Setiap era memiliki bahaya berbeda — tetap waspada dan rencanakan jalurmu.',
  },
  'birth-of-hip-hop-doodle-game': {
    title: 'Kelahiran Hip Hop — Google Doodle',
    description:
      `Rayakan kelahiran hip hop dengan Google Doodle interaktif ini. Putar piringan hitam dan ciptakan beat-beat legendaris kamu sendiri.\n\nHip hop lahir pada 11 Agustus 1973 di Bronx, New York, ketika DJ Kool Herc mengadakan pesta legendaris yang mengubah sejarah musik dunia.`,
    controls: 'Klik piringan untuk scratch maju mundur. Klik pad ritme untuk menambahkan sample drum ke loop. Gunakan bar mixer untuk menyesuaikan volume setiap elemen. Klik piringan berbeda untuk beralih antar loop dasar. Campur dan padukan untuk membuat lagu hip-hop-mu sendiri.',
  },
  'doodle-celebrating-loteria': {
    title: 'Doodle Merayakan Lotería',
    description:
      `Mainkan Lotería Meksiko dalam Google Doodle multiplayer ini. Lengkapi kartumu dan teriakkan "¡Lotería!" sebelum yang lain.\n\nLotería adalah permainan tradisional Meksiko yang mirip bingo, dimainkan sejak abad ke-18 dan menjadi bagian penting budaya populer Meksiko.`,
    controls: 'Saksikan pengundian mengungkap kartu satu per satu. Ketika kartu yang terungkap cocok dengan kotak di papanmu, klik kotak itu untuk menandainya. Dapatkan empat kotak tertandai dalam baris, kolom, atau diagonal untuk menang dan berteriak lotería! Perhatikan baik-baik — kartu bergerak cepat.',
  },
  'basketball-2012-google-doodle': {
    title: 'Basketball 2012 — Google Doodle',
    description:
      `Cetak angka dalam Google Doodle Basketball Olimpiade 2012. Bidik dengan tepat dan raih skor tertinggi dalam game bola basket ini.\n\nDoodle ini dibuat untuk Olimpiade London 2012 sebagai bagian dari seri game olahraga interaktif yang merayakan semangat olimpiade.`,
    controls: 'Klik dan seret bola ke atas untuk membidik, lalu lepaskan untuk melempar. Arah dan jarak seretan menentukan sudut dan kekuatan lemparan. Panduan busur membantu membidik. Cetak skor sebelum waktu habis untuk mendapatkan bintang.',
  },
  'celebrating-lake-xochimilco': {
    title: 'Merayakan Danau Xochimilco',
    description:
      `Jelajahi Danau Xochimilco dan axolotl-nya dalam Google Doodle ini. Temukan ekosistem unik dan lindungi penghuninya.\n\nDanau Xochimilco di Mexico City adalah Situs Warisan Dunia UNESCO dan rumah bagi axolotl, salamander langka yang terancam punah.`,
    controls: 'Gunakan tombol panah atau WASD untuk berenang bersama axolotl melalui kanal air. Kumpulkan makanan mengapung di air untuk poin. Hindari predator dan rintangan yang bisa melukai axolotl. Navigasi melalui kanal Xochimilco yang berwarna-warni sambil belajar tentang ekosistem unik ini.',
  },
  'celebrating-johann-sebastian-bach': {
    title: 'Mengenang Johann Sebastian Bach',
    description:
      `Ciptakan musik bergaya Bach dengan kecerdasan buatan Google. Doodle musikal yang memukau dan mendidik untuk pecinta musik.\n\nDoodle Bach 2019 adalah Doodle pertama yang menggunakan kecerdasan buatan, menciptakan harmoni otomatis berdasarkan gaya komposisi Bach.`,
    controls: 'Klik pada paranada untuk menempatkan not dan membuat melodi. Kamu bisa menempatkan not pada garis atau spasi mana saja. Klik not yang ada untuk menghapusnya. Setelah membuat melodi, klik tombol harmonisasi agar AI melengkapinya dalam gaya Bach.',
  },
  'doodle-clara-rockmore': {
    title: 'Doodle Clara Rockmore — Google',
    description:
      `Mainkan theremin bersama Clara Rockmore dalam Google Doodle interaktif ini. Temukan alat musik paling memesona dalam sejarah.\n\nClara Rockmore dianggap sebagai pemain theremin terhebat sepanjang masa, menguasai alat musik elektronik pertama yang dipatenkan pada 1928.`,
    controls: 'Gerakkan mouse ke atas dan bawah untuk mengubah nada theremin — lebih tinggi berarti nada lebih tinggi. Gerakkan ke kiri dan kanan untuk menyesuaikan volume. Klik dan tahan untuk memperpanjang nada. Pilih salah satu karya Clara Rockmore untuk dimainkan, atau ciptakan musik sendiri secara bebas.',
  },
  'mothers-day-2013-doodle': {
    title: 'Doodle Hari Ibu 2013',
    description:
      `Buat hadiah spesial untuk ibumu dalam Doodle Hari Ibu ini. Game kreatif dan menyentuh hati dari Google.\n\nHari Ibu dirayakan di lebih dari 40 negara di dunia, dengan Google secara rutin membuat Doodle spesial untuk menghormati para ibu.`,
    controls: 'Klik melalui langkah-langkah pembuatan kartu: pertama pilih adegan bergambar, lalu pilih elemen dekoratif seperti bunga dan hati dengan mengkliknya. Ketik pesan pribadimu di kolom teks. Gunakan panah untuk melihat lebih banyak opsi. Setelah selesai, bagikan kartu Hari Ibumu.',
  },
  'mothers-day-2020-doodle': {
    title: 'Doodle Hari Ibu 2020',
    description:
      `Kirim kartu animasi untuk ibumu dengan Google Doodle Hari Ibu 2020. Buat pesan cinta yang personal dan berkesan.\n\nDoodle Hari Ibu 2020 dirilis saat pandemi COVID-19, menyampaikan pesan kasih sayang kepada para ibu di seluruh dunia di masa yang penuh tantangan.`,
    controls: 'Klik atau ketuk untuk melanjutkan cerita animasi. Pada momen interaktif, ikuti instruksi di layar — kamu mungkin perlu mengklik objek tertentu, menyeret elemen, atau mengetuk sesuai ritme animasi. Fokusnya pada narasi — nikmati cerita yang menyentuh dan buat kartu hadiahmu di akhir.',
  },
  'doodle-crossword-puzzle': {
    title: 'Doodle Teka-Teki Silang',
    description:
      `Pecahkan teka-teki silang Google dalam Doodle interaktif ini. Uji kosakata dan pengetahuan umummu.\n\nTeka-teki silang pertama diterbitkan di surat kabar New York World pada 21 Desember 1913 dan sejak itu menjadi hiburan intelektual paling populer di dunia.`,
    controls: 'Klik kotak di grid teka-teki silang untuk memilihnya, lalu ketik jawabanmu menggunakan keyboard. Klik petunjuk di daftar untuk menyorot kotak yang sesuai. Tekan Tab untuk pindah ke petunjuk berikutnya atau klik petunjuk lain. Lengkapi semua kata untuk menyelesaikan teka-teki.',
  },
  'slalom-canoe': {
    title: 'Slalom Kano',
    description:
      `Navigasikan kano melewati gerbang-gerbang slalom dalam Google Doodle olahraga ini. Jadilah cepat dan tepat untuk meraih medali emas.\n\nSlalom kano telah menjadi cabang olahraga Olimpiade sejak 1992, menguji keterampilan, kecepatan, dan ketahanan para atlet di jeram yang menantang.`,
    controls: 'Tahan panah kiri untuk mendayung ke kiri dan panah kanan untuk mendayung ke kanan. Bergantian di antaranya untuk mendayung lurus. Arahkan kanumu melalui setiap gerbang — gerbang hijau harus dilalui searah arus dan merah melawan arus. Penalti waktu ditambahkan untuk setiap gerbang yang terlewat atau tersentuh.',
  },
  'eiji-tsuburayas-birthday': {
    title: 'Ulang Tahun Eiji Tsuburaya',
    description:
      `Rayakan Eiji Tsuburaya, bapak efek spesial Jepang, dengan Google Doodle interaktif yang terinspirasi film-film kaiju.\n\nEiji Tsuburaya adalah pencipta Ultraman dan pelopor efek spesial tokusatsu yang memengaruhi industri film Jepang dan dunia.`,
    controls: 'Klik papan klak untuk memulai setiap adegan. Lalu klik tombol di layar dalam urutan yang benar untuk memicu efek khusus pada saat yang tepat — masukkan monster, picu ledakan, dan sutradarai acara. Ketepatan waktumu menentukan seberapa mengesankan setiap adegan.',
  },
  'doodle-roswells-66th-anniversary': {
    title: 'Doodle — Peringatan ke-66 Roswell',
    description:
      `Bantu alien yang terdampar di Roswell dalam Google Doodle point-and-click ini. Pecahkan teka-teki dan perbaiki piring terbangnya.\n\nInsiden Roswell 1947 menjadi salah satu peristiwa paling terkenal dalam sejarah ufologi dan menginspirasi budaya pop tentang alien selama berdekade-dekade.`,
    controls: 'Klik objek dan karakter di adegan untuk berinteraksi. Kumpulkan benda dengan mengkliknya — masuk ke inventarismu. Kombinasikan benda inventaris dengan mengklik satu lalu lainnya untuk membuat alat. Gunakan alat ini di lingkungan untuk memecahkan teka-teki dan membantu alien kembali ke pesawatnya.',
  },
  'google-maps-snake': {
    title: 'Google Maps Snake — Game Ular',
    description:
      `Mainkan game ular di Google Maps. Jelajahi kota-kota dunia sambil mengumpulkan penumpang dalam game retro versi baru ini.\n\nGoogle Maps Snake dirilis pada April Fools 2019, menggabungkan nostalgia game klasik Nokia dengan teknologi peta modern Google.`,
    controls: 'Gunakan tombol panah atau WASD untuk mengarahkan ularmu melalui jalan kota. Kumpulkan ikon landmark yang muncul di peta untuk tumbuh dan mendapat poin. Hindari tepi peta atau ekormu sendiri. Pilih dari berbagai kota di seluruh dunia, masing-masing dengan layout peta dan landmark unik.',
  },
  'celebrating-pani-puri': {
    title: 'Merayakan Pani Puri',
    description:
      `Kenali pani puri dengan Google Doodle yang lezat ini. Sajikan jajanan khas India yang nikmat dalam mini game interaktif dan penuh warna.\n\nPani puri adalah jajanan jalanan ikonik dari Asia Selatan yang telah dinikmati selama berabad-abad dan memiliki variasi nama di setiap wilayah India.`,
    controls: 'Klik atau ketuk puri untuk membukanya, lalu cepat tekan bahan isian yang benar sesuai pesanan pelanggan. Tekan air bumbu terakhir untuk menyelesaikan pani puri. Sajikan kepada pelanggan sebelum waktu habis. Pesanan semakin kompleks seiring kemajuan — pertahankan kecepatanmu!',
  },
  'doodle-googles-15th-birthday': {
    title: 'Doodle — Ulang Tahun ke-15 Google',
    description:
      `Pukul piñata untuk merayakan 15 tahun Google dalam Doodle yang meriah ini. Mini game seru merayakan ulang tahun mesin pencari terpopuler.\n\nGoogle didirikan oleh Larry Page dan Sergey Brin pada 4 September 1998 di garasi rumah, dan kini menjadi perusahaan teknologi terbesar di dunia.`,
    controls: 'Gerakkan mouse ke kiri dan kanan (atau gunakan panah) untuk memposisikan piñata di bawah hadiah yang jatuh. Tangkap kotak hadiah berwarna-warni untuk mendapat poin. Hindari benda berbahaya — akan menghancurkan piñata. Kumpulkan hadiah sebanyak mungkin sebelum waktu habis untuk skor tertinggi.',
  },
  'swing-dancing-and-the-savoy-ballroom': {
    title: 'Tarian Swing dan Savoy Ballroom!',
    description:
      `Menari swing di Savoy Ballroom dalam Google Doodle animasi ini. Rasakan kembali kejayaan era jazz dan tarian swing.\n\nSavoy Ballroom di Harlem, New York, dibuka pada 1926 dan menjadi pusat tarian swing serta integrasi rasial selama era jazz.`,
    controls: 'Tekan tombol yang ditampilkan di layar sesuai irama musik untuk melakukan setiap gerakan tarian. Tombol panah mengontrol langkah dasar, sementara tombol huruf mengaktifkan gerakan khusus. Perhatikan indikator ritme dengan seksama — ketepatan waktumu menentukan skor. Rangkai gerakan sempurna untuk combo.',
  },
  'doodle-qixi-festival-chilseok': {
    title: 'Doodle Festival Qixi / Chilseok',
    description:
      `Rayakan Festival Qixi dengan Google Doodle yang romantis ini. Bantu burung-burung menyatukan kembali sepasang kekasih yang terpisah oleh Bima Sakti.\n\nFestival Qixi, dikenal sebagai Valentine Tiongkok, merayakan kisah cinta legendaris antara Niulang dan Zhinü yang dipisahkan oleh Bima Sakti.`,
    controls: 'Klik atau ketuk untuk memandu burung murai melintasi langit malam. Kumpulkan bintang saat terbang untuk membangun jembatan yang menghubungkan sepasang kekasih. Hindari rintangan di langit yang bisa mengalihkanmu. Burung murai bergerak ke arah yang kamu klik — atur waktu klikmu untuk menavigasi celah antar awan.',
  },
  'chinese-new-year-snake-game': {
    title: 'Tahun Baru Imlek — Game Ular',
    description:
      `Rayakan Tahun Baru Imlek dengan versi spesial game ular. Kumpulkan lampion merah dan sambut tahun Ular dengan meriah.\n\nTahun Baru Imlek adalah perayaan terpenting dalam kalender Tiongkok, dirayakan oleh lebih dari 1,5 miliar orang di seluruh dunia.`,
    controls: 'Gunakan tombol panah atau WASD untuk mengarahkan ular nagamu di papan meriah. Kumpulkan kue keberuntungan dan amplop merah untuk tumbuh dan mendapat poin. Hindari dinding atau tubuhmu sendiri. Ular bergerak terus dan mempercepat semakin banyak yang kamu kumpulkan.',
  },
  'doodle-celebrating-mbira': {
    title: 'Doodle Merayakan Mbira',
    description:
      `Mainkan mbira dalam Google Doodle musikal ini. Kenali alat musik tradisional Afrika dan ciptakan melodimu sendiri.\n\nMbira adalah alat musik tradisional Zimbabwe berusia lebih dari 1.000 tahun yang memainkan peran penting dalam upacara spiritual suku Shona.`,
    controls: 'Saksikan bola berwarna turun ke arah bilah logam mbira di bagian bawah layar. Tekan tombol yang sesuai (atau ketuk bilah di ponsel) saat bola mencapai bilah. Tekan not tepat waktu untuk menjaga melodi mengalir. Lagu semakin cepat dan kompleks seiring kemajuan.',
  },
  'hurdles-2012': {
    title: 'Lari Gawang 2012',
    description:
      `Berlari dan lompati gawang dalam Google Doodle Olimpiade 2012. Atur waktu lompatanmu dengan tepat untuk meraih medali emas.\n\nGame gawang ini adalah bagian dari seri Doodle Olimpiade London 2012, yang memungkinkan pemain merasakan sensasi atletik langsung dari browser.`,
    controls: 'Bergantian cepat antara panah kiri dan kanan untuk membuat atletmu berlari lebih cepat. Tekan panah atas (atau spasi) untuk melompati setiap rintangan. Waktu sangat penting — melompat terlalu cepat atau lambat akan memperlambatmu. Pertahankan ritme tombol yang stabil untuk mencapai kecepatan tertinggi antar rintangan.',
  },
  'soccer-2012': {
    title: 'Sepak Bola 2012',
    description:
      `Hadang tendangan penalti dalam Google Doodle Sepak Bola Olimpiade 2012. Melompat di waktu yang tepat untuk menyelamatkan timmu.\n\nSepak bola adalah olahraga paling populer di dunia dengan lebih dari 4 miliar penggemar, dan menjadi sorotan utama setiap Olimpiade.`,
    controls: 'Tekan kiri untuk menyelam ke kiri, kanan untuk menyelam ke kanan, atau atas untuk tetap di tengah dan melompat. Perhatikan ancang-ancang dan bahasa tubuh penendang untuk memprediksi arah bola. Bereaksi cepat untuk menyelamatkan sebanyak mungkin tembakan.',
  },
  'global-candy-cup-2015': {
    title: 'Piala Permen Global Halloween 2015',
    description:
      `Kumpulkan permen untuk timmu dalam Piala Halloween Global 2015. Google Doodle multiplayer yang meriah dan kompetitif.\n\nPiala Permen Global 2015 adalah salah satu Doodle multiplayer pertama Google, memungkinkan pemain dari seluruh dunia berkompetisi secara real-time.`,
    controls: 'Klik atau ketuk untuk membuat penyihirmu terbang dan mengumpulkan permen. Navigasi jalur berhantu dengan mengetuk atas atau bawah layar untuk menyesuaikan ketinggian. Kumpulkan permen sebanyak mungkin sambil menghindari rintangan berhantu. Bersainglah untuk skor tertinggi timmu.',
  },
  'magic-cat-academy-2': {
    title: 'Akademi Kucing Ajaib 2',
    description:
      `Kucing Momo kembali dalam petualangan bawah laut. Gambar simbol untuk mengalahkan hantu-hantu di kedalaman dalam sekuel yang ajaib ini.\n\nSekuel ini dirilis pada Halloween 2020 dengan latar bawah laut, melanjutkan petualangan kucing Momo yang dicintai pemain di seluruh dunia.`,
    controls: 'Gambar simbol di atas setiap hantu yang mendekat dengan klik dan seret (atau geser di ponsel). Gambar simbol dengan benar sebelum hantu mencapai Momo. Beberapa hantu bisa muncul sekaligus — prioritaskan yang terdekat. Tipe hantu baru memperkenalkan simbol yang lebih kompleks seiring kemajuan.',
  },
  'magic-cat-academy-3': {
    title: 'Akademi Kucing Ajaib 3',
    description:
      `Temui kembali Momo dalam seri ketiga Magic Cat Academy. Tantangan baru dan musuh baru menantimu dalam petualangan kucing yang seru.\n\nSeri ketiga ini memperluas dunia Magic Cat Academy, membuktikan popularitas game kucing Momo sebagai salah satu Doodle Halloween terfavorit.`,
    controls: 'Gambar simbol di atas setiap hantu dengan klik dan seret (atau geser di ponsel). Baru di versi ini: hubungkan beberapa simbol untuk mantra combo yang kuat. Beberapa hantu memerlukan urutan simbol tertentu untuk dikalahkan. Perhatikan tipe musuh baru dan sesuaikan strategimu.',
  },
  'rubiks-cube': {
    title: 'Rubik\'s Cube',
    description:
      `Pecahkan Rubik's Cube dalam Google Doodle interaktif ini. Putar sisi-sisinya dan sejajarkan warna dalam teka-teki legendaris ini.\n\nKubus Rubik ditemukan oleh Ernő Rubik pada 1974 di Hongaria dan telah terjual lebih dari 450 juta unit di seluruh dunia.`,
    controls: 'Klik dan seret pada baris atau kolom kubus untuk memutar lapisan tersebut. Seret pada latar belakang untuk memutar seluruh kubus dan melihat sisi lain. Klik tombol acak untuk mengacak kubus. Untuk mengatur ulang, klik reset. Cobalah menyelesaikan keenam sisi dengan gerakan sesedikit mungkin.',
  },
  'oskar-fischinger': {
    title: 'Oskar Fischinger — Mainan Musik',
    description:
      `Ciptakan musik visual terinspirasi Oskar Fischinger. Susun melodi dengan menempatkan bentuk geometris dalam Doodle artistik ini.\n\nOskar Fischinger adalah animator avant-garde Jerman yang menjadi pelopor seni visual musik dan menginspirasi film Fantasia karya Disney.`,
    controls: 'Klik sel mana saja di grid untuk menempatkan not — setiap kolom mewakili ketukan dalam loop, setiap baris nada berbeda. Klik sel terisi untuk menghapusnya. Gunakan pemilih instrumen untuk mengubah suara. Sesuaikan tempo dan skala dengan alat. Komposisimu otomatis berulang saat kamu membuat.',
  },
  'celebrating-popcorn': {
    title: 'Merayakan Popcorn',
    description:
      `Rayakan popcorn dengan Google Doodle interaktif ini. Temukan sejarah camilan renyah ini dalam mini game yang mengasyikkan.\n\nPopcorn telah dikonsumsi selama ribuan tahun oleh penduduk asli Amerika, dan kini menjadi camilan ikonik bioskop di seluruh dunia.`,
    controls: 'Klik atau ketuk dengan cepat untuk meletuskan jagung dan mengisi embermu. Kumpulkan power-up yang muncul di layar untuk keuntungan sementara seperti letupan lebih cepat atau perisai. Hindari popcorn terbang dari pemain lain. Isi embermu sebelum pesaing untuk memenangkan setiap ronde.',
  },
  'wewa-weaving': {
    title: 'Tenun We:wa',
    description:
      `Temukan seni tenun tradisional We:wa dalam Google Doodle ini. Ciptakan pola-pola berwarna dengan menenun secara virtual.\n\nTenun We:wa merupakan tradisi seni tekstil yang diwariskan turun-temurun dan mencerminkan kekayaan budaya serta identitas masyarakat pembuatnya.`,
    controls: 'Klik dan seret benang secara horizontal melintasi alat tenun untuk menenun setiap baris. Pilih warna berbeda dari palet samping. Ikuti pola yang ditampilkan di atas untuk membuat ulang desain tenun tradisional. Teliti dalam penempatan warna — akurasi menentukan skor akhirmu.',
  },
  'rise-of-the-half-moon': {
    title: 'Kebangkitan Bulan Sabit',
    description:
      `Pandu bulan sabit dalam perjalanannya di Google Doodle yang puitis ini. Game yang memesona dengan perpaduan musik dan narasi visual.\n\nGame ini menampilkan perpaduan unik antara strategi kartu dan narasi puitis, terinspirasi dari simbolisme bulan dalam berbagai budaya dunia.`,
    controls: 'Pada giliranmu, pilih kartu dari tanganmu yang terhubung dengan kartu saat ini di meja — kartu harus berbagi fase bulan, warna, atau kategori. Dapatkan poin ekstra dengan membuat rantai kartu yang cocok. Gunakan kartu khusus secara strategis untuk memaksimalkan skormu dan mengalahkan lawanmu.',
  },
  zamboni: {
    title: 'Ulang Tahun Frank Zamboni',
    description:
      `Kendarai mesin Zamboni dalam Google Doodle ini. Bersihkan arena es sebelum waktu habis dalam mini game yang seru.\n\nMesin Zamboni ditemukan oleh Frank Zamboni pada 1949 di California dan merevolusi cara arena es di seluruh dunia dirawat.`,
    controls: 'Gunakan tombol panah untuk mengarahkan Zamboni di sekitar arena es. Lewati setiap area es kotor untuk membersihkannya — area yang dibersihkan menjadi putih bersih. Rencanakan rutemu dengan cermat untuk menutupi seluruh arena tanpa melewati dua kali. Bersihkan semua es sebelum waktu habis.',
  },
  'komodo-national-park': {
    title: 'Taman Nasional Komodo',
    description:
      `Jelajahi Taman Nasional Komodo dalam Google Doodle ini. Temukan komodo dan satwa liar menakjubkan di kepulauan Indonesia.\n\nTaman Nasional Komodo didirikan pada 1980 di Indonesia dan menjadi Situs Warisan Dunia UNESCO untuk melindungi komodo, kadal terbesar di dunia.`,
    controls: 'Baca setiap pertanyaan tentang komodo dengan cermat, lalu klik jawaban yang menurutmu benar dari pilihan yang ada. Kamu akan mendapat umpan balik langsung apakah jawabanmu benar. Pelajari fakta menarik tentang komodo dan habitatnya seiring kemajuanmu dalam kuis.',
  },
  'les-paul-guitar': {
    title: 'Doodle Gitar Les Paul',
    description:
      `Mainkan gitar virtual dalam Google Doodle penghormatan kepada Les Paul. Petik senar dan rekam melodimu sendiri.\n\nLes Paul tidak hanya merancang gitar ikonik, tetapi juga menjadi pelopor rekaman multi-track yang merevolusi industri musik modern.`,
    controls: 'Gerakkan mouse di atas senar gitar untuk memainkannya, atau klik senar individual untuk memetiknya. Kamu juga bisa menggunakan keyboard — setiap tombol memainkan nada berbeda. Tekan tombol rekam untuk merekam dan memutar ulang penampilanmu. Bereksperimenlah dengan melodi dan akor berbeda.',
  },
  'robert-moog-synthesizer': {
    title: 'Doodle Synthesizer Robert Moog',
    description:
      `Mainkan synthesizer Moog dalam Google Doodle musikal ini. Putar kenop dan ciptakan suara elektronik yang unik.\n\nRobert Moog memperkenalkan synthesizer Moog pada 1964, membuka era baru musik elektronik yang mengubah lanskap musik dunia.`,
    controls: 'Klik tuts piano di bawah untuk memainkan not. Sesuaikan kenop dan sakelar di atas untuk mengubah bentuk gelombang osilator, cutoff filter, resonansi, dan pengaturan envelope. Gunakan perekam 4 trek di kanan untuk melapis beberapa suara. Bereksperimen dengan pengaturan untuk menciptakan suara unik.',
  },
  'alan-turing-machine': {
    title: 'Doodle Mesin Alan Turing',
    description:
      `Pecahkan teka-teki logika terinspirasi mesin Turing dalam Google Doodle ini. Penghormatan kepada bapak ilmu komputer modern.\n\nAlan Turing dianggap sebagai bapak ilmu komputer modern dan berperan krusial dalam memecahkan kode Enigma selama Perang Dunia II.`,
    controls: 'Setiap teka-teki menampilkan urutan biner target di atas. Mesin Turing membaca pita dan mengikuti aturan yang kamu program. Klik sel tabel keadaan untuk beralih antar tindakan (tulis 0, tulis 1, gerak kiri, gerak kanan, ubah keadaan). Program aturan yang benar agar mesin menghasilkan urutan target.',
  },
  'pangolin-love': {
    title: 'Pangolin Love — Hari Valentine 2017',
    description:
      `Bantu trenggiling menemukan cinta dalam Google Doodle Valentine 2017. Game platformer yang menggemaskan dan romantis.\n\nTrenggiling adalah mamalia yang paling banyak diperdagangkan secara ilegal di dunia, dan Doodle ini membantu meningkatkan kesadaran akan konservasinya.`,
    controls: 'Klik atau ketuk untuk membuat trenggiling melompat dan berinteraksi dengan lingkungan. Kumpulkan benda romantis seperti cokelat, bunga, dan hati yang tersebar di setiap level. Hindari rintangan dan bahaya di jalanmu. Selesaikan setiap level untuk melanjutkan kisah cinta trenggiling.',
  },
  'santa-tracker-elf-maker': {
    title: 'Santa Tracker — Pembuat Peri',
    description:
      `Buat peri Sinterklas kamu sendiri dalam fitur kreatif Google Santa Tracker. Kustomisasi setiap detail untuk peri yang unik.\n\nGoogle Santa Tracker telah menyediakan aktivitas kreatif seperti Pembuat Peri sejak 2004, menjadi tradisi liburan digital bagi jutaan keluarga.`,
    controls: 'Klik kategori kustomisasi di bawah — kepala, badan, aksesori, dan warna. Klik item individual untuk menerapkannya pada elfmu. Gunakan tombol panah untuk melihat lebih banyak opsi di setiap kategori. Saat puas dengan elf kustommu, simpan atau bagikan ke teman.',
  },
  'santa-tracker-snowball-storm': {
    title: 'Santa Tracker — Badai Bola Salju',
    description:
      `Lempar bola salju dalam pertarungan musim dingin Google Santa Tracker. Bidik dengan tepat dan menangkan perang salju.\n\nMini game Badai Bola Salju adalah bagian dari koleksi permainan musim dingin Google Santa Tracker yang menghibur anak-anak di seluruh dunia.`,
    controls: 'Gerakkan mouse untuk membidik. Klik untuk melempar bola salju ke lawanmu. Bersembunyi di balik benteng salju dengan bergerak ke bawah untuk menghindari bola salju yang datang. Kumpulkan power-up yang muncul untuk keuntungan sementara seperti lemparan cepat atau bola salju raksasa.',
  },
  'santa-tracker-present-drop': {
    title: 'Santa Tracker — Penjatuhan Hadiah',
    description:
      `Bantu Sinterklas mengirimkan hadiah dalam mini game Google Santa Tracker. Jatuhkan paket-paket ke cerobong asap dengan tepat.\n\nPenjatuhan Hadiah menggambarkan tradisi Sinterklas mengantarkan hadiah melalui cerobong asap, legenda yang berasal dari cerita Santo Nikolaus.`,
    controls: 'Kereta Santa terbang otomatis melintasi layar. Klik atau tekan spasi untuk menjatuhkan hadiah. Atur waktu jatuhanmu agar hadiah jatuh tepat ke cerobong di bawah. Setiap pengiriman sukses memberi poin — bidikan lebih akurat memberi skor lebih tinggi. Jangan sia-siakan hadiah dengan meleset dari cerobong.',
  },
  'santa-tracker-penguin-dash': {
    title: 'Santa Tracker — Lari Penguin',
    description:
      `Geser penguinmu melintasi es dalam balapan seru Google Santa Tracker. Kumpulkan ikan dan hindari rintangan.\n\nPenguin Dash terinspirasi dari penguin yang hidup di Kutub Selatan, menambahkan sentuhan edukatif pada permainan musim dingin yang menyenangkan.`,
    controls: 'Gunakan tombol panah atau ketuk layar untuk mengendalikan penguinmu. Tekan atas atau spasi untuk melompati rintangan. Tekan bawah untuk meluncur di bawah penghalang. Kumpulkan tongkat permen dan manisan liburan untuk poin ekstra. Hindari tabrakan — setiap benturan memperlambatmu. Pergi sejauh mungkin.',
  },
  'santa-tracker-code-lab': {
    title: 'Santa Tracker — Lab Koding',
    description:
      `Belajar coding dengan Lab Koding Google Santa Tracker. Program gerakan peri secara interaktif dan edukatif.\n\nLab Koding Santa Tracker menggunakan Blockly dari Google untuk mengajarkan dasar-dasar pemrograman kepada anak-anak dengan cara yang menyenangkan.`,
    controls: 'Seret blok pemrograman dari kotak alat ke ruang kerja. Gabungkan blok untuk membuat urutan instruksi. Gunakan blok gerakan untuk mengarahkan elf, blok pengulangan untuk mengulang tindakan, dan blok kondisi untuk membuat keputusan. Tekan jalankan untuk menguji programmu. Edit kodemu jika elf tidak mencapai tujuan.',
  },
  'chrome-music-lab-rhythm': {
    title: 'Chrome Music Lab — Game Ritme',
    description:
      `Eksplorasi ritme dengan Chrome Music Lab. Buat sekuens ritmis dan pelajari dasar-dasar musik secara interaktif.\n\nChrome Music Lab diluncurkan oleh Google pada 2016 sebagai alat edukasi musik gratis yang membuat pembelajaran musik menjadi menyenangkan dan mudah diakses.`,
    controls: 'Klik sel grid untuk menempatkan ketukan. Setiap baris mewakili suara perkusi berbeda. Klik sel untuk mengaktifkan atau menonaktifkan ketukan. Playhead bergerak terus melintasi grid, memainkan ketukan yang ditemuinya. Bereksperimenlah dengan pola berbeda untuk membuat ritme sendiri.',
  },
  'chrome-music-lab-song-maker': {
    title: 'Chrome Music Lab — Pembuat Lagu',
    description:
      `Ciptakan lagumu sendiri dengan Song Maker dari Chrome Music Lab. Alat musik yang intuitif dan penuh warna untuk segala usia.\n\nSong Maker telah digunakan oleh jutaan siswa dan guru di seluruh dunia sebagai alat edukasi musik yang intuitif dan menyenangkan.`,
    controls: 'Klik grid atas untuk menempatkan not melodi — setiap kolom adalah ketukan, setiap baris adalah nada. Klik grid bawah untuk menambahkan ketukan drum. Tekan tombol play untuk mendengarkan komposisimu. Gunakan pemilih instrumen untuk mengubah suara. Simpan dan bagikan kreasi musikmu.',
  },
  'chrome-music-lab-kandinsky': {
    title: 'Chrome Music Lab — Kandinsky dari Google',
    description:
      `Ubah gambarmu menjadi musik, terinspirasi dari Kandinsky. Gambar bentuk dan dengarkan mereka hidup di Chrome Music Lab.\n\nWassily Kandinsky adalah pelukis abstrak pelopor yang percaya bahwa seni visual dan musik saling terhubung secara mendalam, menginspirasi eksperimen ini.`,
    controls: 'Gambar di kanvas menggunakan mouse atau jari. Setiap garis menghasilkan suara — garis lurus menciptakan nada berkelanjutan, lingkaran membuat ketukan ritmis, dan segitiga menambahkan aksen tajam. Warna berbeda sesuai dengan instrumen berbeda. Tekan play untuk mendengarkan karya senimu sebagai karya musik.',
  },
  'quick-draw': {
    title: 'Quick, Draw! dari Google',
    description: `Bisakah jaringan saraf belajar mengenali coretanmu? Quick, Draw! adalah eksperimen AI Google yang menantangmu menggambar objek sehari-hari dalam waktu kurang dari 20 detik sementara model machine learning mencoba menebak gambarmu secara real-time.

Quick, Draw! dibuat sebagai eksperimen AI untuk membantu melatih jaringan saraf Google dalam pengenalan gambar tangan.`,
    controls: `Kamu diberi kata dan 20 detik untuk menggambarnya dengan mouse atau jari. Mulai menggambar saat timer dimulai — AI menganalisis goresanmu secara real-time dan meneriakkan tebakannya. Jika benar, kamu lanjut ke kata berikutnya. Enam ronde total.`,
  },
  'google-earth-flight-simulator': {
    title: 'Earth — Peta Angin & Cuaca',
    description: `Jelajahi seluruh planet di globe 3D animasi yang memvisualisasikan pola angin real-time, kondisi cuaca, dan arus laut. Putar globe, perbesar wilayah mana saja, dan saksikan aliran udara animasi yang memukau.

Didukung oleh prakiraan superkomputer yang diperbarui setiap tiga jam. Dibuat oleh Cameron Beccario.`,
    controls: `Klik dan seret untuk memutar globe. Scroll untuk memperbesar dan memperkecil. Klik di mana saja untuk melihat kecepatan angin lokal, suhu, dan koordinat. Gunakan menu (teks "earth" kiri bawah) untuk beralih antar lapisan atmosfer.`,
  },
};
