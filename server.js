// server.js - Modified for deployment on Render/Railway

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// --- PENTING: Hapus baris ini! ---
// app.use(express.static('public'));
// Frontend statis (HTML, CSS, JS) akan di-host terpisah di Vercel.
// Backend ini hanya akan menangani koneksi Socket.IO dan API lainnya.

// Jika ada API endpoint lain selain Socket.IO, tambahkan di sini. Contoh:
// app.get('/api/status', (req, res) => {
//   res.json({ status: 'Backend is running!' });
// });

io.on('connection', (socket) => {
  console.log('A user connected');

  // Event listener untuk pesan chat
  socket.on('chat message', (msgObj) => {
    console.log('Message received:', msgObj); // Untuk debugging
    io.emit('chat message', msgObj); // Broadcast pesan ke semua user yang terhubung
  });

  // Event listener saat user terputus
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Gunakan process.env.PORT untuk port dinamis dari hosting provider
// Jika tidak ada (misal saat development lokal), fallback ke port 3000
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
