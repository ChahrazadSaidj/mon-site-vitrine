/**
 * MAIN JAVASCRIPT LOGIC
 * Navigation, 3D Tilts, Countdown, Voting Simulator, Gallery Lightbox, Testimonials, Social Sharing
 * Site Vitrine Liza SAÏDJ
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Sticky Navbar & Active Section Tracking ---
  const navbar = document.querySelector('.site-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      navLinksContainer.classList.toggle('mobile-open');
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('mobile-open');
    });
  });

  // --- 2. Countdown Timer to November 28, 2026 ---
  const electionDate = new Date('2026-11-28T08:00:00+01:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = electionDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const dEl = document.getElementById('count-days');
      const hEl = document.getElementById('count-hours');
      const mEl = document.getElementById('count-minutes');
      const sEl = document.getElementById('count-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    } else {
      const banner = document.querySelector('.countdown-box');
      if (banner) banner.innerHTML = '<span style="color:#10b981; font-weight:800;">JOUR DU SCRUTIN • VOTEZ LISTE 201 N° 7 !</span>';
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // --- 3. Interactive 3D Card Tilt Effect ---
  const tiltElements = document.querySelectorAll('[data-tilt-3d]');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', function (e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    el.addEventListener('mouseleave', function () {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 4. Interactive 3D Ballot Voting Simulator ---
  const ballotCard = document.getElementById('ballot-interactive-card');
  const voteBtnTrigger = document.querySelectorAll('.trigger-vote-sim');

  function triggerVoteAction() {
    if (!ballotCard) return;
    ballotCard.classList.toggle('voted');
    const isVoted = ballotCard.classList.contains('voted');

    const checkBox = ballotCard.querySelector('.ballot-check-box');
    if (checkBox) {
      checkBox.innerHTML = isVoted ? '✔' : '';
    }

    if (isVoted && typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#f59e0b', '#ffffff', '#e11d48']
      });
    }
  }

  if (ballotCard) {
    ballotCard.addEventListener('click', triggerVoteAction);
  }

  voteBtnTrigger.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('programme-election');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (ballotCard && !ballotCard.classList.contains('voted')) {
            triggerVoteAction();
          }
        }, 800);
      }
    });
  });

  // --- 5. Gallery Filtering & Lightbox ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filterValue = this.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const img = this.querySelector('img');
      const caption = this.querySelector('.gallery-caption');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightboxModal.classList.add('active');
      }
    });
  });

  // Poster card zoom in lightbox
  const posterCard = document.getElementById('poster-card-zoom');
  if (posterCard && lightboxModal) {
    posterCard.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = "Affiche Officielle Campagne APW Tizi Ouzou 2026 - Liste 201 N° 7 (Liza SAÏDJ)";
        lightboxModal.classList.add('active');
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', function () {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });

  // --- 6. Testimonial Submission Form (with localStorage & WhatsApp forwarding) ---
  const testimonialForm = document.getElementById('testimonial-form');
  const testimonialsContainer = document.getElementById('testimonials-container');
  const btnSendWhatsAppDirect = document.getElementById('btn-send-whatsapp-direct');

  // WhatsApp Destination (Protected, not displayed in plain text)
  const WA_DEST = '213540663340';

  // Load custom testimonials from localStorage
  const savedTestimonials = JSON.parse(localStorage.getItem('liza_saidj_testimonials') || '[]');
  savedTestimonials.forEach(t => renderTestimonial(t, false));

  function sendToWhatsApp(name, origin, message) {
    const textMsg = `Salam Liza SAÏDJ, je m'appelle ${name || 'un citoyen'}${origin ? ' (' + origin + ')' : ''}.\n\nJe vous adresse ce message de soutien pour votre campagne électorale (Liste 201 N° 7) :\n\n« ${message} »`;
    const waUrl = `https://wa.me/${WA_DEST}?text=${encodeURIComponent(textMsg)}`;
    window.open(waUrl, '_blank');
  }

  if (btnSendWhatsAppDirect) {
    btnSendWhatsAppDirect.addEventListener('click', function () {
      const name = document.getElementById('test-name').value.trim();
      const origin = document.getElementById('test-origin').value.trim();
      const message = document.getElementById('test-message').value.trim();

      if (!message) {
        alert("Veuillez d'abord rédiger votre message dans le champ ci-dessus avant de l'envoyer sur WhatsApp.");
        document.getElementById('test-message').focus();
        return;
      }

      sendToWhatsApp(name, origin, message);
    });
  }

  if (testimonialForm) {
    testimonialForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('test-name').value.trim();
      const origin = document.getElementById('test-origin').value.trim();
      const message = document.getElementById('test-message').value.trim();

      if (!name || !message) return;

      const newTestimonial = {
        name: name,
        origin: origin || 'Citoyen engagé',
        message: message,
        initial: name.charAt(0).toUpperCase()
      };

      savedTestimonials.unshift(newTestimonial);
      localStorage.setItem('liza_saidj_testimonials', JSON.stringify(savedTestimonials));

      renderTestimonial(newTestimonial, true);

      // Offer immediate WhatsApp transmission
      const wantWhatsApp = confirm("Votre message a été publié sur le site !\n\nSouhaitez-vous également l'envoyer directement sur le WhatsApp privé de Liza SAÏDJ ?");
      if (wantWhatsApp) {
        sendToWhatsApp(name, origin, message);
      }

      testimonialForm.reset();
    });
  }

  function renderTestimonial(data, prepend = true) {
    if (!testimonialsContainer) return;
    const card = document.createElement('div');
    card.className = 'testimonial-item';
    card.innerHTML = `
      <div class="testimonial-quote">« ${data.message} »</div>
      <div class="testimonial-author">
        <div class="author-avatar">${data.initial || data.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="author-name">${data.name}</div>
          <div class="author-role">${data.origin}</div>
        </div>
      </div>
    `;

    if (prepend) {
      testimonialsContainer.prepend(card);
    } else {
      testimonialsContainer.appendChild(card);
    }
  }

  // --- 7. Social Sharing Handlers ---
  const shareWhatsapp = document.getElementById('share-whatsapp');
  const shareFacebook = document.getElementById('share-facebook');
  const copyLinkBtn = document.getElementById('copy-site-link');

  const shareTitle = "Soutenez Liza SAÏDJ - Élection APW Tizi Ouzou 2026 (Liste 201 N° 7)";
  const shareUrl = window.location.href;

  if (shareWhatsapp) {
    shareWhatsapp.addEventListener('click', function (e) {
      e.preventDefault();
      const text = encodeURIComponent(`${shareTitle}\nDécouvrez son parcours d'engagement, ses actions de terrain et son programme :\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

  if (shareFacebook) {
    shareFacebook.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(shareUrl).then(() => {
        const origText = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '✔ Lien Copié !';
        setTimeout(() => {
          copyLinkBtn.innerHTML = origText;
        }, 2500);
      }).catch(() => {
        alert("Lien du site : " + shareUrl);
      });
    });
  }
});
