const startShoppingBtn = document.getElementById("startShoppingBtn");
const finishShoppingBtn = document.getElementById("finishShoppingBtn");

const createPanel = document.getElementById("createPanel");
const listsPanel = document.getElementById("listsPanel");
const shoppingMode = document.getElementById("shoppingMode");

const listNameInput = document.getElementById("listNameInput");
const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItemBtn");
const saveListBtn = document.getElementById("saveListBtn");
const clearDraftBtn = document.getElementById("clearDraftBtn");
const searchListsInput = document.getElementById("searchListsInput");

const newListItemsPreview = document.getElementById("newListItemsPreview");
const listsContainer = document.getElementById("listsContainer");
const shoppingItems = document.getElementById("shoppingItems");
const cartItems = document.getElementById("cartItems");
const shoppingModeInfo = document.getElementById("shoppingModeInfo");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const floatingCreateBtn = document.getElementById("floatingCreateBtn");
const floatingListsBtn = document.getElementById("floatingListsBtn");

let lists = JSON.parse(localStorage.getItem("shoppingLists")) || [];
let selectedListId = JSON.parse(localStorage.getItem("selectedListId")) || null;
let draftItems = [];

function saveData() {
  localStorage.setItem("shoppingLists", JSON.stringify(lists));
  localStorage.setItem("selectedListId", JSON.stringify(selectedListId));
}

function togglePanel(panel) {
  panel.classList.toggle("open");
}

function openPanel(panel) {
  panel.classList.add("open");
}

function closePanel(panel) {
  panel.classList.remove("open");
}

function createButton(text, className, clickFunction) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", clickFunction);
  return button;
}

function createEmptyMessage(text) {
  const message = document.createElement("li");
  message.className = "empty-message";
  message.textContent = text;
  return message;
}

function createItemElement(text, buttons = []) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;

  const actions = document.createElement("div");
  actions.className = "item-actions";

  buttons.forEach((button) => actions.appendChild(button));

  li.appendChild(span);

  if (buttons.length > 0) {
    li.appendChild(actions);
  }

  return li;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE");
}

function renderDraftItems() {
  newListItemsPreview.innerHTML = "";

  if (draftItems.length === 0) {
    newListItemsPreview.appendChild(createEmptyMessage("Noch keine Artikel hinzugefügt."));
    return;
  }

  draftItems.forEach((item, index) => {
    const editButton = createButton("Bearbeiten", "item-button edit", () => {
      const newValue = prompt("Artikel bearbeiten:", item);

      if (newValue !== null && newValue.trim() !== "") {
        draftItems[index] = newValue.trim();
        renderDraftItems();
      }
    });

    const deleteButton = createButton("Entfernen", "item-button remove", () => {
      draftItems.splice(index, 1);
      renderDraftItems();
    });

    const itemElement = createItemElement(item, [editButton, deleteButton]);
    newListItemsPreview.appendChild(itemElement);
  });
}

function addDraftItem() {
  const value = itemInput.value.trim();

  if (value === "") {
    alert("Bitte gib zuerst einen Artikel ein.");
    return;
  }

  draftItems.push(value);
  itemInput.value = "";
  itemInput.focus();
  renderDraftItems();
}

function clearDraft() {
  listNameInput.value = "";
  itemInput.value = "";
  draftItems = [];
  renderDraftItems();
}

function saveList() {
  const name = listNameInput.value.trim();

  if (name === "") {
    alert("Bitte gib deiner Liste einen Namen.");
    return;
  }

  if (draftItems.length === 0) {
    alert("Bitte füge mindestens einen Artikel hinzu.");
    return;
  }

  const now = Date.now();

  const newList = {
    id: now,
    name: name,
    createdAt: new Date().toISOString(),
    items: draftItems.map((item, index) => {
      return {
        id: `${now}-${index}`,
        name: item,
        done: false
      };
    })
  };

  lists.push(newList);
  saveData();
  clearDraft();
  renderLists();

  closePanel(createPanel);
  openPanel(listsPanel);
}

