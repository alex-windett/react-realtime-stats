var socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'init',
    url: document.location.href,
    ref: document.referrer
  }));
};
