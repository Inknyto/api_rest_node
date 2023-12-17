const url = 'http://localhost:3000/';

// Function to sort data by id_ap column
function sortDataById(jsonData, endpoint) {
  return jsonData.sort((a, b) => a[fieldNamesMap[endpoint].id] - b[fieldNamesMap[endpoint].id]);
}

const titre = document.getElementById('titre')

function addEventListeners(buttonId, titleText, backgroundColor) {
  const button = document.getElementById(buttonId);
  button.addEventListener('click', () => {
    titre.innerText = titleText;
  });
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = backgroundColor;
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'white';
  });
}

addEventListeners('getDataElectronique', 'Dall Diamm Electronique - ADMIN', '#5e2598');
addEventListeners('getDataElectromenager', 'Dall Diamm Electromenager - ADMIN', '#1316ed');
addEventListeners('getDataLuminaire', 'Dall Diamm Luminaire - ADMIN', '#ff00fb');



// Define the field name mapping for each endpoint
const fieldNamesMap = {
  electronique: {
    id: 'id_e',
    name: 'nom',
    price: 'prix',
    imageUrl: 'image' // Example: If 'image' is the field name in the API response, and 'image_url' is the field name in the form
  },
  electromenager: {
    id: 'id_ap',
    name: 'nom_ap',
    location: 'emp_ap',
    price: 'prix_ap',
    imageUrl: 'img_ap' // Example: If 'img_ap' is the field name in the API response, and 'image' is the field name in the form
  },
  luminaire: {
    id: 'id_l',
    name: 'nom_l',
    description: 'description',
    price: 'prix_l',
    imageUrl: 'image' // Example: If 'image' is the field name in the API response, and 'image' is the field name in the form
  }
};
const propositionsButton = document.getElementById('propositionsButton');
const propositionsSection = document.getElementById('propositionsSection');

propositionsButton.addEventListener('click', async () => {
  if (propositionsSection.style.display === 'none' || propositionsSection.style.display === '') {
    await getPropositionsData();
    propositionsSection.style.display = 'block'; // show the section
    propositionsButton.style.animation = 'mymove 1s';
    propositionsSection.style.animation = 'mymove3 1s'; // animate the section to appear smoothly from the left
    propositionsButton.style.left = '350px';
  } else {
    propositionsButton.style.animation = 'mymove2 1s'; // animate the section to disappear smoothly to the left
    propositionsSection.style.animation = 'mymove4 1s';
    propositionsButton.style.left = '60px';
    setTimeout(() => {
      propositionsSection.style.display = 'none'; // hide the section
    }, 1000); // delay hiding the section to allow for the animation to complete
  }
});


async function getPropositionsData() {

  try {
    const response = await fetch(url + 'propositions');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const propositionsData = await response.json();

    // Clear previous content
    propositionsSection.innerHTML = "";
    const ptitle= document.createElement('h1');
    ptitle.innerText='Propositions';
    propositionsSection.appendChild(ptitle); // Fixed: append the created element, not a string

    // Iterate over each proposition
    propositionsData.forEach(proposition => {
      // Create a div for each proposition
      const propositionDiv = document.createElement('div');

      // Loop through the keys and values of the proposition
      for (const [key, value] of Object.entries(proposition)) {

        propositionDiv.textContent += `${key}: ${value} `;
        // propositionDiv.innerHTML += `<br>`;
      }

      // Create update button
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.addEventListener('click', () => {


        // Determine which endpoint to send the PUT request to
        let endpoint;
        if (proposition.id_e) {
          endpoint = 'electronique';
        } else if (proposition.id_ap) {
          endpoint = 'electromenager';
        } else if (proposition.id_l) {
          endpoint = 'luminaire';
        }

        // Send the PUT request to the determined endpoint
        if (endpoint) {
          sendPutRequest(endpoint, proposition[fieldNamesMap[endpoint].id], proposition);
        }
      });

      // Append update button to the proposition div
      propositionDiv.appendChild(updateButton);
      propositionDiv.classList.add('propositionDiv');
      // Create delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => {
        // Determine which endpoint to send the DELETE request to
        let endpoint;
        if (proposition.id_e) {
          endpoint = 'electronique';
        } else if (proposition.id_ap) {
          endpoint = 'electromenager';
        } else if (proposition.id_l) {
          endpoint = 'luminaire';
        }

        // Send the DELETE request to the determined endpoint
        if (endpoint) {
          sendDeleteRequest(endpoint, proposition[fieldNamesMap[endpoint].id]);
        }
      });


      // Append delete button to the proposition div
      propositionDiv.appendChild(deleteButton);

      // Append the proposition div to the propositions section
      propositionsSection.appendChild(propositionDiv);
    });
  } catch (error) {
    console.error(error);
  }
}


