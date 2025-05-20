/**
 * Cookie Consent Banner Component
 */

// CSS for the cookie consent banner
const cookieConsentStyles = `
.cookie-consent {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(10, 10, 30, 0.95);
    backdrop-filter: blur(10px);
    color: #fff;
    padding: 20px;
    z-index: 9999;
    border-top: 1px solid rgba(255, 42, 109, 0.3);
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.4);
    transform: translateY(100%);
    transition: transform 0.5s ease;
    font-family: 'Montserrat', sans-serif;
}

.cookie-consent.visible {
    transform: translateY(0);
}

.cookie-consent__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.cookie-consent__content {
    flex: 1 1 60%;
}

.cookie-consent__title {
    font-size: 20px;
    margin-bottom: 10px;
    color: #05D9E8;
}

.cookie-consent__text {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 10px;
}

.cookie-consent__links {
    font-size: 14px;
}

.cookie-consent__links a {
    color: #FF2A6D;
    text-decoration: none;
    margin-right: 15px;
}

.cookie-consent__links a:hover {
    text-decoration: underline;
}

.cookie-consent__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.cookie-consent__button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cookie-consent__button--accept {
    background: linear-gradient(45deg, #FF2A6D, #D264B6);
    color: white;
}

.cookie-consent__button--customize,
.cookie-consent__button--reject {
    background: transparent;
    border: 1px solid #05D9E8;
    color: #05D9E8;
}

.cookie-consent__button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 42, 109, 0.3);
}

@media (max-width: 768px) {
    .cookie-consent__container {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .cookie-consent__actions {
        width: 100%;
        justify-content: space-between;
    }
}
`;

// Add the styles to the document
function addCookieConsentStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = cookieConsentStyles;
    document.head.appendChild(styleElement);
}

// Cookie banner HTML
const cookieConsentHTML = `
<div class="cookie-consent" id="cookieConsent">
    <div class="cookie-consent__container">
        <div class="cookie-consent__content">
            <h3 class="cookie-consent__title">We Value Your Privacy</h3>
            <p class="cookie-consent__text">This website uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies as described in our Cookie Policy.</p>
            <div class="cookie-consent__links">
                <a href="/privacy-policy.html">Privacy Policy</a>
                <a href="/cookie-policy.html">Cookie Policy</a>
            </div>
        </div>
        <div class="cookie-consent__actions">
            <button class="cookie-consent__button cookie-consent__button--accept" id="acceptCookies">Accept All</button>
            <button class="cookie-consent__button cookie-consent__button--customize" id="customizeCookies">Customize</button>
            <button class="cookie-consent__button cookie-consent__button--reject" id="rejectCookies">Reject All</button>
        </div>
    </div>
</div>
`;

// Cookie functions
const CookieConsent = {
    // Check if user has already set cookie preferences
    hasConsent: function() {
        return localStorage.getItem('bigcane_cookie_consent') !== null;
    },
    
    // Set cookie consent
    setConsent: function(level) {
        // level can be 'all', 'necessary', or 'none'
        localStorage.setItem('bigcane_cookie_consent', level);
        localStorage.setItem('bigcane_cookie_timestamp', new Date().toISOString());
        
        // In a real application, this would enable/disable various tracking scripts
        if (level === 'all') {
            console.log('All cookies enabled');
            // Enable analytics, marketing cookies, etc.
        } else if (level === 'necessary') {
            console.log('Only necessary cookies enabled');
            // Disable analytics, marketing cookies, etc.
        } else {
            console.log('All cookies disabled');
            // Disable all non-essential cookies
        }
    },
    
    // Initialize the cookie banner
    initBanner: function() {
        // Don't show banner if consent is already given
        if (this.hasConsent()) {
            return;
        }
        
        // Add styles
        addCookieConsentStyles();
        
        // Create banner element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cookieConsentHTML;
        document.body.appendChild(tempDiv.firstElementChild);
        
        // Get the banner element
        const banner = document.getElementById('cookieConsent');
        
        // Add event listeners
        document.getElementById('acceptCookies').addEventListener('click', () => {
            this.setConsent('all');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
        });
        
        document.getElementById('customizeCookies').addEventListener('click', () => {
            // In a real application, this would open a modal with detailed cookie settings
            // For now, we'll just set it to necessary cookies
            this.setConsent('necessary');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
        });
        
        document.getElementById('rejectCookies').addEventListener('click', () => {
            this.setConsent('none');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
        });
        
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('visible');
        }, 1000);
    }
};

// Initialize cookie banner when the page loads
document.addEventListener('DOMContentLoaded', function() {
    CookieConsent.initBanner();
});

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieConsent;
}
