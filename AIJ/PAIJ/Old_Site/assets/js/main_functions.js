jQuery(document).ready(function($) {










    ///Other input Validations

    //Adding class for each input according type

    $('.reg-zipcode,.reg-mobile,.reg-phone,.Cardzipcode,.Cardnumber,.refund-data-mobile,.refund-data-phone,.refund-data-zipcode,.phoneNumber,.ZipCode').addClass('onlynumbers');


    //Only dates numbers /
    $('.dateonly, .birth_day').bind('keyup blur', function(event) {
        var datte = $(this);
        datte.val(datte.val().replace(/^[a-zA-Z\/]/g, ''));
        datte.val(datte.val().replace(/[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{5}$/g, ''));
        //datte.val(datte.val().replace(/^^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g, ''));


        var inputLength = event.target.value.length;
        if (event.keyCode != 8) {
            if (inputLength === 2 || inputLength === 5) {
                var thisVal = event.target.value;
                thisVal += '/';
                $(event.target).val(thisVal);
            }
        }

    });



    //Only letters
    $('.alphaonly').bind('keyup blur', function() {
        var alph = $(this);
        alph.val(alph.val().replace(/[^a-zA-Z\-\?\'\s]/g, ''));
    });

    //Just alpha+numbers (letters+numbers)-characters
    $('.onlytxtalph').bind('keyup blur', function() {
        var txtalph = $(this);
        txtalph.val(txtalph.val().replace(/[^a-zA-Z0-9\s]/g, ''));
    });

    //Just ReservationKey
    $('.reservationkey').bind('keyup blur', function() {
        this.value = this.value.toUpperCase();
        var txtalph = $(this);
        txtalph.val(txtalph.val().replace(/[^A-Z0-9\s]/g, ''));
    });

    //Only numbers
    $('.onlynumbers').bind('keyup blur', function() {
        var numb = $(this);
        numb.val(numb.val().replace(/[^0-9\s]/g, ''));
    });


    //Only alphanumerics+Characters
    $('.onlyalphanumber').bind('keyup blur', function() {
        var node = $(this);
        node.val(node.val().replace(/[^A-Za-z0-9\u00E0-\u00FC\-\'\s]/g, ''));
    });




    //JQuery exists function parent
    jQuery.fn.exists = function() {
        return this.length > 0;
    };

    //Mash meni init
    $('.mash-menu').mashableMenu({
        separator: true, //-- Options (true) or (false). This option is used to show the vertical line between menu list items
        ripple_effect: true, //-- Options (true) or (false). This option is used to on - off the google ripple effect on menu items. Which is shown on mouse click
        search_bar_hide: false, //-- Options (true) or (false). This option is used to hide the search bar
        top_fixed: false, //-- Options (true) or (false). This option is used to fixed the menu top of the screen. Note: If this option becomes true then the sticky_header option will not work
        full_width: true, //-- Options (true) or (false). This option is used to make the menu full with
        trigger: 'hover', //-- Options (click) or (hover). This option is used to showing the drop down on mouse click or mouse hover
        /* VERTICAL TABS */
        vertical_tabs_trigger: 'hover', // Options (click) or (hover). This option is used to showing the vertical tabs on mouse click or mouse hover
        vertical_tabs_effect_speed: 800, // Value in milliseconds. This option is used to change the vertical tabs showing or hiding speed
        /* RESPONSIVE TABS */
        //responsive_tabs_effect_speed   : 200,       // Value in milliseconds. This option is used to change the responsive tabs showing or hiding speed
        /* DROP DOWN */
        drop_down_effect_in_speed: 100, // Value in milliseconds. This options is used to change the drop downs showing speed
        drop_down_effect_out_speed: 100, // Value in milliseconds. This option is used for change the drop downs hiding speed
        drop_down_effect_in_delay: 100, // Value in milliseconds. This option is used to change the drop downs showing delay speed. It means drop down shows after some time
        drop_down_effect_out_delay: 100, // Value in milliseconds. This option is used to change the drop downs hiding delay speed. It means drop down hides after some time
        outside_close_dropDown: true, // Options (true) or (false). This option is used to hide the showing drop downs when user click outside the menu
        /* STICKY HEADER */
        sticky_header: false, //-- Options (true) or (false). This option is used to make the menu sticky on top of the screen on desktop mode. When user scroll down or reach the specific height
        sticky_header_height: 768, //-- Value in px. This option is used to define the sticky header height on desktop mode.
        sticky_header_animation_speed: 100, //-- Value in milliseconds. This option is used to change the sticky header animation effect speed on desktop mode
        /* INTERNAL LINKS */
        internal_links_enable: true, // Options (true) or (false). This option is used to enable the internal links target buttons to show the drop downs
        internal_links_toggle_drop_down: true, // Options (true) or (false). This option is used for toggle. Means show or hide the drop down with same button. If this option is not true. The drop down is not hide with click on same button
        internal_links_target_speed: 400, // Value set in milliseconds. This option is used to internal links target animation speed.
        /* MOBILE SETTINGS */
        mobile_search_bar_hide: false, //-- Options (true) or (false). This option is used to hide the search bar on mobile mode
        mobile_sticky_header: false, //-- Options (true) or (false). This options is used to make the menu sticky on top of the screen on mobile mode
        mobile_sticky_header_height: 100, //-- Value in milliseconds. This option is used to change the sticky header animation effect speed on mobile mode
        /* MEDIA QUERY WIDTH */
        media_query_max_width: 920 //-- This is media query max width in px unit. Which is Used for mobile screen. Don't change if you don't know about media query
    });







    $('.navbar-toggle').click(function() {
        $(".mash-list-items, .mash-search-bar, .mash-menu-club-interjet, .mash-help-items-mobile").slideToggle("fast");
        $(".mash-menu .vertical-tabs-content-container > a").removeClass("active");
    });

    function inicio() {
        var w = $(window).width();
        if (w > 768) {
            desktop();
        } else {
            mobile();
        }
    }

    function mobile() {

    }

    function desktop() {
        $('#club-interjet-menu, #bottom-navigation').remove();
    }


    //Search Budget scripts

    $('#list').click(function(event) {
        event.preventDefault();
        $('#travels-found .item').addClass('list-group-item');
    });
    $('#grid').click(function(event) {
        event.preventDefault();
        $('#travels-found .item').removeClass('list-group-item');
        $('#travels-found .item').addClass('grid-group-item');
    });

    $('.share-btn').click(function() {
        $("i", this).toggleClass("fa-share-alt fa-close");
    });



    $('.ad-share').on('click', function() {
        $parent_box = $(this).closest('.travel');
        //$parent_box.siblings().find('.share-this').slideUp('500', "swing");

        $parent_box.find('.share-this').slideToggle('1000', "swing", function() {

            $(".social-share li").each(function(i) {
                $(this).delay(i * 100).fadeIn();
            });


        });
        $parent_box.find('.ad-share').toggleClass("thumbnail-share thumbnail-share-off");
        $parent_box.find('.social-share li').hide();
    });

    $('.btn-switch-view').on('click', function() {
        $(this).addClass('btn-switch-view-selected').siblings().removeClass('btn-switch-view-selected');
    });

    //End

    $(function() {

        //selected blue color

        $('select.form-control.dropdownjs').on('change', function() {

            $(this).addClass('selected');

        });

        $('input.currency, .currency-input').on('click focusin', function() {
            $(this).closest('span').addClass('selected');
            $(this).addClass('selected');
            this.value = '';


        });

        $('[data-toggle="tooltip"]').tooltip({
            //trigger: 'click'
        });

    });





    //Currency inputs auto $ symbol and comma separator
    (function($) {
        $.fn.currencyInput = function() {
            this.each(function() {
                var wrapper = $("<div class='currency-input' />");
                $(this).wrap(wrapper);
                $(this).after("<span class='currency-symbol'>$</span>");
                //currency denomination 
                //$(this).after("<span class='currency-denom'>MXN</span>");
                $(this).val(parseFloat($(this).val()).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));

                $(this).change(function() {
                    var min = parseFloat($(this).attr("min"));
                    var max = parseFloat($(this).attr("max"));

                    var value = parseFloat($(this).val().replace(/,/g, ''));
                    if (value < min)
                        value = min;
                    else if (value > max)
                        value = max;
                    $(this).val(value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }));
                });
            });
        };
    })(jQuery);








    //Ratings +init


    /*$(function() {
        $('.rating').on('change', function() {
            //acciones-rating
        });
    });


    $('.rating').rating({
        clearable: false
    });*/








    //Currency inputs initate
    $('input.currency').currencyInput();


    /*Outdated browser init

    outdatedBrowser({
                bgColor: '#6caddf;',
                color: '#ffffff',
                lowerThan: 'borderImage',
                languagePath: 'assets/js/lang/es.html'
            });*/



    //Login Slide Init


    $('.forgotpss > a').on('click', function(e) {
        $('#forgotPassword').slideDown();
        e.preventDefault();
    });

    $('.disallowForgot,.resetmodal').on('click', function() {
        $('#forgotPassword').slideUp();
    });


    //Validate all login fields are filled

    $(window).load(function() {
        var $inputCI = $('#loginCI input.textfield'),
            $buttonCI = $('.btn-login');
        $buttonCI.attr('disabled', true);

        $inputCI.keyup(function() {
            var trigger = false;
            $inputCI.each(function() {
                if (!$(this).val()) {
                    trigger = true;
                }
            });
            trigger ? $buttonCI.attr('disabled', true) : $buttonCI.removeAttr('disabled');
        });


        var $inputAG = $('#loginAG input.textfield'),
            $buttonAG = $('.btn-login');
        $buttonAG.attr('disabled', true);

        $inputAG.keyup(function() {
            var trigger = false;
            $inputAG.each(function() {
                if (!$(this).val()) {
                    trigger = true;
                }
            });
            trigger ? $buttonAG.attr('disabled', true) : $buttonAG.removeAttr('disabled');
        });





    });







    //add * to input requeried
    $('.general-form-component').find('.form-control').each(function() {
        if ($(this).prop('required')) {
            $(this).closest('.general-form-component').find('label').after('<span class="req">*</span>');
        }
    });









    //Club Interjet Enrollment Functions--------------->

    //Custom DATE validations and functions



    //Register/Enrolment Date Validation
    var regdate = new Date();
    regdate.setDate(regdate.getDate() - (365 * 12));

    //Normal Date Validation
    var date = new Date();
    date.setDate(date.getDate() - (365 * 12));


    //1 year Date Validation
    var newYearDate = new Date();
    newYearDate.setDate(newYearDate.getDate() + (365 * 12));



    $('.contactbirth').datepicker({
        autoclose: true,
        leftArrow: '<i class="fa fa-arrow-left"></i>',
        rightArrow: '<i class="fa fa-arrow-right"></i>',
        language: 'es',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 'decade',
        startDate: '01/01/1950',
        endDate: regdate
    }).on('change', function() {
        $(this).valid();
    });


    var validFlightdate = new Date();
    validFlightdate.setDate(validFlightdate.getDate() - (365));


    $('.flightDate').datepicker({
        autoclose: true,
        leftArrow: '<i class="fa fa-arrow-left"></i>',
        rightArrow: '<i class="fa fa-arrow-right"></i>',
        language: 'es',
        orientation: 'right',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        startView: 0,
        startDate: validFlightdate,
        endDate: new Date()
    }).on('change', function() {
        $(this).valid();
    });





    ///Canceled flights DATE Validations***/

    //Allow select 2 days between a date***/
    var dateToday = new Date();
    dateToday.setDate(dateToday.getDate() - (2));

    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() + (2));

    var retlastDay = new Date();
    retlastDay.setDate(retlastDay.getDate() + (4));

    var now = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0, 0, 0, 0);



    /**********************CANCELED Flights Behaviors*********************************/
    //Checkin and return date flights validation





    var checkin = $('#Datefrom').datepicker({


        beforeShowDay: function(date) {
            return date.valueOf() >= now.valueOf();
        },
        autoclose: true,
        language: 'es',
        leftArrow: '<i class="fa fa-arrow-left"></i>',
        rightArrow: '<i class="fa fa-arrow-right"></i>',
        orientation: 'right',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        endDate: lastDay

    }).on('changeDate', function(ev) {
        if (ev.date.valueOf() > checkout.datepicker("getDate").valueOf() || !checkout.datepicker("getDate").valueOf()) {

            var newDate = new Date(ev.date);
            newDate.setDate(newDate.getDate() + 1);
            checkout.datepicker("update", newDate);

        }
        $('#Dateto')[0].focus();
    });


    var checkout = $('#Dateto').datepicker({
        beforeShowDay: function(date) {
            if (!checkin.datepicker("getDate").valueOf()) {
                return date.valueOf() >= new Date().valueOf();
            } else {
                return date.valueOf() > checkin.datepicker("getDate").valueOf();
            }
        },
        autoclose: true,
        language: 'es',
        leftArrow: '<i class="fa fa-arrow-left"></i>',
        rightArrow: '<i class="fa fa-arrow-right"></i>',
        orientation: 'right',
        changeMonth: true,
        changeYear: true,
        format: 'dd/mm/yyyy',
        endDate: retlastDay

    }).on('changeDate', function(ev) {});





    $.fn.checkDate = function() {

        var startDate = $('#Datefrom').val();
        var endDate = $('#Dateto').val();

        if (endDate < startDate) {


            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal...</span></p><p>La fecha del vuelo de regreso no puede ser anterior al vuelo de ida. Por favor revisa estos datos e intenta nuevamente.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });
        } else {

            window.location.href = "/branches/Cancelaciones/Cambio-itinerario-fechas.html";
        }

    };

    $('#Dateto,#Datefrom').keydown(function() {
        return false;
    });


    $('#SearchNewFlights').on('click', function() {

        $.fn.checkDate();

    });







    //Al Fields are valid and filled

    $('#ticketRecovery input').on('blur keyup', function() {
        if ($("#ticketRecovery").valid()) {
            $('#findPromo').attr('disabled', false);

        } else {
            $('#findPromo').attr('disabled', true);

        }
    });












    //Error messages Canceled Flights

    $('#findPromo').on('click', function() {

        //Ejemplo de validación con clave de reservación

        var invalidkeyreservation = ['ABCDEF', 'GHIJKM', 'LMNOPQ'];
        var checkedreserve = ["A1B2CC", "T1T0TD", "INT3RJ"];


        if (invalidkeyreservation.indexOf($("input.reservationkey").val()) > -1) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal...</span></p><p>No pudimos encontrar tu reservación dentro de nuestros vuelos afectados. Por favor, revisa la información e intenta nuevamente.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else if (checkedreserve.indexOf($("input.reservationkey").val()) > -1) {

            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal...</span></p><p>Tu reservación ya ha sido modificada, aceptada o reembolsada, por lo que no es posible realizar ningún ajuste a través de esta página. Si requieres algún cambio, por favor comunícate a nuestro <i>call center</i> donde podrán ayudarte.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });


        } else {
            window.location.href = "/branches/Cancelaciones/Seleccion.html";

        }


    });

    //Sucess message for credit card refund


    $('#confirmCardRefound').on('click', function() {

        //Ejemplo de mensaje de confirmación, el comportamiento sucede si el panel del pago existe.
        if ($(".paymentDetails").exists()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>Transacción exitosa</span></p><p>La solicitud de reembolso ha sido recibida. <br/>En un lapso de 15 a 20 días hábiles podrás verificar el rembolso directamente en la tarjeta de crédito donde se realizó la compra. <br/>Conserva la clave de reservación, ya que será el dato que te permitirá conocer el estatus del reembolso a través <u>del área de Atención a Clientes</u>.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal...</span></p><p>Ha habido un error al intentar realizar tu reembolso, por favor comunícate al: ... para que podamos ayudarte.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }

    });



    //Validación formulario reembolso

    $('#TransferData input').on('blur keyup', function() {
        if ($("#TransferData").valid()) {
            $('#validRefundData').attr('disabled', false);

        } else {
            $('#validRefundData').attr('disabled', true);

        }
    });


    $('#validRefundData').on('click', function() {


        if ($("#TransferData").valid()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>Transacción exitosa</span></p><p>Los datos se registraron correctamente y el reembolso se efectuará en un periodo de 15 a 20 días hábiles.<br/>Conserva tu clave de reservación para conocer el estatus de tu reembolso a través de nuestro call center.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Lo sentimos!</span></p><p>Los datos no coinciden con la información de la institución bancaría, por lo que se realizará un cargo en el monto total del reembolso.<br/>Intenta nuevamente ingresando los datos exactamente como aparecen en el documento proporcionado por tu banco o comunícate con nuestro call center para recibir ayuda.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }


    });



    /**********************END CANCELED Flights Behaviors*********************************/






    ////Valid Froms and Alert messages Bootstrap Dialog----**/
    //**Documentacion: https://nakupanda.github.io/bootstrap3-dialog**/




    $('#registerUser input').on('blur keyup', function() {
        if ($("#registerUser").valid()) {
            $('#registerJB').prop('disabled', false);

        } else {
            $('#registerJB').prop('disabled', true);

        }
    });





    $('#registerJB').on('click', function() {


        if ($("#registerUser").valid()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>¡Registro exitoso!</span></p><p>Ya eres parte de Club Interjet, comienza a disfrutar de todos sus beneficios.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Continuar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });
        }


    });






    $('#addtheFlight input').on('blur keyup', function() {
        if ($("#addtheFlight").valid()) {
            $('#AddaFlight').prop('disabled', false);

        } else {
            $('#AddaFlight').prop('disabled', true);

        }
    });





    $('#AddaFlight').on('click', function() {


        if ($("#addtheFlight").valid()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>¡Felicidades!</span></p><p>Tu vuelo se ha añadido y has acumulado <span>n</span> puntos</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Lo sentimos!</span></p><p>Ha habido un error al agregar tu vuelo, verifica que no haya vencido, o que no lo hayas ingresado anteriormente.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }




    });







    $('#UpdatePassword input').on('blur keyup', function() {
        if ($("#UpdatePassword").valid()) {
            $('.UpdatePass').prop('disabled', false);

        } else {
            $('.UpdatePass').prop('disabled', true);

        }
    });



    $('.UpdatePass').on('click', function() {
        BootstrapDialog.show({
            title: '',

            message: function(dialog) {
                var $content = $('<div class="changeMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Cuidado!</span></p><p>Estás a punto de actualizar tu contraseña, <br/> ¿Deseas continuar? </p></div>');


                return $content;
            },
            cssClass: 'bootDialog warning-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_WARNING,

            draggable: true,
            onhidden: function(eventSubmit) {

                document.getElementById('UpdatePassword').submit(function() {

                    // puedes poner una funcion después del submit
                    //console.log('OldPss: '+$('input[name="old_password"]').val() + ' NewPss: '+ $('input[name="new_password"]').val());
                });
            },

            buttons: [{
                    label: 'Cancelar',
                    id: 'btn-close',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();
                    }
                },


                {
                    label: 'Continuar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-external save-data',
                    action: function(dialog) {
                        var cancelButton = dialog.getButton('btn-close');
                        var acceptButton = dialog.getButton('btnAccept');
                        dialog.setMessage('<div class="Sucessmsg"><i class="fa fa-check-circle-o"></i><p>Tu contraseña ha sido actualizada con éxito</p></div><button class="btn cancel-btn" id="btnClose">Cerrar</button>');
                        dialog.setType(BootstrapDialog.TYPE_SUCCESS);
                        cancelButton.hide();
                        acceptButton.hide();
                        $('#btnClose').on('click', {
                            dialog: dialog
                        }, function(event) {
                            dialog.close();

                        });


                    }


                }
            ]
        });

    });







    $('#EditProfile input, #EditProfile select').on('blur keyup', function() {
        if ($("#EditProfile").valid()) {
            $('.UpdateProfile').prop('disabled', false);

        } else {
            $('.UpdateProfile').prop('disabled', true);

        }
    });

    $('#close-edit').click(function() {
        $('#EditProfile')[0].reset();
    });


    $('.UpdateProfile').on('click', function() {
        BootstrapDialog.show({
            title: '',

            message: function(dialog) {
                var $content = $('<div class="changeMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Cuidado!</span></p><p>Estás a punto de cambiar tus datos personales, <br/> verfica que todo este bien. </p></div>');


                return $content;
            },
            cssClass: 'bootDialog warning-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_WARNING,

            draggable: true,

            buttons: [{
                    label: 'Cancelar',
                    id: 'btn-close',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();
                    }
                },

                {
                    label: 'Continuar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-external save-data',
                    action: function(dialog) {
                        var cancelButton = dialog.getButton('btn-close');
                        var acceptButton = dialog.getButton('btnAccept');
                        dialog.setMessage('<div class="Sucessmsg"><i class="fa fa-check-circle-o"></i><p>Tus datos han sido actualizados con éxito</p></div><button class="btn cancel-btn" id="btnClose">Cerrar</button>');
                        dialog.setType(BootstrapDialog.TYPE_SUCCESS);
                        cancelButton.hide();
                        acceptButton.hide();
                        $('#btnClose').on('click', {
                            dialog: dialog
                        }, function(event) {
                            dialog.close();

                        });

                    }

                }
            ]
        });

    });



    $('.UpdateCCard').on('click', function() {
        BootstrapDialog.show({
            title: '',

            message: function(dialog) {
                var $content = $('<div class="changeMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Cuidado!</span></p><p>Estás a punto de cambiar los datos de esta tarjeta, <br/> verfica que todo este bien. </p></div>');


                return $content;
            },
            cssClass: 'bootDialog warning-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_WARNING,

            draggable: true,

            buttons: [{
                    label: 'Cancelar',
                    id: 'btn-close',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();
                    }
                },

                {
                    label: 'Continuar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-external save-data',
                    action: function(dialog) {
                        var cancelButton = dialog.getButton('btn-close');
                        var acceptButton = dialog.getButton('btnAccept');
                        dialog.setMessage('<div class="Sucessmsg"><i class="fa fa-check-circle-o"></i><p>Los datos de la tarjeta han sido actualizados con éxito</p></div><button class="btn cancel-btn" id="btnClose">Cerrar</button>');
                        dialog.setType(BootstrapDialog.TYPE_SUCCESS);
                        cancelButton.hide();
                        acceptButton.hide();
                        $('#btnClose').on('click', {
                            dialog: dialog
                        }, function(event) {

                            dialog.close();

                        });

                    }

                }
            ]
        });

    });







    $('.NewCreditCard input, .NewCreditCard select').on('blur keyup', function() {
        if ($(".NewCreditCard").valid()) {
            $('.addnewCard').prop('disabled', false);

        } else {
            $('.addnewCard').prop('disabled', true);

        }
    });


    $('.addnewCard').on('click', function() {

        if ($('.NewCreditCard').valid()) {


            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>¡Felicidades!</span></p><p>Tu tarjeta ha sido registrada con éxito</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });
        } else {

            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Lo sentimos!</span></p><p>Ha ocurrido un error al procesar tu petición, verifica los datos que ingresaste.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }


    });









    $('.remove-card').click(function() {

        $(this).closest('.registeredCard').addClass('toRemove').siblings().removeClass('toRemove');

    });

    $('.btn.btn-remove.remove-card').on('click', function() {
        BootstrapDialog.show({
            title: '',
            message: $('<div class="removeCard"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Cuidado!</span></p><p>Estás a punto de eliminar los datos de tu tarjeta y esta acción no puede ser revertida. <br/> ¿Deseas continuar? </p></div>'),
            cssClass: 'bootDialog warning-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_WARNING,

            draggable: true,

            onhide: function(event) {
                $('.registeredCard').removeClass('toRemove');
            },

            buttons: [{
                    label: 'Cancelar',
                    id: 'btn-close',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();
                    }
                },

                {
                    label: 'Continuar',
                    id: 'btnRemoveCard',
                    cssClass: 'btn btn-external save-data removeCard',
                    action: function(dialog) {

                        if ($('.registeredCard').hasClass('toRemove')) {


                            $('.registeredCard.toRemove').hide(700);
                        }

                        var cancelButton = dialog.getButton('btn-close');
                        var acceptButton = dialog.getButton('btnRemoveCard');
                        dialog.setMessage('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i></p><p>La tarjeta ha sido eliminada</p><button class="btn cancel-btn" id="btnClose">Cerrar</button></div>');
                        dialog.setType(BootstrapDialog.TYPE_SUCCESS);
                        cancelButton.hide();
                        acceptButton.hide();
                        $('#btnClose').on('click', {
                            dialog: dialog
                        }, function(event) {
                            dialog.close();

                        });
                    }
                }
            ]
        });
    });


    $('.endSession').on('click', function() {
        BootstrapDialog.show({
            title: '',

            message: function(dialog) {
                var $content = $('<div class="changeMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>Cerrar Sesión</span></p><p>Estás a punto de salir de tu cuenta de Interjet Rewards <br/>¿Deseas continuar?</p></div>');


                return $content;
            },
            cssClass: 'bootDialog warning-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_WARNING,

            draggable: true,

            buttons: [{
                    label: 'Cancelar',
                    id: 'btn-close',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();
                    }
                },

                {
                    label: 'Continuar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-external save-data',
                    action: function(dialog) {
                        dialog.close();

                    }

                }
            ]
        });

    });

    //encontrar div

