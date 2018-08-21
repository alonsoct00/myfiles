$(function(){
	
});

function getNumberStar(category){
	var codHtml = "";
	if(category == "1LUX" || category == "1EST"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(category == "2LUX" || category == "2EST"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(category == "3LUX" || category == "3EST"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(category == "4LUX" || category == "4EST"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span>';
	} else if(category == "5LUX" || category == "5EST"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span>';
	} 
	$("#hotelsStarDetail").html(codHtml);
}

function slickImagesDetail(){
	$('.slide-hotel').each(function(key, item) {	
		var $status = $('.pagingInfo');
		$("#slider").has('img').slick({
			arrows: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			lazyLoad: 'ondemand',
			fade: true,
			infinite: true,
			afterChange: function(event, slick, currentSlide, nextSlide) {
				var i = (currentSlide ? currentSlide : 0) + 1;
				$status.text(i + '/' + slick.slideCount);
			}
		});
	});	
}