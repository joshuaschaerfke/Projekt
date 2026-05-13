// Buttons
const startShoppingBtn = document.getElementById("startShoppingBtn");
const finishShoppingBtn = document.getElementById("finishShoppingBtn");
const floatingCreateBtn = document.getElementById("floatingCreateBtn");
const floatingListsBtn = document.getElementById("floatingListsBtn");

// Panels
const createPanel = document.getElementById("createPanel");
const listsPanel = document.getElementById("listsPanel");
const shoppingMode = document.getElementById("shoppingMode");

// Inputs
const listNameInput = document.getElementById("listNameInput");
const itemInput = document.getElementById("itemInput");
const searchListsInput = document.getElementById("searchListsInput");

// Buttons (Form)
const addItemBtn = document.getElementById("addItemBtn");
const saveListBtn = document.getElementById("saveListBtn");
const clearDraftBtn = document.getElementById("clearDraftBtn");
const undoRemoveBtn = document.getElementById("undoRemoveBtn");

// Listen Bereiche
const newListItemsPreview = document.getElementById("newListItemsPreview");
const listsContainer = document.getElementById("listsContainer");

// Shopping
const shoppingItems = document.getElementById("shoppingItems");
const cartItems = document.getElementById("cartItems");
const shoppingModeInfo = document.getElementById("shoppingModeInfo");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// State
let lists = JSON.parse(localStorage.getItem("shoppingLists")) || [];
let selectedListId = JSON.parse(localStorage.getItem("selectedListId")) || null;
let draftItems = [];
let activeShoppingList = null;
let lastRemovedDraftItem = null;

// speichern
function saveToStorage() {
  localStorage.setItem("shoppingLists", JSON.stringify(lists));
  localStorage.setItem("selectedListId", JSON.stringify(selectedListId));
}

// Panel öffnen/schließen
function togglePanel(panel) {
  panel.classList.toggle("open");
}

// Datum formatieren
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("de-DE");
}

// ===== DRAFT ITEMS =====

function renderDraftItems() {
  newListItemsPreview.innerHTML = "";

  if (draftItems.length === 0) {
    newListItemsPreview.innerHTML = `<li class="empty-message">Noch keine Items</li>`;
    return;
  }

  draftItems.forEach((item, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.className = "item-button remove";

    removeBtn.onclick = () => {
      lastRemovedDraftItem = { value: item, index };
      draftItems.splice(index, 1);
      undoRemoveBtn.classList.remove("hidden");
      renderDraftItems();
    };

    li.appendChild(span);
    li.appendChild(removeBtn);
    newListItemsPreview.appendChild(li);
  });
}

function addDraftItem() {
  const value = itemInput.value.trim();
  if (!value) return;

  draftItems.push(value);
  itemInput.value = "";
  renderDraftItems();
}

function undoLastDraftRemove() {
  if (!lastRemovedDraftItem) return;

  draftItems.splice(
    lastRemovedDraftItem.index,
    0,
    lastRemovedDraftItem.value
  );

  lastRemovedDraftItem = null;
  undoRemoveBtn.classList.add("hidden");
  renderDraftItems();
}

function clearDraft() {
  draftItems = [];
  listNameInput.value = "";
  renderDraftItems();
}

// ===== LISTEN =====

function saveList() {
  const name = listNameInput.value.trim();
  if (!name || draftItems.length === 0) return;

  lists.push({
    id: Date.now(),
    name,
    items: draftItems.map((i) => ({
      id: Date.now() + Math.random(),
      name: i,
    })),
    createdAt: new Date().toISOString(),
  });

  saveToStorage();
  renderLists();
  clearDraft();
  alert("Liste gespeichert!");
}

function renderLists() {
  listsContainer.innerHTML = "";

  lists.forEach((list) => {
    const card = document.createElement("div");
    card.className = "list-card";

    if (list.id === selectedListId) {
      card.classList.add("selected");
    }

    const title = document.createElement("div");
    title.className = "list-title";
    title.textContent = list.name;

    const meta = document.createElement("div");
    meta.className = "list-meta";
    meta.textContent = `${list.items.length} Items • ${formatDate(
      list.createdAt
    )}`;

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Auswählen";
    selectBtn.className = "item-button select";

    selectBtn.onclick = () => {
      selectedListId = list.id;
      saveToStorage();
      renderLists();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Löschen";
    deleteBtn.className = "item-button remove";

    deleteBtn.onclick = () => {
      lists = lists.filter((l) => l.id !== list.id);
      saveToStorage();
      renderLists();
    };

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(selectBtn);
    card.appendChild(deleteBtn);

    listsContainer.appendChild(card);
  });
}

// ===== SHOPPING =====

function startShopping() {
  const list = lists.find((l) => l.id === selectedListId);
  if (!list) {
    alert("Liste auswählen!");
    return;
  }

  activeShoppingList = {
    ...list,
    remainingItems: [...list.items],
    cart: [],
    total: list.items.length,
  };

  shoppingModeInfo.textContent = `Liste: ${list.name}`;
  togglePanel(shoppingMode);
  renderShopping();
}

function renderShopping() {
  shoppingItems.innerHTML = "";
  cartItems.innerHTML = "";

  activeShoppingList.remainingItems.forEach((item) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const text = document.createElement("span");
    text.textContent = item.name;

    checkbox.onchange = () => {
      activeShoppingList.remainingItems =
        activeShoppingList.remainingItems.filter((i) => i.id !== item.id);
      activeShoppingList.cart.push(item);
      renderShopping();
    };

    li.appendChild(checkbox);
    li.appendChild(text);
    shoppingItems.appendChild(li);
  });

  activeShoppingList.cart.forEach((item) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = item.name;
    text.className = "done-text";

    li.appendChild(text);
    cartItems.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const done = activeShoppingList.cart.length;
  const total = activeShoppingList.total;
  const percent = (done / total) * 100;

  progressText.textContent = `${done} / ${total}`;
  progressFill.style.width = percent + "%";
}

function finishShopping() {
  alert("Einkauf abgeschlossen!");
  togglePanel(shoppingMode);
}

// ===== EVENTS =====

addItemBtn.onclick = addDraftItem;
saveListBtn.onclick = saveList;
clearDraftBtn.onclick = clearDraft;
undoRemoveBtn.onclick = undoLastDraftRemove;

floatingCreateBtn.onclick = () => togglePanel(createPanel);
floatingListsBtn.onclick = () => {
  renderLists();
  togglePanel(listsPanel);
};

startShoppingBtn.onclick = startShopping;
finishShoppingBtn.onclick = finishShopping;

// ENTER Support
itemInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addDraftItem();
});

listNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveList();
});

// Init
renderDraftItems();
renderLists();