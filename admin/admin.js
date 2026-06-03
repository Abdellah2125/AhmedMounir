// ========================================
// ADMIN PANEL - COMPLETE CODE
// Portfolio Management System with Cloud Sync
// ========================================

let projects = [];
let isLoggedIn = false;

// Default credentials (يمكنك تغييرها)
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// Cloud sync variables
let githubToken = '';
let gistId = '';

// ========================================
// 1. LOGIN SYSTEM (نظام تسجيل الدخول)
// ========================================

function checkLoginStatus() {
    // إلغاء التحقق من تسجيل الدخول
    isLoggedIn = true;
    showAdminPanel();
}

function showLoginPanel() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('fabButton').style.display = 'none';
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    document.getElementById('fabButton').style.display = 'flex';
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    // اظهار زر الاعدادات
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.style.display = 'block';

    loadProjects();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        isLoggedIn = true;
        loginError.classList.remove('show');
        showAdminPanel();
        showMessage('Login successful! Welcome back.', 'success');
    } else {
        loginError.classList.add('show');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_logged_in');
        isLoggedIn = false;
        showLoginPanel();
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        showMessage('Logged out successfully.', 'success');
    }
}

// ========================================
// 2. PROJECT MANAGEMENT (إدارة المشاريع)
// ========================================

function loadProjects() {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
        projects = JSON.parse(stored);
    } else {
        projects = [
            {
                id: 'graphicare',
                title: 'GraphiCare',
                category: 'Poster Design',
                mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd96a01e51df93e35168c5_GraphiCare%20Full.png',
                galleryImages: ['https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/64fd9699cf6f93409fcdc41e_Strong%20Opioid-p-1080.png']
            },
            {
                id: 'snickers',
                title: 'Snickers IceCream',
                category: 'Packaging Design',
                mainImage: 'https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6585ffa1c97f93094f703bbc_Snickers-Logo.jpg',
                galleryImages: ['https://cdn.prod.website-files.com/64b9051572782f01aaaf93e1/6501ded44095db4fb51185e2_Snickers%20Mockup%202-p-1080.png']
            }
        ];
        saveProjects();
    }
    displayProjects();
}

function saveProjects() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

function displayProjects() {
    const container = document.getElementById('projectsList');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px;">No projects yet. Click "+" to add your first project!</p>';
        return;
    }

    const tableHTML = `
        <table class="projects-table">
            <thead>
                <tr><th>Project</th><th>Category</th><th>Images</th><th>Actions</th></tr>
            </thead>
            <tbody>
                ${projects.map(project => `
                    <tr>
                        <td><strong>${escapeHtml(project.title)}</strong></td>
                        <td>${escapeHtml(project.category)}</td>
                        <td>${project.galleryImages.length} images</td>
                        <td class="project-actions">
                            <button onclick="editProject('${project.id}')" class="edit-btn">Edit</button>
                            <button onclick="deleteProject('${project.id}')" class="delete-btn">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    container.innerHTML = tableHTML;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectId').value = '';
    document.getElementById('projectModal').style.display = 'flex';
}

function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectId').value = project.id;
    document.getElementById('title').value = project.title;
    document.getElementById('category').value = project.category;
    document.getElementById('mainImage').value = project.mainImage || '';
    document.getElementById('galleryImages').value = project.galleryImages.join('\n');
    document.getElementById('projectModal').style.display = 'flex';
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        saveProjects();
        displayProjects();
        showMessage('Project deleted successfully!', 'success');
    }
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
}

function showMessage(msg, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = msg;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        messageEl.className = 'message';
    }, 3000);
}

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

document.getElementById('projectForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('projectId').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const mainImage = document.getElementById('mainImage').value;
    const galleryImages = document.getElementById('galleryImages').value.split('\n').filter(url => url.trim());

    const projectData = {
        id: id || generateSlug(title),
        title: title,
        category: category,
        mainImage: mainImage,
        galleryImages: galleryImages
    };

    if (id) {
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) projects[index] = projectData;
    } else {
        projects.push(projectData);
    }

    saveProjects();
    displayProjects();
    closeModal();
    showMessage(`Project "${title}" saved successfully!`, 'success');
});

