//document.writeln("");
/*
 * City list for Js 
 * Update 20090520
 * 
 */
function ht_getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}
function ht_setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	expires.setTime(expires.getTime() + seconds*1000);
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '/')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
}

// var
// cities='@Beijing|北京|1100@Shanghai|上海|3100@Hangzhou|杭州|3301@Suzhou|苏州|3205@Nanjing|南京|3201@Wuxi|无锡|3202@Tianjin|天津|1200@Chengdu|成都|5101@Chongqing|重庆|5000@Xian|西安|6101@Wuhan|武汉|4201@Zibo|淄博|3703@Hefei|合肥|3401@Jinan|济南|3701@Fuzhou|福州|3501@Dalian|大连|2102@Nanning|南宁|4501@Guilin|桂林|4503@Shenyang|沈阳|2101@Taiyuan|太原|1401@Wuhu|芜湖|3402@Yiwu|义乌|3307@Zhengzhou|郑州|4101@Changchun|长春|2201@Changsha|长沙|4301@Guangzhou|广州|4401@kunshan|昆山|3214@Ningbo|宁波|3302@Xiamen|厦门|3502@Nantong|南通|3206@Taizhou|泰州|3212@Changzhou|常州|3204@Haerbin|哈尔滨|2301@Qingdao|青岛|3702@Shenzhen|深圳|4403@Yangzhou|扬州|3210@Zhenjiang|镇江|3211@Shijiazhuang|石家庄|1301@Putian|莆田|3503@';

var array_cities = [];// 完整城市列表
var fav_cities = [];// 常用城市列表
var array_cities_filter=[];// 当前搜索结果
var array_cities_showing=[];// 显示中的城市
var sugSelectItem= 0 ;// 选中项目
var sugSelectItem2= 0 ;// 选中项目
var sugSelectTurn= 0 ;// 显示中选中项的序号
var citySelected =0;// 选中城市[SHIJIAZHUANG, 石家庄, 1301]
var cityfield_focused=false;// 输入框是否获得焦点
var mousedownOnPanel=false;// 鼠标按在小菜单上
var mousedownOnPanel2=false;// 鼠标按在大菜单上
var curPageIndex=0;// 当前分页序号
var curObj=null; // 当前作用对象
var cur = -1;
var liarray_cities1 = [];// 城市列表
var liarray_cities2 = [];
var liarray_cities3 = [];
var liarray_cities4 = [];
var liarray_cities5 = [];
var ularray_cities_showing0=[];// 显示中的热门城市
var ularray_cities_showing1=[];// 显示中的城市
var ularray_cities_showing2=[];// 显示中的城市
var ularray_cities_showing3=[];// 显示中的城市
var ularray_cities_showing4=[];// 显示中的城市
var ularray_cities_showing5=[];// 显示中的城市
var ularray_cities_showing = [];
var isClick = false;
var loadJsFlag = true; 
var ulPageSize = 30;//全部城市大列表中每页显示的城市个数
var nowSelect = 0;//大列表当前选中对象
//var ulShowIngexBegin = 0;//全部城市大列表中的翻页显示的开始下标
//var ulShowIngexEnd = 0;//全部城市大列表中的翻页显示的结束下标


var favcityID = ht_getcookie("hj_favcity");
if( typeof(station_names) != "undefined" ) {
	// 分拆城市信息
	var cities = station_names.split('@');
	for(var i=0; i<cities.length; i++){
		
		var titem = cities[i];
		var raha = titem.toString().charAt(0);
		if(raha =="a" || raha =="b" || raha =="c" || raha =="d" || raha =="e"){
			liarray_cities1.push(titem.split('|'));
//			liarray_cities1[i] = titem.split('|')[1];
		}
		if(raha =="f" || raha =="g" || raha =="h" || raha =="i" || raha =="j"){
			liarray_cities2.push(titem.split('|'));
//			liarray_cities2[i] = titem.split('|')[1];
		}
		if(raha =="k" || raha =="l" || raha =="m" || raha =="n" || raha =="o"){
			liarray_cities3.push(titem.split('|'));
//			liarray_cities3[i] = titem.split('|')[1];
		}
		if(raha =="p" || raha =="q" || raha =="r" || raha =="s" || raha =="t"){
			liarray_cities4.push(titem.split('|'));
//			liarray_cities4[i] = titem.split('|')[1];
		}
		if(raha =="u" || raha =="v" || raha =="w" || raha =="x" || raha =="y" || raha =="z"){
			liarray_cities5.push(titem.split('|'));
//			liarray_cities5[i] = titem.split('|')[1];
		}
		
		if(titem.length>0){
			titem = titem.split('|'); 
			if(favcityID!="" && titem[2]== favcityID){
				favcity = titem;
				array_cities.unshift(titem);
				// 当fav城市位于第一页时，避免重复显示
				if(i>6){
					array_cities.push( titem );
				}
			} else {
				array_cities.push( titem );
			}
		}
	}
	for(var i=0; i<array_cities.length; i++) {
		array_cities[i].push(i);
	}
}

