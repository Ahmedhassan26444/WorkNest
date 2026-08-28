const API_URL = "http://localhost:5000/api";

export const getAnalytics = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/analytics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch analytics");
  }

  return data;
};