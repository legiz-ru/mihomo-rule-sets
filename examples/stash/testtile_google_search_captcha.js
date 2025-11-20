// Google Search Captcha check (ipregion-style)

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
    url: "https://www.google.com/search?q=ipregion&hl=en",
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
  const body = (data || "").toLowerCase();

  // Признаки капчи / sorry-страницы (как в ipregion)
  const isCaptcha =
    status === 429 ||
    body.includes("unusual traffic from your computer network") ||
    body.includes("/sorry/index") ||
    body.includes("to continue, please type the characters") ||
    body.includes("support.google.com/websearch/answer/86640");

  if (isCaptcha) {
    $done({
      content: "Captcha",
      backgroundColor: "",
    });
    return;
  }

  if (status >= 200 && status < 400) {
    $done({
      content: "No Captcha",
      backgroundColor: "#88A788",
    });
    return;
  }

  $done({
    content: `Error (HTTP ${status})`,
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
