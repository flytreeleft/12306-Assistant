	(function($) {
		//车次匹配
		var trainCodesuggestObject = null;
		$.trainCodesuggest = function(input,options) {
	
			var $input = $(input).attr("autocomplete", "off");
			var $results;
           // var framestr='<iframe src="" style="border:none;position:absolute; top:0px; left:0px; width:100%; height:100%; z-index:-1; filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0);"></iframe>';
			var timeout = false;		// hold timeout ID for suggestion results to appear	
			var prevLength = 0;			// last recorded length of $input.val()
			var cache = [];				// cache MRU list
			var cacheSize = 0;			// size of cache in chars (bytes?)
			
			//if($.trim($input.val())=='' || $.trim($input.val())=='请输入') $input.val('请输入').css('color','#aaa');
			if( !options.attachObject )
				options.attachObject = $(document.createElement("ul")).appendTo('body');

			$results = $(options.attachObject);
			$results.addClass(options.resultsClass);
			resetPosition();
			$(window)
				.load(resetPosition)		// just in case user is changing size of page while loading
				.resize(resetPosition);

			$(document).click(function(event) {
                if(event.target ==input){
					return ;
				}
				$results.hide();
				if($.trim($(input).val())!=""&&$.trim($(options.dataContainer).val())!=""){
				}else{
					$(input).val("");
					$(options.dataContainer).val("");
				}
			});
			
			$input.focus(function(){
				if($.trim($(this).val())=='请输入'){
					$(this).val('').css('color','#000');
				}
				if($.trim($(this).val())==''){
					displayItems('');//显示热门城市列表
				}
			});
			$input.click(function(event){
				
				var q=$.trim($(this).val());
				displayItems(q);
				//$(this).select();
			});
			$input.blur(function(){
				var q=$.trim($(this).val());
				if(q!=""){
					var reg = new RegExp('^.*' + q + '.*$', 'im');
					for (var i = 0; i < options.source.length; i++) {
						if (reg.test(options.source[i].value)) {
							$(options.dataContainer).val(options.source[i].id);
							$input.val(options.source[i].value+'（'+options.source[i].start_station_name + options.source[i].start_time+'→' + options.source[i].end_station_name + options.source[i].end_time+'）');
							break;
						}
					}
				}
			});
						

			$input.keyup(processKey);//
			
			function resetPosition() {
				// requires jquery.dimension plugin
				var offset = $input.offset();
				$results.css({
					top: (offset.top + input.offsetHeight) + 'px',
					left: offset.left + 'px'
				});
			}
			
			
			function processKey(e) {
				
				// handling up/down/escape requires results to be visible
				// handling enter/tab requires that AND a result to be selected
				if ((/27$|38$|40$/.test(e.keyCode) && $results.is(':visible')) ||
					(/^13$|^9$/.test(e.keyCode) && getCurrentResult())) {
		            
		            if (e.preventDefault)
		                e.preventDefault();
					if (e.stopPropagation)
		                e.stopPropagation();

	                e.cancelBubble = true;
	                e.returnValue = false;
				
					switch(e.keyCode) {
	
						case 38: // up
							prevResult();
							break;
				
						case 40: // down
							nextResult();
							break;
						case 13: // return
							selectCurrentResult();
							break;
							
						case 27: //	escape
							$results.hide();
							break;
	
					}
					
				} else if ($input.val().length != prevLength) {
					if (timeout) 
						clearTimeout(timeout);
					timeout = setTimeout(suggest, options.delay);
					prevLength = $input.val().length;
					
				}
			}
			
			//=================================================站名匹配
			function suggest() {
			
				var q = $.trim($input.val());
				displayItems(q);
			}
			function displayItems(items) {
				$results.empty();
				var html = '';
					for (var i = 0; i < options.source.length; i++) {//国内城市匹配
						var reg = new RegExp('^.*' + items + '.*$', 'im');
						if (reg.test(options.source[i].value)) {
							html += '<li rel="' + options.source[i].id + '"><a href="#' + i + '" >' + options.source[i].value+'（'+options.source[i].start_station_name + options.source[i].start_time+'→' + options.source[i].end_station_name + options.source[i].end_time+'）' + '</a></li>';
						}
					}
					if (html == '') {
						var reg = new RegExp('^[a-zA-Z0-9]+$');
						if(!reg.test(items)){
							suggest_tip = '<div class="gray ac_result_tip">对不起，车次只能由字母和数字组成！</div>';
						}else{
							suggest_tip = '<div class="gray ac_result_tip">对不起，找不到：' + items +'</div>';
						}
						
					}
					else {
						suggest_tip = '<div class="gray ac_result_tip"></div>';
					}
					html = suggest_tip + '<ul>' + html + '</ul>';
//				}

				$results.html(html).show();
				$results.children('ul').children('li:first-child').addClass(options.selectClass);
				
				$results.children('ul')
					.children('li')
					.mouseover(function() {
						$results.children('ul').children('li').removeClass(options.selectClass);
						$(this).addClass(options.selectClass);
					})
					.click(function(e) {
						e.preventDefault(); 
						e.stopPropagation();
						selectCurrentResult();
					});
				// help IE users if possible
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
			
			//=================================================站名匹配		
			function getCurrentResult() {
			
				if (!$results.is(':visible'))
					return false;
			
				var $currentResult = $results.children('ul').children('li.' + options.selectClass);
				if (!$currentResult.length)
					$currentResult = false;
					
				return $currentResult;

			}
			
			function selectCurrentResult() {
			
				$currentResult = getCurrentResult();
			
				if ($currentResult) {
					$input.val($currentResult.children('a').html().replace(/<span>.+?<\/span>/i,''));
					$results.hide();

					if( $(options.dataContainer)) {
						// jombo edited the text value from rel to stationTelecode
						$(options.dataContainer).val($currentResult.attr('rel'));
					}
	
					if (options.onSelect) {
						options.onSelect.apply($input[0]);
					}
				}
			
			}
			
			function nextResult() {
			
				$currentResult = getCurrentResult();
			
				if ($currentResult)
					$currentResult
						.removeClass(options.selectClass)
						.next()
							.addClass(options.selectClass);
				else
					$results.children('ul').children('li:first-child').addClass(options.selectClass);
			
			}
			
			function prevResult() {
			
				$currentResult = getCurrentResult();
			
				if ($currentResult)
					$currentResult
						.removeClass(options.selectClass)
						.prev()
							.addClass(options.selectClass);
				else
					$results.children('ul').children('li:last-child').addClass(options.selectClass);
			
			}
	
		}
		
		
		
		$.fn.trainCodesuggest = function(source, options) {
		    if(trainCodesuggestObject){
		    	trainCodesuggestObject.setData(source);
		    	return trainCodesuggestObject;
		    }
			if (!source){
				source = {};
			}
			options = options || {};
			options.source = source;
			options.hot_list=options.hot_list || [];
			options.delay = options.delay || 0;
			options.resultsClass = options.resultsClass || 'ac_results';
			options.selectClass = options.selectClass || 'ac_over';
			options.matchClass = options.matchClass || 'ac_match';
			options.minchars = options.minchars || 1;
			options.delimiter = options.delimiter || '\n';
			options.onSelect = options.onSelect || false;
			options.dataDelimiter = options.dataDelimiter || '\t';
			options.dataContainer = options.dataContainer || '#SuggestResult';
			options.attachObject = options.attachObject || null;
			this.each(function() {
				new $.trainCodesuggest(this, options);
			});
			trainCodesuggestObject = this;
			this.setData = function(data){
				options.source = data||{};
			}
			return this;
			
		};
		
	})(jQuery);
	
