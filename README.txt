TURJO PANEL SHOP - UPDATED PROJECT

Folder structure:
- user/index.html : Public customer website
- user/app.js     : User login, panels, checkout and order history
- admin/index.html: Separate admin dashboard
- admin/app.js    : Panel management, order approval and users
- style.css       : Shared neon gaming design
- firebase-config.js : Firebase Web App configuration
- admin-config.js    : Admin Firebase Auth UID allowlist

IMPORTANT SETUP
1. Replace all placeholder values in firebase-config.js with your Firebase Web App config.
2. Sign in once on the user site with the Google account that will be the administrator.
3. Firebase Console > Authentication > Users: copy that account's UID.
4. Paste the UID into admin-config.js in ADMIN_UIDS.
5. Enable Google provider in Firebase Authentication.
6. Create Firestore Database and apply secure rules (see firestore.rules.example).
7. Host the complete folder on Firebase Hosting or another HTTPS static host. Do not open index.html directly as a file.

URLs after hosting:
- User site: /user/
- Admin site: /admin/

Firestore collections used:
- panels: name, category (ROOT/NON ROOT), price1, price2, imageUrl, description, paymentNumber, active
- orders: uid, email, displayName, panelId, panelName, category, duration, amount, transactionId, senderNumber, status, deliveryLink, deliveryPassword, createdAt
- profiles: uid, email, displayName

SECURITY NOTE
The UID allowlist in JavaScript only hides the admin UI; it is NOT a security boundary. Firestore Security Rules must enforce admin-only writes/reads. Review the example rules and replace the placeholder UID there too. Do not publish permissive rules. Delivery passwords should ideally be stored in a server-controlled/private structure, not exposed in public client reads.
