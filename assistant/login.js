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
var loginTimeout = 3000;
var stopLogin = false;
var delayTable = [3000, 5000, 7000, 9000];
var messageEvent = document.createEvent('Event');
var loginSuccessEvent = document.createEvent('Event');

messageEvent.initEvent('message', true, true);
loginSuccessEvent.initEvent('loginSuccess', true, true);

function showMessage(msg) {
	$('#randCodeSpan').html(msg || '');
	$('body').attr('message', msg || '')[0].dispatchEvent(messageEvent);
}

// 重载原来的登录按钮点击和回车事件
$(document).unbind('keyup').keyup(function(e){
	if(/^13$/.test(e.keyCode)){
		if(checkempty($("#UserName").val())
				&& checkempty($("#password").val())
				&& checkempty($("#randCode").val())
				&& checkPassLength($("#password").val())
				&& checkUserName()){
			$('#subLink').click();
		}/* else {
			showMessage('请确保 登录名/密码/验证码 不为空,且密码长度在6位以上');
		}*/
	}
});

$('#subLink')
	.html('<span><ins>自动登录</ins></span>')
	.unbind('click').removeAttr('onclick')
	.toggle(function() {
		loginCount = 1;
		stopLogin = false;
		$(this).html('<span><ins>暂停登录</ins></span>');
		checkAysnSuggest();
	}, function() {
		stopLogin = true;
		$(this).html('<span><ins>自动登录</ins></span>');
	});
// 提交的表单一般是按钮所在的form节点
var submitForm = $('#subLink').parents('form').get(0);

// 重登录,自动选择登录间隔时间
function relogin() {
	var delay = delayTable[Math.floor(Math.random()*delayTable.length)];

	showMessage('登录失败,'+(delay/1000)+' 秒后重试...');
	setTimeout(checkAysnSuggest, delay);
}

// 服务器可能要求先进行尝试性登录,所以需要迂回操作
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
			data && $("#loginRand").val(data.loginRand);
            if (!data || data.randError != 'Y') {
				relogin();
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
	var refundLoginCheck = $("[name='refundLoginCheck']");
	if (refundLoginCheck && (refundLoginCheck.attr("checked") == true)) {
		$("#refundLogin").val('Y');
	} else {
		$("#refundLogin").val('N');
	}
	$.ajax({
		type: 'POST',
		url: $(submitForm).attr('action'),
		data: $(submitForm).serialize(),
		timeout: 30000,
		success: function(response){
			var response = response || '';
			var errorMsg = /var\s+message\s*=\s*"([^"]+)"/g.exec(response);
			var msg = errorMsg && errorMsg[1] ? errorMsg[1] : '';
			var retry = false;

			if (stopLogin) return;

			if (msg.indexOf('当前访问用户过多') > -1) {
				retry = true;
			} else if (!msg) {
				if (response.indexOf('请输入正确的验证码') > -1) {
					msg = '请输入正确的验证码!';
					$('#img_rrand_code').click();
					$('#randCode').attr('value', '').focus();
				} else if (response.indexOf('var isLogin= true') > -1) {
					$('body')[0].dispatchEvent(loginSuccessEvent);
				} else {
					retry = true;
				}
			}

			if (retry) {
				relogin();
			} else if (msg) { // 显示错误信息,并通过点击切换按钮状态
				console.log('login error message: ', msg);
				showMessage(msg);
				$('#subLink').click();
			}
		},
		error: function(response){
			relogin();
		}
	});
}
