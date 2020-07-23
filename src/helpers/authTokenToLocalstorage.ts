export function authHeader() {
  let token = localStorage.getItem('token') || '';
  if (!token) {
    localStorage.setItem(
      'token',
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoidGVzdEBncG4ucnUiLCJ1c2VyX2lkIjoiNWYxMTVlNzczYzFkYjUwYWM3YWJlNDdlIn0.lR_Axb6IeKuGaurvx5Zj6ZLDF21GzV2bXZHCJnTBdbM',
    );
    token = localStorage.getItem('token') || '';
  }

  return { Authorization: token };
}
