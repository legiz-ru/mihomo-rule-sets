// Reddit Access Check Tile
// Проверяет общий доступ к reddit.com

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';

function checkReddit() {
  $httpClient.get(
    {
      url: "https://www.reddit.com/.json",
      headers: {
        "User-Agent": UA,
        "Accept": "application/json,text/html;q=0.9,*/*;q=0.8"
      },
      timeout: 5
    },
    function (error, response, data) {
      let status = response?.status || response?.statusCode;
      let icon = "🚫";
      let bg = "#ff3b30"; // red

      if (!error && status >= 200 && status < 400) {
        icon = "✅";
        bg = "#34c759"; // green
      } else if (status === 403 || status === 451) {
        icon = "🚫";
        bg = "#ff3b30";
      } else if (error) {
        icon = "⚠️";
        bg = "#ff9f0a"; // yellow
      }

      $done({
        title: "Reddit",
        content: `Access: ${icon}\nStatus: ${status || "N/A"}`,
        backgroundColor: bg,
        icon: "bubble.left.and.bubble.right.fill",
        url: "https://www.reddit.com"
      });
    }
  );
}

checkReddit();
