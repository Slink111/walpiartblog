// Wallpaper data - removed mock images, will use real uploads
let wallpapers = [];

// App state
let currentWallpaper = null;
let likedWallpapers = JSON.parse(localStorage.getItem('likedWallpapers')) || [];
let currentCategory = 'all';
let searchQuery = '';
let currentUser = null;
let isAdmin = false;

// DOM elements
const gridView = document.getElementById('gridView');
const detailView = document.getElementById('detailView');
const wallpaperGrid = document.getElementById('wallpaperGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const downloadBtn = document.getElementById('downloadBtn');
const likeBtn = document.getElementById('likeBtn');
const shareBtn = document.getElementById('shareBtn');
const filterTags = document.querySelectorAll('.tag');

// User management DOM elements
const usernameInput = document.getElementById('usernameInput');
const setUsernameBtn = document.getElementById('setUsernameBtn');
const userDisplay = document.getElementById('userDisplay');
const currentUsername = document.getElementById('currentUsername');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminPanel = document.getElementById('adminPanel');

// Admin panel DOM elements
const adminTabs = document.querySelectorAll('.admin-tab');
const adminImage = document.getElementById('adminImage');
const imagePreview = document.getElementById('imagePreview');
const wallpaperSelect = document.getElementById('wallpaperSelect');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    checkExistingUser();
    renderWallpaperGrid();
    setupEventListeners();
    initializeSupabase();
});

// Initialize Supabase
async function initializeSupabase() {
    try {
        // Test Supabase connection
        const { data, error } = await supabase.from('wallpapers').select('count');
        if (error && error.code !== 'PGRST116') {
            console.warn('Supabase connection error:', error);
        }
        
        // Load wallpapers from Supabase
        await loadWallpapersFromSupabase();
    } catch (error) {
        console.warn('Supabase not configured, using local data:', error);
    }
}

// Load wallpapers from Supabase
async function loadWallpapersFromSupabase() {
    try {
        const { data, error } = await supabase
            .from('wallpapers')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            // Replace local wallpapers with Supabase data
            wallpapers.length = 0;
            wallpapers.push(...data);
            renderWallpaperGrid();
            
            // Generate individual pages for each wallpaper
            generateWallpaperPages(data);
        }
    } catch (error) {
        console.error('Error loading wallpapers:', error);
    }
}

