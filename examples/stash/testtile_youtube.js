// YouTube / YouTube Premium / YouTube Music availability tile
// Основано на логике ipregion.sh (YOUTUBE, YOUTUBE_PREMIUM, YOUTUBE_MUSIC)

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

// Базовая проверка доступности YouTube
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

// Проверка YouTube Premium + определение локации по данным YouTube
async function checkYouTubePremium() {
  const { error, response, data } = await request("GET", {
    url: "https://www.youtube.com/premium?hl=en",
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    timeout: 8,
  });

  if (error || !response) {
    return { ok: false, reason: "network" };
  }

  const status = response.status || response.statusCode || 0;
  if (status < 200 || status >= 400 || !data) {
    return { ok: false, status };
  }

  // Локация YouTube — как в ipregion: countryCode из страницы Premium
  let region = null;
  try {
    const matchCountry =
      data.match(/"countryCode"\s*:\s*"([A-Z]{2})"/) ||
      data.match(/"GL"\s*:\s*"([A-Z]{2})"/); // запасной вариант
    if (matchCountry) region = matchCountry[1];
  } catch (_) {}

  // Проверка доступности Premium
  // В английской версии, если нет, обычно есть текст "Premium is not available in your country"
  const notAvailableRe =
    /Premium is not available in your country|Premium isn't available in your country|not available in your country/i;
  const premiumAvailable = !notAvailableRe.test(data);

  return {
    ok: true,
    status,
    region,
    premiumAvailable,
  };
}

// Проверка YouTube Music
async function checkYouTubeMusic() {
  const { error, response, data } = await request("GET", {
    url: "https://music.youtube.com/?hl=en",
    headers: {
      "User-Agent": UA,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    timeout: 8,
  });

  if (error || !response) {
    return { ok: false, reason: "network" };
  }

  const status = response.status || response.statusCode || 0;
  if (status < 200 || status >= 400 || !data) {
    return { ok: false, status };
  }

  const notAvailableRe =
    /Music is not available in your country|Music isn't available in your country|not available in your country/i;
  const musicAvailable = !notAvailableRe.test(data);

  return {
    ok: true,
    status,
    musicAvailable,
  };
}

async function main() {
  const [base, premium, music] = await Promise.all([
    checkYouTubeBase(),
    checkYouTubePremium(),
    checkYouTubeMusic(),
  ]);

  // Если вообще всё умерло по сети
  if (!base.ok && premium.reason === "network" && music.reason === "network") {
    $done({
      content: "Network Error",
      backgroundColor: "",
    });
    return;
  }

  // Тексты
  const lines = [];

  if (base.ok) {
    lines.push("YouTube: ✅");
  } else {
    const s = base.status ? ` (HTTP ${base.status})` : "";
    lines.push(`YouTube: ❌${s}`);
  }

  if (premium.ok) {
    lines.push(`Premium: ${premium.premiumAvailable ? "✅" : "❌"}`);
    if (premium.region) {
      lines.push(`Location (YT): ${premium.region}`);
    }
  } else {
    const s = premium.status ? ` (HTTP ${premium.status})` : "";
    lines.push(`Premium: ❌${premium.reason === "network" ? " Network" : s}`);
  }

  if (music.ok) {
    lines.push(`Music: ${music.musicAvailable ? "✅" : "❌"}`);
  } else {
    const s = music.status ? ` (HTTP ${music.status})` : "";
    lines.push(`Music: ❌${music.reason === "network" ? " Network" : s}`);
  }

  // Цвет фона:
  // зелёный — всё доступно
  // жёлтый — YouTube работает, но Premium или Music недоступны
  // красный/дефолт — YouTube не работает
  let backgroundColor = "";
  if (base.ok && premium.ok && premium.premiumAvailable && music.ok && music.musicAvailable) {
    backgroundColor = "#88A788"; // зелёный, как у ChatGPT
  } else if (base.ok) {
    backgroundColor = "#FF9F0A"; // жёлтый — частичная доступность
  } else {
    backgroundColor = "#FF3B30"; // красный — всё плохо
  }

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
