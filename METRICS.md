# Metrics

The North Star metric is qualified high-savings audits per week. A qualified high-savings audit is a completed audit that shows at least $500/month in estimated savings and includes a saved lead with a valid email. This is better than DAU or pageviews because AuditEX is not a daily-use app. It is a quarterly or renewal-cycle diagnostic whose business value comes from identifying companies with enough savings pain to justify a Credex conversation.

Three input metrics drive the North Star:

1. Audit start to audit completion rate. If users do not finish the form, the product never reaches value.
2. Completed audit to saved report or lead capture rate. This shows whether the result felt useful enough to exchange contact information or share.
3. Share URL open rate. The viral loop depends on public reports being sent to teammates, advisors, CFOs, and founders.

I would instrument the audit funnel first: landing CTA clicked, first tool added, audit generated, summary loaded, public report saved, lead form submitted, share link copied, PDF downloaded, and Credex CTA clicked. Each event should include anonymous context such as tool count, total monthly spend bucket, estimated savings bucket, and whether the audit crossed the high-savings threshold. I would not store raw email or company name in analytics events.

The first pivot trigger is fewer than 5 percent of completed audits becoming high-savings qualified leads after 100 completed audits. That would imply either the target audience is wrong, the form is attracting hobbyists instead of budget owners, or the savings threshold/value proposition is misaligned. A second warning sign is completion below 35 percent from first tool added to generated audit; that would mean the form is too much work before users see value.
