// Admin Dashboard JavaScript
// Handles authentication, package CRUD operations, and UI interactions

const API_BASE = window.location.origin;
let authToken = localStorage.getItem('adminToken');
let currentPackages = [];
let editingPackageId = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardUsername = document.getElementById('dashboardUsername');
const addPackageBtn = document.getElementById('addPackageBtn');
const packageModal = document.getElementById('packageModal');
const packageForm = document.getElementById('packageForm');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalError = document.getElementById('modalError');
const packagesTableBody = document.getElementById('packagesTableBody');
const packagesTableContainer = document.getElementById('packagesTableContainer');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const featuresList = document.getElementById('featuresList');
const addFeatureBtn = document.getElementById('addFeatureBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        verifyToken();
    } else {
        showLoginPage();
    }
});

// Show login page
function showLoginPage() {
    loginPage.classList.remove('hidden');
    dashboard.classList.remove('active');
}

// Show dashboard
function showDashboard(username) {
    loginPage.classList.add('hidden');
    dashboard.classList.add('active');
    dashboardUsername.textContent = username;
    loadPackages();
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    hideError(loginError);
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard(data.user.username);
        } else {
            showError(loginError, data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, 'Connection error. Please try again.');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Verify token
async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showDashboard(data.user.username);
        } else {
            logout();
        }
    } catch (error) {
        console.error('Token verification error:', error);
        logout();
    }
}

// Logout
logoutBtn.addEventListener('click', logout);

function logout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLoginPage();
    loginForm.reset();
}

// Load packages
async function loadPackages() {
    loadingState.classList.remove('hidden');
    packagesTableContainer.classList.add('hidden');
    emptyState.classList.add('hidden');
    
    try {
        const response = await fetch(`${API_BASE}/api/packages`);
        const data = await response.json();
        
        if (response.ok) {
            currentPackages = data.packages;
            renderPackages(currentPackages);
        } else {
            console.error('Failed to load packages:', data.error);
        }
    } catch (error) {
        console.error('Error loading packages:', error);
    } finally {
        loadingState.classList.add('hidden');
    }
}

// Render packages table
function renderPackages(packages) {
    if (packages.length === 0) {
        emptyState.classList.remove('hidden');
        packagesTableContainer.classList.add('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    packagesTableContainer.classList.remove('hidden');
    
    packagesTableBody.innerHTML = packages.map(pkg => `
        <tr>
            <td><strong>${escapeHtml(pkg.name)}</strong></td>
            <td>$${parseFloat(pkg.price).toFixed(2)}</td>
            <td>$${parseFloat(pkg.membership_price).toFixed(2)}/mo</td>
            <td>${Array.isArray(pkg.features) ? pkg.features.length : 0} features</td>
            <td>${pkg.display_order}</td>
            <td>
                ${pkg.is_featured ? '<span class="badge badge-featured">Featured</span>' : ''}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editPackage(${pkg.id})">Edit</button>
                    <button class="btn-icon btn-delete" onclick="deletePackage(${pkg.id}, '${escapeHtml(pkg.name)}')">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Add package button
addPackageBtn.addEventListener('click', () => {
    editingPackageId = null;
    modalTitle.textContent = 'Add New Package';
    packageForm.reset();
    clearFeatures();
    addFeature(''); // Add one empty feature field
    hideError(modalError);
    packageModal.classList.add('active');
});

// Close modal
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

function closeModal() {
    packageModal.classList.remove('active');
    packageForm.reset();
    editingPackageId = null;
}

// Edit package
window.editPackage = function(id) {
    const pkg = currentPackages.find(p => p.id === id);
    if (!pkg) return;
    
    editingPackageId = id;
    modalTitle.textContent = 'Edit Package';
    
    document.getElementById('packageId').value = pkg.id;
    document.getElementById('packageName').value = pkg.name;
    document.getElementById('packagePrice').value = pkg.price;
    document.getElementById('packageMembershipPrice').value = pkg.membership_price;
    document.getElementById('packageDescription').value = pkg.description || '';
    document.getElementById('packageSubscriptionUrl').value = pkg.subscription_url || '';
    document.getElementById('packageDisplayOrder').value = pkg.display_order || 0;
    document.getElementById('packageIsFeatured').checked = pkg.is_featured || false;
    
    // Load features
    clearFeatures();
    const features = Array.isArray(pkg.features) ? pkg.features : [];
    if (features.length === 0) {
        addFeature('');
    } else {
        features.forEach(feature => addFeature(feature));
    }
    
    hideError(modalError);
    packageModal.classList.add('active');
};

// Delete package
window.deletePackage = async function(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/packages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            loadPackages();
        } else {
            alert(`Failed to delete package: ${data.error}`);
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        alert('Failed to delete package. Please try again.');
    }
};

// Package form submission
packageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('packageName').value,
        price: parseFloat(document.getElementById('packagePrice').value),
        membership_price: parseFloat(document.getElementById('packageMembershipPrice').value),
        description: document.getElementById('packageDescription').value,
        subscription_url: document.getElementById('packageSubscriptionUrl').value,
        display_order: parseInt(document.getElementById('packageDisplayOrder').value) || 0,
        is_featured: document.getElementById('packageIsFeatured').checked,
        features: getFeatures()
    };
    
    const saveBtn = document.getElementById('savePackageBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    hideError(modalError);
    
    try {
        const url = editingPackageId 
            ? `${API_BASE}/api/packages/${editingPackageId}`
            : `${API_BASE}/api/packages`;
        
        const method = editingPackageId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeModal();
            loadPackages();
        } else {
            showError(modalError, data.error || 'Failed to save package');
        }
    } catch (error) {
        console.error('Error saving package:', error);
        showError(modalError, 'Connection error. Please try again.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Package';
    }
});

// Features management
addFeatureBtn.addEventListener('click', () => {
    addFeature('');
});

function addFeature(value = '') {
    const featureItem = document.createElement('div');
    featureItem.className = 'feature-item';
    featureItem.innerHTML = `
        <input type="text" placeholder="Enter feature" value="${escapeHtml(value)}">
        <button type="button" class="btn-remove-feature" onclick="removeFeature(this)">Remove</button>
    `;
    featuresList.appendChild(featureItem);
}

window.removeFeature = function(button) {
    button.parentElement.remove();
};

function getFeatures() {
    const inputs = featuresList.querySelectorAll('input');
    return Array.from(inputs)
        .map(input => input.value.trim())
        .filter(value => value !== '');
}

function clearFeatures() {
    featuresList.innerHTML = '';
}

// Utility functions
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

function hideError(element) {
    element.classList.add('hidden');
    element.textContent = '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal on outside click
packageModal.addEventListener('click', (e) => {
    if (e.target === packageModal) {
        closeModal();
    }
});

