// התחברות לשרת הסוקט בפורט הנוכחי
const socket = io();

// אם השרת והלקוח בפרויקטים אחרים
// const socket = io.connect("http://localhost:8000");

const h1 = document.querySelector('h1');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

// Handle form submission
form.addEventListener('submit', e => {
    e.preventDefault();

    const message = input.value.trim();
    if (message) {
        // Emit the message to the server
        socket.emit('new message', message);

        // Clear the input
        input.value = '';
    }
});

// Listen for incoming messages
socket.on('user connected', ({ userId }) => {
    h1.textContent += ` - user ${userId}`
})
socket.on('send message', msgFromServer => {
    const item = document.createElement('li');
    item.textContent = `new message added by ${msgFromServer.by}: ${msgFromServer.msg}`;
    messages.append(item);

    // Scroll to the bottom
    messages.scrollTop = messages.scrollHeight;
});