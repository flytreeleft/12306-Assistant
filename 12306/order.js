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

// 提交订单的设置
var orderCount = 1;
var stopOrder = false;
var delayTable = [5000, 7000, 9000, 10000];
var messageEvent = document.createEvent('Event');
var orderSuccessEvent = document.createEvent('Event');

messageEvent.initEvent('message', true, true);
orderSuccessEvent.initEvent('orderSuccess', true, true);

function showMessage(msg) {
	$('body').attr('message', msg || '')[0].dispatchEvent(messageEvent);
}

function order(formId) {
	var orderUrl = "https://dynamic.12306.cn/otsweb/order/confirmPassengerAction.do?method=confirmPassengerInfoSingle";
	
	function submitOrderRequest() {
		if(stopOrder || !submit_form_check(formId)) return;
		
		showMessage('第 '+(orderCount++)+' 次订单提交...');
		
		$.ajax({
			type: "POST",
			url: orderUrl,
			data: $("#"+formId).serialize(),
			timeout: 30000,
			success: function(msg){
				// <input type="hidden" name="org.apache.struts.taglib.html.TOKEN" value="98ae94ddfede3d069fddb9225e9f558d">
				var token = /<input.*?name="org\.apache\.struts\.taglib\.html\.TOKEN" value="([^"]+)">/g.exec(msg);
				var errorMsg = /var\s+message\s*=\s*"([^"\s]+)"/g.exec(msg);
				
				if (token && token[1]) {
					$("input[name='org.apache.struts.taglib.html.TOKEN']").val(token[1]);
				}
				
				if (msg.lastIndexOf("输入的验证码不正确") > -1) {
					alert("输入的验证码不正确!");
					$(":button").attr("disabled", false).removeClass("long_button_x").addClass("long_button_u");
				} else if (msg.lastIndexOf("请不要重复提交") > -1
							|| msg.lastIndexOf("当前提交订单用户过多") > -1
							|| msg.indexOf("<title>消息提示</title>") > -1) {
					var delay = delayTable[Math.floor(Math.random()*delayTable.length+1)];
					
					showMessage('订单提交失败,'+(delay/1000)+' 秒后重试...');
					setTimeout(submitOrderRequest, delay);
					
					$(":button").attr("disabled", true).addClass("long_button_x");
				} else {
					$('body').html(msg);
					$('body')[0].dispatchEvent(orderSuccessEvent);
					// http://hi.baidu.com/lmcbbat/blog/item/5d40c473fb3a19138601b0c8.html
					// 写完内容后,必须关闭输出流,否则,将无法显示表单,某些脚本也无法执行
					//document.write(msg);
					//document.close();
				}
			},
			error: function(msg){
				setTimeout(submitOrderRequest, 2000);
			}
		});
	}
	submitOrderRequest();
}

$(".tj_btn button:last-child")
	.unbind("click")
	.removeAttr("onclick")
	.html('自动提交')
	.toggle(function() {
		stopOrder = false;
		$(this).html('暂停提交');
		order("confirmPassenger");
	}, function() {
		orderCount = 1;
		stopOrder = true;
		$(this).html('自动提交');
		showMessage('');
	});
