$(document).ready(function(){
	$(function() { $( "#game-chat" ).tabs(); });

	$(".left-pannel").hover(
		function(){ $(this).stop().animate({left:0}, 400); },
		function(){ $(this).stop().animate({left:-($(this).width() - 20)}, 400); }
	);

	$(".right-pannel").hover(
		function(){ $(this).stop().animate({right:0}, 400); },
		function(){ $(this).stop().animate({right:-($(this).width() - 20)}, 400); }
	);

	$('a #dice-tab').bind('click', function(){
		if ($("#dice-wrapper").css("top") != "0px"){
			$("#dice-wrapper").stop().animate({top:0}, 400);
		}
		else{
			$("#dice-wrapper").stop().animate({top:50}, 400);
		}
	});

	$(".left-pannel").animate({left:-($(".left-pannel").width() - 20)}, 400);
	$(".right-pannel").animate({right:-($(".right-pannel").width() - 20)}, 400);

	$("#gameScreen").attr("height",$(window).height() - 200);
	$("#gameScreen").attr("width",$(window).width());

	$(window).resize(function(){
		$("#gameScreen").attr("height", $(window).height() - 200);
		$("#gameScreen").attr("width", $(window).width());
	});

	String.prototype.format = function(){
		var s = this,
		i = arguments.length;

		while (i--){
			s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
		}
		return s;
	};

	String.prototype.endsWith = function(suffix){
		return (this.substr(this.length - suffix.length) === suffix);
	}

	String.prototype.startsWith = function(prefix){
		return (this.substr(0, prefix.length) === prefix);
	}
});