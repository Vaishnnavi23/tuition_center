// Fill these in from your Supabase project: Settings > API
const SUPABASE_URL = "https://ltrquybbjeabtufkxbym.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_NXOAbOdanfZGaRiN5peblg_i-UUV6K_";

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Users only ever see/type a phone number. Behind the scenes we turn that
// phone number into a fake internal email address, because Supabase's
// free email+password auth is far more reliable than phone+SMS auth
// (which needs a paid SMS provider). The ".local" domain is never
// actually emailed, it's just used as a unique login ID internally.
function phoneToEmail(phone) {
  const clean = String(phone).replace(/[^0-9]/g, "");
  return `${clean}@tuitioncenter.local`;
}

// Redirects to login if not authenticated. Returns {user, profile}.
async function requireAuth(allowedRole) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { window.location.href = "/index.html"; return null; }

  const { data: profile, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) { window.location.href = "/index.html"; return null; }
  if (allowedRole && profile.role !== allowedRole) {
    window.location.href = `/${profile.role}.html`;
    return null;
  }
  return { user: session.user, profile };
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = "/index.html";
}

