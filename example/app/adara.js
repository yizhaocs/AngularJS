angular.module('adara', [])
    .controller('adaraController', ['$scope', function($scope) {
        $scope.debug = true;
        $scope.myDropDown = 'none';
        
        // parse_rule
        $scope.split1 = {column1:''};
        $scope.split2 = {column1:'', column2:''};


        // condition_rule
        $scope.len = {column1:''};
        $scope.range = {column1:'', column2:''};

        $scope.inElementArray = [{
            column1: '0',
            column2: ''
        }];

        // action_rule
        $scope.substr = {column1:'', column2:'', column3:''};

        $scope.setRuleArray = [{
            column1: '0',
            column2: ''
        }];

        $scope.dec = {column1:''};

        
        // button fuctions
        $scope.addSetRule = function() {
            if($scope.debug){
                 console.log('addSetRule');
             }
            $scope.setRuleArray.push({
                column1: $scope.setRuleArray.length,
                column2: ''
            });

        };

        $scope.removeSetRule = function() {
            if($scope.debug){
                console.log('removeSetRule');
            }
            $scope.setRuleArray.pop();
        };

        $scope.addInElement = function() {
            if($scope.debug){
                  console.log('addInElement');
             }
            $scope.inElementArray.push({
                column1: $scope.inElementArray.length,
                column2: ''
            });
        };

        $scope.removeInElement = function() {
            if($scope.debug){
                console.log('removeInElement');
            }
            $scope.inElementArray.pop();
        };

        $scope.saveAll = function() {
            // key_id
            var keyId = $scope.keyId;
            // type
            var type = $scope.insertType;
            // parse_rule
            var split1Column1 = $scope.split1.column1;
            var split2Column1 = $scope.split2.column1;
            var split2Column2 = $scope.split2.column2;
            // condition_rule
            var lenColumn1 = $scope.len.column1;
            var rangeColumn1 = $scope.range.column1;
            var rangeColumn2 = $scope.range.column2;
            // action_rule
            var substrColumn1 = $scope.substr.column1;
            var substrColumn2 = $scope.substr.column2;
            var substrColumn3 = $scope.substr.column3;
            var decColumn1 = $scope.dec.column1;

            if($scope.debug){
                console.log('saveAll');
                // key_id
                console.log('key_id:' + keyId);
                //type
                console.log('type:' + type);
                // parse_rule
                console.log('split1 column1:' + JSON.stringify(split1Column1));
                console.log('split2 column1:' + JSON.stringify(split2Column1));
                console.log('split2 column2:' + JSON.stringify(split2Column2));

                // condition_rule
                console.log('len column1:' + JSON.stringify(lenColumn1));
                console.log('range column1:' + JSON.stringify(rangeColumn1));
                console.log('range column2:' + JSON.stringify(rangeColumn2));

                // action_rule
                console.log('substr column1:' + JSON.stringify(substrColumn1));
                console.log('substr column2:' + JSON.stringify(substrColumn2));
                console.log('substr column2:' + JSON.stringify(substrColumn3));
                console.log('dec column1:' + JSON.stringify(decColumn1));
            }

            var inElementArrayIndex = 0;
            $scope.inElementArray.forEach(function(element) {
                var content = JSON.stringify(element);
                if(element.column2 !==''){
                    if($scope.debug){
                        console.log('element #' + (inElementArrayIndex++) + ': ' + content);
                    }
                }
            });

            // action_rule
            var setRuleArrayIndex = 0;
            $scope.setRuleArray.forEach(function(rule) {
                var content = JSON.stringify(rule);
                if(rule.column2 !==''){
                    if($scope.debug){
                         console.log('rule #' + (setRuleArrayIndex++) + ': ' + content);
                    }
                }
            });
        }
    }]);