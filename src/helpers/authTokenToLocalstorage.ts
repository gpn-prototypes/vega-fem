export function authHeader() {
  let token = localStorage.getItem('token') || '';
  if (!token) {
    localStorage.setItem(
      'token',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYTExMTExMjNiMTExYzExMWQxMTFlMDAwMDAwMDAwMDAifQ.ugIJES0Ruu9cf5aA6hBPP1MLV1FfyaBV5ISq6EcCPKs',
    );
    token = localStorage.getItem('token') || '';
  }

  return { Authorization: token };
}
