const translations = {
  en: {
    page: {
      title: "Course Reflection - EduReflect",
    },
    loading: {
      text: "Loading your reflection space...",
    },
    nav: {
      brand: "EduReflect",
    },
    hero: {
      badge: "Course Reflection",
      title: "Share Your Learning Journey",
      subtitle:
        "Your insights help us create better educational experiences. Take a moment to reflect on your course journey and share your valuable feedback.",
      stats: {
        rating: "Course Rating",
        students: "Students",
        completion: "Completion",
      },
    },
    progress: {
      title: "Reflection Progress",
      completed: "completed",
    },
    form: {
      title: "Your Course Reflection",
      description: "Please take your time to provide thoughtful responses. Your feedback is valuable to us.",
    },
    questions: {
      q1: {
        title: "What aspects of the course did you find most engaging and valuable?",
        subtitle: "Think about specific topics, activities, or teaching methods that resonated with you.",
        placeholder: "Share what you found most engaging and valuable about the course...",
      },
      q2: {
        title: "What challenges did you encounter, and how did you overcome them?",
        subtitle: "Describe any difficulties and the strategies you used to address them.",
        placeholder: "Describe the challenges you faced and how you overcame them...",
      },
      q3: {
        title: "What suggestions do you have for improving the course experience?",
        subtitle: "Share your ideas for enhancements, additional resources, or different approaches.",
        placeholder: "Share your suggestions for improving the course experience...",
      },
    },
    status: {
      empty: "Not started",
      progress: "In progress",
      completed: "Completed",
    },
    actions: {
      save_draft: "Save Draft",
      clear: "Clear All",
      submit: "Submit Reflection",
      edit: "Edit Reflection",
      download: "Download PDF",
      share: "Share",
      cancel: "Cancel",
      confirm: "Confirm",
    },
    summary: {
      title: "Reflection Complete!",
      subtitle: "Thank you for sharing your valuable insights. Your feedback helps us improve the learning experience.",
    },
    footer: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      support: "Support",
      copyright: "© 2024 EduReflect. All rights reserved.",
    },
    messages: {
      saved: "Your reflection has been saved successfully!",
      submitted: "Your reflection has been submitted successfully!",
      cleared: "All fields have been cleared.",
      fillFields: "Please complete at least one question before submitting.",
      confirmClear: "Are you sure you want to clear all your responses? This action cannot be undone.",
      confirmSubmit: "Are you ready to submit your reflection? You can still edit it after submission.",
      autoSaved: "Draft saved automatically",
      error: "An error occurred. Please try again.",
    },
    toast: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Information",
    },
  },
  fr: {
    page: {
      title: "Réflexion sur le Cours - EduReflect",
    },
    loading: {
      text: "Chargement de votre espace de réflexion...",
    },
    nav: {
      brand: "EduReflect",
    },
    hero: {
      badge: "Réflexion sur le Cours",
      title: "Partagez Votre Parcours d'Apprentissage",
      subtitle:
        "Vos idées nous aident à créer de meilleures expériences éducatives. Prenez un moment pour réfléchir à votre parcours de cours et partager vos précieux commentaires.",
      stats: {
        rating: "Note du Cours",
        students: "Étudiants",
        completion: "Achèvement",
      },
    },
    progress: {
      title: "Progrès de la Réflexion",
      completed: "terminé",
    },
    form: {
      title: "Votre Réflexion sur le Cours",
      description:
        "Veuillez prendre votre temps pour fournir des réponses réfléchies. Vos commentaires nous sont précieux.",
    },
    questions: {
      q1: {
        title: "Quels aspects du cours avez-vous trouvés les plus engageants et précieux ?",
        subtitle: "Pensez aux sujets spécifiques, activités ou méthodes d'enseignement qui vous ont marqué.",
        placeholder: "Partagez ce que vous avez trouvé le plus engageant et précieux dans le cours...",
      },
      q2: {
        title: "Quels défis avez-vous rencontrés et comment les avez-vous surmontés ?",
        subtitle: "Décrivez les difficultés et les stratégies que vous avez utilisées pour les résoudre.",
        placeholder: "Décrivez les défis que vous avez rencontrés et comment vous les avez surmontés...",
      },
      q3: {
        title: "Quelles suggestions avez-vous pour améliorer l'expérience du cours ?",
        subtitle: "Partagez vos idées d'améliorations, de ressources supplémentaires ou d'approches différentes.",
        placeholder: "Partagez vos suggestions pour améliorer l'expérience du cours...",
      },
    },
    status: {
      empty: "Non commencé",
      progress: "En cours",
      completed: "Terminé",
    },
    actions: {
      save_draft: "Sauvegarder le Brouillon",
      clear: "Tout Effacer",
      submit: "Soumettre la Réflexion",
      edit: "Modifier la Réflexion",
      download: "Télécharger PDF",
      share: "Partager",
      cancel: "Annuler",
      confirm: "Confirmer",
    },
    summary: {
      title: "Réflexion Terminée !",
      subtitle:
        "Merci d'avoir partagé vos précieuses idées. Vos commentaires nous aident à améliorer l'expérience d'apprentissage.",
    },
    footer: {
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      support: "Support",
      copyright: "© 2024 EduReflect. Tous droits réservés.",
    },
    messages: {
      saved: "Votre réflexion a été sauvegardée avec succès !",
      submitted: "Votre réflexion a été soumise avec succès !",
      cleared: "Tous les champs ont été effacés.",
      fillFields: "Veuillez compléter au moins une question avant de soumettre.",
      confirmClear: "Êtes-vous sûr de vouloir effacer toutes vos réponses ? Cette action ne peut pas être annulée.",
      confirmSubmit: "Êtes-vous prêt à soumettre votre réflexion ? Vous pourrez encore la modifier après soumission.",
      autoSaved: "Brouillon sauvegardé automatiquement",
      error: "Une erreur s'est produite. Veuillez réessayer.",
    },
    toast: {
      success: "Succès",
      error: "Erreur",
      warning: "Avertissement",
      info: "Information",
    },
  },
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = translations
}

// Make translations available globally
window.translations = translations
