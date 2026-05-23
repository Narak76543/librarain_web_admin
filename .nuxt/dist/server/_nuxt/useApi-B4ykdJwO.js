const useApi = () => {
  const baseUrl = "http://192.168.1.19:8000";
  const getToken = () => {
    return null;
  };
  const getRefreshToken = () => {
    return null;
  };
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await $fetch(`${baseUrl}/api/v1/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refreshToken }
      });
      if (!res?.ok || !res?.data?.accessToken) return false;
      localStorage.setItem("access_token", res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem("refresh_token", res.data.refreshToken);
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  const authHeaders = () => {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json"
    };
    if (token && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };
  const request = async (path, options, canRetry = true) => {
    try {
      return await $fetch(`${baseUrl}${path}`, options);
    } catch (error) {
      const status = error?.status || error?.statusCode || error?.response?.status;
      if (status !== 401 || !canRetry) throw error;
      const didRefresh = await refreshAccessToken();
      if (!didRefresh) {
        throw error;
      }
      const token = getToken();
      const retryHeaders = { ...options.headers };
      if (token && token !== "null") {
        retryHeaders["Authorization"] = `Bearer ${token}`;
      }
      return await request(
        path,
        {
          ...options,
          headers: retryHeaders
        },
        false
      );
    }
  };
  const get = async (path) => {
    return await request(path, {
      method: "GET",
      headers: authHeaders()
    });
  };
  const post = async (path, body) => {
    return await request(path, {
      method: "POST",
      headers: authHeaders(),
      body
    });
  };
  const put = async (path, body) => {
    return await request(path, {
      method: "PUT",
      headers: authHeaders(),
      body
    });
  };
  const postForm = async (path, formData) => {
    const token = getToken();
    const headers = {};
    if (token && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return await request(path, {
      method: "POST",
      headers,
      body: formData
    });
  };
  const del = async (path) => {
    return await request(path, {
      method: "DELETE",
      headers: authHeaders()
    });
  };
  return { get, post, put, postForm, del };
};
export {
  useApi as u
};
//# sourceMappingURL=useApi-B4ykdJwO.js.map
