$(document).ready(function(){
  var form = "#edit_article_<%= params[:id]%>";
  //show content
  showContent();

  /*insert a paragraph/photo/video into article content */
  $(".showDiv").click(function(){
    var itemToAdd = "add" + $(this).html().charAt(0).toUpperCase() + $(this).html().slice(1);

    var divToShow = ["addParagraph","addImage","addVideo"];
    for(item in divToShow)
    {
      var display = divToShow[item]==itemToAdd ? "block":"none";
      $("#"+divToShow[item]).css("display", display);
    }
  });

  $("#newParagraph").click(function(){
    if($("#newParagraphContent").val()){
      /* add style to the paragraph */
      var style = 'style="';
      
      if ($('#newParagraphFontSize').val().length > 0) {
        style += "font-size: " + $('#newParagraphFontSize').val() + "px; ";
      }
      
      if ( $('#newParagraphColor').val().length > 0 ) {
        style += "color: " + $('#newParagraphColor').val() + "; ";        
      }
      style += '"';

      var container = $('<div class="paragraphContainer ui-state-default" data-type="paragraph"></div>');
      var content = $("#newParagraphContent").val().replace(/\n/g, "<br />");
                      
      var paragraph = $('<p class="paragraph" ' + style + ' >' + content + "</p>");
      
      if ( $('#newParagraphLink').val().length > 0 ) {
          var contentLink =  $('<a target="_blank" href="' + $('#newParagraphLink').val() + '"></a>').html(paragraph.html());
          paragraph.html('');
          paragraph.append(contentLink);
      }
      
      container.append(paragraph);

      $("#articleContent").append(container);
      $("#newParagraphContent").val('');

      saveArticle();
    }
    else{
      alert("請輸入內容");
    }
  });

  function newImage(photoID,photoPath){
    $("#articleContent").append('<div class="paragraphContainer ui-state-default" data-type="image" data-photo_id="'+ photoID +'"><img src="'+photoPath+'" alt="'+photoID+'" /></div>');
    $(".paragraphContainer").unbind().bind("click",function(){paragraphClick(this);});
    $('#new_photo').each (function(){
      this.reset();
    });

    saveArticle();    
  }

  $("#newVideo").click(function() {    
    if( $("#newVideoContent").val() ){    
      var container = $('<div class="paragraphContainer ui-state-default" data-type="video"></div>');
      var code = getYoutubeCode( $("#newVideoContent").val());
      var paragraph = $('<iframe width="480" height="290" data-code="' + code + '" src="http://www.youtube.com/embed/' + code + '" frameborder="0" allowfullscreen></iframe>');
      container.append(paragraph);

      $("#articleContent").append(container);
      $(container).bind("click",function(){paragraphClick(this);});
      $("#newVideoContent").val('');
      $("#videoPreview").html('');

      saveArticle();
    }
    else{
      alert("請輸入內容");
    }
  });

  // Video preview
  $('#newVideoContent').change(function() {
    var code = getYoutubeCode( $(this).val() );
    $('#videoPreview').append('<iframe width="320" height="220" data-code="' + code + '" src="http://www.youtube.com/embed/' + code + '" frameborder="0" allowfullscreen></iframe>');
  });

  function getYoutubeCode( link ) {
    if ( link != undefined ) {
      return /[a-zA-Z0-9\?\.\:\/]+v=([a-zA-Z0-9_\-]+)&?.*/.exec(link)[1];
    }
    return '';
  }

  /* paragraphs sortable */
  $( ".sortable" ).sortable({
    placeholder: "ui-state-highlight",
    disable: true,
    stop: function( event, ui ) {saveArticle();}
  });

  /* save and update the article */
  function contentPack(){
    var article = "";
    var obj = new Object();
    obj.article = new Array();

    $("#articleContent .paragraphContainer").children().each(function(){
      if($(this).is("p")){
        var p = new Object();
        p.type = "paragraph";
        p.color = $(this).css('color');
        p.fontSize = $(this).css('font-size');

        if ( $(this).children('a').length > 0 ) {         
          p.link = $(this).children('a').attr('href');          
          p.content=$(this).children('a').html();
        } else {
          p.content=$(this).html();         
        }
        console.log(p);

        obj.article.push(p);
      }
      else if ($(this).is("img")){
        var img = new Object();
        img.type = "image";
        img.path = $(this).attr("src");
        img.id = $(this).attr("alt");
        obj.article.push(img);
      }
      else if ($(this).is("iframe")) {
        var video = new Object();
        video.type = "video";
        video.code = $(this).data("code");
        obj.article.push(video);
      }
    });

    article = JSON.stringify(obj);
    $("#article_content").val(article);
  }

  function saveArticle(){
    contentPack();

    $(form).ajaxSubmit({
      beforeSubmit: function(a,f,o) {
      o.dataType = 'json';
    },
    complete: function(XMLHttpRequest, textStatus) {
    },});
  }

  function showContent(){
    if($("#article_content").val())
    {
      var obj = jQuery.parseJSON($("#article_content").val());
      var article = "";
      for(i=0;i<obj.article.length;i++)
      {
        var paragraph = obj.article[i];

        if(JSON.stringify(paragraph.type)=='"paragraph"')
        {
          article = "<div class='paragraphContainer ui-state-default' data-type='paragraph'><p style = ' font-size: "+paragraph.fontSize+"; color: "+paragraph.color+"'>";

          if(paragraph.link){
            article += "<a target='_blank' href='"+paragraph.link+"'>"+jsonReplace(JSON.stringify(paragraph.content)).replace(/\\n/g, "<br />")+"</a></p></div>";
          }
          else{
            article += jsonReplace(JSON.stringify(paragraph.content)).replace(/\\n/g, "<br />")+"</p></div>";
          }
        }
        else if(JSON.stringify(paragraph.type)=='"image"')
        {
          article = "<div  class='paragraphContainer ui-state-default' data-type='image' data-photo_id=\"" + paragraph.id + "\"><img alt=" + JSON.stringify(paragraph.id) + " src=" + JSON.stringify(paragraph.path) + " title=" + JSON.stringify(paragraph.id) + " height='50px' width='50px' /></div>";
        }
        else if (JSON.stringify(paragraph.type)=='"video"') {
          article = "<div  class='paragraphContainer ui-state-default' data-type='video' data-code=\"" + paragraph.code + "\"><iframe width=\"480\" height=\"290\" data-code=\"" + paragraph.code + "\" src=\"http://www.youtube.com/embed/" + paragraph.code+ "\" frameborder=\"0\" allowfullscreen></iframe></div>";
        }

        $("#articleContent").append(article);

        $(".paragraphContainer").unbind().bind("click",function(){          
          paragraphClick(this);          
        });

      }
    }
  }

  function jsonReplace(string){return string.replace(/"([^"]*)"/g, "$1");}
 
 /* adjust order of the paragraphs */
  var removeEditPath = false;
  function paragraphClick(paragraph){
    $("#elementControl").remove();
    var controlDiv;
    if(!removeEditPath){$("#editDiv").remove();}
    
    removeEditPath=false;

    if($(paragraph).data("type") == "paragraph") {
      controlDiv = '<div id="elementControl"><span id="elementDel">刪除</span> | <span id="elementEdit">編輯</span> | </div>';
    }
    else if( $(paragraph).data("type") == "image" ) {
      controlDiv = '<div id="elementControl"><a class="photoDelete" href="/articles/<%= params[:id]%>/deletePhoto/' + $(paragraph).data("photo_id") + '" data-method="delete" rel="nofollow" data-remote="true">刪除</a>';
    }
    else if( $(paragraph).data("type") == "video" ) {
      controlDiv = '<div id="elementControl"><span id="elementDel">刪除</span>';
    }

    $(paragraph).prepend(controlDiv);
    bindControls();
  }

  function bindControls(){
    $("#elementDel").unbind().click(function(){
      $(this).parent().parent().remove();
      saveArticle();
    });

    $("#elementEdit").unbind().click(function(event){
      var paragraph = $(this).parent().next();
      if(!$("#editDiv").html()){
        $(this).parent().parent().append("<div id='editDiv'><textarea id='editedContent' rows='4' cols='50'></textarea><label /><br /><input type='button' id='editFinish' value='完成修改'/></div>");

        //avoid content in textbox can't not be editted due to the using of jquery sortable
        //$( "#editedContent" ).disableSelection();
        event.stopImmediatePropagation();
      } 

      var contentLink = $(paragraph).html().match(/^\<a([\S\s]+)href\=\"([\S\s]+)\"\>(.+)\<\/a\>/);
      
      if(contentLink){
        contentLink.aLink = contentLink[2];
        contentLink.aContent = br2nl(contentLink[3]);
      }

      $("#editedContent").html(contentLink? contentLink.aContent : br2nl($(paragraph).html()) );
      $("#editDiv label").html("連結網址：" + (contentLink? contentLink.aLink : "")).css("display", contentLink? "inline-block" : "none");

      removeEditPath = true;
      $('textarea').bind('click.sortable mousedown.sortable',function(ev){ ev.target.focus();});

      $(".paragraphContainer").unbind();

      $("#editedContent").html(br2nl($(paragraph).html()));
      $(paragraph).hide();

      $("#editFinish").click(function(){
        if($("#editedContent").val()){
          var content = (contentLink? '<a target="_blank" href="'+contentLink.aLink+'">': "" )+ nl2br($("#editedContent").val())+ (contentLink? '</a>': "");
          $(this).parent().prev().html(content).show();
          $("#editDiv").remove();

          $(".paragraphContainer").unbind().bind("click",function(){paragraphClick(this);});

          saveArticle();
        }
      });      
    });
  }
  function nl2br(string) { return string.replace(/\n/g, "<br />");}
  function br2nl(string) { return string.replace(/<br[ \/]*>/g, "\n");}
});