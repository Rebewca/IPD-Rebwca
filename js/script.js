(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
      el = el.trim();
      if (all) {
          return [...document.querySelectorAll(el)];
      } else {
          return document.querySelector(el);
      }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all);
      if (selectEl) {
          if (all) {
              selectEl.forEach(e => e.addEventListener(type, listener));
          } else {
              selectEl.addEventListener(type, listener);
          }
      }
  };

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
      let position = window.scrollY + 200;
      navbarlinks.forEach(navbarlink => {
          if (!navbarlink.hash) return;
          let section = select(navbarlink.hash);
          if (!section) return;
          if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
              navbarlink.classList.add('active');
          } else {
              navbarlink.classList.remove('active');
          }
      });
  };

  window.addEventListener('load', navbarlinksActive); // Evento de carregamento da página
  onscroll(document, navbarlinksActive); // Atualiza a cada rolagem da página

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
      let elementPos = select(el).offsetTop;
      window.scrollTo({
          top: elementPos,
          behavior: 'smooth'
      });
  };

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
      const toggleBacktotop = () => {
          if (window.scrollY > 100) {
              backtotop.classList.add('active');
          } else {
              backtotop.classList.remove('active');
          }
      };
      window.addEventListener('load', toggleBacktotop);
      onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
      select('body').classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
          e.preventDefault();

          let body = select('body');
          if (body.classList.contains('mobile-nav-active')) {
              body.classList.remove('mobile-nav-active');
              let navbarToggle = select('.mobile-nav-toggle');
              navbarToggle.classList.toggle('bi-list');
              navbarToggle.classList.toggle('bi-x');
          }
          scrollto(this.hash);
      }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the URL
   */
  window.addEventListener('load', () => {
      if (window.location.hash) {
          if (select(window.location.hash)) {
              scrollto(window.location.hash);
          }
      }
  });

  // Função para atualizar o estado ativo do link
  function updateActiveLink() {
      // Obtenha todos os links da navegação
      const links = document.querySelectorAll('.nav-link');

      // Itera sobre todos os links para remover a classe "active"
      links.forEach(link => {
          link.classList.remove('active');
      });

      // Obtenha todas as seções com o atributo 'id' para verificar qual está visível
      const sections = document.querySelectorAll('section'); // Selecione todas as seções, não apenas 'services'

      sections.forEach(section => {
          // Verifique se a seção está visível na janela de visualização
          const rect = section.getBoundingClientRect();
          const sectionId = section.getAttribute('id');

          // Se a seção estiver visível (em algum lugar na tela), ative o link correspondente
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
              // Encontre o link correspondente com base no id da seção
              const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
              if (activeLink) {
                  activeLink.classList.add('active');
              }
          }
      });
  }

  // Adicionar evento de rolagem (scroll) para atualizar a classe "active" dinamicamente
  window.addEventListener('scroll', updateActiveLink);

  // Adicionar evento de carregamento (load) para garantir que a primeira vez a classe "active" seja aplicada
  window.addEventListener('load', updateActiveLink);

  /**
   * Hero type effect
   */
  const typed = select('.typed');
  if (typed) {
      let typed_strings = typed.getAttribute('data-typed-items');
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
          strings: typed_strings,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
      });
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
      new Waypoint({
          element: skilsContent,
          offset: '80%',
          handler: function(direction) {
              let progress = select('.progress .progress-bar', true);
              progress.forEach((el) => {
                  el.style.width = el.getAttribute('aria-valuenow') + '%';
              });
          }
      });
  }

  /**
   * Portfolio isotope and filter
   */
  window.addEventListener('load', () => {
      let portfolioContainer = select('.portfolio-container');
      if (portfolioContainer) {
          let portfolioIsotope = new Isotope(portfolioContainer, {
              itemSelector: '.portfolio-item'
          });

          let portfolioFilters = select('#portfolio-flters li', true);

          on('click', '#portfolio-flters li', function(e) {
              e.preventDefault();
              portfolioFilters.forEach(function(el) {
                  el.classList.remove('filter-active');
              });
              this.classList.add('filter-active');

              portfolioIsotope.arrange({
                  filter: this.getAttribute('data-filter')
              });
              portfolioIsotope.on('arrangeComplete', function() {
                  AOS.refresh();
              });
          }, true);
      }
  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false
      },
      pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
      }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
          delay: 5000,
          disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
      },
      breakpoints: {
          320: {
              slidesPerView: 1,
              spaceBetween: 20
          },

          1200: {
              slidesPerView: 3,
              spaceBetween: 20
          }
      }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
      AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false
      });
  });

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

})();
