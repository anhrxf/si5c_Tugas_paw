# API Data Streaming

REST API sederhana untuk mengelola data serial/streaming menggunakan Node.js dan Express.

## Fitur

- Melihat semua data streaming atau memfilter berdasarkan status.
- Melihat, menambahkan, memperbarui, dan menghapus data streaming.
- Melindungi operasi tambah, ubah, dan hapus menggunakan API key.
- Menangani kesalahan umum dengan respons JSON.

## Teknologi

- Node.js
- Express
- dotenv
- CORS

## Persyaratan

- Node.js dan npm

## Menjalankan aplikasi

1. Clone repositori dan masuk ke folder proyek:

   ```bash
   git clone https://github.com/anhrxf/si5c_Tugas_paw.git
   cd si5c_Tugas_paw
   ```

2. Pasang dependensi:

   ```bash
   npm install
   ```

3. Buat file `.env` dari template:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

   Atur nilai lingkungan di `.env` sesuai kebutuhan:

   ```dotenv
   PORT=3000
   API_KEY=ganti-dengan-kunci-rahasia-anda
   CORS_ORIGIN=http://localhost:5173
   ```

   `PORT` menentukan port server (default `3000`), `API_KEY` digunakan pada operasi yang mengubah data, dan `CORS_ORIGIN` menentukan origin yang diizinkan oleh CORS. Jangan membagikan atau memasukkan file `.env` ke repositori.

4. Jalankan server:

   ```bash
   npm start
   ```

   Untuk mode pengembangan dengan pemantauan perubahan file:

   ```bash
   npm run dev
   ```

Server secara default tersedia di `http://localhost:3000`.

`GET /` mengembalikan pesan bahwa server berjalan. Endpoint `/error-uji` sengaja menghasilkan kesalahan untuk pengujian dan sebaiknya tidak dipublikasikan ke lingkungan produksi.

## Endpoint

Semua endpoint data streaming menggunakan awalan `/tv-series`.

| Metode | Endpoint | API key | Keterangan |
| --- | --- | --- | --- |
| `GET` | `/tv-series` | Tidak | Mengambil semua data streaming. |
| `GET` | `/tv-series?status=Tamat` | Tidak | Memfilter data berdasarkan status (tidak peka huruf besar/kecil). |
| `GET` | `/tv-series/:id` | Tidak | Mengambil satu data berdasarkan ID. |
| `POST` | `/tv-series` | Ya | Menambahkan data streaming. |
| `PUT` | `/tv-series/:id` | Ya | Memperbarui field yang dikirim untuk ID tersebut. |
| `DELETE` | `/tv-series/:id` | Ya | Menghapus data berdasarkan ID. |

Untuk `POST`, kirim seluruh field berikut sebagai JSON:

```json
{
  "judul": "Contoh Serial",
  "jumlahEpisode": 10,
  "status": "Tayang",
  "studio": "Contoh Studio",
  "tahunRilis": 2026
}
```

`judul`, `jumlahEpisode`, `status`, `studio`, dan `tahunRilis` wajib diisi. `jumlahEpisode` dan `tahunRilis` harus berupa bilangan bulat. Untuk `PUT`, field yang tidak dikirim tidak akan diubah.

Operasi `POST`, `PUT`, dan `DELETE` memerlukan header berikut dengan nilai yang sama seperti `API_KEY` di `.env`:

```http
x-api-key: ganti-dengan-kunci-rahasia-anda
Content-Type: application/json
```

### Contoh permintaan

```bash
curl http://localhost:3000/tv-series
```

```bash
curl -X POST http://localhost:3000/tv-series \
  -H "Content-Type: application/json" \
  -H "x-api-key: ganti-dengan-kunci-rahasia-anda" \
  -d "{\"judul\":\"Contoh Serial\",\"jumlahEpisode\":10,\"status\":\"Tayang\",\"studio\":\"Contoh Studio\",\"tahunRilis\":2026}"
```

Di Windows PowerShell, permintaan tambah dapat dikirim menggunakan:

```powershell
$headers = @{ "x-api-key" = "ganti-dengan-kunci-rahasia-anda" }
$body = @{
  judul = "Contoh Serial"
  jumlahEpisode = 10
  status = "Tayang"
  studio = "Contoh Studio"
  tahunRilis = 2026
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tv-series" -Method Post -Headers $headers -ContentType "application/json" -Body $body
```

### Format kesalahan

Kesalahan dikembalikan sebagai objek JSON dengan properti `message`. Kode respons yang umum:

- `400` — data wajib belum lengkap, nilai jumlah/tahun bukan bilangan bulat, atau JSON tidak valid.
- `401` — API key tidak ada atau tidak valid.
- `404` — data atau rute tidak ditemukan.
- `500` — kesalahan tak terduga pada server.

## Pengujian melalui Postman

Impor `postman/Tugas2.postman_collection.json` ke Postman. Buat atau sesuaikan environment lokal dengan variabel `base_url` (misalnya `http://localhost:3000`) dan `api-key` yang sama dengan `API_KEY` di `.env`. Jangan membagikan nilai API key atau menyimpannya dalam file environment yang di-commit.

## Catatan penyimpanan data

Data awal didefinisikan di memori aplikasi. Perubahan melalui API akan hilang ketika server dimulai ulang. Meskipun template konfigurasi menyediakan `DB_URI`, aplikasi saat ini belum menggunakan database untuk menyimpan data.
