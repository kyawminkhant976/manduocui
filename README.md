# 满多翠 Showcase Website

Multi-page website using HTML, CSS, JavaScript, and a small Express API for product data.

## Features

- Premium dark jade theme (green, gold, black)
- Fully responsive layout for mobile, tablet, desktop
- Public pages: Home, About, Products, Product Details
- Dynamic product data via `/api/products`
- Protected admin dashboard with simple password login
- Admin CRUD: add/edit/delete products
- Image upload support (converted to Data URL)
- SEO basics: title/meta/canonical, robots.txt, sitemap.xml

## Run locally

Start the Node server:

```bash
cd /Users/kyawminkhant/Desktop/满多翠2
npm start
```

Open:

- http://localhost:3000/index.html

## Admin Access (demo)

- URL: `http://localhost:3000/admin.html`
- Password: `aungsoemin`

## Notes

- Product data is stored in `data/products.json`.
- For production, replace the demo login with real authentication before publishing the admin page.