// Generate individual HTML pages for each wallpaper
function generateWallpaperPages(wallpapers) {
    wallpapers.forEach(wallpaper => {
        const pageContent = `
<!DOCTYPE html>
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
        
        // Create blob and download
        const blob = new Blob([pageContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Dark mode functionality
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

// Event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderWallpaperGrid();
    });

    searchBtn.addEventListener('click', () => {
        searchQuery = searchInput.value.toLowerCase();
        renderWallpaperGrid();
    });

    // Category filters
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentCategory = tag.dataset.category;
            renderWallpaperGrid();
        });
    });

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Back button
    backBtn.addEventListener('click', showGridView);

    // Action buttons
    downloadBtn.addEventListener('click', downloadWallpaper);
    likeBtn.addEventListener('click', toggleLike);
    shareBtn.addEventListener('click', shareWallpaper);

    // User management
    setUsernameBtn.addEventListener('click', setUsername);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') setUsername();
    });
    
    adminPanelBtn.addEventListener('click', openAdminPanel);
    logoutBtn.addEventListener('click', logout);

    // Admin panel tabs
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAdminTab(tabName);
        });
    });

    // Image upload preview
    adminImage.addEventListener('change', previewImage);
    
    // Wallpaper select for blog editing
    wallpaperSelect.addEventListener('change', loadBlogContentForEditing);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !adminPanel.classList.contains('hidden')) {
            closeAdminPanel();
        } else if (e.key === 'Escape' && !detailView.classList.contains('hidden')) {
            showGridView();
        }
    });
}

// Render wallpaper grid
function renderWallpaperGrid() {
    const filteredWallpapers = wallpapers.filter(wallpaper => {
        const matchesCategory = currentCategory === 'all' || wallpaper.category === currentCategory;
        const matchesSearch = !searchQuery || 
            wallpaper.title.toLowerCase().includes(searchQuery) ||
            wallpaper.description.toLowerCase().includes(searchQuery) ||
            wallpaper.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    wallpaperGrid.innerHTML = '';

    if (filteredWallpapers.length === 0) {
        wallpaperGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>No wallpapers found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    filteredWallpapers.forEach(wallpaper => {
        const card = createWallpaperCard(wallpaper);
        wallpaperGrid.appendChild(card);
    });
}

// Create wallpaper card element
function createWallpaperCard(wallpaper) {
    const card = document.createElement('div');
    card.className = 'wallpaper-card';
    card.onclick = () => {
        // Generate and download individual page
        generateWallpaperPage(wallpaper);
    };

    const isLiked = likedWallpapers.includes(wallpaper.id);

    card.innerHTML = `
        <img src="${wallpaper.thumbnail_url || wallpaper.image_url}" alt="${wallpaper.alt || wallpaper.title}" loading="lazy">
        <div class="wallpaper-card-info">
            <h3 class="wallpaper-card-title">${wallpaper.title}</h3>
            <div class="wallpaper-card-tags">
                ${wallpaper.tags.slice(0, 3).map(tag => 
                    `<span class="wallpaper-card-tag">${tag}</span>`
                ).join('')}
            </div>
        </div>
    `;

    return card;
}

// Show wallpaper detail view
function showWallpaperDetail(wallpaper) {
    currentWallpaper = wallpaper;
    
    // Update main wallpaper
    document.getElementById('mainWallpaper').src = wallpaper.imageUrl;
    document.getElementById('mainWallpaper').alt = wallpaper.title;
    
    // Update info
    document.getElementById('wallpaperTitle').textContent = wallpaper.title;
    document.getElementById('wallpaperDescription').textContent = wallpaper.description;
    document.getElementById('blogText').textContent = wallpaper.blogContent;
    
    // Update tags
    const tagsContainer = document.getElementById('wallpaperTags');
    tagsContainer.innerHTML = wallpaper.tags.map(tag => 
        `<span class="tag-chip">${tag}</span>`
    ).join('');
    
    // Update like button
    updateLikeButton();
    
    // Load thumbnails
    loadThumbnails(wallpaper);
    
    // Load related wallpapers
    loadRelatedWallpapers(wallpaper);
    
    // Show detail view
    showDetailView();
}

// Load thumbnail strip
function loadThumbnails(wallpaper) {
    const thumbnailStrip = document.getElementById('thumbnailStrip');
    thumbnailStrip.innerHTML = '';
    
    // Add main image as first thumbnail
    const mainThumb = document.createElement('img');
    mainThumb.src = wallpaper.thumbnailUrl;
    mainThumb.alt = wallpaper.title;
    mainThumb.className = 'thumbnail active';
    mainThumb.onclick = () => selectThumbnail(wallpaper.imageUrl, mainThumb);
    thumbnailStrip.appendChild(mainThumb);
    
    // Add related images as thumbnails
    wallpaper.relatedImages.forEach((imageId, index) => {
        const thumb = document.createElement('img');
        thumb.src = `https://picsum.photos/seed/${imageId}/80/60.jpg`;
        thumb.alt = `Related image ${index + 1}`;
        thumb.className = 'thumbnail';
        thumb.onclick = () => selectThumbnail(`https://picsum.photos/seed/${imageId}/800/1200.jpg`, thumb);
        thumbnailStrip.appendChild(thumb);
    });
}

// Select thumbnail
function selectThumbnail(imageUrl, thumbnailElement) {
    document.getElementById('mainWallpaper').src = imageUrl;
    document.querySelectorAll('.thumbnail').forEach(thumb => 
        thumb.classList.remove('active')
    );
    thumbnailElement.classList.add('active');
}

