var editor = {
	elements: ["paragraph", "image", "video"],
	settings: {
		articleModel: "article",
		photoModel: "photo",
		linkedp: true,
		linkedimg: true,
		paragraphFontClass: {title: "標題", content: "內文"}, 
		paragraphFontColor: {default: "大小", "#000": "黑色", "#00F": "藍色"}, 
		paragraphFontSize: {default: "大小", 14:14, 28:28}
	},
	init: function(settings){
		editor.settings = settings? setEditor(editor.settings, settings) : editor.settings;

		$("#articleContent").addClass("sortable");
		$( ".sortable" ).sortable();

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

		bindPanelControl();
		editor.show();
	},
	show: function(){
		var contentEle = $("#"+editor.settings.articleModel+"_content");

		if(contentEle && contentEle.val()){
			var obj = JSON.parse(contentEle.val());

			for(var i=0;i<obj.article.length;i++)
			{
				var paragraph = obj.article[i];
				editor[paragraph.type].show(paragraph);
			}
		}
	},
	resetChild: function(){
		$(".editorChild.active").find("*").each(function(){
			$(this).val("");
		});
	}
};

function setEditor(defaultSet, customSet){
	for(setting in customSet){
		defaultSet[setting] = customSet[setting];
	}
	return defaultSet;
}

function bindPanelControl(){
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

function jsonReplace(string){return string.replace(/"([^"]*)"/g, "$1");}