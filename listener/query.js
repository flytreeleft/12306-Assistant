﻿/*
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

// 查询过程的监听设置
var queryCount = 1;
var hasTicket = false;

var hasTicketEvent = document.createEvent('Event');
var bookTicketEvent = document.createEvent('Event');

hasTicketEvent.initEvent('hasTicket', true, true);
bookTicketEvent.initEvent('bookTicket', true, true);

function doQuery() {
	$('.single_round:first').html('<span>尝试次数: '+(queryCount++)+'</span>').show();
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
					$(this).attr('disabled', true).addClass('yuding_x');
					$('#queryListener').html(order[1]);
					$('#queryListener')[0].dispatchEvent(bookTicketEvent);
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
var ticketType = new Array();
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
// 重载遮罩移除方法
function removeLoadMsg(){
	$('.datagrid-mask').remove();
	$('.datagrid-mask-msg').remove();
	if (hasTicket) {
		$('#queryListener')[0].dispatchEvent(hasTicketEvent);
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
