// 🔑 API
const API_KEY = "TU_API_KEY";

// 📰 NOTICIAS
fetch(`https://gnews.io/api/v4/top-headlines?lang=es&max=10&token=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news-container");

    container.innerHTML = data.articles.map(article => `
      <div class="card">
        <img src="${article.image || ''}" style="width:100%; border-radius:10px;">
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
        <small>${article.source.name}</small><br>
        <a href="${article.url}" target="_blank">Ver fuente</a>
      </div>
    `).join('');
  })
  .catch(err => {
    console.error(err);
    document.getElementById("news-container").innerHTML = "<p>Error cargando noticias</p>";
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
