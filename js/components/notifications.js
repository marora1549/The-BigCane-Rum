/**
 * Notification System
 * 
 * This module provides a lightweight notification system for displaying
 * toast-style messages to users across the website.
 * 
 * @version 1.0.0
 * @updated 2025-05-18
 */

(function() {
    // Execute when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initNotificationSystem();
    });

    /**
     * Initialize the notification system
     */
    function initNotificationSystem() {
        // Create container for notifications if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Add notification styles
        addNotificationStyles();
        
        // Make the showNotification function globally available
        window.showNotification = showNotification;
    }
    
    /**
     * Show a notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
     * @param {number} duration - Time in milliseconds before notification auto-dismisses (default: 4000)
     */
    function showNotification(title, message, type = 'info', duration = 4000) {
        // Get the notification container
        const container = document.querySelector('.notification-container');
        if (!container) return;
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.setAttribute('role', 'alert');
        
        // Get icon based on type
        const icon = getNotificationIcon(type);
        
        // Add notification HTML
        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">
                    <i class="${icon}"></i>
                </div>
                <div class="notification__text">
                    <h3 class="notification__title">${title}</h3>
                    <p class="notification__message">${message}</p>
                </div>
            </div>
            <button class="notification__close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification__progress"></div>
        `;
        
        // Add to container
        container.appendChild(notification);
        
        // Set up progress bar animation
        const progressBar = notification.querySelector('.notification__progress');
        progressBar.style.animationDuration = `${duration}ms`;
        
        // Set up close button
        const closeButton = notification.querySelector('.notification__close');
        closeButton.addEventListener('click', () => {
            dismissNotification(notification);
        });
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('notification--visible');
        }, 10);
        
        // Auto-dismiss after duration
        const dismissTimeout = setTimeout(() => {
            dismissNotification(notification);
        }, duration);
        
        // Pause auto-dismiss on hover
        notification.addEventListener('mouseenter', () => {
            progressBar.style.animationPlayState = 'paused';
            clearTimeout(dismissTimeout);
        });
        
        // Resume auto-dismiss when mouse leaves
        notification.addEventListener('mouseleave', () => {
            progressBar.style.animationPlayState = 'running';
            
            const remainingTime = duration * (1 - getComputedStyle(progressBar).width.replace('px', '') / notification.offsetWidth);
            
            setTimeout(() => {
                dismissNotification(notification);
            }, remainingTime);
        });
        
        // Return the notification element in case the caller wants to do something with it
        return notification;
    }
    
    /**
     * Dismiss a notification with animation
     * @param {HTMLElement} notification - The notification element to dismiss
     */
    function dismissNotification(notification) {
        // Only dismiss if the notification exists and is visible
        if (!notification || !notification.classList.contains('notification--visible')) return;
        
        // Add dismissing class for animation
        notification.classList.add('notification--dismissing');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    /**
     * Get the appropriate icon for a notification type
     * @param {string} type - Notification type
     * @returns {string} FontAwesome icon class
     */
    function getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'info':
            default:
                return 'fas fa-info-circle';
        }
    }
    
    /**
     * Add the styles for notifications
     */
    function addNotificationStyles() {
        // Check if styles already exist
        if (document.getElementById('notification-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        
        styleElement.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
                width: calc(100% - 40px);
                pointer-events: none;
            }
            
            .notification {
                background-color: rgba(10, 10, 10, 0.95);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.2);
                padding: 15px;
                transform: translateX(120%);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                border-left: 3px solid var(--electric-blue, #05D9E8);
                position: relative;
                pointer-events: auto;
                max-width: 100%;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .notification--visible {
                transform: translateX(0);
            }
            
            .notification--dismissing {
                transform: translateX(120%);
            }
            
            .notification__content {
                display: flex;
                gap: 15px;
                align-items: flex-start;
            }
            
            .notification__icon {
                font-size: 20px;
                color: var(--electric-blue, #05D9E8);
                margin-top: 2px;
            }
            
            .notification__text {
                flex-grow: 1;
            }
            
            .notification__title {
                font-size: 16px;
                font-weight: 600;
                margin: 0 0 5px 0;
                color: var(--starlight-pearl, #F0F0F0);
            }
            
            .notification__message {
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
                color: var(--starlight-pearl, #F0F0F0);
                opacity: 0.8;
            }
            
            .notification__close {
                position: absolute;
                top: 12px;
                right: 12px;
                background: transparent;
                border: none;
                color: var(--starlight-pearl, #F0F0F0);
                opacity: 0.6;
                cursor: pointer;
                font-size: 14px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: opacity 0.3s ease, background-color 0.3s ease;
            }
            
            .notification__close:hover {
                opacity: 1;
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .notification__progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(to right, var(--electric-blue, #05D9E8), var(--neon-pink, #FF2A6D));
                width: 100%;
                transform-origin: left;
                animation: progress-bar 4000ms linear forwards;
            }
            
            @keyframes progress-bar {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            /* Notification Types */
            .notification--success {
                border-left-color: #28c76f;
            }
            
            .notification--success .notification__icon {
                color: #28c76f;
            }
            
            .notification--success .notification__progress {
                background: linear-gradient(to right, #28c76f, #48da89);
            }
            
            .notification--error {
                border-left-color: var(--neon-pink, #FF2A6D);
            }
            
            .notification--error .notification__icon {
                color: var(--neon-pink, #FF2A6D);
            }
            
            .notification--error .notification__progress {
                background: linear-gradient(to right, var(--neon-pink, #FF2A6D), var(--neon-purple, #D264B6));
            }
            
            .notification--warning {
                border-left-color: #FF9F43;
            }
            
            .notification--warning .notification__icon {
                color: #FF9F43;
            }
            
            .notification--warning .notification__progress {
                background: linear-gradient(to right, #FF9F43, #FFB976);
            }
            
            .notification--info {
                border-left-color: var(--electric-blue, #05D9E8);
            }
            
            .notification--info .notification__icon {
                color: var(--electric-blue, #05D9E8);
            }
            
            .notification--info .notification__progress {
                background: linear-gradient(to right, var(--electric-blue, #05D9E8), #7BE0E9);
            }
            
            /* Responsive Styles */
            @media (max-width: 480px) {
                .notification-container {
                    top: 10px;
                    right: 10px;
                    max-width: calc(100% - 20px);
                    width: calc(100% - 20px);
                }
                
                .notification {
                    padding: 12px;
                    padding-right: 30px;
                }
                
                .notification__icon {
                    font-size: 18px;
                }
                
                .notification__title {
                    font-size: 14px;
                }
                
                .notification__message {
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(styleElement);
    }
})();