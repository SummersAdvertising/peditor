editor.image = {
	element: "img",
	init: function(){
		var li = $("<li>");
		li.attr("data-type", "image");
		li.append("插入圖片");
		$(".editorList").append(li);

		var editorChild = $("<div>");
		editorChild.addClass("editorChild");

		var form = $("<form>");
		form.attr("accept-charset", "UTF-8").attr("action", "createPhoto").attr("data-remote", "true").attr("enctype", "multipart/form-data").attr("id", "new_photo").attr("method", "post");
		
		var input = $("<input>");
		input.attr("id", "photo_image").attr("name", "photo[image]").attr("type", "file");

		var link = $("<input>");
		link.attr("type", "text").attr("id", "newImageLink").attr("placeholder", "此段落連結至何處（若無請勿輸入）").attr("size", "80");
		
		var br = $("<br>");

		form.append(input).append(br).append(link);
		editorChild.append(form);
		$(".editorContent").append(editorChild);
	},
	add: function(){
		console.log("add img");
		editor.resetChild();
	},
	show: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.attr("data-type", "image");

		var img = $("<img>");
		img.attr("alt", JSON.stringify(paragraph.id));
		img.attr("src", JSON.stringify(paragraph.path));
		img.attr("title", JSON.stringify(paragraph.id));

		paragraphBox.append(img);
		$("#articleContent").append(paragraphBox);
	}
};