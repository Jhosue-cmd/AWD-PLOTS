
class ArticleModel {
    constructor() {
        this.apiUrl = 'https://api.plos.org/search';
        this.articles = [];
    }


    async fetchArticles(query = 'university') {
        try {
         
            const url = `${this.apiUrl}?q=title:${query}&fl=title,journal,ejournal,publication_date,id&rows=20&wt=json`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data.response.docs); 
            this.articles = this.formatArticles(data.response.docs);
            
            return this.articles;
        } catch (error) {
            console.error('Error to obtain data:', error);
            throw error;
        }
    }

    formatArticles(docs) {
        return docs.map(doc => ({
            title: doc.title || 'Without Title',
            
            journal: doc.journal || doc.ejournal || this.extractJournalFromDoi(doc.id),
            publicationDate: this.formatDate(doc.publication_date),
            doi: doc.id || ''
        }));
    }

 
    extractJournalFromDoi(doi) {
        if (!doi) return 'Unknown';
       
        const journalMap = {
            'pone': 'PLOS ONE',
            'pbio': 'PLoS Biology',
            'pmed': 'PLoS Medicine',
            'pcbi': 'PLoS Computational Biology',
            'pgen': 'PLoS Genetics',
            'ppat': 'PLoS Pathogens',
            'pntd': 'PLoS Neglected Tropical Diseases',
            'pclm': 'PLOS Climate',
            'pwat': 'PLOS Water',
            'pgph': 'PLOS Global Public Health',
            'pdig': 'PLOS Digital Health',
            'pstr': 'PLOS Sustainability and Transformation'
        };

        
        const match = doi.match(/journal\.([a-z]+)\./);
        if (match && match[1]) {
            return journalMap[match[1]] || match[1].toUpperCase();
        }
        
        return 'PLOS';
    }


    formatDate(dateString) {
        if (!dateString) return 'Date not available';
        
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

  
    getArticles() {
        return this.articles;
    }
}


window.ArticleModel = ArticleModel;
