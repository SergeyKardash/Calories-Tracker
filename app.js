// Storage Controller

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id,
    this.name = name,
    this.calories = calories
  }

  // Data Structure / State
  const data = {
    items: [
      // {
      //   id:0,
      //   name: 'Steak Dinner',
      //   calories: 1200
      // },
      // {
      //   id:1,
      //   name: 'Cookie',
      //   calories: 600
      // },
      // {
      //   id:2,
      //   name: 'Eggs',
      //   calories: 400
      // }
    ],
    currentItem: null,
    totalCalories: 0
  }

  // Public method
  return {
    getItems: function() {
      return data.items
    },
    getItemsById: function(id) {
      let found = null
      data.items.forEach(function(item){
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    logData: function() {
      return data
    },
    addItem: function (name, calories) {
      // Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0
      }
      // Calories to number
      calories = parseInt(calories);
      // Create NewItem
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);
      return newItem
    },
    getTotalCalories: function () {
      let total = 0
      data.items.forEach(function(item){
        total += item.calories;
      })
      data.totalCalories = total
      return data.totalCalories
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    itemUpdate: function() {
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = data.currentItem.name
          item.calories = data.currentItem.calories
        };
      });
    }
  }

})();

// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories',
    editBtn: '.edit-item',
    clearAll: '#clear-all'
  }

  // Public method
  return {
    populateItemsList: function(items){
      let html ='';

      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <Strong>${item.name}:</Strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a> 
        </li>
        `;
      const list = document.querySelector(UISelectors.itemList);
      list.innerHTML = html
      })
    },
    getItemInputs: function(){
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      }
    },
    getSelectors: function(){
      return UISelectors
    },
    addItemList: function(item){
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`
      li.innerHTML = `
       <Strong>${item.name}:</Strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a> 
      `
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemName).value = '',
      document.querySelector(UISelectors.itemCalories).value = ''
    },
    hideList: function(){
      const list = document.querySelector(UISelectors.itemList);
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        list.style.display = 'none'
      } else {
        list.style = 'display: block'
      }
    },
    showTotalCalories: function(totalCalories){
      const total = document.querySelector(UISelectors.totalCalories)
      total.textContent = totalCalories
    },
    clearEditState: function() {
      UICtrl.clearInput()
      document.querySelector(UISelectors.updateBtn).style.display = 'none',
      document.querySelector(UISelectors.deleteBtn).style.display = 'none',
      document.querySelector(UISelectors.backBtn).style.display = 'none',
      document.querySelector(UISelectors.addBtn).style.display = 'inline-block'
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline-block',
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block',
      document.querySelector(UISelectors.backBtn).style.display = 'inline-block',
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    addItemToForm: function() {
      const item = ItemCtrl.logData().currentItem;
      document.querySelector(UISelectors.itemName).value = item.name;
      document.querySelector(UISelectors.itemCalories).value = item.calories;
      UICtrl.showEditState()
    },
    updateItemList: function(input) {
      input.name = document.querySelector(UISelectors.itemName).value;
      input.calories = document.querySelector(UISelectors.itemCalories).value;
      ItemCtrl.logData().currentItem.name = input.name;
      ItemCtrl.logData().currentItem.calories = parseInt(input.calories);
      ItemCtrl.itemUpdate();
      UICtrl.populateItemsList(ItemCtrl.getItems());
    },
    deleteItem: function() {
      let index;
      const items = ItemCtrl.getItems();
      const currentItem = ItemCtrl.logData().currentItem;
      items.forEach(function(item){
        if (item.id === currentItem.id) {
          index = items.indexOf(item)
        }
      });
      items.splice(index, 1);
      UICtrl.populateItemsList(items);
      UICtrl.hideList();
    },
    clearAllItems: function(){
      const items = ItemCtrl.getItems();
      items.splice(0, items.length);
      UICtrl.populateItemsList(items);
      UICtrl.hideList();
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
  // Load event Listeners
  const loadEventListenes = function(){
    // Get Selectors from UI
    const UISelectors = UICtrl.getSelectors()

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    // Edit item event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    // Edit item submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemEditSubmit);
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItem);
    // Clear All event
    document.querySelector(UISelectors.clearAll).addEventListener('click', clearAll);
  }
    // Add item submit
    const itemAddSubmit = function (e){
      // Get item inputs
      const input = UICtrl.getItemInputs();

      if (input.name !== '' && input.calories !== '') {
        const newItem = ItemCtrl.addItem (input.name, input.calories)
        UICtrl.addItemList(newItem);
        UICtrl.clearInput();
        UICtrl.hideList();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        e.preventDefault()
    };
    }

    // Edit item
    const itemEditClick = function (e) {
      // Get ID
      if (e.target.classList.contains('edit-item')){
        const listId = e.target.parentElement.parentElement.id;
        const listIdArr = listId.split('-');
        const id  = parseInt(listIdArr[1]);
      // Get Item
        const itemToEdit = ItemCtrl.getItemsById(id);
      // Set current Item
        ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
        UICtrl.addItemToForm();
      };
      e.preventDefault()
    };
  
    // Edit Item Submit
    const itemEditSubmit = function(e) {
      const input = UICtrl.getItemInputs()
      UICtrl.updateItemList(input)
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearEditState();
      e.preventDefault()
    };

    // Delete Item
    const deleteItem = function(e) {
      UICtrl.deleteItem();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearEditState();
      e.preventDefault()
    };

    const clearAll = function(e){
      UICtrl.clearAllItems();
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      UICtrl.clearEditState();
      e.preventDefault()
    };

  // Public method
  return {
    init: function(){
      UICtrl.clearEditState();
      // Fetch items from data
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemsList(items)

      loadEventListenes();
      UICtrl.hideList();
    
    }
  }

})(ItemCtrl, UICtrl);


App.init()