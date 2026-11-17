# ✦ EduNova — AI-Nurturing Ultimate Lesson

**Aplikasi pelajar kolej: nota suara, ringkasan AI, infografik, jadual kelas, tugasan dan profil.**

Projek ini menyediakan **pratonton web** dan sumber **Android APK (Capacitor 8)**. Antara muka menggunakan Bahasa Melayu Malaysia dan responsif untuk telefon, tablet serta komputer.

## Apa yang berfungsi

| Tab | Fungsi |
|---|---|
| 1. Nota AI | Taip nota, transkripsi suara langsung (Chrome atau pengecaman natif Android), pengelasan Lesson/Meeting/Discussion/Other, ringkasan demo tempatan, AI sebenar secara pilihan dengan Worker |
| 1. Infografik | Carta Bubble, Tree, Alir, Mind Map, Banding dan Timeline; gaya Kartun, 3D Cute, Anime, Minimal, Neon; hasil SVG (ilustrasi vektor, **bukan** AI image generator) |
| 2. Arkib | Nota + infografik disimpan, disunting, dikongsi dan dipadam secara berasingan |
| 3. Jadual | Jadual kuliah Isnin–Ahad, subjek, masa dan lokasi; semakan masa bertindih |
| 4. Tugasan | Assignment, keutamaan, tarikh akhir, tanda siap, peringatan setempat melalui Android Local Notifications |
| 5. Profil | Nama pengguna, institusi, kursus, 6 tema warna, URL Worker + kod akses, sandaran/import JSON |

**Privasi:** Tiada Google login atau pangkalan data awan. Data disimpan di peranti melalui IndexedDB. Pada APK, data juga disalin ke fail JSON dalam storan aplikasi peribadi (`Directory.Data`). Perkongsian/eksport dilakukan atas tindakan pengguna. **Hanya** apabila Worker AI diaktifkan, kandungan teks atau audio yang dihantar ke AI diproses di luar telefon.

## Cara 1 — Uji tanpa APK (paling mudah)

1. Buka fail **`EduNova_Pratonton.html`** yang dibekalkan berasingan dalam Chrome komputer atau telefon.
2. Cuba tab Nota AI: taip transkrip → klik **Jana Nota Ringkas** → **Simpan Nota**.
3. Pilih bentuk carta dan gaya → **Cipta Infografik** → **Simpan**.
4. Buka Arkib, jadual, tugasan dan profil untuk menguji fungsi lain.
5. **Perhatian:** sesetengah pelayar menyekat mikrofon pada fail HTML tempatan. Untuk menguji mikrofon gunakan **HTTPS GitHub Pages** (cara berikut). Notifikasi masa depan hanya aktif apabila dibina sebagai APK Android. Ringkasan tanpa Worker ialah **ringkasan demo**, bukan output AI sebenar.

## Cara 2 — Muat naik GitHub → Web Preview + APK secara automatik

**Tiada Android Studio diperlukan di komputer.** Hanya penyemak imbas dan akaun GitHub.

1. Muat turun **`EduNova_GitHub_APK.zip`** dan **extract/unzip** dahulu.
2. Pergi ke <https://github.com/new> → cipta repository baharu, contohnya `EduNova` (Public jika mahu GitHub Pages percuma pada pelan GitHub Free).
3. Dalam repository pilih **Add file → Upload files**. Masukkan **semua kandungan DALAM folder `EduNova`**, termasuk `.github` (folder tersembunyi, sangat penting untuk APK). Pastikan `package.json`, `index.html` dan `.github/workflows/android.yml` berada di root repository. Klik **Commit changes**.
4. Pergi ke tab **Actions** → pilih **Bina APK EduNova** → pilih **Run workflow** (jika ia belum berjalan automatik). Apabila status hijau, buka run tersebut → bahagian **Artifacts** → muat turun **EduNova-Android-APK**.
5. Extract fail artifact ZIP → pindahkan **`app-debug.apk`** ke Android → buka untuk memasang (mungkin perlu benarkan *Install unknown apps* untuk pemasangan ujian). **APK debug hanya untuk testing**, bukan diterbitkan terus ke Google Play.
6. Untuk pratonton web HTTPS: GitHub repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Kembali ke **Actions → Terbit Preview Web → Run workflow**. URL akan muncul dalam deployment, lazimnya `https://<username>.github.io/<repository>/`. Di URL ini, mikrofon pelayar boleh diuji jika disokong.

**Jika butang Run workflow tiada**, periksa repository mempunyai `.github/workflows/*.yml`, workflow dibenarkan pada tab Actions, dan branch utama ialah `main` atau `master`.

## Cara 3 — Bangunkan dengan komputer sendiri (pilihan)

Perlu Node.js 22+, Android Studio / Android SDK, dan Java 21.

