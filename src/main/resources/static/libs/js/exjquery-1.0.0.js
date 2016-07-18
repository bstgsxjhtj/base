/**
 *	基于jquery的扩展方法
 */

$.extend({
	// 字符串转换为对象
	strToJson : function(str){
		str = str.replace(/&/g,"','");    
        str = str.replace(/=/g,"':'");    
        str = "({'"+str +"'})";    
        obj = eval(str);     
        return obj;
	},
	// 对象转换为字符串
	jsonToStr : function(json){
		str = JSON.stringify(json);
		str = str.replace(/,/g,"&");
        str = str.replace(/:/g,"=");    
        str = str.replace(/{/g,"");
        str = str.replace(/}/g,"");
        str = str.replace(/"/g,"");
        return str;
	},
	//表单
	form : {
		// 回调函数
		callback : function (text) {
		},
		// 出错处理函数
		error : function() {
		},
		// 调用前执行函数
		before : function() {
		},
		// 返回数据类型
		dataType : 'text',
		// FORM提交
		ajaxSubmit : function(params){
			// 初始化方法
			this.init(params);
			// 预处理
			this.before();
			// 处理表单参数
			var form = params.form;
			var $Params = this.params(form);
			
			var action = $(form).attr('action');
			var method = $(form).attr('method');
			// ajax提交
			$.ajax({
					url : action,
					type : method,
					dataType : $.form.dataType,
				    data : $Params,
					error : function() {
						$.form.error();
					},
					success : function(text) {
						$.form.callback(text);
					}
				});
		},
		// 初始化
		init : function (params) {
			this.callback = params.callback != null?params.callback:function(text) {};
			this.error = params.error!=null?params.error:function() {};
			this.before = params.before!=null?params.before:function() {};
			this.dataType = params.dataType!=null?params.dataType:this.dataType;
		},
		// 将form表单的值组装成json对象
		params : function(form){
			var $Params = $(form).serialize();
			// 中文编码处理
			$Params = $.strToJson(decodeURIComponent($Params,true));
			return $Params;
		},
		//装载form表单
		load : function(form, dataSource) {

			for ( var key in dataSource) {
				var value = dataSource[key];
				var ele = $(form).find("[name='" + key + "']");
				var checkboxgroup = $(form).find("[group='" + key + "']");

				if (checkboxgroup.length > 0) {
					checkboxgroup.each(function() {
						var thisVal = $(this).val();
						var val = value.split(',');
						for ( var i = 0; i < val.length; i++) {
							if (thisVal == val[i]) {
								$(this).prop("checked", true);
							}
						}
					});
				}

				if (ele.length > 1) {
					if (ele[0].type == 'radio') {
						ele.each(function(i, e) {
							if ($(this).val() == value) {
								$(this).prop("checked", true);
							}
						});
					}
				} else {
					switch (ele.attr('type')) {
					case 'hidden':
						ele.val(value);
						break;
					case 'text':
						ele.val(value);
						break;
					case 'number':
						var numerictextbox = ele.data("kendoNumericTextBox");
						numerictextbox.value(value);
						break;
					case 'dropDownList':
						var dropdownlist = ele.data("kendoDropDownList");
						dropdownlist.value(value);
						break;
					case 'color':
						var color = ele.data("kendoColorPicker");
						color.value(value);
						break;
					case 'combotree':
						ele.val(value);
						var val = value;
						var id = ele.attr('id');
						var element = ele;
						setTimeout(function(){
							var data = element.attr('data-source');
							var source = eval('(' + data + ')');
							
							Utils.Form.ComboTreeDataSource.For(val, source);
							$('#'+id+'ComboTreeText').val(Utils.Form.ComboTreeDataSource.Text);
							Utils.Form.ComboTreeDataSource.Text='';
						},1000);
						
						break;
					default:
						break;
					}
					if (ele[0] && ele[0].type == 'textarea') {
						ele.val(value);
					}
				}
			}
		},
		
		validator : {
			/**
			 * 字母数字下划线验证
			 */
			charNumber : function(value){
				return {
					success : /^\w+$/.test($.trim(value)),
					msg : '必须由字母数字和下划线组成。'
				};
			},
			/**
			 * 小数
			 */
			decimals : function(value){
				var regualr = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
				return {
					success : regualr.test($.trim(value)),
					msg : '必须由大于0的数字或2位小数组成。'
				};
			},
			/**
			 * 非法字符
			 */
			special : function(value){
				var regualr = /[@#\$%\^&\*]+/g;
				return {
					success : regualr.test($.trim(value)),
					msg : '包含非法字符，请重新输入。'
				};
			},
			/**
			 * 正整数
			 */
			number : function(value){
				var regualr = /^[0-9]*[1-9][0-9]*$/ ;
				return {
					success : regualr.test($.trim(value)),
					msg : '必须输入一个正整数。'
				};
			}
		},
		
		validate : function(form){
			//必填项验证
			var inputs = $(form).find('[required="true"]');
			
			var msg = '';
			var success = true;
			inputs.each(function(){
				if(!$(this).val()){
					//$(this).tips($(this).attr('requiredMsg'),2);
					msg += '['+$(this).attr('data-lebal')+']必须填写<br/>';
					success = false;
				}
			});
			
			if(!success){
				return {
					success : success,
					msg : msg
				};
			}
			
			//小数验证
			var decimals = $(form).find('[data-type="decimals"]');
			decimals.each(function(){
				var validate = $.form.validator.decimals($(this).val());
				if(!validate.success){
					msg += '['+$(this).attr('data-lebal')+']'+validate.msg+'<br/>';
					success = false;
				}
			});
			
			if(!success){
				return {
					success : success,
					msg : msg
				};
			}
			
			//类型验证
			var charNumber = $(form).find('[data-type="charNumber"]');
			charNumber.each(function(){
				var validate = $.form.validator.charNumber($(this).val());
				if(!validate.success){
					msg += '['+$(this).attr('data-lebal')+']'+validate.msg+'<br/>';
					success = false;
				}
			});
			
			if(!success){
				return {
					success : success,
					msg : msg
				};
			}
			
			//正整数验证
			var number = $(form).find('[data-type="number"]');
			number.each(function(){
				var validate = $.form.validator.number($(this).val());
				if(!validate.success){
					msg += '['+$(this).attr('data-lebal')+']'+validate.msg+'<br/>';
					success = false;
				}
			});
			
			if(!success){
				return {
					success : success,
					msg : msg
				};
			}
			
			//非法字符验证
			var special = $(form).find('[type="text"]');
			special.each(function(){
				var validate = $.form.validator.special($(this).val());
				if(validate.success){
					msg += '['+$(this).attr('data-lebal')+']'+validate.msg+'<br/>';
					success = false;
				}
			});
			
			if(!success){
				return {
					success : success,
					msg : msg
				};
			}
			
			return {
				success : success,
				msg : msg
			};
		}
	},
	//时间操作
	timer : {
		getYear : function(){
			var myDate = new Date();
			return myDate.getFullYear();
		},
		getMonth : function(){
			var myDate = new Date();
			return parseInt(myDate.getMonth())+1;
		},
		getFullMonth : function(){
			var myDate = new Date();
			var month = parseInt(myDate.getMonth())+1;
			month = parseInt(month)>10?month:'0'+month;
			return month;
		},
		getFullFormatDate : function(){
			var result = $.timer.getYear()+'-'+$.timer.getFullMonth()+'-'+$.timer.getFullDay();
			return result;
		},
		getFullDay : function(){
			var myDate = new Date();
			var day = myDate.getDate();
			day = parseInt(day)>10?day:'0'+day;
			return day;
		},
		getFullHour : function(){
			var myDate = new Date();
			var hour = myDate.getHours();
			hour = parseInt(hour)>10?hour:'0'+hour;
			return hour;
		},
		getFullDate : function(){
			var myDate = new Date();
			return myDate.toLocaleDateString();
		},
		daysBetween : function(DateOne,DateTwo){
			var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
	    	var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
	    	var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
	  
	    	var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
	    	var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
	    	var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
	  
	    	var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
	    	return cha;  
		},
		//加载圈
		loader : function(){
			var contentArea = $('.page-content-area');
			contentArea
			.css('opacity', 0.25);
			
			var loader = $('<div style="position: fixed; z-index: 2000;" class="ajax-loading-overlay"><i class="ajax-loading-icon fa fa-spin '+loading_icon+'"></i> '+loading_text+'</div>').insertBefore(contentArea);
			var offset = contentArea.offset();
			loader.css({top: offset.top, left: offset.left});
		}
	},
	
	lhgTip : function(params){
		
		if($('#lhgTip')){
			$('#lhgTip').remove();
		}
		var div = $('<div id="lhgTip"></div>').css({
			position : 'absolute',
			padding : '10px',
			display : 'none',
			background : '#000000',
			'font-size' : '14px',
			color : '#ffffff',
			'-webkit-box-shadow': '0px 0px 5px #4E4C41',
	    	'-moz-box-shadow': '0px 0px 5px #4E4C41',
	    	'box-shadow': '0px 0px 5px #4E4C41',
	    	'border-radius': '5px',
	    	'-moz-border-radius': '5px', /* Mozilla浏览器的私有属性 */
	    	'-webkit-border-radius': '5px' /* Webkit浏览器的私有属性 */
		});
		
		div.append(params.content);
		
		$('body').append(div);
		
		div.css({
			left : $(window).width()/2-div.width()/2,
			top : '85%'
		});
		div.fadeIn('slow');
		
		setTimeout(function(){
			div.fadeOut('slow',function(){
				div.remove();
			});
		},3000);
	}
});

$.fn.extend({
	// 获取到选中的rowid(基于easyui)
	selectedIds : function(){
		var ids = '';
		var rows = $(this).datagrid('getSelections');
		if (rows && rows.length > 0) {
		for (var i = 0; i < rows.length; i++) {
			ids += rows[i].id+',';
			}
		}
		return ids;
	},
	//提示信息
	tips : function(msg, guide, time){
		layer.tips(msg, $(this) , {guide: guide?guide:1, time: time?time:3});
	}
});

