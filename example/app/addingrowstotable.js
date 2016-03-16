// http://codepen.io/calendee/pen/buCHf

angular.module('MyApp', [])
.controller('MainController', [ '$scope', function($scope) {

  $scope.rows = ['Row 1', 'Row 2'];
  
  $scope.counter = 3;
  
  $scope.addRow = function() {
    
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
}]);