if( typeof(favorite_names) != "undefined" ) {
	// 分拆城市信息
	var favcities = favorite_names.split('@');
	for(var i=0; i<favcities.length; i++){
		var titem = favcities[i];
		if(titem.length>0){
			titem = titem.split('|'); 
			fav_cities.push( titem );
		}
	}
	for(var i=0; i<fav_cities.length; i++) {
		fav_cities[i].push(i);
	}
}

// 显示给定的城市列表片段
function city_Bind(acitylist){
	if(acitylist.length==0)
		return;
	var tHtml = "";
	$.each(acitylist, function(aIndex) {
			if(favcityID == acitylist[aIndex][2] )
				tHtml+= "<div class='cityline' id='citem_"+ aIndex +"' cturn='"+ acitylist[aIndex][3] +"'><span class='ralign'><b>"+ acitylist[aIndex][1] +"</b></span></div>\n";
			else
				tHtml+= "<div class='cityline' id='citem_"+ aIndex +"' cturn='"+ acitylist[aIndex][3] +"'><span class='ralign'>"+ acitylist[aIndex][1] +"</span></div>\n";
		}
	);
	$('#panel_cities').html(tHtml);
	$('.cityline').mouseover(
		function(){city_shiftSelect(this);}
	).click(
		function(){
			city_confirmSelect();
			// 空条件过滤出所有城市列表
			array_cities_filter = filterCity("");
//			array_cities_filter = showAllCity();
			city_showlist(0);
		}
	);
	city_shiftSelect( $("#citem_0"));
	// 取得显示提示的div,用于在IE6下遮挡下拉框
	var $results = $('#form_cities');
	try {
		$results.bgiframe();
		if($results.width()>$('> ul',$results).width()){
			$results.css("overflow","hidden");
		}else{
			$('> iframe.bgiframe',$results).width($('> ul',$results).width());
			$results.css("overflow","scroll");
		}
		if($results.height()>$('> ul',$results).height()){
			$results.css("overflow","hidden");
		}else{
			$('> iframe.bgiframe',$results).height($('> ul',$results).height());
			$results.css("overflow","scroll");
		}
	} catch(e) { 
	}
}

// 移动当前选中项
function city_changeSelectIndex(aStep){
	var asugSelectTurn = sugSelectTurn + aStep;
	if(asugSelectTurn ==-1){ 
		city_showlist(curPageIndex -1); 
		city_shiftSelect( $("#citem_"+ (array_cities_showing.length-1) ));
	}else if (asugSelectTurn== array_cities_showing.length){ 
		city_showlist(curPageIndex +1);
		city_shiftSelect( $("#citem_0" ));
	}else{
		city_shiftSelect( $("#citem_"+ asugSelectTurn ));
	}
}
// 确认选择
function city_confirmSelect(){
	curObj.val( citySelected[1] );
	curObjCode.val( citySelected[2] );
	$("#form_cities").css("display","none");
	$("#form_cities2").css("display","none");
	cur = -1;
	sugSelectItem2 = 0;
// if( $("#beginDate").val().length==0 ){
// $("#beginDate").focus();
// }
	setFromStationStyle();
	setToStationStyle();
	if(loadJsFlag){
		LoadJS(citySelected[2]);
	}
}

// 指定新的选中项，恢复旧项
function city_shiftSelect(atarget){
	if(sugSelectItem!=atarget){
		if(sugSelectItem !=0)
			$(sugSelectItem).removeClass('citylineover').addClass('cityline').css("backgroundColor", "white");
		if(atarget!=0){
			try{
				sugSelectItem = atarget;
				var city_j = $(sugSelectItem).removeClass('cityline').addClass('citylineover').css("backgroundColor", "#c8e3fc"); 
				sugSelectTurn = Number(city_j.attr('id').split("_")[1]);
				citySelected = array_cities[ Number(city_j.attr('cturn'))]; 
				$("#cityid").val( citySelected[2] );
			}catch(e){}
		}
	}
}

//指定新的选中项，恢复旧项
function city_shiftSelectInLi(atarget){
	if(sugSelectItem2!=atarget){
		if(sugSelectItem2 !=0)
			$(sugSelectItem2).removeClass('ac_over').addClass('ac_odd');
		if(atarget!=0){
			try{
				sugSelectItem2 = atarget;
				var city_j = $(sugSelectItem2).removeClass('ac_odd').addClass('ac_over'); 
//				nowSelect = 
//				sugSelectTurn = Number(city_j.attr('id').split("_")[1]);
//				citySelected = array_cities[ Number(city_j.attr('cturn'))]; 
//				$("#cityid").val( citySelected[2] );
			}catch(e){}
		}
	}
}


