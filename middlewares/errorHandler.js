// Penanganan error terpusat, termasuk 404 untuk rute yang tidak ada
const notFound = (req, res, next) => {
  res.status(404).json({ pesan: `Rute ${req.method} ${req.originalUrl} tidak ditemukan` });
};

const errorHandler = (err, req, res, next) => {
  // JSON rusak dari express.json()
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ pesan: "Format JSON tidak valid" });
  }
  console.error(err);
  res.status(err.status || 500).json({ pesan: err.message || "Terjadi kesalahan pada server" });
};

module.exports = { notFound, errorHandler };