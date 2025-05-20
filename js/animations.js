// THE BIGCANE EXPERIMENTAL - ADVANCED ANIMATIONS
// Author: Claude AI
// Date: May 2025

// Audio Visualizer Effect
class AudioVisualizer {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      barCount: 32,
      barColor: '#FF2A6D',
      sensitivity: 1.5,
      autoplay: false
    }, options);
    
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.audio = null;
    this.animationFrame = null;
    this.bars = [];
    
    this.init();
  }
  
  init() {
    // Create container
    this.container = document.createElement('div');
    this.container.classList.add('visualizer-container');
    this.container.style.display = 'flex';
    this.container.style.alignItems = 'flex-end';
    this.container.style.justifyContent = 'space-between';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.element.appendChild(this.container);
    
    // Create bars
    for (let i = 0; i < this.options.barCount; i++) {
      const bar = document.createElement('div');
      bar.classList.add('visualizer-bar');
      bar.style.flex = '1';
      bar.style.margin = '0 1px';
      bar.style.background = this.options.barColor;
      bar.style.height = '5%';
      bar.style.transition = 'height 0.05s ease';
      this.container.appendChild(bar);
      this.bars.push(bar);
    }
    
    // Create audio element if autoplay
    if (this.options.autoplay) {
      this.createAudio();
    }
    
    // Add play button
    const playButton = document.createElement('button');
    playButton.classList.add('visualizer-play');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.style.position = 'absolute';
    playButton.style.top = '50%';
    playButton.style.left = '50%';
    playButton.style.transform = 'translate(-50%, -50%)';
    playButton.style.borderRadius = '50%';
    playButton.style.width = '60px';
    playButton.style.height = '60px';
    playButton.style.backgroundColor = 'rgba(255, 42, 109, 0.9)';
    playButton.style.border = 'none';
    playButton.style.color = 'white';
    playButton.style.fontSize = '24px';
    playButton.style.cursor = 'pointer';
    playButton.style.boxShadow = '0 0 20px rgba(255, 42, 109, 0.5)';
    this.element.appendChild(playButton);
    
    this.playButton = playButton;
    
    // Event listener
    this.playButton.addEventListener('click', () => {
      if (!this.audio) {
        this.createAudio();
      } else {
        if (this.audio.paused) {
          this.audio.play();
          this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          this.audio.pause();
          this.playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
      }
    });
  }
  
  createAudio() {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      
      // Create analyser
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      // Create audio element
      this.audio = new Audio();
      this.audio.crossOrigin = 'anonymous';
      this.audio.src = this.options.audioUrl || 'path/to/default-music.mp3';
      
      // Connect everything
      this.source = this.audioContext.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      // Start visualization
      this.visualize();
      
      // Play audio
      this.audio.play();
      this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
      
      // Handle audio end
      this.audio.addEventListener('ended', () => {
        this.playButton.innerHTML = '<i class="fas fa-play"></i>';
        cancelAnimationFrame(this.animationFrame);
      });
    } catch (error) {
      console.error('Audio visualization error:', error);
    }
  }
  
  visualize() {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const renderFrame = () => {
      this.animationFrame = requestAnimationFrame(renderFrame);
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculate bar height based on frequency data
      for (let i = 0; i < this.options.barCount; i++) {
        // Use logarithmic distribution for more visual appeal
        const index = Math.floor(Math.pow(i / this.options.barCount, 2) * dataArray.length);
        const value = dataArray[index] * this.options.sensitivity;
        
        // Set bar height
        this.bars[i].style.height = Math.max(5, value) + '%';
      }
    };
    
    renderFrame();
  }
}

