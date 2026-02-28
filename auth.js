const API_URL = "https://script.google.com/macros/s/AKfycbybI3JKrj4UeeZgPfK_ekId-poUfP58tD6DrMp6M9LZXUx-tELzGpu0ff4LQQt6XDPy5w/exec";

/* ================= PROTECT PAGE ================= */
async function protectPage(requiredRole){

  const token = localStorage.getItem("token");

  if(!token){
    window.location = "index.html";
    return;
  }

  const form = new FormData();
  form.append("action","check");
  form.append("token",token);

  /* ⛔ penting: tambah timestamp supaya tidak di-cache */
  form.append("_ts", Date.now());

  let res;
  try{
    res = await fetch(API_URL,{
      method:"POST",
      body:form,

      /* ⛔ WAJIB untuk Apps Script */
      cache:"no-store",

      /* ⛔ cegah reuse koneksi lama */
      headers:{
        "Pragma":"no-cache",
        "Cache-Control":"no-cache"
      }
    });
  }catch(err){
    console.error("Network error", err);
    alert("Koneksi gagal. Coba refresh.");
    return;
  }

  const data = await res.json();

  if(!data.status){
    localStorage.clear();
    sessionStorage.clear();
    window.location = "index.html";
    return;
  }

  /* ================= ROLE CHECK ================= */
  if(requiredRole && data.user.role !== requiredRole){
    alert("Tidak punya akses!");
    window.location = "index.html";
    return;
  }

  /* ================= TAMPILKAN USER ================= */
  const el = document.getElementById("loginUser");
  if(el) el.innerText = data.user.nama;
}


/* ================= LOGOUT ================= */
async function logout(){

  const token = localStorage.getItem("token");

  if(token){
    const form = new FormData();
    form.append("action","logout");
    form.append("token",token);
    form.append("_ts", Date.now()); // anti cache

    await fetch(API_URL,{
      method:"POST",
      body:form,
      cache:"no-store",
      headers:{
        "Pragma":"no-cache",
        "Cache-Control":"no-cache"
      }
    });
  }

  localStorage.clear();
  sessionStorage.clear();

  window.location.replace("index.html");
}