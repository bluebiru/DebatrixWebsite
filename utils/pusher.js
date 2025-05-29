// /utils/pusher.js
import Pusher from 'pusher-js';

const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || 'ap1', // Ganti dengan cluster Pusher lo
});

export default pusherClient;