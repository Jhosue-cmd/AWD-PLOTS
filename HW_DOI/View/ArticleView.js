
class ArticleView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

   
    render(articles) {
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        const tableHTML = `
            <div class="articles-container">
                <h1>PLOS Articles</h1>
                <table class="articles-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Journal</th>
                            <th>Publication Date</th>
                            <th>DOI</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderRows(articles)}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = tableHTML;
    }

  
    renderRows(articles) {
        if (!articles || articles.length === 0) {
            return `
                <tr>
                    <td colspan="4" class="no-data">Not found articles</td>
                </tr>
            `;
        }

        return articles.map(article => `
            <tr>
                <td class="title-cell">${this.escapeHTML(article.title)}</td>
                <td>${this.escapeHTML(article.journal)}</td>
                <td>${this.escapeHTML(article.publicationDate)}</td>
                <td class="doi-cell">
                    <a href="https://doi.org/${article.doi}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="doi-link">
                        ${this.escapeHTML(article.doi)}
                    </a>
                </td>
            </tr>
        `).join('');
    }


    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading articles...</p>
                </div>
            `;
        }
    }


    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error">
                    <p>Error: ${this.escapeHTML(message)}</p>
                    <button onclick="location.reload()">Reintentar</button>
                </div>
            `;
        }
    }


    escapeHTML(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}


window.ArticleView = ArticleView;
