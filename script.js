document.querySelectorAll('.debate-btn').forEach(button => {
    button.addEventListener('click', () => {
      alert(`You selected: ${button.textContent}`);
      // nanti bisa redirect ke halaman debat/topik
    });
  });
  