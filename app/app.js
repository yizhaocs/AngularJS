var app = angular.module('myApp', ['ngRoute']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};

    obj.getMappings = function(type){
        return $http.get(serviceBase + 'mappings?type=' + type);
    }

    obj.getMapping = function(mappingID, type){
        return $http.get(serviceBase + 'mapping?id=' + mappingID + '&type=' + type);
    }

    obj.insertMapping = function (mapping, type) {
    	return $http.post(serviceBase + 'insertMapping', {mapping:mapping, type:type}).then(function (results) {
        	return results;
    	});
    };

    obj.updateMapping = function (id, mapping, type) {
	return $http.post(serviceBase + 'updateMapping', {id:id, mapping:mapping, type:type}).then(function (status) {
	    return status.data;
	});
    };

    obj.deleteMapping = function (id, type) {
	return $http.delete(serviceBase + 'deleteMapping?id=' + id + '&type=' + type).then(function (status) {
	    return status.data;
	});
    };

    return obj;   
}]);

app.controller('listCtrlAdobe', function ($scope, services) {
    services.getMappings('adobe').then(function(data){
        $scope.mappings = data.data;
    });
});

app.controller('editCtrlAdobe', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? parseInt($routeParams.mappingID) : 0;
    $rootScope.title = (mappingID > 0) ? 'Edit Mapping' : 'Add Mapping';
    $scope.buttonText = (mappingID > 0) ? 'Update Mapping' : 'Add New Mapping';
      var original = mapping.data;
      original._id = mappingID;
      $scope.mapping = angular.copy(original);
      $scope.mapping._id = mappingID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
      }

      $scope.deleteMapping = function(mapping) {
        $location.path('/adobe');
        if(confirm("Are you sure to delete mapping number: "+$scope.mapping._id)==true)
        services.deleteMapping(mapping.adobe_segment_id, 'adobe');
      };

      $scope.saveMapping = function(mapping) {
        $location.path('/adobe');
        if (mappingID <= 0) {
            services.insertMapping(mapping, 'adobe');
        }
        else {
            services.updateMapping(mappingID, mapping, 'adobe');
        }
    };
});

app.controller('listCtrlLiveramp', function ($scope, services) {
    services.getMappings('liveramp-dp').then(function(data){
        $scope.mappingsDp = data.data;
    });
    services.getMappings('liveramp-key').then(function(data){
        $scope.mappingsKey = data.data;
    });
});

app.controller('editCtrlLiverampDp', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? $routeParams.mappingID : '0';
    $rootScope.title = (mappingID != '0') ? 'Edit Liveramp DP Mapping' : 'Add Liveramp DP Mapping';
    $scope.buttonText = (mappingID != '0') ? 'Update Liveramp DP Mapping' : 'Add New Liveramp DP Mapping';
      var original = mapping.data;
      original._id = mappingID;
      $scope.mapping = angular.copy(original);
      $scope.mapping._id = mappingID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
      }

      $scope.deleteMapping = function(mapping) {
        $location.path('/liveramp');
        if(confirm("Are you sure to delete mapping number: "+$scope.mapping._id)==true)
        services.deleteMapping(mapping.dp_name, 'liveramp-dp');
      };

      $scope.saveMapping = function(mapping) {
	if (mapping.threshold_mb > 100) {
	    alert("Threshold can't be greater than 100MB");
	}
	else {
            $location.path('/liveramp');
            if (mappingID == '0') {
                services.insertMapping(mapping, 'liveramp-dp');
            }
            else {
                services.updateMapping(mappingID, mapping, 'liveramp-dp');
            }
	}
    };
});

app.controller('editCtrlLiverampKey', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? $routeParams.mappingID : '0';
    $rootScope.title = (mappingID != '0') ? 'Edit Liveramp Key Mapping' : 'Add Liveramp Key Mapping';
    $scope.buttonText = (mappingID != '0') ? 'Update Liveramp Key Mapping' : 'Add New Liveramp Key Mapping';
      var original = mapping.data;
      original._id = mappingID;
      $scope.mapping = angular.copy(original);
      $scope.mapping._id = mappingID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
      }

      $scope.deleteMapping = function(mapping) {
        $location.path('/liveramp');
        if(confirm("Are you sure to delete mapping number: "+$scope.mapping._id)==true)
        services.deleteMapping(mapping.liveramp_segment_id, 'liveramp-key');
      };

      $scope.saveMapping = function(mapping) {
        $location.path('/liveramp');
        if (mappingID == '0') {
            services.insertMapping(mapping, 'liveramp-key');
        }
        else {
            services.updateMapping(mappingID, mapping, 'liveramp-key');
        }
    };
});

app.controller('listCtrlFacebook', function ($scope, $location, $anchorScroll, services) {
    services.getMappings('facebook-dp').then(function(data){
        $scope.mappingsDp = data.data;
    });
    services.getMappings('facebook-key').then(function(data){
        $scope.mappingsKey = data.data;
    });
    services.getMappings('facebook-pixel').then(function(data){
        $scope.mappingsPixel = data.data;
    });

    $scope.scrollTo = function(position) {
      var old = $location.hash();
      $location.hash(position);
      $anchorScroll();
      $location.hash(old);
    };
});

