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
	//alert(msg);
	$('body').attr('message', msg || '')[0].dispatchEvent(messageEvent);
}

$('.tj_btn button:last-child')
	.html('自动提交')
	.unbind('click').removeAttr('onclick')
	.toggle(function() {
		orderCount = 1;
		stopOrder = false;
		$(this).html('暂停提交');
		order();
	}, function() {
		stopOrder = true;
		$(this).html('自动提交');
	});

// 提交的表单一般是按钮所在的form节点
var submitForm = $('.tj_btn button:last-child').parents('form').get(0);

// 重新提交,自动选择提交的间隔时间
function reorder() {
	var delay = delayTable[Math.floor(Math.random()*delayTable.length)];

	showMessage('订单提交失败,'+(delay/1000)+' 秒后重试...');
	setTimeout(order, delay);
}
// 提交订单
function order() {
	if (stopOrder) return;
	if (!submit_form_check($(submitForm).attr('id'))) {
		$(".tj_btn button:last-child").click();
		return;
	}

	showMessage('第 '+(orderCount++)+' 次订单提交...');

	$(':button').attr('disabled', false).removeClass('long_button_x').addClass('long_button_u');

	$.ajax({
		type: 'POST',
		url: $(submitForm).attr('action'),
		data: $(submitForm).serialize(),
		timeout: 30000,
		success: function(response){
			var response = response || '';
			// <input type="hidden" name="org.apache.struts.taglib.html.TOKEN" value="98ae94ddfede3d069fddb9225e9f558d">
			var token = /<input.*?name="org\.apache\.struts\.taglib\.html\.TOKEN" value="([^"]+)">/g.exec(response);
			var errorMsg = /var\s+message\s*=\s*"([^"]+)"/g.exec(response);
			var msg = errorMsg && errorMsg[1] ? errorMsg[1] : '';
			var retry = false;

			if (token && token[1]) {
				$('input[name="org.apache.struts.taglib.html.TOKEN"]').val(token[1]);
			}

			if (stopOrder) return;

			if (msg.indexOf('当前访问用户过多') > -1) {
				retry = true;
			} else if (!msg) {
				if (response.lastIndexOf('id="epayForm"') > -1) { // 返回信息中含有支付表单,则表示订票成功
					$('body').html(response);
					$('body')[0].dispatchEvent(orderSuccessEvent);
					// http://hi.baidu.com/lmcbbat/blog/item/5d40c473fb3a19138601b0c8.html
					// 写完内容后,必须关闭输出流,否则,将无法显示表单,某些脚本也无法执行
					//document.write(response);
					//document.close();
				} else {
					retry = true;
				}
			}

			if (retry) {
				reorder();
			} else if (msg) { // 显示错误信息,并通过点击切换按钮状态
				console.log('order error message: ', msg);
				showMessage(msg);
				if (msg.indexOf('验证码') > -1) {
					$('#img_rrand_code').click();
					$('#rand').attr('value', '').focus();
				}
				$(".tj_btn button:last-child").click();
			}
		},
		error: function(response){
			reorder();
		}
	});
}