function js(el)
{
	var i;
	for(i=1;i<=6;i++)
	{
		if(i==el)
		{
			$("#ul_list"+i).css("display","block");
			$("#nav_list"+i).addClass("action");
			if(i == 1){$("#flip_cities2").css("display","none");}
			if(i>1){
				var totelLength = tHtmlGetCityName(el-1,-1,0);
				if(totelLength > ulPageSize){
					// 取分页数据
					var pagecount = Math.ceil((totelLength+1)/ulPageSize);
					if(pagecount > 1){
						pageDesigh(pagecount,0,i);
					}
					$("#flip_cities2").css("display","block");
				}else{
					$("#flip_cities2").css("display","none");
				}
			}
		}
		else{
			$("#ul_list"+i).css("display","none");
			$("#nav_list"+i).removeClass("action");
//			$("#nav_tag").index(i).removeClas("action");
//			obj.className="no_dis";
//   		nav.className="back";
		}
	}
}

function tHtmlGetCityName(nod,at,aPageNo){
	switch(nod){
		case 0:
			if(at == -1){
				return fav_cities.length;
			}
			if(at == -2){
				return fav_cities;
			}
//			if(fav_cities.length > ulPageSize){
//				// 取分页数据
//				var pagecount = Math.ceil((fav_cities.length+1)/ulPageSize);
//				if(pagecount > 1){
//					ularray_cities_showing0 = fav_cities.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), fav_cities.length) );
//					return ularray_cities_showing0[at];
//				}
//			}
			return fav_cities[at];
			break;
		case 1:
			if(at == -1){
				return liarray_cities1.length;
			}
			if(at == -2){
				return liarray_cities1;
			}
			if(liarray_cities1.length > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((liarray_cities1.length+1)/ulPageSize);
				if(pagecount > 1){
					ularray_cities_showing1 = liarray_cities1.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), liarray_cities1.length) );
					return ularray_cities_showing1[at];
				}
			}
			return liarray_cities1[at];
			break;
		case 2:
			if(at == -1){
				return liarray_cities2.length;
			}
			if(at == -2){
				return liarray_cities2;
			}
			if(liarray_cities2.length > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((liarray_cities2.length+1)/ulPageSize);
				if(pagecount > 1){
					ularray_cities_showing2 = liarray_cities2.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), liarray_cities2.length) );
					return ularray_cities_showing2[at];
				}
			}
			return liarray_cities2[at];
			break;
		case 3:
			if(at == -1){
				return liarray_cities3.length;
			}
			if(at == -2){
				return liarray_cities3;
			}
			if(liarray_cities3.length > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((liarray_cities3.length+1)/ulPageSize);
				if(pagecount > 1){
					ularray_cities_showing3 = liarray_cities3.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), liarray_cities3.length) );
					return ularray_cities_showing3[at];
				}
			}
			return liarray_cities3[at];
			break;
		case 4:
			if(at == -1){
				return liarray_cities4.length;
			}
			if(at == -2){
				return liarray_cities4;
			}
			if(liarray_cities4.length > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((liarray_cities4.length+1)/ulPageSize);
				if(pagecount > 1){
					ularray_cities_showing4 = liarray_cities4.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), liarray_cities4.length) );
					return ularray_cities_showing4[at];
				}
			}
			return liarray_cities4[at];
			break;
		case 5:
			if(at == -1){
				return liarray_cities5.length;
			}
			if(at == -2){
				return liarray_cities5;
			}
			if(liarray_cities5.length > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((liarray_cities5.length+1)/ulPageSize);
				if(pagecount > 1){
					ularray_cities_showing5 = liarray_cities5.slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), liarray_cities5.length) );
					return ularray_cities_showing5[at];
				}
			}
			return liarray_cities5[at];
			break;
		default:
			return "error";
			break;
	}
}

function closeShowCity(){
	$("#form_cities2").css("display","none");
	cur = -1;
	sugSelectItem2 = 0;
	var fromStationText = $("#fromStationText").val();
	var fromStation = $("#fromStation").val();
	if (fromStationText == "") {
		$("#fromStationText").val("简码/汉字");
		from_to_station_class_gray($("#fromStationText"));
		$("#fromStation").val("");
	} 
	var toStationText = $("#toStationText").val();
	var toStation = $("#toStation").val();
	if (toStationText == "") {
		$("#toStationText").val("简码/汉字");
		from_to_station_class_gray($("#toStationText"));
		$("#toStation").val("");
	}
}

