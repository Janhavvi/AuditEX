# Embeddable Widget

AuditEX includes a lightweight script that bloggers or partner pages can drop into an article to embed the audit form.

```html
<script
  src="https://YOUR_DEPLOYED_FRONTEND_URL/embed.js"
  data-auditex-origin="https://YOUR_DEPLOYED_FRONTEND_URL"
  data-title="AuditEX AI spend audit"
  data-height="760px"
  async
></script>
```

The script injects a responsive iframe pointed at `/audit?embed=1`. The widget does not require login and keeps the same post-value email capture flow as the main app.

Before launch, replace `YOUR_DEPLOYED_FRONTEND_URL` with the production frontend domain.
