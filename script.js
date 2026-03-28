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
    // This function is disabled to prevent JavaScript errors
    console.log('Page generation disabled for stability');
}

// Generate a single wallpaper page
function generateWallpaperPage(wallpaper) {
    // This function is disabled to prevent JavaScript errors
    console.log('Page generation disabled for stability');
    alert('Wallpaper page generation is temporarily disabled. Please use the main interface.');
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
        // Show simple alert for now - detailed view can be added later
        alert(`Wallpaper: ${wallpaper.title}\n\nCategory: ${wallpaper.category}\nTags: ${wallpaper.tags.join(', ')}\n\nDescription: ${wallpaper.description || 'No description'}\n\nLikes: ${wallpaper.likes || 0}`);
    };

    const isLiked = likedWallpapers.includes(wallpaper.id);

    card.innerHTML = `
        <img src="${wallpaper.thumbnail_url || wallpaper.image_url || ''}" alt="${wallpaper.alt || wallpaper.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'">
        <div class="wallpaper-card-info">
            <h3 class="wallpaper-card-title">${wallpaper.title}</h3>
            <div class="wallpaper-card-tags">
                ${(wallpaper.tags || []).slice(0, 3).map(tag => 
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
    const usernameSelector = document.getElementById('usernameSelector');
    
    if (currentUser) {
        if (usernameSelector) usernameSelector.classList.add('hidden');
        userDisplay.classList.remove('hidden');
        currentUsername.textContent = currentUser;
        
        if (isAdmin) {
            adminPanelBtn.classList.remove('hidden');
        } else {
            adminPanelBtn.classList.add('hidden');
        }
    } else {
        if (usernameSelector) usernameSelector.classList.remove('hidden');
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
