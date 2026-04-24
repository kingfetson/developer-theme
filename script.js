// script.js – Developer Portfolio Theme (Enhanced Production Version)
// Features: Project CRUD, Import/Export, Validation, Toast Notifications, Auto-save

// ---------- DATA MODEL ----------
let portfolioData = {
  name: "Alex Morgan",
  title: "Senior Full Stack Developer",
  bio: "Passionate engineer focused on scalable products, clean architecture, APIs, and modern frontend experiences.",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  email: "alex@example.com",
  location: "Nairobi, Kenya",
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Next.js"],
  projects: [
    {
      id: "proj1",
      title: "SaaS Dashboard",
      desc: "Analytics platform with charts, auth, subscriptions.",
      link: "#",
      technologies: ["React", "D3.js", "Node.js"]
    },
    {
      id: "proj2",
      title: "E-commerce API",
      desc: "REST API with payments, products, orders, microservices.",
      link: "#",
      technologies: ["Node.js", "Express", "MongoDB"]
    },
    {
      id: "proj3",
      title: "Portfolio Builder",
      desc: "Dynamic portfolio generator for professionals — live editing.",
      link: "#",
      technologies: ["JavaScript", "HTML5", "CSS3"]
    }
  ],
  socialLinks: {
    github: "github.com/devportfolio",
    linkedin: "linkedin.com/in/username",
    twitter: "twitter.com/username"
  }
};

// Debounce utility for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Toast notification system
function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <i class="fa-regular ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle'}"></i>
    <span>${escapeHtml(message)}</span>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add CSS for toast notifications and modals
function addGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .toast-notification {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e293b;
      border-left: 4px solid;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      font-size: 0.875rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
    .toast-success { border-left-color: #00ff88; }
    .toast-error { border-left-color: #ef4444; }
    .toast-info { border-left-color: #00e5ff; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .project-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10001;
      animation: fadeIn 0.2s ease;
    }
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: linear-gradient(135deg, #111827, #0f172a);
      border: 1px solid #00e5ff;
      border-radius: 28px;
      padding: 28px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      animation: modalPop 0.3s ease;
    }
    @keyframes modalPop {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .modal-content h3 {
      color: #00e5ff;
      margin-bottom: 20px;
    }
    .modal-content input, .modal-content textarea {
      margin-bottom: 16px;
      width: 100%;
    }
    .modal-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Helper: save to localStorage
function persistData() {
  try {
    localStorage.setItem("dev_portfolio_theme", JSON.stringify(portfolioData));
  } catch (e) {
    showToast("❌ Failed to save data", "error");
  }
}

// Load stored data with validation
function loadStoredData() {
  const saved = localStorage.getItem("dev_portfolio_theme");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        portfolioData = { ...portfolioData, ...parsed };
        if (!portfolioData.skills) portfolioData.skills = [];
        if (!portfolioData.projects) portfolioData.projects = [];
        if (!portfolioData.socialLinks) portfolioData.socialLinks = {};
        // Ensure each project has an id
        portfolioData.projects = portfolioData.projects.map(p => ({ 
          ...p, 
          id: p.id || crypto.randomUUID?.() || Date.now() + Math.random() 
        }));
      }
    } catch(e) { 
      console.warn("Failed to parse saved data");
    }
  }
}

// Validation functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidImageUrl(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:'));
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Update character counter for bio
function updateCharCounter() {
  const bioInput = document.getElementById("inputBio");
  const counter = document.querySelector(".char-counter");
  if (bioInput && counter) {
    const length = bioInput.value.length;
    counter.textContent = `${length}/300`;
    if (length > 280) counter.style.color = "#f9735e";
    else counter.style.color = "#94a3b8";
  }
}

// Render portfolio preview
function renderPortfolio() {
  const container = document.getElementById("portfolioRoot");
  if (!container) return;

  const safeName = escapeHtml(portfolioData.name);
  const safeTitle = escapeHtml(portfolioData.title);
  const safeBio = escapeHtml(portfolioData.bio).replace(/\n/g, '<br>');
  const safeImage = isValidImageUrl(portfolioData.image) ? portfolioData.image : "https://via.placeholder.com/150?text=Avatar";
  const safeEmail = escapeHtml(portfolioData.email);
  const safeLocation = escapeHtml(portfolioData.location);
  
  const skillsHtml = portfolioData.skills.map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join('');
  
  const projectsHtml = portfolioData.projects.map(proj => `
    <div class="project-entry" data-project-id="${proj.id}">
      <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap;">
        <h4><i class="fa-regular fa-folder-open"></i> ${escapeHtml(proj.title)}</h4>
        <div style="display: flex; gap: 8px;">
          <button class="edit-project-btn" data-id="${proj.id}" aria-label="Edit project">
            <i class="fa-regular fa-pen"></i>
          </button>
          <button class="delete-project-btn" data-id="${proj.id}" aria-label="Delete project">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
      <p>${escapeHtml(proj.desc)}</p>
      ${proj.technologies && proj.technologies.length ? 
        `<div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap;">
          ${proj.technologies.map(t => `<span style="font-size: 0.7rem; background: #00e5ff20; padding: 2px 8px; border-radius: 12px;">${escapeHtml(t)}</span>`).join('')}
        </div>` : ''}
      <a href="${escapeHtml(proj.link)}" class="project-link" target="_blank" rel="noopener noreferrer">
        View Project <i class="fa-regular fa-arrow-right"></i>
      </a>
    </div>
  `).join('');
  
  const statsCount = portfolioData.skills.length;
  
  const html = `
    <div class="hero-card">
      <img src="${safeImage}" alt="${safeName}'s avatar" class="avatar-img" loading="lazy" 
           onerror="this.src='https://ui-avatars.com/api/?background=00e5ff&color=000&bold=true&name=${encodeURIComponent(portfolioData.name)}'">
      <div class="hero-info">
        <div class="hero-name">${safeName}</div>
        <div class="hero-title">⚡ ${safeTitle}</div>
        <div class="hero-bio">${safeBio}</div>
        <div class="stats-row">
          <div class="stat-badge"><i class="fa-regular fa-location-dot"></i> ${safeLocation}</div>
          <div class="stat-badge"><i class="fa-regular fa-envelope"></i> ${safeEmail}</div>
          <div class="stat-badge"><i class="fa-regular fa-code"></i> ${statsCount} Tech skills</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="info-card">
        <h3><i class="fa-regular fa-cube"></i> Tech Stack</h3>
        <div class="skills-chips">
          ${skillsHtml || '<span class="skill-chip">➕ Add skills in sidebar</span>'}
        </div>
      </div>

      <div class="info-card">
        <h3><i class="fa-regular fa-address-card"></i> Connect</h3>
        <div class="contact-links">
          <a href="mailto:${safeEmail}" class="contact-link"><i class="fa-regular fa-envelope"></i> ${safeEmail}</a>
          <a href="https://${portfolioData.socialLinks.github || 'github.com'}" target="_blank" class="contact-link">
            <i class="fa-brands fa-github"></i> ${portfolioData.socialLinks.github || 'GitHub'}
          </a>
          <a href="https://${portfolioData.socialLinks.linkedin || 'linkedin.com'}" target="_blank" class="contact-link">
            <i class="fa-brands fa-linkedin"></i> LinkedIn
          </a>
        </div>
      </div>

      <div class="info-card projects-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 12px;">
          <h3 style="margin-bottom: 0;"><i class="fa-regular fa-diagram-project"></i> Featured Projects</h3>
          <button id="addProjectBtn" class="btn-primary small" style="padding: 6px 14px;">
            <i class="fa-regular fa-plus"></i> New Project
          </button>
        </div>
        <div class="project-list">
          ${projectsHtml || '<div class="project-entry"><p>✨ No projects yet. Click "New Project" to showcase your work!</p></div>'}
        </div>
      </div>
    </div>
    <div class="footer-note">
      <i class="fa-regular fa-laptop-code"></i> Developer Portfolio • Real-time sync • Made with DevTheme Studio
    </div>
  `;
  
  container.innerHTML = html;
  
  // Attach project event listeners
  document.querySelectorAll('.edit-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      editProjectById(id);
    });
  });
  
  document.querySelectorAll('.delete-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      deleteProjectById(id);
    });
  });
  
  const addProjectBtn = document.getElementById('addProjectBtn');
  if (addProjectBtn) addProjectBtn.addEventListener('click', () => showProjectModal());
}

