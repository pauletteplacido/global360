const feeds = [
  "https://feeds.bbci.co.uk/mundo/rss.xml",
  "https://cnnespanol.cnn.com/feed/",
  "https://www.infobae.com/feeds/rss/",
  "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com"
const container = document.getElementById("news-container");
const featured = document.getElementById("featured-news");

Promise.all(
  feeds.map(feed =>
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`)
      .then(res => res.json())
  )
)
.then(results => {
  let allNews = [];

  results.forEach(data => {
    if (data.items) {
      allNews = allNews.concat(data.items);
    }
  });

  allNews.sort(() => 0.5 - Math.random());

  // 🟡 NOTICIA DESTACADA
  const main = allNews[0];

  featured.innerHTML = `
    <div class="featured">
      <img src="${main.thumbnail || ''}">
      <h2>${main.title}</h2>
      <p>${main.description.substring(0, 150)}...</p>
      <a href="${main.link}" target="_blank">Leer más</a>
    </div>
  `;

  // 📰 RESTO
  container.innerHTML = allNews.slice(1, 12).map(article => `
    <div class="card">
      <img src="${article.thumbnail || ''}" style="width:100%; border-radius:10px;">
      <h3>${article.title}</h3>
      <p>${article.description.substring(0, 100)}...</p>
      <a href="${article.link}" target="_blank">Ver fuente</a>
    </div>
  `).join('');
})
.catch(err => {
  console.error(err);
  container.innerHTML = "<p>Error cargando noticias</p>";
});

// 📊 TICKER (por ahora con datos simulados pro)
function loadTicker() {
  const ticker = document.getElementById("ticker");

  ticker.innerHTML = `
    🪙 Bitcoin: $67,200 ▲ |
    💰 Oro: $2,340 ▲ |
    🛢️ Petróleo: $78 ▼ |
    📈 S&P 500: 5,210 ▲ |
    💶 EUR/USD: 1.08 ▲ |
    🏦 Nasdaq: 16,200 ▲
  `;
}

loadTicker();
