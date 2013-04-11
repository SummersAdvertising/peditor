var editor = {
	elements: ["paragraph", "image", "video"],
	settings: {
		articleModel: "article",
		photoModel: "photo",
		photoColumn: "image",
		photoUpload: "uploadPhoto",
		photoDestroy: "deletePhoto",
		linkedp: true,
		linkedimg: true,
		paragraphFontClass: {title: "標題", content: "內文"}, 
		paragraphFontColor: {default: "大小", "#000": "黑色", "#00F": "藍色"}, 
		paragraphFontSize: {default: "大小", 14:14, 28:28}
	},
	init: function(settings){
		editor.settings = settings? editor.setEditor(editor.settings, settings) : editor.settings;

		$("#articleContent").addClass("sortable");
		$( ".sortable" ).sortable({
			placeholder: "ui-state-highlight",
			disable: true,
			stop: function( event, ui ) {editor.save();}
		});

		var editorList = $("<ul>");
		editorList.addClass("editorList");

		var editorContent = $("<div>");
		editorContent.addClass("editorContent");

		var editorAdd = $("<div>");
		editorAdd.addClass("editorAdd");
		var btnAdd = $("<a>");
		btnAdd.attr("href", "#");
		btnAdd.append("新增");
		editorAdd.append(btnAdd);

		$("#editorPanel").append(editorList).append(editorContent).append(editorAdd);
		
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
		$("form:first").ajaxSubmit({
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
	resetChild: function(){
		$(".editorChild.active").find("*").each(function(){
			$(this).val("");
		});
	},
	setEditor: function(defaultSet, customSet){
		for(setting in customSet){
			defaultSet[setting] = customSet[setting];
		}
		return defaultSet;
	},
	bindPanelControl: function(){
		$(".editorList li:first").addClass("active");
		$(".editorContent .editorChild:first").addClass("active");

		$(".editorList li").click(function(event){
			event.preventDefault();
			$(".editorList .active").removeClass("active");
			$(".editorContent .active").removeClass("active");
			$(this).addClass("active");

			var indexActive = $(".editorList li").index(this);
			$(".editorContent .editorChild").eq(indexActive).addClass("active");
		});

		$(".editorAdd").click(function(){
			var element = $(".editorList .active").data("type");
			editor[element].add();
		});
	}
};