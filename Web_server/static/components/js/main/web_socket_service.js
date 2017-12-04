/* global angular */
/* A SERVICE OF WEB SOCKET */
myapp.factory('web_socket_service', ['gui_config', function(gui_config){
    var Service = {};
    var callbackPool = []; // onmessage的消息分发函数
    var watcherPool = [];
    var connection_falg = false;

    var ws = new WebSocket(gui_config.WEB_SOCKET_ADDR);
    var send_msg_debug_flag = false
    var on_msg_debug_flag = false
    var total_cnt = 0

    console.log('web socket service launch...');

    ws.onopen = function(){
        console.log("连接到服务器！");
        connection_falg = true;

        // Send a register message to register a client on the web server
        //console.log('web_socket_service: send open reg info');
        var open_info = {
           "Source":"client",
           "OpenRegister": "True",
        };
        ws.send(JSON.stringify(open_info));

        // Send a request message to query the current system status
        //console.log('web_socket_service: send system status request info.');
        var request_info = {
            "Source": "client",
            "OpenRegister": "False",
            "MsgLabel": "main_controller_request"
        };
        ws.send(JSON.stringify(request_info));

        for (var i = 0; i < watcherPool.length; i++) {
            if (watcherPool[i].watcher != null) {
                watcherPool[i].watcher(connection_falg);
            }
        }
    };

    ws.onclose = function(e){
        connection_falg = false;
        console.log("连接被关闭！ -- ", e);
    };

    ws.onerror = function (e) {
        console.log('WebSocket Error: ', e);
    }

    ws.onmessage = function(msg){
        //alert(msg.data);
        onMessage(msg);
    };

    // onmessage的消息分发函数
    function onMessage(msg) {
        try {
            var msgData = JSON.parse(msg.data);
            if (on_msg_debug_flag) {
                console.log("Socket Receive msg: ", msgData);
            }

            // console.log("Socket onMessage: %s,  %d ~~~~", msgData.MsgLabel, total_cnt++)

            for(var i = 0; i < callbackPool.length; ++i)
            {
                var callbackObj = callbackPool[i];

                // "information" requires multiple distribution, so need to be special treatment
                if ((msgData.MsgLabel == "information") && (callbackObj.MsgLabel === msgData.MsgLabel) && (callbackObj.callback != null)) {
                    callbackObj.callback(msgData);
                    continue;                    
                }
                else if((callbackObj.MsgLabel === msgData.MsgLabel) && (callbackObj.callback != null))
                {
                    callbackObj.callback(msgData);
                    break;
                }
            }
        } catch(e) {
            console.log('ERROR!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log(e);
            console.log(msg.data);
        }
    };


    // web_socket_service服务对外提供的接口
    Service.register = function(msglabel, callbackFunc){

        // 检查是否已经注册
        for(var i=0; i < callbackPool.length; ++i)
        {
            var callbackObj = callbackPool[i];

            // "information" requires multiple distribution, so need to be special treatment
            if(callbackObj.MsgLabel === msglabel && msglabel != "information"){
                console.log("This msglabel has been registered: ", msglabel);
                return;
            }
        }

        callbackPool.push({MsgLabel: msglabel, callback: callbackFunc});
        // console.log("callbackPool register: " + msglabel);
    };

    Service.sendMessage = function(msg){
        if (send_msg_debug_flag) {
            console.log("Socket Send msg: ", msg);
        }

        ws.send(msg);
    };

    Service.reg_connection_watcher = function (name, watcher) {
        watcherPool.push({"name": name, "watcher": watcher});

        if(watcher != null && connection_falg) {
            watcher(connection_falg);
        }
    };

    Service.unreg_connection_watcher = function (name) {
        for (var i = 0; i < watcherPool.length; i++) {
            if (watcherPool[i].name == name) {
                watcherPool.splice(i, 1);
                break;
            }
        }
    };

    Service.set_debug_flag = function(Type, flag) {
        if (Type == 1) {
            send_msg_debug_flag = flag;
        }
        else {
            on_msg_debug_flag = flag;
        }
    }

    return Service;
}]);

/*
myapp.factory('githubService', ['$http', function($http) {
    var doRequest = function(username, path) {
      return $http({
        method: 'JSONP',
        url: 'https://api.github.com/users/' + username + '/' + path + '?callback=JSON_CALLBACK'
      });
    }
    return {
      events: function(username) { return doRequest(username, 'events'); },
    };
}]);
*/

/*
angular.module('myApp.services', [])
.factory('githubService', function($http) {
    // 这里已经可以访问 $http服务
    var githubUsername;

    var doRequest = function(path) {
        // 从使用JSONP调用github API的$http 服务中返回 promise对象
        return $http({
                method: 'JSONP',
                url: 'https://api.github.com/users/' + githubUsername + '/' + path + '?callback=JSON_CALLBACK'
        });
    };

    // 返回一个带有两个方法的服务对象
    // events 函数 和 setUsername
    return {
        events: function()
        {
            return doRequest('events');
        },
        setUsername: function(username) {
            githubUsername = username;
        }
    };
}); */