function getListById(listId) {
  return lists.find((list) => list.id === listId);
}

function deleteList(listId) {
  const shouldDelete = confirm("Willst du diese Liste wirklich löschen?");

  if (!shouldDelete) {
    return;
  }

  lists = lists.filter((list) => list.id !== listId);

  if (selectedListId === listId) {
    selectedListId = null;
    closeShoppingMode();
  }

  saveData();
  renderLists();
}

function renameList(listId) {
  const list = getListById(listId);

  if (!list) {
    return;
  }

  const newName = prompt("Neuer Listenname:", list.name);

  if (newName !== null && newName.trim() !== "") {
    list.name = newName.trim();
    saveData();
    renderLists();
    renderShoppingMode();
  }
}

function addItemToList(listId) {
  const list = getListById(listId);

  if (!list) {
    return;
  }

  const newItem = prompt("Neuen Artikel hinzufügen:");

  if (newItem !== null && newItem.trim() !== "") {
    list.items.push({
      id: `${Date.now()}`,
      name: newItem.trim(),
      done: false
    });

    saveData();
    renderLists();
    renderShoppingMode();
  }
}

function editItem(listId, itemId) {
  const list = getListById(listId);

  if (!list) {
    return;
  }

  const item = list.items.find((entry) => entry.id === itemId);

  if (!item) {
    return;
  }

  const newName = prompt("Artikel bearbeiten:", item.name);

  if (newName !== null && newName.trim() !== "") {
    item.name = newName.trim();
    saveData();
    renderLists();
    renderShoppingMode();
  }
}

function deleteItem(listId, itemId) {
  const list = getListById(listId);

  if (!list) {
    return;
  }

  list.items = list.items.filter((item) => item.id !== itemId);
  saveData();
  renderLists();
  renderShoppingMode();
}

function selectList(listId) {
  selectedListId = listId;
  saveData();
  renderLists();
}

function renderLists() {
  listsContainer.innerHTML = "";

  const searchValue = searchListsInput.value.trim().toLowerCase();

  const filteredLists = lists.filter((list) => {
    return list.name.toLowerCase().includes(searchValue);
  });

  if (filteredLists.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "Keine Einkaufslisten gefunden.";
    listsContainer.appendChild(message);
    return;
  }

  filteredLists.forEach((list) => {
    const listCard = document.createElement("article");
    listCard.className = "list-card";

    if (list.id === selectedListId) {
      listCard.classList.add("selected");
    }

    const listHeader = document.createElement("div");
    listHeader.className = "list-header";

    const titleBox = document.createElement("div");

    const title = document.createElement("div");
    title.className = "list-title";
    title.textContent = list.name;

    const meta = document.createElement("div");
    meta.className = "list-meta";
    meta.textContent = `${list.items.length} Artikel • erstellt am ${formatDate(list.createdAt)}`;

    titleBox.appendChild(title);
    titleBox.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "list-actions";

    const selectButton = createButton(
      list.id === selectedListId ? "Ausgewählt" : "Auswählen",
      "item-button select",
      () => selectList(list.id)
    );

    const renameButton = createButton("Umbenennen", "item-button edit", () => {
      renameList(list.id);
    });

    const addButton = createButton("Artikel +", "item-button", () => {
      addItemToList(list.id);
    });

    const deleteButton = createButton("Löschen", "item-button remove", () => {
      deleteList(list.id);
    });

    actions.appendChild(selectButton);
    actions.appendChild(renameButton);
    actions.appendChild(addButton);
    actions.appendChild(deleteButton);

    listHeader.appendChild(titleBox);
    listHeader.appendChild(actions);

    const itemList = document.createElement("ul");
    itemList.className = "item-list";

    if (list.items.length === 0) {
      itemList.appendChild(createEmptyMessage("Diese Liste enthält noch keine Artikel."));
    } else {
      list.items.forEach((item) => {
        const editButton = createButton("Bearbeiten", "item-button edit", () => {
          editItem(list.id, item.id);
        });

        const deleteButton = createButton("Entfernen", "item-button remove", () => {
          deleteItem(list.id, item.id);
        });

        const itemElement = createItemElement(item.name, [editButton, deleteButton]);
        itemList.appendChild(itemElement);
      });
    }

    listCard.appendChild(listHeader);
    listCard.appendChild(itemList);
    listsContainer.appendChild(listCard);
  });
}

