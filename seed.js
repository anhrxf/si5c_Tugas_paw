// seed.js
// Mengisi basis data dengan 3 studio dan 25 serial streaming. Aman dijalankan berulang:
// data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Studio = require('./models/studioModel');
const Streaming = require('./models/streamingModel');

const JUDUL = [
  'Rahasia Kampus Tua', 'Detektif Malam', 'Jejak Kota Lama', 'Bayang Senja', 'Lembah Misteri',
  'Cinta di Balik Awan', 'Lorong Waktu', 'Penjaga Laut Selatan', 'Keluarga Harmoni', 'Pembalasan Sang Pendekar',
  'Gadis Rimba', 'Kisah Tanah Leluhur', 'Catatan Sang Juara', 'Petualangan Rimba', 'Dua Garis Takdir',
  'Kupu Malam', 'Serigala Ibukota', 'Misteri Gunung Api', 'Bidadari Negeri Seberang', 'Langit Biru',
  'Satu Hari Nanti', 'Jodoh Impian', 'Mengejar Angin', 'Pahlawan Samudera', 'Sang Pemimpi'
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Streaming.deleteMany({});
  await Studio.deleteMany({});

  const studio = await Studio.insertMany([
    { kode: 'LK', nama: 'Layar Kita' },
    { kode: 'CV', nama: 'Cahaya Visual' },
    { kode: 'NP', nama: 'Nusantara Pictures' },
  ]);

  const serials = JUDUL.map((judul, i) => ({
    judul,
    jumlahEpisode: 6 + ((i * 2) % 20),
    status: i % 2 === 0 ? 'Tamat' : 'Tayang',
    studio: {
      nama: studio[i % 3].nama,
      negara: 'Indonesia',
    },
    studioId: studio[i % 3]._id, // LK, CV, NP bergantian
    tahunRilis: 2021 + (i % 6),
  }));

  await Streaming.insertMany(serials);

  console.log(`Seed selesai: ${studio.length} studio, ${serials.length} serial streaming`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
