import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { modelCatalog } from "./models.js";

const canvas = document.querySelector("#stl-canvas");
const container = document.querySelector("#stl-viewer");
const loadingPanel = document.querySelector("#viewer-loading");
const statusText = document.querySelector("#viewer-status");
const fileLabel = document.querySelector("#viewer-file");
const titleLabel = document.querySelector("#viewer-title");
const descriptionLabel = document.querySelector("#viewer-description");
const counterLabel = document.querySelector("#viewer-counter");
const progressBar = document.querySelector("#viewer-progress-bar");
const previousButton = document.querySelector("#prev-model");
const nextButton = document.querySelector("#next-model");
const cycleButton = document.querySelector("#toggle-cycle");

const CYCLE_TIME = 7000;
let currentIndex = 0;
let currentMesh = null;
let cycleTimer = null;
let isCyclePaused = false;
let activeLoadToken = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 5000);
camera.position.set(0, 0, 150);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 30;
controls.maxDistance = 700;

scene.add(new THREE.HemisphereLight(0xe8eef0, 0x172026, 1.7));
const keyLight = new THREE.DirectionalLight(0xffc36e, 2.5); keyLight.position.set(120, 160, 180); scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x7f9eaa, 1.8); fillLight.position.set(-140, 30, 80); scene.add(fillLight);
const rimLight = new THREE.DirectionalLight(0xffffff, 1.0); rimLight.position.set(0, -130, -100); scene.add(rimLight);

const loader = new STLLoader();

function setLoading(message) {
    statusText.textContent = message;
    loadingPanel.classList.remove("is-hidden");
}
function hideLoading() { loadingPanel.classList.add("is-hidden"); }
function disposeCurrentMesh() {
    if (!currentMesh) return;
    scene.remove(currentMesh);
    currentMesh.geometry.dispose();
    currentMesh.material.dispose();
    currentMesh = null;
}
function centerAndFitGeometry(geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center); box.getSize(size);
    geometry.translate(-center.x, -center.y, -center.z);
    geometry.computeVertexNormals();
    const maxDimension = Math.max(size.x, size.y, size.z);
    return maxDimension > 0 ? 80 / maxDimension : 1;
}
function updateViewerText(model, index) {
    fileLabel.textContent = model.file.split("/").pop().toUpperCase();
    titleLabel.textContent = model.title;
    descriptionLabel.textContent = model.description;
    counterLabel.textContent = `${String(index + 1).padStart(2,"0")} / ${String(modelCatalog.length).padStart(2,"0")}`;
}
function restartProgress() {
    progressBar.classList.remove("is-running");
    void progressBar.offsetWidth;
    if (!isCyclePaused) progressBar.classList.add("is-running");
}
function scheduleNextModel() {
    clearTimeout(cycleTimer);
    if (isCyclePaused || modelCatalog.length <= 1) return;
    restartProgress();
    cycleTimer = setTimeout(() => showModel(currentIndex + 1, 1), CYCLE_TIME);
}
function loadModelAtIndex(index, direction, attemptsLeft) {
    const safeIndex = (index + modelCatalog.length) % modelCatalog.length;
    const model = modelCatalog[safeIndex];
    const loadToken = ++activeLoadToken;
    setLoading(model.file);
    updateViewerText(model, safeIndex);

    loader.load(model.file, (geometry) => {
        if (loadToken !== activeLoadToken) { geometry.dispose(); return; }
        disposeCurrentMesh();
        const scale = centerAndFitGeometry(geometry);
        const material = new THREE.MeshStandardMaterial({ color: 0xbec7ca, metalness: 0.34, roughness: 0.46 });
        currentMesh = new THREE.Mesh(geometry, material);
        currentMesh.scale.setScalar(scale);
        currentMesh.rotation.set(-0.35, 0.45, 0.08);
        scene.add(currentMesh);
        currentIndex = safeIndex;
        camera.position.set(0, 0, 150);
        controls.target.set(0, 0, 0);
        controls.update();
        hideLoading();
        scheduleNextModel();
    }, undefined, () => {
        if (loadToken !== activeLoadToken) return;
        const remaining = attemptsLeft - 1;
        if (remaining > 0) {
            loadModelAtIndex(safeIndex + direction, direction, remaining);
            return;
        }
        disposeCurrentMesh();
        statusText.textContent = "No STL files found. Add stl1.stl, stl2.stl, etc. to /models.";
        loadingPanel.classList.remove("is-hidden");
        clearTimeout(cycleTimer);
        progressBar.classList.remove("is-running");
    });
}

export function showModel(index, direction = 1) {
    if (modelCatalog.length === 0) { setLoading("No models configured in js/models.js"); return; }
    loadModelAtIndex(index, direction, modelCatalog.length);
}
export function showPreviousModel() { showModel(currentIndex - 1, -1); }
export function showNextModel() { showModel(currentIndex + 1, 1); }
export function toggleAutoCycle() {
    isCyclePaused = !isCyclePaused;
    cycleButton.textContent = isCyclePaused ? "Resume" : "Pause";
    cycleButton.setAttribute("aria-pressed", String(isCyclePaused));
    clearTimeout(cycleTimer);
    progressBar.classList.remove("is-running");
    if (!isCyclePaused) scheduleNextModel();
}
function resizeViewer() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
function animate() {
    requestAnimationFrame(animate);
    if (currentMesh) currentMesh.rotation.z += 0.001;
    controls.update();
    renderer.render(scene, camera);
}

previousButton.addEventListener("click", showPreviousModel);
nextButton.addEventListener("click", showNextModel);
cycleButton.addEventListener("click", toggleAutoCycle);
window.addEventListener("resize", resizeViewer);
resizeViewer(); animate(); showModel(0);
