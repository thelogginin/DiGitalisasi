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

  const res = await fetch(API_URL,{
    method:"POST",
    body:form
  });

  const data = await res.json();

  if(!data.status){
    localStorage.clear();
    window.location = "index.html";
    return;
  }

  if(requiredRole){

  const allowed = Array.isArray(requiredRole)
    ? requiredRole.map(r=>r.toUpperCase())
    : [String(requiredRole).toUpperCase()];

  if(!allowed.includes(String(data.user.role).toUpperCase())){
    alert("Tidak punya akses");
    window.location = "index.html";
    return;
  }
}

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

    await fetch(API_URL,{
      method:"POST",
      body:form
    });
  }

  localStorage.clear();
  window.location = "index.html";
}
