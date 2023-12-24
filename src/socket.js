// socket.js
import io from 'socket.io-client';

const socket = io.connect("https://server-c58z.onrender.com");

export default socket;
