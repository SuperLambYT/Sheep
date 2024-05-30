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

// Функция для получения информации о статье по ID
async function fetchArticleById(id) {
    try {
        const response = await fetch(`https://gorest.co.in/public-api/posts/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching article detail:', error);
        return null;
    }
}

// Функция для получения комментариев к статье по ID
async function fetchCommentsByPostId(postId) {
    try {
        const response = await fetch(`https://gorest.co.in/public-api/comments?post_id=${postId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return null;
    }
}

// Функция для отображения детальной информации о статье
async function displayArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const articleTitleElement = document.getElementById('article-title');
    const articleContentElement = document.getElementById('article-content');

    const article = await fetchArticleById(articleId);
    if (article) {
        const { title, body } = article.data;

        articleTitleElement.textContent = title;
        articleContentElement.textContent = body;

        // Получаем и отображаем комментарии к статье
        const comments = await fetchCommentsByPostId(articleId);
        if (comments) {
            const commentsContainer = document.getElementById('comments');
            commentsContainer.innerHTML = '<h2>Comments</h2>';

            comments.data.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.innerHTML = `<strong>${comment.name}</strong>: ${comment.body}`;
                commentsContainer.append(commentElement);
            });
        }
    } else {
        articleTitleElement.textContent = 'Страница не найдена';
    }
}

// Если находимся на странице статьи, отображаем ее детальную информацию
if (window.location.pathname.includes('post.html')) {
    displayArticleDetail();
}
else {
    // В противном случае, отображаем список статей
    fetchArticles(1).then(displayArticles);
}
