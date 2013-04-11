editor.image = {
	photoModel: editor.settings.photoModel,
	fileinputID: editor.settings.photoModel+"_"+editor.settings.photoColumn,
	fileinputName: editor.settings.photoModel+"["+editor.settings.photoColumn+"]",
	photoUpload: editor.settings.photoUpload,
	photoDestroy: editor.settings.photoDestroy,
	init: function(){
		var li = $("<li>");
		li.attr("data-type", "image");
		li.append("插入圖片");
		$(".editorList").append(li);

		var editorChild = $("<div>");
		editorChild.addClass("editorChild");

		var form = $("<form>");
		form.attr("accept-charset", "UTF-8").attr("action", editor.image.photoUpload).attr("data-remote", "true").attr("enctype", "multipart/form-data").attr("id", "new_"+editor.image.photoModel).attr("method", "post");
		
		var input = $("<input>");
		input.attr("id", editor.image.fileinputID).attr("name", editor.image.fileinputName).attr("type", "file");

		var link = $("<input>");
		link.attr("type", "text").attr("id", "newImageLink").attr("placeholder", "此段落連結至何處（若無請勿輸入）").attr("size", "80");
		
		var br = $("<br>");

		form.append(input).append(br).append(link);
		editorChild.append(form);
		$(".editorContent").append(editorChild);
	},
	add: function(){
		if(!$("#"+editor.image.fileinputID).val()){
			alert("請選擇要上傳的圖片");
			return ;
		}

		if(editor.image.validate()){
			$("#new_" + editor.image.photoModel).submit();
			
		}
		$("#"+editor.image.fileinputID).val("");

	},
	update: function(image){
		editor.pack(image);
		editor.image.show(image);
	},
	show: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.addClass("paragraphContainer");
		paragraphBox.attr("data-type", "image");

		var img = $("<img>");
		img.attr("alt", paragraph.id);
		img.attr("src", paragraph.path);
		img.attr("title", paragraph.id);
		img.css("max-height", "200px");

		if(paragraph.link){
			var a = $("<a>");
			a.attr("href", paragraph.link).attr("target", "_blank");
			a.append(img);

			paragraphBox.append(a);
		}
		else{
			paragraphBox.append(img);
		}

		$("#articleContent").append(paragraphBox);

		this.bindControl(paragraphBox, paragraph.id);
	},
	pack: function(paragraphContainer){
		var paragraph = new Object();
		var content = $(paragraphContainer).find("img:first");
		if(content.parent("a")){
			paragraph.link = content.parent("a").attr("href");
		}

		paragraph.type = "image";
		paragraph.id = $(content).attr("alt");
		paragraph.path = $(content).attr("src");

        return paragraph;
	},
	validate: function(){
		//validate image upload
		var isSubmit = false;

		var fileinput = document.getElementById(editor.image.fileinputID);
		if(fileinput.files[0]){
			var typeAllowed = ["gif", "png", "jpg", "jpeg"];
			(function() {
				outerloop:
				for(var item in typeAllowed){
					if(fileinput.files[0].type.indexOf(typeAllowed[item]) != -1){
						isSubmit = true;
						break outerloop;
					}
				}
			})();

			if(fileinput.files[0].size > 5 * 1024 *1024){
				isSubmit = false;
			}
		}

		return isSubmit;
	},
	bindControl: function(paragraphBox, photoID){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel");

		var del = $("<a>");
		del.attr("href", editor.image.photoDestroy+"/"+photoID);
		del.attr("data-method", "delete");
		del.attr("data-remote", "true");
		del.append("刪除");
		del.click(function(){
			paragraphBox.remove();
			editor.save();
		});

		controlPanel.append(del);
		paragraphBox.prepend(controlPanel);

	},
};