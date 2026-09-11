const API_URL = "http://localhost:5000/api/organization";
// ================= GET MEMBERS =================
export const getMembers = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/members`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch members");
  }

  return data;
};
// ================= ADD MEMBER =================
export const addMember = async (memberData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memberData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add member");
  }

  return data;
};

// ================= DELETE MEMBER =================

export const deleteMember = async (memberId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/members/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete member");
  }

  return data;
};

// ================= SEND INVITATION =================

export const sendInvitation = async (invitationData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invitationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send invitation");
  }

  return data;
};
