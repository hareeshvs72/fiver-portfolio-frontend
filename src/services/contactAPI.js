import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API;
console.log(BASE_URL);

export const sendContactAPI = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/contact`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};