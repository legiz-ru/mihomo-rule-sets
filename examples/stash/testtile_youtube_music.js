// YouTube Music availability

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
    url: "https://music.youtube.com/?hl=en",
    headers: {
      "User-Agent": UA,
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
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
  if (status < 200 || status >= 400 || !data) {
    $done({
      content: `Not Available (HTTP ${status})`,
      backgroundColor: "",
    });
    return;
  }

  const notAvailableRe =
    /Music is not available in your country|Music isn't available in your country|not available in your country/i;
  const available = !notAvailableRe.test(data);

  $done({
    content: available ? "Available" : "Not Available",
    backgroundColor: available ? "#88A788" : "",
  });
}

(async () => {
  main()
    .then(() => {})
    .catch(() => {
      $done({});
    });
})();