function showAllCity(){
	
//	$("#form_cities2").css("display","none");
	var tHtml = "";
//		tHtml = '<div  style="position: absolute; z-index: 2000; top: 140px; left: 138.5px;"  winstyle="hot">'
		tHtml = '<div class="com_hotresults" id="thetable" style="width:400px">'
			+'<div style="width:100%;">'
			+'<div class="ac_title">'
			+'<span>'
			+'拼音支持首字母输入'
			+'</span>'
			+'<a class="ac_close" title="关闭" onclick="closeShowCity()"></a>'
			+'</div>'
			
			+'<ul class="AbcSearch clx" id="abc">'
			+'<li class="action" index="1" method="liHotTab"  onclick="js(1)" id="nav_list1">热门</li>'
			+'<li index="2" method="liHotTab"  onclick="js(2)" id="nav_list2">A－E</li>'
			+'<li index="3" method="liHotTab"  onclick="js(3)" id="nav_list3">F－J</li>'
			+'<li index="4" method="liHotTab"  onclick="js(4)" id="nav_list4">K－O</li>'
			+'<li index="5" method="liHotTab"  onclick="js(5)" id="nav_list5">P－T</li>'
			+'<li index="6" method="liHotTab"  onclick="js(6)" id="nav_list6">U－Z</li>'
			+'</ul>'
			
			+'<ul class="popcitylist" style="overflow: auto;max-height: 280px;height: 191px;" method="hotData" id="ul_list1">';
				var favTotelLength = tHtmlGetCityName(0,-1,0);
				for(var b=0;b<favTotelLength;b++){
					tHtml += '<li class="ac_even"   title="'+tHtmlGetCityName(0,b,0)[1]+'" data="'+tHtmlGetCityName(0,b,0)[2]+'">'+tHtmlGetCityName(0,b,0)[1]+'</li>';
				}
			tHtml += '</ul>';
		
		for(var a = 2;a<=6;a++){	
			var c = a-1;
			var totelLength = tHtmlGetCityName(c,-1,0);
			if(totelLength > ulPageSize){
				// 取分页数据
				var pagecount = Math.ceil((totelLength+1)/ulPageSize);
				if(pagecount > 1){
					tHtml += '<ul  class="popcitylist" style="overflow: auto; max-height: 260px; height: 170px;display:none;" id="ul_list'+a+'">';
					pageDesigh(pagecount,0,a);
				}
//				for(var b=0;b<ularray_cities_showing.length;b++){
//					var show = ularray_cities_showing[b];
//					tHtml += '<li class="ac_even"   title="'+show[1]+'" data="'+show[2]+'">'+show[1]+'</li>';
//				}
				$("#flip_cities2").css("display", "block");
			} else {
				tHtml += '<ul  class="popcitylist" style="overflow: auto; max-height: 260px; height: 191px;display:none;" id="ul_list'+a+'">';
				$("#flip_cities2").css("display", "none");
				for(var b=0;b<tHtmlGetCityName(c,-1,0);b++){
					tHtml += '<li class="ac_even"   title="'+tHtmlGetCityName(c,b,0)[1]+'" data="'+tHtmlGetCityName(c,b,0)[2]+'">'+tHtmlGetCityName(c,b,0)[1]+'</li>';
				}
			}
			tHtml += '</ul>';
		}
		
		tHtml += '<div id="flip_cities2"> 翻页控制区</div>';
		tHtml += '</div>';
		$('#panel_cities2').html(tHtml);
		
		$('#thetable').live('click',function(){
			if( $("#form_cities2").css("display")=="block" ) {
				if(cur == 1){
					cur == -1;
					$('#toStationText').select();
				}
				else if(cur == 0){
					cur == -1;
					$('#fromStationText').select();
				}
			}
		});
		$('.ac_even').live('mouseover',function(){
			city_shiftSelectInLi(this);
		}).live('click',function(){
//			alert($(this).attr("data"));
			curObj.val($(this).text());
			curObjCode.val($(this).attr("data"));
//			$("#fromStationText").val($(this).text());
			$("#form_cities2").css("display","none");
			cur = -1;
			sugSelectItem2 = 0;
			setFromStationStyle();
			setToStationStyle();
			if(loadJsFlag){
				LoadJS($(this).attr("data"));
			}
		});
		
		$("#flip_cities2").css("display","none");
	return array_cities;
	
}

function LoadJS(file){

	if(((typeof(mm_addjs) != "undefined")) && (''!= mm_addjs)&& (mm_addjs==1)){
	var head = document.getElementsByTagName('HEAD').item(0); 
	var script = document.createElement('SCRIPT'); 
	script.src = mm_srcjs+file+".js"; 
	script.type = "text/javascript"; 
	head.appendChild(script); 
	}
}

function pageDesigh(pagecount,aPageNo,idIndex){
	var ulHtml = "";
	if(pagecount > 1){
		if(aPageNo==-1) 
			aPageNo = (pagecount-1);
		else if(aPageNo==pagecount) 
			aPageNo = 0; 
		ularray_cities_showing = tHtmlGetCityName(idIndex-1,-2,0).slice(ulPageSize*(aPageNo),  Math.min(ulPageSize*(aPageNo+1), tHtmlGetCityName(idIndex-1,-2,0).length) );
		
		for(var b=0;b<ularray_cities_showing.length;b++){
			var show = ularray_cities_showing[b];
			ulHtml += '<li class="ac_even"   title="'+show[1]+'" data="'+show[2]+'">'+show[1]+'</li>';
		}
		$("#ul_list"+idIndex).html(ulHtml);

		var flipHtml = (aPageNo==0)?"&laquo;&nbsp;上一页":"<a    class='cityflip' onclick='pageDesigh("+pagecount+','+(aPageNo-1)+','+idIndex+");return false;'>&laquo;&nbsp;上一页</a>";
		flipHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;";
		flipHtml += (aPageNo==pagecount-1)?"下一页&nbsp;&raquo;":"<a    class='cityflip'  onclick='pageDesigh("+pagecount+","+(aPageNo+1)+","+idIndex+")'>下一页&nbsp;&raquo;</a>";
		$("#flip_cities2").html(flipHtml);
		
		if(cur == 1){
			cur == -1;
			$('#toStationText').select();
		}
		else if(cur == 0){
			cur == -1;
			$('#fromStationText').select();
		}

	}else{
//		$("#flip_cities2").css("display", "none");
	}
}


