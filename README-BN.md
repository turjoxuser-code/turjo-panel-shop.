# TURJO PANEL SHOP — Updated Project

## Folder / Render setup
- User website: publish/root folder হবে project-এর `user` নয়; root project folder-এর `user/index.html` হলো User page।
- Admin website: একই repository থেকে দ্বিতীয় Render Static Site তৈরি করে Publish Directory `.` রেখে URL-এ `/admin/` ব্যবহার করুন। অথবা আলাদা Render Static Site-এ একই project root publish করে `/admin/` route দিন।
- সহজে কাজ করাতে দুই Render Static Site-ই repository root publish করবে; User URL-এর শেষে `/user/` এবং Admin URL-এর শেষে `/admin/` যোগ হবে।
- GitHub repository root-এ `firebase-config.js`, `admin-config.js`, `styles.css`, `user/`, `admin/` রাখুন।

## One-time Admin UID setup (এটা ছাড়া Admin নিরাপদ হবে না)
1. User site খুলে যে Gmail-টি Admin হবে, সেটি দিয়ে Google Login করুন।
2. Firebase Console → Authentication → Users থেকে সেই account-এর UID কপি করুন।
3. `admin-config.js`-এ `PASTE_YOUR_ADMIN_FIREBASE_UID_HERE` বদলে UID বসান।
4. `firebase/firestore.rules`-এ একই placeholder বদলে একই UID বসান।
5. Firebase Console → Firestore Database → Rules-এ rules ফাইলের সম্পূর্ণ code paste করে Publish করুন।
6. GitHub-এ পরিবর্তন Commit করুন; Render auto deploy করবে।

## Features
- Public home / ROOT / NON ROOT browse without login.
- Google Login only when Buy Now is selected.
- 1 hour, 2 hours and custom hours + custom price.
- Nagad manual payment to 01946730203 with TrxID submission.
- User profile and own order history / pending-approved-rejected state.
- Separate Admin dashboard: panel CRUD, user list, order review, approve/reject, delivery URL/password.
- Panel images use public HTTPS image URLs. Firebase Storage upload is intentionally not used, so no Storage/Blaze upgrade is required.

## Important security/payment notes
- Firebase client config is public by design; Firestore Rules + Admin UID protect the database.
- Never leave the Admin UID placeholder in production. Only your verified UID should be listed.
- The admin page hiding itself is not security by itself; Firestore Rules are the actual protection.
- Nagad payment is manual, not an automatic Nagad API. Verify the received payment in your own Nagad account before Approve.
- Custom price is customer-entered in this version. If you want only admin-set prices, change the checkout logic to fixed price packages before production.
