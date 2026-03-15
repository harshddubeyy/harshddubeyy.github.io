/* ============================================
   HARSH DUBEY — PORTFOLIO JS
   Particle Constellation + Typing + Scroll Anims
   ============================================ */

// ===== PARTICLE CONSTELLATION BACKGROUND =====
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let width, height, particles, animationId;
const PARTICLE_COUNT = 80;
const CONNECT_DISTANCE = 150;
const MOUSE_RADIUS = 200;

const mouse = { x: null, y: null };

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.radius = Math.random() * 2 + 0.5;
    this.baseAlpha = Math.random() * 0.5 + 0.2;
    this.alpha = this.baseAlpha;
    // Random color between cyan and purple
    const hue = Math.random() > 0.5 ? 186 : 263; // cyan or purple hue
    this.color = hue;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    // React to mouse
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        this.alpha = this.baseAlpha + force * 0.5;
        this.x += dx * force * 0.02;
        this.y += dy * force * 0.02;
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.color}, 80%, 65%, ${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECT_DISTANCE) {
        const opacity = (1 - dist / CONNECT_DISTANCE) * 0.15;
        const gradient = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        gradient.addColorStop(0, `hsla(186, 80%, 55%, ${opacity})`);
        gradient.addColorStop(1, `hsla(263, 80%, 55%, ${opacity})`);

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  connectParticles();
  animationId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

// ===== TYPING EFFECT =====
const taglines = [
  "Developer & Tech Enthusiast",
  "Building things for the web",
  "Turning ideas into code",
  "Open-source contributor",
];

const heroTagline = document.getElementById("heroTagline");
let taglineIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentText = taglines[taglineIndex];

  if (isDeleting) {
    heroTagline.innerHTML =
      currentText.substring(0, charIndex - 1) +
      '<span class="typed-cursor">|</span>';
    charIndex--;
    typingSpeed = 40;
  } else {
    heroTagline.innerHTML =
      currentText.substring(0, charIndex + 1) +
      '<span class="typed-cursor">|</span>';
    charIndex++;
    typingSpeed = 90;
  }

  if (!isDeleting && charIndex === currentText.length) {
    typingSpeed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    taglineIndex = (taglineIndex + 1) % taglines.length;
    typingSpeed = 500;
  }

  setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ===== SCROLL FADE-IN (Intersection Observer) =====
const fadeElements = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function highlightNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightNav);

// ===== NAVBAR SHADOW ON SCROLL =====
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ===== MOBILE MENU TOGGLE =====
const navToggle = document.getElementById("navToggle");
const navLinksContainer = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinksContainer.classList.toggle("open");
});

// Close menu when a link is clicked
navLinksContainer.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("open");
    navLinksContainer.classList.remove("open");
  });
});
