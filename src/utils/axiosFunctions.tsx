import axios, { AxiosInstance } from "axios";
const BaseURL = process.env.NEXT_PUBLIC_BASE_URL;

const api: AxiosInstance = axios.create();

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("authStore");
    const accessToken = user ? JSON.parse(user).state.accessToken : null;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = localStorage.getItem("authStore");
      const refresh = user ? JSON.parse(user).state.refreshToken : null;
      if (refresh) {
        try {
          const response = await axios.post(`${BaseURL}/users/refresh/`, {
            refresh,
          });
          console.log(response);
          const newAccessToken = response.data.access;
          localStorage.getItem("authStore");
          const user = JSON.parse(localStorage.getItem("authStore") || "");
          user.state.accessToken = newAccessToken;
          localStorage.setItem("authStore", JSON.stringify(user));
          return axios(originalRequest);
        } catch (error) {
          // Handle token refresh failure
          // mostly logout the user and re-authenticate by login again
        }
      }
    }
    return Promise.reject(error);
  }
);

export const postRequest = async (url: string, body: any, params?:{}) => {
  try {
    const response = await api.post(url, body, { params });

    if (response.status === 200 || 201) {
      return response.data;
    } else {
      throw new Error(response.data.detail);
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("An unknown Error occurred while processing the request");
    }
  }
};

export const getRequest = async (url: string, params?: {}) => {
  try {
    const response = await api.get(url, { params });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.detail);
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("An unknown Error occurred while processing the request");
    }
  }
};

export const patchRequest = async (
  url: string,
  body: any,
  accessToken?: string | null
) => {
  try {
    if (accessToken)
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    const response = await api.patch(url, body);

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.detail);
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw new Error("An unknown Error occurred while processing the request");
    }
  }
};
