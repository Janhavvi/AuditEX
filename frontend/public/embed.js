(function () {
  var currentScript = document.currentScript;
  var origin = currentScript && currentScript.getAttribute('data-auditex-origin');
  var title = currentScript && currentScript.getAttribute('data-title');
  var height = currentScript && currentScript.getAttribute('data-height');
  var source = origin || 'https://YOUR_DEPLOYED_FRONTEND_URL';
  var iframe = document.createElement('iframe');

  iframe.src = source.replace(/\/$/, '') + '/audit?embed=1';
  iframe.title = title || 'AuditEX AI spend audit';
  iframe.loading = 'lazy';
  iframe.style.width = '100%';
  iframe.style.minHeight = height || '760px';
  iframe.style.border = '1px solid rgba(148, 163, 184, 0.22)';
  iframe.style.borderRadius = '16px';
  iframe.style.background = '#050816';
  iframe.style.boxShadow = '0 24px 80px rgba(2, 6, 23, 0.22)';

  var container = document.createElement('div');
  container.setAttribute('data-auditex-widget', 'true');
  container.style.maxWidth = '1120px';
  container.style.margin = '24px auto';
  container.appendChild(iframe);

  currentScript.parentNode.insertBefore(container, currentScript);
})();
