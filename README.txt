TURJO PANEL SHOP — Firebase starter project
=============================================

Included:
- index.html: public shop
- login.html: email/password registration and login
- checkout.html: duration choice and manual Nagad transaction submission
- orders.html: customer's own orders and approved delivery
- admin.html: separate admin dashboard
- style.css / app.js / firebase-config.js
- firestore.rules / storage.rules

IMPORTANT
This is a starter implementation for legitimate digital products/access services.
Do not use it to sell cheats, unauthorized access, stolen accounts, or tools that bypass game/security protections.

SETUP
1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App and copy its config into firebase-config.js.
3. Enable Authentication > Sign-in method > Email/Password.
   (Firebase calls this Email/Password; users can register using their Gmail address.)
4. In Authentication > Users, create your admin account, then copy its UID.
5. Replace REPLACE_WITH_YOUR_ADMIN_UID in:
   - app.js (ADMIN_UIDS array)
   - firestore.rules
   - storage.rules
   If more than one admin is needed, update app.js and rules consistently.
6. Create Firestore Database and publish firestore.rules.
7. Enable Storage and publish storage.rules.
8. In Authentication > Settings > Authorized domains, add your hosting domain.
9. Host all files together on HTTPS (Firebase Hosting or GitHub Pages).
10. Open admin.html, sign in with the admin account, and add products.

PAYMENT FLOW
- Customer signs in, selects a product/duration, sends money to the displayed Nagad number,
  and submits the transaction ID.
- Admin independently verifies the transaction in Nagad before approving.
- Admin enters the access username/password/link and approves.
- Customer sees delivery details in My Orders.

SECURITY / PRODUCTION NOTES
- Firebase client config is not a secret. Firestore and Storage Rules are the security boundary.
- Never put a service-account key or private admin password in these files.
- Use a unique admin account and strong password; enable email verification.
- The sample uses a UID allowlist. Replace the placeholder everywhere before publishing.
- Configure Firestore indexes if Firebase asks for one for an order query.
- For production, add server-side validation (Cloud Functions/Cloud Run) for product prices,
  payment references, rate limiting, expiry handling, and immutable audit logs.
- The custom duration amount is entered by the buyer in this starter. For real sales,
  change this to admin-defined duration/price options so customers cannot choose arbitrary prices.
- The 1-hour / 2-hour prices shown at checkout are starter examples. Set prices that you actually offer.
- Manual payment is not automatically verified; an admin must verify it.
