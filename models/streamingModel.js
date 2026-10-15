let streaming = [
  { id: 1, judul: 'Rahasia Kampus Tua', jumlahEpisode: 12, status: 'Tamat', studio: 'Layar Kita', tahunRilis: 2025 },
  { id: 2, judul: 'Detektif Malam', jumlahEpisode: 8, status: 'Tayang', studio: 'Cahaya Visual', tahunRilis: 2026 },
  { id: 3, judul: 'Jejak Kota Lama', jumlahEpisode: 20, status: 'Tamat', studio: 'Nusantara Pictures', tahunRilis: 2023 }
];
let nextId = 4;

function getAll(status) {
  if (!status) return streaming;
  return streaming.filter((s) => s.status.toLowerCase() === status.toLowerCase());
}

function getById(id) {
  return streaming.find((s) => s.id === id) || null;
}

function create(data) {
  const baru = { id: nextId++, ...data };
  streaming.push(baru);
  return baru;
}

function update(id, data) {
  const index = streaming.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const bersih = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  streaming[index] = { ...streaming[index], ...bersih, id };
  return streaming[index];
}

function remove(id) {
  const index = streaming.findIndex((s) => s.id === id);
  if (index === -1) return false;
  streaming.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };