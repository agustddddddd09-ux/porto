/* ============================================
   PORTFOLIO SHERA PUTRI MEYLANI - SCRIPT.JS
   ============================================ */

'use strict';

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorSparkle = document.getElementById('cursorSparkle');
const hoverTargets  = 'a, button, .kontak-item, .tag, .edu-item, .proyek-list li, .toggle-switch, .cal-day';

document.addEventListener('mousemove', (e) => {
  cursorSparkle.style.left = e.clientX + 'px';
  cursorSparkle.style.top  = e.clientY + 'px';
});

document.addEventListener('mouseover', (e) => {
  if (e.target.closest(hoverTargets)) {
    cursorSparkle.classList.add('hover');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.closest(hoverTargets)) {
    cursorSparkle.classList.remove('hover');
  }
});

/* ============================================
   SCROLL-BASED SECTION REVEAL
   ============================================ */
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger education items staggered animation
      if (entry.target.id === 'pendidikan') {
        document.querySelectorAll('.edu-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('show'), i * 200);
        });
      }

      // Trigger profile progress bar
      if (entry.target.id === 'tentang') {
        setTimeout(() => {
          const fill = document.getElementById('profileProgress');
          if (fill) fill.style.width = '75%';
        }, 600);
      }
    }
  });
}, { threshold: 0.15 });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================
   NAVBAR: SCROLL EFFECT + ACTIVE LINK
   ============================================ */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  // Navbar shadow on scroll
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }

  // Highlight active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('active');
    }
  });
});

/* ============================================
   SMOOTH SCROLL FOR NAV LINKS
   ============================================ */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   SEARCH TOGGLE
   ============================================ */
const searchToggle = document.getElementById('searchToggle');
const searchBox    = document.getElementById('searchBox');
const searchInput  = document.getElementById('searchInput');

searchToggle.addEventListener('click', () => {
  searchBox.classList.toggle('open');
  if (searchBox.classList.contains('open')) {
    searchInput.focus();
  }
});

// Search functionality: scroll to matching section
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.toLowerCase().trim();
    const map = {
      beranda:    '#beranda',
      home:       '#beranda',
      tentang:    '#tentang',
      about:      '#tentang',
      pendidikan: '#pendidikan',
      education:  '#pendidikan',
      proyek:     '#proyek',
      project:    '#proyek',
      kontak:     '#kontak',
      contact:    '#kontak',
    };

    const found = Object.keys(map).find(k => query.includes(k));
    if (found) {
      document.querySelector(map[found]).scrollIntoView({ behavior: 'smooth' });
      searchBox.classList.remove('open');
      searchInput.value = '';
      showToast('Berpindah ke section: ' + found.charAt(0).toUpperCase() + found.slice(1));
    } else {
      showToast('Section tidak ditemukan 🔍');
    }
  }
  if (e.key === 'Escape') {
    searchBox.classList.remove('open');
    searchInput.value = '';
  }
});

/* ============================================
   MEDIA BUTTONS (SOUND / DARK THEME)
   ============================================ */
const soundBtn = document.getElementById('soundBtn');
const themeBtn = document.getElementById('themeBtn');
let soundOn    = false;
let darkMode   = false;

soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundBtn.innerHTML = soundOn
    ? '<i class="fas fa-volume-up"></i>'
    : '<i class="fas fa-volume-mute"></i>';
  soundBtn.classList.toggle('active', soundOn);
  showToast(soundOn ? '🔊 Suara aktif' : '🔇 Suara dimatikan');

  if (soundOn) playChime();
});

themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  themeBtn.innerHTML = darkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-cloud"></i>';
  themeBtn.classList.toggle('active', darkMode);
  showToast(darkMode ? '🌙 Mode Gelap' : '☀️ Mode Terang');
});

/* ============================================
   CHIME SOUND (Web Audio API)
   ============================================ */
function playChime() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const freqs = [523, 659, 784, 1047]; // C5 E5 G5 C6
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type      = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.6);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.6);
    });
  } catch (e) {
    // Audio not supported
  }
}

/* ============================================
   EDUCATION TOGGLE
   ============================================ */
const eduToggle    = document.getElementById('eduToggle');
const toggleStatus = document.getElementById('toggleStatus');
let   eduActive    = true;

eduToggle.addEventListener('click', () => {
  eduActive = !eduActive;
  eduToggle.classList.toggle('active', eduActive);
  toggleStatus.textContent = eduActive ? 'Aktif Kuliah' : 'Tidak Aktif';
  showToast(eduActive ? '✅ Status: Aktif Kuliah' : '⏸ Status: Tidak Aktif');
});

/* ============================================
   CALENDAR WIDGET
   ============================================ */
function buildCalendar() {
  const grid    = document.getElementById('calGrid');
  const header  = document.getElementById('calMonth');
  const now     = new Date();
  const year    = now.getFullYear();
  const month   = now.getMonth();
  const today   = now.getDate();

  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni',
                      'Juli','Agustus','September','Oktober','November','Desember'];
  header.textContent = monthNames[month] + ' ' + year;

  const days       = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const firstDay   = new Date(year, month, 1).getDay();
  const totalDays  = new Date(year, month + 1, 0).getDate();

  grid.innerHTML = '';

  // Header row
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className    = 'cal-day header';
    cell.textContent  = d;
    grid.appendChild(cell);
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day';
    grid.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement('div');
    cell.className   = 'cal-day' + (d === today ? ' today' : '');
    cell.textContent = d;
    cell.addEventListener('click', () => {
      showToast(`📅 ${d} ${monthNames[month]} ${year}`);
    });
    grid.appendChild(cell);
  }
}

buildCalendar();

/* ============================================
   PROJECT MODAL
   ============================================ */
const nextProjectBtn = document.getElementById('nextProjectBtn');
const projectModal   = document.getElementById('projectModal');
const modalClose     = document.getElementById('modalClose');

nextProjectBtn.addEventListener('click', () => {
  projectModal.classList.add('open');
});

modalClose.addEventListener('click', () => {
  projectModal.classList.remove('open');
});

projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) projectModal.classList.remove('open');
});

/* ============================================
   KONTAK: COPY TO CLIPBOARD
   ============================================ */
document.getElementById('copyPhone').addEventListener('click', () => {
  copyToClipboard('089516951670', '📋 Nomor telepon disalin!');
});

document.getElementById('copyEmail').addEventListener('click', () => {
  copyToClipboard('sheraputri1705@gmail.com', '📋 Email disalin!');
});

function copyToClipboard(text, message) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast(message));
  } else {
    // Fallback
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast(message);
  }
}

/* ============================================
   PAUSE / SHARE BUTTONS
   ============================================ */
const pauseBtn   = document.getElementById('pauseBtn');
const shareBtn   = document.getElementById('shareBtn');
const shareModal = document.getElementById('shareModal');
const shareClose = document.getElementById('shareClose');
const copyLink   = document.getElementById('copyLink');
let   paused     = false;

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.innerHTML = paused
    ? '<i class="fas fa-play"></i>'
    : '<i class="fas fa-pause"></i>';

  // Freeze / unfreeze scroll animations
  document.querySelectorAll('.section').forEach(s => {
    s.style.animationPlayState = paused ? 'paused' : 'running';
  });
  showToast(paused ? '⏸ Animasi dijeda' : '▶️ Animasi dilanjutkan');
});

shareBtn.addEventListener('click', () => {
  shareModal.classList.add('open');
});

shareClose.addEventListener('click', () => {
  shareModal.classList.remove('open');
});

shareModal.addEventListener('click', (e) => {
  if (e.target === shareModal) shareModal.classList.remove('open');
});

copyLink.addEventListener('click', () => {
  copyToClipboard(
    document.getElementById('shareUrl').textContent,
    '🔗 Link disalin!'
  );
});

// Social share buttons (visual feedback only)
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const platform = btn.classList.contains('whatsapp') ? 'WhatsApp'
                   : btn.classList.contains('twitter')  ? 'Twitter'
                   : 'LinkedIn';
    showToast(`📤 Membagikan via ${platform}...`);
    shareModal.classList.remove('open');
  });
});

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

/* ============================================
   SPARKLE PARTICLES ON CLICK
   ============================================ */
document.addEventListener('click', (e) => {
  createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
  const colors = ['#b8899a', '#9b8ec4', '#d4a8b8', '#c4b8e0', '#f5c5d5'];
  const count  = 8;

  for (let i = 0; i < count; i++) {
    const dot   = document.createElement('div');
    const angle = (i / count) * 360;
    const dist  = 30 + Math.random() * 40;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size  = 4 + Math.random() * 6;

    dot.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 1;
    `;

    document.body.appendChild(dot);

    requestAnimationFrame(() => {
      const rad = (angle * Math.PI) / 180;
      dot.style.left    = x + Math.cos(rad) * dist + 'px';
      dot.style.top     = y + Math.sin(rad) * dist + 'px';
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    setTimeout(() => dot.remove(), 650);
  }
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */
document.addEventListener('keydown', (e) => {
  const sectionIds = ['beranda', 'tentang', 'pendidikan', 'proyek', 'kontak'];
  const current    = getCurrentSection();
  const idx        = sectionIds.indexOf(current);

  if (e.key === 'ArrowDown' && idx < sectionIds.length - 1) {
    document.getElementById(sectionIds[idx + 1])
      .scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'ArrowUp' && idx > 0) {
    document.getElementById(sectionIds[idx - 1])
      .scrollIntoView({ behavior: 'smooth' });
  }
  if (e.key === 'Escape') {
    projectModal.classList.remove('open');
    shareModal.classList.remove('open');
    searchBox.classList.remove('open');
  }
});

function getCurrentSection() {
  let current = 'beranda';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });
  return current;
}

/* ============================================
   FLOATING DECORATIVE CIRCLES (Beranda)
   ============================================ */
function addDecoCircles() {
  const beranda = document.getElementById('beranda');
  const positions = [
    { top: '10%', left: '5%',  size: 80,  color: 'var(--mauve-light)',  delay: '0s'   },
    { top: '70%', left: '8%',  size: 50,  color: 'var(--purple-light)', delay: '2s'   },
    { top: '20%', right: '5%', size: 60,  color: 'var(--mauve-bg)',     delay: '1s'   },
    { top: '80%', right: '8%', size: 40,  color: 'var(--blue-light)',   delay: '3s'   },
  ];

  positions.forEach(pos => {
    const circle = document.createElement('div');
    circle.className = 'deco-circle';
    Object.assign(circle.style, {
      width:            pos.size + 'px',
      height:           pos.size + 'px',
      top:              pos.top  || 'auto',
      left:             pos.left || 'auto',
      right:            pos.right || 'auto',
      background:       pos.color,
      animationDelay:   pos.delay,
    });
    beranda.appendChild(circle);
  });
}

addDecoCircles();

/* ============================================
   NAV AVATAR CLICK → SCROLL TO TOP
   ============================================ */
document.getElementById('navAvatar').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   SCROLL-TO BUTTONS (Beranda → Tentang, etc.)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================
   INITIAL LOAD: trigger beranda visibility
   ============================================ */
window.addEventListener('load', () => {
  document.getElementById('beranda').classList.add('visible');
  showToast('👋 Selamat datang di portfolio Shera!');
});
