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

// 登录过程的监听设置
var loginCount = 1;
var loginTimeout = 6000;
var successLoginEvent = document.createEvent('Event');

successLoginEvent.initEvent('successLogin', true, true);

// 重载原来的登录按钮点击事件
$(document).ready(function() {
	$('#subLink').html('<span><ins>自动登录</ins></span>')./*unbind('click').removeAttr('onclick').*/click(function(event) {
		$('#randCodeSpan').html('');
		checkAysnSuggest();
		return false;
	});
});

// 重载
function checkAysnSuggest() {
	$('#randCodeSpan').html('第('+(loginCount++)+')次尝试中...');
	
    $.ajax({
		url: 'loginAction.do?method=loginAysnSuggest',
        type: 'POST',
        dataType: 'json',
		timeout: 30000,
        success: function(data) {
            if (!data || data.randError != 'Y') {
				setTimeout(checkAysnSuggest, loginTimeout);
            } else {
				autoLogin();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			autoLogin();
        }
    });
}

function autoLogin() {
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
					$('#randCodeSpan').html(errorMsg[1]);
				}
			} else if (msg.indexOf('请输入正确的验证码') > -1) {
				$('#randCodeSpan').html('请输入正确的验证码!');
				$('#img_rrand_code').attr('src', 'passCodeAction.do?rand=lrand' + '&' + Math.random());
				$('#randCode').focus();
			} else if (msg.indexOf('var isLogin= true') > -1) {
				$('#loginListener')[0].dispatchEvent(successLoginEvent);
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
