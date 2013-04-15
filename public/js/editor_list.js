editor.list = {
	init: function(){
		var li = $("<li>");
		li.attr("data-type", "list");
		li.append("插入清單");
		$(".editorList").append(li);
		
		var editorChild = $("<div>");
		editorChild.addClass("editorChild");
		 	
		var initRows = 3;
		var container = $('<ul id="newListContent"></ul>');
		
		for( var i = 0 ; i < initRows; i ++ ) {
			$('<li><input type="text" class="listElement autogrow" /></li>').appendTo( container );
		}
		
		editorChild.append(container);

		$(".editorContent").append(editorChild);
	},
	add: function(){

  	  var inputed = false;
  
  	  var listContents = [];
  
	  $('#newListContent input').each(function() {
	  
		  if ( $( this ).val() ) {
			  inputed = true;
		  } else {
			return;  
		  }
		  
		  listContents.push( $(this).val() );
	  });
	  
	  if ( !inputed ) {	  
			alert("請輸入內容");
			return ;
	  }

		var list = new Object();

		list.content = listContents;

		editor.list.show(list);
		editor.resetChild();

		editor.save();
	},
	show: function(paragraph){	
	
		var paragraphBox = $("<div>");
		paragraphBox.addClass("paragraphContainer");
		paragraphBox.attr("data-type", "list");

		var ulContainer = $("<ul></ul>");
		paragraphBox.append(ulContainer);
		for ( var index in paragraph.content ){
		  var element = paragraph.content[index];
		  
		  $("<li>" + element + "</li>").appendTo(ulContainer);			  
		}
		  
		$("#articleContent").append(paragraphBox);

		this.bindControl(paragraphBox);
	},
	edit: function(paragraphContainer, controlPanel){
		controlPanel.hide();
		$(".controlPanel a[data-control = edit]").each(function(){
			$(this).unbind();
		});
				
		var contentBlock = paragraphContainer.children("ul");
		
		var editPanel = $("<div>");
		var editContainer = $('<ul></ul>');
		
		var elements = paragraphContainer.children("ul").children('li');
		contentBlock.hide();
		
		elements.each(function() {
			var element = $('<li><input type="text" value="' + $(this).html() + '"></li>');
			editContainer.append(element);
		});
		

		var cancel = $("<a>");
		cancel.append("取消");
		cancel.click(function(){
			editPanel.remove();
			controlPanel.show();
			paragraphContainer.children("ul").show();

			$(".controlPanel a[data-control = edit]").each(function(){
				editor.list.bindEdit(this);
			});
		});

		var save = $("<a>");
		save.append("完成");
		save.click(function(){
			controlPanel.show();
			
			var valid_modify = false;
		    
		    var editElements = editContainer.children('li');
		    var elementContainer = paragraphContainer.children('ul');
		    
		    editElements.each(function() {
				var element = $(this);
				var listContent = element.children('input').val();		
				
				if (listContent.length > 0) {
					if (!valid_modify) {
						elementContainer.children("li").remove();
					}
					valid_modify = true;					
					elementContainer.append('<li>' + listContent + '</li>');					
				}
			}); 
		
			if (valid_modify) {				
				editPanel.remove();
				editor.save();
				
				contentBlock.show();
				

				$(".controlPanel a[data-control = edit]").each(function(){
					editor.list.bindEdit(this);
				});
			}
			else{
				alert("請輸入修改內容");
			}
			
		});

		editPanel.append(editContainer).append(save).append(cancel);
		paragraphContainer.append(editPanel);
	},
	bindControl: function(paragraphBox){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel");

		var edit = $("<a>");
		edit.attr("data-control", "edit");
		edit.append("編輯");
		editor.list.bindEdit(edit);

		var del = $("<a>");
		del.attr("data-control", "del");
		del.append("刪除");
		del.click(function(){
			paragraphBox.remove();
			editor.save();3
		});

		controlPanel.append(edit).append(del);
		paragraphBox.prepend(controlPanel);

	},
	bindEdit: function(edit){
		$(edit).bind("click", function(){
			var controlPanel = $(this).parents(".controlPanel");
			var paragraphContainer = $(this).parents(".paragraphContainer");
			editor.list.edit(paragraphContainer, controlPanel);
		});
	},
	pack: function(paragraphContainer){
		var list = new Object();
		
        list.type = "list";
        var elements = [];
        
        $(paragraphContainer).children('ul').children('li').each(function() {
        
	        if ( $(this).html() ) {
		        elements.push($(this).html());
	        }
        });
        
        list.content = elements;

		list.type = "list";
console.log(list);
		return list;
	}
};