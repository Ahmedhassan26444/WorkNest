const API_URL = "http://localhost:5000/api";

// ================= GET ALL PROJECTS =================

export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
};

// ================= GET SINGLE PROJECT =================

export const getProject = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch project");
  }

  return data;
};

// ================= CREATE PROJECT =================

export const createProject = async (projectData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
};

// ================= UPDATE PROJECT =================

export const updateProject = async (id, projectData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
};

// ================= DELETE PROJECT =================

export const deleteProject = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
};

// ================= SEARCH PROJECTS =================

export const searchProjects = async (query) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/projects/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to search projects");
  }

  return data;
};