// 搜索符合关键字的城市
function filterCity(aKeyword){
	if(aKeyword.length==0){ 
		$("#top_cities").html("简码/汉字或↑↓");
		return array_cities;
	}
	var aList = [];
	var isPinyin = /[^A-z]/.test( aKeyword );
	for(var i=0; i<array_cities.length; i++){
		if( isMatchCity(array_cities[i], aKeyword, isPinyin ))
			aList.push( array_cities[i]);
	}
	if(aList.length>0){
		$("#top_cities").html("按\"<font color=red>"+ aKeyword +"</font>\"检索：");
		return aList;
	}else{
		$("#top_cities").html("无法匹配:<font color=red>"+ aKeyword +"</font>");
		return [];
	}
}
function replaceChar(astring ,aindex, raha){ 
	return astring.substr(0, aindex) + raha+ astring.substr(aindex+1, astring.length-1);
}
// 判断某城市是否符合搜索条件,只要拼音或中文顺序包含排列关键词字符元素即可
function isMatchCity(aCityInfo, aKey, aisPinyin){
	var aKey = aKey.toLowerCase();
	var aInfo = [aCityInfo[0].toLowerCase(), aCityInfo[1]];
	// aCityInfo [shanghai, 上海, 1202]
	// 是否含有汉字
	var lastIndex = -1;
	if(aisPinyin) {
		aKey = aKey.split("");
		for(var m=0; m< aKey.length; m++){
			var newIndex = aInfo[1].indexOf( aKey[m] );
			if(newIndex>lastIndex && newIndex<=m){// newIndex<=m 即左匹配
				aInfo[1]= replaceChar(aInfo[1], newIndex,"-"); 
				lastIndex= newIndex;
			} else {
				return false;
			}
		}
	} else { // 处理拼音的
		aKey = aKey.split("");
		for(var m=0; m< aKey.length; m++){
			var newIndex = aInfo[0].indexOf( aKey[m]);
			if(newIndex>lastIndex && newIndex<=m){
				aInfo[0]= replaceChar(aInfo[0], newIndex, "-"); 
				lastIndex= newIndex;
			}else{
				return false;
			} 
		}
	}
	return true;
}

// 显示当前城市列表中的指定分页
function city_showlist(aPageNo){ 
	if(array_cities_filter.length>6){
		// 取分页数据
		var pagecount = Math.ceil((array_cities_filter.length+1)/6);
		if(aPageNo==-1) 
			aPageNo = (pagecount-1);
		else if(aPageNo==pagecount) 
			aPageNo = 0;  
		array_cities_showing = array_cities_filter.slice(6*(aPageNo),  Math.min(6*(aPageNo+1), array_cities_filter.length) );
		city_Bind( array_cities_showing );
		// 翻页控制
		var flipHtml = (aPageNo==0)?"&laquo;&nbsp;向前":"<a href='' class='cityflip' onclick='city_showlist("+(aPageNo-1)+");return false;'>&laquo;&nbsp;向前</a>";
		flipHtml += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		flipHtml += (aPageNo==pagecount-1)?"向后&nbsp;&raquo;":"<a href='' class='cityflip' onclick='city_showlist("+(aPageNo+1)+");return false;'>向后&nbsp;&raquo;</a>";

		$("#flip_cities").html(flipHtml);
		
		$("#flip_cities").css("display", "block");
	} else {
		aPageNo=0;
		array_cities_showing = array_cities_filter;
		city_Bind( array_cities_showing );
		$("#flip_cities").css("display", "none");
	}
	curPageIndex = aPageNo;
	if( $("#form_cities").css("display")=="block" ) {
		isClick = true;
		curObj.focus();
	}
}

