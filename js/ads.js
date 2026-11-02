/**
 * MODULE PUBLICITAIRE PROFESSIONNEL
 * Affichage sobre et conforme aux directives des stores (Amazon Appstore & Google Play)
 * Étiquetage standard « Sponsorisé » / « Sponsored » sans mention technique intrusive.
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

  function isEnglish() {
    return (document.documentElement.lang === 'en');
  }

  function initAds() {
    setupBannerAds();
    setupNativeAdCard();
    setupInChatAdWidget();
    setupRewardedAdButton();
    setupStartIoWebSdk();
  }

  // 1. CHARGEMENT TECHNIQUE DU SDK START.IO
  function setupStartIoWebSdk() {
    try {
      window.startio_app_id = STARTIO_CONFIG.appId;
      window.startapp_app_id = STARTIO_CONFIG.appId;

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

  // 2. BANNER ADS (Bannière Standard)
  function setupBannerAds() {
    const bannerContainer = document.getElementById('startio-ad-banner');
    if (!bannerContainer) return;

    const en = isEnglish();
    const badgeText = en ? 'Sponsored' : 'Sponsorisé';
    const titleText = en ? 'Recommended Services & Partner Tools' : 'Découvrez nos applications & services partenaires';
    const subText = en ? 'Curated selection for Smart TV & Tablet' : 'Sélection exclusive pour Smart TV et tablette';
    const ctaText = en ? 'Learn More ►' : 'En savoir plus ►';

    bannerContainer.innerHTML = `
      <div class="ad-banner-box" tabindex="0" role="complementary" aria-label="${badgeText}">
        <div class="ad-banner-badge">📢 ${badgeText}</div>
        <div class="ad-banner-content">
          <div class="ad-banner-icon">🚀</div>
          <div class="ad-banner-text">
            <strong>${titleText}</strong>
            <span>${subText}</span>
          </div>
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="ad-banner-cta" tabindex="0">
            ${ctaText}
          </a>
        </div>
      </div>
    `;
  }

  // 3. NATIVE ADS (Carte intégrée dans la bibliothèque)
  function setupNativeAdCard() {
    const list = document.getElementById('recent-list');
    if (!list) return;

    const observer = new MutationObserver(() => {
      if (document.getElementById('startio-native-ad-card')) return;

      const en = isEnglish();
      const badgeText = en ? 'SPONSORED' : 'SPONSORISÉ';
      const cardTitle = en ? 'Recommended Tools & Utilities' : 'Outils & Utilitaires Recommandés';
      const cardSub = en ? 'Verified Partner' : 'Partenaire Vérifié';
      const cardDesc = en 
        ? 'Enhance your reading productivity with recommended tools designed for TV & tablet.' 
        : 'Optimisez votre productivité de lecture avec des outils recommandés pour grand écran et tablette.';
      const ctaBtn = en ? 'Discover' : 'Découvrir';

      const adCard = document.createElement('div');
      adCard.id = 'startio-native-ad-card';
      adCard.className = 'doc-card ad-native-card';
      adCard.setAttribute('tabindex', '0');
      adCard.setAttribute('role', 'article');
      adCard.setAttribute('aria-label', badgeText);

      adCard.innerHTML = `
        <div class="doc-card-top">
          <div class="doc-icon-wrapper ad-icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <div class="doc-meta">
            <div class="ad-badge-native">📢 ${badgeText}</div>
            <h4 class="doc-title" style="color: #60a5fa;">${cardTitle}</h4>
            <div class="doc-info">
              <span>${cardSub}</span>
            </div>
          </div>
        </div>
        <div class="ad-native-body">
          <p>${cardDesc}</p>
        </div>
        <div class="doc-card-bottom">
          <span class="doc-tag" style="color: #38bdf8;">${badgeText}</span>
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="btn btn-outline" style="min-height: 32px; padding: 0 12px; font-size: 0.8rem; text-decoration: none;">
            ${ctaBtn}
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

  // 4. IN-CHAT ADS (Bulle / Message Partenaire)
  function setupInChatAdWidget() {
    if (document.getElementById('startio-inchat-widget')) return;

    const en = isEnglish();
    const widget = document.createElement('div');
    widget.id = 'startio-inchat-widget';
    widget.className = 'inchat-ad-widget';
    widget.setAttribute('role', 'complementary');

    const bubbleLabel = en ? 'Partner Offer' : 'Offre Partenaire';
    const popoverTitle = en ? '📢 Featured Partner' : '📢 Offre Partenaire';
    const popoverBody = en 
      ? 'Discover special partner offers and features optimized for your connected devices.' 
      : 'Découvrez des offres et fonctionnalités partenaires exclusives pour vos appareils connectés.';
    const popoverCta = en ? 'View Offer' : 'Découvrir';

    widget.innerHTML = `
      <div class="inchat-bubble" id="inchat-bubble" tabindex="0" title="${bubbleLabel}">
        <span class="inchat-pulse"></span>
        <span class="inchat-icon">💡</span>
        <span class="inchat-label">${bubbleLabel}</span>
      </div>
      <div class="inchat-popover view-hidden" id="inchat-popover">
        <div class="inchat-header">
          <div class="inchat-header-title">
            <span>${popoverTitle}</span>
          </div>
          <button class="doc-delete-btn" id="btn-close-inchat" title="Fermer" aria-label="Fermer">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="inchat-body">
          <p>${popoverBody}</p>
        </div>
        <div class="inchat-footer">
          <a href="https://portal.start.io/" target="_blank" rel="noopener sponsored" class="btn btn-primary" style="font-size: 0.85rem; padding: 6px 14px; text-decoration: none;" tabindex="0">
            ${popoverCta}
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

    setTimeout(() => {
      popover.classList.remove('view-hidden');
    }, 6000);
  }

  function closeInChatAd() {
    const popover = document.getElementById('inchat-popover');
    if (popover) popover.classList.add('view-hidden');
  }

  // 5. REWARDED VIDEO ADS (Vidéo Récompensée)
  function setupRewardedAdButton() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight || document.getElementById('btn-rewarded-ad')) return;

    const en = isEnglish();
    const rewardBtn = document.createElement('button');
    rewardBtn.id = 'btn-rewarded-ad';
    rewardBtn.className = 'btn btn-outline';
    rewardBtn.style.color = '#fbbf24';
    rewardBtn.style.borderColor = 'rgba(251, 191, 36, 0.4)';
    rewardBtn.setAttribute('tabindex', '0');
    rewardBtn.setAttribute('title', en ? 'Watch a partner video to unlock VIP bonuses' : 'Regarder une vidéo partenaire pour débloquer un bonus VIP');
    rewardBtn.innerHTML = `
      <span>🎁</span>
      <span>${en ? 'VIP Bonus' : 'Bonus VIP'}</span>
    `;

    rewardBtn.addEventListener('click', showRewardedVideoModal);
    headerRight.prepend(rewardBtn);
  }

  function showRewardedVideoModal() {
    const en = isEnglish();
    const modalTitle = en ? '🎬 Partner Video Bonus' : '🎬 Vidéo Partenaire (Bonus)';
    const screenTitle = en ? 'Playing partner announcement...' : 'Visionnage de l’annonce partenaire...';
    const screenDesc = en 
      ? 'Watch this short partner announcement to unlock your VIP reader bonus!' 
      : 'Regardez cette courte annonce partenaire pour débloquer votre bonus VIP de lecture !';
    const skipLabel = en ? 'Skip in' : 'Passer dans';

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
          <h3 class="modal-title" style="color: #fbbf24;">${modalTitle}</h3>
          <span class="key-pill" id="rewarded-timer" style="color: #ffffff; background: #e53e3e;">6s</span>
        </div>
        <div class="modal-body" style="padding: 24px;">
          <div class="rewarded-video-screen" id="rewarded-screen">
            <div class="rewarded-pulse-circle">▶</div>
            <div style="margin-top: 16px;">
              <h4 style="color: #fff; margin-bottom: 6px;">${screenTitle}</h4>
              <p style="color: #94a3b8; font-size: 0.88rem;">${screenDesc}</p>
            </div>
            <div class="doc-progress-bar" style="margin-top: 20px; height: 8px;">
              <div class="doc-progress-fill" id="rewarded-progress" style="width: 0%; background: linear-gradient(90deg, #f59e0b, #10b981);"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: flex-end;">
          <button class="btn btn-outline" id="btn-skip-rewarded" disabled style="opacity: 0.5;">
            ${skipLabel} 6s
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    startVideoPlayback();
  }

  function startVideoPlayback() {
    const en = isEnglish();
    const skipLabel = en ? 'Skip in' : 'Passer dans';
    let timeLeft = STARTIO_CONFIG.rewardedDurationSec;
    const timerBadge = document.getElementById('rewarded-timer');
    const progressBar = document.getElementById('rewarded-progress');
    const skipBtn = document.getElementById('btn-skip-rewarded');
    const modal = document.getElementById('rewarded-ad-modal');

    skipBtn.disabled = true;
    skipBtn.style.opacity = '0.5';
    skipBtn.textContent = `${skipLabel} ${timeLeft}s`;

    const totalTime = timeLeft;
    const interval = setInterval(() => {
      timeLeft--;
      if (timerBadge) timerBadge.textContent = `${timeLeft}s`;
      if (skipBtn) skipBtn.textContent = `${skipLabel} ${timeLeft}s`;

      const progress = Math.round(((totalTime - timeLeft) / totalTime) * 100);
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (timeLeft <= 0) {
        clearInterval(interval);
        onVideoRewardCompleted(modal, skipBtn, timerBadge);
      }
    }, 1000);
  }

  function onVideoRewardCompleted(modal, skipBtn, timerBadge) {
    const en = isEnglish();
    STARTIO_CONFIG.hasUnlockedVip = true;
    if (timerBadge) {
      timerBadge.textContent = en ? 'Completed!' : 'Complété !';
      timerBadge.style.background = '#10b981';
    }

    if (skipBtn) {
      skipBtn.disabled = false;
      skipBtn.style.opacity = '1';
      skipBtn.className = 'btn btn-primary';
      skipBtn.textContent = en ? 'Claim VIP Reward 🎁' : 'Récupérer mon bonus VIP 🎁';
      skipBtn.focus();

      skipBtn.onclick = () => {
        modal.classList.add('view-hidden');
        if (window.showToast) {
          window.showToast(en ? '🎉 VIP Bonus Unlocked! Enjoy HD reading.' : '🎉 Félicitations ! Bonus VIP Débloqué.');
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
