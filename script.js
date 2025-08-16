// ---------- Supabase client in the requested structure ----------

const __env = (typeof window !== "undefined" && (window.__ENV || window.__ENV__)) || {};

const SUPABASE_URL = __env.SUPABASE_URL || "https://ogrlrsehfkarxxzhruie.supabase.co";
const SUPABASE_ANON_KEY = __env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncmxyc2VoZmthcnh4emhydWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzIyMjYsImV4cCI6MjA3MDkwODIyNn0.uPsYCm6KhGIkEC_ypYiUYtVmn0sBmC99serB8Jxq72g";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials.");
}


const supaClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const byId = (id) => /** @type {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|null} */(document.getElementById(id));
const getVal = (id) => (byId(id)?.value ?? "").trim();


function getCheckedValuesByName(name) {
  const nodes = document.querySelectorAll(`input[name="${name}"]`);
  const vals = [];
  nodes.forEach((n) => {
    if (n instanceof HTMLInputElement && n.type === "checkbox" && n.checked) {
      vals.push(n.value || true);
    }
  });
  return vals;
}


function getSelectedRadio(name) {
  const node = document.querySelector(`input[name="${name}"]:checked`);
  return node ? /** @type {HTMLInputElement} */(node).value : "";
}


function buildDbPayloadFromForm() {

  return {
    
    firstname:   getVal("firstName"),
    lastname:    getVal("lastName"),
    email:       getVal("email"),
    phone:       getVal("phone"),
    country:     getVal("country"),
    occupation:  getVal("occupation"),
    organization:getVal("organization"),
    linkedin:    getVal("linkedin"),
    interest:    getCheckedValuesByName("interest"), 
    experience:  getVal("experience"),
    motivation:  getVal("motivation"),
    newsletter:  getSelectedRadio("newsletter"),
    created_at:  new Date().toISOString(),
  };
}


document.querySelector("#registrationForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();



  const formData = buildDbPayloadFromForm();

 
  const { data, error } = await supaClient
    .from("registrations")
    .insert([formData]);

  if (error) {
    console.error("Insert error:", error);
    alert("Error submitting form");
    return;
  }

  alert("Form submitted successfully!");
  /** @type {HTMLFormElement} */(e.target).reset();


  const formEl = document.getElementById("registrationForm");
  const success = document.getElementById("successMessage");
  if (formEl && success) {
    formEl.style.display = "none";
    success.style.display = "block";
    success.scrollIntoView({ behavior: "smooth" });
  }
});


(async () => {
  try {
    const { error } = await supaClient
      .from("registrations")
      .select("count", { count: "exact", head: true });
    if (error) {
      console.warn("Connected to Supabase, but policy/schema may block access:", error.message);
    } else {
      console.log("Supabase connected. 'registrations' table accessible for head SELECT.");
    }
  } catch (err) {
    console.warn("Connectivity check failed:", err?.message || err);
  }
})();
