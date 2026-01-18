
class ArticleView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.allArticles = [];
        this.filteredArticles = [];
        this.onSearch = null;
        this.onDownloadPDF = null;
    }

    setArticles(articles) {
        this.allArticles = articles;
        this.filteredArticles = articles;
    }

    render(articles) {
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        this.setArticles(articles);

        const tableHTML = `
            <div class="articles-container">
                <h1>PLOS Articles</h1>
                <div class="toolbar">
                    <div class="search-box">
                        <input type="text" 
                               id="searchInput" 
                               placeholder="Search for title..." 
                               class="search-input">
                        <button id="searchBtn" class="btn btn-search"> Search</button>
                        <button id="clearBtn" class="btn btn-clear">✖ Clear</button>
                    </div>
                    <button id="downloadPdfBtn" class="btn btn-pdf">Download PDF</button>
                </div>
                <table class="articles-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Journal</th>
                            <th>Publication Date</th>
                            <th>DOI</th>
                        </tr>
                    </thead>
                    <tbody id="articlesTableBody">
                        ${this.renderRows(articles)}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = tableHTML;
        this.bindEvents();
    }

    bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearBtn = document.getElementById('clearBtn');
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');

        searchBtn.addEventListener('click', () => this.handleSearch());
        clearBtn.addEventListener('click', () => this.handleClear());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        downloadPdfBtn.addEventListener('click', () => this.handleDownloadPDF());
    }

    handleSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.filteredArticles = this.allArticles;
        } else {
            this.filteredArticles = this.allArticles.filter(article => 
                article.title.toLowerCase().includes(searchTerm)
            );
        }
        
        this.updateTable(this.filteredArticles);
    }

    handleClear() {
        document.getElementById('searchInput').value = '';
        this.filteredArticles = this.allArticles;
        this.updateTable(this.allArticles);
    }

    updateTable(articles) {
        const tbody = document.getElementById('articlesTableBody');
        if (tbody) {
            tbody.innerHTML = this.renderRows(articles);
        }
    }

    handleDownloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text('PLOS Articles Report', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, 14, 30);
        doc.text(`Total articles: ${this.filteredArticles.length}`, 14, 36);

        const tableData = this.filteredArticles.map(article => [
            article.title,
            article.journal,
            article.publicationDate,
            article.doi
        ]);

        doc.autoTable({
            startY: 42,
            head: [['Title', 'Journal', 'Publication Date', 'DOI']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [15, 52, 96],
                textColor: [79, 195, 247],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 8,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 50 },
                2: { cellWidth: 35 },
                3: { cellWidth: 70 }
            },
            alternateRowStyles: {
                fillColor: [22, 33, 62]
            }
        });

        doc.save('plos_articles_report.pdf');
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
