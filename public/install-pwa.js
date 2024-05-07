/* Custom Install */
let installSource;
let deferredPrompt;
const btnAdd = document.getElementById("installButton");
const divInstallStatus = document.getElementById("installAvailable");

const installContainer = document.getElementById("installContainer");

// Handle install available
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  console.log("beforeinstallprompt");
  showInstallPromo(e);
});

// Handle user request to install
btnAdd.addEventListener("click", (e) => {
  deferredPrompt.prompt();
  console.log("button clicked");
});

// Hide the install button
window.addEventListener("appinstalled", (evt) => {
  installContainer.classList.toggle("hidden", false);
  installContainer.classList.remove("flex");
  installContainer.classList.add("hidden");

  // divInstallStatus.textContent = 'false';
  // btnAdd.setAttribute('disabled', 'disabled');
  deferredPrompt = null;
});

// Show the install button
function showInstallPromo(e) {
  deferredPrompt = e;
  installContainer.classList.add("flex");
  installContainer.classList.remove("hidden");
  // divInstallStatus.textContent = 'true';
  // btnAdd.removeAttribute('disabled');
}
