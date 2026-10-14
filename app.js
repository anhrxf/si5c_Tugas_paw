	const express = require('express');
	const app = express();
	const PORT = 3000;
	
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
	app.get('/tvSeries/:id', (req, res) => {
	  const id = parseInt(req.params.id);
	  const data = tvSeries.find((m) => m.id === id);
	
	  if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
	  res.json(data);
	});
	
	// POST /tvSeries -> tambah data baru
	app.post('/tvSeries', (req, res) => {
	  const { judul, status } = req.body;
	
	  if (!judul || !status) {
	    return res.status(400).json({ message: 'judul dan status wajib diisi' });
	  }
	
	  const baru = { id: nextId++, judul, status };
	  tvSeries.push(baru);
	  res.status(201).json(baru);
	});
	
	// PUT /tvSeries/:id -> ubah data
	app.put('/tvSeries/:id', (req, res) => {
	  const id = parseInt(req.params.id);
	  const index = tvSeries.findIndex((m) => m.id === id);
	
	  if (index === -1) {
	    return res.status(404).json({ message: 'Data tidak ditemukan' });
	  }
	
	  tvSeries[index] = { ...tvSeries[index], ...req.body, id };
	  res.json(tvSeries[index]);
	});
	
	// DELETE /tvSeries/:id -> hapus data
	app.delete('/tvSeries/:id', (req, res) => {
	  const id = parseInt(req.params.id);
	  const index = tvSeries.findIndex((m) => m.id === id);
	
	  if (index === -1) {
	    return res.status(404).json({ message: 'Data tidak ditemukan' });
	  }
	
	  tvSeries.splice(index, 1);
	  res.status(204).send();
	});
	
	app.listen(PORT, () => {
	  console.log(`Server berjalan di http://localhost:${PORT}`);
	});
