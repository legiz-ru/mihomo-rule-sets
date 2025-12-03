// TikTok availability check (ipregion-style)

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

async function request(method, params) {
  return new Promise((resolve) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const { error, response, data } = await request("GET", {
    url: "https://www.tiktok.com/",
    headers: {
      "User-Agent": UA,
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    timeout: 8,
  });

  if (error || !response) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  const status = response.status || response.statusCode || 0;
  const body = (data || "").toLowerCase();

  const blockedText =
    body.includes("service is currently unavailable in your region") ||
    body.includes("tiktok is not available in your country") ||
    body.includes("tiktok is unavailable in your country") ||
    body.includes("not available in your region");

  if (status >= 200 && status < 400 && !blockedText) {
    $done({
      content: "Available",
      backgroundColor: "#88A788",
    });
    return;
  }

  if (blockedText) {
    $done({
      content: "Blocked by Region",
      backgroundColor: "",
    });
    return;
  }

  $done({
    content: `Not Available (HTTP ${status})`,
    backgroundColor: "",
  });
}

(async () => {
  main()
    .then(() => {})
    .catch(() => {
      $done({});
    });
})();
