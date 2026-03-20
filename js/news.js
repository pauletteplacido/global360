fetch('https://api.example.com/news')
  .then(response => response.json())
  .then(data => {
    const newsContainer = document.getElementById('newsContainer');
    data.articles.forEach(article => {
      const newsItem = document.createElement('div');
      newsItem.innerHTML = `<h3>${article.title}</h3><p>${article.introduction}</p>`;
      newsItem.onclick = () => showModal(article);
      newsContainer.appendChild(newsItem);
    });
  })
  .catch(error => console.error('Error fetching news:', error));

function showModal(article) {
  const modal = document.getElementById('modal');
  modal.innerHTML = `<h2>${article.title}</h2><p>${article.fullAnalysis}</p>`;
  modal.style.display = 'block';
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};// Connect to the backend API and fetch articles\nasync function fetchArticles() {\n    try {\n        const response = await fetch('https://api.example.com/articles');\n        const data = await response.json();\n        const trustedSources = ['Source1', 'Source2'];\n        displayArticles(data.filter(article => trustedSources.includes(article.source)));\n    } catch (error) {\n        console.error('Error fetching articles:', error);\n    }\n}\n\n// Display articles in a modal popup\nfunction displayArticles(articles) {\n    const modal = document.getElementById('modal');\n    while (modal.firstChild) {\n        modal.removeChild(modal.firstChild);\n    }\n    articles.forEach(article => {\n        const articleElement = document.createElement('div');\n        articleElement.innerHTML = `<h2>${article.title}</h2><p>${article.content}</p>`;\n        modal.appendChild(articleElement);\n    });\n    modal.style.display = 'block';\n}\n\n// Call the function to fetch articles\nfetchArticles();
