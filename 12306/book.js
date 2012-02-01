/*
  12306 Assistant
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

// 预定的设置
var bookCount = 1;
var bookSuccessEvent = document.createEvent('Event');

bookSuccessEvent.initEvent('bookSuccess', true, true);

// 预定车票
function book(order) {
	var bookUrl = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=submutOrderRequest';

	function submitBookRequest() {
		showMessage('第 '+(bookCount++)+' 次预定...');

		$.ajax({
			type: 'POST',
			url: bookUrl,
			data: (function() {
				var json = $('#orderForm').serializeJSON();

				json['station_train_code'] = order[0];
				json['lishi'] = order[1];
				json['train_start_time'] = order[2];
				json['trainno'] = order[3];
				json['from_station_telecode'] = order[4];
				json['to_station_telecode'] = order[5];
				json['arrive_time'] = order[6];
				json['from_station_name'] = order[7];
				json['to_station_name'] = order[8];
				json['ypInfoDetail'] = order[9];

				return json;
			})(),
			timeout: 30000,
			success: function(response){
				if (response.indexOf('提交订单验证码') > -1) {
					$('body').html(response); // 不再细化/较真了,就这么弄!
					$('body')[0].dispatchEvent(bookSuccessEvent);
				} else {
					setTimeout(submitBookRequest, 2000);
				}
			},
			error: function(response){
				setTimeout(submitBookRequest, 2000);
			}
		});
	}
	submitBookRequest();
}