// ========================================
// 3. CLOUD SYNC (المزامنة مع السحابة)
// ========================================

function loadCloudSettings() {
    const savedToken = localStorage.getItem('github_token');
    const savedGistId = localStorage.getItem('gist_id');
    if (savedToken) githubToken = savedToken;
    if (savedGistId) gistId = savedGistId;
}

function saveCloudSettings(token, gist) {
    if (token) {
        githubToken = token;
        localStorage.setItem('github_token', token);
    }
    if (gist) {
        gistId = gist;
        localStorage.setItem('gist_id', gist);
    }
    showMessage('Cloud settings saved!', 'success');
}

function openSettingsModal() {
    document.getElementById('settingsToken').value = githubToken || '';
    document.getElementById('settingsGistId').value = gistId || '';
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

// رفع المشاريع إلى السحابة
async function syncToCloud() {
    if (!githubToken) {
        showMessage('Please configure GitHub Token in Settings first!', 'error');
        openSettingsModal();
        return;
    }
    
    showMessage('Syncing to cloud...', 'success');
    
    const data = {
        projects: projects,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
    };
    
    const content = JSON.stringify(data, null, 2);
    
    try {
        if (gistId) {
            // تحديث ملف موجود
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: { 'portfolio_data.json': { content: content } }
                })
            });
            
            if (response.ok) {
                showMessage('Successfully synced to cloud! ✅', 'success');
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        } else {
            // إنشاء ملف جديد
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: 'Portfolio Projects Backup',
                    public: false,
                    files: { 'portfolio_data.json': { content: content } }
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                gistId = result.id;
                localStorage.setItem('gist_id', gistId);
                showMessage('Created new cloud backup! ✅', 'success');
            } else {
                const error = await response.json();
                throw new Error(error.message);
            }
        }
    } catch (error) {
        showMessage(`Sync failed: ${error.message}`, 'error');
    }
}

// تحميل المشاريع من السحابة
async function syncFromCloud() {
    if (!githubToken) {
        showMessage('Please configure GitHub Token in Settings first!', 'error');
        openSettingsModal();
        return;
    }
    
    if (!gistId) {
        showMessage('No Gist ID found. Please sync to cloud first!', 'error');
        return;
    }
    
    showMessage('Fetching from cloud...', 'success');
    
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: { 'Authorization': `token ${githubToken}` }
        });
        
        if (response.ok) {
            const gist = await response.json();
            const content = gist.files['portfolio_data.json']?.content;
            
            if (content) {
                const data = JSON.parse(content);
                if (data.projects) {
                    projects = data.projects;
                    saveProjects();
                    displayProjects();
                    showMessage(`Synced! Loaded ${data.projects.length} projects. ✅`, 'success');
                }
            }
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        showMessage(`Sync failed: ${error.message}`, 'error');
    }
}

// ========================================
// 4. EXPORT/IMPORT (نسخ احتياطي محلي)
// ========================================

function exportAllData() {
    const data = {
        projects: projects,
        version: '1.0',
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Data exported successfully!', 'success');
}

function importAllData(input) {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.projects) {
                projects = data.projects;
                saveProjects();
                displayProjects();
                showMessage('Data imported successfully!', 'success');
            } else {
                showMessage('Invalid backup file format', 'error');
            }
        } catch (error) {
            showMessage('Error parsing backup file', 'error');
        }
    };
    reader.readAsText(file);
}

// ========================================
// 5. EVENT LISTENERS (مستمعات الأحداث)
// ========================================

document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = document.getElementById('settingsToken').value;
    const gist = document.getElementById('settingsGistId').value;
    saveCloudSettings(token, gist);
    closeSettingsModal();
});

// ========================================
// 6. INITIALIZATION (بدء التشغيل)
// ========================================

loadCloudSettings();
checkLoginStatus();

window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target === modal) closeModal();
    const settingsModal = document.getElementById('settingsModal');
    if (event.target === settingsModal) closeSettingsModal();
};