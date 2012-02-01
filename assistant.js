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
	var loginReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/loginAction.*/;
	var queryReg = /(http|https):\/\/dynamic\.12306\.cn\/otsweb\/order\/querySingleAction.*/;
	var url = window.location.href;

	$('body').bind({
		'message': function() {
			notify($(this).attr('message'));
		}
	});
	
	if (url.match(loginReg)) {
		login();
	} else if (url.match(queryReg)) {
		query();
	}
});

function notify(msg, type) {
	chrome.extension.sendRequest({action: 'notify', type: type, msg: msg}, function(response) {});
}

function play(type) {
	chrome.extension.sendRequest({action: 'play', type: type}, function(response) {});
}

function login(user) {
	var queryUrl = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init';
	
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/login.js')+'"/>')
	).bind({
		'loginSuccess': function() {
			notify('登录成功,开始查询车票吧!');
			play('login');
			window.location.href = queryUrl;
		}
	});
}

function query(ticket) {	
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/query.js')+'"/>')
	).append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/book.js')+'"/>')
	).bind({
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
}

function book() {
	$('body').append(
		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/order.js')+'"/>')
	).bind({
		'orderSuccess': function() {
			notify('订单提交成功,请在规定时间内完成支付');
			play('order');
		}
	});
}
