'use strict';

const STORE = {
  items: [
  {name:'apples', checked:false, createdAt: new Date(Date.now() - 100000), id: 1},
  {name:'oranges', checked:false, createdAt: new Date(Date.now() - 200000), id: 2},
  {name:'milk', checked:true, createdAt: new Date(Date.now() - 400000), id: 3},
  {name:'bread', checked:false, createdAt: new Date(Date.now() - 300000), id: 4}
  ],
  sortBy: 'alpha',
};

// <span class="timestamp">${getTimeString(item.createdAt)}</span>

function generateItemElement(item, itemIndex, template) {
    return `
    <li class = "js-item-index-element" data-item-index="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
        <form id="js-shopping-list-edit-entry">
          <button type="submit">Edit item</button>
            <input type="text" name="shopping-list-edit-entry" class="js-shopping-list-edit-entry" placeholder="New title">
        </form>
      </div>
    </li>
    `;
}

// figure out what time to display

// function getTimeString(time) {
//   return strftime('%b-%d %H:%M', time);
// }

function generateShoppingItemsString(shoppingList){
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function renderShoppingList() {

  let filteredItems = [ ...STORE.items ];

  switch(STORE.sortBy) {
    case 'alpha':
      filteredItems = filteredItems.sort((a, b) => a.name > b.name);
      break;
    case 'time':
      filteredItems = filteredItems.sort((a, b) => a.createdAt > b.createdAt);
  }

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false, createdAt: new Date(), id: STORE.items.length + 1});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemID) {
  STORE.items.find(item => item.id === itemID).checked = !STORE.items.find(item => item.id === itemID).checked;
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemID = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemID);
    renderShoppingList();
  });
}

function removeItemFromList(itemID) {
  STORE.items = STORE.items.filter(item => item.id !== itemID);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeItemFromList(itemIndex);
    renderShoppingList();
  });
}

function changeSortBy(sortBy) {
  STORE.sortBy = sortBy;
}

function handleSortChange() {
  $('#sort-options').change(event => {
    // get DOM info about action
    const option = $(event.currentTarget).find('option:selected').val();
    // change store
    changeSortBy(option);
    // render
    renderShoppingList();
  });
}

function getItemCharacters(item) {
  return item.split('');
}

function itemSearch() {
  let item = $('.js-shopping-list-search-entry').val();
  const itemChars = getItemCharacters(item);
  console.log(itemChars);

  if (item === itemChars) {
    
  }
  STORE.items = STORE.items.filter(newVal => newVal.name === item);
}

function handleItemSearch() {
  $('#js-shopping-list-search').submit(event => {
    event.preventDefault();
    itemSearch();
    console.log(STORE.items);
    renderShoppingList();
  });
}

function editItem(itemID) {
  let item = $('.js-shopping-list-edit-entry').val();
  STORE.items.find(item => item.id === itemID).name = item;
}

function handleEditItem() {
  $('#js-shopping-list-edit-entry').submit(event => {
    event.preventDefault();
    const itemID = getItemIndexFromElement(event.currentTarget);
    editItem(itemID);
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSortChange();
  handleItemSearch();
  handleEditItem();
}

handleShoppingList();