let url = "https://api.ip.sb/geoip";

$httpClient.get(url, function(error, response, data) {
  if (error) {
    body = {
      title: "Информация о узле",
      content: "Не удалось получить данные об IP",
      icon: "exclamationmark.triangle.fill",
      backgroundColor: '#FF9500'
    };
    $done(body);
    return;
  }

  let jsonData = JSON.parse(data);

  let country = jsonData.country || "Неизвестная страна";
  let countryCode = jsonData.country_code || "";
  let emoji = getFlagEmoji(countryCode);
  let city = jsonData.city || jsonData.region || "Неизвестный город";
  let isp = jsonData.organization || "Неизвестный оператор";
  let ip = jsonData.ip || "Неизвестный IP";

  body = {
    title: "Информация о узле",
    content: `${ip} | IP-адрес\n${isp} | Оператор связи\n${emoji}${country} - ${city} | Местоположение`,
    icon: "globe.asia.australia.fill",
    backgroundColor: '#0C9DFA'
  };

  $done(body);
});

function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  if (countryCode.toUpperCase() === 'TW') {
    countryCode = 'CN';
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
