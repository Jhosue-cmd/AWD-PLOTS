
class ArticleController {
    constructor() {
        this.model = new ArticleModel();
        this.view = new ArticleView('app');
    }

    async init() {
        try {
            
            this.view.showLoading();
            
           
            const articles = await this.model.fetchArticles('university');
            
       
            this.view.render(articles);
            
        } catch (error) {
            console.error('Error initializing the application:', error);
            this.view.showError('Failed to load articles. Please try again later.');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new ArticleController();
    app.init();
});
