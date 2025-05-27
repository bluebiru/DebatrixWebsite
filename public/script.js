const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const username = document.getElementById('username');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = username.value.trim();
  const text = input.value.trim();
  const time = new Date().toLocaleTimeString();

  if (user && text) {
    socket.emit('chat message', {
      user,
      text,
      time,
    });
    input.value = '';
  }
});

socket.on('chat message', (msgObj) => {
  const item = document.createElement('li');
  item.textContent = `[${msgObj.time}] ${msgObj.user}: ${msgObj.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});
