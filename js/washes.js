// Washes page - Dynamic package loading from API
const API_BASE = window.location.origin;

// Load packages on page load
document.addEventListener('DOMContentLoaded', loadPackages);

async function loadPackages() {
    const pricingGrid = document.getElementById('pricingGrid');
    const loadingCard = document.getElementById('loadingCard');
    
    if (!pricingGrid) {
        console.error('Pricing grid not found');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/packages`);
        const data = await response.json();
        
        if (response.ok && data.packages && data.packages.length > 0) {
            // Remove loading card
            if (loadingCard) {
                loadingCard.remove();
            }
            
            // Render packages from database
            renderPackages(data.packages, pricingGrid);
        } else {
            console.error('Failed to load packages:', data.error);
            showError(pricingGrid, 'Unable to load packages. Please try again later.');
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        showError(pricingGrid, 'Unable to connect to server. Please check your connection and try again.');
    }
}

function showError(container, message) {
    container.innerHTML = `
        <div class="pricing-card" style="grid-column: 1 / -1; text-align: center;">
            <h3 style="color: #EF4444;">⚠️ Error Loading Packages</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">Retry</button>
        </div>
    `;
}

function renderPackages(packages, container) {
    // Clear all existing content
    container.innerHTML = '';
    
    // Sort packages by display_order
    packages.sort((a, b) => a.display_order - b.display_order);
    
    // Render each package
    packages.forEach(pkg => {
        const card = createPackageCard(pkg);
        container.appendChild(card);
    });
}

function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'pricing-card';
    
    if (pkg.is_featured) {
        card.classList.add('featured');
    }
    
    // Parse features
    let features = [];
    if (typeof pkg.features === 'string') {
        try {
            features = JSON.parse(pkg.features);
        } catch (e) {
            features = [];
        }
    } else if (Array.isArray(pkg.features)) {
        features = pkg.features;
    }
    
    // Build features list HTML
    const featuresHTML = features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('');
    
    // Build card HTML
    card.innerHTML = `
        ${pkg.is_featured ? '<div class="popular-badge">Most Value</div>' : ''}
        <h3>${escapeHtml(pkg.name)}</h3>
        <div class="price">$${parseFloat(pkg.price).toFixed(0)}</div>
        <p>${escapeHtml(pkg.description || '')}</p>
        <ul>
            ${featuresHTML}
        </ul>
        <div class="unlimited-price">
            <span class="unlimited-label">Unlimited Membership:</span>
            <span class="unlimited-amount">$${parseFloat(pkg.membership_price).toFixed(2)}/month</span>
        </div>
        ${pkg.subscription_url ? `
            <a href="${escapeHtml(pkg.subscription_url)}" class="btn btn-primary subscription-btn" target="_blank" rel="noopener noreferrer">Subscribe Now</a>
        ` : ''}
    `;
    
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

