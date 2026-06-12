(function () {
  "use strict";

  const cfg = () => window.CFAI.Config;
  const auth = () => window.CFAI.Auth;

  async function api(path, init) {
    const url = cfg().apiUrl(path.startsWith("/") ? path : "/" + path);
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...auth().authHeader(),
      ...(auth().appHeader ? auth().appHeader() : {}),
      ...(init && init.headers ? init.headers : {}),
    };
    const res = await fetch(url, { ...init, headers });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { raw: text }; }
    if (!res.ok || data.ok === false) {
      const msg = data.error || data.hint || res.statusText || "Error HTTP " + res.status;
      throw new Error(msg);
    }
    return data;
  }

  window.CFAI = window.CFAI || {};
  window.CFAI.Api = {
    info: () => api("/api/cf-ai", { method: "GET", headers: { "Content-Type": undefined } }),
    helloGet: () => api("/api/cf-ai/hello", { method: "GET", headers: { "Content-Type": undefined } }),
    helloPost: (body) => api("/api/cf-ai/hello", { method: "POST", body: JSON.stringify(body || {}) }),
    toolsCatalog: () => api("/api/cf-ai/tools", { method: "GET", headers: { "Content-Type": undefined } }),
    modelCatalog: () => api("/api/cf-ai/catalog", { method: "GET", headers: { "Content-Type": undefined } }),
    promptComplete: (body) => api("/api/cf-ai/tools/prompt/complete", { method: "POST", body: JSON.stringify(body) }),
    textResponses: (body) => api("/api/cf-ai/tools/text/responses", { method: "POST", body: JSON.stringify(body) }),
    textEmbeddings: (body) => api("/api/cf-ai/tools/text/embeddings", { method: "POST", body: JSON.stringify(body) }),
  };
})();
