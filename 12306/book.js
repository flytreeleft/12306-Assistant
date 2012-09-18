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
	var bookUrl = ctx + "/order/querySingleAction.do?method=submutOrderRequest";

	function submitBookRequest() {
		showMessage('第 '+(bookCount++)+' 次预定...');

		$.ajax({
			type: 'POST',
			url: bookUrl,
			data: (function() {
				$('#station_train_code').val(order[0]);
				$('#lishi').val(order[1]);
				$('#train_start_time').val(order[2]);
				$('#trainno').val(order[3]);
				$('#from_station_telecode').val(order[4]);
				$('#to_station_telecode').val(order[5]);
				$('#arrive_time').val(order[6]);
				$('#from_station_name').val(order[7]);
				$('#to_station_name').val(order[8]);
				$('#ypInfoDetail').val(order[9]);
				$('#mmStr').val(order[10]);
				
				var json = $('#orderForm').serializeJSON();

				return json;
			})(),
			timeout: 30000,
			success: function(response){
				var response = response || '';
				var errorMsg = /var\s+message\s*=\s*"([^"]+)"/g.exec(response);
				var msg = errorMsg && errorMsg[1] ? errorMsg[1] : '';
				
				if (msg) { // 显示错误信息
					console.log('book error message: ', msg);
					showMessage(msg);
				}
			
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
