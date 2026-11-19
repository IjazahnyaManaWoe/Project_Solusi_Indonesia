# Pilah Pintar

Website micro-learning pemilahan sampah dan daur ulang untuk siswa SMA. Setiap
modul berisi pelajaran singkat 2–3 menit dan kuis dengan umpan balik langsung.
Selain itu ada halaman **Ide Prakarya** berisi ide membuat barang dari sampah
pilahan. Tampilan dibuat mobile-first, mendukung dark mode otomatis, dan tidak
memerlukan login.

Dibangun dengan:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Konten Markdown di `content/modules/`, dibaca saat build
- Progres belajar disimpan di `localStorage` perangkat

Tidak ada database, Supabase, login, dashboard admin, atau environment variable.
Semua halaman dihasilkan statis saat build.

## Menjalankan di lokal

Prasyarat: Node.js 20.9 atau lebih baru dan npm.

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Untuk mencoba hasil build produksi:

```bash
npm run build
npm start
```

## Struktur project

```
app/
  page.tsx                  # beranda
  modul/[slug]/page.tsx     # halaman modul + kuis
  prakarya/
    page.tsx                # pilihan jenis sampah
    [jenis]/page.tsx        # daftar ide + filter kesulitan
    [jenis]/[slug]/page.tsx # detail ide prakarya
  tentang/page.tsx          # halaman tentang
components/                 # header, footer, kartu modul, kuis, dll.
content/
  modules/                  # semua modul yang tampil di website
  _template.md              # template modul (tidak dibaca sistem)
  crafts/
    _types.json             # daftar jenis sampah (slug, nama, ikon)
    _template.md            # template ide prakarya (tidak dibaca sistem)
    botol-plastik/          # satu folder per jenis sampah
    kemasan-snack-kopi/
    kardus-kertas/
    kaleng/
lib/
  modules.ts                # pembacaan & validasi frontmatter modul
  crafts.ts                 # pembacaan & validasi konten prakarya
  craft-types.ts            # tipe & konstanta bersama
  craft-checklist.ts        # checklist "Sebelum mulai" di localStorage
  progress.ts               # akses localStorage
public/images/              # gambar untuk konten Markdown
```

## Menambah modul teks

1. Salin `content/_template.md` ke `content/modules/`.
2. Ganti nama file, misalnya `05-judul-modul.md`. Gunakan huruf kecil dan tanda
   hubung. **Nama file menjadi slug URL**, jadi file tersebut dapat dibuka di
   `/modul/05-judul-modul`.
3. Isi frontmatter di bagian atas file.
4. Tulis isi pelajaran dengan Markdown di bawah frontmatter.
5. Hapus catatan penggunaan template.

Contoh frontmatter:

```yaml
---
title: "Judul modul"
summary: "Ringkasan satu kalimat."
order: 5
duration: "3 menit"
type: "text"
videoUrl: ""
quiz:
  - question: "Pertanyaan?"
    options:
      - "Pilihan A"
      - "Pilihan B"
      - "Pilihan C"
      - "Pilihan D"
    answer: 1
    explanation: "Penjelasan kenapa jawaban itu benar."
---
```

Keterangan field:

| Field       | Wajib | Keterangan                                                       |
| ----------- | ----- | ---------------------------------------------------------------- |
| `title`     | Ya    | Judul modul                                                      |
| `summary`   | Ya    | Ringkasan satu kalimat untuk kartu di beranda                    |
| `order`     | Ya    | Angka urutan tampil; modul diurutkan dari angka terkecil         |
| `duration`  | Ya    | Perkiraan durasi, misalnya `"3 menit"`                           |
| `type`      | Ya    | `"text"` atau `"video"`                                          |
| `videoUrl`  | Tidak | Kosong untuk modul teks; tautan YouTube untuk video              |
| `poster`    | Tidak | Path poster di folder `public`, mis. `/images/poster.png`        |
| `posterAlt` | Tidak | Wajib jika `poster` diisi; deskripsi gambar untuk aksesibilitas  |
| `quiz`      | Ya    | Daftar soal, minimal satu soal                                   |

Markdown mendukung daftar, tabel (GFM), kutipan, tautan, gambar, dan penekanan
teks. Kamu tidak perlu mengubah kode untuk menambah modul. Konten dibaca saat
build; di lokal, muat ulang halaman setelah menambah file. Jika masih belum
muncul, jalankan ulang `npm run dev`.

Jika frontmatter tidak valid, build akan berhenti dengan pesan error di terminal
yang menyebut nama file dan field yang bermasalah. Contohnya: `order` bukan
angka, `type` salah, `answer` di luar jumlah opsi, atau soal tanpa
`explanation`.

