/*
  12306 Assistant v1.0.0
  Copyright (C) 2012 flytreeleft (flytreeleft@126.com)
  
  THANKS:
  Hidden, Jingqin Lynn, Kevintop

  Includes jQuery
  Copyright 2011, John Resig
  Dual licensed under the MIT or GPL Version 2 licenses.
  http://jquery.org/license

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */

// http://api.jquery.com/serializeArray/
(function($){
	$.fn.serializeJSON = function() {
		var json = {};
		jQuery.map($(this).serializeArray(), function(n, i){
			json[n['name']] = n['value'];
		});
		return json;
	};
})(jQuery);

$(document).click(function() {
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
		window.webkitNotifications.requestPermission();
	}
});

function notify(str, timeout) {
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
		var notification = webkitNotifications.createNotification(
			chrome.extension.getURL("icon.ico"),  // icon url - can be relative
			"12306助手",  // notification title
			str
		);
		notification.show();
		if (timeout) {
			setTimeout(function() {
				notification.cancel();
			}, timeout);
		}
	} else {
		alert(str);
	}
}

chrome.extension.sendRequest(null, function(response) {
	var loginReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/loginAction.*/;
	var queryReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/order\/querySingleAction.*/;
	var url = window.location.href;

	if (url.match(loginReg)) {
		login(response.user);
	} else if (url.match(queryReg)) {
		query(response.ticket);
	}
});

