const mongoose = require('mongoose');

// Subdocument Schema untuk Studio
const studioSchema = new mongoose.Schema({
  nama: { 
    type: String, 
    required: [true, 'nama studio wajib diisi'], 
    trim: true 
  },
  negara: { 
    type: String, 
    trim: true 
  },
}, { _id: false }); // _id: false agar subdocument tidak dibuatkan _id terpisah

// Schema Utama Streaming
const streamingSchema = new mongoose.Schema({
  judul: { 
    type: String, 
    required: [true, 'judul wajib diisi'], 
    trim: true 
  },
  jumlahEpisode: { 
    type: Number, 
    required: [true, 'jumlahEpisode wajib diisi'],
    min: [1, 'jumlahEpisode minimal 1']
  },
  status: { 
    type: String, 
    required: [true, 'status wajib diisi'], 
    enum: {
      values: ['Tayang', 'Tamat'],
      message: '{VALUE} bukan status yang valid (hanya Tayang atau Tamat)'
    },
    trim: true 
  },
  studio: studioSchema, // Menggunakan subdocument studioSchema
  studioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Studio' },
  tahunRilis: {
    type: Number, 
    required: [true, 'tahunRilis wajib diisi'] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Streaming', streamingSchema);