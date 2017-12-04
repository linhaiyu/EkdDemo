myapp.directive('transducer', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        //transclude: true,
        // scope: {
        //     trsindex: '@trsIndex',
        //     initfunc: '&initTrs'
        // },
        // controller: [],
        // link: function(scope, element, attrs) {
        //     console.log('transducer directive............');
        //     scope.trsindex = attrs.trsIndex;
        //     scope.init_trs_indicator(attrs.trsIndex);
        // },
        compile: function(element, attrs, transclude){
            return {
                post: function (scope, element, attrs) {
                    // console.log('transducer directive............');
                    scope.trsindex = attrs.trsIndex;
                    //scope.init_trs_indicator(attrs.trsIndex);
                }
            }
        },
        template:
            '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                    '<h1 class="panel-title"><strong>#{{item.index+1}}</strong></h1>' +
                '</div>' +
                '<div class="panel-body">' +
                     '<div class="row">' +
                        '<div class="col-md-3"><canvas id="tr{{item.index}}_working" width="20" height="20"></canvas></div>' +
                        '<div class="col-md-3"><canvas id="tr{{item.index}}_idle" width="20" height="20"></canvas></div>' +
                        '<div class="col-md-3"><canvas id="tr{{item.index}}_error" width="20" height="20"></canvas></div>' +
                     '</div>' +
                     '<div class="row">' +
                        '<div id="tr{{item.index}}_text" class="col-md-3" style="color:#46ad00"><h4>IDLE</h4></div>' +
                     '</div>' +
                '</div>' +
            '</div>'
    }
});

myapp.directive('transducer2', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        template:
            // '<div class="table">' +
            //     '<tr class="active"><td><canvas id="tr{{item.index}}_working" width="60" height="15"></canvas></td></tr>' +
            //     '<tr class="warning"><td><canvas id="tr{{item.index}}_idle" width="60" height="15"></canvas></td></tr>' +
            //     '<tr class="danger"><td><canvas id="tr{{item.index}}_error" width="60" height="15"></canvas></td></tr>' +
            //     '<tr class="info"><td><span id="tr{{item.index}}_text" style="font-weight:bold">WORK</span></td></tr>' +
            // '</div>'
            '<div class="container-fluid">' +
                '<div class="row">' +
                    '<div class="col-md-12">' +
                        '<canvas id="tr{{item.index}}_working" width="50" height="20"></canvas>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-md-12">' +
                        '<canvas id="tr{{item.index}}_idle" width="50" height="20"></canvas>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-md-12">' +
                        '<canvas id="tr{{item.index}}_error" width="50" height="20"></canvas>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-md-12">' +
                        '<span id="tr{{item.index}}_text" style="font-weight:bold"></span>' +
                    '</div>' +
                '</div>' +
            '</div>'
    }
});

/* This directive is used for detecting the ng-repeat execution state. */
myapp.directive('trsrepeatFinish', function($timeout) {
    return {
        link: function(scope, element, attr) {
            //console.log(scope.$index);
            if(scope.$last == true)
            {
                $timeout(function () {
                    // console.log('ng-repeat finished!!');
                    scope.$eval(attr.trsrepeatFinish)
                })
            }
        }
    }
})
