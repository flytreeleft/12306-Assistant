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

// 登录过程的监听设置
var loginCount = 1;
var startLoginEvent = document.createEvent('Event');
var successLoginEvent = document.createEvent('Event');

startLoginEvent.initEvent('startLogin', true, true);
successLoginEvent.initEvent('successLogin', true, true);

function autoLogin() {
	var queryUrl = 'https://dynamic.12306.cn/otsweb/order/querySingleAction.do?method=init';
	
	$('#randCodeSpan').html('第('+(loginCount++)+')次尝试中...');
	
	$.ajax({
		type: 'POST',
		url: $('#loginForm').attr('action'),
		data: $('#loginForm').serialize(),
		timeout: 30000,
		success: function(msg){
			var errorMsg = /var\s+message\s*=\s*"([^"\s]+)"/g.exec(msg);
			
			$(this).attr('disabled', false);
			
			if (errorMsg && errorMsg[1]) {
				if (errorMsg[1].indexOf('当前访问用户过多') > -1) {
					setTimeout(autoLogin, 2000);
				} else {
					$('#randCodeSpan').html(errorMsg[1]);
				}
			} else if (msg.indexOf('请输入正确的验证码') > -1) {
				$('#randCodeSpan').html('请输入正确的验证码!');
				$('#img_rrand_code').attr('src', 'passCodeAction.do?rand=lrand' + '&' + Math.random());
				$('#randCode').focus();
			} else {
				$('#loginListener')[0].dispatchEvent(successLoginEvent);
				location.replace(queryUrl);
			}
		},
		error: function(msg){
			setTimeout(autoLogin, 2000);
		}
	});
}

// 重载原来的登录按钮点击事件
$(document).ready(function() {
	$('#subLink').html('<span><ins>自动登录</ins></span>').unbind('click').removeAttr('onclick').click(function(event) {
		$('#randCodeSpan').html('');
		if(checkName() && checkPassword() && checkRandCode()) {
			$('#loginListener')[0].dispatchEvent(startLoginEvent);
			autoLogin();
			$(this).attr('disabled', true);
		}
		return false;
	});
});
// 重载
function checkAysnSuggest() {
    $.ajax({
		url: 'loginAction.do?method=loginAysnSuggest',
        type: 'POST',
        dataType: 'json',
        success: function(data) {
            if (data.randError != 'Y') {
				$('#randCodeSpan').html(data.randError);
            } else {
                $('#loginListener')[0].dispatchEvent(startLoginEvent);
				autoLogin();
				$(this).attr('disabled', true);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			setTimeout(autoLogin, 2000);
        }
    });
}
