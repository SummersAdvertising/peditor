var editor = {
	elements: ["paragraph", "image", "video", "list"],
	settings: {
		articleModel: "article",
		photoModel: "photo",
		photoColumn: "image",
		photoUpload: "uploadPhoto",
		photoDestroy: "deletePhoto",
		linkedp: true,
		linkedimg: true,
		paragraphFontClass: { "內文": "content", "標題": "title" }, 
		paragraphFontColor: { "顏色": "default", "黑色": "#000", "藍色": "#00F" }, 
		paragraphFontSize: { "大小": "default", 14:14, 28:28 }
	},
	init: function(settings){
		editor.settings = settings? editor.setEditor(editor.settings, settings) : editor.settings;

		$("#articleContent").addClass("sortable");
		$( ".sortable" ).sortable({
			placeholder: "space",
			disable: true,
			stop: function( event, ui ) {editor.save();}
		});

		var editorList = $("<ul>");
		editorList.addClass("editorList");

		var editorContent = $("<section>");
		editorContent.addClass("editorContent post");

		var editorAdd = $("<div>");
		editorAdd.addClass("editorAdd");
		var btnAdd = $("<a>");
		btnAdd.attr("href", "#");
		btnAdd.append("新增");
		editorAdd.append(btnAdd);

		var sectionList = $("<section>").addClass("tab").append(editorList);
		$("#editorPanel").append(sectionList).append(editorContent).append(editorAdd);
		
		for(var index in editor.elements){
			var element = editor[editor.elements[index]];
			if(element){
				element.init();
			}
		}

		editor.bindPanelControl();
		editor.show();
	},
	save: function(callback){
		if(callback){
			callback();
		}
		else{
			editor.pack();
		}
	},
	ajaxupdate: function(){
		$("form, .edit_"+ editor.settings.articleModel).ajaxSubmit({
			beforeSubmit: function(a,f,o) {
				o.dataType = 'json';
			},
			complete: function(XMLHttpRequest, textStatus) {}
		});
	},
	pack: function(upload){
		var article = new Array();
		$("#articleContent .paragraphContainer").each(function(){
			article.push(editor[$(this).data("type")].pack(this));
		});

		if(upload){
			article.push(upload);
		}

		$("#"+editor.settings.articleModel+"_content").val(JSON.stringify(article));

		editor.save(editor.ajaxupdate);
	},
	show: function(){
		var contentEle = $("#"+editor.settings.articleModel+"_content");

		if(contentEle && contentEle.val()){
			var article = JSON.parse(contentEle.val());

			for(var i = 0, length = article.length; i < length; i++)
			{
				var paragraph = article[i];
				editor[paragraph.type].show(paragraph);
			}
		}
	},
	output:function(){
		//read-only
		var contentEle = $("#"+editor.settings.articleModel+"_content");

		if(contentEle && contentEle.val()){
			var article = JSON.parse(contentEle.val());

			for(var i = 0, length = article.length; i < length; i++)
			{
				var paragraph = article[i];
				editor[paragraph.type].output(paragraph);
			}
		}
	},
	resetChild: function(){
		$(".editorChild.active").find("*").each(function(){
			switch(this.tagName){
				case "SELECT":
				$(this).val("1");
				break;
				case "OPTION":
				break;
				default:
				$(this).val("");
				break;
			}
		});
	},
	setEditor: function(defaultSet, customSet){
		for(setting in customSet){
			defaultSet[setting] = customSet[setting];
		}
		return defaultSet;
	},
	bindPanelControl: function(){
		$(".editorList li:first, .editorContent .editorChild:first").addClass("active");

		$(".editorList li").click(function(event){
			event.preventDefault();
			$(".editorList .active, .editorContent .active").removeClass("active");
			$(this).addClass("active");

			var indexActive = $(".editorList li").index(this);
			$(".editorContent .editorChild").eq(indexActive).addClass("active");
		});

		$(".editorAdd").click(function(){
			var element = $(".editorList .active").data("type");
			editor[element].add();
		});
	},
	alert: function(alertMsg, type){
		if(window['Alertify']){
			Alertify.log[type](alertMsg);
		}
		else{
			alert(alertMsg);
		}
	},
	HTMLfilter: function(text){
		return String(text).replace(/["<>& ]/g, function(all){
			return "&" + {
				'"': 'quot',
				'<': 'lt',
				'>': 'gt',
				'&': 'amp'
			}[all] + ";";
		}).replace(/\n/g, "<br>");
	},
	HTMLparser: function(text){
		return text.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/<br[ \/]*>/g, "\n");
	}
};