let pages = [];

function saveCurrentPageInputs() {
  const activePage = parseInt(document.getElementById("activePage").value);
  const page = pages[activePage];

  // Removed hero fields

  page.footerText = document.getElementById("footerText").value;
  page.footerBgColor = document.getElementById("footerBgColor").value;
  page.footerAlign = document.getElementById("footerTextAlign").value;
}

document.addEventListener("DOMContentLoaded", () => {
  updatePageOptions();

  const footerInputIds = [
    "footerText",
    "footerBgColor",
    "footerTextAlign"
  ];

  footerInputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        const activePage = parseInt(document.getElementById("activePage").value);
        const page = pages[activePage];
        if (!page) return;

        switch (id) {
          case "footerText":
            page.footerText = el.value;
            break;
          case "footerBgColor":
            page.footerBgColor = el.value;
            break;
          case "footerTextAlign":
            page.footerAlign = el.value;
            break;
        }
        updatePreview();
      });
    }
  });

 document.getElementById("bgImageInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    const activePage = parseInt(document.getElementById("activePage").value);
    pages[activePage].backgroundImage = dataUrl;
    updatePreview();
  };
  reader.readAsDataURL(file);
});


  // Remove numPages listener; fixed pages to 3

  document.getElementById("activePage").addEventListener("change", () => {
    saveCurrentPageInputs();

    const activePageIndex = parseInt(document.getElementById("activePage").value);
    const p = pages[activePageIndex];

    // No hero fields anymore
    document.getElementById("footerText").value = p.footerText;
    document.getElementById("footerBgColor").value = p.footerBgColor;
    document.getElementById("footerTextAlign").value = p.footerAlign;

    updateSectionsUI();
    updatePreview();
  });

  document.getElementById("numSections").addEventListener("change", () => {
    updateSectionsUI();
    updatePreview();
  });

  // Removed heroImage input listener
});

function getNavbarLabels() {
  // Only 3 nav items now
  return [
    document.getElementById('navItem1').value,
    document.getElementById('navItem2').value,
    document.getElementById('navItem3').value
  ];
}

function updatePageOptions() {
  const activePageSelect = document.getElementById("activePage");
  activePageSelect.innerHTML = "";

  pages.length = 0;
  const numPages = 3; // Fixed to 3 pages
  for (let i = 0; i < numPages; i++) {
    pages.push({
      // Removed hero properties
      footerText: "© 2025 Your Brand",
      footerBgColor: "#111827",
      footerAlign: "center",
      sections: []
    });
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `Page ${i + 1}`;
    activePageSelect.appendChild(opt);
  }
  activePageSelect.value = 0;
}

