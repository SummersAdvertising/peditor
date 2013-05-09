editor.img = {
	setEditor: function(){
		editor.img.photoModel = editor.settings.photoModel;
		editor.img.fileinputID = editor.settings.photoModel + "_" + editor.settings.photoColumn;
		editor.img.fileinputName = editor.settings.photoModel + "[" + editor.settings.photoColumn + "]";
		editor.img.photoUpload = editor.settings.photoUpload;
		editor.img.photoDestroy = editor.settings.photoDestroy;
	},
	initTab: function(){
		var li = $("<li>");
		li.attr("data-type", "img").attr("id", "tab-img");
		var a = $("<a>").append("插入圖片");
		var icon = $("<img>").attr("src", "/peditor/img/img.png");
		a.prepend(icon);

		li.append(a);
		$(".editorList").append(li);
	},
	initPost: function(){
		var editorChild = $("<div>");
		editorChild.attr("id", "post-img");
		editorChild.addClass("editorChild");

		var form = $("<form>");
		form.attr("accept-charset", "UTF-8").attr("action", editor.img.photoUpload).attr("data-remote", "true").attr("enctype", "multipart/form-data").attr("id", "new_"+editor.img.photoModel).attr("method", "post");
		
		var input = $("<input>");
		input.attr("id", editor.img.fileinputID).attr("name", editor.img.fileinputName).attr("type", "file");

		form.append(input).append($("<br>"));

		if(editor.settings.linkedimg){
			var link = $("<input>");
			link.attr("type", "text").attr("id", "newImageLink").attr("placeholder", "此段落連結至何處（若無請勿輸入）").attr("size", "80");
			form.append(link);
		}

		editorChild.append(form);
		$(".editorContent").append(editorChild);
	},
	add: function(){
		if(!$("#"+editor.img.fileinputID).val()){
			editor.alert("請選擇要上傳的圖片", "error");
			return ;
		}

		if(editor.img.validate()){
			$("#new_" + editor.img.photoModel).submit();
			
		}
		$("#"+editor.img.fileinputID).val("");

	},
	update: function(image){
		editor.pack(image);
		editor.img.show(image);
	},
	show: function(paragraph){
		var paragraphBox = this.output(paragraph);
		paragraphBox.addClass("paragraphContainer part");

		this.bindControl(paragraphBox, paragraph.id);
	},
	output: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.attr("data-type", "img");

		var img = $("<img>");
		img.attr("alt", paragraph.id);
		img.attr("src", paragraph.path);
		img.attr("title", paragraph.id);

		if(paragraph.link){
			var a = $("<a>");
			a.attr("href", paragraph.link).attr("target", "_blank");
			a.append(img);

			paragraphBox.append(a);
		}
		else{
			paragraphBox.append(img);
		}

		editor.settings.articleSection.append(paragraphBox);

		return paragraphBox;
	},
	pack: function(paragraphContainer){
		var paragraph = new Object();
		var content = $(paragraphContainer).find("img:first");
		if(content.parent("a")){
			paragraph.link = content.parent("a").attr("href");
		}

		paragraph.type = "img";
		paragraph.id = $(content).attr("alt");
		paragraph.path = $(content).attr("src");

        return paragraph;
	},
	validate: function(){
		//validate image upload
		var isSubmit = true;

		var fileinput = document.getElementById(editor.img.fileinputID);
		var uploadSize, uploadType;
        
        if(navigator.userAgent.indexOf("MSIE")>-1){
        	//IE: do nothing.

            // var obj = new ActiveXObject("Scripting.FileSystemObject");
            // uploadSize = obj.getFile(fileinput.value).size;
            // uploadType = obj.getFile(fileinput.value).type;
        }
        else{
        	uploadSize = fileinput.files.item(0).size;
            uploadType = fileinput.files.item(0).type;

            switch(uploadType){
            	case "image/gif":
            	case "image/png":
            	case "image/jpg":
            	case "image/jpeg":
            		isSubmit = true;
            	break;

            	default:
            		isSubmit = false;
            		editor.alert("只能上傳 gif/png/jpg 圖片檔", "error");
            	break;
            }

            if(uploadSize > 5 * 1024 *1024){
            	editor.alert("檔案大小不能超過5MB", "error");
            	isSubmit = false;
            }
        }
        
        return isSubmit;
	},
	bindControl: function(paragraphBox, photoID){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel tool-b");

		var del = $("<a>");
		del.attr("href", editor.img.photoDestroy+"/"+photoID);
		del.attr("data-method", "delete");
		del.attr("data-remote", "true");
		del.append("刪除");
		del.click(function(){
			paragraphBox.remove();
			editor.save();
		});

		controlPanel.append(del);
		paragraphBox.prepend(controlPanel);

	}
};