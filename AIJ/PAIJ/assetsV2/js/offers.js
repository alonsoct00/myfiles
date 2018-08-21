$(document).ready(function() {

    $('.offer-collapsible .offer-place').each(function($i) {

        var tgt = $(this),
            href, type, key;

        (function($i) {

            tgt.unbind('click');
            tgt.bind('click', function(e) {

                e.preventDefault();

                tgt.next().slideToggle('slow', function() {
                    tgt.toggleClass('active');
                    
                }).toggleClass('show');

                

            });

        })($i);

    });


    setTimeout(function(){
        if( $('.offer-scroll .offer-item').get(0) ){
            elemMaxHeight($('.offer-scroll .offer-item .border'));
        }
    }, 1400);

    $(window).bind('resize', function() {

        if( $('.offer-scroll .offer-item').get(0) ){
            elemMaxHeight($('.offer-scroll .offer-item .border'));
        }

    });

    // Se abre la primera opción
    
    setTimeout(function(){
        $('.offer-collapsible .offer-place').eq(0).trigger('click');
    }, 400);
    
    function elemMaxHeight($elem) {

        var maxHeight = 0;

        $elem.css('height', 'auto');
        $elem.each(function() {
            if ($(this).height() > maxHeight) {
                maxHeight = $(this).outerHeight(true);
            }
        });

        $elem.css('height', parseInt( maxHeight ));

    };

    
    $('.offer-place').click(function() {

        var item = this.id;
        var arr = item.split("_");
        var i = arr[1];
        
        var elemtSelect = '#Price_'+i;
        var divSelect = '#From_'+i;

        if($(divSelect).hasClass('active'))
        {
            $(elemtSelect).show("linear");
        }
        else
        {
            $(elemtSelect).hide("linear");
        }
    });
    

});