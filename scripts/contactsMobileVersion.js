/**
 * Navigates back to the contact list view on mobile devices.
 * Hides the contact detail view and removes any active contact styling.
 */
function backTocontacts(){
  document.getElementById('contact-list').classList.remove('d_mobile_none');
  document.getElementById('contenttop').classList.add('d_mobile_none');
  document.getElementById('contenttop').classList.remove('d_block');
  document.getElementById('contact-details').classList.add('d_none');
  document.getElementById('contact-details').classList.remove('d_block');
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
}

/**
 * Adds a hover effect style to the mobile "Add Contact" button.
 */
function mobileAddButtonHoverColorAdd(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.add('button-hover-style');
}

/**
 * Removes the hover effect style from the mobile "Add Contact" button.
 */
function mobileAddButtonHoverColorRemove(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.remove('button-hover-style');
}

/**
 * Adds a hover effect style to the mobile dropdown button.
 */
function mobileDropdownButtonHoverColorAdd(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.add('button-hover-style');
}

/**
 * Removes the hover effect style from the mobile dropdown button.
 */
function mobileDropdownButtonHoverColorRemove(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.remove('button-hover-style');
}

/**
 * Toggles the visibility of the dropdown menu for a given contact.
 *
 * @param {string} id - The ID of the contact for which the dropdown is toggled.
 * @param {MouseEvent} event - The click event triggering the toggle.
 */
function toggleDropdown(id, event) {
  event.stopPropagation();
  const menu = document.getElementById(`dropdown-menu-${id}`);
  if (!menu) return;

  if (menu.classList.contains('show')) {
    return;
  } else {
    menu.classList.remove('hidden');
    requestAnimationFrame(() => {
      menu.classList.add('show');
    });
    mobileDropdownButtonHoverColorAdd();
    lastOpenedDropdownId = id;
  }
}

/**
 * Closes all dropdown menus if the user clicks outside of them.
 *
 * @param {MouseEvent} event - The click event.
 * @returns {boolean} - Returns true if a dropdown was open and got closed.
 */
function closeAllDropdownsIfClickedOutside(event) {
  let dropdownWasOpen = false;
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if (menu.classList.contains('hidden')) return;
    const id = menu.id.replace('dropdown-menu-', '');
    const button = document.getElementById(`mobile-dropdown-button-${id}`);
    const clickedInsideMenu = menu.contains(event.target);
    const clickedOnButton = button && button.contains(event.target);

    if (!clickedInsideMenu && !clickedOnButton) {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        setTimeout(() => menu.classList.add('hidden'), 300);
      } else {
        menu.classList.add('hidden');
      }
      dropdownWasOpen = true;
      setTimeout(() => {
        mobileDropdownButtonHoverColorRemove();
        lastOpenedDropdownId = null;
      }, 1000);
    }
  });
  return dropdownWasOpen;
}

/**
 * Handles logic to close dropdowns when clicking outside, unless a popup is open.
 *
 * @param {MouseEvent} event - The click event.
 * @returns {boolean} - Whether a dropdown was closed.
 */
function handleDropdownOnClick(event) {
  const refOverlay = document.getElementById('layout');
  const popupOpen = refOverlay && !refOverlay.classList.contains('d_none');
  if (popupOpen) return false;

  return closeAllDropdownsIfClickedOutside(event);
}

/**
 * Global click event listener for the document.
 * Handles closing popups and dropdowns appropriately.
 */
document.addEventListener('click', (event) => {
  const targetID = event.target.id;

  if (targetID === 'save' || targetID === 'delete') {
    event.stopPropagation();
    popUpClose();
    return;
  }

  const refOverlay = document.getElementById('layout');
  const popupOpen = refOverlay && !refOverlay.classList.contains('d_none');
  if (popupOpen) return;

  const dropdownWasOpen = closeAllDropdownsIfClickedOutside(event);
  if (dropdownWasOpen) event.stopPropagation();
});