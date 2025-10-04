export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token_exp");
}

export function logout(redirectTo: string = "/login") {
  clearAuth();
  window.location.href = redirectTo;
}

export function isExpired(): boolean {
  const expStr = localStorage.getItem("token_exp");
  const exp = expStr ? Number(expStr) : NaN;
  if (!Number.isFinite(exp)) return false;
  return Date.now() >= exp * 1000;
}

export function scheduleAutoLogout() {
  const expStr = localStorage.getItem("token_exp");
  const exp = expStr ? Number(expStr) : NaN;
  if (!Number.isFinite(exp)) return;

  const ms = exp * 1000 - Date.now();
  if (ms <= 0) {
    logout();
    return;
  }
  setTimeout(() => logout(), ms);
}
