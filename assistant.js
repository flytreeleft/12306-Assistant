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

var loginReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/loginAction.*/;
var queryReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/order\/querySingleAction.*/;
var url = window.location.href;

if (url.match(loginReg)) {
	login();
} else if (url.match(queryReg)) {
	query();
}

function notify(msg, delay) {
	chrome.extension.sendRequest({type: 'notify', msg: msg, delay: delay}, function(response) {});
}

function play(type) {
	chrome.extension.sendRequest({type: 'play'}, function(response) {});
}

function login(user) {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/login.js')+'"/>')
	).append(
		$('<div id="loginListener"/>').hide().bind({
			'showMessage': function() {
				notify($(this).html(), 10000);
				//play();
			}
		})
	);
}

function query(ticket) {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/query.js')+'"/>')
	).append(
		$('<div id="queryListener"/>').hide().bind({
			'showMessage': function() {
				notify($(this).html(), 10000);
			},
			'bookTicket': function() {
				book($(this).html().split('#'));
			}
		})
	);
}

function book(order) {
	var bookUrl = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=submutOrderRequest';
		
	function submitBookRequest() {
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
			success: function(msg){
				if (msg.indexOf('<title>消息提示</title>') > -1) {
					setTimeout(submitBookRequest, 2000);
				} else {
					notify('预订成功,请尽快完成订单并提交', 10000);
					// http://hi.baidu.com/lmcbbat/blog/item/5d40c473fb3a19138601b0c8.html
					// 写完内容后,必须关闭输出流,否则,将无法显示表单,某些脚本也无法执行
					//console.log('book: ', document, document.documentElement);
					document.write(msg);
					document.write('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/order.js')+'"></script>');
					//document.write('<div id="orderListener"></div>');
					document.close();
					$(window).bind({
						'showMessage': function() {
							notify($('#orderListener').html(), 10000);
						}
					});
				}
			},
			error: function(msg){
				setTimeout(submitBookRequest, 2000);
			}
		});
	}
	submitBookRequest();
}
