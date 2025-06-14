function backTocontacts(){
  document.getElementById('contact-list').classList.remove('d_mobile_none');
  document.getElementById('contenttop').classList.add('d_mobile_none');
  document.getElementById('contenttop').classList.remove('d_block');
  document.getElementById('contact-details').classList.add('d_none');
  document.getElementById('contact-details').classList.remove('d_block');
  const allContacts = document.querySelectorAll('.contact');
  allContacts.forEach(c => c.classList.remove('active-contact'));
}

function mobileAddButtonHoverColorAdd(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.add('button-hover-style');
}

function mobileAddButtonHoverColorRemove(){
  const openNewContactButton = document.getElementById('mobile-add-button');
  openNewContactButton.classList.remove('button-hover-style');
}

function mobileDropdownButtonHoverColorAdd(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.add('button-hover-style');
}
function mobileDropdownButtonHoverColorRemove(){
  const button = document.getElementById('mobile-dropdown-button');
  if (button) button.classList.remove('button-hover-style');
}

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

function handleDropdownOnClick(event) {
  const refOverlay = document.getElementById('layout');
  const popupOpen = refOverlay && !refOverlay.classList.contains('d_none');
  if (popupOpen) return false;

  return closeAllDropdownsIfClickedOutside(event);
}

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