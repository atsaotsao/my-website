// Name rotation script - save as: static/name-rotation.js
console.log('🔄 Name rotation script loaded');

function initNameRotation() {
    console.log('🚀 Initializing name rotation...');
    
    // Try multiple selectors to find the title
    const selectors = [
        '.page-title a',
        '.page-title',
        'h2.page-title a',
        'h2.page-title',
        '.sidebar.left .page-title a',
        '.sidebar.left .page-title'
    ];
    
    let titleElement = null;
    for (const selector of selectors) {
        titleElement = document.querySelector(selector);
        if (titleElement) {
            console.log(`📍 Found title element with selector: ${selector}`);
            break;
        }
    }
    
    if (!titleElement) {
        console.log('❌ No title element found with any selector');
        // Debug: show all potential elements
        const allElements = document.querySelectorAll('h1, h2, h3, [class*="title"], [class*="page"]');
        console.log('🔍 All potential elements:', allElements);
        return;
    }
    
    const currentText = titleElement.textContent.trim();
    console.log('📝 Current title text:', currentText);
    
    // Check if this looks like the name we want to rotate
    if (currentText.includes('Andrew') || currentText.includes('Tsao') || currentText === 'Andrew Tsao') {
        console.log('✅ Setting up name rotation for:', currentText);
        
        // Create the rotating name structure
        titleElement.innerHTML = `
            <span class="name-full active">Andrew Tsao</span>
            <span class="name-nick">Atsao</span>
            <span class="name-zh">曹明鑫</span>
        `;
        
        let currentName = 0; // 0 = full, 1 = nick, 2 = chinese
        const names = ['name-full', 'name-nick', 'name-zh'];
        const displayNames = ['Andrew Tsao', 'Atsao', '曹明鑫'];
        
        console.log('🎬 Starting rotation animation');
        console.log('Initial name displayed:', displayNames[currentName]);
        
        // Set up the rotation interval
        const rotateInterval = setInterval(() => {
            // Hide current name
            const currentElement = titleElement.querySelector(`.${names[currentName]}`);
            if (currentElement) {
                currentElement.classList.remove('active');
            }
            
            // Move to next name
            currentName = (currentName + 1) % 3;
            
            // Show next name
            const nextElement = titleElement.querySelector(`.${names[currentName]}`);
            if (nextElement) {
                nextElement.classList.add('active');
                console.log(`🔄 Rotated to: ${displayNames[currentName]}`);
            } else {
                console.log('❌ Could not find element for:', names[currentName]);
            }
        }, 3000); // Change every 3 seconds
        
        // Store interval for cleanup
        if (window.nameRotationInterval) {
            clearInterval(window.nameRotationInterval);
        }
        window.nameRotationInterval = rotateInterval;
        
        console.log('✅ Name rotation setup complete');
        
    } else {
        console.log('❌ Title text does not match expected format. Found:', currentText);
        console.log('Expected text containing "Andrew" or "Tsao"');
    }
}

// Function to clean up previous rotations
function cleanupNameRotation() {
    if (window.nameRotationInterval) {
        clearInterval(window.nameRotationInterval);
        window.nameRotationInterval = null;
        console.log('🧹 Cleaned up previous name rotation');
    }
}

// Handle Quartz SPA navigation
function setupNavigationHandlers() {
    // Quartz navigation event
    document.addEventListener('nav', () => {
        console.log('🧭 Quartz SPA navigation detected');
        cleanupNameRotation();
        setTimeout(initNameRotation, 200);
    });
    
    // Browser navigation
    window.addEventListener('popstate', () => {
        console.log('⬅️ Browser navigation detected');
        cleanupNameRotation();
        setTimeout(initNameRotation, 200);
    });
    
    console.log('🎯 Navigation handlers set up');
}

// Multiple initialization strategies
function startNameRotation() {
    console.log('🎯 Starting name rotation system');
    
    // Immediate attempt
    initNameRotation();
    
    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM ready - attempting name rotation');
            setTimeout(initNameRotation, 100);
        });
    }
    
    // Window load
    if (document.readyState !== 'complete') {
        window.addEventListener('load', () => {
            console.log('🪟 Window loaded - attempting name rotation');
            setTimeout(initNameRotation, 200);
        });
    }
    
    // Delayed attempts for SPA
    const delays = [500, 1000, 2000];
    delays.forEach((delay, index) => {
        setTimeout(() => {
            console.log(`⏰ Delayed attempt #${index + 1} (${delay}ms)`);
            initNameRotation();
        }, delay);
    });
    
    // Set up navigation handlers
    setupNavigationHandlers();
    
    console.log('🚀 All name rotation strategies initiated');
}

// Start everything
startNameRotation();