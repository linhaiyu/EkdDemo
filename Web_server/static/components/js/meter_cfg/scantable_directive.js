/* This directive is used for detecting the ng-repeat execution state. */
myapp.directive('screpeatFinish', function($timeout) {
    return {
        link: function(scope, element, attr) {
            //console.log(scope.$index);
            if(scope.$last == true)
            {
                $timeout(function () {
                    // console.log('ng-repeat finished*************');
                    scope.$eval(attr.screpeatFinish)
                })
            }
        }
    }
});
