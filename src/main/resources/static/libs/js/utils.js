var Utils = {
	// 字符串转换为对象
	StrToJson : function(str){
		str = str.replace(/&/g,"','");    
        str = str.replace(/=/g,"':'");    
        str = "({'"+str +"'})";    
        obj = eval(str);     
        return obj;
	},
	// 对象转换为字符串
	JsonToStr : function(json){
		str = JSON.stringify(json);
		str = str.replace(/,/g,"&");
        str = str.replace(/:/g,"=");    
        str = str.replace(/{/g,"");
        str = str.replace(/}/g,"");
        str = str.replace(/"/g,"");
        return str;
	},
	// 设置下拉表单值
	SetSelectedIndex : function(params){
		var selectFields = params.selectFields;
		var type = params.type;
		if(type=='normal'){
		for(var i=0;i<selectFields.length;i++){
			var select = document.getElementById(selectFields[i][0]);
			var dictValue = selectFields[i][1];
			for (var j = 0; j < select.options.length; j++) {
				if (select.options[j].value == dictValue) {
					select.options[j].selected = true;
				}
			}
		}
		}else if(type=='easyui'){
		for(var i=0;i<selectFields.length;i++){
			var dictValue = selectFields[i][1];
			$('#'+selectFields[i][0]).combobox({
			onLoadSuccess: function () {
                        $(this).combobox("setValue", dictValue);
            }
			});
			}
		}
	},

	//使用cookie保存用户名密码
	SetUserToCookie : function(userName, userPwd, checked){
		$.cookie('userName', userName, { expires: 365 });
		$.cookie('userPwd', userPwd, { expires: 365 });
		$.cookie('userChecked', checked, { expires: 365 });
	}
};

/**
 * FORM表单相关工具
 * 
 * @params
 */
Utils.Form = {
	// 回调函数
	Callback : function (text) {
	},
	// 出错处理函数
	Error : function() {
	},
	// 调用前执行函数
	Before : function() {
	},
	// 返回数据类型
	DataType : 'text',
	// FORM提交
	AjaxSubmit : function(params){
		// 初始化方法
		this.Init(params);
		// 预处理
		this.Before();
		// 处理表单参数
		var form = params.form;
		var $Params = this.Params(form);
		
		var action = $(form).attr('action');
		var method = $(form).attr('method');
		// ajax提交
		$.ajax({
				url : action,
				type : method,
				dataType : Utils.Form.DataType,
			    data : $Params,
				error : function() {
					Utils.Form.Error();
				},
				success : function(text) {
					Utils.Form.Callback(text);
				}
			});
	},
	// 初始化
	Init : function (params) {
		this.Callback = params.callback != null?params.callback:function(text) {};
		this.Error = params.error!=null?params.error:function() {};
		this.Before = params.before!=null?params.before:function() {};
		this.DataType = params.dataType!=null?params.dataType:this.DataType;
	},
	// 将form表单的值组装成json对象
	Params : function(form){
		var $Params = $(form).serialize();
		// 中文编码处理
		$Params = Utils.StrToJson(decodeURIComponent($Params,true));
		return $Params;
	},
	
	PassWord : {
		CharMode : function(iN){
			if (iN>=48 && iN <=57) //数字 
				return 1; 
			if (iN>=65 && iN <=90) //大写字母 
				return 2; 
			if (iN>=97 && iN <=122) //小写 
				return 4; 
			else 
				return 8; //特殊字符 
		},
		
		BitTotal : function(num){
			modes=0; 
			for (var i=0;i<4;i++){ 
				if (num & 1) modes++; 
					num>>>=1; 
				} 
			return modes;
		},
		
		CheckStrong : function(sPW){
			if (sPW.length<=4) 
				return 0; //密码太短 
				Modes=0; 
			for (var i=0;i<sPW.length;i++){ 
				//测试每一个字符的类别并统计一共有多少种模式. 
				Modes|=Utils.Form.PassWord.CharMode(sPW.charCodeAt(i)); 
				} 

			return Utils.Form.PassWord.BitTotal(Modes);
		},
		
		Strength : function(pwd){
			O_color="#ffffff"; 
			L_color="#FF0000"; 
			M_color="#FF9900"; 
			H_color="#00DD00"; 
			if (pwd==null||pwd==''){ 
				Lcolor=Mcolor=Hcolor=O_color;
				$("#levelStr").html('');
			} 
			else{ 
				S_level=Utils.Form.PassWord.CheckStrong(pwd); 
				switch(S_level) { 
					case 0: 
					Lcolor=Mcolor=Hcolor=O_color; 
					case 1: 
					Lcolor=L_color; 
					Mcolor=Hcolor=O_color; 
					$("#levelStr").html('弱');
					break; 
					case 2: 
					Lcolor=Mcolor=M_color; 
					Hcolor=O_color; 
					$("#levelStr").html('中');
					break; 
					default: 
					Lcolor=Mcolor=Hcolor=H_color; 
					$("#levelStr").html('强');
				} 
				}

				document.getElementById("strength_L").style.background=Lcolor; 
				document.getElementById("strength_M").style.background=Mcolor; 
				document.getElementById("strength_H").style.background=Hcolor; 
				return;
		}
	}
};

/**
 * 对话框相关工具
 * 
 * @params
 */
Utils.MsgBox = {
	Show : function(params){
		MsgBox.Show(params);
	}
};

/**
 * Loading工具
 * 
 * @params
 */
Utils.ShadeBox = {
	Mask : function(a, c, t){
		ShadeBox.ShowLoading(a,c,t);
	},
	PartMask :  function(b, a, c){
		ShadeBox.PartLoading(b,a,c);
	},
	HideMask : function(){
		ShadeBox.Hide();
	}
};



/**
 * 列表操作类(基于easyui)
 * 
 * @params
 */
Utils.List = {
	// 获取到选中的rowid
	SelectedIds : function(ele){
		var ids = '';
		var rows = $('#'+ele).datagrid('getSelections');
		if (rows && rows.length > 0) {
		for (var i = 0; i < rows.length; i++) {
			ids += rows[i].id+',';
			}
		}
		return ids;
	},
	//新增
	Add : function(url){
		location.href = 'app_frame_loading.shtml?url='+url;
	},
	//删除
	Del : function(params){
		
		var ids = params.ids;
		var url = params.url;
		if(ids){
		$.messager.confirm('提示信息','确定要删除这些数据吗？',function(e){
			if(e){
				$.ajax({
			    	url: url,
			    	type: 'POST',
			    	dataType: 'text',
			    	data : {
			    		ids : ids
			    	},
			    	error : function(){
			    		alert('error!可能与服务器失去连接。');
			    		    	},
			    	success: function(text){
			    		//将获取到得text类型的数据转换成json
			    		var json=eval('('+text+')');
			    		alert(json.msg);
			    		if(json.success){
			    			//刷新表格
			    			$('#pres').datagrid('reload');
			    		}
			    		}
			    	});
			}
		});
		}else{
			alert('请选择要删除的数据！');
		}
	},
	//编辑
	Edit : function(params){
		var idName = params.idName;
		var idValue = params.idValue;
		var url = params.url;
		
		url = url+"?"+idName+"="+idValue;
		location.href = 'app_frame_loading.shtml?url='+url;
	},
	//查看
	View : function(url){
		var idName = params.idName;
		var idValue = params.idValue;
		var url = params.url;
		
		url = url+"?"+idName+"="+idValue;
		location.href = 'app_frame_loading.shtml?url='+url;
	},
	//重置
	Reset : function(form){
		form.reset();
	},
	//查询
	Query : function(form, list){
		
		//提交验证
		var isValid = $(form).form('validate');
		if(!isValid){
			return;
		}
		
		$('#'+list).datagrid('load',Utils.Form.Params(form));
	},
	//导出
	Export : function(params){
		//导出文件类型
		var templateType = params.templateType;
		//导出范围
		var exportRange = params.exportRange;
		//
	}
};

/**
 * 用户Session信息
 * 
 * @params
 */
Utils.Session = {
	User : null
};

/**
 * 滚动元素
 * 
 * @params{arg0 包含滚动元素的父级元素id
 * 		   arg1 要滚动的元素id}
 */
Utils.Rolling = {
	//滚动函数
	Roll : function(arg0, arg1, height){
		if(parseInt($('#'+arg0).scrollTop())==0){
			$('#'+arg0).append($('#'+arg1).clone()).append($('#'+arg1).clone());
		}
		if(parseInt($('#'+arg0).scrollTop())%height==0){
			$('#'+arg0).append($('#'+arg1).clone());
		}
		$('#'+arg0).scrollTop(parseInt($('#'+arg0).scrollTop())+1);
		if(parseInt($('#'+arg0).scrollTop())%(height*2)==0){
			//$('#'+arg0).first().remove();
		}
	},
	
	//停止滚动
	Stop :function(){
		clearInterval(Utils.Interval1);
	},
	//初始化
	Init : function(arg0, arg1, speed){
		$('#'+arg0).mouseover(function(){
			Utils.Rolling.Stop();
		});
		$('#'+arg0).mouseout(function(){
			Utils.Rolling.Start(arg0,arg1,speed);
		});
	},
	//开始滚动
	Start :function(arg0, arg1, speed){
		//获取父级元素高度
		var height = parseInt($('#'+arg0).height());
		
		Utils.Interval1 = setInterval(
		function(){
			Utils.Rolling.Roll(arg0, arg1, height);
		},speed);
	}
};

/**
 * open flash chart方法封装
 * 
 * @params{}
 */
Utils.OFC = {
	EmbedSWF : function(params){
		var queryParams = params.queryParams;
		var linkParams = Utils.JsonToStr(queryParams);
		linkParams = decodeURIComponent(linkParams,true);
		swfobject.embedSWF(
			params.path+"/flashchart/flash/open-flash-chart-zh.swf?t=" + new Date(), params.render,
			params.width, params.height, "9.0.0", params.path+"/flashchart/flash/expressInstall.swf",
			{"data-file":escape(params.url+"?"+linkParams)},{wmode: "transparent"}
			);
	}
};

/**
 * 时间
 */
Utils.Timer = {
	Format : function(date, format) {
		var paddNum = function(num) {
			num += "";
			return num.replace(/^(\d)$/, "0$1");
		};
		// 指定格式字符
		var cfg = {
			yyyy : date.getFullYear() // 年 : 4位
			,
			yy : date.getFullYear().toString().substring(2)// 年 : 2位
			,
			M : date.getMonth() // 月 : 如果1位的时候不补0
			,
			MM : paddNum(date.getMonth() + 1) // 月 : 如果1位的时候补0
			,
			d : date.getDate() // 日 : 如果1位的时候不补0
			,
			dd : paddNum(date.getDate())// 日 : 如果1位的时候补0
			,
			hh : date.getHours() // 时
			,
			mm : date.getMinutes() // 分
			,
			ss : date.getSeconds()
			// 秒
		};
		format || (format = "yyyy-MM-dd hh:mm:ss");
		return format.replace(/([a-z])(\1)*/ig, function(m) {
					return cfg[m];
				});
	},
	GetYear : function(){
		var myDate = new Date();
		return myDate.getFullYear();
	},
	GetMonth : function(){
		var myDate = new Date();
		return parseInt(myDate.getMonth())+1;
	},
	GetFullMonth : function(){
		var myDate = new Date();
		var month = parseInt(myDate.getMonth())+1;
		month = parseInt(month)>10?month:'0'+month;
		return month;
	},
	GetFullDay : function(){
		var myDate = new Date();
		var day = myDate.getDate();
		day = parseInt(day)>10?day:'0'+day;
		return day;
	},
	GetFullHour : function(){
		var myDate = new Date();
		var hour = myDate.getHours();
		hour = parseInt(hour)>10?hour:'0'+hour;
		return hour;
	},
	GetFullDate : function(){
		var myDate = new Date();
		return myDate.toLocaleDateString();
	},
	DaysBetween : function(DateOne,DateTwo){
		var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));  
    	var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);  
    	var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));  
  
    	var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));  
    	var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);  
    	var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));  
  
    	var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);   
    	return cha;  
	}
};

