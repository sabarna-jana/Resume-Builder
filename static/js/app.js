document.addEventListener('DOMContentLoaded', () => {
  let currentTemplate = 'professional';

  // --- Slide Navigation Logic ---
  const slides = document.querySelectorAll('.form-slide');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const currentStepEl = document.getElementById('current-step');
  const progressBar = document.getElementById('progress-bar');
  let currentSlideIndex = 0;

  function updateSlideView() {
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    prevBtn.disabled = currentSlideIndex === 0;
    
    if (currentSlideIndex === slides.length - 1) {
      nextBtn.textContent = 'Finish';
      nextBtn.classList.add('btn-success');
      nextBtn.classList.remove('btn-primary');
    } else {
      nextBtn.textContent = 'Next →';
      nextBtn.classList.remove('btn-success');
      nextBtn.classList.add('btn-primary');
    }

    const stepNum = currentSlideIndex + 1;
    currentStepEl.textContent = stepNum;
    progressBar.style.width = `${(stepNum / slides.length) * 100}%`;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlideView();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < slides.length - 1) {
        currentSlideIndex++;
        updateSlideView();
      } else {
        showToast('All steps complete! Click Download PDF.');
      }
    });
    
    // Initialize view
    updateSlideView();
  }


  // Template Selection
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', () => {
      templateCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentTemplate = card.dataset.template;
      generateResume(); // auto-update preview
    });
  });

  // Utility to create a dynamic item block
  function createDynamicItem(containerId, htmlContent) {
    const container = document.getElementById(containerId);
    const item = document.createElement('div');
    item.className = 'dynamic-item';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.type = 'button';
    removeBtn.onclick = () => {
      item.remove();
      generateResume();
    };

    item.innerHTML = htmlContent;
    item.appendChild(removeBtn);
    container.appendChild(item);

    // Add event listeners to input fields to trigger preview update
    item.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', generateResume);
    });
  }

  // --- Skills ---
  document.getElementById('add-skill-btn').addEventListener('click', () => {
    createDynamicItem('skills-container', `
      <div class="form-row">
        <div class="form-group" style="flex: 0.4;">
          <label>Category (e.g., Tools)</label>
          <input type="text" class="skill-category" placeholder="Soft Skills">
        </div>
        <div class="form-group">
          <label>Skills (comma separated)</label>
          <input type="text" class="skill-list" placeholder="Negotiation, Communication...">
        </div>
      </div>
    `);
  });

  // --- Experience ---
  document.getElementById('add-exp-btn').addEventListener('click', () => {
    createDynamicItem('experience-container', `
      <div class="form-row">
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" class="exp-title" placeholder="Business Development Intern">
        </div>
        <div class="form-group">
          <label>Duration / Dates</label>
          <input type="text" class="exp-dates" placeholder="Jul 2025 - Dec 2025">
        </div>
      </div>
      <div class="form-group">
        <label>Company & Location</label>
        <input type="text" class="exp-company" placeholder="Zidio Development | Bengaluru, India">
      </div>
      <div class="form-group">
        <label>Description (bullet points, separated by new lines)</label>
        <textarea class="exp-desc" rows="3" placeholder="- Conducted market research..."></textarea>
      </div>
    `);
  });

  // --- Projects ---
  document.getElementById('add-project-btn').addEventListener('click', () => {
    createDynamicItem('projects-container', `
      <div class="form-row">
        <div class="form-group">
          <label>Project Title</label>
          <input type="text" class="proj-title" placeholder="Market Expansion Campaign">
        </div>
        <div class="form-group">
          <label>Dates</label>
          <input type="text" class="proj-dates" placeholder="Jan 2026 - Feb 2026">
        </div>
      </div>
      <div class="form-group">
        <label>Context / Subtitle</label>
        <input type="text" class="proj-subtitle" placeholder="Academic / Freelance Project">
      </div>
      <div class="form-group">
        <label>Description (bullet points, separated by new lines)</label>
        <textarea class="proj-desc" rows="3" placeholder="- Developed go-to-market strategy..."></textarea>
      </div>
    `);
  });

  // --- Certifications ---
  document.getElementById('add-cert-btn').addEventListener('click', () => {
    createDynamicItem('certs-container', `
      <div class="form-row">
        <div class="form-group">
          <label>Certification Name</label>
          <input type="text" class="cert-name" placeholder="Inbound Sales Certification">
        </div>
        <div class="form-group">
          <label>Issuer & Year</label>
          <input type="text" class="cert-issuer" placeholder="HubSpot Academy (2025)">
        </div>
      </div>
    `);
  });

  // --- Education ---
  document.getElementById('add-edu-btn').addEventListener('click', () => {
    createDynamicItem('edu-container', `
      <div class="form-row">
        <div class="form-group">
          <label>Degree</label>
          <input type="text" class="edu-degree" placeholder="Master of Computer Applications (MCA)">
        </div>
        <div class="form-group">
          <label>Dates</label>
          <input type="text" class="edu-dates" placeholder="2024 - 2026">
        </div>
      </div>
      <div class="form-group">
        <label>Institution</label>
        <input type="text" class="edu-school" placeholder="Parul Institute, Vadodara">
      </div>
    `);
  });

  // Initialize with some default items for ease of use
  document.getElementById('add-skill-btn').click();
  document.getElementById('add-exp-btn').click();
  document.getElementById('add-edu-btn').click();

  // Attach auto-update to static fields
  document.querySelectorAll('#resume-form input, #resume-form textarea').forEach(input => {
    input.addEventListener('input', generateResume);
  });

  // Toast Function
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  // Generation Logic
  function gatherData() {
    return {
      name: document.getElementById('input-name').value || 'Your Name',
      title: document.getElementById('input-title').value || 'Your Professional Title',
      location: document.getElementById('input-location').value || '',
      email: document.getElementById('input-email').value || '',
      phone: document.getElementById('input-phone').value || '',
      linkedin: document.getElementById('input-linkedin').value || '',
      github: document.getElementById('input-github').value || '',
      summary: document.getElementById('input-summary').value || '',
      
      skills: Array.from(document.querySelectorAll('#skills-container .dynamic-item')).map(item => ({
        category: item.querySelector('.skill-category').value,
        list: item.querySelector('.skill-list').value
      })).filter(s => s.category || s.list),

      experience: Array.from(document.querySelectorAll('#experience-container .dynamic-item')).map(item => ({
        title: item.querySelector('.exp-title').value,
        dates: item.querySelector('.exp-dates').value,
        company: item.querySelector('.exp-company').value,
        desc: item.querySelector('.exp-desc').value.split('\n').filter(l => l.trim().length > 0)
      })).filter(e => e.title || e.company),

      projects: Array.from(document.querySelectorAll('#projects-container .dynamic-item')).map(item => ({
        title: item.querySelector('.proj-title').value,
        dates: item.querySelector('.proj-dates').value,
        subtitle: item.querySelector('.proj-subtitle').value,
        desc: item.querySelector('.proj-desc').value.split('\n').filter(l => l.trim().length > 0)
      })).filter(p => p.title),

      certs: Array.from(document.querySelectorAll('#certs-container .dynamic-item')).map(item => ({
        name: item.querySelector('.cert-name').value,
        issuer: item.querySelector('.cert-issuer').value
      })).filter(c => c.name),

      education: Array.from(document.querySelectorAll('#edu-container .dynamic-item')).map(item => ({
        degree: item.querySelector('.edu-degree').value,
        dates: item.querySelector('.edu-dates').value,
        school: item.querySelector('.edu-school').value
      })).filter(e => e.degree)
    };
  }

  function renderProfessional(data) {
    let html = `<div class="resume-document tpl-professional">
      <div class="name">${data.name.toUpperCase()}</div>
      <div class="contact">
        ${data.location ? data.location + '<span class="sep">|</span>' : ''}
        ${data.email ? `<a href="mailto:${data.email}">${data.email}</a><span class="sep">|</span>` : ''}
        ${data.phone ? data.phone + '<span class="sep">|</span>' : ''}
        ${data.linkedin ? `<a href="https://${data.linkedin}">${data.linkedin}</a><span class="sep">|</span>` : ''}
        ${data.github ? `<a href="https://${data.github}">${data.github}</a>` : ''}
      </div>
      <hr class="divider">`;

    if (data.summary) {
      html += `<div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary-text">${data.summary}</div>
      </div>`;
    }

    if (data.skills.length > 0) {
      html += `<div class="section">
        <div class="section-title">Core Competencies</div>
        ${data.skills.map(s => `<div class="skills-row"><span class="skill-label">${s.category}: </span>${s.list}</div>`).join('')}
      </div>`;
    }

    if (data.experience.length > 0) {
      html += `<div class="section">
        <div class="section-title">Professional Experience</div>
        ${data.experience.map(e => `
          <div class="entry-header">
            <span class="entry-title">${e.title}</span>
            <span class="entry-meta"> | ${e.company} | ${e.dates}</span>
          </div>
          <ul class="bullets">
            ${e.desc.map(d => `<li>${d.replace(/^- /, '')}</li>`).join('')}
          </ul>
        `).join('')}
      </div>`;
    }

    if (data.projects.length > 0) {
      html += `<div class="section">
        <div class="section-title">Projects</div>
        ${data.projects.map(p => `
          <div class="entry-header" style="margin-top:5px;">
            <span class="entry-title">${p.title}</span>
            <span class="entry-meta">${p.subtitle ? ' | ' + p.subtitle : ''}${p.dates ? ' | ' + p.dates : ''}</span>
          </div>
          <ul class="bullets">
            ${p.desc.map(d => `<li>${d.replace(/^- /, '')}</li>`).join('')}
          </ul>
        `).join('')}
      </div>`;
    }

    if (data.certs.length > 0) {
      html += `<div class="section">
        <div class="section-title">Certifications & Achievements</div>
        <ul class="cert-list">
          ${data.certs.map(c => `<li><span class="cert-name">${c.name}</span> — ${c.issuer}</li>`).join('')}
        </ul>
      </div>`;
    }

    if (data.education.length > 0) {
      html += `<div class="section">
        <div class="section-title">Education</div>
        ${data.education.map(e => `
          <div class="edu-item">
            <span class="edu-degree">${e.degree}</span>
            <span class="edu-school">| ${e.school}</span>
            <span class="edu-year">| ${e.dates}</span>
          </div>
        `).join('')}
      </div>`;
    }

    html += `</div>`;
    return html;
  }

  function renderStylish(data) {
    let html = `<div class="resume-document tpl-stylish">
      <header class="resume-header">
        <h1 class="name">${data.name}</h1>
        <div class="subtitle">${data.title}</div>
        <div class="contact-info">
          ${data.location ? `<span>📍 ${data.location}</span><span>|</span>` : ''}
          ${data.email ? `<a href="mailto:${data.email}">✉️ ${data.email}</a><span>|</span>` : ''}
          ${data.phone ? `<span>📞 ${data.phone}</span><span>|</span>` : ''}
          ${data.linkedin ? `<a href="https://${data.linkedin}">🔗 LinkedIn</a><span>|</span>` : ''}
          ${data.github ? `<a href="https://${data.github}">🔗 GitHub</a>` : ''}
        </div>
      </header>
      <div class="resume-body">`;

    if (data.summary) {
      html += `<section>
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary-text">${data.summary}</p>
      </section>`;
    }

    if (data.skills.length > 0) {
      html += `<section>
        <h2 class="section-title">Core Competencies</h2>
        <div class="skills-container">
          ${data.skills.map(s => `<div class="skill-row"><span class="skill-label">${s.category}: </span>${s.list}</div>`).join('')}
        </div>
      </section>`;
    }

    if (data.experience.length > 0) {
      html += `<section>
        <h2 class="section-title">Professional Experience</h2>
        ${data.experience.map(e => `
          <div class="entry">
            <div class="entry-header">
              <h3 class="entry-title">${e.title}</h3>
              <span class="entry-date">${e.dates}</span>
            </div>
            <div class="entry-company">${e.company}</div>
            <ul class="bullets">
              ${e.desc.map(d => `<li>${d.replace(/^- /, '')}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>`;
    }

    if (data.projects.length > 0) {
      html += `<section>
        <h2 class="section-title">Projects</h2>
        ${data.projects.map(p => `
          <div class="entry">
            <div class="entry-header">
              <h3 class="entry-title">${p.title}</h3>
              <span class="entry-date">${p.dates}</span>
            </div>
            ${p.subtitle ? `<div class="entry-company">${p.subtitle}</div>` : ''}
            <ul class="bullets">
              ${p.desc.map(d => `<li>${d.replace(/^- /, '')}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </section>`;
    }

    if (data.certs.length > 0) {
      html += `<section>
        <h2 class="section-title">Certifications & Achievements</h2>
        <ul class="cert-list">
          ${data.certs.map(c => `<li><span class="cert-name">${c.name}</span> — ${c.issuer}</li>`).join('')}
        </ul>
      </section>`;
    }

    if (data.education.length > 0) {
      html += `<section>
        <h2 class="section-title">Education</h2>
        ${data.education.map(e => `
          <div class="entry" style="margin-top: 8px;">
            <div class="entry-header">
              <h3 class="entry-title">${e.degree}</h3>
              <span class="entry-date">${e.dates}</span>
            </div>
            <div class="entry-company">${e.school}</div>
          </div>
        `).join('')}
      </section>`;
    }

    html += `</div></div>`;
    return html;
  }

  function generateResume() {
    const data = gatherData();
    let resumeHTML = '';
    
    if (currentTemplate === 'professional') {
      resumeHTML = renderProfessional(data);
    } else {
      resumeHTML = renderStylish(data);
    }

    // Update both preview and actual print area
    document.getElementById('resume-render-area').innerHTML = resumeHTML;
    document.getElementById('print-area').innerHTML = resumeHTML;
  }

  document.getElementById('generate-btn').addEventListener('click', () => {
    generateResume();
    showToast('Preview Updated!');
  });

  document.getElementById('download-btn').addEventListener('click', () => {
    generateResume();
    showToast('Preparing PDF...');
    setTimeout(() => {
      window.print();
    }, 500);
  });

  // Initial generate
  generateResume();
});