async function getData(endpoint) {
  try {
    const jsonData = await fetchData(endpoint);
    const sortedData = sortData(jsonData, endpoint);
    createTable(sortedData, endpoint);
  } catch (error) {
    console.error(error);
  }
  createDynamicForm(endpoint)
}

getData('electromenager')

async function fetchData(endpoint) {
  const response = await fetch(url + endpoint);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function sortData(jsonData, endpoint) {
  return jsonData.sort((a, b) => a[fieldNamesMap[endpoint].id] - b[fieldNamesMap[endpoint].id]);
}

function createTable(sortedData, endpoint) {
  const tableEl = document.getElementById("json-table");
  clearTable(tableEl);
  createTableHeader(sortedData, tableEl);
  createTableBody(sortedData, tableEl, endpoint);
}

function clearTable(tableEl) {
  tableEl.innerHTML = ""; // Clear previous table content
  tableEl.style.width = '100%'; // Set fixed width for the table
}

function createTableHeader(sortedData, tableEl) {
  const headerRow = tableEl.insertRow();
  for (const key in sortedData[0]) {
    const headerCell = headerRow.insertCell();
    headerCell.style.fontWeight = 'bold';
    headerCell.textContent = key;
  }
}

function createTableBody(sortedData, tableEl, endpoint) {
  for (const data of sortedData) {
    const bodyRow = tableEl.insertRow();
    for (const key in data) {
      const bodyCell = bodyRow.insertCell();
      bodyCell.textContent = data[key];
    }
    createModifyButton(data, bodyRow, endpoint);
    createDeleteButton(data, bodyRow, endpoint);
  }
}

function createModifyButton(data, bodyRow, endpoint) {
  const idValue = data[fieldNamesMap[endpoint].id];
  const modifyButtonCell = bodyRow.insertCell();
  const modifyButton = document.createElement("button");
  modifyButton.textContent = "Modify";
  modifyButton.addEventListener("mouseover", () => {
    modifyButton.style.backgroundColor = 'yellow'
  });
  modifyButton.addEventListener("mouseout", () => {
    modifyButton.style.backgroundColor = 'white'
  });
  modifyButton.id = `button-${idValue}`;
  modifyButton.addEventListener("click", () => {
    showPopup(data, endpoint, idValue);
  });
  modifyButtonCell.appendChild(modifyButton);
}

function createDeleteButton(data, bodyRow, endpoint) {
  const idValue = data[fieldNamesMap[endpoint].id];
  const deleteButtonCell = bodyRow.insertCell();
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("mouseover", () => {
    deleteButton.style.backgroundColor = 'red'
  });
  deleteButton.addEventListener("mouseout", () => {
    deleteButton.style.backgroundColor = 'white'
  });
  deleteButton.addEventListener("click", () => {
    sendDeleteRequest(endpoint, idValue);
  });
  deleteButtonCell.appendChild(deleteButton);
}

function showPopup(data, endpoint, idValue) {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.display = "block";
  popupContainer.style.backgroundColor = '#308cba';
  popupContainer.style.animation= 'appear 0.6s' ;
  const modifyForm = document.getElementById("modify-form");
  modifyForm.innerHTML = ""; // Clear previous form content
  createFormFields(data, modifyForm);
  const saveButton = createSaveButton(modifyForm, endpoint, idValue);
  modifyForm.appendChild(saveButton);
}

function createFormFields(data, modifyForm) {
  for (const key in data) {
    const label = document.createElement("label");
    label.for = `new-${key}`;
    label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ":";
    const input = document.createElement("input");
    input.type = "text";
    input.id = `new-${key}`;
    input.name = `new-${key}`;
    input.value = data[key];
    input.required = true;
    modifyForm.appendChild(label);
    modifyForm.appendChild(input);
  }
}

function createSaveButton(modifyForm, endpoint, idValue) {
  const saveButton = document.createElement("button");
  saveButton.type = 'submit';
  saveButton.innerText = 'Save';
  modifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    modifyForm.style.animation= 'appear 0.6s' ;
    const formData = new FormData(modifyForm);
    const updatedData = {};
    for (const key of formData.keys()) {
      updatedData[key.replace("new-", "")] = formData.get(key);
    }
    try {
      await sendPutRequest(endpoint, idValue, updatedData);
      await getData(endpoint);
    } catch (error) {
      console.error(error);
    } finally {
      hidePopup();
    }
  });
  return saveButton;
}

function hidePopup() {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.animation= 'disappear 0.6s' ;
  setTimeout(() => {
    popupContainer.style.display = "none";
  }, 600);
}