app.controller('editCtrlFacebookPixel', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? $routeParams.mappingID : '0';
    $rootScope.title = (mappingID != '0') ? 'Edit Liveramp DP Mapping' : 'Add Facebook Pixel Mapping';
    $scope.buttonText = (mappingID != '0') ? 'Update Liveramp DP Mapping' : 'Add New Facebook Pixel Mapping';
    var original = mapping.data;
    original._id = mappingID;
    $scope.mapping = angular.copy(original);
    $scope.mapping._id = mappingID;

    $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
    }

    $scope.deleteMapping = function(mapping) {
        $location.path('/facebook');
        if(confirm("Are you sure to delete mapping number: "+$scope.mapping._id)==true)
        services.deleteMapping(mapping.dp_id, 'facebook-pixel');
    };

    $scope.saveMapping = function(mapping) {
            $location.path('/facebook');
            if (mappingID == '0') {
                services.insertMapping(mapping, 'facebook-pixel');
            }
            else {
                services.updateMapping(mappingID, mapping, 'facebook-pixel');
            }
    };
});

app.controller('editCtrlFacebookDp', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? $routeParams.mappingID : '0';
    $rootScope.title = 'Edit Facebook DP Mapping';
    $scope.buttonText = 'Update Facebook DP Mapping';
    var original = mapping.data;
    original._id = mappingID;
    $scope.mapping = angular.copy(original);
    $scope.mapping._id = mappingID;

    $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
    }

    $scope.saveMapping = function(mapping) {
            $location.path('/facebook');
            services.updateMapping(mappingID, mapping, 'facebook-dp');
    };
});

app.controller('editCtrlFacebookKey', function ($scope, $rootScope, $location, $routeParams, services, mapping) {
    var mappingID = ($routeParams.mappingID) ? $routeParams.mappingID : '0';
    $rootScope.title = (mappingID != '0') ? 'Edit Facebook Key Mapping' : 'Add Facebook Key Mapping';
    $scope.buttonText = (mappingID != '0') ? 'Update Facebook Key Mapping' : 'Add New Facebook Key Mapping';
    var original = mapping.data;
    original._id = mappingID;
    $scope.mapping = angular.copy(original);
    $scope.mapping._id = mappingID;

    $scope.isClean = function() {
        return angular.equals(original, $scope.mapping);
    }

    $scope.deleteMapping = function(mapping) {
        $location.path('/facebook');
        if(confirm("Are you sure to delete mapping number: "+$scope.mapping._id)==true)
        services.deleteMapping(mapping.key_id, 'facebook-key');
    };

    $scope.saveMapping = function(mapping) {
        $location.path('/facebook');
        if (mappingID == '0') {
            services.insertMapping(mapping, 'facebook-key');
        }
        else {
            services.updateMapping(mappingID, mapping, 'facebook-key');
        }
    };
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
/*
      .when('/', {
        title: 'Mappings',
        templateUrl: 'adobe-pages/mappings.html',
        controller: 'listCtrl'
      })
*/
      .when('/adobe', {
        title: 'Adobe Mappings',
        templateUrl: 'adobe-pages/mappings.html',
        controller: 'listCtrlAdobe'
      })
      .when('/adobe/edit-mapping/:mappingID', {
        title: 'Edit Adobe Mappings',
        templateUrl: 'adobe-pages/edit-mapping.html',
        controller: 'editCtrlAdobe',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'adobe');
          }
        }
      })
      .when('/liveramp', {
        title: 'Liveramp Mappings',
        templateUrl: 'liveramp-pages/mappings.html',
        controller: 'listCtrlLiveramp'
      })
      .when('/liveramp/edit-dp-mapping/:mappingID', {
        title: 'Edit Liveramp DP Mappings',
        templateUrl: 'liveramp-pages/edit-dp-mapping.html',
        controller: 'editCtrlLiverampDp',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'liveramp-dp');
          }
        }
      })
      .when('/liveramp/edit-key-mapping/:mappingID', {
        title: 'Edit Liveramp Key Mappings',
        templateUrl: 'liveramp-pages/edit-key-mapping.html',
        controller: 'editCtrlLiverampKey',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'liveramp-key');
          }
        }
      })
      .when('/facebook', {
        title: 'Facebook Mappings',
        templateUrl: 'facebook-pages/mappings.html',
        controller: 'listCtrlFacebook'
      })
      .when('/facebook/edit-pixel-mapping/:mappingID', {
        title: 'Edit Facebook Pixel Mappings',
        templateUrl: 'facebook-pages/edit-pixel-mapping.html',
        controller: 'editCtrlFacebookPixel',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'facebook-pixel');
          }
        }
      })
      .when('/facebook/edit-dp-mapping/:mappingID', {
        title: 'Edit Facebook DP Mappings',
        templateUrl: 'facebook-pages/edit-dp-mapping.html',
        controller: 'editCtrlFacebookDp',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'facebook-dp');
          }
        }
      })
      .when('/facebook/edit-key-mapping/:mappingID', {
        title: 'Edit Facebook Key Mappings',
        templateUrl: 'facebook-pages/edit-key-mapping.html',
        controller: 'editCtrlFacebookKey',
        resolve: {
          mapping : function(services, $route){
            var mappingID = $route.current.params.mappingID;
            return services.getMapping(mappingID, 'facebook-key');
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
}]);

app.controller('RuleController', ['$scope', function($scope) {
    $scope.rules = [
      {name:'set single split', input1:'key_id:index', input2:'key_id:index', input3:'null'},
      {name:'set double split', input1:'key_id:index', input2: 'key_id:index1,index2', input3: 'key_id:index1,index2'},
      {name:'substring', input1:'direction', input2:'start_index', input3:'end_index'},
      {name:'ignore', input1:'null', input2:'null', input3:'null'},
      {name:'dec', input1:'decimal point position', input2:'null', input3:'null'},
    ];
    $scope.myRule = $scope.rules[-1]; // -- choose rule --
  }]);


app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);
