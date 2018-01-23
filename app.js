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
      {
        id:0,
        name: 'Steak Dinner',
        calories: 1200
      },
      {
        id:1,
        name: 'Cookie',
        calories: 600
      },
      {
        id:2,
        name: 'Eggs',
        calories: 400
      }
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
    }
  }

})();

// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list'
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
    }
  }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl){
   
  // Public method
  return {
    init: function(){
      // Fetch items from data
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemsList(items)
    }
  }

})(ItemCtrl, UICtrl);


App.init()