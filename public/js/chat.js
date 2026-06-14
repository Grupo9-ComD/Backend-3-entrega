const toggle = document.getElementById("chatToggle");
const widget = document.getElementById("chatWidget");

toggle?.addEventListener("click", () => {
    widget?.classList.toggle("chat-hidden");
});

const socket = io();

socket.on("connect", () => {
    console.log("Conectado:", socket.id);
});

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const mensaje = input.value.trim();

    if (!mensaje) return;

    socket.emit("send_message", mensaje);

    input.value = "";
});

socket.on("new_message", (mensaje) => {

    console.log("Nuevo mensaje:", mensaje);

    const li = document.createElement("li");

    li.textContent =
        `${mensaje.usuario}: ${mensaje.contenido}`;

    messages.appendChild(li);

    // opcional: baja automáticamente al último mensaje
    messages.scrollTop = messages.scrollHeight;
});