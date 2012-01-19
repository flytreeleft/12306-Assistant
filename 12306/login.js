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

// 登录过程的设置
var loginCount = 1;
var loginTimeout = 6000;
var stopLogin = false;
var messageEvent = document.createEvent('Event');
var loginSuccessEvent = document.createEvent('Event');

messageEvent.initEvent('message', true, true);
loginSuccessEvent.initEvent('loginSuccess', true, true);

function showMessage(msg) {
	$('#randCodeSpan').html(msg || '');
	$('#messageListener').html(msg || '');
	window.dispatchEvent(messageEvent);
}

// 重载原来的登录按钮点击和回车事件
$(document).ready(function() {
	$('body').append($('<div id="messageListener"/>').hide());
	
	$(document).unbind('keyup').keyup(function(e){
		if(/^13$/.test(e.keyCode)){
			if(checkempty($("#UserName").val())
					&& checkempty($("#password").val())
					&& checkempty($("#randCode").val())
					&&checkPassLength($("#password").val())
					&& checkUserName()){
				$('#subLink').click();
			}
		}
	});

	$('#subLink')
		.html('<span><ins>自动登录</ins></span>')
		.toggle(function() {
			stopLogin = false;
			$(this).html('<span><ins>暂停登录</ins></span>');
			checkAysnSuggest();
		}, function() {
			loginCount = 1;
			stopLogin = true;
			$(this).html('<span><ins>自动登录</ins></span>');
			showMessage('');
		});
});

// 重载(尝试性登录)
function checkAysnSuggest() {
	if (stopLogin) return;

	showMessage('第 '+(loginCount++)+' 次登录尝试中...');

    $.ajax({
		url: 'loginAction.do?method=loginAysnSuggest',
        type: 'POST',
        dataType: 'json',
		timeout: 30000,
        success: function(data) {
            if (!data || data.randError != 'Y') {
				setTimeout(checkAysnSuggest, loginTimeout);
            } else {
				realLogin();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			realLogin();
        }
    });
}
// 真正的登录请求
function realLogin() {
	var queryUrl = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init';

	$.ajax({
		type: 'POST',
		url: $('#loginForm').attr('action'),
		data: $('#loginForm').serialize(),
		timeout: 30000,
		success: function(msg){
			var msg = msg || '';
			var errorMsg = /var\s+message\s*=\s*"([^"\s]+)"/g.exec(msg);

			if (errorMsg && errorMsg[1]) {
				if (errorMsg[1].indexOf('当前访问用户过多') > -1) {
					setTimeout(checkAysnSuggest, loginTimeout);
				} else {
					showMessage(errorMsg[1]);
				}
			} else if (msg.indexOf('请输入正确的验证码') > -1) {
				showMessage('请输入正确的验证码!');
				$('#img_rrand_code').attr('src', 'passCodeAction.do?rand=lrand' + '&' + Math.random());
				$('#randCode').focus();
			} else if (msg.indexOf('var isLogin= true') > -1) {
				window.dispatchEvent(loginSuccessEvent);
				location.replace(queryUrl);
			} else {
				setTimeout(checkAysnSuggest, loginTimeout);
			}
		},
		error: function(msg){
			setTimeout(checkAysnSuggest, loginTimeout);
		}
	});
}
