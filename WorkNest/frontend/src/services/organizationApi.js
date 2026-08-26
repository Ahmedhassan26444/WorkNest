const API_URL = "http://localhost:5000/api/organization";

// ================= GET ORGANIZATION MEMBERS =================

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
    throw new Error(
      data.message || "Failed to fetch members"
    );
  }

  return data;
};

// ================= ADD ORGANIZATION MEMBER =================

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
    throw new Error(
      data.message || "Failed to add member"
    );
  }

  return data;
};

// ================= DELETE ORGANIZATION MEMBER =================

export const deleteMember = async (memberId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete member"
    );
  }

  return data;
};