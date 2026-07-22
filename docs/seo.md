# JS2Next SEO

Set `SITE_URL` to the canonical production origin before deployment, for example:

```sh
SITE_URL=https://learn.example.com npm run build
```

The app then emits absolute canonical URLs, Open Graph URLs, `/sitemap.xml`, and
the `robots.txt` sitemap directive. The sitemap includes the landing page,
tracks, modules, and non-archived topic pages with available packets. Personal,
interactive, draft-preview, search, and internal showcase routes are excluded.
