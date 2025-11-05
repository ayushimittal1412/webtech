(function () {
  'use strict';

  angular.module('LunchCheck', [])
  .controller('LunchCheckController', LunchCheckController);

  LunchCheckController.$inject = ['$scope'];
  function LunchCheckController($scope) {

    $scope.lunchItems = "";
    $scope.message = "";
    $scope.messageColor = "";

    $scope.checkIfTooMuch = function () {
      if (!$scope.lunchItems) {
        $scope.message = "Please enter data first";
        $scope.messageColor = "red";
        return;
      }

      // Split and filter out empty items
      var items = $scope.lunchItems.split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (items.length === 0) {
        $scope.message = "Please enter data first";
        $scope.messageColor = "red";
      } else if (items.length <= 3) {
        $scope.message = "Enjoy!";
        $scope.messageColor = "green";
      } else {
        $scope.message = "Too much!";
        $scope.messageColor = "green";
      }
    };
  }

})();
