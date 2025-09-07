const character = document.getElementById('character');
const greetingBubble = document.getElementById('greeting-bubble');

let audioContext;
let audioBuffer;
let isAudioInitialized = false;

async function setupAudio() {
    if (isAudioInitialized) return;
    isAudioInitialized = true;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    try {
        const response = await fetch('greeting.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.error("Failed to load or decode audio:", e);
    }
}

function playSound() {
    if (!audioContext || !audioBuffer) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

let isInteracting = false;

function showGreeting(text) {
    greetingBubble.textContent = text;
    greetingBubble.classList.add('visible');
}

function hideGreeting() {
    greetingBubble.classList.remove('visible');
}

character.addEventListener('click', async () => {
    if (isInteracting) return;
    isInteracting = true;

    if (!isAudioInitialized) {
        await setupAudio();
    }
    playSound();
    
    character.classList.add('wave');
    showGreeting('Hi!');

    setTimeout(() => {
        character.classList.remove('wave');
        hideGreeting();
        isInteracting = false;
    }, 1500);
});

window.addEventListener('load', () => {
    setTimeout(() => {
        showGreeting('Click me!');

        setTimeout(() => {
            hideGreeting();
        }, 2000);
    }, 500);
});

