export const Logout = async () => {
  const res = await fetch(
    "http://localhost:4000/api/auth/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};