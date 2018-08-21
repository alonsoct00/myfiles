 /*
 * Webslide - v3.2
 * Web Slide - Responsive Mega Menu for Bootstrap 3+
 *
 * Copyright 2016 webthemex
 * http://codecanyon.net/user/webthemex?ref=webthemex
 *
 * Licensed under Envato licenses
 * http://codecanyon.net/licenses/standard
 */
 
 $(function() { 
		
 
		// Append the mobile icon wsdownmenu
		$('.wsdownmenu').append($('<a class="wsdownmenu-animated-arrow"><span></span></a>'));
		$('.wsdownmenu').append($('<div class="wsdownmenu-text">Navigation</div>'));
		
		// Add a <span> to every .wsdownmenu that has a <ul> inside
		
		$('.wsdownmenu-list > li').has('.wsdownmenu-submenu').prepend('<span class="wsdownmenu-click"><i class="wsdownmenu-arrow fa fa-angle-down"></i></span>');
		$('.wsdownmenu-submenu > li').has('ul').prepend('<span class="wsdownmenu-click02"><i class="wsdownmenu-arrow fa fa-angle-down"></i></span>');
		$('.wsdownmenu-submenu-sub > li').has('ul').prepend('<span class="wsdownmenu-click02"><i class="wsdownmenu-arrow fa fa-angle-down"></i></span>');
 		$('.wsdownmenu-submenu-sub-sub > li').has('ul').prepend('<span class="wsdownmenu-click02"><i class="wsdownmenu-arrow fa fa-angle-down"></i></span>');
		$('.wsdownmenu-list li').has('.megamenu').prepend('<span class="wsdownmenu-click"><i class="wsdownmenu-arrow fa fa-angle-down"></i></span>');
		
		
		// Click to reveal 
		$('.wsdownmenu-animated-arrow').click(function(){$('.wsdownmenu-list').slideToggle('slow')
		$(this).toggleClass('wsdownmenu-lines')
		;});
		

		$('.wsdownmenu-click').click(function(){
		$(this).toggleClass('wsdownmenuarrow-rotate').parent().siblings().children().removeClass('wsdownmenuarrow-rotate');
		$(".wsdownmenu-submenu, .megamenu").not($(this).siblings('.wsdownmenu-submenu, .megamenu')).slideUp('slow');
		$(this).siblings('.wsdownmenu-submenu').slideToggle('slow');
		$(this).siblings('.megamenu').slideToggle('slow');
		});
		

		$('.wsdownmenu-click02').click(function(){
		$(this).toggleClass('wsdownmenuarrow-rotate').parent().siblings().children().removeClass('wsdownmenuarrow-rotate');
		$(this).siblings('.wsdownmenu-submenu').slideToggle('slow');
		$(this).siblings('.wsdownmenu-submenu-sub').slideToggle('slow');
		$(this).siblings('.wsdownmenu-submenu-sub-sub').slideToggle('slow');
		});
 		
		
		// Remove inline styles when browser > 767
		window.onresize = function(event) {
			console.log('window resize');
			if($(window).width() > 767){
				$('.wsdownmenu-submenu').removeAttr("style");
 				$('.wsdownmenu-list').removeAttr("style");
 			}
    	};
 
 

 
 });

 