const API_KEY = "TU_API_KEY";

async function loadNews() {
  const res = await fetch(`https://newsapi.org/v2/top-headlines?language=es&pageSize=10&apiKey=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById("news-container");

  data.articles.forEach(article => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description || ""}</p>
      <a href="${article.url}" target="_blank">Fuente</a>
    `;

    container.appendChild(div);
  });
}

loadNews();function loadTicker() {
  const ticker = document.getElementById("ticker");

  ticker.innerHTML = `
    🪙 BTC: $67,000 ▲  
    💰 Oro: $2,300 ▲  
    🛢️ Petróleo: $78 ▼  
    📈 S&P 500: 5,200 ▲  
  `;
}

loadTicker();