// Project management functions
function showProjectModal(projectToEdit = null) {
  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-label', projectToEdit ? 'Edit Project' : 'Add New Project');
  
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <h3>${projectToEdit ? '✏️ Edit Project' : '➕ Add New Project'}</h3>
        <input type="text" id="modalProjectTitle" placeholder="Project title *" 
               value="${projectToEdit ? escapeHtml(projectToEdit.title) : ''}" maxlength="100">
        <textarea id="modalProjectDesc" placeholder="Project description" rows="3" 
                  maxlength="300">${projectToEdit ? escapeHtml(projectToEdit.desc) : ''}</textarea>
        <input type="url" id="modalProjectLink" placeholder="Project URL (https://...)" 
               value="${projectToEdit ? escapeHtml(projectToEdit.link) : ''}">
        <input type="text" id="modalProjectTech" placeholder="Technologies (comma separated)" 
               value="${projectToEdit && projectToEdit.technologies ? projectToEdit.technologies.join(', ') : ''}">
        <div class="modal-buttons">
          <button class="btn-outline" id="modalCancelBtn">Cancel</button>
          <button class="btn-primary" id="modalSaveBtn">${projectToEdit ? 'Update' : 'Save'}</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  const modalOverlay = modal.querySelector('.modal-overlay');
  const saveBtn = modal.querySelector('#modalSaveBtn');
  const cancelBtn = modal.querySelector('#modalCancelBtn');
  
  const saveHandler = () => {
    const title = document.getElementById('modalProjectTitle').value.trim();
    const desc = document.getElementById('modalProjectDesc').value.trim();
    const link = document.getElementById('modalProjectLink').value.trim();
    const techStr = document.getElementById('modalProjectTech').value.trim();
    const technologies = techStr ? techStr.split(',').map(t => t.trim()).filter(t => t) : [];
    
    if (!title) {
      showToast("⚠️ Project title is required", "error");
      return;
    }
    
    if (projectToEdit) {
      const index = portfolioData.projects.findIndex(p => p.id === projectToEdit.id);
      if (index !== -1) {
        portfolioData.projects[index] = { 
          ...portfolioData.projects[index], 
          title, 
          desc: desc || "No description provided", 
          link: link || "#", 
          technologies 
        };
        showToast("✅ Project updated successfully", "success");
      }
    } else {
      const newProject = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
        title,
        desc: desc || "No description provided",
        link: link || "#",
        technologies
      };
      portfolioData.projects.push(newProject);
      showToast("✅ New project added successfully", "success");
    }
    
    persistData();
    renderPortfolio();
    modal.remove();
  };
  
  saveBtn.addEventListener('click', saveHandler);
  cancelBtn.addEventListener('click', () => modal.remove());
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modal.remove();
  });
  
  // Enter key support
  const titleInput = document.getElementById('modalProjectTitle');
  if (titleInput) {
    titleInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveHandler();
    });
  }
}

function editProjectById(id) {
  const project = portfolioData.projects.find(p => p.id === id);
  if (project) showProjectModal(project);
}

function deleteProjectById(id) {
  if (confirm("⚠️ Are you sure you want to delete this project permanently?")) {
    portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
    persistData();
    renderPortfolio();
    showToast("🗑️ Project deleted", "success");
  }
}

// Render skills tags in sidebar
function renderSkillsTagsInSidebar() {
  const container = document.getElementById("skillsTagContainer");
  if (!container) return;
  
  if (!portfolioData.skills.length) {
    container.innerHTML = '<div class="tag-item" style="opacity:0.7;">➕ Add skills using the input above</div>';
    return;
  }
  
  container.innerHTML = portfolioData.skills.map((skill, idx) => `
    <div class="tag-item">
      ${escapeHtml(skill)}
      <i class="fa-regular fa-circle-xmark" data-skill-index="${idx}" role="button" 
         aria-label="Remove skill ${escapeHtml(skill)}" tabindex="0"></i>
    </div>
  `).join('');
  
  document.querySelectorAll('#skillsTagContainer .fa-circle-xmark').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const indexAttr = icon.getAttribute('data-skill-index');
      if (indexAttr !== null) {
        const idx = parseInt(indexAttr, 10);
        if (!isNaN(idx) && idx >= 0 && idx < portfolioData.skills.length) {
          const removed = portfolioData.skills[idx];
          portfolioData.skills.splice(idx, 1);
          syncInputsFromData();
          renderPortfolio();
          renderSkillsTagsInSidebar();
          persistData();
          showToast(`✨ Removed "${removed}"`, "info");
        }
      }
    });
    
    icon.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        icon.click();
      }
    });
  });
}