```bash
npm install
npm run dev
# buka localhost yang dipaparkan
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

Fail APK ialah `android/app/build/outputs/apk/debug/app-debug.apk`. Untuk bina semula selepas perubahan: `npm run build && npx cap sync android`.

## Sambungan AI sebenar (pilihan)

Tanpa sambungan ini, demo masih boleh digunakan untuk nota, infografik, jadual dan tugasan; cuma ringkasan demo menggunakan pemilihan ayat, bukan model AI. **Pengesanan bahasa audio secara automatik** memerlukan laluan transkripsi AI pada Worker.

**Cloudflare Worker** bertindak sebagai perantara selamat supaya OpenAI API key **tidak** diletakkan dalam APK atau GitHub. Perkhidmatan OpenAI API mungkin mengenakan bayaran penggunaan. Pastikan ada had perbelanjaan/rate limit untuk penggunaan sebenar oleh ramai pelajar.

1. Daftar/log masuk Cloudflare → **Workers & Pages** → Create Worker → Edit Code.
2. Salin keseluruhan kod daripada `worker/worker.js`, deploy.
3. Pada Worker → **Settings → Variables and Secrets**, tambah **dua secret**:
   - `OPENAI_API_KEY` = kunci OpenAI API anda (dapat daripada platform OpenAI, bukan daripada ChatGPT Plus).
   - `APP_ACCESS_TOKEN` = satu kod akses panjang, sukar diteka, pilihan anda sendiri.
4. Di EduNova → tab **Profil** → isi **URL Worker AI** dan **Kod akses Worker** yang sama seperti `APP_ACCESS_TOKEN` → **Simpan Sambungan**.
5. Dalam tab Nota AI, klik **Jana Nota Ringkas** untuk analisis AI sebenar. Butang **Rakam untuk AI** menggunakan mikrofon, menghantar audio kepada Worker, lalu OpenAI menukarkan audio kepada teks dengan pengesanan bahasa automatik.

Worker contoh ini menggunakan `gpt-4o-mini` untuk analisis dan `whisper-1` untuk rakaman. Ia sesuai untuk prototaip peribadi. Sebelum digunakan untuk ramai pelajar, tambahkan autentikasi setiap pengguna, rate limiting, kawalan kos, dan polisi perlindungan data. **Kod akses berkongsi tidak setanding dengan sistem login selamat.**

## Had dan perkara yang penting

- **Bahasa:** boleh mengenal pasti tulisan beberapa bahasa dan, apabila AI diaktifkan, transkripsi bahasa yang disokong oleh model. Tiada sistem boleh menjamin semua bahasa/loghat; pengecaman suara langsung menggunakan bahasa pilihan/peranti, **bukan** autodetect semua bahasa audio.
- **Notifikasi:** Android 13+ meminta kebenaran notifikasi. Tekan **Tetapan Alarm APK** pada tab Tugasan untuk membuka tetapan peringatan tepat jika sistem memerlukannya. Peringatan masih boleh terlewat kerana penjimatan bateri atau ketetapan OS. Web preview tidak menyediakan alarm yang berfungsi selepas laman ditutup.
- **Storan:** fail data utama berada dalam storan peribadi aplikasi Android, bukan folder Downloads. Fungsi **Arkib → Kongsi** dan **Profil → Eksport Sandaran** membantu mengeluarkan salinan.
- **Pemasangan/penerbitan:** workflow menyediakan APK debug untuk ujian. APK Play Store perlukan penandatanganan release dan proses penerbitan berasingan.
- **Infografik:** templat SVG dijana daripada isi nota; 3D/anime ialah gaya ilustrasi vektor, bukan model text-to-image.
- **Pelesenan data:** Gunakan rakaman kuliah hanya apabila dibenarkan dan dapatkan persetujuan peserta yang dirakam. Jangan hantar nota sulit ke penyedia AI tanpa izin.
- Kod ini masih perlu diuji pada telefon Android sebenar, terutama mikrofon, perkongsian fail, kebenaran dan notifikasi mengikut versi Android.

## Struktur projek

```text
EduNova/
├── index.html                  # titik masuk Vite + Capacitor
├── public/
│   ├── preview.html            # versi web tanpa pakej npm
│   ├── app.js                  # UI + logik kelima-lima tab
│   ├── style.css               # responsive design
│   └── icon.svg
├── src/native.js               # storan Android, kongsi, notifikasi & speech
├── worker/worker.js            # Cloudflare Worker pilihan
├── worker/wrangler.toml
├── .github/workflows/
│   ├── android.yml             # bina app-debug.apk
│   └── pages.yml               # deploy preview web
├── capacitor.config.json
├── vite.config.js
├── package.json
└── README.md
```

Dibina sebagai prototaip **EduNova v1.0**, sesuai untuk percubaan dan penambahbaikan.
