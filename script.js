// script.js – Developer Portfolio Theme (Full Features, Persistent & Dynamic)

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
      title: "SaaS Dashboard",
      desc: "Analytics platform with charts, auth, subscriptions.",
      link: "#"
    },
    {
      title: "E-commerce API",
      desc: "REST API with payments, products, orders, microservices.",
      link: "#"
    },
    {
      title: "Portfolio Builder",
      desc: "Dynamic portfolio generator for professionals — live editing.",
      link: "#"
    }
  ]
};

// Helper: save to localStorage
function persistData() {
  localStorage.setItem("dev_portfolio_theme", JSON.stringify(portfolioData));
}

// Helper: load from localStorage
function loadStoredData() {
  const saved = localStorage.getItem("dev_portfolio_theme");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // merge to keep structure integrity
      portfolioData = { ...portfolioData, ...parsed };
      // ensure projects & skills arrays exist
      if (!portfolioData.skills) portfolioData.skills = [];
      if (!portfolioData.projects) portfolioData.projects = [];
    } catch(e) { console.warn("Failed to parse saved data"); }
  }
}

// ---------- RENDER PREVIEW (Dynamic UI) ----------
function renderPortfolio() {
  const container = document.getElementById("portfolioRoot");
  if (!container) return;

  // Escape HTML for user-generated text to prevent injection (safe)
  const safeName = escapeHtml(portfolioData.name);
  const safeTitle = escapeHtml(portfolioData.title);
  const safeBio = escapeHtml(portfolioData.bio).replace(/\n/g, '<br>');
  const safeImage = portfolioData.image || "https://via.placeholder.com/150?text=Avatar";
  const safeEmail = escapeHtml(portfolioData.email);
  const safeLocation = escapeHtml(portfolioData.location);
  
  // Skills rendering
  const skillsHtml = portfolioData.skills.map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join('');
  
  // Projects rendering
  const projectsHtml = portfolioData.projects.map(proj => `
    <div class="project-entry">
      <h4><i class="fa-regular fa-folder-open"></i> ${escapeHtml(proj.title)}</h4>
      <p>${escapeHtml(proj.desc)}</p>
      <a href="${escapeHtml(proj.link)}" class="project-link" target="_blank" rel="noopener noreferrer">View Project →</a>
    </div>
  `).join('');
  
  const statsCount = portfolioData.skills.length;
  
  const html = `
    <div class="hero-card">
      <img src="${safeImage}" alt="avatar" class="avatar-img" onerror="this.src='https://ui-avatars.com/api/?background=00e5ff&color=000&bold=true&name=${encodeURIComponent(portfolioData.name)}'">
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
      <!-- Tech stack card -->
      <div class="info-card">
        <h3><i class="fa-regular fa-cube"></i> Tech Stack</h3>
        <div class="skills-chips">
          ${skillsHtml || '<span class="skill-chip">+ Add skills</span>'}
        </div>
      </div>

      <!-- Contact / social card -->
      <div class="info-card">
        <h3><i class="fa-regular fa-address-card"></i> Connect</h3>
        <div class="contact-links">
          <a href="mailto:${safeEmail}" class="contact-link"><i class="fa-regular fa-envelope"></i> ${safeEmail}</a>
          <a href="#" class="contact-link" id="dynamicGithubLink"><i class="fa-brands fa-github"></i> github.com/devportfolio</a>
          <a href="#" class="contact-link"><i class="fa-brands fa-linkedin"></i> LinkedIn Profile</a>
          <a href="#" class="contact-link"><i class="fa-brands fa-whatsapp"></i> WhatsApp Contact</a>
        </div>
      </div>

      <!-- projects full width -->
      <div class="info-card projects-section">
        <h3><i class="fa-regular fa-diagram-project"></i> Featured Projects</h3>
        <div class="project-list">
          ${projectsHtml || '<div class="project-entry"><p>No projects added yet. Use editor to customize later.</p></div>'}
        </div>
      </div>
    </div>
    <div class="footer-note">
      <i class="fa-regular fa-laptop-code"></i> Developer Portfolio • Real-time sync • Built with DevTheme Studio
    </div>
  `;
  
  container.innerHTML = html;
  
  // optional: update dynamic github username placeholder (just adds a nice consistency)
  const githubLink = document.getElementById("dynamicGithubLink");
  if (githubLink) {
    const username = portfolioData.name.toLowerCase().replace(/\s/g, '');
    githubLink.href = `https://github.com/${username}`;
    githubLink.innerHTML = `<i class="fa-brands fa-github"></i> github.com/${username || 'dev'}`;
  }
}

// helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
    return c;
  });
}

// ---------- RENDER SKILL TAGS IN SIDEBAR ----------
function renderSkillsTagsInSidebar() {
  const container = document.getElementById("skillsTagContainer");
  if (!container) return;
  if (!portfolioData.skills.length) {
    container.innerHTML = '<div class="tag-item" style="opacity:0.7;">No skills yet — add above</div>';
    return;
  }
  container.innerHTML = portfolioData.skills.map((skill, idx) => `
    <div class="tag-item">
      ${escapeHtml(skill)}
      <i class="fa-regular fa-circle-xmark" data-skill-index="${idx}" role="button" aria-label="Remove skill"></i>
    </div>
  `).join('');
  
  // attach remove skill event listeners dynamically
  document.querySelectorAll('#skillsTagContainer .fa-circle-xmark').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const indexAttr = icon.getAttribute('data-skill-index');
      if (indexAttr !== null) {
        const idx = parseInt(indexAttr, 10);
        if (!isNaN(idx) && idx >= 0 && idx < portfolioData.skills.length) {
          portfolioData.skills.splice(idx, 1);
          syncInputsFromData();      // sync all fields
          renderPortfolio();
          renderSkillsTagsInSidebar();
          persistData();
        }
      }
    });
  });
}

