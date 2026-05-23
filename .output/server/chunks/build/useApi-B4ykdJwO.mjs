const useApi = () => {
  const baseUrl = "http://192.168.1.19:8000";
  const refreshAccessToken = async () => {
    return false;
  };
  const authHeaders = () => {
    const headers = {
      "Content-Type": "application/json"
    };
    return headers;
  };
  const request = async (path, options, canRetry = true) => {
    var _a;
    try {
      return await $fetch(`${baseUrl}${path}`, options);
    } catch (error) {
      const status = (error == null ? void 0 : error.status) || (error == null ? void 0 : error.statusCode) || ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.status);
      if (status !== 401 || !canRetry) throw error;
      const didRefresh = await refreshAccessToken();
      if (!didRefresh) {
        throw error;
      }
      const retryHeaders = { ...options.headers };
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
    const headers = {};
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

export { useApi as u };
//# sourceMappingURL=useApi-B4ykdJwO.mjs.map
