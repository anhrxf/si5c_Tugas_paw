// Model: menyimpan data dan fungsi pengolahnya (tanpa req/res)
let tvSeries = [
  { id: 1, judul: "Breaking Bad", genre: "Drama", tahun_rilis: 2008, jumlah_musim: 5, platform: "Netflix", status: "tamat" },
  { id: 2, judul: "Stranger Things", genre: "Fiksi Ilmiah", tahun_rilis: 2016, jumlah_musim: 5, platform: "Netflix", status: "tayang" },
  { id: 3, judul: "The Last of Us", genre: "Drama", tahun_rilis: 2023, jumlah_musim: 2, platform: "HBO Max", status: "tayang" }
];
let nextId = 4;

const getAll = (status) => {
  if (status) return tvSeries.filter((s) => s.status === status);
  return tvSeries;
};

const getById = (id) => tvSeries.find((s) => s.id === id);

const create = (data) => {
  const baru = { id: nextId++, ...data };
  tvSeries.push(baru);
  return baru;
};

const update = (id, data) => {
  const index = tvSeries.findIndex((s) => s.id === id);
  if (index === -1) return null;
  tvSeries[index] = { id, ...data };
  return tvSeries[index];
};

const remove = (id) => {
  const index = tvSeries.findIndex((s) => s.id === id);
  if (index === -1) return null;
  return tvSeries.splice(index, 1)[0];
};

module.exports = { getAll, getById, create, update, remove };