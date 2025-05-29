// /pages/index.js
import { useState, useEffect, useRef } from 'react';
import pusherClient from '../utils/pusher'; // Menggunakan konfigurasi Pusher client

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const chatBoxRef = useRef(null); // Ref untuk scroll otomatis

  useEffect(() => {
    // Meminta username saat komponen pertama kali dirender
    const storedUsername = localStorage.getItem('debatrix_username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      let inputUsername = prompt('Masukkan username Anda:');
      while (!inputUsername || inputUsername.trim() === '') {
        inputUsername = prompt('Username tidak boleh kosong. Masukkan username Anda:');
      }
      setUsername(inputUsername.trim());
      localStorage.setItem('debatrix_username', inputUsername.trim());
    }

    // Subscribe ke channel 'chat-channel'
    const channel = pusherClient.subscribe('chat-channel');

    // Bind ke event 'new-message' di channel tersebut
    channel.bind('new-message', function(data) {
      // Saat ada pesan baru, update state messages
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Membersihkan subscription saat komponen di-unmount
    // Ini penting untuk mencegah memory leak dan masalah reconnect
    return () => {
      pusherClient.unsubscribe('chat-channel');
      channel.unbind('new-message');
    };
  }, []); // [] agar useEffect hanya jalan sekali saat mount

  // Efek untuk scroll ke bawah setiap kali ada pesan baru
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Jalankan setiap kali `messages` berubah

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Pastikan pesan dan username tidak kosong
    if (newMessage.trim() === '' || username.trim() === '') return;

    // Payload yang akan dikirim ke API Route
    const messagePayload = {
      message: newMessage,
      sender: username,
    };

    try {
      // Kirim pesan ke API Route Next.js
      const response = await fetch('/api/pusher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setNewMessage(''); // Kosongkan input setelah berhasil kirim
      } else {
        alert('Gagal mengirim pesan: ' + (data.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Gagal mengirim pesan. Cek koneksi atau konsol.');
    }
  };

  return (
    <div className="container">
      <h1>Debatrix Chat Room</h1>
      {username && (
        <p className="username-display">Anda sebagai: <strong>{username}</strong></p>
      )}

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === username ? 'self' : 'other'}`}
          >
            <strong>{msg.sender}:</strong> {msg.message}
            <small>
              {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('id-ID') : 'N/A'}
            </small>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan Anda..."
          disabled={!username} {/* Disable input if username is not set */}
        />
        <button type="submit" disabled={!username || newMessage.trim() === ''}>Kirim</button>
      </form>
    </div>
  );
}