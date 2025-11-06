(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);

  // ----- Directive -----
  function FoundItemsDirective() {
    var ddo = {
      template:
        '<ul>' +
        '  <li ng-repeat="item in items">' +
        '    {{ item.name }} ({{ item.short_name }}): {{ item.description }} ' +
        '    <button ng-click="onRemove({index: $index})">Don\'t want this one!</button>' +
        '  </li>' +
        '</ul>',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  // ----- Controller -----
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var narrow = this;

    narrow.searchTerm = "";
    narrow.found = [];
    narrow.message = "";

    narrow.narrowItDown = function () {
      if (!narrow.searchTerm) {
        narrow.found = [];
        narrow.message = "Nothing found";
        return;
      }

      var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

      promise.then(function (response) {
        narrow.found = response;
        narrow.message = (narrow.found.length === 0) ? "Nothing found" : "";
      });
    };

    narrow.removeItem = function (itemIndex) {
      narrow.found.splice(itemIndex, 1);
      if (narrow.found.length === 0) {
        narrow.message = "Nothing found";
      }
    };
  }

  // ----- Service -----
  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      var response = $http({
        method: "GET",
        url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
      }).then(function (result) {
        var allItems = result.data;
        var foundItems = [];

        // Loop through all categories and items
        for (var category in allItems) {
          var items = allItems[category].menu_items;
          for (var i = 0; i < items.length; i++) {
            var description = items[i].description.toLowerCase();
            if (description.includes(searchTerm.toLowerCase())) {
              foundItems.push(items[i]);
            }
          }
        }

        return foundItems;
      });

      return response;
    };
  }

})();
