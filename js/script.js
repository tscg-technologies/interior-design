/**
 * CIVIL CONTRACTOR - JavaScript Application Script
 * Vanilla JavaScript implementation for interactivity, validation, filtering & UI controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initActiveNav();
  initScrollToTop();
  initFaqAccordions();
  initProjectFiltering();
  initProjectSearch();
  initContactForm();
  initQuoteForm();
  initDynamicProjectDetails();
});

/* ---------------- 1. Mobile Navigation ---------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.main-nav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when clicking nav items on mobile
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 960) {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---------------- 2. Highlight Active Nav Link ---------------- */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === filename || (filename === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* ---------------- 3. Scroll to Top Button ---------------- */
function initScrollToTop() {
  let scrollBtn = document.querySelector('.scroll-to-top-btn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '&#8593;';
    document.body.appendChild(scrollBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ---------------- 4. FAQ Accordion ---------------- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isAlreadyActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---------------- 5. Project Category Filtering ---------------- */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      filterProjectsList(filterValue);
    });
  });
}

function filterProjectsList(filterValue) {
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.querySelector('#projectSearchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let visibleCount = 0;

  projectCards.forEach(card => {
    const category = card.getAttribute('data-category') || '';
    const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();

    const matchesFilter = (filterValue === 'all' || category === filterValue);
    const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

    if (matchesFilter && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResultsMsg = document.getElementById('noProjectsFound');
  if (noResultsMsg) {
    noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

/* ---------------- 6. Project Search ---------------- */
function initProjectSearch() {
  const searchInput = document.getElementById('projectSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const activeBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    filterProjectsList(activeFilter);
  });
}

/* ---------------- 7. Form Helpers & Validations ---------------- */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  // Accepts standard Indian / international demo phone patterns (min 10 digits)
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned.length >= 10;
}

function showFieldState(input, isValid, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;

  const errorEl = formGroup.querySelector('.form-error-msg');

  if (isValid) {
    formGroup.classList.remove('has-error');
    input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  } else {
    formGroup.classList.add('has-error');
    input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }
}

/* ---------------- 8. Contact Form Validation ---------------- */
function initContactForm() {
  const contactForm = document.getElementById('generalContactForm');
  if (!contactForm) return;

  const successAlert = document.getElementById('contactSuccessAlert');
  const errorAlert = document.getElementById('contactErrorAlert');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const phoneInput = document.getElementById('contactPhone');
    const messageInput = document.getElementById('contactMessage');

    // Name
    if (!nameInput.value.trim()) {
      showFieldState(nameInput, false, 'Please enter your full name.');
      isFormValid = false;
    } else {
      showFieldState(nameInput, true);
    }

    // Email
    if (!nameInput || !validateEmail(emailInput.value.trim())) {
      showFieldState(emailInput, false, 'Please enter a valid email address.');
      isFormValid = false;
    } else {
      showFieldState(emailInput, true);
    }

    // Phone
    if (!validatePhone(phoneInput.value.trim())) {
      showFieldState(phoneInput, false, 'Please enter a valid 10-digit mobile number.');
      isFormValid = false;
    } else {
      showFieldState(phoneInput, true);
    }

    // Message
    if (!messageInput.value.trim()) {
      showFieldState(messageInput, false, 'Please write your message or enquiry.');
      isFormValid = false;
    } else {
      showFieldState(messageInput, true);
    }

    if (isFormValid) {
      if (errorAlert) errorAlert.style.display = 'none';
      if (successAlert) {
        successAlert.textContent = 'Your demo message has been received successfully. (Simulated Demo Submission)';
        successAlert.style.display = 'block';
      }
      contactForm.reset();
      setTimeout(() => {
        if (successAlert) successAlert.style.display = 'none';
      }, 7000);
    } else {
      if (errorAlert) {
        errorAlert.textContent = 'Please fill out all required fields with valid information.';
        errorAlert.style.display = 'block';
      }
    }
  });
}

/* ---------------- 9. Request-a-Quote Form Validation ---------------- */
function initQuoteForm() {
  const quoteForm = document.getElementById('requestQuoteForm');
  if (!quoteForm) return;

  const successAlert = document.getElementById('quoteSuccessAlert');
  const errorAlert = document.getElementById('quoteErrorAlert');

  // Pre-fill service interest if URL parameter exists
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const serviceSelect = document.getElementById('quoteProjectType');
  if (serviceParam && serviceSelect) {
    serviceSelect.value = serviceParam;
  }

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    const fields = [
      { id: 'quoteFullName', check: (val) => val.trim().length > 1, msg: 'Please provide your full name.' },
      { id: 'quoteMobile', check: validatePhone, msg: 'Please enter a valid 10-digit mobile number.' },
      { id: 'quoteEmail', check: validateEmail, msg: 'Please enter a valid email address.' },
      { id: 'quoteProjectType', check: (val) => val !== '', msg: 'Please select a project type.' },
      { id: 'quoteLocation', check: (val) => val.trim().length > 2, msg: 'Please specify the project location.' },
      { id: 'quoteArea', check: (val) => val.trim().length > 0, msg: 'Please enter approximate project area.' },
      { id: 'quoteStartDate', check: (val) => val !== '', msg: 'Please choose preferred start date.' },
      { id: 'quoteBudget', check: (val) => val !== '', msg: 'Please select an estimated budget range.' },
      { id: 'quoteDescription', check: (val) => val.trim().length > 10, msg: 'Please provide a brief description (min 10 characters).' }
    ];

    fields.forEach(field => {
      const el = document.getElementById(field.id);
      if (!el) return;
      const isValid = field.check(el.value);
      showFieldState(el, isValid, field.msg);
      if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
      if (errorAlert) errorAlert.style.display = 'none';
      if (successAlert) {
        successAlert.textContent = 'Your demo quotation request has been submitted successfully.';
        successAlert.style.display = 'block';
      }
      quoteForm.reset();
      window.scrollTo({
        top: quoteForm.offsetTop - 100,
        behavior: 'smooth'
      });
      setTimeout(() => {
        if (successAlert) successAlert.style.display = 'none';
      }, 9000);
    } else {
      if (errorAlert) {
        errorAlert.textContent = 'Please correct the highlighted fields before submitting.';
        errorAlert.style.display = 'block';
      }
    }
  });
}

/* ---------------- 10. Dynamic Project Details Handler ---------------- */
// Reusable sample data for project-details.html based on ?id= query param
const demoProjectsData = {
  'independent-house': {
    title: 'Modern Independent House Construction',
    category: 'Residential Projects',
    location: 'Bangalore, Karnataka (Illustrative Demo Location)',
    type: 'G+2 Independent Residential Bungalow',
    area: '3,800 sq.ft.',
    timeline: '12 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-residential-construction',
    placeholderLabel: 'Planned Image: residential-construction.jpg',
    scope: 'Complete architectural execution, RCC structural frame, brick masonry, plastering, premium flooring, plumbing, electrical conduit installation, and perimeter boundary wall construction.',
    works: 'Foundation excavation, isolated footings, M25 grade RCC framing, fly-ash brick infill walls, waterproof terrace screed, vitrified tile flooring, and exterior anti-fungal weather-shield paint.',
    stages: 'Site Survey & Excavation -> Foundation & Footings -> Plinth & Column Framework -> Slab Casting -> Masonry Works -> Finishing & Handover'
  },
  'apartment-complex': {
    title: 'Residential Apartment Development',
    category: 'Residential Projects',
    location: 'Hyderabad, Telangana (Illustrative Demo Location)',
    type: 'Multi-Storey Residential Complex (B+G+9)',
    area: '48,000 sq.ft.',
    timeline: '24 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-civil-contractor-hero',
    placeholderLabel: 'Planned Image: civil-contractor-hero.jpg',
    scope: 'Deep basement excavation, raft foundation, shear wall construction, monolithic concrete slabs, fire safety integration, dual-chute waste disposal shafts, and multi-tier car park layout.',
    works: 'Raft foundation with sheet piling, M30 concrete structural columns, AAC block partitions, internal gypsum plastering, and stormwater harvesting wells.',
    stages: 'Substructure Piling -> Basement Retaining Walls -> Superstructure Floor Slabs -> Block Masonry -> Mechanical & Electrical Piping -> Quality Handover'
  },
  'commercial-office': {
    title: 'Commercial Office Building',
    category: 'Commercial Projects',
    location: 'Chennai, Tamil Nadu (Illustrative Demo Location)',
    type: 'Commercial Business Hub (G+6 Floor Layout)',
    area: '32,500 sq.ft.',
    timeline: '18 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-commercial-construction',
    placeholderLabel: 'Planned Image: commercial-construction.jpg',
    scope: 'Civil structural framing, post-tensioned beam grid, commercial facade civil anchors, central utility shafts, passenger elevator shear core, and heavy-duty basement MEP chambers.',
    works: 'Pile foundations, post-tensioned flat slabs, acoustic party walls, raised access flooring civil conduits, exterior structural glazing anchors, and transformer yard pad casting.',
    stages: 'Foundation Piling -> Core Shear Wall -> Post-Tensioned Slabs -> Facade Mounts -> MEP Civil Provisions -> Client Handover'
  },
  'rcc-structural': {
    title: 'RCC Structural Construction',
    category: 'Structural Works',
    location: 'Pune, Maharashtra (Illustrative Demo Location)',
    type: 'Heavy Industrial Framing & Machine Foundations',
    area: '22,000 sq.ft.',
    timeline: '9 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-structural-work',
    placeholderLabel: 'Planned Image: structural-work.jpg',
    scope: 'Specialized reinforced concrete civil engineering, vibration-dampened machinery foundations, industrial column grids with overhead gantry crane brackets, and high-load floor slabs.',
    works: 'M35 design mix concrete, Fe550D TMT reinforcement, anti-corrosive epoxy rebar coatings, vacuum dewatered flooring (VDF), and vibration isolation pads.',
    stages: 'Soil Compaction -> Heavy Footing Rebar -> High-Strength Column Pours -> Gantry Tie Beams -> Heavy Duty VDF Floor Casting'
  },
  'road-development': {
    title: 'Road & Pathway Infrastructure Development',
    category: 'Road & Infrastructure',
    location: 'Coimbatore, Tamil Nadu (Illustrative Demo Location)',
    type: 'Industrial Park Internal Roads & Drainage Corridors',
    area: '4.5 km Corridor (Demo)',
    timeline: '8 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-road-construction',
    placeholderLabel: 'Planned Image: road-construction.jpg',
    scope: 'Sub-grade earthwork stabilization, Granular Sub-Base (GSB), Wet Mix Macadam (WMM), Bituminous Concrete laying, pedestrian paver pathways, and precast concrete roadside stormwater drains.',
    works: 'Heavy soil compaction, geosynthetic sub-base reinforcement, kerbstone casting, asphalt laying, and reinforced drainage culverts.',
    stages: 'Earth Cutting & Levelling -> Sub-base Compaction -> WMM Spreading -> Bituminous Layering -> Drain Precast Laying -> Road Markings'
  },
  'villa-construction': {
    title: 'Premium Villa Construction',
    category: 'Residential Projects',
    location: 'Goa (Illustrative Demo Location)',
    type: 'Luxury G+1 Coastal Villa',
    area: '4,200 sq.ft.',
    timeline: '14 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-completed-building',
    placeholderLabel: 'Planned Image: completed-building.jpg',
    scope: 'Coastal saline-resistant civil engineering, expansive cantilever balconies, infinity pool civil excavation and waterproofing, exposed concrete architectural elements, and perimeter landscaping retaining walls.',
    works: 'Saline-resistant sulphate-resisting cement, waterproofing membranes, expansive glass facade lintels, and natural laterite stone cladding backing.',
    stages: 'Site Excavation -> Saline-Protected Footings -> Concrete Framing -> Waterproofing Systems -> Finishing Works'
  },
  'building-renovation': {
    title: 'Commercial Building Structural Renovation',
    category: 'Renovation Projects',
    location: 'Kochi, Kerala (Illustrative Demo Location)',
    type: 'Structural Retrofit & Modernization',
    area: '15,000 sq.ft.',
    timeline: '6 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-renovation-work',
    placeholderLabel: 'Planned Image: renovation-work.jpg',
    scope: 'Structural column jacketing, micro-concreting of weakened beams, carbon fiber wrapping for seismic compliance, floor layout reconfiguration, and facade modernization.',
    works: 'Non-destructive rebound hammer tests, polymer-modified mortar repair, structural steel beam underpinning, and re-plastering.',
    stages: 'Structural Audit -> Shoring & Propping -> Rebar Jacketing -> Micro-Concrete Pouring -> Interior Modernization'
  },
  'industrial-facility': {
    title: 'Industrial Warehouse & Logistics Facility',
    category: 'Commercial Projects',
    location: 'Ahmedabad, Gujarat (Illustrative Demo Location)',
    type: 'Civil Works for Pre-Engineered Building (PEB)',
    area: '55,000 sq.ft.',
    timeline: '10 Months (Demo)',
    status: 'Illustrative Portfolio Example',
    placeholderClass: 'placeholder-engineering-blueprints',
    placeholderLabel: 'Planned Image: engineering-blueprints.jpg',
    scope: 'Mass civil earthwork, anchor bolt cast-in foundations for steel PEB superstructure, laser-screeded heavy duty floor slabs, loading dock ramps, and perimeter compound wall.',
    works: 'Raft footings with heavy anchor cages, sub-base gravel packing, double-mesh reinforced concrete slabs with densifier, and underground fire sump reservoir.',
    stages: 'Bulk Earthworks -> Anchor Bolt Pedestals -> Steel Erection Civil Support -> Laser Flooring -> Infrastructure Paving'
  }
};

function initDynamicProjectDetails() {
  const detailContainer = document.getElementById('projectDetailsContainer');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'independent-house';
  const data = demoProjectsData[projectId] || demoProjectsData['independent-house'];

  // Update dynamic elements
  document.title = `${data.title} | CIVIL CONTRACTOR`;

  const titleEl = document.getElementById('projectDetailTitle');
  if (titleEl) titleEl.textContent = data.title;

  const bannerTitle = document.getElementById('projectBannerTitle');
  if (bannerTitle) bannerTitle.textContent = data.title;

  const catBadge = document.getElementById('projectDetailCategory');
  if (catBadge) catBadge.textContent = data.category;

  const locEl = document.getElementById('projectDetailLocation');
  if (locEl) locEl.textContent = data.location;

  const typeEl = document.getElementById('projectDetailType');
  if (typeEl) typeEl.textContent = data.type;

  const areaEl = document.getElementById('projectDetailArea');
  if (areaEl) areaEl.textContent = data.area;

  const timeEl = document.getElementById('projectDetailTimeline');
  if (timeEl) timeEl.textContent = data.timeline;

  const statusEl = document.getElementById('projectDetailStatus');
  if (statusEl) statusEl.textContent = data.status;

  const scopeEl = document.getElementById('projectDetailScope');
  if (scopeEl) scopeEl.textContent = data.scope;

  const worksEl = document.getElementById('projectDetailWorks');
  if (worksEl) worksEl.textContent = data.works;

  const stagesEl = document.getElementById('projectDetailStages');
  if (stagesEl) stagesEl.textContent = data.stages;

  const placeholderEl = document.getElementById('projectDetailPlaceholder');
  if (placeholderEl) {
    // Reset classes
    placeholderEl.className = `img-placeholder-slot ${data.placeholderClass}`;
    placeholderEl.style.minHeight = '420px';
    const title = placeholderEl.querySelector('.placeholder-title');
    if (title) title.textContent = data.title;
    const spec = placeholderEl.querySelector('.placeholder-spec');
    if (spec) spec.textContent = data.placeholderLabel;
  }
}
