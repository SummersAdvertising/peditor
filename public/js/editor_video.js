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
		link.attr("id", "newVideoContent").attr("placeholder", "請貼上影片連結").css("width", "320px");
		var br = $("<br>");

		editorChild.append(link).append(br);

		$(".editorContent").append(editorChild);
	},
	add: function(){
		if(!$("#newVideoContent").val()){
			alert("請貼上影片連結");
			return;
		}
		var video = new Object();

		editor.paragraph.show(video);
		editor.resetChild();

		editor.save();
	},
	show: function(paragraph){
		var paragraphBox = $("<div>");
		paragraphBox.addClass("paragraphContainer");
		paragraphBox.attr("data-type", "video");

		var iframe = $("<iframe>");
		iframe.attr("width", "480").attr("height", "290").attr("frameborder", "0").attr("allowfullscreen", "");
		iframe.attr("data-code", paragraph.code);
		iframe.attr("http://www.youtube.com/embed/" + paragraph.code);

		paragraphBox.append(iframe);
	}
};