/**
 * 解析身份证信息
 */
Utils.ParsingIdcard = {
	GetBirthdate : function(idcard){
		var year,month,day,birthdate;
		//var s=document.form1.sfz.value;
		var d=new Date();
		//身份证为15位
		if(idcard.length==15){
			year=idcard.substr(6,2);
			month=idcard.substr(8,2);
			day=idcard.substr(10,2);
		}
		//身份证为18位
		if(idcard.length==18){
			year=idcard.substr(6,4);
			month=idcard.substr(10,2);
			day=idcard.substr(12,2);
		}
		birthdate =year+"-"+month+"-"+day;
		return birthdate;
	},
	GetAge	:	function(idcard){
		var age = "";
		var nowDate = new Date();
		//身份证为15位
		if(idcard.length==15){
			year=idcard.substr(6,2);
			age = nowDate.getFullYear()-1900-year;
		}
		//身份证为18位
		if(idcard.length==18){
			year=idcard.substr(6,4);
			age = nowDate.getFullYear()-year;
		}
		
		return age;
	}
};

/**
 * 获取操作权限
 */
Utils.Auth = {
	ModuleId : '',
	Actions : function(moduleId){
		$.ajax({
	    	url: 'app_frame_actions.shtml',
	    	type: 'POST',
	    	dataType: 'text',
	    	data : {
	    		moduleId : moduleId
	    	},
	    	error : function(){
	    		alert('error!可能与服务器失去连接。');
	    		    	},
	    	success: function(text){
	    		//将获取到得text类型的数据转换成json
	    		var json=eval('('+text+')');
	    		//$("#new").linkbutton("disable");
	    		if(json.success){
	    			var buttons = $('[name="actionButton"]');
    				var toolBarBtns = $('[group="actionButton"]');
    				toolBarBtns.linkbutton("disable");
    				buttons.removeAttr('disabled');
	    			
	    				for(var j=0;j<buttons.length;j++){
	    					$(buttons[j]).hide();
	    					var btnAction = $(buttons[j]).attr('actionName');
	    					for(var i=0;i<json.actions.length;i++){
	    	    				var actionName = json.actions[i].actionName;
	    					if(btnAction==actionName){
	    						$(buttons[j]).show();
	    					}
	    					}
	    				}
	    				
	    				for(var j=0;j<toolBarBtns.length;j++){
	    					var btnAction = $(toolBarBtns[j]).attr('id');
	    					for(var i=0;i<json.actions.length;i++){
	    	    				var actionName = json.actions[i].actionName;
	    					if(btnAction==actionName){
	    						$(toolBarBtns[j]).linkbutton("enable");
	    					}
	    				}
	    				}
	    		}
	    	}
	    });
	}
};