// ---------- BIND INPUTS TO DATA (two-way sync) ----------
function bindInputsToData() {
  const nameInput = document.getElementById("inputName");
  const titleInput = document.getElementById("inputTitle");
  const bioInput = document.getElementById("inputBio");
  const imageInput = document.getElementById("inputImage");
  const emailInput = document.getElementById("inputEmail");
  const locationInput = document.getElementById("inputLocation");
  
  if (nameInput) nameInput.value = portfolioData.name;
  if (titleInput) titleInput.value = portfolioData.title;
  if (bioInput) bioInput.value = portfolioData.bio;
  if (imageInput) imageInput.value = portfolioData.image;
  if (emailInput) emailInput.value = portfolioData.email;
  if (locationInput) locationInput.value = portfolioData.location;
  
  // Event listeners for live updates
  const updateFromField = (field, key) => {
    if (field) {
      field.addEventListener("input", (e) => {
        portfolioData[key] = e.target.value;
        renderPortfolio();
        persistData();
        // if skills container not needed but name refresh on social github anyway
        if (key === 'name') renderPortfolio(); 
      });
    }
  };
  
  updateFromField(nameInput, "name");
  updateFromField(titleInput, "title");
  updateFromField(bioInput, "bio");
  updateFromField(imageInput, "image");
  updateFromField(emailInput, "email");
  updateFromField(locationInput, "location");
}

// Add new skill logic
function setupSkillAddition() {
  const addBtn = document.getElementById("addSkillBtn");
  const skillInput = document.getElementById("newSkillInput");
  
  const addSkillFromInput = () => {
    let val = skillInput.value.trim();
    if (val !== "") {
      // avoid duplicate simple skill names (optional)
      if (!portfolioData.skills.some(s => s.toLowerCase() === val.toLowerCase())) {
        portfolioData.skills.push(val);
        persistData();
        renderSkillsTagsInSidebar();
        renderPortfolio();
        skillInput.value = "";
      } else {
        // subtle feedback
        const originalPlaceholder = skillInput.placeholder;
        skillInput.placeholder = "⚠️ skill already exists";
        setTimeout(() => { skillInput.placeholder = originalPlaceholder; }, 1200);
      }
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

// Reset everything to default (with confirmation)
function setupReset() {
  const resetBtn = document.getElementById("resetAllBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmReset = confirm("⚠️ Reset all data to default portfolio? Your current changes will be lost.");
      if (confirmReset) {
        localStorage.removeItem("dev_portfolio_theme");
        // default data
        portfolioData = {
          name: "Alex Morgan",
          title: "Senior Full Stack Developer",
          bio: "Passionate engineer focused on scalable products, clean architecture, APIs, and modern frontend experiences.",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          email: "alex@example.com",
          location: "Nairobi, Kenya",
          skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Next.js"],
          projects: [
            { title: "SaaS Dashboard", desc: "Analytics platform with charts, auth, subscriptions.", link: "#" },
            { title: "E-commerce API", desc: "REST API with payments, products, orders.", link: "#" },
            { title: "Portfolio Builder", desc: "Dynamic portfolio generator for professionals.", link: "#" }
          ]
        };
        // update inputs
        syncInputsFromData();
        renderSkillsTagsInSidebar();
        renderPortfolio();
        persistData();
      }
    });
  }
}

// sync all inputs from current portfolioData
function syncInputsFromData() {
  const nameInput = document.getElementById("inputName");
  const titleInput = document.getElementById("inputTitle");
  const bioInput = document.getElementById("inputBio");
  const imageInput = document.getElementById("inputImage");
  const emailInput = document.getElementById("inputEmail");
  const locationInput = document.getElementById("inputLocation");
  if (nameInput) nameInput.value = portfolioData.name;
  if (titleInput) titleInput.value = portfolioData.title;
  if (bioInput) bioInput.value = portfolioData.bio;
  if (imageInput) imageInput.value = portfolioData.image;
  if (emailInput) emailInput.value = portfolioData.email;
  if (locationInput) locationInput.value = portfolioData.location;
}

// Export as JSON file (improvement: download portfolio data)
function setupExport() {
  const exportBtn = document.getElementById("exportDataBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const exportObj = { ...portfolioData, exportedAt: new Date().toISOString() };
      const dataStr = JSON.stringify(exportObj, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devportfolio_${portfolioData.name.replace(/\s/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
}

// optional: project editing could be extended, but current stable includes all skills and core fields
// Additional improvement: add fallback for broken images, and make sure all interactive fields update
// also handle missing icons gracefully

// Initialize everything when DOM is ready
function init() {
  loadStoredData();           // load any saved data
  syncInputsFromData();       // fill sidebar fields
  bindInputsToData();         // bind live listeners
  renderSkillsTagsInSidebar();
  renderPortfolio();
  setupSkillAddition();
  setupReset();
  setupExport();
  // extra guard: if any external changes happen to skills via tags, re-render skills container
  window.addEventListener('storage', (e) => {
    if (e.key === 'dev_portfolio_theme') {
      loadStoredData();
      syncInputsFromData();
      renderSkillsTagsInSidebar();
      renderPortfolio();
    }
  });
}

// start app
document.addEventListener("DOMContentLoaded", init);
