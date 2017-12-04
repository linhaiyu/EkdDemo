myapp.controller('transducer_controller', ['$scope', function ($scope){

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

    function transducer_init (argument) {
        console.log("transducer controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "transducer");

        $scope.load_page = {
            flowout : true,
            flowin  : false,
            flowtjl : false
        };
    }

    transducer_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("transducer controller on destroy");
    });
}]);
