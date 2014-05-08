editor.table = {
	initTab: function(){
		var li = $("<li>");
		li.attr("data-type", "table").attr("id", "tab-table");
		var a = $("<a>").append("插入表格");
		var icon = $("<img>").attr("src", "/peditor/img/table.png");
		a.prepend(icon);

		li.append(a);
		$(".editorList").append(li);
	},
	initPost: function(){		
		var editorChild = $("<div>");
		editorChild.attr("id", "post-table");
		editorChild.addClass("editorChild");

		var container_new = $('<div id="newTableContent"></div>');
		var container_show = $('<div id="showTableContent"></div>');

		container_new.append('欄：<input id="new_table_column" type="text" />｜列：<input id="new_table_row" type="text" /> <button id="generate_table">產生表格</button>');
		editorChild.append(container_new).append(container_show).append("<br>");

		$(".editorContent").append(editorChild);

		$("#generate_table").click(function(){
			var cols = parseInt($("#new_table_column").val());
			var rows = parseInt($("#new_table_row").val());

			if(cols > 0 && rows > 0){
				container_new.hide();

				var new_table = new Array();

				new_table.push('<table data-resizable-columns-id="editting_table">');

				for(rows; rows > 0; rows--){
					var td = new String();

					for(var c = cols; c > 0; c--){
						td += "<td>&nbsp;</td>";
					}

					new_table.push("<tr>" + td +"</tr>");
				}

				new_table.push('</table>');

				container_show.append('<a id="cancel_table">取消</a><br>').append(new_table.join("")).show();

				$("table[data-resizable-columns-id=editting_table]").editableTableWidget();

				$("#cancel_table").click(function(){
					container_show.html("").hide();
					container_new.show();
				});
			}
			else{
				alert("欄列數不正確，請重新輸入");
			}
			
		});
	},
	add: function(){
		var tableContents = new Array();

		$('table[data-resizable-columns-id=editting_table] tr').each(function() {
			var trContents = new Array();
			$(this).children("td").each(function(){
				trContents.push( editor.filter($(this).html(), editor.HTMLfilter) );
			});

			tableContents.push( trContents );
		});

		var table = new Object();
		table.content = tableContents;

		editor.table.show(table);

		var container_new = $("#newTableContent");
		var container_show = $("#showTableContent");

		container_show.html("").hide();
		container_new.show();

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
		paragraphBox.attr("data-type", "table");

		var tableContainer = $("<table></table>");
		paragraphBox.append(tableContainer);
		for ( var tr in paragraph.content ){
		  var tdArr = paragraph.content[tr];
		  tdArr = jQuery.map( tdArr, function( a ) {
		  	return "<td>" + a + "</td>";
		  });
		  
		  $("<tr>" + tdArr.join("") + "</tr>").appendTo(tableContainer);			  
		}
		  
		editor.settings.articleSection.append(paragraphBox);

		return paragraphBox;
	},
	edit: function(paragraphContainer, controlPanel){
		$(".sortable").sortable('destroy');
		controlPanel.hide();
		$(".controlPanel a[data-control = edit]").each(function(){
			$(this).unbind();
		});
				
		var contentBlock = paragraphContainer.children("table");
		
		var editPanel = $("<div>");
		var editContainer = $("<table></table>");
		contentBlock.hide();

		editContainer.html(contentBlock.html()).find("td").attr("contenteditable", true);

		var cancel = $("<a>");
		cancel.append("取消");
		cancel.click(function(){
			editPanel.remove();
			controlPanel.removeAttr("style");
			paragraphContainer.children("table").show();

			$(".controlPanel a[data-control = edit]").each(function(){
				var type = $(this).parents(".paragraphContainer").data("type");
				editor[type].bindEdit(this);
			});

			bindSortable();
		});

		var save = $("<a>");
		save.append("完成");
		save.click(function(){
			controlPanel.removeAttr("style");

			contentBlock.html(editContainer.html());

			editPanel.remove();
			editor.save();

			contentBlock.show();

			$(".controlPanel a[data-control = edit]").each(function(){
				var type = $(this).parents(".paragraphContainer").data("type");
				editor[type].bindEdit(this);
			});

			bindSortable();
		});

		editPanel.append(editContainer).append(save).append(cancel);
		paragraphContainer.append(editPanel);

		function bindSortable(){
			$( ".sortable" ).sortable({
				placeholder: "space",
				disable: true,
				stop: function( event, ui ) {editor.save();}
			});
		}
	},
	bindControl: function(paragraphBox){
		var controlPanel = $("<div>");
		controlPanel.addClass("controlPanel tool-b");

		var edit = $("<a>");
		edit.attr("data-control", "edit");
		edit.append("編輯");
		editor.table.bindEdit(edit);

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
			editor.table.edit(paragraphContainer, controlPanel);
		});
	},
	pack: function(paragraphContainer){
		var table = new Object();
		
        table.type = "table";

        var tableContents = new Array();
        $(paragraphContainer).children("table:first").find('tr').each(function() {
        	var trContents = new Array();
			$(this).children("td").each(function(){
				trContents.push( editor.filter($(this).html(), editor.HTMLfilter) );
			});

			tableContents.push( trContents );
        });
        
        table.content = tableContents;
		return table;
	}
};