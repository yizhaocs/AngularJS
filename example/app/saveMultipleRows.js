<!-- http://jsfiddle.net/2SgbU/2/ -->

var App = angular.module('application',[])

.controller('sample', function ($scope) {
  $scope.rows = [
    {
        column1: 'first row',
        column2: 'second column of first row',
        column3: false
    },
    {
        column1: 'second row',
        column2: 'second column of second row',
        column3: false
    }
  ];

    $scope.addRow = function() {
        $scope.rows.push(
            { column1: 'row #' + $scope.rows.length,
             column2: 'this is new',
             column3: true }
        );
    };
    
    $scope.saveAll = function() {
        console.log('you can save all the rows as a document: ');
        console.log($scope.rows);
        console.log('or save row by row:');
        var index = 0;
        $scope.rows.forEach(function (row) {
            console.log('row #' + (index++) + ': ' + JSON.stringify(row));
        });
    }

});

