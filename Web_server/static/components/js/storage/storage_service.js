myapp.factory('storage_service', ['web_socket_service', function (web_socket_service) {
	var Service = {};
	var information = "";

	var callback_info = function (msgData) {
		var curtime = (new Date()).toLocaleString();
		information = "[" + curtime + "] " + msgData.Information + "\r\n" + information;

		if(update_info_func != null) {
			update_info_func(information)
		}
	};

	web_socket_service.register('information', callback_info);

	var update_info_func;

	Service.reg_update_info_func = function (update_func) {
		update_info_func = update_func;
		if (update_info_func != null) {
			update_info_func(information)
		}
	};

	Service.unreg_update_info_func = function () {
		update_info_func = null;
	};

	return Service;
}])