/*  12306 Assistant  Copyright (C) 2012 flytreeleft (flytreeleft@126.com)    THANKS:  Hidden, Jingqin Lynn, Kevintop  Includes jQuery  Copyright 2011, John Resig  Dual licensed under the MIT or GPL Version 2 licenses.  http://jquery.org/license  This program is free software: you can redistribute it and/or modify  it under the terms of the GNU General Public License as published by  the Free Software Foundation, either version 3 of the License, or  (at your option) any later version.  This program is distributed in the hope that it will be useful,  but WITHOUT ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the  GNU General Public License for more details.  You should have received a copy of the GNU General Public License  along with this program.  If not, see <http://www.gnu.org/licenses/>. */function login(user) {	$('#UserName').val(user.name || '');	$('#password').val(user.password || '');		$('body').append(		$('<script type="text/javascript" src="'+chrome.extension.getURL('./12306/login.js')+'"/>')	).append(		$('<div id="loginListener"/>').hide().bind({			'successLogin': function() {				notify('登录成功,开始查询车票吧!', 10000);			}		})	);}