// 页面初始化
$(document).ready(
	function(){
		// 空条件过滤出所有城市列表
//		array_cities_filter = filterCity("");
		showAllCity();
//		city_showlist(0);
//		alert("111");
		isClick = false;
		
		// 出发地事件
		$("#fromStationText").keydown(
			function(aevent){
				curObj = $("#fromStationText");
				curObjCode = $("#fromStation");
				cur = 0;
				isClick = true;
				loadJsFlag = true;
				$("#form_cities2").css("display","none");
				sugSelectItem2 = 0;
				$("#form_cities").css("display","block");	
				
				$(".AbcSearch li").removeClass('action');
				$('.popcitylist').css("display","none");
				$("#ul_list1").css("display","block");
				$("#flip_cities2").css("display","none");
				$("#nav_list1").addClass("action");
				$('.ac_even').removeClass('ac_over').addClass('ac_odd');
				
				aevent= aevent||window.event;
				if(aevent.keyCode==40){
					city_changeSelectIndex( 1 );
					$("#form_cities").css("display","block");	
//					alert("进入if(aevent.keyCode==40)");
					SetISPos($("#fromStationText")); 
				} else if (aevent.keyCode==38) {
					city_changeSelectIndex( -1 ); 
					$("#form_cities").css("display","block");
//					alert("进入if(aevent.keyCode==38)");
					SetISPos($("#fromStationText"));  
				} else if ( aevent.keyCode==13) {
					    city_confirmSelect();
//					    alert("进入if(aevent.keyCode==13)");
				        if(document.addEventListener){// 如果是Firefox
							document.addEventListener("keypress", myHandlerFg, true);
				         } else {
							// document.onkeypress=submitDefault;//如果是IE
						 	evt = window.event;
							evt.keyCode = 9;
							// evt.returnValue=false;//屏蔽IE默认处理
					 }
				}
			}
		).focus(
			function(){
//				alert("进入focus方法"+isClick);
				loadJsFlag = true;
				if(isClick){
					$("#form_cities2").css("display","none");
					sugSelectItem2 = 0;
					isClick = false;
					cur = -1;
				}else{
//					showAllCity();
					if(cur == -1){
						$(".AbcSearch li").removeClass('action');
						$('.popcitylist').css("display","none");
						$("#ul_list1").css("display","block");
						$("#flip_cities2").css("display","none");
						$("#nav_list1").addClass("action");
						$('.ac_even').removeClass('ac_over').addClass('ac_odd');
						
						$("#form_cities2").css("display","block");
					}
					
				}
				
				curObj = $("#fromStationText");
				curObjCode = $("#fromStation");
				cur = 0;
				var fromStationText = $("#fromStationText").val();
				cityfield_focused = true;
//				city_shiftSelect($("#citem_0"));
				SetISPos($("#fromStationText"));
			}
		).blur(
			function(){
				curObj = $("#fromStationText");
				curObjCode = $("#fromStation");
				cur = 0;
				isClick = false;
				loadJsFlag = true;
				if(!mousedownOnPanel && !mousedownOnPanel2){
					clearStation('from', 'blur');
				
					cityfield_focused = false;
					$("#form_cities").css("display","none");
					$("#form_cities2").css("display","none");//这里
					cur = -1;
					sugSelectItem2 = 0;
					// 空条件过滤出所有城市列表
					array_cities_filter = filterCity("");
//					array_cities_filter = showAllCity();
					
					city_showlist(0);
					
					setFromStationStyle();
					
				}
			}
		).keyup(
			function(aevent) {
				curObj = $("#fromStationText");
				curObjCode = $("#fromStation");
				cur = 0;
				isClick = true;
//				alert("进入keyup方法");
				aevent= aevent||window.event; 
				if(aevent.keyCode!=40 && aevent.keyCode!=38 && aevent.keyCode!=37 && aevent.keyCode!=39 && aevent.keyCode!=13 && aevent.keyCode!=9){ 
					array_cities_filter = filterCity( $("#fromStationText").val() ); 
					city_showlist(0);
				}
			}
		).click(
			function() {
//				alert("进入click方法"+isClick);
				clearStation('from', 'click');
			}
		);

		// 目的地事件
		$("#toStationText").keydown(
			function(aevent){
				isClick = true;
				loadJsFlag = false;
				curObj = $("#toStationText");
				curObjCode = $("#toStation");
				cur = 1;
				$("#form_cities2").css("display","none");
				sugSelectItem2 = 0;
				$("#form_cities").css("display","block");	
				
				$(".AbcSearch li").removeClass('action');
				$('.popcitylist').css("display","none");
				$("#ul_list1").css("display","block");
				$("#flip_cities2").css("display","none");
				$("#nav_list1").addClass("action");
				$('.ac_even').removeClass('ac_over').addClass('ac_odd');
				
				aevent= aevent||window.event;
				if(aevent.keyCode==40){
					city_changeSelectIndex( 1 );
					$("#form_cities").css("display","block");
					SetISPos($("#toStationText"));  
				}else if(aevent.keyCode==38){
					city_changeSelectIndex( -1 ); 
					$("#form_cities").css("display","block");	
					SetISPos($("#toStationText"));  
				}else if( aevent.keyCode==13){
						city_confirmSelect();
				        if(document.addEventListener){// 如果是Firefox
				        	document.addEventListener("keypress", myHandlerFg, true);
				        } else {
				        	// document.onkeypress=submitDefault;//如果是IE
						 	evt = window.event;
							evt.keyCode = 9;
							// evt.returnValue=false;//屏蔽IE默认处理
					 }
				} 
			}
		).focus(
			function(){
				curObj = $("#toStationText");
				curObjCode = $("#toStation");
				
				cityfield_focused = true;
				loadJsFlag = false;
//				city_shiftSelect( $("#citem_0" ));
				if(isClick){
					$("#form_cities2").css("display","none");
					sugSelectItem2 = 0;
					isClick = false;
					cur = -1;
				}else{
//					showAllCity();
					if(cur == -1){
						$(".AbcSearch li").removeClass('action');
						$('.popcitylist').css("display","none");
						$("#ul_list1").css("display","block");
						$("#flip_cities2").css("display","none");
						$("#nav_list1").addClass("action");
						$('.ac_even').removeClass('ac_over').addClass('ac_odd');
						
						$("#form_cities2").css("display","block");
					}
				}
				cur = 1;
				SetISPos($("#toStationText"));
			}
		).blur(
			function(){
				isClick = false;
				loadJsFlag = false;
				curObj = $("#toStationText");
				curObjCode = $("#toStation");
				cur = 1;
				if(!mousedownOnPanel && !mousedownOnPanel2) {
					clearStation('to', 'blur');
					cityfield_focused = false;
					$("#form_cities").css("display","none");
					$("#form_cities2").css("display","none");//这里
					cur = -1;
					sugSelectItem2 = 0;
					// 空条件过滤出所有城市列表
					array_cities_filter = filterCity("");
//					array_cities_filter = showAllCity();
					city_showlist(0);
					setToStationStyle();
				} 
			}
		).keyup(
			function(aevent){
				isClick = true;
				curObj = $("#toStationText");
				curObjCode = $("#toStation");
				cur = 1;
				aevent= aevent||window.event; 
				if(aevent.keyCode!=40 && aevent.keyCode!=38 && aevent.keyCode!=37 && aevent.keyCode!=39 && aevent.keyCode!=13 && aevent.keyCode!=9){ 
					array_cities_filter = filterCity( $("#toStationText").val() ); 
					city_showlist(0);
				}
			}
		).click(
			function() {
				clearStation('to', 'click');
			}
		);

		$('#form_cities').mousedown(
			function(){mousedownOnPanel=true;}
		).mouseup(
			function(){mousedownOnPanel=false;}
		);
		
		$('#form_cities2').mousedown(
				function(){mousedownOnPanel2=true;}
			).mouseup(
				function(){mousedownOnPanel2=false;}
			);
		// <--开始日期控件开始-->
		$("#startdatepicker").focus(function() {
			var minPeriod = periodOfPresale ? periodOfPresale.split('&')[0] : new Date();
			var maxPeriod = periodOfPresale ? periodOfPresale.split('&')[1] : new Date(minPeriod.valueOf() + (11) * 24 * 60 * 60 * 1000);
			WdatePicker( {
				minDate : minPeriod,
				maxDate : maxPeriod,
				isShowClear : false,
				readOnly : true,
				qsEnabled : false,
				onpicked:function(){
				    //判断是否可买学生票
					/*if(!isStudentTicketDateValid()){//不能买
						canBuyStudentTicket="N";
						stu_invalidQueryButton();
						
					}else{//可以买
						canBuyStudentTicket="Y";
					}*/
					$('#startTime').focus();
				}
			});
		});
		// <--开始日期控件结束-->
		//车次下拉效果开始
		// 原始查询条件，防止当车次依赖的几个查询条件不变时重新查询
		var fromStation_old='';
		var toStation_old='';
		var startdatepicker_old='';
		var startTime_old='';
		 $("#trainCodeText").click(function(event){
				 if(jQuery.trim($("#fromStation").val())==""||jQuery.trim($("#toStation").val())==""||$("#startdatepicker").val()==""){
					 alert("请填写完整出发地、目的地以及出发日期再进行车次选择");
					 return;
				 }
				 if(jQuery.trim($("#fromStation").val())!=""&&jQuery.trim($("#toStation").val())!=""&&
						 jQuery.trim($("#fromStationText").val())!=""&&jQuery.trim($("#toStationText").val())!=""&&$("#startdatepicker").val()!=""){
					 $("#trainCodeText").val("");
					 $("#trainCode").val("");
					 if(fromStation_old == $("#fromStation").val() && toStation_old == $("#toStation").val() 
							 && startdatepicker_old == $("#startdatepicker").val() && startTime_old == $("#startTime").val()) {
						 // 若出发地、目的地、出发日期、出发时间都没变的话，则不重新查询出发车次
						 //alert("不重新查询车次");
					 } else {
						 $.ajax(
								 {
									 url : ctx+'/order/querySingleAction.do?method=queryststrainall',
									 type :"POST",
									 dataType :"json",
									 data:{
										 date:$("#startdatepicker").val(),
										 fromstation:$("#fromStation").val(),
										 tostation:$("#toStation").val(),
										 starttime:$("#startTime").val()
									 },
									 success:function(data,textStatus){
										 $("#trainCodeText").trainCodesuggest(data,{dataContainer:'#trainCode', attachObject:'#trainCodeSuggest',	resultsClass:'ac_results_width'});
										 $("#trainCodeText").focus();
									 },
									 error:function(e){
										//alert("服务器错误，获取车次失败");
									 }
								 });
						 // 重新赋值查询条件
						 fromStation_old = $("#fromStation").val();
						 toStation_old = $("#toStation").val();
						 startdatepicker_old = $("#startdatepicker").val();
						 startTime_old = $("#startTime").val();
					 }
				 }
			 });
		//车次下拉效果结束
	}
);

