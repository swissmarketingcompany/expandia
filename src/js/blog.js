document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    let activeFilter = null;

    function performFilter() {
        // This will work with the existing JavaScript in the HTML that handles article filtering
        if (typeof filterAndDisplayArticles === 'function') {
            // Update the global currentFilter variable used by the existing script
            window.currentFilter = activeFilter || 'all';
            filterAndDisplayArticles();
        } else {
            // Fallback: manually filter articles if the function doesn't exist
            const articles = document.querySelectorAll('#articleGrid .article-card');
            articles.forEach(article => {
                const tags = article.dataset.tags?.split(' ') || [];
                const matchesFilter = !activeFilter || tags.some(tag => tag.includes(activeFilter));
                article.style.display = matchesFilter ? '' : 'none';
            });
        }
    }

    // Filter button click handlers
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            if (activeFilter === filter) {
                // Deactivate current filter
                activeFilter = null;
                btn.classList.remove('btn-primary', 'btn-secondary', 'btn-accent', 'btn-info', 'btn-warning', 'btn-success', 'btn-error');
                btn.classList.add('btn-outline');
            } else {
                // Clear all active states
                filterBtns.forEach(b => {
                    b.classList.remove('btn-primary', 'btn-secondary', 'btn-accent', 'btn-info', 'btn-warning', 'btn-success', 'btn-error');
                    b.classList.add('btn-outline');
                });
                
                // Activate clicked filter
                activeFilter = filter;
                btn.classList.remove('btn-outline');
                
                // Add the appropriate color class based on the hover class
                if (btn.classList.contains('hover:btn-primary')) btn.classList.add('btn-primary');
                else if (btn.classList.contains('hover:btn-secondary')) btn.classList.add('btn-secondary');
                else if (btn.classList.contains('hover:btn-accent')) btn.classList.add('btn-accent');
                else if (btn.classList.contains('hover:btn-info')) btn.classList.add('btn-info');
                else if (btn.classList.contains('hover:btn-warning')) btn.classList.add('btn-warning');
                else if (btn.classList.contains('hover:btn-success')) btn.classList.add('btn-success');
                else if (btn.classList.contains('hover:btn-error')) btn.classList.add('btn-error');
                else btn.classList.add('btn-primary'); // fallback
            }

            performFilter();
            
            // Scroll to articles section
            const articleGrid = document.getElementById('articleGrid');
            if (articleGrid) {
                articleGrid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Clear filters button
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            activeFilter = null;
            filterBtns.forEach(btn => {
                btn.classList.remove('btn-primary', 'btn-secondary', 'btn-accent', 'btn-info', 'btn-warning', 'btn-success', 'btn-error');
                btn.classList.add('btn-outline');
            });
            performFilter();
        });
    }
});