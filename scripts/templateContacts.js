function templateContacts(contact) {
  const { name, email, monogram, id, monogramColor } = contact;

  return `
      <div class="contact" onclick="showContactDetails('${id}')"> <!-- Ändere 'key' auf 'id' -->
        <div class="monogram" style="background-color: ${monogramColor};">${monogram}</div>
        <div class="contact-info">
          <div class="name">${name}</div>
          <div class="email">
            <a href="mailto:${email}">${email}</a>
          </div>
        </div>
      </div>
    </div>`;
}

function templateContactsDetails({ name, email, monogram, phone, monogramColor }) {
  return `
    <div class="contentfix">
                <h1>
                  Contacts
                </h1>
                <div class="divider"></div>
                <p>Better with a team</p>
              </div>
              <div class="contact-details-wrapper">
                <div class="content-top">
                  <div class="contact-monogram monogram" style="background-color: ${monogramColor};">
                    ${monogram}
                  </div>
                  <div class="contact-details">
                    <h2>${name}</h2>
                    <div class="edit-and-delete">
                      <div class="edit">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        <p>Edit</p>
                      </div>
                      <div class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="contact-information">
                  <div class="contact-information-title">
                    <p>Contact Information</p>
                  </div>
                  <div>
                    <div class="contact-info-item">
                      <p>Email</p>
                    <a href="${email}">${email}</a>
                    </div>
                    <div class="contact-info-item">
                      <p>Phone</p>
                      <a href="${phone}">${phone}</a>
                    </div>
                  </div>
                </div>
              </div>
  `;
}