const feeds = [
  "https://feeds.bbci.co.uk/mundo/rss.xml",
  "https://cnnespanol.cnn.com/feed/",
  "https://www.infobae.com/feeds/rss/"
];

const container = document.getElementById("news-container");

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

  // Mezclar noticias
  allNews.sort(() => 0.5 - Math.random());

  container.innerHTML = allNews.slice(0, 12).map(article => `
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
