myapp.controller('environment_controller', ['$scope', function ($scope){

    /* Some tool functions  ------------------------------------------------ */
    $scope.get_color = function (value) {
         var tem_color = ['#CCCCCC'];
         if(value>=0 & value<100) {
             tem_color = ['#0099FF'];
         }
         else if(value>=100 & value<150) {
             tem_color = ['#F0AD4E'];
         }
         else if(value>=150) {
             tem_color = ['#D9534F'];
             //tem_color = ['#990033'];
         }

         return tem_color;
    };

    // function tab_page_loaded (event, msg) {
    //     $('#environment_'+msg).addClass("active");
    //     $('#environment_'+msg).siblings().removeClass('active');
    // };
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

    function environment_init (argument) {
        console.log("environment_controller start...");
        $scope.$emit("SUB_PAGE_LOADED", "environment");
        // $scope.$on("TAB_PAGE_LOADED", tab_page_loaded);
        $scope.load_page = {
            flowout : true,
            flowin  : false,
            flowtjl : false
        };
    }

    environment_init();

    /* Monitor controller's destroy event */
    $scope.$on("$destroy", function(){
        console.log("environment controller on destroy");
    });
}]);
