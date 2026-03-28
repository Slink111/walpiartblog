// Wallpaper Page Generator
// This script creates individual HTML pages for each wallpaper

const fs = require('fs');
const path = require('path');

function generateWallpaperPage(wallpaper) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${wallpaper.title} - Walpi Wallpaper</title>
    <meta name="description" content="${wallpaper.description}">
    <meta name="keywords" content="${wallpaper.tags.join(', ')}">
    
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="config.js"></script>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <h1>Walpi</h1>
                </div>
                <div class="search-container">
                    <input type="text" placeholder="Search wallpapers..." class="search-bar" onclick="window.location.href='index.html'">
                    <button class="search-btn" onclick="window.location.href='index.html'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>
                <nav class="nav-links">
                    <a href="index.html" class="nav-link">Home</a>
                    <a href="index.html" class="nav-link">Categories</a>
                    <a href="index.html" class="nav-link">Trending</a>
                </nav>
                <button id="darkModeToggle" class="dark-mode-toggle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <div class="wallpaper-detail active">
                <div class="detail-left">
                    <div class="wallpaper-preview">
                        <img src="${wallpaper.image_url}" alt="${wallpaper.alt || wallpaper.title}" class="main-wallpaper">
                    </div>
                    <div class="wallpaper-actions">
                        <button onclick="downloadWallpaper('${wallpaper.image_url}', '${wallpaper.title}')" class="action-btn primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </button>
                        <button onclick="toggleLike(${wallpaper.id})" class="action-btn" id="likeBtn-${wallpaper.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span id="likeCount-${wallpaper.id}">${wallpaper.likes || 0}</span>
                        </button>
                        <button onclick="shareWallpaper('${wallpaper.title}', '${wallpaper.description}')" class="action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            Share
                        </button>
                    </div>
                    <div class="ad-block">
                        <div class="ad-placeholder">
                            <span>Advertisement</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-right">
                    <div class="wallpaper-info">
                        <h1>${wallpaper.title}</h1>
                        <p>${wallpaper.description}</p>
                        <div class="tags">
                            ${wallpaper.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="blog-content">
                        <h3>About This Wallpaper</h3>
                        <div class="blog-text">
                            ${wallpaper.blog_content || 'No blog content available for this wallpaper.'}
                        </div>
                    </div>
                    
                    <div class="ad-block">
                        <div class="ad-placeholder">
                            <span>Advertisement</span>
                        </div>
                    </div>
                    
                    <div class="more-to-explore">
                        <h3>More to Explore</h3>
                        <div class="related-grid">
                            <div class="related-item" onclick="window.location.href='index.html'">
                                <img src="https://picsum.photos/seed/related1/400/300.jpg" alt="Related wallpaper">
                            </div>
                            <div class="related-item" onclick="window.location.href='index.html'">
                                <img src="https://picsum.photos/seed/related2/400/300.jpg" alt="Related wallpaper">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 Walpi. Discover and download beautiful wallpapers.</p>
        </div>
    </footer>

    <script>
        // Initialize
        let likedWallpapers = JSON.parse(localStorage.getItem('likedWallpapers')) || [];
        
        // Initialize dark mode
        function initializeDarkMode() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        function toggleDarkMode() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
        
        // Download function
        function downloadWallpaper(imageUrl, title) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = \`\${title.toLowerCase().replace(/\\s+/g, '-')}.jpg\`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show feedback
            event.target.innerHTML = '<span class="loading"></span> Downloading...';
            event.target.disabled = true;
            
            setTimeout(() => {
                event.target.innerHTML = '✓ Downloaded';
                setTimeout(() => {
                    event.target.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download';
                    event.target.disabled = false;
                }, 1500);
            }, 1000);
        }
        
        // Like function
        function toggleLike(wallpaperId) {
            const index = likedWallpapers.indexOf(wallpaperId);
            const likeBtn = document.getElementById(\`likeBtn-\${wallpaperId}\`);
            const likeCount = document.getElementById(\`likeCount-\${wallpaperId}\`);
            
            if (index > -1) {
                likedWallpapers.splice(index, 1);
                likeBtn.classList.remove('liked');
            } else {
                likedWallpapers.push(wallpaperId);
                likeBtn.classList.add('liked');
            }
            
            localStorage.setItem('likedWallpapers', JSON.stringify(likedWallpapers));
            likeCount.textContent = parseInt(likeCount.textContent) + (index > -1 ? -1 : 1);
        }
        
        // Share function
        function shareWallpaper(title, description) {
            const shareData = {
                title: title,
                text: description,
                url: window.location.href
            };
            
            if (navigator.share) {
                navigator.share(shareData);
            } else {
                const text = \`\${title} - \${description}\`;
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = event.target.innerHTML;
                    event.target.innerHTML = '✓ Copied!';
                    setTimeout(() => {
                        event.target.innerHTML = originalText;
                    }, 1500);
                });
            }
        }
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', () => {
            initializeDarkMode();
            document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
            
            // Update like button state
            if (likedWallpapers.includes(${wallpaper.id})) {
                document.getElementById(\`likeBtn-\${wallpaper.id}\`).classList.add('liked');
            }
        });
    </script>
</body>
</html>`;
}

// Export function for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateWallpaperPage };
}
