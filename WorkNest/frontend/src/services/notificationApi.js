import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotifications = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axios.get(
    `${API_URL}/unread-count`,
    getAuthConfig()
  );
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    getAuthConfig()
  );
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.patch(
    `${API_URL}/read-all`,
    {},
    getAuthConfig()
  );
  return response.data;
};