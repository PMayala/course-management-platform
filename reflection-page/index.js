class EduReflectApp {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage() || "en"
    this.currentTheme = this.getStoredTheme() || "light"
    this.reflectionData = this.loadReflectionData()
    this.autoSaveTimeout = null
    this.isSubmitted = false

    this.init()
  }

  init() {
    this.showLoadingScreen()
    this.setupEventListeners()
    this.loadLanguage(this.currentLanguage)
    this.loadTheme(this.currentTheme)
    this.loadSavedData()
    this.updateLanguageButtons()
    this.updateProgress()
    this.hideLoadingScreen()
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      loadingScreen.style.display = "flex"
    }
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen")
      if (loadingScreen) {
        loadingScreen.classList.add("hidden")

        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 300)
      }
    }, 1500)
  }

  setupEventListeners() {
    // Language switcher
    this.setupLanguageSwitcher()

    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Form interactions
    const saveDraft = document.getElementById("save-draft")
    const clearAll = document.getElementById("clear-all")
    const submitReflection = document.getElementById("submit-reflection")

    if (saveDraft) saveDraft.addEventListener("click", () => this.saveDraft())
    if (clearAll) clearAll.addEventListener("click", () => this.showClearConfirmation())
    if (submitReflection) submitReflection.addEventListener("click", () => this.showSubmitConfirmation())

    // Summary actions
    const editReflection = document.getElementById("edit-reflection")
    const downloadPdf = document.getElementById("download-pdf")
    const shareReflection = document.getElementById("share-reflection")

    if (editReflection) editReflection.addEventListener("click", () => this.editReflection())
    if (downloadPdf) downloadPdf.addEventListener("click", () => this.downloadPDF())
    if (shareReflection) shareReflection.addEventListener("click", () => this.shareReflection())

    // Text area interactions
    this.setupTextAreaListeners()

    // Modal interactions
    this.setupModalListeners()

    // Keyboard shortcuts
    this.setupKeyboardShortcuts()

    // Click outside to close dropdowns
    document.addEventListener("click", (e) => this.handleOutsideClick(e))
  }

  setupLanguageSwitcher() {
    const langCurrent = document.getElementById("lang-current")
    const langOptions = document.getElementById("lang-options")

    if (!langCurrent || !langOptions) return

    const langDropdown = langCurrent.closest(".lang-dropdown")

    langCurrent.addEventListener("click", (e) => {
      e.stopPropagation()
      if (langDropdown) {
        langDropdown.classList.toggle("active")
      }
    })

    document.querySelectorAll(".lang-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation()
        const lang = option.dataset.lang
        this.switchLanguage(lang)
        if (langDropdown) {
          langDropdown.classList.remove("active")
        }
      })
    })
  }

  setupTextAreaListeners() {
    const textareas = document.querySelectorAll("textarea")

    textareas.forEach((textarea, index) => {
      const questionNumber = index + 1
      const charCountElement = document.getElementById(`char-count-${questionNumber}`)
      const statusElement = document.getElementById(`status-${questionNumber}`)
      const questionCard = textarea.closest(".question-card")

      // Input event for character count and auto-save
      textarea.addEventListener("input", () => {
        this.updateCharCount(textarea, charCountElement)
        this.updateQuestionStatus(textarea, statusElement, questionCard)
        this.updateProgress()
        this.autoSave()
      })

      // Focus events
      textarea.addEventListener("focus", () => {
        if (questionCard) {
          questionCard.classList.add("focused")
          this.addFocusAnimation(questionCard)
        }
      })

      textarea.addEventListener("blur", () => {
        if (questionCard) {
          questionCard.classList.remove("focused")
        }
      })

      // Initialize character count
      this.updateCharCount(textarea, charCountElement)
      this.updateQuestionStatus(textarea, statusElement, questionCard)
    })
  }

  setupModalListeners() {
    const modal = document.getElementById("confirmation-modal")
    const modalClose = document.getElementById("modal-close")
    const modalCancel = document.getElementById("modal-cancel")

    if (modalClose) modalClose.addEventListener("click", () => this.hideModal())
    if (modalCancel) modalCancel.addEventListener("click", () => this.hideModal())

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.hideModal()
      })
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            this.saveDraft()
            break
          case "Enter":
            if (e.shiftKey) {
              e.preventDefault()
              this.showSubmitConfirmation()
            }
            break
        }
      }

      if (e.key === "Escape") {
        this.hideModal()
        const activeDropdown = document.querySelector(".lang-dropdown.active")
        if (activeDropdown) {
          activeDropdown.classList.remove("active")
        }
      }
    })
  }

  handleOutsideClick(e) {
    const langDropdown = document.querySelector(".lang-dropdown.active")
    if (langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.remove("active")
    }
  }

  // Language Management
  getStoredLanguage() {
    return localStorage.getItem("eduReflect_language")
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage
    return browserLang.startsWith("fr") ? "fr" : "en"
  }

  switchLanguage(lang) {
    if (lang === this.currentLanguage) return

    this.currentLanguage = lang
    this.loadLanguage(lang)
    this.updateLanguageButtons()
    localStorage.setItem("eduReflect_language", lang)

    if (window.translations && window.translations[lang]) {
      this.showToast(
        "success",
        window.translations[lang].toast.success,
        `Language switched to ${lang === "en" ? "English" : "Français"}`,
      )
    }
  }

  loadLanguage(lang) {
    const translations = window.translations
    if (!translations || !translations[lang]) {
      console.warn("Translations not available for language:", lang)
      return
    }

    const t = translations[lang]

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n")
      const translation = this.getNestedTranslation(t, key)

      if (translation) {
        element.textContent = translation
      }
    })

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder")
      const translation = this.getNestedTranslation(t, key)

      if (translation) {
        element.placeholder = translation
      }
    })

    // Update document title
    document.title = t.page.title

    // Update language display
    const currentFlag = document.getElementById("current-flag")
    const currentLang = document.getElementById("current-lang")

    if (currentFlag && currentLang) {
      if (lang === "fr") {
        currentFlag.textContent = "🇫🇷"
        currentLang.textContent = "FR"
      } else {
        currentFlag.textContent = "🇺🇸"
        currentLang.textContent = "EN"
      }
    }
  }

  getNestedTranslation(obj, path) {
    return path.split(".").reduce((current, key) => current && current[key], obj)
  }

  updateLanguageButtons() {
    document.querySelectorAll(".lang-option").forEach((btn) => {
      btn.classList.remove("active")
    })

    const currentLangBtn = document.getElementById(`lang-${this.currentLanguage}`)
    if (currentLangBtn) {
      currentLangBtn.classList.add("active")
    }
  }

  // Theme Management
  getStoredTheme() {
    return localStorage.getItem("eduReflect_theme")
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light"
    this.loadTheme(this.currentTheme)
    localStorage.setItem("eduReflect_theme", this.currentTheme)
  }

  loadTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    const themeIcon = document.querySelector("#theme-toggle i")

    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.className = "fas fa-sun"
      } else {
        themeIcon.className = "fas fa-moon"
      }
    }
  }

  // Data Management
  loadReflectionData() {
    const saved = localStorage.getItem("eduReflect_data")
    return saved
      ? JSON.parse(saved)
      : {
          answer1: "",
          answer2: "",
          answer3: "",
          lastSaved: null,
          isSubmitted: false,
        }
  }

  loadSavedData() {
    const answer1 = document.getElementById("answer1")
    const answer2 = document.getElementById("answer2")
    const answer3 = document.getElementById("answer3")

    if (answer1) answer1.value = this.reflectionData.answer1 || ""
    if (answer2) answer2.value = this.reflectionData.answer2 || ""
    if (answer3) answer3.value = this.reflectionData.answer3 || ""

    this.isSubmitted = this.reflectionData.isSubmitted || false

    if (this.isSubmitted) {
      this.showSummary()
    }
  }

  saveToStorage() {
    const answer1 = document.getElementById("answer1")
    const answer2 = document.getElementById("answer2")
    const answer3 = document.getElementById("answer3")

    const data = {
      answer1: answer1 ? answer1.value : "",
      answer2: answer2 ? answer2.value : "",
      answer3: answer3 ? answer3.value : "",
      lastSaved: new Date().toISOString(),
      isSubmitted: this.isSubmitted,
    }
    localStorage.setItem("eduReflect_data", JSON.stringify(data))
    this.reflectionData = data
  }

  // UI Updates
  updateCharCount(textarea, charCountElement) {
    if (!textarea || !charCountElement) return

    const count = textarea.value.length
    const maxLength = textarea.getAttribute("maxlength") || 1000
    charCountElement.textContent = count

    if (count > maxLength * 0.9) {
      charCountElement.style.color = "var(--error-500)"
    } else if (count > maxLength * 0.7) {
      charCountElement.style.color = "var(--warning-500)"
    } else {
      charCountElement.style.color = "var(--gray-500)"
    }
  }

  updateQuestionStatus(textarea, statusElement, questionCard) {
    if (!textarea || !statusElement || !window.translations) return

    const value = textarea.value.trim()
    const t = window.translations[this.currentLanguage]

    if (value.length === 0) {
      statusElement.className = "input-status empty"
      statusElement.innerHTML = `<i class="fas fa-circle"></i><span>${t.status.empty}</span>`
      if (questionCard) questionCard.classList.remove("completed")
    } else if (value.length < 50) {
      statusElement.className = "input-status progress"
      statusElement.innerHTML = `<i class="fas fa-circle"></i><span>${t.status.progress}</span>`
      if (questionCard) questionCard.classList.remove("completed")
    } else {
      statusElement.className = "input-status completed"
      statusElement.innerHTML = `<i class="fas fa-check-circle"></i><span>${t.status.completed}</span>`
      if (questionCard) questionCard.classList.add("completed")
    }
  }

  updateProgress() {
    const textareas = document.querySelectorAll("textarea")
    let completed = 0

    textareas.forEach((textarea) => {
      if (textarea.value.trim().length >= 50) {
        completed++
      }
    })

    const total = textareas.length
    const percentage = (completed / total) * 100

    const progressCurrent = document.getElementById("progress-current")
    const progressTotal = document.getElementById("progress-total")
    const progressFill = document.getElementById("progress-fill")

    if (progressCurrent) progressCurrent.textContent = completed
    if (progressTotal) progressTotal.textContent = total
    if (progressFill) progressFill.style.width = `${percentage}%`
  }

  addFocusAnimation(element) {
    if (!element) return

    element.classList.add("scale-in")
    setTimeout(() => {
      element.classList.remove("scale-in")
    }, 300)
  }

  // Actions
  autoSave() {
    clearTimeout(this.autoSaveTimeout)
    this.autoSaveTimeout = setTimeout(() => {
      this.saveToStorage()
      if (window.translations && window.translations[this.currentLanguage]) {
        this.showToast(
          "info",
          window.translations[this.currentLanguage].toast.info,
          window.translations[this.currentLanguage].messages.autoSaved,
        )
      }
    }, 2000)
  }

  saveDraft() {
    this.saveToStorage()
    if (window.translations && window.translations[this.currentLanguage]) {
      this.showToast(
        "success",
        window.translations[this.currentLanguage].toast.success,
        window.translations[this.currentLanguage].messages.saved,
      )
    }
  }

  showClearConfirmation() {
    if (!window.translations || !window.translations[this.currentLanguage]) return

    const t = window.translations[this.currentLanguage]
    this.showModal("Confirm Clear", t.messages.confirmClear, () => this.clearAllFields())
  }

  showSubmitConfirmation() {
    const answer1 = document.getElementById("answer1")
    const answer2 = document.getElementById("answer2")
    const answer3 = document.getElementById("answer3")

    const answer1Value = answer1 ? answer1.value.trim() : ""
    const answer2Value = answer2 ? answer2.value.trim() : ""
    const answer3Value = answer3 ? answer3.value.trim() : ""

    if (!answer1Value && !answer2Value && !answer3Value) {
      if (window.translations && window.translations[this.currentLanguage]) {
        this.showToast(
          "warning",
          window.translations[this.currentLanguage].toast.warning,
          window.translations[this.currentLanguage].messages.fillFields,
        )
      }
      return
    }

    if (window.translations && window.translations[this.currentLanguage]) {
      const t = window.translations[this.currentLanguage]
      this.showModal("Submit Reflection", t.messages.confirmSubmit, () => this.submitReflection())
    }
  }

  clearAllFields() {
    const answer1 = document.getElementById("answer1")
    const answer2 = document.getElementById("answer2")
    const answer3 = document.getElementById("answer3")

    if (answer1) answer1.value = ""
    if (answer2) answer2.value = ""
    if (answer3) answer3.value = ""

    // Update UI
    document.querySelectorAll("textarea").forEach((textarea, index) => {
      const questionNumber = index + 1
      const charCountElement = document.getElementById(`char-count-${questionNumber}`)
      const statusElement = document.getElementById(`status-${questionNumber}`)
      const questionCard = textarea.closest(".question-card")

      this.updateCharCount(textarea, charCountElement)
      this.updateQuestionStatus(textarea, statusElement, questionCard)
    })

    this.updateProgress()
    localStorage.removeItem("eduReflect_data")

    if (window.translations && window.translations[this.currentLanguage]) {
      this.showToast(
        "info",
        window.translations[this.currentLanguage].toast.info,
        window.translations[this.currentLanguage].messages.cleared,
      )
    }
  }

  submitReflection() {
    this.isSubmitted = true
    this.saveToStorage()
    this.showSummary()

    if (window.translations && window.translations[this.currentLanguage]) {
      this.showToast(
        "success",
        window.translations[this.currentLanguage].toast.success,
        window.translations[this.currentLanguage].messages.submitted,
      )
    }
  }

  showSummary() {
    const summarySection = document.getElementById("summary-section")
    const summaryContent = document.getElementById("summary-content")
    const reflectionForm = document.getElementById("reflection-form")

    if (!summarySection || !summaryContent || !reflectionForm || !window.translations) return

    const t = window.translations[this.currentLanguage]

    const questions = [
      { title: t.questions.q1.title, answer: this.reflectionData.answer1 },
      { title: t.questions.q2.title, answer: this.reflectionData.answer2 },
      { title: t.questions.q3.title, answer: this.reflectionData.answer3 },
    ]

    summaryContent.innerHTML = questions
      .filter((q) => q.answer && q.answer.trim())
      .map(
        (q) => `
          <div class="summary-item fade-in">
              <h4>${q.title}</h4>
              <p>${q.answer}</p>
          </div>
        `,
      )
      .join("")

    reflectionForm.style.display = "none"
    summarySection.style.display = "block"
    summarySection.classList.add("fade-in")

    // Smooth scroll to summary
    summarySection.scrollIntoView({ behavior: "smooth" })
  }

  editReflection() {
    const summarySection = document.getElementById("summary-section")
    const reflectionForm = document.getElementById("reflection-form")

    if (!summarySection || !reflectionForm) return

    summarySection.style.display = "none"
    reflectionForm.style.display = "block"
    reflectionForm.classList.add("fade-in")

    // Focus first empty field
    const textareas = document.querySelectorAll("textarea")
    for (const textarea of textareas) {
      if (!textarea.value.trim()) {
        textarea.focus()
        break
      }
    }
  }

  downloadPDF() {
    // Simulate PDF download
    if (window.translations && window.translations[this.currentLanguage]) {
      this.showToast("info", window.translations[this.currentLanguage].toast.info, "PDF download feature coming soon!")
    }
  }

  shareReflection() {
    if (navigator.share) {
      navigator.share({
        title: "My Course Reflection",
        text: "I've completed my course reflection on EduReflect",
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        if (window.translations && window.translations[this.currentLanguage]) {
          this.showToast(
            "success",
            window.translations[this.currentLanguage].toast.success,
            "Link copied to clipboard!",
          )
        }
      })
    }
  }

  // Modal Management
  showModal(title, message, onConfirm) {
    const modal = document.getElementById("confirmation-modal")
    const modalTitle = document.getElementById("modal-title")
    const modalMessage = document.getElementById("modal-message")
    const modalConfirm = document.getElementById("modal-confirm")

    if (!modal || !modalTitle || !modalMessage || !modalConfirm) return

    modalTitle.textContent = title
    modalMessage.textContent = message
    modal.style.display = "flex"
    modal.classList.add("fade-in")

    // Remove previous event listeners
    const newConfirmBtn = modalConfirm.cloneNode(true)
    modalConfirm.parentNode.replaceChild(newConfirmBtn, modalConfirm)

    // Add new event listener
    newConfirmBtn.addEventListener("click", () => {
      onConfirm()
      this.hideModal()
    })
  }

  hideModal() {
    const modal = document.getElementById("confirmation-modal")
    if (modal) {
      modal.style.display = "none"
      modal.classList.remove("fade-in")
    }
  }

  // Toast Notifications
  showToast(type, title, message) {
    const toastContainer = document.getElementById("toast-container")
    if (!toastContainer) return

    const toast = document.createElement("div")

    toast.className = `toast ${type}`
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${this.getToastIcon(type)}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `

    toastContainer.appendChild(toast)

    // Animate in
    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    // Auto remove
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove()
        }
      }, 300)
    }, 4000)
  }

  getToastIcon(type) {
    const icons = {
      success: "fa-check",
      error: "fa-times",
      warning: "fa-exclamation",
      info: "fa-info",
    }
    return icons[type] || icons.info
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new EduReflectApp()
})

// Add some enhanced interactions
document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("slide-up")
      }
    })
  }, observerOptions)

  // Observe question cards
  document.querySelectorAll(".question-card").forEach((card) => {
    observer.observe(card)
  })

  // Add typing effect for hero title
  const heroTitle = document.querySelector(".hero-title")
  if (heroTitle) {
    const text = heroTitle.textContent
    heroTitle.textContent = ""

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 50)
      }
    }

    setTimeout(typeWriter, 2000)
  }

  // Add parallax effect to hero shapes
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const shapes = document.querySelectorAll(".shape")

    shapes.forEach((shape, index) => {
      const speed = 0.5 + index * 0.1
      shape.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Add form validation visual feedback
  document.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("invalid", (e) => {
      e.preventDefault()
      textarea.classList.add("error")
      setTimeout(() => {
        textarea.classList.remove("error")
      }, 3000)
    })
  })
})

// Add CSS for error state
const style = document.createElement("style")
style.textContent = `
  .textarea-container textarea.error {
    border-color: var(--error-500) !important;
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`
document.head.appendChild(style)
