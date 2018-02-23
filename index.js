'use strict';

const STORE =[
  {name:"apples",checked:false},
  {name:"oranges",checked:false},
  {name:"milk",checked:true},
  {name:"bread",checked:false}

];

// dynamically create items for shopping list

function generateItemElement(item, itemIndex, template) {
  return `
  <li class = "js-item-index-element"
  data-item-index="${itemIndex}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
    </div>
  </li>
  `;
}

// make a string of shopping list items

function generateShoppingItemsString(shoppingList){
  console.log("Generating Shopping list element");
  
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

// render shopping list function to the DOM

function renderShoppingList() {

  console.log('`renderShoppingList` ran');

  const shoppingListItemsString = generateShoppingItemsString(STORE);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

// add a new item to the shopping list (STORE ^^^)

function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.push({name: itemName, checked: false});
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

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}

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
  })
}

// delete an item from STORE

function removeItemFromList(itemIndex) {
  STORE.splice(itemIndex, 1);
}

// delete items from shopping list

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleItemDeleteClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    removeItemFromList(itemIndex);
    renderShoppingList();
  });
}

// run all the functions

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

handleShoppingList();