// Load related wallpapers
function loadRelatedWallpapers(wallpaper) {
    const relatedGrid = document.getElementById('relatedWallpapers');
    relatedGrid.innerHTML = '';
    
    // Get wallpapers from same category (excluding current)
    const related = wallpapers
        .filter(w => w.category === wallpaper.category && w.id !== wallpaper.id)
        .slice(0, 4);
    
    related.forEach(wallpaper => {
        const item = document.createElement('div');
        item.className = 'related-item';
        item.onclick = () => showWallpaperDetail(wallpaper);
        item.innerHTML = `<img src="${wallpaper.thumbnailUrl}" alt="${wallpaper.title}">`;
        relatedGrid.appendChild(item);
    });
}

// View management
function showDetailView() {
    gridView.classList.add('hidden');
    detailView.classList.remove('hidden');
    detailView.classList.add('active');
    backBtn.classList.remove('hidden');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showGridView() {
    detailView.classList.remove('active');
    detailView.classList.add('hidden');
    gridView.classList.remove('hidden');
    backBtn.classList.add('hidden');
}

// Action button functionalities
function downloadWallpaper() {
    if (!currentWallpaper) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentWallpaper.imageUrl;
    link.download = `${currentWallpaper.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success feedback
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<span class="loading"></span> Downloading...';
    downloadBtn.disabled = true;
    
    setTimeout(() => {
        downloadBtn.innerHTML = '✓ Downloaded';
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        }, 1500);
    }, 1000);
}

function toggleLike() {
    if (!currentWallpaper) return;
    
    const wallpaperId = currentWallpaper.id;
    const index = likedWallpapers.indexOf(wallpaperId);
    
    if (index > -1) {
        likedWallpapers.splice(index, 1);
    } else {
        likedWallpapers.push(wallpaperId);
        currentWallpaper.likes++;
    }
    
    localStorage.setItem('likedWallpapers', JSON.stringify(likedWallpapers));
    updateLikeButton();
    renderWallpaperGrid(); // Update grid to reflect changes
}

function updateLikeButton() {
    if (!currentWallpaper) return;
    
    const isLiked = likedWallpapers.includes(currentWallpaper.id);
    const likeCount = document.getElementById('likeCount');
    
    if (isLiked) {
        likeBtn.classList.add('liked');
        likeCount.textContent = currentWallpaper.likes;
    } else {
        likeBtn.classList.remove('liked');
        likeCount.textContent = currentWallpaper.likes;
    }
}

function shareWallpaper() {
    if (!currentWallpaper) return;
    
    const shareData = {
        title: currentWallpaper.title,
        text: currentWallpaper.description,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy to clipboard
        const text = `${currentWallpaper.title} - ${currentWallpaper.description}`;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '✓ Copied!';
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
            }, 1500);
        });
    }
}

// User Management Functions
function checkExistingUser() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        isAdmin = currentUser === ADMIN_USERNAME;
        updateUserInterface();
    }
}

function setUsername() {
    const username = usernameInput.value.trim();
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    currentUser = username;
    isAdmin = username === ADMIN_USERNAME;
    localStorage.setItem('currentUser', currentUser);
    
    updateUserInterface();
    usernameInput.value = '';
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    successMsg.textContent = `Welcome, ${username}!${isAdmin ? ' (Admin)' : ''}`;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        document.body.removeChild(successMsg);
    }, 3000);
}

function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    closeAdminPanel();
}

function updateUserInterface() {
    if (currentUser) {
        document.querySelector('.username-selector').classList.add('hidden');
        userDisplay.classList.remove('hidden');
        currentUsername.textContent = currentUser;
        
        if (isAdmin) {
            adminPanelBtn.classList.remove('hidden');
        } else {
            adminPanelBtn.classList.add('hidden');
        }
    } else {
        document.querySelector('.username-selector').classList.remove('hidden');
        userDisplay.classList.add('hidden');
    }
}

// Admin Panel Functions
function openAdminPanel() {
    adminPanel.classList.remove('hidden');
    populateWallpaperSelect();
    switchAdminTab('upload');
}

function closeAdminPanel() {
    adminPanel.classList.add('hidden');
    clearAdminForm();
}

function switchAdminTab(tabName) {
    // Update tab buttons
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'upload') {
        document.getElementById('uploadTab').classList.add('active');
    } else if (tabName === 'edit') {
        document.getElementById('editTab').classList.add('active');
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function populateWallpaperSelect() {
    wallpaperSelect.innerHTML = '<option value="">Choose a wallpaper...</option>';
    wallpapers.forEach(wallpaper => {
        const option = document.createElement('option');
        option.value = wallpaper.id;
        option.textContent = wallpaper.title;
        wallpaperSelect.appendChild(option);
    });
}

function loadBlogContentForEditing() {
    const wallpaperId = parseInt(wallpaperSelect.value);
    if (!wallpaperId) {
        document.getElementById('editBlogContent').value = '';
        return;
    }
    
    const wallpaper = wallpapers.find(w => w.id === wallpaperId);
    if (wallpaper) {
        document.getElementById('editBlogContent').value = wallpaper.blogContent || '';
    }
}

async function uploadWallpaper() {
    const title = document.getElementById('adminTitle').value.trim();
    const category = document.getElementById('adminCategory').value;
    const tags = document.getElementById('adminTags').value.split(',').map(tag => tag.trim());
    const altText = document.getElementById('adminAlt').value.trim();
    const description = document.getElementById('adminDescription').value.trim();
    const blogContent = document.getElementById('adminBlog').value.trim();
    const imageFile = adminImage.files[0];
    
    if (!title || !imageFile) {
        alert('Please fill in all required fields');
        return;
    }
    
    try {
        let imageUrl = '';
        
        // Upload image to Supabase Storage
        if (imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('wallpapers')
                .upload(fileName, imageFile);
                
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('wallpapers')
                .getPublicUrl(fileName);
                
            imageUrl = urlData.publicUrl;
        }
        
        // Create wallpaper object
        const newWallpaper = {
            title,
            category,
            tags,
            description,
            blogContent,
            imageUrl,
            thumbnailUrl: imageUrl, // You might want to generate thumbnails
            alt: altText || title,
            likes: 0,
            created_at: new Date().toISOString()
        };
        
        // Save to Supabase
        const { data, error } = await supabase
            .from('wallpapers')
            .insert([newWallpaper])
            .select();
            
        if (error) throw error;
        
        // Add to local array
        if (data && data.length > 0) {
            wallpapers.unshift(data[0]);
            renderWallpaperGrid();
            
            // Generate individual page for new wallpaper
            generateWallpaperPage(data[0]);
        }
        
        alert('Wallpaper uploaded successfully!');
        closeAdminPanel();
        
    } catch (error) {
        console.error('Error uploading wallpaper:', error);
        alert('Error uploading wallpaper. Please try again.');
    }
}

async function updateBlogContent() {
    const wallpaperId = parseInt(wallpaperSelect.value);
    const blogContent = document.getElementById('editBlogContent').value.trim();
    
    if (!wallpaperId) {
        alert('Please select a wallpaper');
        return;
    }
    
    try {
        // Update in Supabase
        const { error } = await supabase
            .from('wallpapers')
            .update({ blogContent })
            .eq('id', wallpaperId);
            
        if (error) throw error;
        
        // Update local array
        const wallpaper = wallpapers.find(w => w.id === wallpaperId);
        if (wallpaper) {
            wallpaper.blogContent = blogContent;
            // If currently viewing this wallpaper, update the display
            if (currentWallpaper && currentWallpaper.id === wallpaperId) {
                document.getElementById('blogText').textContent = blogContent;
            }
        }
        
        alert('Blog content updated successfully!');
        
    } catch (error) {
        console.error('Error updating blog content:', error);
        alert('Error updating blog content. Please try again.');
    }
}

function clearAdminForm() {
    document.getElementById('adminTitle').value = '';
    document.getElementById('adminCategory').value = 'nature';
    document.getElementById('adminTags').value = '';
    document.getElementById('adminAlt').value = '';
    document.getElementById('adminDescription').value = '';
    document.getElementById('adminBlog').value = '';
    adminImage.value = '';
    imagePreview.innerHTML = '';
    document.getElementById('editBlogContent').value = '';
    wallpaperSelect.value = '';
}
