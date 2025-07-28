// Static modern background artwork
const canvas = document.getElementById('artwork');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const palette = ['#7f5af0', '#2cb67d', '#f25f4c', '#b8c1ec', '#232946'];

function drawOrbs() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.globalAlpha = 0.13 + Math.random() * 0.18;
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = 80 + Math.random() * 120;
        const grad = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
        grad.addColorStop(0, palette[i % palette.length]);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

drawOrbs();

// Responsive canvas
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    drawOrbs();
});

// Add motion to skills on hover
const skills = document.querySelectorAll('.skills-list li');
skills.forEach(skill => {
    skill.addEventListener('mousemove', e => {
        skill.style.transform = `scale(1.12) rotate(${(e.offsetX - skill.offsetWidth/2)/8}deg)`;
    });
    skill.addEventListener('mouseleave', () => {
        skill.style.transform = '';
    });
});

// AI Chat logic (demo using public API)
const chatForm = document.getElementById('ai-chat-form');
const chatInput = document.getElementById('ai-chat-input');
const chatHistory = document.getElementById('ai-chat-history');

if (chatForm && chatInput && chatHistory) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMsg = chatInput.value.trim();
        if (!userMsg) return;
        appendMsg('user', userMsg);
        chatInput.value = '';
        chatInput.disabled = true;
        // Show loading
        appendMsg('ai', '...');
        // Use a public AI endpoint for demo (replace with your own API for production)
        try {
            const res = await fetch('https://api.affiliateplus.xyz/api/chatgpt?message=' + encodeURIComponent(userMsg) + '&botname=SahilAI&ownername=Sahil', { method: 'GET' });
            const data = await res.json();
            // Remove loading
            removeLastMsg('ai');
            appendMsg('ai', data.reply || 'Sorry, I could not answer that.');
        } catch (err) {
            removeLastMsg('ai');
            appendMsg('ai', 'Sorry, there was an error connecting to the AI.');
        }
        chatInput.disabled = false;
        chatInput.focus();
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
}
function appendMsg(sender, text) {
    const div = document.createElement('div');
    div.className = 'ai-chat-msg ' + sender;
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
function removeLastMsg(sender) {
    const msgs = chatHistory.querySelectorAll('.ai-chat-msg.' + sender);
    if (msgs.length > 0) msgs[msgs.length - 1].remove();
}