// Particle Field Animation
class ParticleField {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      particleCount: 50,
      particleSize: 3,
      particleColor: '#F0F0F0',
      particleOpacity: 0.5,
      speed: 1,
      connectParticles: true,
      connectDistance: 100,
      lineColor: '#F0F0F0',
      lineOpacity: 0.2,
      responsive: true,
      mouseInteraction: true
    }, options);
    
    this.init();
  }
  
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.mouse = {
      x: null,
      y: null,
      radius: 100
    };
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.createParticles();
    this.animate();
    
    if (this.options.mouseInteraction) {
      this.element.addEventListener('mousemove', e => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      
      this.element.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }
  }
  
  resize() {
    if (this.options.responsive) {
      this.canvas.width = this.element.offsetWidth;
      this.canvas.height = this.element.offsetHeight;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
    
    // Recreate particles if needed
    if (this.particles.length > 0) {
      this.particles = [];
      this.createParticles();
    }
  }
  
  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * this.options.particleSize + 1,
        speedX: (Math.random() - 0.5) * this.options.speed,
        speedY: (Math.random() - 0.5) * this.options.speed,
        color: this.getRandomColor()
      });
    }
  }
  
  getRandomColor() {
    // Randomly choose from neon colors for party vibe
    const colors = [
      '#FF2A6D', // neon-pink
      '#05D9E8', // electric-blue
      '#D264B6', // neon-purple
      '#FFD700', // golden-glow
      '#39FF14', // neon-green
      '#FF5733'  // electric-coral
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Boundary check
      if (p.x < 0 || p.x > this.canvas.width) {
        p.speedX = -p.speedX;
      }
      
      if (p.y < 0 || p.y > this.canvas.height) {
        p.speedY = -p.speedY;
      }
      
      // Mouse interaction
      if (this.options.mouseInteraction && this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color; // Use the particle's color
      this.ctx.globalAlpha = this.options.particleOpacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      
      // Connect particles
      if (this.options.connectParticles) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.options.connectDistance) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.options.lineColor;
            this.ctx.globalAlpha = this.options.lineOpacity * (1 - distance / this.options.connectDistance);
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
          }
        }
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

// Text Scramble Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += '<span class="dud">' + char + '</span>';
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Tagline Rotator (with Text Scramble)
class TaglineRotator {
  constructor(element, phrases) {
    this.element = element;
    this.phrases = phrases;
    this.currentIndex = 0;
    this.fx = new TextScramble(this.element);
    
    this.start();
  }
  
  start() {
    this.fx.setText(this.phrases[this.currentIndex])
      .then(() => {
        setTimeout(() => {
          this.next();
        }, 3000); // Wait 3 seconds before showing next phrase
      });
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
    this.start();
  }
}

// NeonGlow Effect for Buttons and Elements
class NeonGlow {
  constructor(elements, options = {}) {
    this.elements = elements;
    this.options = Object.assign({
      hoverColor: '#FF2A6D',
      normalColor: '#05D9E8',
      intensity: 15,
      duration: 0.3,
      blendMode: 'normal'
    }, options);
    
    this.init();
  }
  
  init() {
    this.elements.forEach(element => {
      // Create glow overlay
      const glow = document.createElement('div');
      glow.classList.add('neon-glow-overlay');
      glow.style.position = 'absolute';
      glow.style.top = '0';
      glow.style.left = '0';
      glow.style.width = '100%';
      glow.style.height = '100%';
      glow.style.boxShadow = `0 0 ${this.options.intensity}px ${this.options.normalColor}`;
      glow.style.opacity = '0.5';
      glow.style.transition = `box-shadow ${this.options.duration}s ease, opacity ${this.options.duration}s ease`;
      glow.style.pointerEvents = 'none';
      glow.style.borderRadius = 'inherit';
      glow.style.mixBlendMode = this.options.blendMode;
      
      // Make the parent relatively positioned if not already
      const position = getComputedStyle(element).position;
      if (position === 'static') {
        element.style.position = 'relative';
      }
      
      // Add overflow hidden if needed
      element.style.overflow = 'hidden';
      
      // Add the glow element
      element.appendChild(glow);
      
      // Event listeners
      element.addEventListener('mouseenter', () => {
        glow.style.boxShadow = `0 0 ${this.options.intensity * 2}px ${this.options.hoverColor}`;
        glow.style.opacity = '0.8';
      });
      
      element.addEventListener('mouseleave', () => {
        glow.style.boxShadow = `0 0 ${this.options.intensity}px ${this.options.normalColor}`;
        glow.style.opacity = '0.5';
      });
    });
  }
}