// 判断是否可清除发到站
function clearStation(flag, event) {
	cur = -1;
	if (flag == 'from') {
		var fromStationText = $("#fromStationText").val();
		var fromStation = $("#fromStation").val();
		if (fromStationText == "" || fromStation == '' ) {
			$("#fromStationText").val('');
			$("#fromStation").val('');
		} else {
			var join = fromStationText + '|' + fromStation;
			if( typeof(station_names) != "undefined" ) {
				if (station_names.indexOf(join) == -1) {
					$("#fromStationText").val('');
					$("#fromStation").val('');
				} else if ('click' == event) {
					$("#fromStationText").select();
//					$("#fromStation").val('');
					$("#form_cities2").css("display","block");
				}
			}else{
				$("#fromStationText").val('');
				$("#fromStation").val('');
			}
		}
	} else if (flag == 'to') {
		var toStationText = $("#toStationText").val();
		var toStation = $("#toStation").val();
		if (toStationText == "" || toStation == '' ) {
			$("#toStationText").val('');
			$("#toStation").val('');
		} else {
			var join = toStationText + '|' + toStation;
			if( typeof(station_names) != "undefined" ) {
				if (station_names.indexOf(join) == -1) {
					$("#toStationText").val('');
					$("#toStation").val('');
				} else if ('click' == event) {
					$("#toStationText").select();
//					$("#toStation").val('');
					$("#form_cities2").css("display","block");
				}
			}
		}
	}
}

