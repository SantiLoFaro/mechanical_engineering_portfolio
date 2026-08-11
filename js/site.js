import { modelCatalog } from "./models.js";
import { showModel } from "./viewer.js";

const projectGrid = document.querySelector("#project-grid");

function renderProjectCards() {
    projectGrid.innerHTML = "";
    modelCatalog.forEach((model, index) => {
        const article = document.createElement("article");
        article.className = "project-card";
        article.innerHTML = `
            <div class="project-card__top">
                <span class="project-card__number">${String(index + 1).padStart(2, "0")}</span>
                <span class="project-card__type">${model.type}</span>
            </div>
            <div>
                <p class="technical-label">${model.file.split("/").pop()}</p>
                <h3>${model.title}</h3>
                <p>${model.description}</p>
                <button class="project-card__button" type="button" data-model-index="${index}">LOAD IN 3D VIEWER ↗</button>
            </div>`;
        projectGrid.appendChild(article);
    });
}
function handleProjectClick(event) {
    const button = event.target.closest("[data-model-index]");
    if (!button) return;
    showModel(Number(button.dataset.modelIndex));
    document.querySelector("#stl-viewer").scrollIntoView({ behavior: "smooth", block: "center" });
}
renderProjectCards();
projectGrid.addEventListener("click", handleProjectClick);
