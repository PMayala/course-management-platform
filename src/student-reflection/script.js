const translations = {
    en: {
        page_title: 'Student Reflection',
        draft_saved: 'Draft saved!',
        clear_confirm: 'Are you sure you want to clear the form?',
        validation_error: 'Please fill out all fields.',
        submit_reflection: 'Submit Reflection',
        loading: 'Loading...'
    },
    fr: {
        page_title: 'Réflexion Étudiante',
        draft_saved: 'Brouillon enregistré!',
        clear_confirm: 'Êtes-vous sûr de vouloir effacer le formulaire?',
        validation_error: 'Veuillez remplir tous les champs.',
        submit_reflection: 'Soumettre la Réflexion',
        loading: 'Chargement...'
    }
};

class ReflectionApp {
    constructor() {
        this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage() || 'en';
        this.formData = this.loadDraft();
        this.autoSaveTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadLanguage(this.currentLang);
        this.loadFormData();
        this.setupAutoSave();
        
        // Add fade-in animation to body
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    }
    
    setupEventListeners() {
        // Language switcher
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
        
        // Form submission
        const form = document.getElementById('reflectionForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
        
        // Save draft button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveDraft();
            this.showNotification(this.translate('draft_saved'));
        });
        
        // Clear form button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });
        
        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Close modal on background click
        document.getElementById('successModal').addEventListener('click', (e) => {
            if (e.target.id === 'successModal') {
                this.closeModal();
            }
        });
        
        // Auto-save on input
        form.addEventListener('input', () => {
            this.scheduleAutoSave();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveDraft();
                this.showNotification(this.translate('draft_saved'));
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        this.storeLanguage(lang);
        this.loadLanguage(lang);
        
        // Update active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Add subtle animation
        document.body.style.transform = 'translateY(-2px)';
        setTimeout(() => {
            document.body.style.transform = 'translateY(0)';
        }, 150);
    }
    
    loadLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.dataset.translate;
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update placeholders separately
        const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.dataset.translatePlaceholder;
            element.placeholder = this.translate(key);
        });
        
        // Update page title
        document.title = this.translate('page_title');
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    translate(key) {
        return translations[this.currentLang]?.[key] || translations.en[key] || key;
    }
    
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    
    getStoredLanguage() {
        return localStorage.getItem('reflection_language');
    }
    
    storeLanguage(lang) {
        localStorage.setItem('reflection_language', lang);
    }
    
    setupAutoSave() {
        // Auto-save every 30 seconds
        setInterval(() => {
            if (this.hasFormData()) {
                this.saveDraft(true); // Silent save
                this.showAutoSaveIndicator();
            }
        }, 30000);
    }
    
    scheduleAutoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            if (this.hasFormData()) {
                this.saveDraft(true);
                this.showAutoSaveIndicator();
            }
        }, 3000); // Auto-save 3 seconds after user stops typing
    }
    
    hasFormData() {
        const form = document.getElementById('reflectionForm');
        const formData = new FormData(form);
        return Array.from(formData.values()).some(value => value.trim() !== '');
    }
    
    saveDraft(silent = false) {
        const form = document.getElementById('reflectionForm');
        const formData = new FormData(form);
        const data = {
            question1: formData.get('question1') || '',
            question2: formData.get('question2') || '',
            question3: formData.get('question3') || '',
            timestamp: new Date().toISOString(),
            language: this.currentLang
        };
        
        localStorage.setItem('reflection_draft', JSON.stringify(data));
        
        if (!silent) {
            this.showNotification(this.translate('draft_saved'));
        }
    }
    
    loadDraft() {
        const stored = localStorage.getItem('reflection_draft');
        return stored ? JSON.parse(stored) : null;
    }
    
    loadFormData() {
        if (!this.formData) return;
        
        document.getElementById('question1').value = this.formData.question1 || '';
        document.getElementById('question2').value = this.formData.question2 || '';
        document.getElementById('question3').value = this.formData.question3 || '';
    }
    
    clearForm() {
        if (!confirm(this.translate('clear_confirm'))) {
            return;
        }
        
        document.getElementById('reflectionForm').reset();
        localStorage.removeItem('reflection_draft');
        
        // Add clear animation
        const form = document.getElementById('reflectionForm');
        form.style.transform = 'scale(0.98)';
        form.style.opacity = '0.5';
        setTimeout(() => {
            form.style.transform = 'scale(1)';
            form.style.opacity = '1';
        }, 200);
    }
    
    validateForm() {
        const form = document.getElementById('reflectionForm');
        const formData = new FormData(form);
        
        const question1 = formData.get('question1')?.trim();
        const question2 = formData.get('question2')?.trim();
        const question3 = formData.get('question3')?.trim();
        
        return question1 && question2 && question3;
    }
    
    submitForm() {
        if (!this.validateForm()) {
            this.showNotification(this.translate('validation_error'), 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('[data-translate="submit_reflection"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = this.translate('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Clear draft on successful submission
            localStorage.removeItem('reflection_draft');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success modal
            this.showSuccessModal();
            
            // Log submission (in real app, this would be an API call)
            this.logSubmission();
        }, 2000);
    }
    
    logSubmission() {
        const form = document.getElementById('reflectionForm');
        const formData = new FormData(form);
        
        const submission = {
            responses: {
                question1: formData.get('question1'),
                question2: formData.get('question2'),
                question3: formData.get('question3')
            },
            metadata: {
                timestamp: new Date().toISOString(),
                language: this.currentLang,
                userAgent: navigator.userAgent,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };
        
        console.log('Reflection submitted:', submission);
        
        // In a real application, you would send this to your backend:
        // fetch('/api/reflections', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(submission)
        // });
    }
    
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'block';
        
        // Focus management for accessibility
        const closeButton = document.getElementById('closeModal');
        closeButton.focus();
        
        // Trap focus within modal
        this.trapFocus(modal);
    }
    
    closeModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'none';
        
        // Return focus to submit button
        document.querySelector('[data-translate="submit_reflection"]').focus();
    }
    
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    showAutoSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        indicator.classList.add('show');
        
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }
    
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '500',
            zIndex: '1001',
            transform: 'translateY(-10px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-10px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reflectionApp = new ReflectionApp();
});

// Handle page visibility changes (pause auto-save when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Save draft when user switches tabs
        if (window.reflectionApp && window.reflectionApp.hasFormData()) {
            window.reflectionApp.saveDraft(true);
        }
    }
});
