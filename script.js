// Birthday Wishes Application - JavaScript

// DOM Elements
const wishInput = document.getElementById('wishInput');
const addWishBtn = document.getElementById('addWishBtn');
const wishList = document.getElementById('wishList');
const blowCandlesBtn = document.getElementById('blowCandlesBtn');
const resetBtn = document.getElementById('resetBtn');
const sendWishesBtn = document.getElementById('sendWishesBtn');
const message = document.getElementById('message');
const nameInput = document.getElementById('nameInput');
const dateInput = document.getElementById('dateInput');
const ageDisplay = document.getElementById('ageDisplay');
const confettiContainer = document.getElementById('confettiContainer');
const wishCount = document.getElementById('wishCount');
const totalWishes = document.getElementById('totalWishes');
const blownCount = document.getElementById('blownCount');

// State Management
let wishes = [];
let candlesBlown = 0;
let blownCandlesTotal = 0;

// Load data from localStorage
function loadFromLocalStorage() {
    const savedWishes = localStorage.getItem('wishes');
    const savedBlown = localStorage.getItem('blownCandlesTotal');
    
    if (savedWishes) {
        wishes = JSON.parse(savedWishes);
        renderWishes();
    }
    
    if (savedBlown) {
        blownCandlesTotal = parseInt(savedBlown);
        updateStats();
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('wishes', JSON.stringify(wishes));
    localStorage.setItem('blownCandlesTotal', blownCandlesTotal.toString());
}

// Add wish
function addWish() {
    const wishText = wishInput.value.trim();
    
    if (wishText === '') {
        showMessage('Please write a wish!', 'error');
        return;
    }
    
    if (wishes.length >= 10) {
        showMessage('Maximum 10 wishes allowed!', 'error');
        return;
    }
    
    const wish = {
        id: Date.now(),
        text: wishText,
        timestamp: new Date().toLocaleString()
    };
    
    wishes.push(wish);
    wishInput.value = '';
    wishInput.focus();
    
    renderWishes();
    saveToLocalStorage();
    updateStats();
    showMessage('Wish added! 🎈', 'success');
}

// Render wishes
function renderWishes() {
    wishList.innerHTML = '';
    
    wishes.forEach(wish => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item';
        wishItem.innerHTML = `
            <span class="wish-text">${escapeHtml(wish.text)}</span>
            <button class="wish-delete" onclick="deleteWish(${wish.id})">✕</button>
        `;
        wishList.appendChild(wishItem);
    });
    
    updateWishCounter();
}

// Delete wish
function deleteWish(id) {
    wishes = wishes.filter(wish => wish.id !== id);
    renderWishes();
    saveToLocalStorage();
    updateStats();
    showMessage('Wish deleted!', 'info');
}

// Update wish counter
function updateWishCounter() {
    wishCount.textContent = wishes.length;
}

// Blow candles
function blowCandles() {
    const candles = document.querySelectorAll('.candle');
    let currentlyBlow = 0;
    
    candles.forEach((candle, index) => {
        if (!candle.classList.contains('blown')) {
            setTimeout(() => {
                candle.classList.add('blown');
                currentlyBlow++;
                playSound('blow');
            }, index * 200);
        }
    });
    
    if (currentlyBlow > 0) {
        candlesBlown = currentlyBlow;
        blownCandlesTotal += currentlyBlow;
        
        setTimeout(() => {
            createConfetti();
            showMessage('🎊 All candles blown! Your wish will come true! 🌟', 'success');
            playSound('celebration');
        }, 600);
        
        saveToLocalStorage();
        updateStats();
    } else {
        showMessage('All candles are already blown!', 'info');
    }
}

// Create confetti
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#ff6b9d', '#a8edea', '#ff9a56'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 1) + 's';
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3500);
    }
}

// Reset
function resetAll() {
    if (confirm('Are you sure you want to reset everything?')) {
        wishes = [];
        candlesBlown = 0;
        
        // Reset candles
        document.querySelectorAll('.candle').forEach(candle => {
            candle.classList.remove('blown');
        });
        
        // Clear inputs
        wishInput.value = '';
        nameInput.value = '';
        dateInput.value = '';
        ageDisplay.innerHTML = '';
        
        renderWishes();
        updateStats();
        saveToLocalStorage();
        showMessage('Everything reset! Ready for a new celebration! 🎉', 'info');
    }
}

// Send wishes (email simulation)
function sendWishes() {
    if (wishes.length === 0) {
        showMessage('Add some wishes before sending!', 'error');
        return;
    }
    
    const person = nameInput.value || 'Birthday Person';
    const wishesText = wishes.map((w, i) => `${i + 1}. ${w.text}`).join('\n');
    
    // Simulate email sending
    const emailContent = `
Birthday Wishes for ${person}

${wishesText}

Total Wishes: ${wishes.length}
Date: ${new Date().toLocaleString()}

🎉 Happy Birthday! 🎉
    `;
    
    console.log('Email Content:', emailContent);
    
    // Copy to clipboard
    navigator.clipboard.writeText(emailContent).then(() => {
        showMessage('✅ Wishes copied to clipboard! Ready to share!', 'success');
    }).catch(() => {
        showMessage('✅ Wishes prepared! You can manually copy them.', 'success');
    });
}

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    
    setTimeout(() => {
        message.textContent = '';
        message.className = 'message';
    }, 4000);
}

// Calculate age
function calculateAge() {
    if (!dateInput.value) return;
    
    const birthDate = new Date(dateInput.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    const person = nameInput.value || 'This person';
    ageDisplay.innerHTML = `${person} is turning <strong>${age + 1}</strong> years old! 🎂`;
}

// Play sound (using Web Audio API for simple beep)
function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'blow') {
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } else if (type === 'celebration') {
            // Play celebration sound
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    } catch (e) {
        console.log('Audio not available');
    }
}

// Update statistics
function updateStats() {
    totalWishes.textContent = wishes.length;
    blownCount.textContent = blownCandlesTotal;
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Event Listeners
addWishBtn.addEventListener('click', addWish);
wishInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addWish();
    }
});

blowCandlesBtn.addEventListener('click', blowCandles);
resetBtn.addEventListener('click', resetAll);
sendWishesBtn.addEventListener('click', sendWishes);

nameInput.addEventListener('input', calculateAge);
dateInput.addEventListener('change', calculateAge);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === '?') {
        showMessage('📝 Enter wishes, 🎂 Blow candles, 💨 Reset, 🎁 Send!', 'info');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    showMessage('Welcome to Birthday Wishes! 🎉', 'success');
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.max = today;
});

// Prevent accidental page reload when data is present
window.addEventListener('beforeunload', (e) => {
    if (wishes.length > 0 || blownCandlesTotal > 0) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Mobile touch optimization
if (window.matchMedia('(max-width: 600px)').matches) {
    document.addEventListener('touchstart', () => {}, { passive: true });
}