## Menambah modul video

Ubah frontmatter modul menjadi:

```yaml
---
title: "Judul modul video"
summary: "Ringkasan singkat isi video."
order: 6
duration: "3 menit"
type: "video"
videoUrl: "https://www.youtube.com/watch?v=VIDEO_ID"
quiz:
  - question: "Pertanyaan?"
    options: ["A", "B", "C", "D"]
    answer: 0
    explanation: "Penjelasan jawaban."
---
```

Tautan YouTube biasa akan diubah otomatis menjadi embed responsif. Bentuk yang
didukung antara lain:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

Video tampil di atas, lalu isi Markdown di bawahnya dipakai sebagai ringkasan
atau catatan. Gunakan tautan YouTube biasa, bukan kode `<iframe>`.

## Format kuis

Kuis ditulis di frontmatter, bukan di dalam isi Markdown:

```yaml
quiz:
  - question: "Pertanyaan?"
    options:
      - "Jawaban A"
      - "Jawaban B"
      - "Jawaban C"
      - "Jawaban D"
    answer: 2
    explanation: "Alasan jawaban benar."
```

Aturan:

- `options` minimal dua pilihan.
- `answer` adalah index jawaban benar, dimulai dari **0**. Pada contoh di atas,
  jawaban benar adalah "Jawaban C".
- `explanation` wajib diisi dan tampil setelah siswa memilih jawaban.
- Kuis berjalan satu soal per layar, tanpa reload halaman dan tanpa form HTML.

## Menaruh gambar

1. Simpan gambar di `public/images/`, misalnya `public/images/pot-botol.webp`.
2. Panggil dari Markdown dengan path yang diawali `/images/`:

```markdown
![Pot dari botol bekas](/images/pot-botol.webp)
```

Selalu isi teks alternatif (`alt`) yang menjelaskan gambar. Gunakan gambar yang
sudah dikompres (misalnya JPG atau WebP) agar halaman tetap ringan di HP.

## Menambah poster ringkasan visual

Setiap modul boleh punya satu poster ringkasan. Jika diisi, halaman modul
menampilkan blok **Ringkasan Visual** setelah isi pelajaran dan sebelum kuis.
Gambar bisa dibuka dalam dialog ukuran penuh atau diunduh lewat tombol di blok
tersebut. Semua poster juga muncul di bagian **Poster Pengingat** pada beranda;
bagian itu otomatis disembunyikan jika belum ada modul yang punya poster.

1. Simpan gambar poster di `public/images/`, misalnya
   `public/images/poster-pemilahan.png`.
2. Tambahkan dua field berikut di frontmatter modul:

```yaml
poster: "/images/poster-pemilahan.png"
posterAlt: "Poster berisi tiga langkah memilah sampah plastik dan sisa makanan."
```

3. Jalankan ulang build atau muat ulang halaman pengembangan.

Aturan validasi:

- `poster` harus diawali `/` dan menunjuk file yang benar-benar ada di folder
  `public`. Jika file tidak ditemukan, build gagal dengan pesan yang menyebut
  nama file modul dan path gambarnya.
- `posterAlt` wajib diisi jika `poster` diisi, dan tidak boleh diisi jika
  `poster` kosong. Tuliskan deskripsi singkat isi poster untuk pembaca layar.
- Path tidak boleh keluar dari folder `public`.

Rasio poster yang disarankan adalah 3:4 (potret). Ukuran piksel tidak perlu
ditulis di frontmatter karena `next/image` menyesuaikan tampilannya.

## Ide Prakarya

Halaman `/prakarya` menampilkan jenis sampah sebagai kartu. Setiap jenis punya
halaman daftar ide dengan filter Mudah/Sedang/Sulit, dan setiap ide punya
halaman detail berisi bahan, checklist "Sebelum mulai", langkah pembuatan, tips
keamanan, serta bagian "Rapikan setelahnya".

Semua ide dibaca dari `content/crafts/<jenis>/<nama-file>.md`. Menambah ide
cukup dengan menambah satu file Markdown, tanpa mengubah kode.

### Menambah ide prakarya

1. Pilih folder jenis sampah yang sesuai di `content/crafts/`, misalnya
   `content/crafts/botol-plastik/`.
2. Salin `content/crafts/_template.md` ke folder tersebut.
3. Ganti nama file, misalnya `tempat-pensil.md`. **Nama file menjadi slug URL**,
   jadi ide tersebut dapat dibuka di `/prakarya/botol-plastik/tempat-pensil`.
