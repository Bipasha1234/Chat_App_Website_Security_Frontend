import axios from "axios";

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("https://localhost:4000/api/csrf-token", {
      withCredentials: true,
    });

    const token = response.data.csrfToken;
    axios.defaults.headers.post["X-CSRF-Token"] = token;
    axios.defaults.headers.put["X-CSRF-Token"] = token;
    axios.defaults.headers.delete["X-CSRF-Token"] = token;
    console.log("CSRF token set.");
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
  }
};
