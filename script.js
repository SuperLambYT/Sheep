// Функция для получения списка статей
async function fetchArticles(page) {
    const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
    const data = await response.json();
    return data;
}

// Функция для отображения списка статей с пагинацией
async function displayArticles(articles) {
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

    // Определяем текущую страницу и общее количество страниц
    const currentPage = articles.meta.pagination.page;
    const totalPages = articles.meta.pagination.pages;

    // Добавляем пагинацию
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Показываем предыдущие две страницы (если они существуют)
    for (let i = Math.max(1, currentPage - 2); i < currentPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = `#`;
        pageLink.textContent = i;
        pageLink.addEventListener('click', async function () {
            fetchArticles(i).then(displayArticles);
        });
        paginationContainer.append(pageLink);
    }

    // Показываем текущую страницу
    const currentPageLink = document.createElement('span');
    currentPageLink.textContent = currentPage;
    currentPageLink.classList.add('current');
    paginationContainer.append(currentPageLink);

    // Показываем последующие две страницы (если они существуют)
    for (let i = currentPage + 1; i <= Math.min(currentPage + 2, totalPages); i++) {
        const pageLink = document.createElement('a');
        pageLink.href = `#`;
        pageLink.textContent = i;
        pageLink.addEventListener('click', async function () {
            fetchArticles(i).then(displayArticles);
        });
        paginationContainer.append(pageLink);
    }
}

// Функция для получения информации о статье по ID
async function fetchArticleById(id) {
    const response = await fetch(`https://gorest.co.in/public-api/posts/${id}`);
    const data = await response.json();
    return data;
}

// Функция для получения комментариев к статье по ID
async function fetchCommentsByPostId(postId) {
    const response = await fetch(`https://gorest.co.in/public-api/comments?post_id=${postId}`);
    const data = await response.json();
    return data;
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
