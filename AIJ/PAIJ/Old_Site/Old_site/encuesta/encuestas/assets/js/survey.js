$(document).ready(function() {






    //Custom delegates functions

    $('#rateServiceBox').delegate('.rateServiceOp', 'click', function() {
        var servOp = $(this);
        // Limpiar selección
        $('#rateServiceBox .rateServiceOp').removeClass('Op_selected');
        // aplicar clase a selección
        servOp.addClass('Op_selected');



        $('#opService').attr("checked", "true");

        $('#opService').val(servOp.attr('id').substring(servOp.attr('id').lastIndexOf('-') + 1));


        var ServiceSelection = $('#opService').val();
        switch (ServiceSelection) {
            case 'servicio_bueno':
                $('#btnContinue').prop('disabled', false).attr('onclick', "").on('click', function() {
                    $('#thanksModal').modal('show');
                });

                $('#thanksModal').on('hidden.bs.modal', function(e) {
                    window.location.href = "http://interjet.com.mx/";
                });

                e.preventDefault();


                break;

            case 'servicio_regular':
                $('#btnContinue').prop('disabled', false).attr('onclick', "window.location='main_options_disabled.html'");
                break;


            case 'servicio_malo':
                $('#btnContinue').prop('disabled', false).attr('onclick', "window.location='main_options_disabled.html'");
                break;


            default:
                $('#btnNext').prop('disabled', true).attr('onclick', "window.location='/'");

                break;
        }

        //console.log( $('#opService').val() );

    });

    $(".surveyCheck").click(function() {

        if (this.checked) {
            $('#btnFinish').prop('disabled', false);

        } else {


        }

    });







    $('#rateAreaBox').delegate('.OpArea', 'click', function() {
        var servOp = $(this);
        // Limpiar selección
        $('#rateAreaBox .OpArea').removeClass('Op_selected');
        // aplicar clase a selección
        servOp.addClass('Op_selected');



        $('#OptArea').attr("checked", "true");

        $('#OptArea').val(servOp.attr('data-area').substring(servOp.attr('data-area').lastIndexOf('-') + 1));


        var ServiceSelection = $('#OptArea').val();
        switch (ServiceSelection) {
            case 'en_compra':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_compra.html'");

                break;

            case 'en_mostrador':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_mostrador.html'");
                break;

            case 'en_abordaje':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_abordaje.html'");
                break;

            case 'en_vuelo':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_vuelo.html'");
                break;


            case 'en_equipaje':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_equipaje.html'");
                break;

            case 'en_llegada':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='en_llegada.html'");
                break;

            case 'demora':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='demoras.html'");
                break;

            case 'supervisor':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='supervisor.html'");
                break;



            default:

                $('#btnNext').prop('disabled', true).attr('onclick', "window.location='/'");

                break;
        }

        //console.log( $('#OptArea').val() );

    });


    $('#collectTimebox').delegate('.OptTime', 'click', function() {
        var servOpTime = $(this);
        // Limpiar selección
        $('#collectTimebox .OptTime').removeClass('OpT_selected');
        // aplicar clase a selección
        servOpTime.addClass('OpT_selected');



        $('#OptTime').attr("checked", "true");

        $('#OptTime').val(servOpTime.attr('data-time').substring(servOpTime.attr('data-time').lastIndexOf('-') + 1));
        $('#btnFinish').prop('disabled', false);


        //console.log($('#OptTime').val());


    });






    $('#BuyOptions').delegate('.optionCheck', 'click', function() {
        var checkBuyOption = $(this);
        $('#BuyOptions .optionCheck').removeClass('Optcheck_selected');
        checkBuyOption.addClass('Optcheck_selected');

        $('#BuyArea').attr("checked", "true");

        $('#BuyArea').val(checkBuyOption.attr('data-value').substring(checkBuyOption.attr('data-value').lastIndexOf('-') + 1));




        var BuyAreaSelection = $('#BuyArea').val();
        switch (BuyAreaSelection) {
            case 'en_callcenter':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='compra_call_center.html'");

                break;

            case 'en_pagina':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='compra_en_pagina.html'");
                break;

            case 'en_oficinas':
                $('#btnNext').prop('disabled', false).attr('onclick', "window.location='compra_en_oficinas.html'");
                break;

            default:

                $('#btnNext').prop('disabled', true).attr('onclick', "window.location='/'");

                break;
        }



    });


    $('#TimeCall').delegate('.optionCheck', 'click', function() {
        var OptCheckV = $(this);
        // Limpiar selección
        $('#TimeCall .optionCheck').removeClass('Optcheck_selected');
        // aplicar clase a selección
        OptCheckV.addClass('Optcheck_selected');



        $('#timeCall').attr("checked", "true");

        $('#timeCall').val(OptCheckV.attr('data-value').substring(OptCheckV.attr('data-value').lastIndexOf('-') + 1));
        $('#timeCall').prop('disabled', false);


        //console.log($('#timeCall').val());


    });

    $('#AtnQuality').delegate('.optionCheck', 'click', function() {
        var OptCheckV = $(this);
        // Limpiar selección
        $('#AtnQuality .optionCheck').removeClass('Optcheck_selected');
        // aplicar clase a selección
        OptCheckV.addClass('Optcheck_selected');



        $('#atnQuality').attr("checked", "true");

        $('#atnQuality').val(OptCheckV.attr('data-value').substring(OptCheckV.attr('data-value').lastIndexOf('-') + 1));
        $('#atnQuality').prop('disabled', false);


        //console.log($('#timeCall').val());

        $('#btnFinish').prop('disabled', false);


    });



    $('#WaitingTime').delegate('.optionCheck', 'click', function() {
        var OptCheckV = $(this);
        // Limpiar selección
        $('#WaitingTime .optionCheck').removeClass('Optcheck_selected');
        // aplicar clase a selección
        OptCheckV.addClass('Optcheck_selected');



        $('#WaitTime').attr("checked", "true");

        $('#WaitTime').val(OptCheckV.attr('data-value').substring(OptCheckV.attr('data-value').lastIndexOf('-') + 1));
        $('#WaitTime').prop('disabled', false);


        //console.log($('#timeCall').val());

        $('#btnFinish').prop('disabled', false);


    });


    $('#FlightType').delegate('.optionCheck', 'click', function() {
        var OptCheckV = $(this);
        // Limpiar selección
        $('#FlightType .optionCheck').removeClass('Optcheck_selected');
        // aplicar clase a selección
        OptCheckV.addClass('Optcheck_selected');



        $('#flightType').attr("checked", "true");

        $('#flightType').val(OptCheckV.attr('data-value').substring(OptCheckV.attr('data-value').lastIndexOf('-') + 1));
        $('#flightType').prop('disabled', false);


         var FlightTypeS = $('#flightType').val();
        switch (FlightTypeS) {
            case 'directo':
                 $('#vuelo_conexion').hide();
                $('#vuelo_directo').show();
                $('#btnFinish').prop('disabled', false).attr('onclick', "window.location='compra_call_center.html'");
               

                break;

            case 'conexion':
                 $('#vuelo_directo').hide();
                $('#vuelo_conexion').show();
                $('#btnFinish').prop('disabled', false).attr('onclick', "window.location='compra_en_pagina.html'");
                break;

            default:

                $('#btnFinish').prop('disabled', true).attr('onclick', "window.location='/'");
                $('.surveysection').hide();

                break;
        }

        $('#btnFinish').prop('disabled', false);


    });






    $('#btnFinish').click(function() {
        jQuery.noConflict();
        $('#thanksModal').modal('show');
    });

       $('.modal-footer > .btn-default').click(function(){

            $('#thanksModal').modal('hide');
            setTimeout(function(){
              window.location.href = "http://interjet.com.mx/";
            }, 1200);


       

    });

    $('#thanksModal').on('hidden.bs.modal', function(event) {
        window.location.href = "http://interjet.com.mx/";
        event.preventDefault();
    });





   


    $('#btnBack').click(function() {
        parent.history.back();
        return false;
    });







    //End document ready   

});




$(window).on('load', function() {

    $("#rateAreaBox .OpArea").each(function() {

    if ($(this).is(".OpDisabled")) {
    $(this).removeClass("OpArea");
}

});






});