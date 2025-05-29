// /pages/api/pusher.js
import Pusher from 'pusher';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER || 'ap1', // Ganti dengan cluster Pusher lo
      useTLS: true,
    });

    const { message, sender } = req.body;

    try {
      await pusher.trigger('chat-channel', 'new-message', {
        message,
        sender,
        timestamp: new Date().toISOString(),
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error broadcasting message:', error);
      res.status(500).json({ error: 'Failed to broadcast message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}