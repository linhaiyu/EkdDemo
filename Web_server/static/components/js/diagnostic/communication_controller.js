myapp.controller('communication_controller', ['$scope', function ($scope){

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

    function communication_init (argument) {
        console.log("communication controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "communication");

        $scope.load_page = {
            flowout : true,
            flowin  : false,
            flowtjl : false
        };
    }

    communication_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("communication controller on destroy");
    });
}]);