// Debounced render for performance
const debouncedRender = debounce(() => {
  renderPortfolio();
  persistData();
}, 150);

// Bind inputs to data with validation
function bindInputsToData() {
  const inputs = {
    name: document.getElementById("inputName"),
    title: document.getElementById("inputTitle"),
    bio: document.getElementById("inputBio"),
    image: document.getElementById("inputImage"),
    email: document.getElementById("inputEmail"),
    location: document.getElementById("inputLocation"),
    github: document.getElementById("inputGithub"),
    linkedin: document.getElementById("inputLinkedin"),
    twitter: document.getElementById("inputTwitter")
  };
  
  // Set initial values
  if (inputs.name) inputs.name.value = portfolioData.name;
  if (inputs.title) inputs.title.value = portfolioData.title;
  if (inputs.bio) inputs.bio.value = portfolioData.bio;
  if (inputs.image) inputs.image.value = portfolioData.image;
  if (inputs.email) inputs.email.value = portfolioData.email;
  if (inputs.location) inputs.location.value = portfolioData.location;
  if (inputs.github) inputs.github.value = portfolioData.socialLinks.github || '';
  if (inputs.linkedin) inputs.linkedin.value = portfolioData.socialLinks.linkedin || '';
  if (inputs.twitter) inputs.twitter.value = portfolioData.socialLinks.twitter || '';
  
  // Update char counter
  if (inputs.bio) updateCharCounter();
  
  // Event listeners with validation
  if (inputs.name) {
    inputs.name.addEventListener("input", (e) => {
      portfolioData.name = e.target.value.slice(0, 50);
      debouncedRender();
    });
  }
  
  if (inputs.email) {
    inputs.email.addEventListener("input", (e) => {
      const email = e.target.value;
      portfolioData.email = email;
      if (email && !isValidEmail(email)) {
        inputs.email.style.borderColor = "#ef4444";
      } else {
        inputs.email.style.borderColor = "";
      }
      debouncedRender();
    });
  }
  
  if (inputs.image) {
    inputs.image.addEventListener("input", (e) => {
      portfolioData.image = e.target.value;
      debouncedRender();
    });
  }
  
  if (inputs.title) {
    inputs.title.addEventListener("input", (e) => {
      portfolioData.title = e.target.value.slice(0, 60);
      debouncedRender();
    });
  }
  
  if (inputs.bio) {
    inputs.bio.addEventListener("input", (e) => {
      portfolioData.bio = e.target.value.slice(0, 300);
      updateCharCounter();
      debouncedRender();
    });
  }
  
  if (inputs.location) {
    inputs.location.addEventListener("input", (e) => {
      portfolioData.location = e.target.value.slice(0, 50);
      debouncedRender();
    });
  }
  
  if (inputs.github) {
    inputs.github.addEventListener("input", (e) => {
      portfolioData.socialLinks.github = e.target.value;
      debouncedRender();
    });
  }
  
  if (inputs.linkedin) {
    inputs.linkedin.addEventListener("input", (e) => {
      portfolioData.socialLinks.linkedin = e.target.value;
      debouncedRender();
    });
  }
  
  if (inputs.twitter) {
    inputs.twitter.addEventListener("input", (e) => {
      portfolioData.socialLinks.twitter = e.target.value;
      debouncedRender();
    });
  }
}

