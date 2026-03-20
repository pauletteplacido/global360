const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Fuentes confiables
const TRUSTED_SOURCES = [
  'bbc', 'reuters', 'apnews', 'theguardian', 'cnn', 'nytimes', 'ft.com',
  'thewashingtonpost', 'france24', 'dw.com', 'bbc.com', 'elpaís', 'elpais',
  'infobae', 'clarín', 'lanacion', 'pagina12', 'perfil', 'ambito',
  'bloomberg', 'economist', 'cnbc', 'businessinsider', 'forbes', 'techcrunch',
  'wired', 'theverge', 'arstechnica', 'prosiebensat1', 'abc.es', 'efe.com',
  'rtve', 'europapress', 'msnbc', 'pbs', 'npr', 'aljazeera', 'skynews'
];

// Función para verificar si es fuente confiable
function isTrustedSource(source) {
  if (!source) return false;
  const sourceLower = source.toLowerCase();
  return TRUSTED_SOURCES.some(trusted => sourceLower.includes(trusted));
}

// Función para generar resumen y análisis con Gemini
async function generateSummaryAndAnalysis(title, description, content) {
  try {
    const text = `${title}. ${description || ''} ${content || ''}`.substring(0, 2000);
    
    const prompt = `Analiza esta noticia y proporciona:
1. RESUMEN: Resume en máximo 2 párrafos el contenido principal
2. ANÁLISIS: Breve análisis del impacto o importancia
3. PALABRAS CLAVE: 3-5 palabras clave relevantes

Noticia: ${text}

Formato la respuesta como:
RESUMEN: [texto]
ANÁLISIS: [texto]
PALABRAS CLAVE: [lista separada por comas]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    // Parsear la respuesta
    const resumenMatch = generatedText.match(/RESUMEN:\s*([^ANÁLISIS]*?)(?=ANÁLISIS:|$)/);
    const analisisMatch = generatedText.match(/ANÁLISIS:\s*([^PALABRAS CLAVE]*?)(?=PALABRAS CLAVE:|$)/);
    const palabrasMatch = generatedText.match(/PALABRAS CLAVE:\s*([^]*?)$/);

    return {
      resumen: resumenMatch ? resumenMatch[1].trim() : description,
      analisis: analisisMatch ? analisisMatch[1].trim() : 'Análisis generado',
      palabrasClave: palabrasMatch ? palabrasMatch[1].trim().split(',').map(p => p.trim()) : []
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      resumen: description || 'Resumen no disponible',
      analisis: 'Análisis no disponible',
      palabrasClave: []
    };
  }
}

// Endpoint para obtener noticias filtradas
app.get('/api/news', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    let allArticles = [];

    // Obtener de GNews
    try {
      const gnewsResponse = await fetch(
        `https://gnews.io/api/v4/search?q=world news&lang=es&max=${limit}&token=${GNEWS_API_KEY}`
      );
      const gnewsData = await gnewsResponse.json();
      if (gnewsData.articles) {
        allArticles = allArticles.concat(
          gnewsData.articles.map(article => ({
            ...article,
            source: article.source ? article.source.name : 'GNews',
            image: article.image,
            isTrusted: isTrustedSource(article.source?.name)
          }))
        );
      }
    } catch (error) {
      console.error('GNews error:', error);
    }

    // Obtener de NewsAPI
    try {
      const newsapiResponse = await fetch(
        `https://newsapi.org/v2/top-headlines?country=es&apiKey=${NEWSAPI_KEY}&pageSize=${limit}`
      );
      const newsapiData = await newsapiResponse.json();
      if (newsapiData.articles) {
        allArticles = allArticles.concat(
          newsapiData.articles.map(article => ({
            title: article.title,
            description: article.description,
            content: article.content,
            link: article.url,
            image: article.urlToImage,
            source: article.source.name,
            publishedAt: article.publishedAt,
            isTrusted: isTrustedSource(article.source.name)
          }))
        );
      }
    } catch (error) {
      console.error('NewsAPI error:', error);
    }

    // Filtrar solo fuentes confiables
    const filteredArticles = allArticles.filter(article => article.isTrusted);

    // Remover duplicados
    const uniqueArticles = Array.from(
      new Map(filteredArticles.map(article => [article.title, article])).values()
    );

    // Ordenar por fecha (más recientes primero)
    uniqueArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0);
      const dateB = new Date(b.publishedAt || 0);
      return dateB - dateA;
    });

    // Limitar resultado
    const limitedArticles = uniqueArticles.slice(0, limit);

    // Generar resúmenes con IA para los primeros 5
    const articlesWithAnalysis = await Promise.all(
      limitedArticles.slice(0, 5).map(async (article) => {
        const analysis = await generateSummaryAndAnalysis(
          article.title,
          article.description,
          article.content
        );
        return {
          ...article,
          ...analysis
        };
      })
    );

    // Agregar el resto sin análisis (para speed)
    const finalArticles = [
      ...articlesWithAnalysis,
      ...limitedArticles.slice(5)
    ];

    res.json({
      success: true,
      count: finalArticles.length,
      articles: finalArticles
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching news',
      message: error.message
    });
  }
});

// Endpoint para obtener análisis de un artículo específico
app.post('/api/news/analyze', async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const analysis = await generateSummaryAndAnalysis(title, description, content);
    res.json(analysis);

  } catch (error) {
    console.error('Error analyzing article:', error);
    res.status(500).json({ error: 'Error analyzing article' });
  }
});

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📰 Get news: http://localhost:${PORT}/api/news`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});