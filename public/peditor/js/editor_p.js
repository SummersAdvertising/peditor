editor.p = {
	initTab: function(){
		var li = $("<li>");
		li.attr("data-type", "p").attr("id", "tab-p");
		var a = $("<a>").append("插入段落");
		var icon = $("<img>").attr("src", "/peditor/img/edit.png");
		a.prepend(icon);

		li.append(a);

		$(".editorList").append(li);
	},
	initPost: function(){
		var editorChild = $("<div>");
		editorChild.attr("id", "post-p");
		editorChild.addClass("editorChild");

		/* 插入選單：class, fontcolor, fontsize */
		var selectList = ["paragraphFontClass", "paragraphFontColor", "paragraphFontSize"];
		for(var item in selectList){
			if(editor.settings[selectList[item]]){
				var type = selectList[item];
				var select = $("<select>");
				select.attr("id", ("new" + capitalize(type)) );

				for(var child in editor.settings[type]){
					var option = $("<option>");
					
					option.append(child);

					if(editor.settings[type][child] == "default"){
						option.attr("selected", "selected");
						option.attr("value", "false");
						select.prepend(option);
					}
					else{
						option.attr("value", editor.settings[type][child].toString());
						select.append(option);
					}
				}

				editorChild.append(select);
				
			}
			if(item == selectList.length-1){
				editorChild.append($("<br>"));
			}
		}

		var text = $("<textarea>");
		text.addClass("autogrow");
		text.attr("id", "newParagraphContent").attr("placeholder", "請將段落輸入在此處").attr("cols", "50").attr("rows", "8");

		editorChild.append(text).append($("<br>"));
		
		if(editor.settings.linkedp){
			var link = $("<input>");
			link.attr("type", "text").attr("id", "newParagraphLink").attr("placeholder", "此段落連結至何處（若無請勿輸入）").attr("size", "80");
			editorChild.append(link);
		}
		
		$(".editorContent").append(editorChild);
	},
	add: function(){
		if(!$("#newParagraphContent").val()){
			editor.alert("請輸入內容", "error");
			return ;
		}
		var paragraph = new Object();
		var paragraphAttrs = ["fontSize", "fontColor", "fontClass", "link", "content"];

		$.each(paragraphAttrs, function(index, value) {
			var attrEle = $("#newParagraph"+capitalize(value));
			if (attrEle.val() && attrEle.val() != "false") {
				switch(value){
					case "fontSize":
						paragraph[value] = attrEle.val() + "px";
					break;
					case "content":
						paragraph[value] = editor.HTMLfilter(attrEle.val());
					break;
					default:
						paragraph[value] = attrEle.val();
					break;
				}
			}
		});

		editor.paragraph.show(paragraph);
		editor.resetChild();

		editor.save();
	},
	show: function(paragraph){
		var paragraphBox = this.output(paragraph);
		paragraphBox.addClass("paragraphContainer part");
		
		this.bindControl(paragraphBox);
	},
	output: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.attr("data-type", "paragraph");

		var p = $("<p>");
		if(paragraph.fontSize){
			p.css("font-size", paragraph.fontSize).attr("data-fontsize", paragraph.fontSize);
		}
		if(paragraph.fontColor){
			p.css("color", paragraph.fontColor).attr("data-fontcolor", paragraph.fontColor);
		}
		if(paragraph.fontClass){
			p.addClass(paragraph.fontClass);
		}

		if(paragraph.link){
		  var a = $("<a>");
		  a.attr("target", "_blank").attr("href", paragraph.link);
		  a.html(paragraph.content);

		  p.append(a);
		}
		else{
		  p.html(paragraph.content);
		}

		paragraphBox.append(p);
		editor.settings.articleSection.append(paragraphBox);

		return paragraphBox;
	},
	edit: function(paragraphContainer, controlPanel){
		controlPanel.hide();
		$(".controlPanel a[data-control = edit]").each(function(){
			$(this).unbind();
		});

		var editPanel = $("<div>");
		editPanel.addClass("editbox");
		var editContent = paragraphContainer.children("p:first").hide().html();

		var contentLink = editContent.match(/^\<a([\S\s]+)href\=\"([\S\s]+)\"\>(.+)\<\/a\>/);

		if(contentLink){
			contentLink.aLink = contentLink[2];
			contentLink.aContent = contentLink[3];
			editContent = contentLink.aContent;

			var link = $("<label>");
			link.append("連結: "+contentLink.aLink);
		}

		var textarea = $("<textarea>");
		textarea.addClass("autogrow");
		textarea.val(editor.HTMLparser(editContent));

		var cancel = $("<a>");
		cancel.append("取消");
		cancel.click(function(){
			editPanel.remove();
			controlPanel.show();
			paragraphContainer.children("p:first").show();

			$(".controlPanel a[data-control = edit]").each(function(){
				editor.paragraph.bindEdit(this);
			});
		});

		var save = $("<a>");
		save.append("完成");
		save.click(function(){
			editContent = editor.HTMLfilter(textarea.val());
			if(editContent){
				editPanel.remove();
				controlPanel.show();

				if(contentLink){
					paragraphContainer.children("p:first").show().children("a:first").html(editContent);
				}
				else{
					paragraphContainer.children("p:first").show().html(editContent);
				}

				editor.save();

				$(".controlPanel a[data-control = edit]").each(function(){
					editor.paragraph.bindEdit(this);
				});
			}
			else{
				editor.alert("請輸入修改內容", "error");
			}
			
		});

		var editbtnBar = $("<div>");
		editbtnBar.addClass("tool-a").append(save).append(cancel);
		editPanel.append(textarea).append($("<br>")).append(contentLink? $(link).after($("<br>")) : "").append(editbtnBar);
		paragraphContainer.append(editPanel);
	},
	bindControl: function(paragraphBox){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel tool-b");

		var edit = $("<a>");
		edit.attr("data-control", "edit");
		edit.append("編輯");
		editor.paragraph.bindEdit(edit);

		var del = $("<a>");
		del.attr("data-control", "del");
		del.append("刪除");
		del.click(function(){
			paragraphBox.remove();
			editor.save();
		});

		controlPanel.append(edit).append(del);
		paragraphBox.prepend(controlPanel);

	},
	bindEdit: function(edit){
		$(edit).bind("click", function(){
			var controlPanel = $(this).parents(".controlPanel");
			var paragraphContainer = $(this).parents(".paragraphContainer");
			editor.paragraph.edit(paragraphContainer, controlPanel);
		});
	},
	pack: function(paragraphContainer){
		var paragraph = new Object();
		var content = $(paragraphContainer).children("p:first");

		paragraph.type = "paragraph";
        paragraph.fontColor = content.data('fontcolor');
        paragraph.fontSize = content.data('fontsize');
        paragraph.fontClass = content.attr("class");

        var a = $(content).children('a:first');

        if ( a.length > 0 ) {         
          paragraph.link = a.attr('href');          
          paragraph.content = a.html();
        }
        else {
          paragraph.content = content.html();         
        }

		return paragraph;
	}
};
function capitalize(str){
	return str.charAt(0).toUpperCase() + str.slice(1);
}