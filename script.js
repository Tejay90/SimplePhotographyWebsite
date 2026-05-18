document.addEventListener('DOMContentLoaded', () => {

  /* PAGE NAVIGATION */

  const pages   = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav__link, .mobile-link, [data-page]');

  function showPage(name) {
    pages.forEach(p => {
      p.classList.remove('active');
      p.style.animation = 'none';
    });

    const target = document.getElementById('page-' + name);
    if (!target) return;

    
    requestAnimationFrame(() => {
      target.style.animation = '';
      target.classList.add('active');
    });

    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.toggle('active', link.dataset.page === name);
    });
  
    closeMobileMenu();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#' + name);
  }

 
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (el) {
      e.preventDefault();
      showPage(el.dataset.page);
    }
  });
 
  const initPage = location.hash.replace('#', '') || 'portfolio';
  showPage(initPage);

  window.addEventListener('popstate', () => {
    const page = location.hash.replace('#', '') || 'portfolio';
    showPage(page);
  });


  /* MOBILE BURGER MENU */

  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });


  /* NAV SCROLL TINT */

  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(13, 12, 11, 0.98)'
      : 'rgba(13, 12, 11, 0.9)';
  });


  /* PORTFOLIO LIGHTBOX */

  const lightbox      = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCat   = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      const img      = item.querySelector('.portfolio-img');
      const overlay  = item.querySelector('.portfolio-overlay');
      const src      = img.style.backgroundImage.slice(5, -2); // strip url("")
      const cat      = overlay.querySelector('.portfolio-cat').textContent;
      const title    = overlay.querySelector('h3').textContent;

      lightboxImg.src       = src;
      lightboxCat.textContent   = cat;
      lightboxTitle.textContent = title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* LANDSCAPE FILTER */

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const lsItems     = document.querySelectorAll('.ls-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      lsItems.forEach(item => {
        if (filter === 'all' || item.dataset.tag === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* CONTACT FORM */

  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeForm();
      return;
    }

    if (!isValidEmail(email)) {
      document.getElementById('email').style.borderColor = '#c0392b';
      setTimeout(() => {
        document.getElementById('email').style.borderColor = '';
      }, 2000);
      return;
    }

    
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.add('show');
      btn.textContent = 'Send Message';
      btn.disabled = false;

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1000);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm() {
    contactForm.style.animation = 'none';
    contactForm.style.transform = 'translateX(-8px)';
    setTimeout(() => {
      contactForm.style.transform = 'translateX(8px)';
      setTimeout(() => {
        contactForm.style.transform = '';
      }, 100);
    }, 100);
  }


  /* SCROLL REVEAL */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity  = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  function setupReveal() {
    const revealEls = document.querySelectorAll(
      '.portfolio-item, .ls-item, .contact-detail, .impressum-block'
    );

    revealEls.forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
      revealObserver.observe(el);
    });
  }

  setupReveal();

});
