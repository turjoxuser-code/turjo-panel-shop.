// Firebase compat SDK is loaded by the HTML pages.
const ADMIN_UIDS = ["q4KLDTHkCdbtTfyIQO1vOtdvkDi2"]; // Must match firestore.rules
const $ = id => document.getElementById(id);
const money = n => "৳" + Number(n || 0).toLocaleString("en-BD");
const safe = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isAdmin = user => !!user && ADMIN_UIDS.includes(user.uid);
const msg = (id, text, bad=false) => { if($(id)){ $(id).textContent=text; $(id).style.color=bad?"#b91c1c":"#15803d"; } };

async function registerUser(email,password){
  const cred=await auth.createUserWithEmailAndPassword(email,password);
  await cred.user.sendEmailVerification();
  return cred;
}
async function loginUser(email,password){ return auth.signInWithEmailAndPassword(email,password); }

async function renderProducts(category="ALL"){
  const grid=$("products"); if(!grid)return;
  grid.innerHTML='<div class="empty">Loading panels…</div>';
  try{
    let q=db.collection("products").where("active","==",true);
    if(category!=="ALL") q=q.where("category","==",category);
    const snap=await q.get();
    if(snap.empty){grid.innerHTML='<div class="empty">No panels available in this category yet.</div>';return;}
    grid.innerHTML=snap.docs.map(doc=>{
      const p=doc.data();
      return `<article class="card">
        <img class="product-img" src="${safe(p.imageUrl||"https://placehold.co/700x400/fce7f3/be185d?text=TURJO+PANEL")}" alt="${safe(p.name)}">
        <div class="card-body"><span class="pill">${safe(p.category)}</span>
        <h3>${safe(p.name)}</h3><p class="muted">${safe(p.description||"")}</p>
        <div class="price">${money(p.price)}</div>
        <button class="btn" onclick="buyPanel('${doc.id}')">Buy Now</button></div></article>`;
    }).join("");
  }catch(e){grid.innerHTML='<div class="empty">Could not load products. Check Firebase setup and Firestore rules.</div>';console.error(e);}
}
async function buyPanel(productId){
  if(!auth.currentUser){location.href="login.html?next=checkout.html%3Fproduct%3D"+encodeURIComponent(productId);return;}
  location.href="checkout.html?product="+encodeURIComponent(productId);
}
async function loadMyOrders(){
  const host=$("myOrders");if(!host||!auth.currentUser)return;
  host.innerHTML='<div class="empty">Loading orders…</div>';
  const snap=await db.collection("orders").where("userId","==",auth.currentUser.uid).orderBy("createdAt","desc").get();
  if(snap.empty){host.innerHTML='<div class="empty">You have no orders yet.</div>';return;}
  host.innerHTML=snap.docs.map(d=>{
    const o=d.data(), status=(o.status||"pending").toLowerCase();
    return `<div class="order"><h3>${safe(o.productName)}</h3>
    <p>${safe(o.durationLabel)} · ${money(o.amount)} · <span class="status ${safe(status)}">${safe(status.toUpperCase())}</span></p>
    <p class="small">Order: ${safe(d.id)} · TRX: ${safe(o.trxId||"Not submitted")}</p>
    ${status==="approved"?`<div class="notice"><b>Access details</b><br>Username: ${safe(o.accessUsername||"—")}<br>Password: ${safe(o.accessPassword||"—")}<br><a href="${safe(o.accessLink||"#")}" target="_blank" rel="noopener">Open access link</a></div>`:""}
    ${o.adminNote?`<p class="small">Admin note: ${safe(o.adminNote)}</p>`:""}</div>`;
  }).join("");
}

window.addEventListener("DOMContentLoaded",()=>{
  const page=document.body.dataset.page;
  if(page==="home"){
    document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>renderProducts(b.dataset.category)));
    renderProducts();
    auth.onAuthStateChanged(u=>{const el=$("accountLink");if(el)el.textContent=u?"My Orders":"Login";if(el)el.href=u?"orders.html":"login.html";});
  }
  if(page==="login"){
    $("loginForm")?.addEventListener("submit",async e=>{e.preventDefault();try{await loginUser($("email").value.trim(),$("password").value);location.href=new URLSearchParams(location.search).get("next")||"index.html";}catch(err){msg("message",err.message,true);}});
    $("registerForm")?.addEventListener("submit",async e=>{e.preventDefault();try{await registerUser($("regEmail").value.trim(),$("regPassword").value);msg("regMessage","Account created. Verify your email, then log in.");}catch(err){msg("regMessage",err.message,true);}});
  }
  if(page==="checkout"){
    auth.onAuthStateChanged(async u=>{
      if(!u){location.href="login.html?next="+encodeURIComponent(location.href);return;}
      if(!u.emailVerified){$("checkoutContent").innerHTML='<div class="notice">Please verify your email before ordering. Check your inbox, then sign in again.</div>';return;}
      const id=new URLSearchParams(location.search).get("product");
      if(!id){$("checkoutContent").textContent="No product selected.";return;}
      try{
        const doc=await db.collection("products").doc(id).get();if(!doc.exists||!doc.data().active){$("checkoutContent").textContent="This panel is unavailable.";return;}
        const p=doc.data();$("productName").textContent=p.name;$("productPrice").textContent=money(p.price);
        $("paymentNumber").textContent=p.paymentNumber||"01946730203";
        $("placeOrder").onclick=async()=>{
          const duration=$("duration").value, custom=Number($("customAmount").value);
          const amount=duration==="custom"?custom:Number(duration);
          if(!Number.isFinite(amount)||amount<=0){msg("checkoutMessage","Enter a valid amount.",true);return;}
          const trx=$("trxId").value.trim();
          if(!trx){msg("checkoutMessage","Enter your Nagad Transaction ID.",true);return;}
          $("placeOrder").disabled=true;
          try{
            await db.collection("orders").add({userId:u.uid,userEmail:u.email,productId:id,productName:p.name,category:p.category,durationLabel:duration==="custom"?"Custom amount":(duration==="15"?"1 Hour":duration==="30"?"2 Hours":"Custom"),amount,trxId:trx,status:"pending",createdAt:firebase.firestore.FieldValue.serverTimestamp()});
            $("checkoutContent").innerHTML='<div class="notice"><b>Order submitted!</b><br>Your payment is waiting for admin verification. You can follow the status from My Orders.</div>';
          }catch(err){msg("checkoutMessage",err.message,true);$("placeOrder").disabled=false;}
        };
      }catch(err){$("checkoutContent").textContent="Could not load checkout: "+err.message;}
    });
  }
  if(page==="orders")auth.onAuthStateChanged(u=>{if(!u){location.href="login.html";return;}loadMyOrders();});
  if(page==="admin")initAdmin();
});

async function initAdmin(){
  auth.onAuthStateChanged(async u=>{
    if(!u){$("adminArea").classList.add("hidden");$("adminLogin").classList.remove("hidden");return;}
    if(!isAdmin(u)){await auth.signOut();msg("adminMessage","This account is not on the admin allowlist.",true);return;}
    $("adminLogin").classList.add("hidden");$("adminArea").classList.remove("hidden");
    loadAdminProducts();loadAdminOrders();
  });
  $("adminLoginForm")?.addEventListener("submit",async e=>{e.preventDefault();try{await loginUser($("adminEmail").value.trim(),$("adminPassword").value);}catch(err){msg("adminMessage",err.message,true);}});
  $("logout")?.addEventListener("click",()=>auth.signOut());
  $("productForm")?.addEventListener("submit",async e=>{
    e.preventDefault();const btn=$("saveProduct");btn.disabled=true;
    try{
      const name=$("pName").value.trim(),category=$("pCategory").value,price=Number($("pPrice").value);
      if(!name||!Number.isFinite(price)||price<=0)throw new Error("Enter a product name and valid price.");
      let imageUrl=$("pImageUrl").value.trim();
      const file=$("pImage").files[0];
      if(file){const ref=storage.ref("product-images/"+Date.now()+"_"+file.name.replace(/[^a-zA-Z0-9._-]/g,"_"));const result=await ref.put(file);imageUrl=await result.ref.getDownloadURL();}
      const payload={name,category,price,description:$("pDescription").value.trim(),imageUrl,paymentNumber:$("pPaymentNumber").value.trim()||"01946730203",active:$("pActive").checked,updatedAt:firebase.firestore.FieldValue.serverTimestamp()};
      await db.collection("products").add(payload);$("productForm").reset();msg("productMessage","Panel added to the user website.");loadAdminProducts();
    }catch(err){msg("productMessage",err.message,true);}finally{btn.disabled=false;}
  });
}
async function loadAdminProducts(){
  const host=$("adminProducts");if(!host)return;const snap=await db.collection("products").orderBy("updatedAt","desc").get();
  host.innerHTML=snap.empty?'<p class="empty">No products yet.</p>':snap.docs.map(d=>{const p=d.data();return `<div class="order"><b>${safe(p.name)}</b> · ${safe(p.category)} · ${money(p.price)} · ${p.active?"Active":"Hidden"}<div class="actions"><button class="btn alt" onclick="toggleProduct('${d.id}',${!p.active})">${p.active?"Hide":"Show"}</button><button class="btn danger" onclick="deleteProduct('${d.id}')">Delete</button></div></div>`;}).join("");
}
async function toggleProduct(id,active){await db.collection("products").doc(id).update({active,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});loadAdminProducts();}
async function deleteProduct(id){if(confirm("Delete this product?")){await db.collection("products").doc(id).delete();loadAdminProducts();}}
async function loadAdminOrders(){
  const host=$("adminOrders");if(!host)return;const snap=await db.collection("orders").orderBy("createdAt","desc").get();
  host.innerHTML=snap.empty?'<p class="empty">No orders yet.</p>':snap.docs.map(d=>{const o=d.data();return `<div class="order"><h3>${safe(o.productName)} · ${money(o.amount)}</h3><p class="small">Order ${safe(d.id)} · ${safe(o.userEmail)} · ${safe(o.category)} · TRX: <b>${safe(o.trxId)}</b></p><p>Status: <b>${safe(o.status)}</b></p><label>Access username / code</label><input id="user_${d.id}" value="${safe(o.accessUsername||"")}" placeholder="Username or access code"><label>Access password</label><input id="pass_${d.id}" value="${safe(o.accessPassword||"")}" placeholder="Password"><label>Access URL (https://...)</label><input id="link_${d.id}" value="${safe(o.accessLink||"")}" placeholder="https://"><label>Admin note</label><input id="note_${d.id}" value="${safe(o.adminNote||"")}" placeholder="Optional note"><div class="actions"><button class="btn" onclick="approveOrder('${d.id}')">Approve & deliver</button><button class="btn danger" onclick="rejectOrder('${d.id}')">Reject</button></div></div>`;}).join("");
}
async function approveOrder(id){
  const link=$("link_"+id).value.trim();
  if(link&&!/^https:\/\/\S+/i.test(link)){alert("Access URL must start with https://");return;}
  await db.collection("orders").doc(id).update({status:"approved",accessUsername:$("user_"+id).value.trim(),accessPassword:$("pass_"+id).value,accessLink:link,adminNote:$("note_"+id).value.trim(),approvedAt:firebase.firestore.FieldValue.serverTimestamp()});
  loadAdminOrders();
}
async function rejectOrder(id){await db.collection("orders").doc(id).update({status:"rejected",adminNote:$("note_"+id).value.trim()});loadAdminOrders();}
