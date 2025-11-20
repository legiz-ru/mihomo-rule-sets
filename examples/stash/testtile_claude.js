// Claude.com availability tile
// Логика:
//  - проверяем главную страницу claude.com
//  - если попадаем на app-unavailable-in-region => регион не поддерживается
//  - локацию берём из https://claude.ai/cdn-cgi/trace (loc=XX)

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

// Получаем локейшн (двухбуквенный код) из Cloudflare-trace
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

  // формат строки: loc=FR
  const match = String(data).match(/loc=([A-Z]{2})/);
  return match ? match[1] : null;
}

async function main() {
  // Параллельно тянем доступность сайта и локацию
  const [siteRes, loc] = await Promise.all([
    request("GET", {
      url: "https://claude.com/",
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 8,
    }),
    getLocation(),
  ]);

  const { error, response, data } = siteRes;

  const location = loc || "??";

  if (error || !response) {
    $done({
      content: `Network Error (${location})`,
      backgroundColor: "",
    });
    return;
  }

  const status = response.status || response.statusCode || 0;
  const body = String(data || "").toLowerCase();

  // Признаки "регион не поддерживается"
  let unavailable = false;

  if (status === 403) {
    unavailable = true;
  }

  if (
    body.includes("app-unavailable-in-region") ||
    body.includes("unavailable in your region") ||
    body.includes("not available in your region")
  ) {
    unavailable = true;
  }

  // 2xx–3xx и нет признаков бана => Available
  if (status >= 200 && status < 400 && !unavailable) {
    $done({
      content: `Available (${location})`,
      backgroundColor: "#88A788", // как у ChatGPT
    });
    return;
  }

  if (unavailable) {
    $done({
      content: `Unavailable (${location})`,
      backgroundColor: "",
    });
    return;
  }

  // Любой другой странный случай
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
