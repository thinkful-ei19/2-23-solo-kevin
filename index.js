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

// dynamically create items for shopping list

// <span class="timestamp">${getTimeString(item.createdAt)}</span>

function generateItemElement(item, itemIndex) {
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

// make a string of shopping list items

function generateShoppingItemsString(shoppingList){
  console.log("Generating Shopping list element");
  
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

// render shopping list function to the DOM

function renderShoppingList(list) {

  console.log('`renderShoppingList` ran');

  let filteredItems = [ ...STORE.items ];

  if (list) {
    filteredItems = [ ...list];
  }

  console.log(filteredItems);

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

// add a new item to the shopping list (STORE ^^^)

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, createdAt: new Date(), id: STORE.items.length + 1});
}

// create new item on shopping list 

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemID) {
  console.log('Toggling checked property for item at index ' + itemID);
  STORE.items.find(item => item.id === itemID).checked = !STORE.items.find(item => item.id === itemID).checked;
}

// figure out what the index of the item is in STORE

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// check off items on shopping list

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// delete an item from STORE

function removeItemFromList(itemID) {
  STORE.items = STORE.items.filter(item => item.id !== itemID);
}

// handle delete item from shopping list

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleItemDeleteClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeItemFromList(itemIndex);
    renderShoppingList();
  });
}

// change sort by value of STORE

function changeSortBy(sortBy) {
  STORE.sortBy = sortBy;
}

// handle sorting

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

// search for item

function itemSearch() {
  let item = $('.js-shopping-list-search-entry').val();
  console.log(item);
  let searchItems = STORE.items.filter(val => val.name === item);
  return searchItems;
}

// handle items search

function handleItemSearch() {
  $('#js-shopping-list-search').submit(event => {
    event.preventDefault();
    let searchItems = itemSearch();
    renderShoppingList(searchItems);
  });
}



// run all the functions

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSortChange();
  handleItemSearch();
}

handleShoppingList();