function sendPostRequest(endpoint, postData) {
  fetch(`http://localhost:3000/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => console.error(error)).finally(() => {
      // Fetch updated data after the DELETE request is completed
      getData(endpoint)
    });
}
// Create search bar
// Create search bar
const searchBar = document.getElementById('search-bar');
searchBar.type = 'text';
searchBar.placeholder = 'Search...';
// document.body.insertBefore(searchBar, document.body.firstChild);

// Add event listener to the search bar
searchBar.addEventListener('keyup', async (event) => {
  const searchValue = event.target.value.toLowerCase();

  // Get data from the table
  const tableEl = document.getElementById("json-table");
  const rows = Array.from(tableEl.rows);

  // Filter the data based on the search value
  const filteredRows = rows.filter(row => {
    for (const cell of row.cells) {
      if (cell.textContent.toLowerCase().includes(searchValue)) {
        return true;
      }
    }
    return false;
  });

  // Clear the table content
  tableEl.innerHTML = "";

  // Populate the table with the filtered data
  for (const row of filteredRows) {
    const newRow = tableEl.insertRow();

    for (const cell of row.cells) {
      const newCell = newRow.insertCell();
      newCell.textContent = cell.textContent;
    }
  }
});


function createDynamicForm(endpoint) {
  const dynamicForm = document.getElementById("dynamic-form");
  dynamicForm.innerHTML = ""; // Clear previous form content

  // Only create the form for the specified endpoints
  if (endpoint === "electronique" || endpoint === "electromenager" || endpoint === "luminaire") {
    const form = document.createElement("form");
    form.id = "new-record-form";
    dynamicForm.appendChild(form);

    for (const fieldName in fieldNamesMap[endpoint]) {
      if (fieldName !== "id") {
        const label = document.createElement("label");
        label.for = `new-${fieldName}`;
        label.textContent = fieldNamesMap[endpoint][fieldName].charAt(0).toUpperCase() + fieldNamesMap[endpoint][fieldName].slice(1) + ":";

        const input = document.createElement("input");
        input.type = "text";
        input.id = `new-${fieldName}`;
        input.name = `new-${fieldName}`;
        input.required = true;

        form.appendChild(label);
        form.appendChild(input);
      }
    }
    if (endpoint === "electronique") {
      const label = document.createElement("label")
      const span = document.createElement("span");
      form.appendChild(label);
      form.appendChild(span);
    }
    const addButton = document.createElement("button");
    addButton.id = "add-record-form-button";
    addButton.addEventListener('mouseover', () => {
      addButton.style.backgroundColor = 'green'
    })
    addButton.addEventListener('mouseout', () => {
      addButton.style.backgroundColor = 'white'
    })
    addButton.type = "submit";
    addButton.textContent = "Add Record";
    form.appendChild(addButton);

    // Update the form submission handler for POST requests
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      // Map form fields to the corresponding keys for the endpoint
      const newRecordData = {};
      for (const fieldName in fieldNamesMap[endpoint]) {
        const formField = `new-${fieldName}`;
        const endpointField = fieldNamesMap[endpoint][fieldName];
        newRecordData[endpointField] = formData.get(formField);
      }

      try {
        await sendPostRequest(endpoint, newRecordData);
        // Update the table with the new data after successful addition
        await getData(endpoint);
      } catch (error) {
        console.error(error);
      } finally {
        // Clear the form fields after successful addition
        form.reset();
      }
    });
  }
}


function sendPutRequest(endpoint, idToUpdate, updatedData) {
  fetch(`http://localhost:3000/${endpoint}/${idToUpdate}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
    .then((response) => response.json())
    .then((json) => console.log(json))
    .catch((error) => console.error(error)).finally(() => {
      // Fetch updated data after the DELETE request is completed
      getData(endpoint)
    });
}


function sendDeleteRequest(endpoint, id) {
  // Show the confirmation dialog
  const popupContainer = document.getElementById("popup-container");
  const modifyForm = document.getElementById("modify-form");
  modifyForm.innerHTML = ""; // Clear previous form content

  const confirmText = document.createElement("p");
  confirmText.textContent = "Are you sure you want to delete this item?";
  modifyForm.appendChild(confirmText);

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  modifyForm.appendChild(confirmButton);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  modifyForm.appendChild(cancelButton);

  popupContainer.style.display = "block";
  popupContainer.style.animation= 'appear 0.6s'
  confirmButton.addEventListener("click", () => {
    // Proceed with the delete request if confirmed
    fetch(`${url}${endpoint}/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.error(error))
      .finally(() => {
        // Fetch updated data after the DELETE request is completed
        getData(endpoint);
        popupContainer.style.animation= 'disappear 0.6s' ;
        setTimeout(() => {
          popupContainer.style.display = "none";
        }, 1000);
      });
  });

  cancelButton.addEventListener("click", () => {
    // Cancel the delete request if not confirmed
    console.log("Delete request canceled.");
    // popupContainer.style.display = "none";
  });
}


