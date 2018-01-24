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
    getItems: function (){
      return data.items
    },
    logData: function(){
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
      }
  }

})();

// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '.total-calories'
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
  }
    // Add item submit
    const itemAddSubmit = function (e){
      // Get item inputs
      const input = UICtrl.getItemInputs();

      if (input.name !== '' && input.calories !== '') {
        const newItem = ItemCtrl.addItem (input.name, input.calories)
      }
      UICtrl.addItemList(newItem);
      UICtrl.clearInput()
      UICtrl.hideList()
      const totalCalories = ItemCtrl.getTotalCalories()
      UICtrl.showTotalCalories(totalCalories)
      e.preventDefault()
    }
  

  // Public method
  return {
    init: function(){
      // Fetch items from data
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemsList(items)

      loadEventListenes();
      UICtrl.hideList()
    }
  }

})(ItemCtrl, UICtrl);


App.init()