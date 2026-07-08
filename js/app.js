function initializePortfolio() {
  // --- Header Scroll Effect ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('nav a');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (navbar.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-bars';
        }
      });
    });
  }

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- Interactive Canvas Audio Spectrum & Frequency Waveform Analyzer ---
  const canvas = document.getElementById('biofeedbackChart');
  const bpmDisplay = document.getElementById('bpmDisplay'); // acts as volume decibel (e.g. -6 dB)
  const hrvDisplay = document.getElementById('hrvDisplay'); // acts as peak frequency (e.g. 12.4 kHz)
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = 220;

    // Handle Resize
    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    });

    // Spectrum configuration
    const numBars = 32;
    let frequencies = new Array(numBars).fill(0);
    let time = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      time += 0.05;

      // 1. Draw Grid Pattern
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Generate and Draw Equalizer Bars
      const barWidth = (width / numBars) - 3;
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)'); // Purple base
      gradient.addColorStop(0.6, 'rgba(14, 165, 233, 0.8)'); // Cyan mid
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.9)'); // Pink peak

      for (let i = 0; i < numBars; i++) {
        // Create organic wave movement representing audio frequencies
        // Lower indexes (bass) have larger amplitude; higher indexes (treble) have faster oscillation
        const baseAmp = i < 6 ? 0.7 : i < 18 ? 0.5 : 0.25;
        const wave = Math.sin(time * (1 + i * 0.1) + i * 0.3) * Math.cos(time * 0.4 + i * 0.1);
        
        // Map target height (0 to 1) and smooth it
        const targetHeight = Math.max(0.05, (baseAmp + wave * baseAmp) * 0.9 + Math.random() * 0.05);
        frequencies[i] += (targetHeight - frequencies[i]) * 0.2; // Lerp smoothing

        const barHeight = frequencies[i] * height * 0.75;
        const x = i * (barWidth + 3);
        const y = height - barHeight;

        // Draw EQ bar
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      // 3. Draw Overlaying Continuous Waveform Line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(14, 165, 233, 0.3)';

      for (let x = 0; x < width; x++) {
        // Combine multiple frequencies to make a composite sound wave line
        const wave1 = Math.sin(x * 0.02 + time * 2) * 20;
        const wave2 = Math.sin(x * 0.05 - time * 4) * 10;
        const wave3 = Math.cos(x * 0.005 + time) * 5;
        const y = (height / 2.5) + wave1 + wave2 + wave3;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      // 4. Update Audio stats in the overlay periodically
      if (Math.floor(time * 10) % 20 === 0) { // every ~1 second
        // Decibel meters (simulating professional mix levels e.g. -6 to -1 dB)
        const dbValue = -(Math.round(2 + Math.random() * 8));
        if (bpmDisplay) bpmDisplay.textContent = `${dbValue} dB`;
        
        // Frequency meters (simulating active bands e.g. 10kHz to 15kHz)
        const freqValue = (10 + Math.sin(time) * 3 + Math.random() * 2).toFixed(1);
        if (hrvDisplay) hrvDisplay.textContent = `${freqValue} kHz`;
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- Contact Form Submission Handler ---
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      // Get Values
      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Simple Validation
      if (!name || !email || !message) {
        e.preventDefault();
        showStatus('Please fill in all fields.', 'error');
        return;
      }

      // Email Pattern check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        e.preventDefault();
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Real email dispatch using native submit targeting the hidden iframe (seamless on HTTP/HTTPS)
      showStatus('Establishing signal link...', 'success');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING...';
      }

      // Let the browser handle standard form submission to the iframe (e.preventDefault() is NOT called)
      
      // Reset the form fields and show confirmation after a brief delay
      setTimeout(() => {
        showStatus(`Thank you, ${name}! Your transmission was broadcasted successfully. I'll get back to you soon.`, 'success');
        contactForm.reset();
        
        // Reset inputs visual placeholder classes
        const inputsList = contactForm.querySelectorAll('.form-input');
        inputsList.forEach(input => {
          input.dispatchEvent(new Event('input'));
        });

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'SEND MESSAGE';
        }
      }, 1500);
    });

    function showStatus(text, type) {
      formStatus.textContent = text;
      formStatus.className = 'form-status ' + type;
      formStatus.style.display = 'block';
    }
  }

  // --- Input Label Float Trigger Fix ---
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    // Check initial state
    if (input.value) {
      input.setAttribute('placeholder', ' ');
    }
    input.addEventListener('input', () => {
      if (input.value) {
        input.setAttribute('placeholder', ' ');
      } else {
        input.removeAttribute('placeholder');
      }
    });
  });

  // --- Setup Scroll Direction & Stagger Elements ---
  // Assign direction classes to existing scroll reveal elements
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    if (el.classList.contains('hero-content') || el.classList.contains('about-text') || el.id === 'contactDetailsContainer') {
      el.classList.add('reveal-left');
    } else if (el.classList.contains('hero-visual')) {
      el.classList.add('reveal-right');
    } else if (el.classList.contains('section-header') || el.classList.contains('flagship-card')) {
      el.classList.add('reveal-up');
    } else if (el.classList.contains('contact-form')) {
      el.classList.add('reveal-scale');
    }
  });

  // Stagger expertise cards inside expertise grid
  const expGrid = document.getElementById('expertiseGridContainer');
  if (expGrid) {
    expGrid.classList.remove('scroll-reveal'); // Animate items instead of container
    const cards = expGrid.querySelectorAll('.expertise-card');
    cards.forEach((card, index) => {
      card.classList.add('scroll-reveal', 'reveal-up');
      card.style.transitionDelay = `${index * 0.15}s`;
    });
  }

  // Stagger project cards inside projects grid
  const projGrid = document.querySelector('.projects-grid');
  if (projGrid) {
    const cards = projGrid.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.15}s`;
    });
  }

  // Stagger contact items
  const contactList = document.querySelector('.contact-info-list');
  if (contactList) {
    const items = contactList.querySelectorAll('.contact-item');
    items.forEach((item, index) => {
      item.classList.add('scroll-reveal', 'reveal-left');
      item.style.transitionDelay = `${index * 0.12}s`;
    });
  }

  // Stagger tech tags in about section
  const techBadges = document.getElementById('aboutTechBadges');
  if (techBadges) {
    const tags = techBadges.querySelectorAll('.tech-tag');
    tags.forEach((tag, index) => {
      tag.classList.add('scroll-reveal', 'reveal-scale');
      tag.style.transitionDelay = `${index * 0.05}s`;
    });
  }
  
  // Stagger project gallery photos
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const images = gallery.querySelectorAll('.gallery-img');
    images.forEach((img, index) => {
      img.classList.add('scroll-reveal', 'reveal-scale');
      img.style.transitionDelay = `${index * 0.08}s`;
    });
  });

  // --- Scroll Reveal Animations ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20px 0px', // slightly offset trigger to keep scroll reveals snappy
    threshold: 0.02 // low threshold to guarantee they trigger as soon as they touch the viewport
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const scrollElements = document.querySelectorAll('.scroll-reveal');
  scrollElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// Guarantee execution even if loaded after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
  initializePortfolio();
}
