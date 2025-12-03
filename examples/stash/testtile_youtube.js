// YouTube base availability + Google Global Cache instance

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

async function checkYouTubeBase() {
  const { error, response } = await request("GET", {
    url: "https://www.youtube.com/generate_204",
    headers: {
      "User-Agent": UA,
      "Accept": "*/*",
    },
    timeout: 6,
  });

  if (error || !response) {
    return { ok: false, reason: "network" };
  }

  const status = response.status || response.statusCode || 0;
  return {
    ok: status >= 200 && status < 400,
    status,
  };
}

// Google Global Cache instance
async function checkGGC() {
  const { error, response, data } = await request("GET", {
    url: "https://redirector.googlevideo.com/report_mapping?di=no",
    headers: {
      "User-Agent": UA,
      "Accept": "text/plain,*/*;q=0.8",
    },
    timeout: 8,
  });

  if (error || !data) return null;

  // ищем первый хост *.googlevideo.com
  const match = data.match(/([a-z0-9\-]+\.googlevideo\.com)/i);
  if (!match) return null;
  return match[1];
}

async function main() {
  const [base, ggc] = await Promise.all([checkYouTubeBase(), checkGGC()]);

  if (!base.ok && !ggc) {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  const lines = [];

  if (base.ok) {
    lines.push("YouTube: ✅");
  } else {
    const s = base.status ? ` (HTTP ${base.status})` : "";
    lines.push(`YouTube: ❌${s}`);
  }

  if (ggc) {
    lines.push(`GGC: ${ggc}`);
  }

  // стиль как на скрине — оранжевый, когда YouTube доступен
  const backgroundColor = base.ok ? "#FF9F0A" : "";

  $done({
    content: lines.join("\n"),
    backgroundColor,
  });
}

(async () => {
  main()
    .then(() => {})
    .catch(() => {
      $done({});
    });
})();
