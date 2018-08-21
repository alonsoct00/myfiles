jQuery(document).ready(function($) {




//Journey routes behaviors//


    $('.journey-price.departure-journey').click(function() {
        $('input[name="departure-fare"]', this).prop("checked", true);
        $('.journey-price.departure-journey').removeClass('fare-selected');
        $('.route-times.dep').removeClass('route-selected-clicked');
        $(this).addClass('fare-selected');
        $(this).closest('.clearfix-schedules').find('.route-times.dep').addClass('route-selected-clicked');
    });




    $('.journey-price.return-journey').click(function() {
        $('input[name="return-fare"]', this).prop("checked", true);
        $('.journey-price.return-journey').removeClass('fare-selected');
        $('.route-times.ret').removeClass('route-selected-clicked');
        $(this).addClass('fare-selected');
        $(this).closest('.clearfix-schedules').find('.route-times.ret').addClass('route-selected-clicked');
    });



    $('.price').on('mouseenter', function() {
        $(this).closest('.clearfix-schedules').find('.route-times').addClass('route-selected');
    }).on('mouseleave', function() {
        $(this).closest('.clearfix-schedules').find('.route-times').removeClass('route-selected');
    });


//Journey routes behaviors//






//Loyalty behaviors//

    $('select[name="loyalty-program"]').change(function() {
        if ($(this).val() === "1" || $(this).val() === "2" || $(this).val() === "3" || $(this).val() === "4") {
            $(this).closest('.top-loyalty').find('.loyaltymember').slideDown();
        } else {
            $(".loyaltymember").slideUp();
        }
    });






//Special services behaviors//
    $('input:checkbox[name="spservices"]').change(
        function() {
            if ($(this).is(':checked')) {

                $(this).closest('.passenger').find('.special-services').slideDown();

            } else {

                $(this).closest('.passenger').find(".special-services").slideUp();


            }
        });



    




    $('input:checkbox[name="chkallpassengers"]').change(
        function() {
            if ($(this).is(':checked')) {

                $(this).closest('.contact-data').addClass('activecontact');
                $(this).closest('.contact-data input, .general-form-component').addClass('disabled-input');
                $('.contact-data .general-form-component').addClass('disabled-component');



                $('.contact-data input').not('disabled-input').each(function(i) {
                    $(this).attr('disabled', true);
                    //$(this).closest('.general-form-component').addClass('disabled-component');   
                });




                $(this).closest('.passenger').find('.general-form-component').removeClass('disabled-component');
                $(this).closest('.passenger').find('.contact-data input').removeAttr('disabled');




            } else {


                $(this).closest('.contact-data').removeClass('activecontact');
                $('.contact-data input').removeClass('disabled-input');
                $('.contact-data input').removeAttr('disabled');
                $('.contact-data .general-form-component').removeClass('disabled-component');


            }
        });



    if ($('#checkout-03-passengers').hasClass('usa-travel')) {
        $('.contact-data').show();
    }











    $('fieldset.child-passenger').each(function(c)

        {

            $(this).closest('.passenger').find(".if-buy-contact").hide();
            $(this).closest('.passenger').find(".if-buy-contact").remove();
            $(this).closest('.passenger').find(".contact-data").append("<div class='child-migration-form'><p>Formato de autorización de salida de menores, emitido por el Instituto Nacional de Migración <i class='fa fa-check-circle'></i></p><span><a href='#' target=_blank>Generar Formato</a></span></div>");


        });


    $('.infant-passenger').each(function(i)

        {

            $(this).closest('.passenger').find(".if-buy-contact, .top-loyalty").hide();
            $(this).closest('.passenger').find(".if-buy-contact, .top-loyalty").remove();
            $(this).closest('.passenger').find(".contact-data").append("<div class='child-migration-form'><p>Formato de autorización de salida de menores, emitido por el Instituto Nacional de Migración <i class='fa fa-check-circle'></i></p><span><a href='#' target=_blank>Generar Formato</a></span></div>");


        });



    if ($('.general-form-component').hasClass('disabled-component')) {
        $('input.disb, select.disb, button.disb').attr('disabled', true);
    } else { $('input.disb, select.disb, button.disb').attr('disabled', false); }

});


$('select[name="passenger-extras"]').change(
    function() {


        $('.general-form-component').removeClass('disabled-component');
        $('input.disb, select.disb, button.disb').attr('disabled', false);
        $('#table-extras-content').slideDown().removeClass('hidden-component');

    });


$('input:checkbox[name="noservices"]').change(
    function() {
        if ($(this).is(':checked')) {

            $(this).closest('.aditional-top').find('.aditionals-content').slideUp();

            $('.general-form-component').addClass('disabled-component');
            $('input.disb, select.disb, button.disb').attr('disabled', true);

            $('select[name="passenger-extras"], select[name="extras-combo"]').val('');

            $('input:checkbox[name="extraservices"]').removeAttr('checked');


            $('#table-extras-content tr.extra-item').remove();

            return false;




        } else {



            $(this).closest('.aditional-top').find('.aditionals-content').slideDown();

        }






    });






$(document).ready(function() {


//Dates validation behaviors//

    /*Normal Date Validation
    var date = new Date();
    date.setDate(date.getDate() - (365 * 12));*/

    //Old Adult
    var oldadultenddate = new Date();
    oldadultenddate.setDate(date.getDate() - (365 * 65));

    //Child Validation
    var startchilddate = new Date();
    startchilddate.setDate(startchilddate.getDate() - (365 * 11));
    var endchilddate = new Date();
    endchilddate.setDate(endchilddate.getDate() - (365 * 3));

    //Infant Validation
    var startinfantdate = new Date();
    startinfantdate.setDate(startinfantdate.getDate() - (365 * 1.5));
    var endinfantdate = new Date();
    endinfantdate.setDate(endinfantdate.getDate() - 60);




   


    $('.passengerbirth').datepicker({
        autoclose: true,
        language: 'es',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 'decade',
        startDate: '01/01/1950',
        endDate: date
    }).on('change', function() {
        $(this).valid();
    });


    $('.oldadultbirth').datepicker({
        autoclose: true,
        language: 'es',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 'decade',
        startDate: '01/01/1900',
        endDate: oldadultenddate
    }).on('change', function() {
        $(this).valid();
    });


    $('.childbirth').datepicker({
        autoclose: true,
        language: 'es',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 'decade',
        startDate: startchilddate,
        endDate: endchilddate,
        locale: 'es'
    }).on('change', function() {
        $(this).valid();
    });


    $('.infantbirth').datepicker({
        autoclose: true,
        language: 'es',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 'decade',
        startDate: startinfantdate,
        endDate: endinfantdate,
        locale: 'es'
    }).on('change', function() {
        $(this).valid();
    });

//Dates validation behaviors//

    //Payment

    $('.hidden-payment').hide();
    $('.btn-group button').click(function() {
        var target = "#" + $(this).data("target");
        $(".hidden-payment").not(target).hide();
        $(target).slideDown();
    });




    //Aside Scroll behavior//
    $(window).scroll(function() {
        if ($(window).scrollTop() > 300) {
            $('#checkout-resume').addClass('fixedresume');
        } else {
            $('#checkout-resume').removeClass('fixedresume');
        }
    });



//Extras table behaviors//

$('#table-extras-content tr td.remove-this').click(function(){
    $(this).closest('tr.extra-item').remove();
    return false;
});



});




