editor.paragraph = {
	element: "p",
	init: function(){
		var li = $("<li>");
		li.attr("data-type", "paragraph");
		li.append("插入段落");
		$(".editorList").append(li);

		var editorChild = $("<div>");
		editorChild.addClass("editorChild");

		/* 插入選單：class, fontcolor, fontsize */
		var selectList = ["paragraphFontClass", "paragraphFontColor", "paragraphFontSize"];
		for(var item in selectList){
			if(editor.settings[selectList[item]]){
				var type = selectList[item];
				var select = $("<select>");
				select.attr("id", ("new_"+type) );

				for(var option in editor.settings[type]){
					if(option == "default"){}
					// console.log(option);
				}
				
			}
		}
		// <select id="newParagraphFontSize" >
  //       <option value="" selected="selected">-- 大小 --</option>
  //       <option value="14">14</option>
  //       <option value="28">28</option>
  //     </select>
  //     <select id="newParagraphColor" >
  //       <option value="" selected="selected">-- 顏色 --</option>
  //       <option value="#000">black</option>
  //       <option value="#00F">blue</option>
  //     </select>

		var text = $("<textarea>");
		text.attr("id", "newParagraphContent").attr("placeholder", "請將段落輸入在此處").attr("cols", "50").attr("rows", "8");
		var link = $("<input>");
		link.attr("type", "text").attr("id", "newParagraphLink").attr("placeholder", "此段落連結至何處（若無請勿輸入）").attr("size", "80");
		var br = $("<br>");

		editorChild.append(text).append(br).append(link);

		$(".editorContent").append(editorChild);
	},
	add: function(){
		var paragraph = new Object();

		if ($("#newParagraphFontSize").val() && $("#newParagraphFontSize").val().length > 0) {
			paragraph.fontSize = $("#newParagraphFontSize").val() + "px";
		}
		if ($("#newParagraphColor").val() && $("#newParagraphColor").val().length > 0 ) {
			paragraph.fontSize = $("#newParagraphColor").val();
		}
		if ($("#newParagraphLink").val() && $("#newParagraphLink").val().length > 0 ) {
			paragraph.link = $("#newParagraphLink").val();
		}
		paragraph.content = $("#newParagraphContent").val();

		editor.paragraph.show(paragraph);
		editor.resetChild();
	},
	show: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.addClass("paragraphContainer");
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
		$("#articleContent").append(paragraphBox);

		this.bindControl(paragraphBox);
	},
	edit: function(paragraphContainer, controlPanel){
		controlPanel.hide();
		$(".controlPanel a[data-control = edit]").each(function(){
			$(this).unbind();
		});

		var editPanel = $("<div>");
		var editContent = paragraphContainer.children("p:first").hide().html().replace(/<br[ \/]*>/g, "\n");

		var contentLink = editContent.match(/^\<a([\S\s]+)href\=\"([\S\s]+)\"\>(.+)\<\/a\>/);

		if(contentLink){
			contentLink.aLink = contentLink[2];
			contentLink.aContent = contentLink[3];
			editContent = contentLink.aContent;

			var link = $("<label>");
			link.append("連結: "+contentLink.aLink);
		}

		var textarea = $("<textarea>");
		textarea.val(editContent);

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
			editContent = textarea.val().replace(/\n/g, "<br>");
			if(editContent){
				editPanel.remove();
				controlPanel.show();

				if(contentLink){
					paragraphContainer.children("p:first").show().children("a:first").html(editContent);
				}
				else{
					paragraphContainer.children("p:first").show().html(editContent);
				}

				
				$(".controlPanel a[data-control = edit]").each(function(){
					editor.paragraph.bindEdit(this);
				});
			}
			else{
				alert("請輸入修改內容");
			}
			
		});

		editPanel.append(textarea).append("<br>").append(contentLink? link : "").append("<br>").append(save).append(cancel);
		paragraphContainer.append(editPanel);
	},
	bindControl: function(paragraphBox){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel");

		var edit = $("<a>");
		edit.attr("data-control", "edit");
		edit.append("編輯");
		editor.paragraph.bindEdit(edit);

		var del = $("<a>");
		del.attr("data-control", "del");
		del.append("刪除");
		del.click(function(){
			paragraphBox.remove();
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
	}
};