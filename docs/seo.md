# JS2Next SEO

The app defaults to the production origin `https://js2next.vercel.app`. Set `SITE_URL` to override it when the canonical domain changes:

```sh
SITE_URL=https://learn.example.com npm run build
```

The app emits absolute canonical URLs, Open Graph URLs, `/sitemap.xml`, and
the `robots.txt` sitemap directive. The sitemap includes the landing page,
tracks, modules, and non-archived topic pages with available packets. Personal,
interactive, draft-preview, search, and internal showcase routes are excluded.
