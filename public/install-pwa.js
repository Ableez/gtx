/* Custom Install */
let installSource;
let deferredPrompt;
const btnAdd = document.getElementById("installButton");
const divInstallStatus = document.getElementById("installAvailable");

const installContainer = document.getElementById("installContainer");

// Handle install available
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  console.log(e);
  console.log("beforeinstallprompt");
  showInstallPromo(e);
  deferredPrompt = e;
});

// Handle user request to install
btnAdd.addEventListener("click", (e) => {
  console.log(deferredPrompt);
  deferredPrompt?.prompt();
  deferredPrompt?.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
  });
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
  installContainer.classList.add("flex");
  installContainer.classList.remove("hidden");
  // divInstallStatus.textContent = 'true';
  // btnAdd.removeAttribute('disabled');
}
