var editor = {
	articleModel: "article",
	photoModel: "photo",

	settings: {
		elements: { p: true, linkedp: true, img: true, linkedimg: true, video: true },

		paragraphBox: {type:"div", className:"paragraphContainer"},
		pStyle: {className: {title: "標題", content: "內文"}, fontColor:{red: "紅色", blue: "藍色"}, fontSize:[14, 28] },

		imgValidate: {enable: true, type:["png", "jpg", "gif"], size: "5"},

		controlpanelBox: {enable: false, type:"div", className:"controlPanel"},
		controlpanel: {parentType: "ul", parentClass:"", childType: "li", childClass: "", childEdit: "編輯", childDel: "刪除"}

	},
	init: function(settings, articleModel, photoModel){
		var elements = ["p", "img", "video"];
		for(element in elements){
			// var paragraph = ;
			//console.log(editor[elements[element]]);
			if(editor[elements[element]]){
				console.log(this);
			}
			
		}
		
		editor.articleModel = articleModel? articleModel : editor.articleModel;
		editor.photoModel = photoModel? photoModel : editor.photoModel;

		editor.settings = settings? setEditor(editor.settings, settings) : editor.settings;
		initialize(editor.settings);
	},
	showContent: function(){
		var contentEle = $("#"+editor.articleModel+"_content");

		if(contentEle && contentEle.val()){
			showContent(contentEle.val());
		}
	},
	editContent:function(){}
};

function initialize(settings){
	editor.showContent();
}

function setEditor(defaultSet, customSet){
	for(setting in customSet){
		if(typeof(customSet[setting]) == "object"){
			for(child in customSet[setting]){
				defaultSet[setting][child] = customSet[setting][child];
			}
		}
		else{
			defaultSet[setting] = customSet[setting];
		}
	}
	return defaultSet;
}

function showContent(content){
	var obj = jQuery.parseJSON(content);

	var article = "";
	for(i=0;i<obj.article.length;i++)
	{
		var paragraph = obj.article[i];

		if(paragraph.type == "paragraph")
        {
          var paragraphBox = $("<"+editor.settings.paragraphBox.type+">");
          paragraphBox.addClass(editor.settings.paragraphBox.className);
          paragraphBox.attr("data-type", "paragraph");

          var p = $("<p>");
          p.css("font-size", paragraph.fontSize).css("color", paragraph.color);

          if(paragraph.link){
          	var a = $("<a>");
          	a.attr("target", "_blank").attr("href", paragraph.link);
          	a.html((paragraph.content).replace(/\\n/g, "<br />"));

          	p.append(a);
          }
          else{
          	p.html((paragraph.content).replace(/\\n/g, "<br />"));
          }

          paragraphBox.append(p);
        }
        else if(paragraph.type == "image")
        {
          var paragraphBox = $("<"+editor.settings.paragraphBox.type+">");
          paragraphBox.addClass(editor.settings.paragraphBox.className);
          paragraphBox.attr("data-type", "image");

          var img = $("<img>");
          img.attr("alt", JSON.stringify(paragraph.id));
          img.attr("src", JSON.stringify(paragraph.path));
          img.attr("title", JSON.stringify(paragraph.id));

          paragraphBox.append(img);

        }
        else if (paragraph.type == "video") {
          var paragraphBox = $("<"+editor.settings.paragraphBox.type+">");
          paragraphBox.addClass(editor.settings.paragraphBox.className);
          paragraphBox.attr("data-type", "video");

          var iframe = $("<iframe>");
          iframe.attr("width", "480").attr("height", "290").attr("frameborder", "0").attr("allowfullscreen", "");
          iframe.attr("data-code", paragraph.code);
          iframe.attr("http://www.youtube.com/embed/" + paragraph.code);

          paragraphBox.append(iframe);
        }

        $("#articleContent").append(paragraphBox);
    }
}
function jsonReplace(string){return string.replace(/"([^"]*)"/g, "$1");}