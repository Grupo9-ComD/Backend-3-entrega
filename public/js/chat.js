const messages = document.getElementById("messages");

if (messages) {
    const toggle = document.getElementById("chatToggle");
    const widget = document.getElementById("chatWidget");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("messageInput");

    const socket = io();

   
    function formatearFecha(fechaInput) {
        if (!fechaInput) return "";
        const date = new Date(fechaInput);
        
        // Formato: "14/06 19:59"
        const opciones = { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        };
        return date.toLocaleString('es-AR', opciones);
    }

    function bajarScroll() {
        setTimeout(() => {
            messages.scrollTop = messages.scrollHeight;
        }, 50);
    }

    toggle?.addEventListener("click", () => {
        widget?.classList.toggle("chat-hidden");
        if (!widget?.classList.contains("chat-hidden")) {
            bajarScroll();
        }
    });

    
    function crearElementoMensaje(m) {
        const li = document.createElement("li");
        
        const horaFormateada = formatearFecha(m.createdAt || m.fecha || new Date());

        li.innerHTML = `
            <div class="chat-meta">
                <span class="chat-user">${m.usuario}</span>
                <span class="chat-time">${horaFormateada}</span>
            </div>
            <div class="chat-text">${m.contenido}</div>
        `;
        return li;
    }

    async function cargarHistorial() {
        try {
            const res = await fetch("/chat/messages");
            const data = await res.json();

            messages.innerHTML = "";

            data.forEach((m) => {
                const li = crearElementoMensaje(m);
                messages.appendChild(li);
            });

            bajarScroll();
        } catch (err) {
            console.error("Error cargando historial:", err);
        }
    }

    form?.addEventListener("submit", (e) => {
        e.preventDefault();

        const mensaje = input.value.trim();
        if (!mensaje) return;

        // Enviamos el mensaje (el servidor debe recibirlo, guardarlo y emitirlo con la fecha)
        socket.emit("send_message", mensaje);
        input.value = "";
    });

    // Cuando llega un nuevo mensaje del socket
    socket.on("new_message", (m) => {
        const li = crearElementoMensaje(m);
        messages.appendChild(li);
        
        if (!widget?.classList.contains("chat-hidden")) {
            bajarScroll();
        }
    });

    cargarHistorial();
}