function updateSectionsUI() {
  const numSections = parseInt(document.getElementById("numSections").value);
  const activePage = parseInt(document.getElementById("activePage").value);
  const container = document.getElementById("sectionsContainer");
  container.innerHTML = "";

  const currentSections = pages[activePage].sections || [];
  if (currentSections.length !== numSections) {
    if (currentSections.length > numSections) {
      currentSections.length = numSections;
    } else {
      for (let i = currentSections.length; i < numSections; i++) {
        currentSections.push({
          title: `Section ${i + 1}`,
          text: "Your content goes here",
          color: "#000000",
          bgColor: "#ffffff",
          align: "left"
        });
      }
    }
  }
  pages[activePage].sections = currentSections;

  currentSections.forEach((section, i) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <hr />
      <label>Section ${i + 1} Title</label>
      <input value="${section.title}" onchange="pages[${activePage}].sections[${i}].title = this.value; updatePreview()" />
      
      <label>Section ${i + 1} Text</label>
      <textarea onchange="pages[${activePage}].sections[${i}].text = this.value; updatePreview()">${section.text}</textarea>
      
      <label>Text Color</label>
      <input type="color" value="${section.color}" onchange="pages[${activePage}].sections[${i}].color = this.value; updatePreview()" />
      
      <label>Background Color</label>
      <input type="color" value="${section.bgColor}" onchange="pages[${activePage}].sections[${i}].bgColor = this.value; updatePreview()" />
      
      <label>Section ${i + 1} Alignment</label>
      <select onchange="pages[${activePage}].sections[${i}].align = this.value; updatePreview()">
        <option value="left"${section.align === 'left' ? ' selected' : ''}>Left</option>
        <option value="center"${section.align === 'center' ? ' selected' : ''}>Center</option>
        <option value="right"${section.align === 'right' ? ' selected' : ''}>Right</option>
      </select>
    `;
    container.appendChild(wrapper);
  });

  updatePreview();
}

function generateNavbarHTML(title, navItems) {
  const itemsHTML = navItems
    .map(item => `<span style="margin-right: 15px;">${item}</span>`)
    .join("");
  return `<nav>
            <strong>${title}</strong> 
            <div style="float:right">${itemsHTML}</div>
          </nav>`;
}

function updatePreview() {
  saveCurrentPageInputs();

  const siteTitle = document.getElementById("siteTitle").value;
  const accentColor = document.getElementById("accentColor").value;
  const navbarColor = document.getElementById("navbarLabelColor").value;
  const navbarFontSize = document.getElementById("navbarFontSize").value + "px";
  const navbarPadding = document.getElementById("navbarPadding").value;
  const navbarAlign = document.getElementById("navbarAlignment").value;
  const globalBgColor = document.getElementById("globalBgColor").value;

  const activePage = parseInt(document.getElementById("activePage").value);
  const pageData = pages[activePage];

  const footerText = pageData.footerText;
  const footerBg = pageData.footerBgColor;
  const footerAlign = pageData.footerAlign;

  const navItems = getNavbarLabels();

  const sectionsHTML = pageData.sections
    .map(
      (s) => `
      <section style="background: ${s.bgColor}; padding: 20px; text-align: ${s.align};">
        <h2 style="color: ${s.color};">${s.title}</h2>
        <p style="color: ${s.color};">${s.text}</p>
      </section>`
    )
    .join("");

  const justifyContent = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  }[navbarAlign];

  // Build background style with base64 image if provided
  let backgroundStyle = globalBgColor;
  if (pageData.backgroundImage) {
    backgroundStyle = `
      url('${pageData.backgroundImage}') no-repeat center center fixed,
      ${globalBgColor}
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            height: 100%;
            margin: 0;
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            background: ${backgroundStyle};
            background-size: cover;
          }
          main {
            flex: 1;
          }
          nav {
            background: ${accentColor};
            padding: ${navbarPadding};
            font-size: ${navbarFontSize};
            color: ${navbarColor};
            display: flex;
            justify-content: ${justifyContent};
            align-items: center;
            gap: 20px;
          }
          footer {
            background: ${footerBg};
            color: white;
            padding: 20px;
            text-align: ${footerAlign};
          }
        </style>
      </head>
      <body>
        ${generateNavbarHTML(siteTitle, navItems)}
        <main>
          ${sectionsHTML}
        </main>
        <footer>${footerText}</footer>
      </body>
    </html>
  `;

  document.getElementById("previewFrame").srcdoc = html;
}

function exportZip() {
  const zip = new JSZip();
  const numPages = 3; // fixed or dynamic
  const navItems = getNavbarLabels();

  const siteTitle = document.getElementById("siteTitle").value;
  const accentColor = document.getElementById("accentColor").value;
  const navbarColor = document.getElementById("navbarLabelColor").value;
  const navbarFontSize = document.getElementById("navbarFontSize").value + "px";
  const navbarPadding = document.getElementById("navbarPadding").value;
  const navbarAlign = document.getElementById("navbarAlignment").value;
  const globalBgColor = document.getElementById("globalBgColor").value;

  const justifyContent = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  }[navbarAlign];

  for (let i = 0; i < numPages; i++) {
    const p = pages[i];
    const sectionsHTML = p.sections
      .map(
        (s) => `
      <section style="background: ${s.bgColor}; padding: 20px; text-align: ${s.align};">
        <h2 style="color: ${s.color};">${s.title}</h2>
        <p style="color: ${s.color};">${s.text}</p>
      </section>`
      )
      .join("");

    let backgroundStyle = globalBgColor;
    if (p.backgroundImage) {
      backgroundStyle = `
        url('${p.backgroundImage}') no-repeat center center fixed,
        ${globalBgColor}
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body {
              height: 100%;
              margin: 0;
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              background: ${backgroundStyle};
              background-size: cover;
            }
            main {
              flex: 1;
            }
            nav {
              background: ${accentColor};
              padding: ${navbarPadding};
              font-size: ${navbarFontSize};
              color: ${navbarColor};
              display: flex;
              justify-content: ${justifyContent};
              align-items: center;
              gap: 20px;
            }
            footer {
              background: ${p.footerBgColor};
              color: white;
              padding: 20px;
              text-align: ${p.footerAlign};
            }
          </style>
        </head>
        <body>
          ${generateNavbarHTML(siteTitle, navItems)}
          <main>
            ${sectionsHTML}
          </main>
          <footer>${p.footerText}</footer>
        </body>
      </html>
    `;

    zip.file(`page${i + 1}.html`, html);
  }

  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "starter_template.zip");
  });
}



