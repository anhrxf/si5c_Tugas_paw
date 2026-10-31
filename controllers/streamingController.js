const Streaming = require('../models/streamingModel');
const Studio = require('../models/studioModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['judul', 'jumlahEpisode', 'tahunRilis', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['judul', 'jumlahEpisode', 'status', 'studio', 'studioId', 'tahunRilis', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

// POST /tv-series
exports.create = async (req, res) => {
  const { judul, jumlahEpisode, status, studio, studioId, tahunRilis } = req.body;
  const data = await Streaming.create({ judul, jumlahEpisode, status, studio, studioId, tahunRilis });
  res.status(201).json(data);
};

// GET /tv-series (mendukung pagination dan query filter seperti ?status=..., ?negara=..., ?studio=...)
exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.status) {
    filter.status = new RegExp(`^${req.query.status}$`, 'i');
  }
  if (req.query.negara) {
    filter['studio.negara'] = String(req.query.negara);
  }
  if (req.query.studio) {
    const studio = await Studio.findOne({ kode: String(req.query.studio).toUpperCase() });
    filter.studioId = studio ? studio._id : { $in: [] };
  }

  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  // Sorting: ?sort=judul (naik) atau ?sort=-judul (turun). Bawaan: terbaru dulu (-createdAt)
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  // Projection: ?fields=judul,status
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  const query = Streaming.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // populate() otomatis menambahkan studioId ke hasil, jadi hanya dipanggil
  // bila studioId memang diminta (atau bila tidak ada pemilihan field)
  if (!select || select.split(' ').includes('studioId')) {
    query.populate('studioId', 'kode nama');
  }

  const [data, total] = await Promise.all([query, Streaming.countDocuments(filter)]);

  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};

// GET /tv-series/:id
exports.getById = async (req, res) => {
  const data = await Streaming.findById(req.params.id).populate('studioId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const { judul, jumlahEpisode, status, studio, studioId, tahunRilis } = req.body;
  const data = await Streaming.findByIdAndUpdate(
    req.params.id,
    { judul, jumlahEpisode, status, studio, studioId, tahunRilis },
    { returnDocument: 'after', runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await Streaming.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};