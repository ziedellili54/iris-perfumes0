Demo perfume product grid and product detail pages

Files created:
- index.html — product grid
- product.html — product detail, add to cart, checkout, admin controls
- styles.css — styles (image aspect ratio + object-fit)
- app.js — demo data + logic using localStorage

How to preview:
Open `index.html` in your browser (double-click or use a local server). Images reference `images/*.jpg` — replace with your actual images or update paths in `app.js`.

Notes:
- Images are fitted using CSS `object-fit: cover` inside fixed-aspect containers to ensure they "fill the frame" without distortion.
- Admin mode: click "Admin Login" and enter password `admin` to toggle admin features.
- Mark a product épuisé from product detail page and it will show "Épuisé" in the grid.

Next steps I can do for you:
- Patch your existing `css.html` to adopt these styles and behavior.
- Wire real backend APIs and authentication instead of localStorage.