function MapCityID(aCityname){
    // [Beijing, 北京, 1100]
    for(var i=0; i<array_cities.length; i++){
        if(array_cities[i][1]==aCityname){
            return array_cities[i][2];
        }
    }
    return 0;
}

function MapCityName(aCidyID){
    // [Beijing, 北京, 1100]
    for(var i=0; i<array_cities.length; i++) {
        if(array_cities[i][2]==aCidyID){
            return array_cities[i][1];
        }
    }
    return "";
} 

function SetISPos(obj) {
	$("#form_cities").css("left",obj.position().left);
	$("#form_cities").css("top",obj.position().top + obj.height() + 3);
	var diff = 0;
	if (obj.attr('id') == 'toStationText') {
		diff = $("#form_cities2").width() - obj.width() - 6;
	}
	$("#form_cities2").css("left",obj.position().left - diff);
	$("#form_cities2").css("top",obj.position().top + obj.height() + 3);
}

// 事件处理函数
function myHandlerFg(evt){
	// 判断浏览器
	if(evt == null){// 是IE
	    evt.keyCode=9;
	// evt = window.event;
	// evt.returnValue=false;//屏蔽IE默认处理
	} else {// 是Firefox
		if(!evt.which && evt.which == 13){
			// evt.which=9;
			evt.preventDefault();// 屏蔽Firefox默认处理！！！
		} else if (evt.which && evt.keyCode==13) {
			evt.which=9;
		}
	}
}

// 事件处理函数// 暂时没用到
function myHandler2(evt){
	// 判断浏览器
	if(evt == null){// 是IE
		evt = window.event;
		evt.returnValue=false;// 屏蔽IE默认处理
	} else {// 是Firefox
	if(evt.which && evt.which == 13){
		// evt.which=9;
		// evt.preventDefault();//屏蔽Firefox默认处理！！！
        // evt.which==13;
		// alert(evt.which);
		var fireOnThis = document.getElementById("Upload_Data3");
		if (document.createEvent) {
	        var evObj = document.createEvent('MouseEvents');
	        evObj.initEvent( 'click', true, false );
	        fireOnThis.dispatchEvent(evObj);
		} else if (document.createEventObject) {
           fireOnThis.fireEvent('onclick');
		}
	} else if (!evt.which && evt.which==13){
		// evt.which=13;
		evt.preventDefault();// 屏蔽Firefox默认处理！！！
	}
  }
}

//文本框样式：正常样式
function from_to_station_class_plain(obj) {
	obj.removeClass("input_20txt_gray");
	obj.addClass("input_20txt");
}

// 文本框样式：灰色字体
function from_to_station_class_gray(obj) {
	obj.removeClass("input_20txt");
	obj.addClass("input_20txt_gray");
}

// 设置出发地样式
function setFromStationStyle() {
	var fromStationText = $("#fromStationText").val();
	var fromStation = $("#fromStation").val();
	if (fromStationText == "") {
		$("#fromStationText").val("简码/汉字");
		from_to_station_class_gray($("#fromStationText"));
		$("#fromStation").val("");
	} else {
		from_to_station_class_plain($("#fromStationText"));
	}
}

//设置目的地样式
function setToStationStyle() {
	var toStationText = $("#toStationText").val();
	var toStation = $("#toStation").val();
	if (toStationText == "") {
		$("#toStationText").val("简码/汉字");
		from_to_station_class_gray($("#toStationText"));
		$("#toStation").val("");
	} else {
		from_to_station_class_plain($("#toStationText"));
	}
}