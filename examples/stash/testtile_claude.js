// Claude.com availability tile (fixed version)
// Логика:
// 1) GET https://claude.com/ c auto-redirect: false
// 2) Если Location -> /app-unavailable-in-region => Unavailable
// 3) Иначе, 2xx–3xx => Available
// 4) Локация из https://claude.ai/cdn-cgi/trace (loc=XX)

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

  const match = String(data).match(/loc=([A-Z]{2})/);
  return match ? match[1] : null;
}

function getLocationHeader(headers) {
  if (!headers) return null;
  let loc = null;
  for (const k in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, k)) {
      if (k.toLowerCase() === "location") {
        loc = headers[k];
        break;
      }
    }
  }
  return loc;
}

async function main() {
  const [siteRes, loc] = await Promise.all([
    request("GET", {
      url: "https://claude.com/",
      headers: {
        "User-Agent": UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 8,
      // ВАЖНО: чтобы поймать редирект на app-unavailable-in-region
      "auto-redirect": false,
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
  const headers = response.headers || {};
  const locationHeader = getLocationHeader(headers);
  const body = String(data || "").toLowerCase();

  let unavailable = false;

  // 1) Явный редирект на app-unavailable-in-region
  if (
    (status === 301 ||
      status === 302 ||
      status === 303 ||
      status === 307 ||
      status === 308) &&
    locationHeader &&
    locationHeader.includes("app-unavailable-in-region")
  ) {
    unavailable = true;
  }

  // 2) На всякий случай — если по какой-то причине попали сразу на страницу
  if (
    body.includes("app-unavailable-in-region") ||
    body.includes("unavailable in your region") ||
    body.includes("not available in your region")
  ) {
    unavailable = true;
  }

  // 3) Жёсткий ban по коду
  if (status === 403) {
    unavailable = true;
  }

  if (unavailable) {
    $done({
      content: `Unavailable (${location})`,
      backgroundColor: "",
    });
    return;
  }

  // 4) Всё, что 2xx–3xx без признаков бана — считаем доступным
  if (status >= 200 && status < 400) {
    $done({
      content: `Available (${location})`,
      backgroundColor: "#88A788", // как у ChatGPT tiles
    });
    return;
  }

  // Иные случаи — просто ошибка по HTTP
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
