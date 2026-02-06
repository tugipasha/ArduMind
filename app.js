(() => {
  const PAGE_MAP = {
    'home.html': 'home',
    'components.html': 'components',
    'docs.html': 'docs',
    'videos.html': 'videos',
    'algo-builder.html': 'algo-builder',
    'path.html': 'path',
    'arduino.html': 'arduino',
    'quiz.html': 'quiz',
    'about.html': 'about',
    'dashboard.html': 'dashboard',
    'editor.html': 'editor',
    'profile.html': 'profile'
  };

  const getDesiredPage = () => {
    const byGlobal = window.ARDUMIND_PAGE;
    const byAttr = document.body.getAttribute('data-page');
    const byPath = PAGE_MAP[location.pathname.split('/').pop()];
    return byGlobal || byAttr || byPath || 'home';
  };

  const ensureIframe = () => {
    let iframe = document.getElementById('appframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'appframe';
      iframe.src = 'index.html';
      iframe.style.border = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      document.body.style.margin = '0';
      document.body.appendChild(iframe);
    } else if (!iframe.src || !/index\.html(\?|$)/.test(iframe.src)) {
      iframe.src = 'index.html';
    }
    return iframe;
  };

  const desired = getDesiredPage();
  const iframe = ensureIframe();

  const onLoad = () => {
    const w = iframe.contentWindow;
    if (!w) return;
    if (typeof w.navigateTo === 'function') {
      w.navigateTo(desired);
    } else if (w.appState && typeof w.renderApp === 'function') {
      w.appState.currentPage = desired;
      w.renderApp();
    }
  };

  // If already loaded, trigger; else wait
  if (iframe.contentWindow && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
    onLoad();
  } else {
    iframe.addEventListener('load', onLoad, { once: true });
  }
})();
