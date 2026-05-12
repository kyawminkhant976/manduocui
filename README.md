# 满多翠 Showcase Website

Static multi-page website using HTML, CSS, and JavaScript.

## Features

- Premium dark jade theme (green, gold, black)
- Fully responsive layout for mobile, tablet, desktop
- Public pages: Home, About, Products, Product Details
- Dynamic product data via localStorage (not hardcoded in page markup)
- Protected admin dashboard with simple password login
- Admin CRUD: add/edit/delete products
- Image upload support (converted to Data URL)
- SEO basics: title/meta/canonical, robots.txt, sitemap.xml

## Run locally

Use any static server. Example with Python:

```bash
cd /Users/kyawminkhant/Desktop/满多翠2
python3 -m http.server 5500
```

Open:

- http://localhost:5500/index.html

## Admin Access (demo)

- URL: `/admin.html`
- Password: `mandojade2026`

## Notes

- Data is stored in browser localStorage.
- For production with shared data, replace localStorage with a real backend (Supabase/Firebase/API).