function startShopping() {
  if (!selectedListId) {
    alert("Bitte wähle zuerst eine Liste aus.");
    openPanel(listsPanel);
    return;
  }

  const list = getListById(selectedListId);

  if (!list) {
    alert("Die ausgewählte Liste wurde nicht gefunden.");
    selectedListId = null;
    saveData();
    renderLists();
    return;
  }

  shoppingModeInfo.textContent = `Aktive Liste: ${list.name}`;
  openPanel(shoppingMode);
  renderShoppingMode();
  shoppingMode.scrollIntoView({ behavior: "smooth" });
}

function renderShoppingMode() {
  shoppingItems.innerHTML = "";
  cartItems.innerHTML = "";

  const list = getListById(selectedListId);

  if (!list) {
    updateProgress(0, 0);
    return;
  }

  const openItems = list.items.filter((item) => !item.done);
  const doneItems = list.items.filter((item) => item.done);

  if (openItems.length === 0) {
    shoppingItems.appendChild(createEmptyMessage("Alles wurde bereits erledigt."));
  } else {
    openItems.forEach((item) => {
      shoppingItems.appendChild(createShoppingItem(list.id, item, false));
    });
  }

  if (doneItems.length === 0) {
    cartItems.appendChild(createEmptyMessage("Noch keine Artikel erledigt."));
  } else {
    doneItems.forEach((item) => {
      cartItems.appendChild(createShoppingItem(list.id, item, true));
    });
  }

  updateProgress(doneItems.length, list.items.length);
}

function createShoppingItem(listId, item, checked) {
  const li = document.createElement("li");

  const label = document.createElement("label");
  label.className = "checkbox-row";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;

  const span = document.createElement("span");
  span.textContent = item.name;

  if (checked) {
    span.className = "done-text";
  }

  checkbox.addEventListener("change", () => {
    item.done = checkbox.checked;
    saveData();
    renderShoppingMode();
  });

  label.appendChild(checkbox);
  label.appendChild(span);
  li.appendChild(label);

  return li;
}

function updateProgress(done, total) {
  const percent = total === 0 ? 0 : (done / total) * 100;

  progressText.textContent = `${done} / ${total} erledigt`;
  progressFill.style.width = `${percent}%`;
}

function finishShopping() {
  const list = getListById(selectedListId);

  if (!list) {
    alert("Es ist aktuell kein Einkauf aktiv.");
    return;
  }

  const openItems = list.items.filter((item) => !item.done);

  if (openItems.length > 0) {
    const shouldFinish = confirm("Es sind noch nicht alle Artikel erledigt. Trotzdem abschließen?");

    if (!shouldFinish) {
      return;
    }
  }

  alert(`Einkauf für "${list.name}" wurde abgeschlossen.`);
  closeShoppingMode();
}

function closeShoppingMode() {
  closePanel(shoppingMode);
  shoppingItems.innerHTML = "";
  cartItems.innerHTML = "";
  shoppingModeInfo.textContent = "Noch keine Liste ausgewählt.";
  updateProgress(0, 0);
}


floatingCreateBtn.addEventListener("click", () => {
  togglePanel(createPanel);
});

floatingListsBtn.addEventListener("click", () => {
  renderLists();
  togglePanel(listsPanel);
});

startShoppingBtn.addEventListener("click", startShopping);
finishShoppingBtn.addEventListener("click", finishShopping);

addItemBtn.addEventListener("click", addDraftItem);
saveListBtn.addEventListener("click", saveList);
clearDraftBtn.addEventListener("click", clearDraft);
searchListsInput.addEventListener("input", renderLists);

itemInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addDraftItem();
  }
});

listNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveList();
  }
});

renderDraftItems();
renderLists();