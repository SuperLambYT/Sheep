// Функция для получения списка статей
async function fetchArticles(page) {
    try {
        const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return null;
    }
}

// Функция для отображения списка статей
function displayArticles(articles) {
    const articlesList = document.getElementById('articles-list');
    articlesList.innerHTML = '';

    articles.data.forEach(article => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `post.html?id=${article.id}`;
        link.textContent = article.title;
        listItem.append(link);
        articlesList.append(listItem);
    });
}

fetchArticles(1).then(displayArticles);