/**
 * 锚点
 */
Utils.Anchor = {
	Init : function(params){
		$("#tbox").remove();
		var tbox = $('<div id="tbox"></div>');
		var title = $('<a class="taoba" href="javascript:void(0)" title="快速导航">快速导航</a>');
		//\\tbox.append(title);
		var taobars = params.anchors;
		for(var i=0;i<taobars.length;i++){
			var taobar = $('<a class="taoba" href="javascript:void(0)" index="'+taobars[i].index+'" title="'+taobars[i].title+'">'+taobars[i].text+'</a>');
			taobar.click(function(event) { 
			      var index=$(this).attr('index');
			      var id='#'+index;
			     $("html,body").animate({scrollTop: $(id).offset().top-62}, 500);
			   });
			tbox.append(taobar);
		}
		var gotop = $('<a id="gotop" href="javascript:void(0)" title="回到顶部">回到顶部</a>');
		gotop.click(function(){ 
	        $('body,html').animate({
	            scrollTop: 0
	        },
	        400);//点击回到顶部按钮，缓懂回到顶部,数字越小越快
	        return false;  
	    });
		tbox.append(gotop);
		
		tbox.mousedown(function(event){
                var isMove = true;  
                var abs_x = event.pageX - tbox.offset().left;  
                var abs_y = event.pageY - tbox.offset().top;  
                $(document).mousemove(function (event) {  
                            if (isMove) {  
                                var obj = tbox;  
                                obj.css({'left':event.pageX - abs_x, 'top':event.pageY - abs_y - $(document).scrollTop()});  
                            }  
                        }  
                ).mouseup(  
                        function () {  
                            isMove = false;  
                        }  
                );  
		});
			
		$('body').append(tbox);
		
		$('#tbox').css({
			left : $(window).width()-$('#tbox').width() + 'px',
			top : 100
		});
	    
		    $(window).scroll(function(){
		    t = $(document).scrollTop();
		    if(t > 50){
		        $('#gotop').fadeIn('slow');
		    }else{
		        $('#gotop').fadeOut('slow');
		    }       
		});
		    
	}
};

window.onresize = function(){
	var web_subnav = document.body;
    var width = document.documentElement.clientWidth;
    web_subnav.style.width = width + 'px';
};