if ($(".slide-info").find("div.transparent").length > 0){ 
 $(this).addClass('slide-transparent');
}
$('div.slide-info').each(function() {
    if ($(this).find("div.transparent").length > 0){ 
 $(this).addClass('slide-transparent');
}
});



    ////Club Interjet Register Selected & Checkbox like option-radio buttons behavior///

    $("input.optionCheck:checkbox").change(function() {
        if (this.checked) {
            var checkname = $(this).attr("name");
            $("input:checkbox[name='" + checkname + "']").not(this).removeAttr("checked");

            $(this).closest('.clubInterjetCh').addClass('membership-selected').siblings().removeClass('membership-selected');

        } else {
            $(this).closest('.form-section').find('.clubInterjetCh').removeClass('membership-selected');

        }
    });

    //Card animation on hover
    $('#btn-enjoy_CI').mouseenter(function() {

        $(this).closest('#welcome-main-container').find('#card-img').addClass('bounup');

    }).mouseleave(function() {
        $(this).closest('#welcome-main-container').find('#card-img').removeClass('bounup');
    });



    if ($('#mainMyRewards').exists()) {


        //Example of progress InterjetRewards
        $(".progress-bar").animate({
            width: "10%"
        }, 2500);

    }




    if ($('form').exists()) {

        //Material init
        $.material.init();
    }






    /*//Stay selected tab on refresh
    $(function() {
        // use 'shown.bs.tab' for show the last active TAB
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            // save the latest tab; use cookies if you like 'em better:
            localStorage.setItem('lastTab', $(this).attr('href'));
        });

        // go to the latest tab, if it exists:
        var lastTab = localStorage.getItem('lastTab');
        if (lastTab) {
            $('[href="' + lastTab + '"]').tab('show');
        }
    });*/

    //Cargar tabs desde el menú

    var $input = $('input.myNewFlight'),
        $button = $('#SearchNewFlights');


    $('a.loadTab[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var target = this.href.split('#');
        $('.nav a').filter('[href="#' + target[1] + '"]').tab('show');
    });

    $(function() {
        var hash = window.location.hash;

        hash && $('ul.nav a[href="' + hash + '"]').tab('show');
    });


    $("input.flightCheck:checkbox").change(function() {
        if (this.checked) {

            //Flights Itinerary
            $(this).closest('.option-default-flight').addClass('thisFlight-selected');
            $(this).closest('.thisFlight-selected').find('.form-section.selectNewDate').show(100);
            //Transfer Refund
            $(this).closest('.FlightPassengersCard').addClass('thisFlight-selected');
            $(this).closest('.FlightPassengersCard.thisFlight-selected').find('.form-section.selectGroupPassengers').slideDown(100);
            $(this).closest('.FlightPassengersCard.simple-panel').find('input.PassengerCheck:checkbox').not(this).prop('checked', this.checked);


        } else {
            //Flights Itinerary
            $(this).closest('.option-default-flight').removeClass('thisFlight-selected');
            $(this).closest('.option-default-flight.checkbox').find('.form-section.selectNewDate').hide(100);
            $(this).closest('.option-default-flight.checkbox').find('.form-section.selectNewDate input.NewflightDate').val("");
            //Transfer Refund
            $(this).closest('.FlightPassengersCard').removeClass('thisFlight-selected');
            $(this).closest('.FlightPassengersCard.simple-panel').find('.form-section.selectGroupPassengers').slideUp(100);
            $(this).closest('.FlightPassengersCard.simple-panel').find('input.PassengerCheck:checkbox').prop('checked', false);



        }

        if ($('.option-default-flight.checkbox').hasClass('thisFlight-selected')) {


            $button.attr('disabled', true);
        }


        jQuery('#TransferRefund input.PassengerCheck').on('change', function() {
            var len = jQuery('#TransferRefund input.PassengerCheck:checked').length;
            if (len > 0) {
                $('.btn-tranferRefud').attr('disabled', false);
            } else if (len === 0) {
                $('.btn-tranferRefud').attr('disabled', true);
            }
        }).trigger('change');





    });






    $button.attr('disabled', true);
    $input.change(function() {
        var trigger = false;
        if (!$(this).val() && $(this).val() !== "") {
            trigger = true;
        } else {

            $button.attr('disabled', true);
        }
        trigger ? $button.attr('disabled', true) : $button.removeAttr('disabled');
    });







    //Newsletter validation


    $('#newsletter-info input,#newsletter-info select').on('blur keyup change', function() {
        if ($("#newsletter-info").valid()) {
            $('#newsletterSuscribe').attr('disabled', false);

        } else {
            $('#newsletterSuscribe').attr('disabled', true);

        }
    });


    $('#newsletterSuscribe').on('click', function() {
        if ($("#newsletter-info").valid()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>Registro exitoso</span></p><p>Ahora eres miembro de la comunidad Interjet. <br/>Pronto recibirás un mail de bienvenida.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal..</span></p><p>Lo sentimos, no pudimos completar el registro. <br/> Intenta mas tarde</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }


    });





    //Hotels Functions

    $(function() {
        $('select[name="hotel_n_rooms"]').change(function() {
            var total = parseInt($('select[name="hotel_n_rooms"]').val());
            var maxrooms = 8; //Se puede agregar una función para limitar el número de habitaciones
            if (total > maxrooms) {
                alert("De acuerdo a tu itinerario y número de personas registradas, no puedes agregar mas habitaciones de las que requieres");
            } else {
                $("div.rooms").empty();
                for (var j = 0; j < total; j++)

                    $("div.rooms").append('<div class="roomN col-sm-12 col-md-6 col-lg-3"><p>Habitación ' + (j * 1 + 1) + ' </p><div class="formclassic-component select-element"><label for="Adultroom-' + j + '">Adultos</label><select class="Nperson" name="Adultroom-' + j + '"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div><div class="formclassic-component select-element"><label for="Minorroom-' + j + '">Menores</label><select max="4" min="1" class="Nperson" name="Minorroom-' + j + '"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></div></div></div>');
            }
        });
    });


    $('.roomType').change(function() {
        roomtype = $(this).val();
        roomtext = $('.roomdescription');
        switch (roomtype) {
            case 'Sencilla':
                $(this).closest('.hotel-item').find(roomtext).text('1 King, Aire acondicionado, Balcón o terraza, Amenidades para el baño, Batas, Reproductor de CD, Cafetera, Servicio de concierge, Periódico diariamente, Puerto de datos, Secadora de cabello, Acceso a internet, Base para MP3, Jacuzzi interior, Minibar, Menú de almohadas, Baño privado con tina y regadera, Mini Alberca, Pantuflas, Amenidades VIP, TV por cable/satélite, Caja de seguridad (tamaño laptop)');

                break;

            case 'Ejecutiva':
                $(this).closest('.hotel-item').find(roomtext).text('1 King, Aire acondicionado, Balcón o terraza, Amenidades para el baño, Batas, Reproductor de CD, Cafetera, Servicio de concierge, Periódico diariamente, Puerto de datos, Teléfono de marcado directo, Reproductor de DVD, Secadora de cabello, Acceso a internet, Base para MP3, Jacuzzi interior, Minibar, Menú de almohadas, Baño privado con tina y regadera, Pantuflas, Amenidades VIP, TV por cable/satélite, Caja de seguridad (tamaño laptop).');

                break;


            case 'Deluxe':
                $(this).closest('.hotel-item').find(roomtext).text('1 King, Aire acondicionado, Balcón o terraza, Amenidades para el baño, Batas, Reproductor de CD, Cafetera, Servicio de concierge, Periódico diariamente, Puerto de datos, Teléfono de marcado directo, Reproductor de DVD, Secadora de cabello, Acceso a internet, Base para MP3, Jacuzzi interior, Minibar, Menú de almohadas, Baño privado con tina y regadera, Pantuflas, Amenidades VIP, Caja de seguridad (tamaño laptop)');

                break;

            default:
                $(roomtext).hide();
                break;
        }
    });




    $('.sliderhotel').each(function(key, item) {

        var sliderIdName = 'slider' + key;

        this.id = sliderIdName;


        var sliderId = '#' + sliderIdName;
        var $status = $('.pagingInfo');

        $(sliderId).has('img').slick({
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


        /*$(sliderId).on('afterChange', function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.text(i + '/' + slick.slideCount);
        });*/

    });


    $('.slider-for-hotel').each(function(key, item) {


        var BigsliderIdName = 'Bigslider' + key;

        this.id = BigsliderIdName;

        var SliderChild = $('.sliderhotel');


        var BigsliderId = '#' + BigsliderIdName;

        $(BigsliderId).has('img').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            dots: true,
            infinite: false,
            asNavFor: SliderChild,
            customPaging: function(slider, i) {
                var thumb = $(slider.$slides[i]).data('thumb');
                return '<a><img src="' + thumb + '"></a>';
            },

            responsive: [{
                breakpoint: 500,
                settings: {
                    dots: false,
                    arrows: true,
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });

    });





    $("#hotelGridItems").find(".hotel-item:gt(2)").addClass('hidden-item');

    var delay = 0;


    $(".showMoreHotels").on("click", function() {

        $("#hotelGridItems").find(".hidden-item").each(function() {

            $(this).delay(delay).show(300).css("display", "inline-block");
            delay += 300;

        });

        setTimeout(function() {
            $("#hotelGridItems").find(".hotel-item.hidden-item").removeClass('hidden-item');
            $("#hotelGridItems").find('.sliderhotel').slick('setPosition');



        }, 1500);


    });

    $('#hotelModal').on('shown.bs.modal', function(e) {

        $('.slider-for-hotel').slick('setPosition');

    });




    (function($) {
        var origAppend = $.fn.append;

        $.fn.append = function() {
            return origAppend.apply(this, arguments).trigger("append");
        };
    })(jQuery);







    $(".addMyHotel").on("click", function(e) {

        $(this).closest('.hotel-item').addClass('thisHotel_selected').siblings().removeClass('thisHotel_selected').find('.addMyHotel,.roomType').attr('disabled', true);
        $(this).closest('.hotel-item').find('.addMyHotel').attr('disabled', true).val('Agregado');
        $(this).closest('.hotel-item').find('.roomType').attr('disabled', true);
        $(this).closest('.hotel-item').find('.hotel-price').append('<div id="removeHotelSelected"><i class="fa fa-trash"></i> Remover selección</div>');

        e.preventDefault();


    });

    $(".hotel-price").bind("append", function() {
        $('#removeHotelSelected').on('click', function(e) {
            $(this).closest('.hotel-item').removeClass('thisHotel_selected').siblings().removeClass('thisHotel_selected').find('.addMyHotel,.roomType').attr('disabled', false);
            $(this).closest('.hotel-item').find('.addMyHotel').attr('disabled', false).val('Agregar');
            $(this).closest('.hotel-item').find('.roomType').attr('disabled', false);
            $(this).remove();

            e.preventDefault();

        });
    });








    $('.rating_hotel').each(function(key, item) {

        var ratingIdName = 'rating' + key;

        this.id = ratingIdName;


        var ratingId = '#' + ratingIdName;

        $(ratingId).rating({
            'iconLib': 'fa',
            'activeIcon': 'fa-star',
            'inactiveIcon': 'fa-star-o',
            'min': 1,
            'max': 5,
            clearable: false,
            readonly: true
        });
    });





    $(function() {
        $('[data-toggle-room="tooltip"]').tooltip({});
    });

    //END Hotels Functions




    //Jetbook Functions


    var btnJB = $('.nPrice.btn-control input.btn');

    $(btnJB).each(function() {

        $(this).attr('disabled', true).hide();

        $(".row-table input.jbPrice").change(function() {
            if (this.checked) {
                $(this).closest('.row-table').siblings().find(btnJB).attr('disabled', true).hide(50);
                $(this).closest('.row-table').find(btnJB).attr('disabled', false).show(100);
            } else {
                $(btnJB).attr('disabled', true);
            }




        });



    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        $('.nPrice.btn-control input.btn').hide(50);
        $(".row-table input.jbPrice").attr('checked', false);
    });


    var square = $('.grid-sq-img');
    var oversquare = $('.gse-overlay');
    var gsqText = $('.grid-sq-img > .gse-text');

    $(square).each(function() {

        $(this).mouseenter(function() {
            $(this).closest(square).find(oversquare).slideDown(500);
            $(this).closest(square).find(gsqText).hide();

        });


        $(this).mouseleave(function() {
            $(this).closest(square).find(oversquare).slideUp(300);
            $(this).closest(square).find(gsqText).show();
        });

    });

    $(".btn.btn_swapvalues").click(function() {
        $('#jetbookDest').val([$('#jetbookOrig').val(), $('#jetbookOrig').val($('#jetbookDest').val())][0]);
    });







    //Mailbox/Buzon Interjet Functions

    $('#MboxArea').change(function() {
        var selection = $('option:selected', this).attr('class');
        switch (selection) {
            case 'in_airport':
                $('#inAirport').show();
                $('#ofFlight,#OtherR').hide();
                break;

            case 'of_flight':
                $('#ofFlight').show();
                $('#inAirport,#OtherR').hide();
                break;


            case 'other_reason':
                $('#OtherR').show();
                $('#inAirport,#ofFlight').hide();
                break;

            case 'other_type':
                $('#inAirport,#ofFlight,#OtherR').hide();
                break;


            default:
                $('#inAirport,#ofFlight,#OtherR').hide();
                break;
        }
    });

    var mboxdate = new Date();
    mboxdate.setDate(regdate.getDate() - (365 * 12));





    $('#mailbox_interjet .agreeTycs').on('click change', function() {

        if ($(this).is(':checked')) {

            if ($("#mailbox_interjet").valid()) {
                $('#sendMbox').prop('disabled', false);

            } else {
                $('#sendMbox').prop('disabled', true);

            }
        } else {

            $('#sendMbox').prop('disabled', true);
        }

    });


    $('#sendMbox').on('click', function() {
        if ($("#mailbox_interjet").valid()) {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>Envío exitoso</span></p><p>Gracias por escribirnos, hemos recibido tu comentario, solo si es necesario nos pondremos en contacto contigo.</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog sucess-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_SUCCESS,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        } else {
            BootstrapDialog.show({
                title: '',

                message: function(dialog) {
                    var $content = $('<div class="errorMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Ups! Algo salió mal..</span></p><p>Lo sentimos, no pudimos enviar tu mensaje <br/> verifica que los campos esten completos</p></div>');


                    return $content;
                },
                cssClass: 'bootDialog danger-dialog',
                size: BootstrapDialog.SIZE_NORMAL,
                type: BootstrapDialog.TYPE_DANGER,

                draggable: true,

                buttons: [{
                    label: 'Cerrar',
                    id: 'btnAccept',
                    cssClass: 'btn btn-cancel',
                    action: function(dialog) {
                        dialog.close();

                    }

                }]
            });

        }


    });


    $("input#showminorData:checkbox").change(function() {
        if (this.checked) {


            $('#minorData').show();

        } else {
            $('#minorData').hide();

        }
    });







    //END Mailbox/Buzon Interjet



    //Morphing edit button to EditForm
    var width = $('.tab-pane').width();
    var height = $('.tab-pane').height();
    var animationDelay = 2000;
    var offset = 50;

    $('.btn.btn-edit-profile').click(function() {
        $(this).css({
            'display': 'none'
        });

        $('.overlay').css({
            "width": '100%',
            'opacity': 1,
            'position': 'relative',
            'box-shadow': '0 -1px 0 0 #6CADDF',
            'z-index': 99


        }); //end of css

        setTimeout(function() {
            $('.overlay').css({
                'height': "100%",
                'top': '0px',
                'background': '#fbfbfb'
            });



        }, 1800);

        $(".box").each(function() {
            blah(this);
        });

        $('#myProfile-Info').hide();

    }); //end of click

    $('.close-overlay').click(function() {
        $('.overlay').css({
            'height': '3px',
            'top': '0px',
            'z-index': 99
        });

        setTimeout(function() {
            $('.overlay').css({
                'width': '100px',
                'top': '0px',
                'background': '#6caddf',
                'height': '3px',
                'box-shadow': '0px',
                'position': 'absolute',
                'opacity': 0
            });
        }, 1100);


        setTimeout(function() {
            $('.btn.btn-edit-profile').show(200);
            $('#myProfile-Info').show(1000);
        }, 2000);

    });


    /*Descomentar... //Valida si existe una tarjeta y elimina el mensaje de SIN Tarjetas registradas
    if ($('.registeredCard').exists()) {
                $('#EmptyofCards').remove();

        }*/



    $('.btn.AddCard').click(function() {



        $('.registeredCard,#EmptyofCards').hide(200);

        setTimeout(function() {
            $('#addCardForm').slideDown(500);



        }, 1200);

    });


    $('.cancel-addCard').click(function() {

        $('#addCardForm').slideUp(100);

        setTimeout(function() {

            $('.registeredCard').show(700);

            if ($('#EmptyofCards').exists()) {
                $('#EmptyofCards').show(500);

            }

        }, 1000);

    });


    if ($('#addCardForm').exists()) {

        //Adding creditCard

        $("input[name='Card-cvc']").keyup(function() {
            $('.jp-card-cvc').addClass('disc-mask');
        });


        new Card({
            form: '.NewCreditCard',
            container: '.CardWrapper',
            formatting: true,
            width: 200,
            placeholders: {
                number: '•••• •••• •••• ••••',
                name: 'Nombre Tarjethabiente',
                expiry: 'mm/aa',
                cvc: '•••'
            },
            messages: {
                validDate: 'valida\nhasta',
                monthYear: 'mes/año'
            },
            formSelectors: {
                numberInput: 'input[name="Cardnumber"]',
                expiryInput: 'input[name="Cardexpiry"]',
                cvcInput: 'input[name="Cardcvc"]',
                nameInput: 'input[name="Holdername"]'
            }
        });



    }







    //Edit creditCard

    $(".edit-card").click(function() {



        $(this).closest('.CreditCardDetails').find('.detailsTable-Content').hide(function() {

                $('#editThisCard').show(1000).appendTo($(this).closest('.registeredCard'));
            }


        );
    });

    $(".cancel-EditCard").click(function() {

        $('.detailsTable-Content').show(1500);
        $('#editThisCard').hide(500);

    });





    //Equal Heights
    if ($(window).width() > 720) {
        var parentHeight = $('.equalHMV .thumbnail,.equalHMV .equal-item').parent().height();
        $('.equalHMV .thumbnail,.equalHMV .equal-item').each(function() {
            $(this).css('height', parentHeight + 'px');
        });
    } else {
        $('.equalHMV .thumbnail,.equalHMV .equal-item').each(function() {
            $(this).css('margin-bottom', '10px');
        });
    }

});




//Servicios especiales


$("input.SpecialServiceCheck:checkbox").change(function() {
    if (this.checked) {
        $('.specialServicesOptions').show(200);

    } else {
        $('.specialServicesOptions').hide(200);

    }
});


$('#findReservationKey').attr('disabled', true);
$('.sp-services_passegnerData input.reservationkey').bind('keyup blur', function() {
    var trigger = false;
    if (!$(this).val() && $(this).val() !== "") {
        trigger = true;
    } else {

        $('#findReservationKey').attr('disabled', true);
    }
    trigger ? $('#findReservationKey').attr('disabled', true) : $('#findReservationKey').removeAttr('disabled');
});


$('#findReservationKey').click(function() {

    $('#sp_services_passengerRequest .requestWrapper').show(400);


});










/*if ($('#sp_services_passengerRequest').find('.form-section').hasClass('RequestSelected')) {


            $('#sp_services_passengerRequest').find('.form-section.RequestSelected').append('<div class="sp_service_cancel-request" id="SP_SS-CancelReq">[Cancelar solicitud]</div>');
            $('.SpecialServiceCheck').addClass('checked-disabled');
            $('.SpecialServiceCheck').attr('disabled', true);
            $('.form-section').find('select').attr('disabled', true);
                         
}*/


function removeSPServices() {

    $('.form-section').removeClass('RequestSelected');
    $('.SpecialServiceCheck').removeClass('checked-disabled');
    $('.SpecialServiceCheck').attr('disabled', false),
        $('.SpecialServiceCheck').removeAttr('disabled'),
        $('.SpecialServiceCheck').removeAttr('checked');
    $('.form-section').find('.select-element select,input.textfield,input#requestTheServices').attr('disabled', false),
        $('.select-element select,input.textfield').removeAttr('disabled');
    $('.specialServicesOptions').find("input[type=text], select").val("");



}


$('#SP_SS-CancelReq').click(function() {

    BootstrapDialog.show({
        title: '',

        message: function(dialog) {
            var $content = $('<div class="changeMessage"><p><i class="inter-icon icon-icn_alert_error"></i><span>¡Espera!</span></p><p>Estás a punto de cancelar tu solicitud de servicio especial, por lo que el registro de tus datos junto con tus observaciones se perderá. ¿Deseas continuar? </p></div>');


            return $content;
        },
        cssClass: 'bootDialog warning-dialog',
        size: BootstrapDialog.SIZE_NORMAL,
        type: BootstrapDialog.TYPE_WARNING,

        draggable: true,

        buttons: [{
                label: 'Cancelar',
                id: 'btn-close',
                cssClass: 'btn btn-cancel',
                action: function(dialog) {
                    dialog.close();
                }
            },


            {
                label: 'Continuar',
                id: 'btnAccept',
                cssClass: 'btn btn-external save-data',
                action: function(dialog) {
                    dialog.close();
                    removeSPServices();

                }


            }
        ]
    });


});


//Validación formulario special services


function addSPServices() {
    $('#sp_services_passengerRequest').find('.form-section').addClass('RequestSelected');

    $('#SP_SS-CancelReq').show();
    $('.SpecialServiceCheck').addClass('checked-disabled');
    $('.SpecialServiceCheck, input#requestTheServices').attr('disabled', true);
    $('.form-section').find('.select-element select,input.textfield').attr('disabled', true);


}

$('#SpecialServices input').on('blur keyup', function() {
    if ($("#SpecialServices").valid()) {
        $('#requestTheServices').attr('disabled', false);

    } else {
        $('#requestTheServices').attr('disabled', true);

    }
});


$('#requestTheServices').on('click', function() {


    if ($("#SpecialServices").valid()) {
        BootstrapDialog.show({
            title: '',

            message: function(dialog) {
                var $content = $('<div class="successMessage"><p><i class="inter-icon icon-icn_alert_exitoso"></i><span>¡Listo!</span></p><p>En breve recibirás un correo de confirmación con las características del servicio especial que solicitaste.</p></div>');


                return $content;
            },
            cssClass: 'bootDialog sucess-dialog',
            size: BootstrapDialog.SIZE_NORMAL,
            type: BootstrapDialog.TYPE_SUCCESS,

            draggable: true,

            buttons: [{
                label: 'Cerrar',
                id: 'btnAccept',
                cssClass: 'btn btn-cancel',
                action: function(dialog) {
                    dialog.close();
                    addSPServices();

                }

            }]
        });

    } else {}
});




//Flip Card function

    $('.flip').mouseenter(function(){
        $(this).find('.flipCard').addClass('flipped');
        });
    $('.flip').mouseleave(function(){
            $(this).find('.flipCard').removeClass('flipped');
        return false;
    });
    
    
        $('.flip-vertical').mouseenter(function(){
        $(this).find('.flipCard').addClass('flipped');
        });
    $('.flip-vertical').mouseleave(function(){
            $(this).find('.flipCard').removeClass('flipped');
        return false;
    });





//Home Vuela desde carousel functions----->

//Carousel function validate if Carousel exists before execute the slick function

$(document).ready(function() {




    //Modal box TycS

    //Adding modal box for TyC's
    $(".main_page_wrapper").before('<!-- Modal HTML --><div id="TyCsModal" class="modal fade modal-interjet" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="/assets/images/icons/Icn_ClosePopUpx2.png" alt="Cerrar"></span></button><h4 class="modal-title">Título dinámico</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-intern">Descargar PDF</button><button type="button" class="btn btn-close btn-intern-second" data-dismiss="modal">Cerrar</button></div></div></div></div>');




    function addTycs() {

        /*$('#blue-bottom-footer').find('li a:contains("Terms & Conditions")').attr({
            'href':"modals/terms-and-conditions-canada.html",
             'class':"openTyCs"
        });

        $('#blue-bottom-footer').find('li a:contains("Privacy")').attr({
            'href':"modals/privacy-policy.html",
             'class':"openPrivacy"
        });*/

        $('.openTyCs').on('click', function(e) {
            e.preventDefault();
            $('#TyCsModal').modal('show').find('.modal-body').load($(this).attr('href'));
        });


        $('.openPrivacy').on('click', function(e) {
            e.preventDefault();
            $('#TyCsModal').modal('show').find('.modal-body').load($(this).attr('href'));
        });

        $('.openCarriage').on('click', function(e) {
            e.preventDefault();
            $('#TyCsModal').modal('show').find('.modal-body').load($(this).attr('href'));
        });



    }

    setTimeout(addTycs, 500);







    if ($('#DealsContainer').exists()) {

        //Carousel slick plugin init & options
        $('.carouselslider').slick({
            infinite: true,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 1,
            adaptiveHeight: false,
            responsive: [{
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                    }
                }, {
                    breakpoint: 520,
                    settings: {
                        autoplay: true,
                        autoplaySpeed: 2800,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                }, {
                    breakpoint: 320,
                    settings: {
                        autoplay: true,
                        autoplaySpeed: 2500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        arrows: false
                    }
                }

            ]
        });


        $('#tabs-deals li').click(function(e) {
            e.preventDefault();

            $('.carouselslider').slick('slickGoTo', 0);

        });



        //funcion para abreviar las rutas data code (responsive/mobile)

        var locationAbbrev = {

            'La Habana': 'CUB',
            'Tijuana': 'TIJ',
            'Monterrey': 'MTY',
            'Guadalajara': 'GUA',
            'Toluca': 'TOL',
            'Cancún': 'CAN',
            'León/Bajío': 'BAJ',

        };




        //entra la funcion anterior cuando carga la pantalla
        $(window).load(function() {
            var elems = $('.nav-tabs li a');
            if ($(this).width() < 480) {
                elems.text(function(i, text) {
                    return locationAbbrev[text.trim()] || text;
                });
            } else {
                elems.text(function(i, text) {
                    return text_abbrev(locationAbbrev, text.trim());
                });
            }
        });
    }


});


//END Home Vuela desde carousel functions----->