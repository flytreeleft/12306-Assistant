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

$(document).ready(function() {
	$('body').bind({
		'message': function() {
			notify($(this).attr('message'));
		}
	});

	if ($('head title').html() == '登录') {
		if ($('head').html().match(/var\s+isLogin\s*=\s*true/g)) {
			// 已经登录,则直接跳转到查询页面
			window.location.href = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init';
		} else {
			chrome.extension.sendRequest({action: 'user'}, function(user) {
				login(user);
			});
		}
	} else if ($('head title').html() == '车票预订') {
		chrome.extension.sendRequest({action: 'ticket'}, function(ticket) {
			query(ticket);
		});
	}
});

function notify(msg, type) {
	chrome.extension.sendRequest({action: 'notify', type: type, msg: msg}, function(response) {});
}

function play(type) {
	chrome.extension.sendRequest({action: 'play', type: type}, function(response) {});
}

function login(user) {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('assistant/login.js')+'"/>')
	).bind({
		'loginSuccess': function() {
			notify('登录成功,开始查询车票吧!');
			play('login');
			window.location.href = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init';
		}
	});
	for (var id in user) {
		user[id] && $('#'+id).val(user[id]);
	}
}

function query(ticket) {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('assistant/query.js')+'"/>')
	).append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('assistant/book.js')+'"/>')
	).bind({
		'periodOfPresale': function() {
			chrome.extension.sendRequest({action: 'periodOfPresale', value: $(this).attr('periodOfPresale')}, function() {});
		},
		'hasTicket': function() {
			notify('现在有票,可以预定...');
			play('ticket');
		},
		'bookTicket': function() {
			notify('正在预定车票,请等待...');
		},
		'bookSuccess': function() {
			notify('预订成功,请尽快完成订单并提交');
			play('book');
			book();
		}
	});
	for (var id in ticket) {
		ticket[id] && $('#'+id).val(ticket[id]);
	}
}

function book() {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('assistant/order.js')+'"/>')
	).bind({
		'orderSuccess': function() {
			notify('订单提交成功,请在规定时间内完成支付');
			play('order');
		}
	});
}
