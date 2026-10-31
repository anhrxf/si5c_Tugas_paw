const Studio = require('../models/studioModel');

exports.create = async (req, res) => {
  const { kode, nama } = req.body;
  const studio = await Studio.create({ kode, nama });
  res.status(201).json(studio);
};

exports.getAll = async (req, res) => {
  res.json(await Studio.find());
};
