// FAQ Collapse Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ collapse functionality
    const faqItems = document.querySelectorAll('.collapse');
    
    faqItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const title = item.querySelector('.collapse-title');
        
        if (checkbox && title) {
            // Handle click on title
            title.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle the checkbox
                checkbox.checked = !checkbox.checked;
                
                // Update visual state
                updateCollapseState(item, checkbox.checked);
            });
            
            // Handle direct checkbox change
            checkbox.addEventListener('change', function() {
                updateCollapseState(item, this.checked);
            });
            
            // Initialize state
            updateCollapseState(item, checkbox.checked);
        }
    });
    
    function updateCollapseState(item, isOpen) {
        const content = item.querySelector('.collapse-content');
        const arrow = item.querySelector('.collapse-title::after') || item.querySelector('.collapse-title');
        
        if (content) {
            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.paddingTop = '1rem';
                content.style.paddingBottom = '1rem';
                item.classList.add('collapse-open');
            } else {
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
                item.classList.remove('collapse-open');
            }
        }
        
        // Rotate arrow
        if (arrow) {
            item.style.setProperty('--collapse-rotation', isOpen ? '45deg' : '0deg');
        }
    }
});

// Add CSS styles for smooth transitions
const style = document.createElement('style');
style.textContent = `
    .collapse .collapse-content {
        transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        padding-top: 0;
        padding-bottom: 0;
    }
    
    .collapse.collapse-open .collapse-content {
        max-height: none !important;
        opacity: 1 !important;
        padding-top: 1rem !important;
        padding-bottom: 1rem !important;
    }
    
    .collapse-title {
        cursor: pointer;
        user-select: none;
        position: relative;
    }
    
    .collapse-arrow .collapse-title::after {
        content: "▶";
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%) rotate(var(--collapse-rotation, 0deg));
        transition: transform 0.3s ease;
        font-size: 0.8em;
        opacity: 0.7;
    }
    
    .collapse input[type="checkbox"] {
        display: none;
    }
`;
document.head.appendChild(style); 