math blog
---
This is the blog that powers `krispuremath.vercel.app`, built with [next.js](https://nextjs.org/) deployed to the cloud via vercel.

### Pure components

Every stateless pure component is found under `./components`.

Every component that has to do with styling the post's markup
is found under `./components/post/`

These components make up the _style guide_ of the application.

### Blog posts

Every blog post is dynamically pulled from ghost as a headless cms.

You can set pages to renew after 30min in order to have cached static pages
and take advantage of automatic code splitting and lazy loading.

This means that the bloat of a single post doesn't "rub off on" the
rest of the site.

### Performance

[PageSpeed report](https://pagespeed.web.dev/analysis/https-krispuremath-vercel-app/wjowavujnl?form_factor=mobile) for Emulated Moto G Power with Lighthouse 11.0.0, Slow 4G Throttling:
![9eb26aa9-17a0-45e9-b38f-58944e034b54](https://github.com/user-attachments/assets/a6c6d2c0-8405-41b7-9f3f-76fb12edd141)

😔 The Accessibility `93` score cannot be `100` without sacrificing stylistic fidelity.</sup>