// Setup skill addition
function setupSkillAddition() {
  const addBtn = document.getElementById("addSkillBtn");
  const skillInput = document.getElementById("newSkillInput");
  
  const addSkillFromInput = () => {
    let val = skillInput.value.trim();
    if (val !== "") {
      if (val.length > 30) {
        showToast("⚠️ Skill name too long (max 30 characters)", "error");
        return;
      }
      if (!portfolioData.skills.some(s => s.toLowerCase() === val.toLowerCase())) {
        portfolioData.skills.push(val);
        persistData();
        renderSkillsTagsInSidebar();
        renderPortfolio();
        skillInput.value = "";
        showToast(`➕ Added "${val}"`, "success");
      } else {
        showToast(`⚠️ "${val}" already exists in your skills`, "error");
        skillInput.value = "";
      }
    } else {
      showToast("⚠️ Please enter a skill name", "error");
    }
  };
  
  if (addBtn) addBtn.addEventListener("click", addSkillFromInput);
  if (skillInput) {
    skillInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkillFromInput();
      }
    });
  }
}

// Reset all data
function setupReset() {
  const resetBtn = document.getElementById("resetAllBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmReset = confirm("⚠️ WARNING: This will erase ALL your custom data and restore the default portfolio. This action cannot be undone.\n\nAre you sure you want to continue?");
      if (confirmReset) {
        localStorage.removeItem("dev_portfolio_theme");
        location.reload();
      }
    });
  }
}

// Export functionality
function setupExport() {
  const exportBtn = document.getElementById("exportDataBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const exportObj = { 
        ...portfolioData, 
        exportedAt: new Date().toISOString(),
        version: "2.0.0"
      };
      const dataStr = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devportfolio_${portfolioData.name.replace(/\s/g, '_')}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("📥 Portfolio exported successfully", "success");
    });
  }
}

// Import functionality
function setupImport() {
  const importBtn = document.getElementById("importDataBtn");
  const importFile = document.getElementById("importFileInput");
  
  if (importBtn && importFile) {
    importBtn.addEventListener("click", () => {
      importFile.click();
    });
    
    importFile.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported.name && imported.skills && Array.isArray(imported.skills)) {
              portfolioData = { ...portfolioData, ...imported };
              if (!portfolioData.projects) portfolioData.projects = [];
              if (!portfolioData.socialLinks) portfolioData.socialLinks = {};
              syncInputsFromData();
              renderSkillsTagsInSidebar();
              renderPortfolio();
              persistData();
              showToast("✅ Portfolio imported successfully!", "success");
            } else {
              showToast("❌ Invalid portfolio file format", "error");
            }
          } catch (err) {
            showToast("❌ Failed to parse JSON file", "error");
          }
        };
        reader.readAsText(file);
      }
      importFile.value = '';
    });
  }
}

// Sync inputs from data
function syncInputsFromData() {
  const nameInput = document.getElementById("inputName");
  const titleInput = document.getElementById("inputTitle");
  const bioInput = document.getElementById("inputBio");
  const imageInput = document.getElementById("inputImage");
  const emailInput = document.getElementById("inputEmail");
  const locationInput = document.getElementById("inputLocation");
  const githubInput = document.getElementById("inputGithub");
  const linkedinInput = document.getElementById("inputLinkedin");
  const twitterInput = document.getElementById("inputTwitter");
  
  if (nameInput) nameInput.value = portfolioData.name;
  if (titleInput) titleInput.value = portfolioData.title;
  if (bioInput) bioInput.value = portfolioData.bio;
  if (imageInput) imageInput.value = portfolioData.image;
  if (emailInput) emailInput.value = portfolioData.email;
  if (locationInput) locationInput.value = portfolioData.location;
  if (githubInput) githubInput.value = portfolioData.socialLinks.github || '';
  if (linkedinInput) linkedinInput.value = portfolioData.socialLinks.linkedin || '';
  if (twitterInput) twitterInput.value = portfolioData.socialLinks.twitter || '';
  if (bioInput) updateCharCounter();
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to export
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const exportBtn = document.getElementById("exportDataBtn");
      if (exportBtn) exportBtn.click();
      showToast("💾 Export triggered", "info");
    }
  });
}

// Initialize everything
function init() {
  addGlobalStyles();
  loadStoredData();
  syncInputsFromData();
  bindInputsToData();
  renderSkillsTagsInSidebar();
  renderPortfolio();
  setupSkillAddition();
  setupReset();
  setupExport();
  setupImport();
  setupKeyboardShortcuts();
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
