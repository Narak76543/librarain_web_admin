globalThis.__timing__.logStart('Load chunks/build/useApi-C-IOE6Or');const useApi = () => {
  const baseUrl = "http://192.168.0.198:8000";
  const getToken = () => {
    return null;
  };
  const refreshAccessToken = async () => {
    return false;
  };
  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json"
  });
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
      return await request(
        path,
        {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${getToken()}`
          }
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
    return await request(path, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
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

export { useApi as u };;globalThis.__timing__.logEnd('Load chunks/build/useApi-C-IOE6Or');
//# sourceMappingURL=useApi-C-IOE6Or.mjs.map
