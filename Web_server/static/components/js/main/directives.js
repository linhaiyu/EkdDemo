myapp.directive('tabs', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {},
        controller: [ "$scope", function($scope) {
            var panes = $scope.panes = [];

            $scope.select_pane = function(pane){
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };

            this.add_pane = function(pane) {
                //console.log("Hi, Now we will add a pane to panes...");
                if(panes.length == 0) {
                    $scope.select_pane(pane);
                }

                panes.push(pane);
            }
        }],
        template:
            '<div role="tabpanel">' +
                '<ul class="nav nav-pills nav-justified" role="tablist">' +
                    '<li ng-repeat="pane in panes" ng-class={"active":pane.selected}>' +
                        '<a href="" ng-click="select_pane(pane)" data-toggle="tab" role="tab">{{pane.title}}</a>' +
                    '</li>' +
                '</ul>' +
                '<div class="tab-content" ng-transclude></div>' +
            '</div>'
    };
});

myapp.directive('pane', function() {
    return {
        require: '^tabs',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {title: '@'},
        link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.add_pane(scope);
        },
        template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>'
    };
});
