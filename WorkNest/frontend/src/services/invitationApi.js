const API_URL = "http://localhost:5000/api/organization";
// ================= ACCEPT INVITATION =================
export const acceptInvitation = async (token, name, password) => {
  const response = await fetch(`${API_URL}/invitations/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      name,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to accept invitation");
  }

  return data;
};
