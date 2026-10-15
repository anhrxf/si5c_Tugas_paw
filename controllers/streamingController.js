const streamingModel = require('../models/streamingModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.getAll = (req, res) => {
  const { status } = req.query;
  res.json(streamingModel.getAll(status));
};

exports.getById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const data = streamingModel.getById(id);
  if (!data) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(data);
};

exports.create = (req, res, next) => {
  const { judul, jumlahEpisode, status, studio, tahunRilis } = req.body;

  if (!judul || !studio || !status ||
      jumlahEpisode === undefined || tahunRilis === undefined) {
    return next(errorHttp(400, 'Semua field wajib diisi'));
  }
  if (!Number.isInteger(jumlahEpisode) || !Number.isInteger(tahunRilis)) {
    return next(errorHttp(400, 'jumlahEpisode dan tahunRilis harus berupa angka'));
  }

  const baru = streamingModel.create({ judul, jumlahEpisode, status, studio, tahunRilis });
  res.status(201).json(baru);
};

exports.update = (req, res, next) => {
  const id = parseInt(req.params.id);
  const { judul, jumlahEpisode, status, studio, tahunRilis } = req.body;

  const hasil = streamingModel.update(id, { judul, jumlahEpisode, status, studio, tahunRilis });
  if (!hasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.json(hasil);
};

exports.remove = (req, res, next) => {
  const id = parseInt(req.params.id);
  const berhasil = streamingModel.remove(id);
  if (!berhasil) return next(errorHttp(404, 'Data tidak ditemukan'));
  res.status(204).send();
};