editor.video = {
	element: "video",
	init: function(){
		var li = $("<li>");
		li.attr("data-type", "video");
		li.append("插入影片");
		$(".editorList").append(li);

		var editorChild = $("<div>");
		editorChild.addClass("editorChild");
		var link = $("<input>");
		link.attr("id", "newVideoContent").attr("placeholder", "請將整段youtube連結貼到此處").css("width", "320px");
		var preview = $("<div>");
		preview.attr("id", "videoPreview");
		var br = $("<br>");

		editorChild.append(link).append(br).append(preview);


		$(".editorContent").append(editorChild);
	},
	add: function(){
		console.log("add video");
		editor.resetChild();
	},
	show: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.addClass(editor.settings.paragraphBox.className);
		paragraphBox.attr("data-type", "video");

		var iframe = $("<iframe>");
		iframe.attr("width", "480").attr("height", "290").attr("frameborder", "0").attr("allowfullscreen", "");
		iframe.attr("data-code", paragraph.code);
		iframe.attr("http://www.youtube.com/embed/" + paragraph.code);

		paragraphBox.append(iframe);
	}
};