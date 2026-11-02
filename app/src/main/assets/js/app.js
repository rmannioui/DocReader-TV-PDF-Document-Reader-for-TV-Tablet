/**
 * PDF & DOCUMENT READER FOR TV & TABLET
 * Moteur de lecture PDF hybride optimisé pour télécommande Android TV et écran tactile
 */

(function () {
  'use strict';

  // Configuration PDF.js Worker
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf.worker.min.js';
  }

  // Clés LocalStorage
  const STORAGE_RECENTS = 'docreader_recents_v1';
  const STORAGE_SETTINGS = 'docreader_settings_v1';

  // État global de l'application
  const state = {
    pdfDoc: null,
    currentDocName: '',
    currentDocData: null,
    pageNum: 1,
    pageCount: 0,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.0,
    rotation: 0,
    fitMode: 'width', // 'width', 'page', 'custom'
    currentFilter: 'normal', // 'normal', 'night', 'sepia', 'highcontrast'
    showThumbnails: false,
    isFullscreen: false,
    isToolbarVisible: true,
    recentDocs: [],
    settings: {
      defaultZoom: 1.0,
      filter: 'normal',
      fitMode: 'width',
      lang: (navigator.language && navigator.language.startsWith('en')) ? 'en' : 'fr'
    }
  };

  // Éléments DOM
  const dom = {
    app: document.getElementById('app'),
    topHeader: document.getElementById('top-header'),
    btnLang: document.getElementById('btn-lang'),
    langLabel: document.getElementById('lang-label'),
    homeView: document.getElementById('home-view'),
    readerView: document.getElementById('reader-view'),
    fileInput: document.getElementById('file-input'),
    pdfCanvas: document.getElementById('pdf-canvas'),
    canvasContainer: document.getElementById('canvas-container'),
    pdfViewport: document.getElementById('pdf-viewport'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text'),
    readerOsd: document.getElementById('reader-osd'),
    osdText: document.getElementById('osd-text'),
    toastContainer: document.getElementById('toast-container'),
    helpModal: document.getElementById('help-modal'),
    
    // Boutons & Contrôles
    btnOpen: document.getElementById('btn-open'),
    btnHeroOpen: document.getElementById('btn-hero-open'),
    btnDropzone: document.getElementById('drop-zone'),
    btnLibrary: document.getElementById('btn-library'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnFloatingPrev: document.getElementById('btn-float-prev'),
    btnFloatingNext: document.getElementById('btn-float-next'),
    pageCurrentInput: document.getElementById('page-current-input'),
    pageTotalLabel: document.getElementById('page-total-label'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnZoomFit: document.getElementById('btn-zoom-fit'),
    btnRotate: document.getElementById('btn-rotate'),
    btnFilter: document.getElementById('btn-filter'),
    btnThumbnails: document.getElementById('btn-thumbnails'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    btnHelp: document.getElementById('btn-help'),
    btnCloseHelp: document.getElementById('btn-close-help'),
    btnFloatingHelp: document.getElementById('btn-float-help'),
    
    // Conteneurs
    recentList: document.getElementById('recent-list'),
    thumbnailsSidebar: document.getElementById('thumbnails-sidebar'),
    thumbnailsList: document.getElementById('thumbnails-list')
  };

  let ctx = dom.pdfCanvas ? dom.pdfCanvas.getContext('2d') : null;
  let osdTimer = null;

  // =========================================================================
  // INITIALISATION
  // =========================================================================
  function init() {
    loadSettings();
    loadRecents();
    renderRecentsGrid();
    setupEventListeners();
    setupKeyboardAndRemote();
    initServiceWorker();

    // Auto-focus pour télécommande Android TV
    setTimeout(() => {
      if (dom.btnHeroOpen) {
        dom.btnHeroOpen.focus();
      }
    }, 200);
  }

  // =========================================================================
  // INTERNATIONALISATION (i18n) - FRANÇAIS & ANGLAIS
  // =========================================================================
  const I18N = {
    fr: {
      langCode: "FR",
      nextLang: "EN",
      switchTooltip: "Switch to English",
      btnPrev: "Préc.",
      btnNext: "Suiv.",
      btnFit: "Ajuster",
      btnLibrary: "Bibliothèque",
      btnOpen: "Ouvrir PDF",
      heroTag: "Android TV & Tablet Edition",
      heroTitle: "PDF & Document Reader for TV & Tablet",
      heroSubtitle: "Lisez vos manuels, revues et documents PDF en grand écran. Navigation fluide 100% adaptée aux télécommandes TV, zoom haute fidélité et confort visuel nocturne.",
      btnHeroOpen: "Sélectionner un document PDF",
      btnHeroHelp: "Guide Télécommande TV",
      tvBadgeTitle: "Navigation D-Pad",
      tvBadgeDesc: "Touches Flèches & Bouton OK",
      dropzoneTitle: "Ouvrir un document depuis la mémoire locale ou USB",
      dropzoneDesc: "Cliquez ou appuyez sur OK pour parcourir le stockage de votre appareil (Android TV, TV Box, Tablette ou Clé USB).",
      sectionRecentsTitle: "Documents Récents & Guides",
      noRecentTitle: "Aucun document récent",
      noRecentDesc: "Ouvrez un document PDF ou lisez l'un des guides intégrés ci-dessus.",
      tagBuiltin: "GUIDE INTÉGRÉ",
      tagLocal: "PDF LOCAL",
      progress: "Progression",
      thumbnailsTitle: "Miniatures",
      floatPrev: "◄ Préc",
      floatNext: "Suiv ►",
      modalHelpTitle: "Commandes Télécommande Android TV & Clavier",
      modalCloseBtn: "Compris",
      toastSwitched: "Langue changée : Français 🇫🇷",
      toastRemoved: "Document retiré des récents",
      toastFitWidth: "Ajusté à la largeur",
      toastFitPage: "Ajusté à la page entière",
      filterNames: {
        normal: "Couleurs standard",
        night: "Mode Nuit (Inversé Sombre)",
        sepia: "Mode Sépia (Repos visuel)",
        highcontrast: "Contraste renforcé"
      }
    },
    en: {
      langCode: "EN",
      nextLang: "FR",
      switchTooltip: "Passer en Français",
      btnPrev: "Prev",
      btnNext: "Next",
      btnFit: "Fit",
      btnLibrary: "Library",
      btnOpen: "Open PDF",
      heroTag: "Android TV & Tablet Edition",
      heroTitle: "PDF & Document Reader for TV & Tablet",
      heroSubtitle: "Read your manuals, guides, books, and PDF documents on the big screen. Smooth 100% remote D-pad navigation, high-definition zoom, and dark mode eye comfort.",
      btnHeroOpen: "Select a PDF Document",
      btnHeroHelp: "TV Remote Guide",
      tvBadgeTitle: "D-Pad Navigation",
      tvBadgeDesc: "Arrow Keys & OK Button",
      dropzoneTitle: "Open a document from local storage or USB drive",
      dropzoneDesc: "Click or press OK to browse your device storage (Android TV, TV Box, Tablet, or USB flash drive).",
      sectionRecentsTitle: "Recent Documents & Guides",
      noRecentTitle: "No recent documents",
      noRecentDesc: "Open a PDF document or read one of the built-in guides above.",
      tagBuiltin: "BUILT-IN GUIDE",
      tagLocal: "LOCAL PDF",
      progress: "Progress",
      thumbnailsTitle: "Thumbnails",
      floatPrev: "◄ Prev",
      floatNext: "Next ►",
      modalHelpTitle: "Android TV Remote & Keyboard Controls",
      modalCloseBtn: "Got it",
      toastSwitched: "Language switched to: English 🇺🇸",
      toastRemoved: "Document removed from recents",
      toastFitWidth: "Fit to screen width",
      toastFitPage: "Fit to whole page",
      filterNames: {
        normal: "Standard Colors",
        night: "Night Mode (Dark Inverted)",
        sepia: "Sepia Mode (Eye Comfort)",
        highcontrast: "High Contrast"
      }
    }
  };

  function t(key) {
    const lang = state.settings.lang || 'fr';
    return (I18N[lang] && I18N[lang][key]) || (I18N['fr'][key] || key);
  }

  function applyLanguage(lang, showNotification = false) {
    state.settings.lang = lang;
    const dict = I18N[lang] || I18N['fr'];
    document.documentElement.lang = lang;

    if (dom.langLabel) {
      dom.langLabel.textContent = dict.nextLang;
    }
    if (dom.btnLang) {
      dom.btnLang.title = dict.switchTooltip;
    }

    const prevSpan = dom.btnPrev ? dom.btnPrev.querySelector('span') : null;
    if (prevSpan) prevSpan.textContent = dict.btnPrev;

    const nextSpan = dom.btnNext ? dom.btnNext.querySelector('span') : null;
    if (nextSpan) nextSpan.textContent = dict.btnNext;

    const fitSpan = dom.btnZoomFit ? dom.btnZoomFit.querySelector('span') : null;
    if (fitSpan) fitSpan.textContent = dict.btnFit;

    const libSpan = dom.btnLibrary ? dom.btnLibrary.querySelector('span') : null;
    if (libSpan) libSpan.textContent = dict.btnLibrary;

    const openSpan = dom.btnOpen ? dom.btnOpen.querySelector('span') : null;
    if (openSpan) openSpan.textContent = dict.btnOpen;

    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) heroTag.textContent = dict.heroTag;

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = dict.heroTitle;

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = dict.heroSubtitle;

    const heroOpenSpan = dom.btnHeroOpen ? dom.btnHeroOpen.querySelector('span') : null;
    if (heroOpenSpan) heroOpenSpan.textContent = dict.btnHeroOpen;

    const heroHelpSpan = dom.btnFloatingHelp ? dom.btnFloatingHelp.querySelector('span') : null;
    if (heroHelpSpan) heroHelpSpan.textContent = dict.btnHeroHelp;

    const tvBadgeStrong = document.querySelector('.tv-badge-text strong');
    if (tvBadgeStrong) tvBadgeStrong.textContent = dict.tvBadgeTitle;

    const tvBadgeSpan = document.querySelector('.tv-badge-text span');
    if (tvBadgeSpan) tvBadgeSpan.textContent = dict.tvBadgeDesc;

    const dropTitle = document.querySelector('.drop-zone-title');
    if (dropTitle) dropTitle.textContent = dict.dropzoneTitle;

    const dropDesc = document.querySelector('.drop-zone-desc');
    if (dropDesc) dropDesc.textContent = dict.dropzoneDesc;

    const secTitle = document.querySelector('#section-recents-title span');
    if (secTitle) secTitle.textContent = dict.sectionRecentsTitle;

    const sideHeader = document.querySelector('.sidebar-header span');
    if (sideHeader) sideHeader.textContent = dict.thumbnailsTitle;

    const floatPrevSpan = dom.btnFloatingPrev ? dom.btnFloatingPrev.querySelector('span') : null;
    if (floatPrevSpan) floatPrevSpan.textContent = dict.floatPrev;

    const floatNextSpan = dom.btnFloatingNext ? dom.btnFloatingNext.querySelector('span') : null;
    if (floatNextSpan) floatNextSpan.textContent = dict.floatNext;

    const modalTitle = document.getElementById('modal-help-title');
    if (modalTitle) modalTitle.textContent = dict.modalHelpTitle;

    const modalBtn = document.querySelector('.modal-footer .btn');
    if (modalBtn) modalBtn.textContent = dict.modalCloseBtn;

    renderRecentsGrid();

    if (showNotification) {
      showToast(dict.toastSwitched);
    }
  }

  function toggleLanguage() {
    const current = state.settings.lang || 'fr';
    const next = current === 'fr' ? 'en' : 'fr';
    applyLanguage(next, true);
    saveSettings();
  }

  // =========================================================================
  // GESTION DU STOCKAGE LOCAL (LocalStorage)
  // =========================================================================
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS);
      if (saved) {
        state.settings = Object.assign(state.settings, JSON.parse(saved));
        state.currentFilter = state.settings.filter || 'normal';
        state.fitMode = state.settings.fitMode || 'width';
        applyColorFilter(state.currentFilter);
      }
      applyLanguage(state.settings.lang || 'fr', false);
    } catch (e) {
      console.warn('Erreur lecture LocalStorage:', e);
    }
  }

  function saveSettings() {
    try {
      state.settings.filter = state.currentFilter;
      state.settings.fitMode = state.fitMode;
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(state.settings));
    } catch (e) {
      console.warn('Erreur sauvegarde LocalStorage:', e);
    }
  }

  function loadRecents() {
    try {
      const saved = localStorage.getItem(STORAGE_RECENTS);
      if (saved) {
        state.recentDocs = JSON.parse(saved);
      } else {
        // Pré-charger des documents guides d'exemple
        state.recentDocs = [
          {
            id: 'guide-tv-tablet',
            title: 'DocReader TV - Guide Officiel',
            path: 'assets/guide-tv-tablet.pdf',
            isSample: true,
            lastPage: 1,
            totalPages: 3,
            date: new Date().toLocaleDateString()
          },
          {
            id: 'manuel-raccourcis',
            title: 'Raccourcis & Astuces Télécommande TV',
            path: 'assets/manuel-raccourcis.pdf',
            isSample: true,
            lastPage: 1,
            totalPages: 2,
            date: new Date().toLocaleDateString()
          }
        ];
        saveRecents();
      }
    } catch (e) {
      console.warn('Erreur chargement récents:', e);
    }
  }

  function saveRecents() {
    try {
      localStorage.setItem(STORAGE_RECENTS, JSON.stringify(state.recentDocs));
    } catch (e) {
      console.warn('Erreur sauvegarde récents:', e);
    }
  }

  function addOrUpdateRecent(docMeta) {
    const existingIndex = state.recentDocs.findIndex(d => d.id === docMeta.id || d.title === docMeta.title);
    if (existingIndex >= 0) {
      state.recentDocs[existingIndex] = Object.assign(state.recentDocs[existingIndex], docMeta);
    } else {
      state.recentDocs.unshift(docMeta);
    }
    // Conserver les 12 documents les plus récents
    if (state.recentDocs.length > 12) {
      state.recentDocs.pop();
    }
    saveRecents();
    renderRecentsGrid();
  }

  function removeRecent(id, event) {
    if (event) event.stopPropagation();
    state.recentDocs = state.recentDocs.filter(d => d.id !== id);
    saveRecents();
    renderRecentsGrid();
    showToast('Document retiré des récents');
  }

  // =========================================================================
  // AFFICHAGE DE LA GRILLE DES DOCUMENTS RÉCENTS
  // =========================================================================
  function renderRecentsGrid() {
    if (!dom.recentList) return;
    dom.recentList.innerHTML = '';

    if (state.recentDocs.length === 0) {
      dom.recentList.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p style="font-size: 1.1rem; margin-bottom: 8px;">${t('noRecentTitle')}</p>
          <p style="font-size: 0.9rem;">${t('noRecentDesc')}</p>
        </div>
      `;
      return;
    }

    state.recentDocs.forEach((doc, idx) => {
      const card = document.createElement('div');
      card.className = 'doc-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Ouvrir ${doc.title}`);
      
      const percent = doc.totalPages > 0 ? Math.round((doc.lastPage / doc.totalPages) * 100) : 0;
      const isGuide = doc.isSample;

      card.innerHTML = `
        <div class="doc-card-top">
          <div class="doc-icon-wrapper ${isGuide ? 'guide-icon' : ''}">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <div class="doc-meta">
            <h4 class="doc-title" title="${doc.title}">${doc.title}</h4>
            <div class="doc-info">
              <span>${doc.date || (state.settings.lang === 'en' ? 'Recently' : 'Récemment')}</span>
              <span>•</span>
              <span>Page ${doc.lastPage || 1} / ${doc.totalPages || '?'}</span>
            </div>
          </div>
        </div>
        <div class="doc-progress-container">
          <div class="doc-progress-bar">
            <div class="doc-progress-fill" style="width: ${percent}%;"></div>
          </div>
          <div class="doc-progress-text">
            <span>${t('progress')}</span>
            <span>${percent}%</span>
          </div>
        </div>
        <div class="doc-card-bottom">
          <span class="doc-tag">${isGuide ? t('tagBuiltin') : t('tagLocal')}</span>
          <button class="doc-delete-btn" title="Supprimer de l'historique" aria-label="Supprimer">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;

      // Clic pour ouvrir
      card.addEventListener('click', () => {
        openDocumentItem(doc);
      });

      // Touche Entrée pour télécommande TV
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          openDocumentItem(doc);
        }
      });

      // Bouton supprimer
      const delBtn = card.querySelector('.doc-delete-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          removeRecent(doc.id, e);
        });
      }

      dom.recentList.appendChild(card);
    });
  }

  function openDocumentItem(doc) {
    if (doc.isSample && doc.path) {
      loadPdfFromUrl(doc.path, doc.title, doc.lastPage || 1);
    } else if (doc.dataUrl) {
      loadPdfFromDataUrl(doc.dataUrl, doc.title, doc.lastPage || 1);
    } else {
      showToast('Veuillez sélectionner le fichier local sur votre appareil');
      triggerFileInput();
    }
  }

  // =========================================================================
  // CHARGEMENT DE DOCUMENTS PDF (PDF.js)
  // =========================================================================
  function showLoading(msg) {
    if (dom.loadingOverlay) {
      dom.loadingText.textContent = msg || 'Chargement du document...';
      dom.loadingOverlay.classList.remove('view-hidden');
    }
  }

  function hideLoading() {
    if (dom.loadingOverlay) {
      dom.loadingOverlay.classList.add('view-hidden');
    }
  }

  function loadPdfFromUrl(url, title, targetPage = 1) {
    showLoading(`Ouverture de ${title}...`);
    state.currentDocName = title;

    if (typeof pdfjsLib === 'undefined') {
      hideLoading();
      showToast('Erreur: Bibliothèque PDF.js introuvable');
      return;
    }

    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
      onPdfLoaded(pdf, title, targetPage, { path: url, isSample: true });
    }).catch((err) => {
      hideLoading();
      console.error('Erreur chargement PDF:', err);
      showToast(`Impossible de charger le document: ${err.message || 'Fichier inaccessible'}`);
    });
  }

  function loadPdfFromDataUrl(dataUrl, title, targetPage = 1) {
    showLoading(`Ouverture de ${title}...`);
    state.currentDocName = title;

    const loadingTask = pdfjsLib.getDocument({ data: atob(dataUrl.split(',')[1] || dataUrl) });
    loadingTask.promise.then((pdf) => {
      onPdfLoaded(pdf, title, targetPage, { dataUrl: dataUrl });
    }).catch((err) => {
      hideLoading();
      console.error('Erreur dataUrl PDF:', err);
      showToast('Impossible d’ouvrir ce fichier');
    });
  }

  function loadPdfFromArrayBuffer(buffer, title, targetPage = 1) {
    showLoading(`Chargement de ${title}...`);
    state.currentDocName = title;

    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    loadingTask.promise.then((pdf) => {
      onPdfLoaded(pdf, title, targetPage, {});
    }).catch((err) => {
      hideLoading();
      console.error('Erreur ArrayBuffer PDF:', err);
      showToast('Erreur: Format de fichier PDF invalide');
    });
  }

  function onPdfLoaded(pdf, title, targetPage, extraMeta = {}) {
    state.pdfDoc = pdf;
    state.pageCount = pdf.numPages;
    state.pageNum = Math.min(Math.max(1, targetPage), pdf.numPages);
    
    if (dom.pageTotalLabel) {
      dom.pageTotalLabel.textContent = `/ ${state.pageCount}`;
    }

    // Basculer vers la vue lecteur
    switchView('reader');
    renderPage(state.pageNum);
    generateThumbnails();

    // Mettre à jour l'historique
    const docId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    addOrUpdateRecent(Object.assign({
      id: docId,
      title: title,
      lastPage: state.pageNum,
      totalPages: state.pageCount,
      date: new Date().toLocaleDateString()
    }, extraMeta));

    hideLoading();
    showToast(`${title} (${state.pageCount} pages)`);
    showOsd();
  }

  // =========================================================================
  // RENDU DE PAGE (Canvas haute résolution & adaptative)
  // =========================================================================
  function renderPage(num) {
    if (!state.pdfDoc) return;
    state.pageRendering = true;

    state.pdfDoc.getPage(num).then((page) => {
      // Calcul du viewport à échelle 1.0 initiale
      let unscaledViewport = page.getViewport({ scale: 1.0, rotation: state.rotation });
      
      // Adaptation selon le mode d'ajustement
      let computedScale = state.scale;
      const viewportContainerWidth = (dom.pdfViewport ? dom.pdfViewport.clientWidth : window.innerWidth) - 48;
      const viewportContainerHeight = (dom.pdfViewport ? dom.pdfViewport.clientHeight : window.innerHeight) - 48;

      if (state.fitMode === 'width' && viewportContainerWidth > 0) {
        computedScale = (viewportContainerWidth / unscaledViewport.width) * state.scale;
      } else if (state.fitMode === 'page' && viewportContainerHeight > 0) {
        const scaleW = viewportContainerWidth / unscaledViewport.width;
        const scaleH = viewportContainerHeight / unscaledViewport.height;
        computedScale = Math.min(scaleW, scaleH) * state.scale;
      }

      // Clamping du zoom
      computedScale = Math.min(Math.max(0.4, computedScale), 4.0);

      // Support écran Retina & TV 4K ultra-haute résolution
      const pixelRatio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: computedScale, rotation: state.rotation });

      dom.pdfCanvas.height = viewport.height * pixelRatio;
      dom.pdfCanvas.width = viewport.width * pixelRatio;
      dom.pdfCanvas.style.width = `${viewport.width}px`;
      dom.pdfCanvas.style.height = `${viewport.height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      const renderTask = page.render(renderContext);

      renderTask.promise.then(() => {
        state.pageRendering = false;
        if (state.pageNumPending !== null) {
          renderPage(state.pageNumPending);
          state.pageNumPending = null;
        }

        // Mettre à jour l'entrée de page
        if (dom.pageCurrentInput) {
          dom.pageCurrentInput.value = state.pageNum;
        }

        // Mettre à jour les miniatures actives
        updateActiveThumbnail(state.pageNum);

        // Mettre à jour la progression dans les récents
        const docId = state.currentDocName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        addOrUpdateRecent({
          id: docId,
          title: state.currentDocName,
          lastPage: state.pageNum,
          totalPages: state.pageCount,
          date: new Date().toLocaleDateString()
        });

        showOsd();
      });
    });
  }

  function queueRenderPage(num) {
    if (state.pageRendering) {
      state.pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function prevPage() {
    if (state.pageNum <= 1) return;
    state.pageNum--;
    queueRenderPage(state.pageNum);
  }

  function nextPage() {
    if (!state.pdfDoc || state.pageNum >= state.pageCount) return;
    state.pageNum++;
    queueRenderPage(state.pageNum);
  }

  function jumpToPage(num) {
    if (!state.pdfDoc) return;
    const n = parseInt(num, 10);
    if (!isNaN(n) && n >= 1 && n <= state.pageCount) {
      state.pageNum = n;
      queueRenderPage(state.pageNum);
    } else if (dom.pageCurrentInput) {
      dom.pageCurrentInput.value = state.pageNum;
    }
  }

  // =========================================================================
  // GESTION DU ZOOM, ROTATION & FILTRES
  // =========================================================================
  function zoomIn() {
    state.scale = Math.min(state.scale + 0.25, 3.5);
    state.fitMode = 'custom';
    queueRenderPage(state.pageNum);
    showToast(`Zoom: ${Math.round(state.scale * 100)}%`);
  }

  function zoomOut() {
    state.scale = Math.max(state.scale - 0.25, 0.5);
    state.fitMode = 'custom';
    queueRenderPage(state.pageNum);
    showToast(`Zoom: ${Math.round(state.scale * 100)}%`);
  }

  function toggleFitMode() {
    if (state.fitMode === 'width') {
      state.fitMode = 'page';
      state.scale = 1.0;
      showToast('Ajusté à la page entière');
    } else {
      state.fitMode = 'width';
      state.scale = 1.0;
      showToast('Ajusté à la largeur');
    }
    saveSettings();
    queueRenderPage(state.pageNum);
  }

  function rotateClockwise() {
    state.rotation = (state.rotation + 90) % 360;
    queueRenderPage(state.pageNum);
    showToast(`Rotation: ${state.rotation}°`);
  }

  function cycleColorFilter() {
    const filters = ['normal', 'night', 'sepia', 'highcontrast'];
    const names = {
      normal: 'Couleurs standard',
      night: 'Mode Nuit (Inversé Sombre)',
      sepia: 'Mode Sépia (Repos visuel)',
      highcontrast: 'Contraste renforcé'
    };
    const nextIdx = (filters.indexOf(state.currentFilter) + 1) % filters.length;
    state.currentFilter = filters[nextIdx];
    applyColorFilter(state.currentFilter);
    saveSettings();
    showToast(names[state.currentFilter]);
  }

  function applyColorFilter(filterName) {
    if (!dom.canvasContainer) return;
    dom.canvasContainer.className = 'pdf-canvas-container filter-' + filterName;
  }

  // =========================================================================
  // MINIATURES (Thumbnails Sidebar)
  // =========================================================================
  function toggleThumbnails() {
    state.showThumbnails = !state.showThumbnails;
    if (dom.thumbnailsSidebar) {
      if (state.showThumbnails) {
        dom.thumbnailsSidebar.classList.remove('collapsed');
      } else {
        dom.thumbnailsSidebar.classList.add('collapsed');
      }
    }
    if (dom.btnThumbnails) {
      dom.btnThumbnails.classList.toggle('btn-active', state.showThumbnails);
    }
    // Re-rendre la page pour ajuster l'espace disponible
    setTimeout(() => {
      queueRenderPage(state.pageNum);
    }, 300);
  }

  function generateThumbnails() {
    if (!dom.thumbnailsList || !state.pdfDoc) return;
    dom.thumbnailsList.innerHTML = '';

    const maxThumbs = Math.min(state.pageCount, 60); // Limiter à 60 miniatures pour performance TV

    for (let i = 1; i <= maxThumbs; i++) {
      const pageIndex = i;
      const thumbWrapper = document.createElement('div');
      thumbWrapper.className = `thumb-item ${pageIndex === state.pageNum ? 'active' : ''}`;
      thumbWrapper.setAttribute('tabindex', '0');
      thumbWrapper.setAttribute('data-page', pageIndex);
      thumbWrapper.innerHTML = `
        <canvas id="thumb-${pageIndex}"></canvas>
        <div class="thumb-label">Page ${pageIndex}</div>
      `;

      thumbWrapper.addEventListener('click', () => {
        state.pageNum = pageIndex;
        queueRenderPage(state.pageNum);
      });

      thumbWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          state.pageNum = pageIndex;
          queueRenderPage(state.pageNum);
        }
      });

      dom.thumbnailsList.appendChild(thumbWrapper);

      // Génération différée de la miniature
      state.pdfDoc.getPage(pageIndex).then((p) => {
        const tCanvas = document.getElementById(`thumb-${pageIndex}`);
        if (!tCanvas) return;
        const tCtx = tCanvas.getContext('2d');
        const tViewport = p.getViewport({ scale: 0.22, rotation: state.rotation });
        tCanvas.width = tViewport.width;
        tCanvas.height = tViewport.height;
        p.render({ canvasContext: tCtx, viewport: tViewport });
      });
    }
  }

  function updateActiveThumbnail(activeNum) {
    if (!dom.thumbnailsList) return;
    const items = dom.thumbnailsList.querySelectorAll('.thumb-item');
    items.forEach((item) => {
      const page = parseInt(item.getAttribute('data-page'), 10);
      if (page === activeNum) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // PLEIN ÉCRAN & TOOLBAR OSD
  // =========================================================================
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (dom.app.requestFullscreen) {
        dom.app.requestFullscreen().catch(() => {});
      }
      state.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      state.isFullscreen = false;
    }
  }

  function toggleToolbar() {
    state.isToolbarVisible = !state.isToolbarVisible;
    if (dom.topHeader) {
      dom.topHeader.classList.toggle('hidden-toolbar', !state.isToolbarVisible);
    }
  }

  function showOsd() {
    if (!dom.readerOsd) return;
    if (osdTimer) clearTimeout(osdTimer);
    
    dom.osdText.textContent = `Page ${state.pageNum} / ${state.pageCount} • Zoom ${Math.round(state.scale * 100)}%`;
    dom.readerOsd.classList.add('visible');

    osdTimer = setTimeout(() => {
      dom.readerOsd.classList.remove('visible');
    }, 2500);
  }

  function showToast(message) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>📌</span><span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // =========================================================================
  // NAVIGATION VUES (Accueil vs Lecteur)
  // =========================================================================
  function switchView(viewName) {
    if (viewName === 'reader') {
      dom.homeView.classList.add('view-hidden');
      dom.readerView.classList.remove('view-hidden');
      if (dom.btnLibrary) dom.btnLibrary.classList.remove('view-hidden');
    } else {
      dom.readerView.classList.add('view-hidden');
      dom.homeView.classList.remove('view-hidden');
      if (dom.btnLibrary) dom.btnLibrary.classList.add('view-hidden');
      renderRecentsGrid();
      // Re-focus bouton principal
      if (dom.btnHeroOpen) dom.btnHeroOpen.focus();
    }
  }

  // =========================================================================
  // GESTION DU SÉLECTEUR DE FICHIER LOCAL & GLISSER-DÉPOSER
  // =========================================================================
  function triggerFileInput() {
    if (dom.fileInput) {
      dom.fileInput.value = '';
      dom.fileInput.click();
    }
  }

  function handleFileSelected(file) {
    if (!file) return;
    if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Veuillez sélectionner un fichier PDF valide (.pdf)');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const buffer = e.target.result;
      loadPdfFromArrayBuffer(buffer, file.name, 1);
    };
    reader.onerror = function () {
      showToast('Erreur lors de la lecture du fichier');
    };
    reader.readAsArrayBuffer(file);
  }

  // =========================================================================
  // TÉLÉCOMMANDE ANDROID TV & GESTION CLAVIER (D-PAD)
  // =========================================================================
  function setupKeyboardAndRemote() {
    window.addEventListener('keydown', (e) => {
      // Si une modale est ouverte et touche Échap
      if (e.key === 'Escape' || e.key === 'Backspace' || e.keyCode === 27 || e.keyCode === 8) {
        if (!dom.helpModal.classList.contains('view-hidden')) {
          e.preventDefault();
          dom.helpModal.classList.add('view-hidden');
          return;
        }
        // Si on est dans le lecteur, retour à l'accueil
        if (!dom.readerView.classList.contains('view-hidden')) {
          // Éviter de revenir en arrière dans l'historique du navigateur
          e.preventDefault();
          switchView('home');
          return;
        }
      }

      // Si le lecteur est affiché
      if (!dom.readerView.classList.contains('view-hidden')) {
        switch (e.key) {
          case 'ArrowRight':
          case 'Right':
            // Page suivante
            nextPage();
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case 'Left':
            // Page précédente
            prevPage();
            e.preventDefault();
            break;
          case 'ArrowDown':
          case 'Down':
            // Défilement vers le bas dans la zone de lecture
            if (dom.pdfViewport) {
              dom.pdfViewport.scrollTop += 120;
            }
            break;
          case 'ArrowUp':
          case 'Up':
            // Défilement vers le haut
            if (dom.pdfViewport) {
              dom.pdfViewport.scrollTop -= 120;
            }
            break;
          case 'PageDown':
            // Saut rapide de 5 pages
            jumpToPage(state.pageNum + 5);
            e.preventDefault();
            break;
          case 'PageUp':
            // Saut rapide de 5 pages
            jumpToPage(state.pageNum - 5);
            e.preventDefault();
            break;
          case 'Home':
            jumpToPage(1);
            e.preventDefault();
            break;
          case 'End':
            jumpToPage(state.pageCount);
            e.preventDefault();
            break;
          case '+':
          case '=':
            zoomIn();
            e.preventDefault();
            break;
          case '-':
          case '_':
            zoomOut();
            e.preventDefault();
            break;
          case 'w':
          case 'W':
            toggleFitMode();
            e.preventDefault();
            break;
          case 'r':
          case 'R':
            rotateClockwise();
            e.preventDefault();
            break;
          case 'd':
          case 'D':
          case 'n':
          case 'N':
            cycleColorFilter();
            e.preventDefault();
            break;
          case 'm':
          case 'M':
            toggleThumbnails();
            e.preventDefault();
            break;
          case 'f':
          case 'F':
            toggleFullscreen();
            e.preventDefault();
            break;
          case '?':
          case 'h':
          case 'H':
            dom.helpModal.classList.toggle('view-hidden');
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    });
  }

  // =========================================================================
  // ÉCOUTEURS D'ÉVÉNEMENTS UI
  // =========================================================================
  function setupEventListeners() {
    // Boutons Ouvrir
    if (dom.btnOpen) dom.btnOpen.addEventListener('click', triggerFileInput);
    if (dom.btnHeroOpen) dom.btnHeroOpen.addEventListener('click', triggerFileInput);
    if (dom.btnDropzone) dom.btnDropzone.addEventListener('click', triggerFileInput);

    if (dom.fileInput) {
      dom.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFileSelected(e.target.files[0]);
        }
      });
    }

    // Drag and Drop
    if (dom.btnDropzone) {
      ['dragenter', 'dragover'].forEach(name => {
        dom.btnDropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dom.btnDropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dom.btnDropzone.addEventListener(name, (e) => {
          e.preventDefault();
          dom.btnDropzone.classList.remove('dragover');
        });
      });

      dom.btnDropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelected(e.dataTransfer.files[0]);
        }
      });
    }

    // Bouton Bibliothèque / Accueil
    if (dom.btnLibrary) {
      dom.btnLibrary.addEventListener('click', () => switchView('home'));
    }

    // Contrôles de pagination
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', prevPage);
    if (dom.btnNext) dom.btnNext.addEventListener('click', nextPage);
    if (dom.btnFloatingPrev) dom.btnFloatingPrev.addEventListener('click', prevPage);
    if (dom.btnFloatingNext) dom.btnFloatingNext.addEventListener('click', nextPage);

    if (dom.pageCurrentInput) {
      dom.pageCurrentInput.addEventListener('change', (e) => {
        jumpToPage(e.target.value);
      });
      dom.pageCurrentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          jumpToPage(e.target.value);
          dom.pageCurrentInput.blur();
        }
      });
    }

    // Zoom, rotation, filtres
    if (dom.btnZoomIn) dom.btnZoomIn.addEventListener('click', zoomIn);
    if (dom.btnZoomOut) dom.btnZoomOut.addEventListener('click', zoomOut);
    if (dom.btnZoomFit) dom.btnZoomFit.addEventListener('click', toggleFitMode);
    if (dom.btnRotate) dom.btnRotate.addEventListener('click', rotateClockwise);
    if (dom.btnFilter) dom.btnFilter.addEventListener('click', cycleColorFilter);
    if (dom.btnThumbnails) dom.btnThumbnails.addEventListener('click', toggleThumbnails);
    if (dom.btnFullscreen) dom.btnFullscreen.addEventListener('click', toggleFullscreen);

    // Changement de Langue FR / EN
    if (dom.btnLang) dom.btnLang.addEventListener('click', toggleLanguage);

    // Modale Aide Raccourcis
    if (dom.btnHelp) {
      dom.btnHelp.addEventListener('click', () => {
        dom.helpModal.classList.remove('view-hidden');
      });
    }
    if (dom.btnFloatingHelp) {
      dom.btnFloatingHelp.addEventListener('click', () => {
        dom.helpModal.classList.remove('view-hidden');
      });
    }
    if (dom.btnCloseHelp) {
      dom.btnCloseHelp.addEventListener('click', () => {
        dom.helpModal.classList.add('view-hidden');
      });
    }
    if (dom.helpModal) {
      dom.helpModal.addEventListener('click', (e) => {
        if (e.target === dom.helpModal) {
          dom.helpModal.classList.add('view-hidden');
        }
      });
    }

    // Double-clic sur le canvas pour basculer la barre d'outils
    if (dom.pdfCanvas) {
      dom.pdfCanvas.addEventListener('dblclick', toggleToolbar);
    }

    // Redimensionnement de la fenêtre (ajustement dynamique TV / Tablette)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!dom.readerView.classList.contains('view-hidden') && state.pdfDoc) {
          queueRenderPage(state.pageNum);
        }
      }, 200);
    });
  }

  // =========================================================================
  // SERVICE WORKER & PWA
  // =========================================================================
  function initServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
          .then((reg) => console.log('Service Worker enregistré:', reg.scope))
          .catch((err) => console.log('Service Worker échec:', err));
      });
    }
  }

  // Démarrage au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