4. Isi frontmatter di bagian atas file.
5. Tulis langkah pembuatan sebagai daftar bernomor, lalu tutup dengan heading
   `## Rapikan setelahnya`.
6. Hapus komentar catatan penggunaan template.

Contoh frontmatter dan isi:

```markdown
---
title: "Pot Tanaman dari Botol Bekas"
wasteType: "botol-plastik"
difficulty: "Mudah"
duration: "30 menit"
summary: "Botol air mineral bisa jadi pot kecil untuk tanaman di meja kelas."
materials:
  - "Botol plastik 1,5 L yang sudah dicuci"
  - "Tanah secukupnya"
tools:
  - "Gunting"
  - "Spidol"
safety: "Minta bantuan guru saat memotong botol."
---

1. Cuci botol sampai bersih, lalu keringkan.
2. Potong botol sesuai garis yang sudah ditandai.

## Rapikan setelahnya

Kumpulkan sisa potongan dan masukkan ke tempat sampah anorganik.
```

Keterangan field:

| Field        | Wajib | Keterangan                                                    |
| ------------ | ----- | ------------------------------------------------------------- |
| `title`      | Ya    | Judul ide prakarya                                            |
| `wasteType`  | Ya    | Harus sama dengan nama folder dan slug di `_types.json`       |
| `difficulty` | Ya    | `"Mudah"`, `"Sedang"`, atau `"Sulit"`                          |
| `duration`   | Ya    | Perkiraan waktu, misalnya `"30 menit"`                         |
| `summary`    | Ya    | Ringkasan satu kalimat untuk kartu ide                        |
| `materials`  | Ya    | Daftar bahan yang dipakai (bahan utama dari sampah)           |
| `tools`      | Ya    | Daftar alat/bahan tambahan, tampil sebagai checklist           |
| `safety`     | Ya    | Satu tips keamanan penting                                    |

Di dalam Markdown, tulis langkah pembuatan sebagai daftar bernomor. Heading
`## Rapikan setelahnya` wajib ada dan diisi dengan cara membereskan sisa bahan
serta menyimpan karya.

Jika frontmatter tidak valid, build berhenti dengan pesan error yang menyebut
nama file dan penyebabnya. Contohnya `wasteType` tidak cocok dengan folder,
`difficulty` salah eja, daftar `tools` kosong, atau heading "Rapikan setelahnya"
tidak ditemukan.

Checklist "Sebelum mulai" tersimpan otomatis di `localStorage` dengan key
`pilah-pintar-craft-checklist-v1`. Tidak ada data yang dikirim ke server.

### Menambah jenis sampah baru

1. Tambahkan satu entri di `content/crafts/_types.json`:

```json
{
  "slug": "kaca",
  "name": "Kaca",
  "icon": "Recycle",
  "description": "Botol kaca dan toples bekas yang sudah dicuci."
}
```

2. Buat folder dengan nama yang sama persis dengan `slug`, misalnya
   `content/crafts/kaca/`.
3. Tambahkan minimal satu file ide di folder tersebut.

Urutan tampilan jenis sampah mengikuti urutan entri di `_types.json`. Field
`icon` memakai nama ikon dari [lucide-react](https://lucide.dev/icons) yang
tersedia di registry: `GlassWater`, `Coffee`, `Package`, `Can`, `Box`,
`CupSoda`, `Newspaper`, dan `Recycle`. Nama ikon yang tidak tersedia akan
menghentikan build dengan pesan error yang jelas.

## Progres dan lencana

- Kuis yang selesai ditandai sebagai modul selesai, dan skor terbaik disimpan.
- Data disimpan di `localStorage` dengan key `pilah-pintar-progress-v1`.
- Beranda menampilkan jumlah modul selesai dan progress bar.
- Lencana **Kolektor Hijau** terbuka jika semua modul selesai dengan skor
  minimal 70%.
- Menghapus data situs di browser akan mengosongkan progres.
- Tidak ada data yang dikirim ke server.

## Deploy ke Vercel

1. Unggah project ke repositori GitHub, GitLab, atau Bitbucket.
2. Buka [vercel.com](https://vercel.com), pilih **Add New → Project**, lalu
   impor repositori tersebut.
3. Vercel mendeteksi Next.js secara otomatis. Biarkan build command
   `npm run build` dan pengaturan output default.
4. Tidak perlu menambahkan environment variable.
5. Klik **Deploy**.

Setiap kali kamu menambah atau mengubah modul, lakukan commit dan push. Vercel
akan membangun ulang situs dan konten baru akan muncul. Halaman modul dibuat
statis melalui `generateStaticParams`, sehingga seluruh modul langsung tersedia
setelah build.
