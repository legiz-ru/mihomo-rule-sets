// Claude availability tile (claude.ai-based)
// Определяет:
//  - Available (FR)
//  - Unavailable (RU)
//  - Error / Network Error
//
// Локация: https://claude.ai/cdn-cgi/trace (loc=XX)
// Доступность: содержание https://claude.ai/

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

// Получаем loc=XX из Cloudflare trace
async function getLocation() {
  const { error, data } = await request("GET", {
    url: "https://claude.ai/cdn-cgi/trace",
    headers: {
      "User-Agent": UA,
      Accept: "text/plain,*/*;q=0.8",
    },
    timeout: 6,
  });

  if (error || !data) return null;
  const m = String(data).match(/loc=([A-Z]{2})/);
  return m ? m[1] : null;
}

async function main() {
  const [siteRes, loc] = await Promise.all([
    request("GET", {
      url: "https://claude.ai/",
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 8,
      // тут можно позволить авто-редиректы: если регион заблокирован,
      // нас просто приведёт на страницу "App unavailable in region"
      "auto-redirect": true,
    }),
    getLocation(),
  ]);

  const location = loc || "??";
  const { error, response, data } = siteRes;

  if (error || !response) {
    $done({
      content: `Network Error (${location})`,
      backgroundColor: "",
    });
    return;
  }

  const status = response.status || response.statusCode || 0;
  const body = String(data || "").toLowerCase();

  // Признаки страницы "App unavailable in region"
  // (title + meta/текст из самой страницы)
  const isUnavailablePage =
    body.includes("app unavailable in region") ||
    body.includes("unfortunately, claude isn&apos;t available here.") ||
    body.includes("unfortunately, claude isn't available here.") ||
    body.includes("/app-unavailable-in-region");

  // Любой явный запрет / страница "unavailable in region"
  if (status === 403 || isUnavailablePage) {
    $done({
      content: `Unavailable (${location})`,
      backgroundColor: "",
    });
    return;
  }

  // 2xx–3xx без признаков "unavailable" считаем доступным
  if (status >= 200 && status < 400) {
    $done({
      content: `Available (${location})`,
      backgroundColor: "#88A788", // зелёный, как ChatGPT tiles
    });
    return;
  }

  // Всё остальное считаем ошибкой
  $done({
    content: `Error (HTTP ${status}) (${location})`,
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
