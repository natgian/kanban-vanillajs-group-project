/**
 * This function is required to start the page and to load essential functions.
 */
function init() {
    let loader = document.getElementById('loader');
    let logo = document.getElementById('logo');
    logo.classList.add('fly');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1500);
}