// Liquid Bubble Effect
class LiquidBubbles {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      count: 20,
      minSize: 10,
      maxSize: 50,
      colors: ['#FF2A6D', '#05D9E8', '#D264B6'],
      speed: 2
    }, options);
    
    this.init();
  }
  
  init() {
    const container = document.createElement('div');
    container.classList.add('liquid-bubbles-container');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none';
    
    // Make the parent relatively positioned if not already
    const position = getComputedStyle(this.element).position;
    if (position === 'static') {
      this.element.style.position = 'relative';
    }
    
    this.element.appendChild(container);
    
    // Create bubbles
    for (let i = 0; i < this.options.count; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('liquid-bubble');
      
      // Random size
      const size = this.options.minSize + Math.random() * (this.options.maxSize - this.options.minSize);
      
      // Random position
      const posX = Math.random() * 100;
      const posY = 100 + Math.random() * 50; // Start below the container
      
      // Random color
      const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
      
      // Random speed
      const speed = (1 + Math.random()) * this.options.speed;
      
      // Random delay
      const delay = Math.random() * 5;
      
      // Set bubble styles
      bubble.style.position = 'absolute';
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${posX}%`;
      bubble.style.bottom = `-${posY}px`;
      bubble.style.backgroundColor = color;
      bubble.style.borderRadius = '50%';
      bubble.style.opacity = '0.5';
      bubble.style.filter = `blur(${size / 10}px)`;
      bubble.style.animation = `bubble-rise ${15 / speed}s linear ${delay}s infinite`;
      
      container.appendChild(bubble);
    }
    
    // Add animation keyframes
    if (!document.querySelector('#liquid-bubbles-keyframes')) {
      const style = document.createElement('style');
      style.id = 'liquid-bubbles-keyframes';
      style.innerHTML = `
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1) rotate(0);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-25%) scale(1.05) rotate(5deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-50%) scale(0.95) rotate(-5deg);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-75%) scale(1.05) rotate(2deg);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(0.8) rotate(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize animations after DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize particle fields
  const particleContainers = document.querySelectorAll('.experience__particles, .newsletter__particles');
  particleContainers.forEach(container => {
    new ParticleField(container, {
      particleCount: parseInt(container.getAttribute('data-particle-count')) || 30,
      particleSize: parseFloat(container.getAttribute('data-particle-size')) || 2,
      connectParticles: true,
      connectDistance: 120,
      lineOpacity: 0.1
    });
  });
  
  // Initialize audio visualizers
  const audioVisualizers = document.querySelectorAll('.audio-visualizer');
  audioVisualizers.forEach(visualizer => {
    new AudioVisualizer(visualizer, {
      barCount: parseInt(visualizer.getAttribute('data-bar-count')) || 32,
      barColor: visualizer.getAttribute('data-bar-color') || '#FF2A6D',
      sensitivity: parseFloat(visualizer.getAttribute('data-sensitivity')) || 1.5,
      audioUrl: visualizer.getAttribute('data-audio-url')
    });
  });
  
  // Initialize tagline rotation
  const taglineContainer = document.querySelector('.tagline-container');
  if (taglineContainer) {
    const taglines = Array.from(taglineContainer.querySelectorAll('.tagline'));
    if (taglines.length > 0) {
      // Create a new element for the active tagline
      const activeTagline = document.createElement('div');
      activeTagline.classList.add('active-tagline');
      taglineContainer.innerHTML = '';
      taglineContainer.appendChild(activeTagline);
      
      // Start the rotation with the text scramble effect
      new TaglineRotator(activeTagline, taglines.map(tag => tag.textContent));
    }
  }
  
  // Initialize neon glow effects
  const neonButtons = document.querySelectorAll('.button:not(.button--secondary):not(.button--outlined)');
  if (neonButtons.length > 0) {
    new NeonGlow(neonButtons, {
      hoverColor: '#FF2A6D',
      normalColor: '#05D9E8'
    });
  }
  
  // Initialize secondary button glow effects
  const secondaryButtons = document.querySelectorAll('.button--secondary');
  if (secondaryButtons.length > 0) {
    new NeonGlow(secondaryButtons, {
      hoverColor: '#05D9E8',
      normalColor: '#05D9E8',
      intensity: 10
    });
  }
  
  // Initialize liquid bubbles in product sections
  const productSection = document.querySelector('.products');
  if (productSection) {
    new LiquidBubbles(productSection, {
      count: 15,
      colors: ['#FF2A6D', '#05D9E8', '#D264B6']
    });
  }
  
  // Initialize drink elements animation
  const drinkElements = document.querySelectorAll('.drink-element');
  drinkElements.forEach(element => {
    element.style.transition = 'transform 0.3s ease-out';
    
    element.addEventListener('mouseenter', () => {
      element.style.transform = 'scale(1.2)';
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'scale(1)';
    });
  });
  
  // Add audio effects to specific elements (if audio is enabled)
  const useAudio = localStorage.getItem('audioEnabled') === 'true';
  if (useAudio) {
    // Create audio context
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Button hover sound
      const buttons = document.querySelectorAll('.button');
      buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          const oscillator = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
          
          gain.gain.setValueAtTime(0.1, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.connect(gain);
          gain.connect(audioContext.destination);
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
        });
      });
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }
});
