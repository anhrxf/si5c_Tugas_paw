// Controller: menangani request, validasi, dan response
const model = require("../models/tvSeriesModel");

const FIELD_WAJIB = ["judul", "genre", "tahun_rilis", "jumlah_musim", "platform", "status"];
const STATUS_VALID = ["tayang", "tamat"];

const validasi = (body) => {
  if (!body || typeof body !== "object") return "Body request tidak valid";
  const kosong = FIELD_WAJIB.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ""
  );
  if (kosong.length > 0) return `Data tidak lengkap, field wajib: ${kosong.join(", ")}`;
  if (!STATUS_VALID.includes(body.status)) return "Status harus 'tayang' atau 'tamat'";
  if (!Number.isInteger(body.tahun_rilis) || !Number.isInteger(body.jumlah_musim))
    return "tahun_rilis dan jumlah_musim harus berupa bilangan bulat";
  return null;
};

const ambilData = (body) => ({
  judul: body.judul,
  genre: body.genre,
  tahun_rilis: body.tahun_rilis,
  jumlah_musim: body.jumlah_musim,
  platform: body.platform,
  status: body.status
});

const getAll = (req, res) => {
  const { status } = req.query;
  if (status && !STATUS_VALID.includes(status)) {
    return res.status(400).json({ pesan: "Filter status harus 'tayang' atau 'tamat'" });
  }
  const data = model.getAll(status);
  res.status(200).json({ pesan: "Berhasil mengambil data", jumlah: data.length, data });
};

const getById = (req, res) => {
  const data = model.getById(Number(req.params.id));
  if (!data) return res.status(404).json({ pesan: "Data tidak ditemukan" });
  res.status(200).json({ pesan: "Berhasil mengambil data", data });
};

const create = (req, res) => {
  const error = validasi(req.body);
  if (error) return res.status(400).json({ pesan: error });
  const baru = model.create(ambilData(req.body));
  res.status(201).json({ pesan: "Data berhasil ditambahkan", data: baru });
};

const update = (req, res) => {
  const id = Number(req.params.id);
  if (!model.getById(id)) return res.status(404).json({ pesan: "Data tidak ditemukan" });
  const error = validasi(req.body);
  if (error) return res.status(400).json({ pesan: error });
  const hasil = model.update(id, ambilData(req.body));
  res.status(200).json({ pesan: "Data berhasil diubah", data: hasil });
};

const remove = (req, res) => {
  const hasil = model.remove(Number(req.params.id));
  if (!hasil) return res.status(404).json({ pesan: "Data tidak ditemukan" });
  res.status(200).json({ pesan: "Data berhasil dihapus", data: hasil });
};

module.exports = { getAll, getById, create, update, remove };