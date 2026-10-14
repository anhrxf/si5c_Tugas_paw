	require('dotenv').config();
	const express = require('express');
	const cors = require('cors');

	const app = express();
	const PORT = process.env.PORT || 3000;
	
	function logger(req, res, next) {
  	const waktu = new Date().toISOString();
  	console.log(`[${waktu}] ${req.method} ${req.url}`);
  	next(); // wajib, agar request lanjut ke handler berikutnya
	}

	function cekApiKey(req, res, next) {
 	 const apiKey = req.headers['x-api-key'];

 	 if (apiKey !== process.env.API_KEY) {
    	return res.status(401).json({ message: 'API key tidak valid' });
  	}

  	next();
	}

	function errorHttp(status, message) {
  		const err = new Error(message);
  		err.status = status;
  		return err;
	}

	// Didaftarkan sebelum route agar mencatat seluruh request
	app.use(logger);
	
	app.use(cors({
  		origin: process.env.CORS_ORIGIN,
  		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	}));

	// Middleware agar req.body (JSON) dapat dibaca
	app.use(express.json());
	
	// Data sementara (disimpan di memori, hilang saat server restart)
	let tvSeries = [
  	{ id: 1, judul: 'Rahasia Kampus Tua', jumlahEpisode: 12, status: 'Tamat', studio: 'Layar Kita', tahunRilis: 2025 },
  	{ id: 2, judul: 'Detektif Malam', jumlahEpisode: 8, status: 'Tayang', studio: 'Cahaya Visual', tahunRilis: 2026 },
  	{ id: 3, judul: 'Jejak Kota Lama', jumlahEpisode: 20, status: 'Tamat', studio: 'Nusantara Pictures', tahunRilis: 2023 }
  	];
	let nextId = 3;
	
	// GET / -> memastikan server berjalan
	app.get('/', (req, res) => {
	  res.send('Server Express.js berjalan!');
	});
	
	// GET /tvSeries -> seluruh data, bisa difilter: /tvSeries?status=Tamat
	app.get('/tvSeries', (req, res) => {
	  const { status } = req.query;
	
	  if (status) {
	    const hasil = tvSeries.filter((m) => m.status === status);
	    return res.json(hasil);
	  }
	
	  res.json(tvSeries);
	});
	
	// GET /tvSeries/:id -> satu data berdasarkan id
	app.get('/tvSeries/:id', (req, res, next) => {
	  const id = parseInt(req.params.id);
	  const data = tvSeries.find((m) => m.id === id);
	
	  if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
	  res.json(data);
	});
	
	// POST /tvSeries -> tambah data baru
	app.post('/tvSeries', cekApiKey, (req, res, next) => {
	  const { judul, status } = req.body;
	
	  if (!judul || !status) {
	    return res.status(400).json({ message: 'judul dan status wajib diisi' });
	  }
	
	  const baru = { id: nextId++, judul, status };
	  tvSeries.push(baru);
	  res.status(201).json(baru);
	});
	
	// PUT /tvSeries/:id -> ubah data
	app.put('/tvSeries/:id', cekApiKey, (req, res) => {
	  const id = parseInt(req.params.id);
	  const index = tvSeries.findIndex((m) => m.id === id);
	
	  if (index === -1) return next(errorHttp(404, 'Data tidak ditemukan'));
	
	  tvSeries[index] = { ...tvSeries[index], ...req.body, id };
	  res.json(tvSeries[index]);
	});
	
	// DELETE /tvSeries/:id -> hapus data
	app.delete('/tvSeries/:id', cekApiKey, (req, res) => {
	  const id = parseInt(req.params.id);
	  const index = tvSeries.findIndex((m) => m.id === id);
	
	  if (index === -1) {
	    return res.status(404).json({ message: 'Data tidak ditemukan' });
	  }
	
	  tvSeries.splice(index, 1);
	  res.status(204).send();
	});

	app.get('/error-uji', () => {
  		throw new Error('Kesalahan tak terduga untuk pengujian');
	});

	// Handler 404: rute yang tidak ada
	app.use((req, res) => {
  		res.status(404).json({ message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan` });
	});

	// Error handler: WAJIB 4 parameter
	app.use((err, req, res, next) => {
  		// Body JSON yang rusak (dilempar oleh express.json())
  		if (err.type === 'entity.parse.failed') {
    		return res.status(400).json({ message: 'Format JSON tidak valid' });
  		}

  		const status = err.status || 500;

  		if (status === 500) {
    		console.error(err.stack); // detail hanya dicatat di server
    		return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  		}

  		res.status(status).json({ message: err.message });
	});
	
	app.listen(PORT, () => {
	  console.log(`Server berjalan di http://localhost:${PORT}`);
	});
