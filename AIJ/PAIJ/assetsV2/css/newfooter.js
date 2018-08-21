
var width = $(window).width();

if( width < 992 ){
	$('.atn-footer').hide(); 
}
$('.atn-mobile').on('click', function(e){
    e.preventDefault();
    $(this).toggleClass('open');
    $('.atn-footer').slideToggle().toggleClass('hidden');
});					
            
