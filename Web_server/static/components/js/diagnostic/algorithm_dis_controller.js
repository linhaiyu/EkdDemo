myapp.controller('algorithm_dis_controller', ['$scope', function ($scope){

    $scope.set_load_page = function (page_type) {
        for (variable in $scope.load_page) {
            if (variable == page_type) {
                $scope.load_page[variable] = true;
            }
            else {
                $scope.load_page[variable] = false;
            }
        }
    };

    function algorithm_dis_init (argument) {
        console.log("algorithm dis controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "algorithm");

        $scope.load_page = {
            flowout : true,
            flowin  : false,
            flowtjl : false
        };
    };

    algorithm_dis_init();

        /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("algorithm dis controller on destroy");
    });
}]);
