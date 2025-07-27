const translations = {
    en: {
        // Page elements
        page_title: "Course Reflection",
        welcome_title: "Welcome to Your Course Reflection",
        welcome_message: "Take a moment to reflect on your learning journey. Your thoughts and feedback are valuable for improving the course experience.",
        
        // Questions
        question1_label: "What did you enjoy most about this course?",
        question1_placeholder: "Share what aspects of the course you found most engaging and enjoyable...",
        
        question2_label: "What was the most challenging part of the course?",
        question2_placeholder: "Describe the challenges you faced and how you overcame them...",
        
        question3_label: "What suggestions do you have for improving this course?",
        question3_placeholder: "Share your ideas for making this course even better for future students...",
        
        // Buttons and actions
        save_draft: "Save Draft",
        clear_form: "Clear Form",
        submit_reflection: "Submit Reflection",
        close: "Close",
        
        // Status messages
        auto_saved: "Draft auto-saved",
        success_title: "Reflection Submitted Successfully!",
        success_message: "Thank you for sharing your thoughts. Your feedback helps us improve the course for future students.",
        
        // Footer
        footer_text: "Thank you for taking the time to reflect on your learning experience.",
        course_code: "Course Code",
        academic_year: "Academic Year",
        
        // Alerts and confirmations
        clear_confirm: "Are you sure you want to clear all your responses? This action cannot be undone.",
        draft_saved: "Your draft has been saved locally.",
        submission_success: "Your reflection has been submitted successfully!",
        validation_error: "Please fill in all fields before submitting.",
        
        // Accessibility
        loading: "Loading...",
        form_error: "There was an error processing your request. Please try again."
    },
    
    fr: {
        // Page elements
        page_title: "Réflexion sur le Cours",
        welcome_title: "Bienvenue à Votre Réflexion sur le Cours",
        welcome_message: "Prenez un moment pour réfléchir à votre parcours d'apprentissage. Vos pensées et commentaires sont précieux pour améliorer l'expérience du cours.",
        
        // Questions
        question1_label: "Qu'avez-vous le plus apprécié dans ce cours ?",
        question1_placeholder: "Partagez les aspects du cours que vous avez trouvés les plus intéressants et agréables...",
        
        question2_label: "Quelle a été la partie la plus difficile du cours ?",
        question2_placeholder: "Décrivez les défis que vous avez rencontrés et comment vous les avez surmontés...",
        
        question3_label: "Quelles suggestions avez-vous pour améliorer ce cours ?",
        question3_placeholder: "Partagez vos idées pour rendre ce cours encore meilleur pour les futurs étudiants...",
        
        // Buttons and actions
        save_draft: "Sauvegarder le Brouillon",
        clear_form: "Effacer le Formulaire",
        submit_reflection: "Soumettre la Réflexion",
        close: "Fermer",
        
        // Status messages
        auto_saved: "Brouillon sauvegardé automatiquement",
        success_title: "Réflexion Soumise avec Succès !",
        success_message: "Merci d'avoir partagé vos pensées. Vos commentaires nous aident à améliorer le cours pour les futurs étudiants.",
        
        // Footer
        footer_text: "Merci d'avoir pris le temps de réfléchir à votre expérience d'apprentissage.",
        course_code: "Code du Cours",
        academic_year: "Année Académique",
        
        // Alerts and confirmations
        clear_confirm: "Êtes-vous sûr de vouloir effacer toutes vos réponses ? Cette action ne peut pas être annulée.",
        draft_saved: "Votre brouillon a été sauvegardé localement.",
        submission_success: "Votre réflexion a été soumise avec succès !",
        validation_error: "Veuillez remplir tous les champs avant de soumettre.",
        
        // Accessibility
        loading: "Chargement...",
        form_error: "Il y a eu une erreur lors du traitement de votre demande. Veuillez réessayer."
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
