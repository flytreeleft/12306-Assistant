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

// 查询过程的设置
var queryCount = 1;
var hasTicket = false;
var ticketType = [];

var bookTicketEvent = document.createEvent('Event');
var messageEvent = document.createEvent('Event');
var hasTicketEvent = document.createEvent('Event');

bookTicketEvent.initEvent('bookTicket', true, true);
messageEvent.initEvent('message', true, true);
hasTicketEvent.initEvent('hasTicket', true, true);

function showMessage(msg) {
	//alert(msg);
	$('body').attr('message', msg || '')[0].dispatchEvent(messageEvent);
}

function doQuery() {
	showMessage('第 '+(queryCount++)+' 次查询...');
	sendQueryFunc();
}

//The table for displaying tickets
var tbl = $('.obj')[0];
tbl.addEventListener('DOMNodeInserted', function() {
	if(checkTickets(event.target)) {
		hasTicket = true;
		$(event.target).css('background-color', 'red');
	}
}, true);

var checkTickets = function(row) {
	var hasTicket = false;
	var canBook = true;

	$('td input[type=button]', row).each(function(i, e) {
		if(e.classList.contains('yuding_x')) {
			canBook = false;
		} else { // 重新绑定预订按钮事件
			var clickStr = $(e).attr('onclick');
			var order = /javascript:getSelected\('([^']+)'\)/g.exec(clickStr);

			$(e).unbind('click').removeAttr('onclick').click(function(event) {
				if (order && order[1]) {
					if (!checkBeyondMixTicketNum()) {
						$(this).attr('disabled', true).addClass('yuding_x');
						$('body')[0].dispatchEvent(bookTicketEvent);
						book(order[1].split('#'));
					}
				}
			});
		}
	});
	if(!canBook) return false;

	$('td', row).each(function(i, e) {
		if(ticketType[i-1]) {
			var info = e.innerText.trim();
			if(info != '--' && info != '无') {
				hasTicket = true;
				$(e).css('background-color', 'blue');
			}
		}
	});
	return hasTicket;
}

//Ticket type selector & UI
$('.hdr tr:eq(2) td').each(function(i,e) {
	ticketType.push(false);
	if(i<3) return;
	ticketType[i] = true;

	var c = $('<input/>').attr('type', 'checkBox').attr('checked', 'true');
	c[0].ticketTypeId = i;
	c.change(function() {
		ticketType[this.ticketTypeId] = this.checked;
	}).appendTo(e);
});

//hack into the validQueryButton function to detect query
var _validQueryButton = validQueryButton; // 必须被重载!
validQueryButton = function() {
	_validQueryButton();
	if(!hasTicket) doQuery();
}
// 由于原页面对查询按钮进行了多次重复绑定,故将该点击事件进行重载
// 并对首次点击事件进行重新绑定
sendQueryFunc = function() {
	var _id=$(this).attr("id");
	if(_id=='stu_submitQuery'){
		clickBuyStudentTicket='Y';
	}else{
		clickBuyStudentTicket='N';
	}

	var validQuery = canquery();
	if (!validQuery) {
		return;
	}
	showMessage('正在查询,请等待...');
	hasTicket = false;

	stu_invalidQueryButton();
	invalidQueryButton();

	loadData();
	//处理发送预订请求的数据
	prepareOrderData();
};
$("#submitQuery")
		.unbind('click').removeAttr('onclick')
		.click(sendQueryFunc);
$("#stu_submitQuery")
		.unbind('click').removeAttr('onclick')
		.click(sendQueryFunc);

// 重载遮罩移除方法
function removeLoadMsg(){
	$('.datagrid-mask').remove();
	$('.datagrid-mask-msg').remove();
	if (hasTicket) {
		$('body')[0].dispatchEvent(hasTicketEvent);
	}
}

// 加载查询数据开始
function loadData() {
	var ctx = 'https://dynamic.12306.cn/otsweb';

	showLoadMsg($('#gridbox'));

	$.ajax( {
		url : ctx + '/order/querySingleAction.do?method=queryLeftTicket',
		type : 'GET',
		dataType:'text',
		data:{
			'orderRequest.train_date' : $('#startdatepicker').val(),
			'orderRequest.from_station_telecode' : $('#fromStation').val(),
			'orderRequest.to_station_telecode' : $('#toStation').val(),
			'orderRequest.train_no' : $('#trainCode').val(),
			'trainPassType' : getTrainPassType(),
			'trainClass' : getTrainClassString(),
			'includeStudent' : getIncludeStudent(),
			'seatTypeAndNum' : getSeanTypeAndNum(),
			'orderRequest.start_time_str' : $('#startTime').val()
		},
		success : function(data, textStatus) {
			if(data == '-10'){
				alert('您还没有登录或者离开页面的时间过长,请登录系统或者刷新页面');
				window.location.href = ctx + '/loginAction.do?method=init';
				return;
			}
			if(data == '-1'
				|| (data !='undefine' && data.split(',')[0]=='-2')) {
				data = '';
			} else {
				data = data.replaceAll('\\\\n', String.fromCharCode(10));
			}
			mygrid.clearAll();
			mygrid.startFastOperations();
			mygrid.parse(data,'csv');
			mygrid.stopFastOperations();
			dealwithQueryInfo(mygrid);

			removeLoadMsg();
		},
		error : function(e) {
			removeLoadMsg();
			validQueryButton();
			if(isStudentTicketDateValid()){
				stu_validQueryButton();
			}
			if(clickBuyStudentTicket=='N'){
				renameButton('research_u');
			} else {
				stu_renameButton('research_u');
			}
		}
	});
}
