const API_KEY = "907e2a92ccca47338d284240a37a6776";

fetch(`https://newsapi.org/v2/top-headlines?language=es&pageSize=10&apiKey=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news-container");

    container.innerHTML = data.articles.map(article => `
      <div class="card">
        <img src="${article.urlToImage || ''}" style="width:100%; border-radius:10px;">
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
  });const API_KEY = "TU_API_KEY";

fetch(`https://newsapi.org/v2/top-headlines?language=es&pageSize=10&apiKey=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("news-container");

    container.innerHTML = data.articles.map(article => `
      <div class="card">
        <img src="${article.urlToImage || ''}" style="width:100%; border-radius:10px;">
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
