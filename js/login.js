document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById("error-msg");
  errorMsg.textContent = "";

  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const email = phoneToEmail(phone); // hidden internal email, generated from phone

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    errorMsg.textContent = "Incorrect phone number or password.";
    return;
  }

  const { data: profile, error: pErr } = await sb
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (pErr || !profile) { errorMsg.textContent = "No profile found for this account. Contact admin."; return; }

  window.location.href = `/${profile.role}.html`;
});
