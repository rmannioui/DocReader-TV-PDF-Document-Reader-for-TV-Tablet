/**
 * MODULE PUBLICITAIRE START.IO (App ID: 210453717)
 * Gère les formats :
 * 1. BANNER Ads (Bannière d'accueil & lecteur)
 * 2. NATIVE Ads (Carte sponsorisée intégrée dans la grille de documents)
 * 3. IN-CHAT Ads (Widget flottant interactif de message sponsorisé)
 * 4. REWARDED VIDEO Ads (Vidéo récompensée avec déblocage de fonctionnalités)
 */

(function () {
  'use strict';

  const STARTIO_CONFIG = {
    appId: '210453717',
    isTestMode: false,
    rewardedDurationSec: 6,
    hasUnlockedVip: false
  };

  window.StartIO = {
    config: STARTIO_CONFIG,
    init: initAds,
    showRewarded: showRewardedVideoModal,
    closeFloatingAd: closeInChatAd
  };

  function initAds() {
    setupBannerAds();
    setupNativeAdCard();
    setupInChatAdWidget();
    setupRewardedAdButton();
    setupStartIoWebSdk();
  }

  // 1. CHARGEMENT DU SDK WEB START.IO
  function setupStartIoWebSdk() {
    try {
      window.startio_app_id = STARTIO_CONFIG.appId;
      window.startapp_app_id = STARTIO_CONFIG.appId;

      // Charge le script Start.io officiel si disponible
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://cdn.startappservice.com/startapp-tag.js?app_id=${STARTIO_CONFIG.appId}`;
      script.onerror = () => {
        console.log('[Start.io] Mode local / fallback actif pour App ID:', STARTIO_CONFIG.appId);
      };
      document.head.appendChild(script);
    } catch (e) {
      console.warn('[Start.io] Erreur initialisation SDK:', e);
    }
  }

  // 2. BANNER ADS
  function setupBannerAds() {
    const bannerContainer = document.getElementById('startio-ad-banner');
    if (!bannerContainer) return;

    bannerContainer.innerHTML = `
      <div class="ad-banner-box" tabindex="0" role="complementary" aria-label="Publicité Start.io">
        <div class="ad-banner-badge">Sponsorisé • Start.io</div>
        <div class="ad-banner-content">
          <div class="ad-banner-icon">🚀</div>
          <div class="ad-banner-text">
            <strong>Découvrez les meilleures applications & services</strong>
            <span>Sélection exclusive pour Android TV & Tablette</span>
          </div>
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="ad-banner-cta" tabindex="0">
            Explorer ►
          </a>
        </div>
      </div>
    `;
  }

  // 3. NATIVE ADS (Intégré dans la grille des documents)
  function setupNativeAdCard() {
    const list = document.getElementById('recent-list');
    if (!list) return;

    // Observeur pour insérer la carte native après le rendu des récents
    const observer = new MutationObserver(() => {
      if (document.getElementById('startio-native-ad-card')) return;

      const adCard = document.createElement('div');
      adCard.id = 'startio-native-ad-card';
      adCard.className = 'doc-card ad-native-card';
      adCard.setAttribute('tabindex', '0');
      adCard.setAttribute('role', 'article');
      adCard.setAttribute('aria-label', 'Annonce sponsorisée Start.io');

      adCard.innerHTML = `
        <div class="doc-card-top">
          <div class="doc-icon-wrapper ad-icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div class="doc-meta">
            <div class="ad-badge-native">SPONSORISÉ • START.IO</div>
            <h4 class="doc-title" style="color: #60a5fa;">Outils & Guides Recommandés</h4>
            <div class="doc-info">
              <span>App ID : ${STARTIO_CONFIG.appId}</span>
              <span>•</span>
              <span>Partenaire vérifié</span>
            </div>
          </div>
        </div>
        <div class="ad-native-body">
          <p>Boostez votre expérience de lecture avec les utilitaires partenaires sélectionnés pour Android TV & Tablette.</p>
        </div>
        <div class="doc-card-bottom">
          <span class="doc-tag" style="color: #38bdf8;">START.IO NATIVE</span>
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="btn btn-outline" style="min-height: 32px; padding: 0 12px; font-size: 0.8rem; text-decoration: none;">
            Installer
          </a>
        </div>
      `;

      adCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.open('https://portal.start.io/', '_blank');
        }
      });

      list.appendChild(adCard);
    });

    observer.observe(list, { childList: true });
  }

  // 4. IN-CHAT ADS / FLOATING SPONSORED MESSAGE
  function setupInChatAdWidget() {
    if (document.getElementById('startio-inchat-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'startio-inchat-widget';
    widget.className = 'inchat-ad-widget';
    widget.setAttribute('role', 'complementary');
    widget.setAttribute('aria-label', 'Message sponsorisé');

    widget.innerHTML = `
      <div class="inchat-bubble" id="inchat-bubble" tabindex="0" title="Message sponsorisé">
        <span class="inchat-pulse"></span>
        <span class="inchat-icon">💬</span>
        <span class="inchat-label">Offre Partenaire</span>
      </div>
      <div class="inchat-popover view-hidden" id="inchat-popover">
        <div class="inchat-header">
          <div class="inchat-header-title">
            <span>📢 Annonce Start.io</span>
          </div>
          <button class="doc-delete-btn" id="btn-close-inchat" title="Fermer" aria-label="Fermer l'annonce">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="inchat-body">
          <p>Profitez des offres exclusives Start.io compatibles avec vos appareils connectés et votre TV Box.</p>
        </div>
        <div class="inchat-footer">
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="btn btn-primary" style="font-size: 0.85rem; padding: 6px 14px; text-decoration: none;" tabindex="0">
            Découvrir l'offre
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(widget);

    const bubble = widget.querySelector('#inchat-bubble');
    const popover = widget.querySelector('#inchat-popover');
    const closeBtn = widget.querySelector('#btn-close-inchat');

    function toggleInChat() {
      popover.classList.toggle('view-hidden');
      if (!popover.classList.contains('view-hidden')) {
        const cta = popover.querySelector('a');
        if (cta) cta.focus();
      }
    }

    bubble.addEventListener('click', toggleInChat);
    bubble.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') toggleInChat();
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.add('view-hidden');
    });

    // Affichage automatique du message après 5 secondes
    setTimeout(() => {
      popover.classList.remove('view-hidden');
    }, 5000);
  }

  function closeInChatAd() {
    const popover = document.getElementById('inchat-popover');
    if (popover) popover.classList.add('view-hidden');
  }

  // 5. REWARDED VIDEO ADS
  function setupRewardedAdButton() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight || document.getElementById('btn-rewarded-ad')) return;

    const rewardBtn = document.createElement('button');
    rewardBtn.id = 'btn-rewarded-ad';
    rewardBtn.className = 'btn btn-outline';
    rewardBtn.style.color = '#fbbf24';
    rewardBtn.style.borderColor = 'rgba(251, 191, 36, 0.4)';
    rewardBtn.setAttribute('tabindex', '0');
    rewardBtn.setAttribute('title', 'Regarder une vidéo récompensée Start.io');
    rewardBtn.innerHTML = `
      <span>🎁</span>
      <span>Bonus VIP</span>
    `;

    rewardBtn.addEventListener('click', showRewardedVideoModal);
    headerRight.prepend(rewardBtn);
  }

  function showRewardedVideoModal() {
    if (document.getElementById('rewarded-ad-modal')) {
      document.getElementById('rewarded-ad-modal').classList.remove('view-hidden');
      startVideoPlayback();
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'rewarded-ad-modal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 540px; text-align: center;">
        <div class="modal-header">
          <h3 class="modal-title" style="color: #fbbf24;">🎬 Vidéo Récompensée Start.io</h3>
          <span class="key-pill" id="rewarded-timer" style="color: #ffffff; background: #e53e3e;">6s</span>
        </div>
        <div class="modal-body" style="padding: 24px;">
          <div class="rewarded-video-screen" id="rewarded-screen">
            <div class="rewarded-pulse-circle">▶</div>
            <div style="margin-top: 16px;">
              <h4 style="color: #fff; margin-bottom: 6px;">Visionnage de l'annonce partenaire...</h4>
              <p style="color: #94a3b8; font-size: 0.88rem;">Regardez cette vidéo pendant encore quelques secondes pour débloquer votre récompense VIP !</p>
            </div>
            <div class="doc-progress-bar" style="margin-top: 20px; height: 8px;">
              <div class="doc-progress-fill" id="rewarded-progress" style="width: 0%; background: linear-gradient(90deg, #f59e0b, #10b981);"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <span style="font-size: 0.82rem; color: #64748b; align-self: center;">App ID : ${STARTIO_CONFIG.appId}</span>
          <button class="btn btn-outline" id="btn-skip-rewarded" disabled style="opacity: 0.5;">
            Passer dans 6s
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    startVideoPlayback();
  }

  function startVideoPlayback() {
    let timeLeft = STARTIO_CONFIG.rewardedDurationSec;
    const timerBadge = document.getElementById('rewarded-timer');
    const progressBar = document.getElementById('rewarded-progress');
    const skipBtn = document.getElementById('btn-skip-rewarded');
    const modal = document.getElementById('rewarded-ad-modal');

    skipBtn.disabled = true;
    skipBtn.style.opacity = '0.5';
    skipBtn.textContent = `Passer dans ${timeLeft}s`;

    const totalTime = timeLeft;
    const interval = setInterval(() => {
      timeLeft--;
      if (timerBadge) timerBadge.textContent = `${timeLeft}s`;
      if (skipBtn) skipBtn.textContent = `Passer dans ${timeLeft}s`;

      const progress = Math.round(((totalTime - timeLeft) / totalTime) * 100);
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (timeLeft <= 0) {
        clearInterval(interval);
        onVideoRewardCompleted(modal, skipBtn, timerBadge);
      }
    }, 1000);
  }

  function onVideoRewardCompleted(modal, skipBtn, timerBadge) {
    STARTIO_CONFIG.hasUnlockedVip = true;
    if (timerBadge) {
      timerBadge.textContent = 'Complété !';
      timerBadge.style.background = '#10b981';
    }

    if (skipBtn) {
      skipBtn.disabled = false;
      skipBtn.style.opacity = '1';
      skipBtn.className = 'btn btn-primary';
      skipBtn.textContent = 'Récupérer ma récompense 🎁';
      skipBtn.focus();

      skipBtn.onclick = () => {
        modal.classList.add('view-hidden');
        if (window.showToast) {
          window.showToast('🎉 Félicitations ! Bonus VIP Débloqué (Mode sans pub & Haute Qualité)');
        }
      };
    }
  }

  // Initialisation dès que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
