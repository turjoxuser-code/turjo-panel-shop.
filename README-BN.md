# TURJO PANEL SHOP

দুটি আলাদা frontend:
- `user/index.html` — Customer website
- `admin/index.html` — Separate admin website

## 1) Firebase project তৈরি
1. https://console.firebase.google.com এ গিয়ে project তৈরি করুন।
2. Authentication > Sign-in method থেকে Google enable করুন।
3. Firestore Database তৈরি করুন।
4. Storage চালু করুন।
5. Project settings > Your apps > Web app থেকে Firebase config কপি করুন।
6. `firebase-config.js` ফাইলে placeholder-এর জায়গায় config বসান।

## 2) Admin নিরাপত্তা সেটআপ (অবশ্যই করতে হবে)
1. User website চালিয়ে Admin-এর Gmail দিয়ে একবার Google Login করুন।
2. Firebase Console > Authentication > Users থেকে ওই Admin user-এর UID কপি করুন।
3. `admin/app.js`, `firebase/firestore.rules`, `firebase/storage.rules` — তিন জায়গায় `REPLACE_WITH_YOUR_FIREBASE_AUTH_UID` বদলে আসল UID বসান।
4. একই UID সব জায়গায় বসান। একাধিক Admin চাইলে array-তে আলাদা quoted UID যোগ করুন।
5. Firestore Rules এবং Storage Rules Firebase Console-এ publish করুন।
6. Admin UID কখনো public করবেন না। অন্য কাউকে Admin করতে চাইলে তার UID যাচাই করে নিজে যোগ করুন।

## 3) Hosting
দুটি আলাদা Firebase Hosting site / আলাদা hosting project-এ deploy করুন:
- User site: `user` folder-এর contents
- Admin site: `admin` folder-এর contents
দুই site-ই একই root `firebase-config.js` এবং `styles.css` ব্যবহার করে। Deploy করার সময় এই দুই shared file-ও প্রতিটি site-এর root-এ রাখুন এবং app import path ঠিক রাখুন। সহজ local test-এর জন্য project root-এ static server চালিয়ে `/user/` ও `/admin/` খুলুন।

## 4) Payment workflow
Customer Gmail login করবে > panel বাছবে > duration/custom amount দেবে > Nagad 01946730203-এ Send Money করবে > TRX ID submit করবে। Order pending থাকবে। Admin Nagad app/statement থেকে টাকা নিজে যাচাই করে Approve করবেন এবং delivery link/password দেবেন। Approve হলেই User-এর My Orders-এ দেখা যাবে।

## 5) Important
- এটি manual payment workflow; Nagad-এর সঙ্গে কোনো automatic payment API যুক্ত নয়।
- Customer-এর দেওয়া Transaction ID নিজে নিজে payment প্রমাণ করে না। Admin অবশ্যই নিজের Nagad account-এ টাকা পেয়েছেন কি না যাচাই করবেন।
- Custom amount customer নিজে দিতে পারছে—এটি ইচ্ছাকৃত হলে রাখুন। নির্দিষ্ট মূল্য বাধ্যতামূলক করতে custom amount field সরিয়ে দিন অথবা admin নির্ধারিত fixed package ব্যবহার করুন।
- Google Sign-in popup কিছু mobile browser-এ বাধা পেতে পারে; তখন Firebase Auth-এর redirect flow ব্যবহার করতে হবে।
- Live website-এ নেওয়ার আগে test project-এ order, rules, image upload এবং admin approval পরীক্ষা করুন।
