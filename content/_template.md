---
title: "Judul modul baru"
summary: "Ringkasan modul dalam satu kalimat."
order: 5
duration: "3 menit"
type: "text"
videoUrl: ""
# Opsional. Isi keduanya jika modul punya poster ringkasan visual.
poster: ""
posterAlt: ""
quiz:
  - question: "Tulis pertanyaan pertama di sini?"
    options:
      - "Pilihan jawaban A"
      - "Pilihan jawaban B"
      - "Pilihan jawaban C"
      - "Pilihan jawaban D"
    answer: 0
    explanation: "Jelaskan kenapa jawaban itu benar."
  - question: "Tulis pertanyaan kedua di sini?"
    options:
      - "Pilihan jawaban A"
      - "Pilihan jawaban B"
      - "Pilihan jawaban C"
      - "Pilihan jawaban D"
    answer: 2
    explanation: "Jelaskan kenapa jawaban itu benar."
---

Tulis isi pelajaran dalam format Markdown di sini.

## Subjudul

Gunakan paragraf pendek agar nyaman dibaca di HP. Kamu bisa memakai daftar:

- poin pertama,
- poin kedua,
- poin ketiga.

> Kutipan atau catatan penting bisa ditaruh seperti ini.

## Catatan penggunaan template

1. Salin file ini ke folder `content/modules/`.
2. Ganti nama file, misalnya `05-judul-modul.md`. Nama file menjadi slug URL.
3. Isi `title`, `summary`, `order`, dan `duration`.
4. Untuk modul teks, biarkan `type: "text"` dan `videoUrl: ""`.
5. Untuk modul video, ubah menjadi `type: "video"` dan isi `videoUrl` dengan tautan YouTube.
6. `answer` adalah index jawaban benar, dimulai dari 0.
7. Poster bersifat opsional. Jika dipakai, isi `poster` dengan path gambar di `public/images/` dan `posterAlt` dengan deskripsi gambarnya.
8. Hapus bagian "Catatan penggunaan template" sebelum modul ditampilkan.
9. File `_template.md` ini tidak dibaca oleh website karena berada di luar folder `content/modules/`.
