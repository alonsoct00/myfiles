(function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                    'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-N7ZS2SF');






         /***============UX scripts============***/
 function flipThis() {
    $('.mainflip').toggleClass('flipped');
}


$('#resetpswd').on('click', function(c){
    $(this).hide();
    $('#forgetpass,.form-resetpsswd > .input-wrp').hide();
    $('.forgot-msg,#btnContinPsswd').show(200);

c.preventDefault();
});

$('.modallogin').on('hidden.bs.modal', function (e) {
  $('#loginflip').removeClass('flipped');
  $('#resetpswd').prop("disabled", false);
  $('#forgetpass,#resetpswd,.form-resetpsswd > .input-wrp').show();
    $('.forgot-msg,#btnContinPsswd').hide();
});


/***============FIN UX scripts============***/






//////// Inicio seccion Home /////////////
$(document).ready(function() {
    //console.log('testing');
    var width = window.innerWidth ? window.innerWidth : $(window).width(),
        _sw;

    $('[data-toggle="tooltip"]').tooltip();

    //Actions para menu

    function resizeMenu() {

        _sw = window.innerWidth ? window.innerWidth : $(window).width();

        if (_sw < 992) {

            $('.menu-subtitle').next('ul').addClass('hidden');
            $('.cities').addClass('hidden');
            $('.menu-subtitle').addClass('menumobile');
            $( '.cities' ).addClass( 'hidden' ).removeClass('open');

            $('ul.navbar-nav').find('.nav-link').bind('touchstart touchend').on('click', function(e) {
                e.preventDefault();
                $('.nav-item').removeClass('active');
                if ($(this).parents('.nav-item').find('> .menu-option').hasClass('open-option')) {
                    $(this).parents('.nav-item').removeClass('active').find('> .menu-option').removeClass('open-option').stop().slideUp('fast');
                } else {

                    $('.menu-option').removeClass('open-option').stop().slideUp('fast');
                    $(this).parents('.nav-item').addClass('active').find('> .menu-option').addClass('open-option').stop().slideDown();
                }
            });
        } else {

            

            $('.menu-subtitle').next('ul').removeClass('hidden');
            $('.cities').addClass('hidden');
            $('.menu-subtitle').removeClass('menumobile');
            $( '.cities' ).eq(0).removeClass('hidden').addClass( 'open' );

            $('ul.navbar-nav').find('li.nav-item').on('mouseenter', function() {
                $('.admin-vuelo').removeClass('active');
                $(this).addClass('active');
                if ($('.country-list').hasClass('open')) {
                    $('.language').children('.country-list').slideUp('fast').removeClass('open').addClass('close');
                    $('.language').children('.arrow').removeClass('up').addClass('down');
                    //resizeMenu();

                }
                if ($(this).hasClass('open-option')) {
                    $(this).find('> .menu-option').removeClass('open-option').stop().slideUp('fast');
                } else {
                    $(this).find('> .menu-option').addClass('open-option').stop().slideDown();
                }

                //se oculta user
                $('.userWrp .arrow').removeClass('up');
                $('.user-menu').stop().slideUp('fast');

            }).on('mouseleave', function() {
                $(this).removeClass('active');
                $(this).find('> .menu-option').removeClass('open-option').stop().slideUp('fast');
            }).on('click', function(e) {
                e.preventDefault();
            });
        }

        $('.menu-option').hide();

        

    }

    // end resize

    $('.language-mobile').on('click', function(e) {
            e.preventDefault();
            $('.nav-link').parent().removeClass('active');
            $('.menu-option').stop().slideUp();
            $(this).children('.country-list').toggleClass('open close');
            $(this).children('.arrow').toggleClass('up down');
        });

    $('.menu-subtitle').on('click', function(e) {
        e.preventDefault();
        if (_sw < 992) {

            if ($(this).next('ul').hasClass('hidden')) {
                $('.menu-subtitle').removeClass('show');
                $('.menu-subtitle').next('ul').addClass('hidden');
                $(this).next('ul').removeClass('hidden');
                $(this).addClass('show');
            } else {
                $(this).next('ul').addClass('hidden');
                $(this).removeClass('show');
            }
        }
    });

    if (_sw < 992) {


        // Arrow log user click

        $('.preferencesWrp .log').on('click', function(e) {
            e.preventDefault();
            $('.userWrp .arrow').toggleClass('up');
            $('.user-menu').slideToggle('fast');
        });

        
    } else {
        $('.language')
            .on('mouseenter', function(e) {
                $('.nav-link').parent().removeClass('active');
                $('.menu-option').stop().slideUp('fast');
                $('.preferencesWrp .country-list.open').css({ 'min-height': 28 * $('.preferencesWrp .country-list li').length });
                //console.log( 28 * $('.country-list.open li').length, $('.country-list.open li').length );
                $(this).children('.country-list').slideDown('fast').removeClass('close').addClass('open');
                $(this).children('.arrow').removeClass('down').addClass('up');
                $('.preferencesWrp .country-list.open').css({ 'min-height': 28 * $('.preferencesWrp .country-list li').length });

                //se oculta user
                $('.userWrp .arrow').removeClass('up').addClass('down')
                $('.user-menu').slideUp('fast');
            });

        $('.country-list')
            .on('mouseleave', function(e) {
                e.preventDefault();
                if ($('.country-list').hasClass('open')) {
                    $('.preferencesWrp .country-list.open').css({ 'height':'auto', 'min-height': '120px' });
                    $('.language').children('.country-list').slideUp('100').removeClass('open').addClass('close');
                    $('.language').children('.arrow').removeClass('up').addClass('down');
                    
                }
            });

        $('.preferencesWrp .log')
            .on('mouseenter', function(e) {
                e.preventDefault();
                $('.userWrp .arrow').addClass('up');
                $('.user-menu').stop().slideDown();
                if ($('.country-list').hasClass('open')) {
                    $('.language').children('.country-list').slideUp('fast').removeClass('open').addClass('close');
                    $('.language').children('.arrow').removeClass('up').addClass('down');
                }
            });
        $('.user-menu').on('mouseleave', function(e) {
            e.preventDefault();
            $('.userWrp .arrow').removeClass('up');
            $('.user-menu').slideUp('fast');
        });
    }


    //change languaje
    $('.country-list a').on('click', function(e) {
        e.preventDefault();
        var country = $(this).attr('class');
        $('.active-country, .act-country-mobile').removeClass('eu').removeClass('mx').removeClass('gt').removeClass('co').removeClass('cr').removeClass('pe').removeClass('ca').removeClass('ca-fr').addClass(country)
            .text($(this).text());
        $('.language').children('.country-list').stop().slideUp().removeClass('open').addClass('close');
        $('.language').children('.arrow').removeClass('up').addClass('down');
        $('.country-list a').removeClass('selected');
        $(this).addClass('selected');
        $(this).parent().parent().prepend($(this).parent());
        //$( '.country-list-name a.'+ country ).parent().before('.country-list-name a:first');
    });


    $('.profile-mobile').on('click', function(e) {
            e.preventDefault();
            $('.userWrp .arrow').toggleClass('up');
            $('.user-menu').stop().slideToggle();

            $('button.navbar-toggler').addClass('collapsed');
            $('.navbar-collapse').stop().slideUp();

            if ($('.userWrp .arrow').hasClass('up')) {
                $('.overlay-interjet').fadeIn().addClass('show-mobile');
            } else {
                $('.overlay-interjet').fadeOut().removeClass('show-mobile');
            }
        });


    $('.destinations-menu').each(function() {

            var tgt = $(this);

            tgt
                .unbind('click')
                .bind('click', function(e) {
                    e.preventDefault();
                    if ( _sw < 992 ) {

                        //tgt.toggleClass('selected');
                        //tgt.next('.cities').removeClass('open').addClass('hidden');

                        if ($(this).hasClass( 'mobile-open' )) {
                            console.log( 'removeClass' );
                            tgt.removeClass('selected').removeClass('mobile-open');
                            $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden');
                            

                        } else {
                            console.log( 'addClass' );
                            tgt.addClass('selected mobile-open');
                            $('.destinations-menu.selected').next('.cities').removeClass('hidden').addClass('open');
                        }

                        console.log( $('.destinations-menu').next('.cities') );

                    } else {

                        if (!tgt.hasClass('selected')) {
                            console.log('hasClass selected');
                            $('.destinations-menu').toggleClass('selected');
                            $('.cities').toggleClass('hidden open');
                        }

                    }

                });
        });/*.unbind( 'click' )
    .bind( 'click' , function(e) {
        e.preventDefault();

        if (_sw < 992) {

            console.log( $( this ).hasClass( 'selected' ) );

            // if ( !$( this ).hasClass( 'selected' )  ){
            $('.destinations-menu').toggleClass('selected');
            $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden');
            //$('.destinations-menu').removeClass('mobile-open');
            //}

            if ($(this).hasClass('selected')) {
                console.log( 'removeClass' );
                $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden');
                $('.destinations-menu').removeClass('selected').removeClass('mobile-open');
            } else {
                console.log( 'addClass' );
                $(this).addClass('selected mobile-open');
                $(this).next('.cities').removeClass('hidden').addClass('open');
            }

        } else {

            if (!$(this).hasClass('selected')) {
                console.log('hasClass selected');
                $('.destinations-menu').toggleClass('selected');
                $('.cities').toggleClass('hidden open');
            }

        }
    });*/

    // Terminan Actions para menu


    // slick slider booking (la llama)
    $('.booking-carousel').slick({
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false,
        appendDots: '.dots-carousel, .dots-carousel-mobile',
        responsive: [{
            breakpoint: 992,
            settings: {
                swipe: true
            }
        }]
    });


    // slick slider Productos y Servicios
    $('.productosyservicios').slick({
        dots: false,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [{
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true,
                    dots: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true,
                    dots: false
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true,
                    dots: false
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });


    //close alert on top
    $('.closeBtn').on('click', function(e) {
        e.preventDefault();
        $('.alertTop').slideUp('400', function() {
            $('.booking-wrp').addClass('no-alert');
        });
        $('.navbar').animate({ top: '0px' });
    });


    // init datepicker
    $('.datepicker').datepicker({
        minDate: "+1D",
        maxDate: "+1M +10D"
    });


    // // // Actions booking // // //

    //Open and close options booking
    $('button.btn-select').on('click', function(e) {
        e.preventDefault();
        $('.booking-bg').fadeIn();
        var optionID = $(this).parent().attr('data-option');
        switch (optionID) {
            case 'origin':
                //se reinician todos los options
                $('.booking-options-item [data-option="origin"]').find('.label-origin').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
                $('.booking-options-item [data-option="origin"]').find('.select-origin').html(' ');
                $('.booking-options-item [data-option="destination"]').find('.label-destination').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
                $('.booking-options-item [data-option="destination"]').find('.select-destination').html(' ');
                $('.booking-options-item [data-option="passengers"]').find('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
                $('.booking-options-item [data-option="passengers"]').find('.select-passengers').html(' ');
                //se ocultan las opciones abiertas

                if ($(this).hasClass('active')) {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $('.booking-bg').fadeOut();

                } else {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $(this).parent().find('.booking-options-menu').slideDown('400', function() {
                        $(this).parent().find('button.btn-select').addClass('active');
                    });

                }
                break;
            case 'destination':
                //se reinician todos los options
                $('.booking-options-item [data-option="destination"]').find('.label-destination').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
                $('.booking-options-item [data-option="destination"]').find('.select-destination').html(' ');
                $('.booking-options-item [data-option="passengers"]').find('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
                $('.booking-options-item [data-option="passengers"]').find('.select-passengers').html(' ');
                //se ocultan las opciones abiertas

                if ($(this).hasClass('active')) {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $('.booking-bg').fadeOut();

                } else {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $(this).parent().find('.booking-options-menu').slideDown('400', function() {
                        $(this).parent().find('button.btn-select').addClass('active');
                    });
                }
                break;
            case 'passengers':
                //se ocultan las opciones abiertas

                if ($(this).hasClass('active')) {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $('.booking-bg').fadeOut();

                } else {
                    $('.booking-options-menu').stop().slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $(this).parent().find('.booking-options-menu').slideDown('400', function() {
                        $(this).parent().find('button.btn-select').addClass('active');
                    });
                }
                break;
        }
    });


    //Search Origin
    $('.search-origin').on('keyup', function(e) {
        e.preventDefault();
        var filter = $(this).val();
        $('.places-origin').find('li').each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });


    //Select destination
    $('.search-destination').on('keyup', function(e) {
        e.preventDefault();
        var filter = $(this).val();
        $('.places-destination').find('li').each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });

    //Select origin or destination
    $('.booking-options-menu li').on('click', function(e) {
        e.preventDefault();
        var optionID = $(this).parents('.booking-options-item').attr('data-option');
        switch (optionID) {
            case 'origin':
                var origin = $(this).text();
                var codeid = $(this).attr('data-codeid');
                $(this).parents('.booking-options-item').find('.label-origin').removeClass('txt-gray').addClass('description txt-blue');
                $(this).parents('.booking-options-item').find('.select-origin').html(origin + ' <span class="txt-blue">(' + codeid + ')</span>');
                $('.search-origin').val('');
                $('.places-origin').find('li').show();
                $('.booking-options-menu').stop().slideUp();
                $('.booking-bg').fadeOut();
                $('.booking-options-item').find('button.btn-select').removeClass('active');
                break;
            case 'destination':
                var destination = $(this).text();
                var codeid = $(this).attr('data-codeid');
                $(this).parents('.booking-options-item').find('.label-destination').removeClass('txt-gray').addClass('description txt-blue');
                $(this).parents('.booking-options-item').find('.select-destination').html(destination + ' <span class="txt-blue">(' + codeid + ')</span>');
                $('.search-destination').val('');
                $('.places-destination').find('li').show();
                $('.booking-options-menu').stop().slideUp();
                $('.booking-bg').fadeOut();
                $('.booking-options-item').find('button.btn-select').removeClass('active');
                break;
        }
    });

    //add passanger button
    $('.btn-add').on('click', function(e) {
        e.preventDefault();
        var c = $(this).parents('.passenger-item').find('.passenger-num').text() * 1;
        if (c == 9) {
            $(this).parents('.passenger-item').find('.passenger-num').text('9');
            $(this).addClass('disable');
        } else {
            if (c < 9) {
                $(this).removeClass('disable');
                $(this).parents('.passenger-item').find('.btn-less').removeClass('disable');
                $(this).parents('.passenger-item').find('.passenger-num').text((c + 1));
            } else {
                $(this).addClass('disable');
            }
        }
    });

    //less passanger button
    $('.btn-less').on('click', function(e) {
        e.preventDefault();
        var c = $(this).parents('.passenger-item').find('.passenger-num').text() * 1;
        if (c == 1 || c == 0) {
            $(this).parents('.passenger-item').find('.passenger-num').text('0');
            $(this).addClass('disable');
        } else {
            $(this).removeClass('disable');
            $(this).parents('.passenger-item').find('.btn-add').removeClass('disable');
            $(this).parents('.passenger-item').find('.passenger-num').text((c - 1));
        }
    });

    //Update passengers
    $('.btn-update-passengers').on('click', function(e) {
        e.preventDefault();
        var totalpass = 0;
        $('.passenger-item').each(function() {
            totalpass += $(this).find('.passenger-num').text() * 1;
        });
        if (totalpass > 0) {
            $('.label-passengers').removeClass('txt-gray').addClass('description txt-blue');
            if (totalpass <= 1) {
                $('.select-passengers').html(totalpass + ' pasajero');
            } else {
                $('.select-passengers').html(totalpass + ' pasajeros');
            }
        } else {
            $('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray');
            $('.select-passengers').html(' ');
        }
        $('.booking-options-menu').stop().slideUp();
        $('.booking-options-item').find('button.btn-select').removeClass('active');
        $('.booking-bg').fadeOut();

    });

    //Radio buttons
    $('.booking-content-tab .btn-radio, .calendar-options .btn-radio').each(function($i) {

        var tgt = $(this);

        (function($i) {

            tgt.unbind('click')
                .bind('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(tgt);

                    if (!tgt.hasClass('active')) {
                        $(this).parent().find('.btn-radio').removeClass('active');
                        $(this).addClass('active');
                    }

                });

        })($i);

    });
    /*.on('click', function(e){
            e.preventDefault();
            $('.booking-content-tab .btn-radio, .calendar-options .btn-radio').toggleClass('active');
        });*/


    // // //end Action booking // // //


    //video modal
    $('.showvideo').on('click', function(e) {
        e.preventDefault();
        $('.modal-body .video-wrp').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/Wj099JLEbzE" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
        $('.modalvideo').modal('show');
    });
    $('.showvideo').on('hidde.bs.modal', function(e) {
        e.preventDefault();
        $('.video-wrp').html(' ');
    });
    $('.modal-content').on('click', function() {
        $('.modalvideo').modal('hide');
        $('.video-wrp').html(' ');
    });


    //Modal Login
    $('.miperfil, .iniciasesion, .registrate').on('click', function(e) {
        e.preventDefault();
        $('.modallogin').modal('show');
    });


    //Modal Newsletter
    $('.btn-newsletter').on('click', function(e) {
        e.preventDefault();
        $('.modalnewsletter').modal('show');
    });


    //Modal Chat
    $('.chat').on('click', function(e) {
        e.preventDefault();
        $('.modalchat').modal('show');
    });


    // Modal TEst
    $('.test-modal').on('click', function(e) {
        e.preventDefault();
        $('.modalalert').modal('show');
    });


    //Administra tu vuelo Desktop
    if (_sw < 992) {
        $('.admin-vuelo').on('click', function(e) {
            e.preventDefault();
            $('.admin-vuelo').toggleClass('active');
            $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden');
        });
    } else {
        $('.admin-vuelo')
            .on('mouseenter', function() {
                $('.admin-vuelo').addClass('active');
                $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden');
            })
            .on('mouseleave', function() {
                //$('.admin-vuelo').toggleClass('active');
                $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden');
            })
            .on('click', function(e) {
                e.preventDefault();
            });
        $('.sub-gst, .sub-gst-mb')
            .on('mouseenter', function() {
                //$('.admin-vuelo').removeClass('active');
                $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden');
            })
            .on('mouseleave', function() {
                $('.admin-vuelo').removeClass('active');
                $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden');
            });
    }



    //Show calendar
    $('.btn-step-calendar').on('click', function(e) {
        e.preventDefault();
        $('.booking-calendar').slideDown('fast');
        $('.overlay-interjet').fadeIn();
    });


    //Select tab booking
    $('.tab-flights, .tab-hotelflights').on('click', function(e) {
        e.preventDefault();
        $('.tab-flights, .tab-hotelflights').toggleClass('disable');
        $('.booking-content-tab').toggleClass('hidden');
    });


    //Scroll to top
    $('.btn-up').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 1000);
        return false;
    });


    //Hide overlay booking
    $('.booking-bg').on('click', function(e) {
        e.preventDefault();
        $('.booking-calendar').slideUp('fast');
        $('.booking-options-menu').stop().slideUp('fast');
        $('.booking-options-item').find('button.btn-select').removeClass('active');
        $('.booking-bg').fadeOut();
        $('.userWrp .arrow').removeClass('up');
        $('.user-menu').stop().slideUp();
        $('button.navbar-toggler').addClass('collapsed');
        $('.navbar-collapse').stop().slideUp();
    });


    //Hide overlay interjet
    $('.overlay-interjet').on('click', function(e) {
        e.preventDefault();
        $('.overlay-interjet').fadeOut();
        $('button.navbar-toggler').addClass('collapsed');
        $('.navbar-collapse').stop().slideUp();
        $('.userWrp .arrow').removeClass('up');
        $('.user-menu').stop().slideUp();
        $('.booking-calendar').slideUp('fast');

        /*if( $('body').hasClass('hide-overflow') ){
            $('body').removeClass('hide-overflow');
        }
        else{
            $('body').addClass('hide-overflow');
        }*/
    });


    // Open Menu
    $('button.navbar-toggler').on('click', function(e) {
        e.preventDefault();

        if ($(this).hasClass('collapsed')) {
            $('.overlay-interjet').fadeIn().addClass('show-mobile');
        } else {
            $('.overlay-interjet').fadeOut().removeClass('show-mobile');
        }

        if ($('body').hasClass('hide-overflow')) {
            //$('body').removeClass('hide-overflow');
        } else {
            //$('body').addClass('hide-overflow');
        }


        $(this).toggleClass('collapsed');
        $('.navbar-collapse').slideToggle();

        $('.userWrp .arrow').removeClass('up');
        $('.user-menu').stop().slideUp();

    });


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

    resizeMenu();

    $(window).bind('resize', function() {
        
        resizeMenu();

        if ($('.destination-wrp').get(0)) {
            elemMaxHeight($('.destination-wrp'));
        }
        if ($('.product-wrp').get(0)) {
            elemMaxHeight($('.product-wrp'));
        }
        if ($('.blog-articles .blog-title').get(0)) {
            elemMaxHeight($('.blog-articles .blog-title'));
        }
        if ($('.blog-articles p:nth-child(3)').get(0)) {
            elemMaxHeight($('.blog-articles p:nth-child(3)'));
        }

    });

    setTimeout(function() {
        if ($('.destination-wrp').get(0)) {
            elemMaxHeight($('.destination-wrp'));
        }
        if ($('.product-wrp').get(0)) {
            elemMaxHeight($('.product-wrp'));
        }
        if ($('.blog-articles .blog-title').get(0)) {
            elemMaxHeight($('.blog-articles .blog-title'));
        }
        if ($('.blog-articles p:nth-child(3)').get(0)) {
            elemMaxHeight($('.blog-articles p:nth-child(3)'));
        }
    }, 800);


    // Copyright 2014-2017 The Bootstrap Authors
    // Copyright 2014-2017 Twitter, Inc.
    // Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement('style')
        msViewportStyle.appendChild(
            document.createTextNode(
                '@-ms-viewport{width:auto!important}'
            )
        )
        document.head.appendChild(msViewportStyle)

        $('body').addClass('ie10');

    }

    if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
        $('body').addClass('ie10');
    }


});

//////// Fin seccion Home /////////////
//////// Inicio Seccion Passengers  /////////
$(document).ready(function(){

	//console.log("Core - Passengers");
	$('.flight-origin, .flight-destination, .edit').mouseover(function(e) 
    {
        e.preventDefault();
        $('.edit').show();
    });
    $('.edit').mouseout(function(e){
        e.preventDefault();
        $('.edit').hide();
    });
    //Hover Passengers
    $('.flight-passengers, .editPassengers').mouseover(function(e) 
    {
        e.preventDefault();
        $('.editPassengers').show();
    });
    $('.editPassengers').mouseout(function(e){
        e.preventDefault();
        $('.editPassengers').hide();
    });
	
	$('.ie-datepicker').hide();
	var isFirefox = typeof InstallTrigger !== 'undefined';
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	var  _dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
	var _meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

	$('[data-toggle="tooltip"]').tooltip();   
	$(".menu-opcion-pais").hide();
	$(".menu-programa-recompensas").hide();


	$("input, .select-wrp, .btn-programa-recompensas, .btn-opcion-pais").on('click', function(e){
		e.stopPropagation();
		$('.select-options').slideUp("fast");
		$('.datepickery').hide();
		$('.btn-programa-recompensas, .btn-opcion-pais').removeClass("open");
		$(".scheduleFlightsWrp button").removeClass("active");
		$('.select-birthday').removeClass("active");


	});

	$('.select-wrp').on('click', function(e){
		var child = $(this).children(0);
		$(child).focus;

	});

	$(".btn-programa-recompensas").on('click',function(e)
	{
	if($(".menu-programa-recompensas").is(':hidden'))
		{
			$(".btn-programa-recompensas").addClass("open");
		}
		else
		{
			$(".btn-programa-recompensas").removeClass("open");
		}
    	$(".menu-programa-recompensas").slideToggle("slow", function()
    	{
    	});
	});

	$(".opcion-programaRecompensas").on('click',function(e){
		var thisDropdown = $(this).parent().parent().parent().parent().find("button");
		var arrayOfSpan = thisDropdown.find("span");
		$(arrayOfSpan[arrayOfSpan.length-1]).text($(this).text())
    	$(".menu-programa-recompensas").slideToggle("fast");
    	$(".btn-programa-recompensas").removeClass("open");
    	if( $(this).text() == "Ninguno" ){
    		$('.numSocio, .btn-check, .forgetNumber').hide();
    	}else{
    		$('.numSocio, .btn-check, .forgetNumber').show();
    	}
	});

	$(".btn-opcion-pais").on('click',function(e){
		$(this).children().removeClass('hidden');
		var parentdiv = $(this).parent().find($('.menu-opcion-pais'));
		if((parentdiv).is(':hidden'))
		{
			$(this).parent().addClass("open");
		}
		else
		{
			$(this).parent().removeClass("open");
		}
    	parentdiv.slideToggle("slow");
	});

	$(".opcion-pais").on('click',function(e){
		var btnParent = $(this).parent().parent().parent().find(".btn-opcion-pais");
		var arrayOfSpan = btnParent.find("span");

		var classList = $(this)[0].className.split(' ');
		$(arrayOfSpan[1]).text($(this).text());
		var classList2 = $(arrayOfSpan[1])[0].className.split(' ');
		$(arrayOfSpan[1]).removeClass(classList2[2]);
		$(arrayOfSpan[1]).addClass(classList[1]);
    	$(this).parent().parent().slideToggle("fast");
    	btnParent.parent().removeClass("open");
	});

	$('.input-wrp').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		$('.scheduleFlightsWrp .input-wrp').removeClass("active");
		$(".scheduleFlightsWrp button").removeClass("active");
		$('.select-birthday').removeClass("active");
		$('.ie-datepicker').hide();
		$(this).addClass("active");
		($(this).children().find("input")).focus();

		
	});
	$("input").on('click', function(e){
		$('.scheduleFlightsWrp .input-wrp').removeClass("active");
		$(".scheduleFlightsWrp button").removeClass("active");
		$('.select-birthday').removeClass("active");
		$(this).parent().parent().addClass("active");

		
	});

	$('.contratoPrestServicio').on('click', function(e){
        e.preventDefault();
        $('.modalcontract').modal('show');
    });
    $('.avisoPrivacidad').on('click', function(e){
        e.preventDefault();
        $('.modaltext').modal('show');
    });
    $('.forgetNumber').on('click', function(e){
        e.preventDefault();
        $('.modalclub').modal('show');
    });

    $(".btn-check").on('click',function(e){
    	$('.numSocio').addClass("incorrect");
    	$('.nombrSocio').addClass("correct");
    });
/*
if($.browser.chrome) {
   alert(1);
} else if ($.browser.mozilla) {
   alert(2);
} else if ($.browser.msie) {
   alert(3);
}
*/
    
    if(isIE)
    {
    	//console.log("yesIE");
    	
    	$('.empty-dater').on('click', function(e){
	  		e.stopPropagation();
	  		createIECalendars($(this).parent());
	    	$(this).parent().find('input').focus();
	    });

    }
    else if(isFirefox)
    {
    	//console.log("Mozilla");	
			$('.date-input').datebox({
			    mode: "flipbox"
			});	
    }else{
    	//console.log("browser");	
			$('.date-input').datebox({
			    mode: "flipbox"
			});	

    }


    function createIECalendars($wrapper)
    {
    	
    	var calendario = $('.ie-datepicker');
    	$wrapper.addClass("active");
    	calendario.show();
    	var currentInput = $($wrapper).find("input[type=text]");
    	$($wrapper).append(calendario);

    	var $selectDays = $(".pickerDay");
    	for (i=1;i<=31;i++)
    	{
        	$selectDays.append($('<option></option>').val(i).html(i))

    	}

    	var $selectMonth = $(".pickerMonth");
    	for (i=1;i<=12;i++)
    	{
    		var currentMonth = _meses[(i-1)];
        	$selectMonth.append($('<option></option>').val(currentMonth).html(currentMonth))

    	}

    	var $selectYear = $(".pickerYear");
    	for (i=1920;i<=2018;i++)
    	{
        	$selectYear.append($('<option></option>').val(i).html(i))

    	}


		var currentConfirm = $($wrapper).find('.ieCalendarData');



    	 currentConfirm.on('click',function(e)	
		{


			e.preventDefault();
			e.stopPropagation();
			
    		var tempDay = $($wrapper).find(".pickerDay").val();
    		var tempMonth = $($wrapper).find(".pickerMonth").val();
    		var tempYear = $($wrapper).find(".pickerYear").val();

    		if( tempDay != undefined ){
    			$(currentInput).val(tempDay+"/"+tempMonth+"/"+tempYear);
    		}

    		
    		calendario.hide(); 
    	});
    	
    }
   

    $(document).click(function() 
    {
    	$('.input-wrp').removeClass("active");
    	$('.select-birthday').removeClass("active");
    	$('.ie-datepicker').hide();
    	$(".scheduleFlightsWrp button").removeClass("active");
	   	$('.select-options').slideUp("fast");
	   	$('.btn-programa-recompensas, .btn-opcion-pais').removeClass("open");
	   	$('.datepickery').hide();

	});

	$('.select-options').click(function(event){
	   event.stopPropagation();

	});	
	
  	$('.radio-switch').on('click', function(event){

  		var arrayOfInputs = $(this).find("input");
	    if($(this).hasClass('women')) 
	    {
	    	$(this).removeClass('women');
	    	$(this).addClass('men');
	    	arrayOfInputs[0].checked=true;
	    	arrayOfInputs[1].checked=false;
	    }else if($(this).hasClass('men'))
	    {
	    	$(this).removeClass('men');
	    	$(this).addClass('women');
	    	arrayOfInputs[1].checked=true;
	    	arrayOfInputs[0].checked=false;
	    }
	    
	  });

  	$('.empty-dater').on('click', function(e){
  		e.stopPropagation();
  		e.preventDefault();
  		//console.log(":OH!!!");
    	$(this).parent().find('input').focus();
    });
	
});
//////// Fin Seccion Passengers  /////////
//////// Inicio Seccion Seats  /////////
$(document).ready(function()
{ 
	/*Seats variables*/
	var _availableHeight;
	var _numberOfSeats = 124;
	var _numberOfCols = 6;
	var _numberOfRows = Math.floor(_numberOfSeats/_numberOfCols);
	var _rowsBeforeAisle = 3;
	var _seatWidth;
	var _spaceBetweenSeats = 2;
	var _verticalSpaceFix = 0;
	var _ABCdario = new Array();
	_ABCdario= ["A","B","C","D","E","F","G","H","I","J","K"];
	var _factor = 3.8;
	var _mobilePasChanged ;
	var pasajeroActualId;
	var is_safari = navigator.userAgent.indexOf("Safari") > -1;

	$('[data-toggle="tooltip"]').tooltip();
	var mobile = true;
	var _numPassengers = 4;
	var modalPassengerMobile = false;

	var _defaultSeat = new Array();
	_defaultSeat = ["2B","3B","4B","N/A"];
	var _tempSeats = new Array();
	_tempSeats = ["2B","3B","4B","N/A"];

	$(window).resize(function() 
	{
		init();
	
	});

	$( window ).on( "orientationchange", function( event ) 
	{
		init();
	});
	init();

	function init()
	{
		//console.log("Seats section");
		if(window.location.href.indexOf("seats") > -1)
		{
			seatValidation();
			checkWebVersion();
		}
	}
	function isiPhone(){
	    return (
	        (navigator.platform.indexOf("iPhone") != -1) ||
	        (navigator.platform.indexOf("iPod") != -1)
	    );
	}

//Seats width change according to window's
	function seatValidation()
	{
		if($(window).width() <1200)
		{
			_factor = 1;
		}
		if($(window).width() <850)
		{
			_factor = 0.92;
		}
		if($(window).width() <800)
		{
			_factor = 0.905;
		}
		else if ($(window).width() >1200)
		{
			_factor = 1;
		}
	}

//If desktop version is used this makes sure all desktop items are shown and all mobile are hidden
	function setDesktop()
	{
		desktopStartUp();
		$('.desktopVersion').show();
		$('.mobileVersion').hide();
		$('.pasajeros-vuelo-mobile').hide();
		pintarTabla(".plane-seats");
	}


//If mobile version is used this makes sure all mobile items are shown and all desktop are hidden
	function setMobile()
	{
		$('.desktopVersion').hide();
		$('.mobileVersion').show();
		$('.pasajeros-vuelo-mobile').hide();
		pintarTablaMobile(".mobile-seats-wrp");
		mobileStartUp();
	}

//Checks if mobile or desktop is being used to browse
	function checkWebVersion()
	{
		if($(window).width() < 768 )
		{
			setMobile();
		}
		else
		{
			setDesktop();
		}
	}

//Initializes desktop functions
	function desktopStartUp()
	{
		for (var i = 0; i < $('.btn-reestablecer').length; i++) 
		{
			($('.btn-reestablecer')[i]).disabled=true;
		}
		$('.detalles-pasajeros').hide();
		$('.detalles-vuelo').addClass("closeSlide");
		$('.detalles-pasajeros').first().show();
		$(document).on('click','.btn-green-interjet',function(e){
			$('.close').click();
		});

		passengersDetaillsUnfold();
		assignPassenger();
		resetSeatsFunction();
		showSeatPrice();
		selectSeatDesktop();
	}

//Initializes mobile functions 
	function mobileStartUp()
	{
		$("#asientos-en-avion-filas-mobile").css("position","relative");
		$("#asientos-en-avion-filas-mobile").css("overflow-y","scroll");
		$("#asientos-en-avion-filas-mobile").css("height","100vh");
		$("#asientos-en-avion-filas-mobile").css("box-sizing", "padding-box");
		$("#asientos-en-avion-filas-mobile").css("-moz-box-sizing", "padding-box");
		$("#asientos-en-avion-filas-mobile").css("-webkit-box-sizing", "padding-box");
		$("#asientos-en-avion-filas-mobile").css("padding-bottom", "60px");
		$("#asientos-en-avion-filas-mobile").css("background-size", "102% 102%");



		var pasajeros = $(".unfoldMobile").parent().find('.pasajeros-vuelo-mobile');
			$(pasajeros).show();


		$('.btn-cambiar-asientos-mobile').unbind('click').click( function(e)
		{
			$('.atn-mobile').removeClass('open');
			$('.atn-footer').slideDown().addClass('hidden');
			
			$('.detalles-vuelo-mobile').hide();
			$('.seleccion-asiento-mobile').show();
			
			$('footer').hide();
			$('.menuScheduleWrp').hide();
			$('.btn-next').hide();
			$('.btn-next-wrp').hide();
		});

		$('.btn-mobile-actualizar').on('click' , function(e)
		{
			
			$('.detalles-vuelo-mobile').show();
			$('.seleccion-asiento-mobile').hide();
			$('footer').show();
			$('.menuScheduleWrp').show();
			$('.btn-next').show();
			$('.btn-next-wrp').show();

		});

		$(document).on('click', ".passengerMobile", function(e)
		{
			e.stopPropagation();
			
			$(".passengerMobile").removeClass("activePassengerMobile");
			$(this).addClass("activePassengerMobile");

			$(this).find("input [type=checkbox]").click();
		});

		$('.return-passenger-list').unbind('click').click( function(e)
		{
			e.preventDefault();
			e.stopPropagation();
			$('.detalles-vuelo-mobile').show();
			$('.seleccion-asiento-mobile').hide();
			$('.atn-mobile').toggleClass('open');
			$('.atn-footer').slideToggle().toggleClass('hidden');
			$('footer').show();
			$('.menuScheduleWrp').show();
			$('.btn-next').show();
			$('.btn-next-wrp').show();
		});

		$(document).on('click','.btn-green-interjet',function(e){
			$('.close').click();
		});
	
		$('.modal-footer').on('click', function(e){
			$('.close').click();
		});

		$('.btn-actualizar-mobile').on('click',function(e){

			for (var i = 0; i < _defaultSeat.length; i++) {
				_defaultSeat[i] = _tempSeats[i];
			}
			var arrayOfDataPSeat = $('.pasajeros-vuelo-mobile').find('.data-passenger-seat');
			for(var i = 0 ; i < arrayOfDataPSeat.length ; i ++){
				if(_tempSeats[i] != undefined)
				{
					if(_tempSeats[i] != "N/A")
					{
						$(arrayOfDataPSeat[i]).text(_tempSeats[i].replace("-",""));
					}
					else
					{
						$(arrayOfDataPSeat[i]).text(_tempSeats[i]);
					}
				}
			}
			$('.return-passenger-list').click();
		});
	}

//Selects seat clicked on, desktop version
	function selectSeatDesktop()
	{
		$(document).on('click', ".asiento", function(e)
		{
			//removes previous tolltip if any exists
			$('.tooltip-asiento').remove();
			//checks current passenger selected
			var activePassenger = $(document).find('.activePassenger');

			if($(this).hasClass("asignado"))
			{
				return;
			}
			//if this is a special seat, displays warning
			if($(this).hasClass("especial"))
			{
				e.preventDefault();
	        	$('.modalemergency').modal('show');
	        	$(".modal-body").css("overflow-y","scroll");
	        	$(".modal-header").css("overflow-y","scroll");
	        	$(".modal-title").css("overflow-y","scroll");
			}
			if($(this).hasClass("ocupado"))
			{
				return;
			}
			

			if($(this).hasClass("disponible"))
			{
				
				var innerTextAsientoPasajero = activePassenger.find('.data-passenger-seat')[0].innerText;
				//Breaks name of passenger at every Uppercase
				var primeraLetra = $(activePassenger.find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/);
				//Gets first letter of every name a passenger has
				var inicialesPassengers = ( primeraLetra[0].substring(0,1) + primeraLetra[1].substring(0,1) );
				$(this).text(inicialesPassengers);
				//IDs have 2-B parsing while texts have 2B, this adjusts ID search accounting for such
				$('#'+innerTextAsientoPasajero.replace(/\s/g,'-')+'').text(innerTextAsientoPasajero.substring(2,3));
				activePassenger.find('.data-passenger-seat')[0].innerText = ($(this)[0].id).replace("-","");
				$(activePassenger.find('.data-passenger-seat')[0]).addClass("selected-green");
				//Accounts for possible 2B id instead of 2-B
				if(innerTextAsientoPasajero.replace(/\s/g,'-').split("").length<2)
				{
					var nomenclatura = (  innerTextAsientoPasajero.replace(/\s/g,'-')  ).substring(0,1) + "-" + (  innerTextAsientoPasajero.replace(/\s/g,'-')  ).substring(1,2);
					asignNewSeat(nomenclatura,$(this)[0].id);
					$(activePassenger.find('.data-passenger-seat')[0]).text( nomenclatura.substring(1,2) );
				}else
				{
					var nomenclatura = (innerTextAsientoPasajero.replace(/\s/g,'-').substring(0,1) + "-" + innerTextAsientoPasajero.replace(/\s/g,'-').substring(1,2)  );


					asignNewSeat(nomenclatura,$(this)[0].id);
					$('#'+( innerTextAsientoPasajero.substring(0,1)  +"-"+ innerTextAsientoPasajero.substring(1,2) )).text(nomenclatura.substring(2,3));
				}
				
				//Once a seat has been changed this enables "Reestablecer" buttons
				activePassenger.parent().parent().find('.btn-reestablecer')[0].disabled=false;

				return;

			}



		});
	}

//Selects seat clicked over, mobile version
	function selectSeatMobile()
	{
		//if seat is special this displays alert
		$( ".especial" ).click(function(e) {
			e.preventDefault();
	    	$('.modalemergency').modal('show');
		  
		});


		$( ".disponible, .asignado, .especial" ).click(function(e) 
		{
			$("body").bind( "click", function() 
			{
				//removes tolltip if any exists
				$(".popUp-seleccion-mobile").remove();
			 	$( "body").unbind( "click" );
			});
			//Gets current ID
			pasajeroActualId = $(this).attr("id");
			e.preventDefault();
			e.stopPropagation();
			var mobileArrayPassengerChange = $('.pasajeros-vuelo-mobile').find('.data-passenger');
			var mobileArrayPassengerSeat = new Array();
			var mobileArrayPassengerName = new Array();

			costToMove = "$489";
			if($(this).hasClass("asignado"))
			{
				costToMove = "Cambio sin costo";
			}
			if(modalPassengerMobile)
			{

				var popUpOffset = $($(this).find('.popUp-seleccion-mobile')[0]).offset();
				var wantedSeat = $(this).attr("id");
				//when clicking on a passenger from the tooltip this changes the passenger's seat 
				$(".passengerMobile").on('click', function(e)
				{
					e.stopPropagation();


					var arrayParent = $('.passengerMobileParent').children();
					for(var t = 0 ; t < arrayParent.length ; t++)
					{
						var parentArray = $(arrayParent[t]);
						var thisArray = $(this);

						if(parentArray.is(thisArray))
						{
							_mobilePasChanged = t+1;
						}
					}
					$(".passengerMobile").removeClass("activePassengerMobile");
					$(".pasajeroCheckbox").prop('checked', false);
					$(this).addClass("activePassengerMobile");
					$(this).find(".pasajeroCheckbox").prop('checked', true);
					var verifySeat = function(){
					  if(numasiento[0] != undefined)
						{
							
							
							//Changes the seat of the passenger from current to new selected
							 mobileArrayPassengerSeat[_mobilePasChanged] = mobileArrayPassengerChange.find('.data-passenger-seat')[_mobilePasChanged];
							 mobileArrayPassengerName[_mobilePasChanged] = mobileArrayPassengerChange.find('.data-passenger-name')[_mobilePasChanged];
							 var primeraLetra = $(mobileArrayPassengerName[_mobilePasChanged]).text().split(/(?=[A-Z])/);

							 var oldSeat = numasiento[0].innerText;

							 var inicialesPassengers = ( primeraLetra[1].substring(0,1) + primeraLetra[2].substring(0,1) );
							 $('#' + pasajeroActualId ).text( inicialesPassengers ) ;
							 //Accounts from parsing of ID from 2B to 2-B
							 if((oldSeat.length)<3)
								{
									var newOldSeatId = oldSeat.substring(0,1) + "-" + oldSeat.substring(1,2);
								}
							 $('#' + (newOldSeatId) ).text(newOldSeatId.substring(2,3));
							$('#' + (oldSeat).replace(" ","-") ).removeClass("asignado");
							$('#' + (oldSeat).replace(" ","-") ).addClass("disponible");
							$('#' +  (wantedSeat).replace(" ","-") ).addClass("asignado");
							$('#'+((oldSeat).replace(" ","-"))).text( oldSeat.substring(2,3));

							$(mobileArrayPassengerSeat[_mobilePasChanged]).addClass("selected-green");
							numasiento[0].innerText = wantedSeat.replace("-","");
							_defaultSeat[ indexPasActivo ] = wantedSeat;

							asignNewSeat(oldSeat,wantedSeat);

							modalPassengerMobile=false;
							$('.popUp-seleccion-mobile').hide();
						}
					};
					//Waits 0.3 seconds to stop displaying the tooltip, as to verify selection
					setTimeout(verifySeat, 300);

					var numasiento = $('.activePassengerMobile').find('.mobilePassengerSeat');
					var indexPasajero = 0;
					var indexPasActivo = 0;
					//this checks which passenger is changing seats
					$('.passengerMobile').each(function(){
						if($(this).hasClass("activePassengerMobile")){
							indexPasActivo = indexPasajero;
							return;
						}
						indexPasajero++;

					});

					var arrayofAsignados = $("#asientos-en-avion-filas-mobile").find('.asignado');
					//this cheks the IDs of current asigned seats
					for (var k = 0 ; k < arrayofAsignados.length ; k++)
					{
						_tempSeats[k] = $(arrayofAsignados[k]).attr("id");
						
					}

				});

				modalPassengerMobile=false;
				return;
			} 
			if(modalPassengerMobile == false )
			{
				//This creates the tooltip structure
				$('.popUp-seleccion-mobile').remove();
				var addHTML3 = '<div class="popUp-seleccion-mobile" style="position:absolute; background-color:white; z-index:100;">'; 
						addHTML3 +='<div class="col-xs-12 cost-to-change-seats">';
							addHTML3 += ($(this).attr("id")).replace("-","")+'   '+costToMove+ " MXN";
						addHTML3 +='</div>';
						addHTML3 +='<div class="col-xs-12 passengerMobileParent">';
						for(var i=0;i<_numPassengers;i++){
							addHTML3 += '<div class="row passengerMobile '+i+'b">';
								addHTML3 += '<div class="col-xs-8 mobilePassengerName">';
									addHTML3 += "Omar Caballero "+ (i+1) +"";	
								addHTML3 += '</div>';
								addHTML3 += '<div class="col-xs-2 mobilePassengerSeat">';
									addHTML3 += ""+((_defaultSeat[i]).replace(" ","")).replace("-","")+"";
								addHTML3 += '</div>';
								addHTML3 += '<div class="col-xs-2 mobilePassengerCheck">';
									addHTML3 += '<input type="checkbox" class="pasajeroCheckbox">';	
									addHTML3 += '<div class="circle"></div>';
								addHTML3 += '</div>';
								
							addHTML3 += '</div>';
						}
						addHTML3 += '</div>';
				addHTML3 += '</div>';

				
				var idToEval = $(this).attr("id").split("-");

				$(this).append(addHTML3);

				//If tooltip is too close to left, right or bottom edges this adds the classes that change the styles
				var popUpOffset = $($(this).find('.popUp-seleccion-mobile')[0]).offset();
				
				var popUpWidth = $($(this).find('.popUp-seleccion-mobile')[0]).width();
				if(popUpOffset.top > $(window).height()-160)
				{
					$($(this).find('.popUp-seleccion-mobile')[0]).addClass("bottom-margin");
					
				}else{
					$($(this).find('.popUp-seleccion-mobile')[0]).removeClass("bottom-margin");
				}

				if(( idToEval[1] == "A" ) || ( idToEval[1] == "B" ))
				{
					$($(this).find('.popUp-seleccion-mobile')[0]).addClass("left-margin");
	
				}else{
					$($(this).find('.popUp-seleccion-mobile')[0]).removeClass("left-margin");
				}
				
				if(popUpOffset.left > $(window).width()-popUpWidth)
				{
					$($(this).find('.popUp-seleccion-mobile')[0]).addClass("right-margin");

				}else{
					$($(this).find('.popUp-seleccion-mobile')[0]).removeClass("right-margin");
				}

				if($(window).height()<560)
				{
					if( idToEval[1] == "C")
					{
						$($(this).find('.popUp-seleccion-mobile')[0]).addClass("left-margin");
		
					}
					if( idToEval[1] == "E")
					{
						$($(this).find('.popUp-seleccion-mobile')[0]).addClass("right-margin");
		
					}
				}


				modalPassengerMobile=true;
				return;
			}
						
			
		});
		  

		
	}
	
	//This opens the passengers details, there is only one open at a time
	function passengersDetaillsUnfold ()
	{
		$('.btn-slide-pasajeros').unbind('click').click( function(e)
		{
			e.preventDefault();
			e.stopPropagation();
			if(!$(this).closest(".vuelo-wrp").find('.detalles-pasajeros').is(":visible"))
			{
				var arrayOfVisibles = $('.detalles-pasajeros');
				var flag =  false;
				var counter = 0 ;
				arrayOfVisibles.slideUp("slow");
				$('.detalles-vuelo').removeClass("openSlide");
				$('.detalles-vuelo').addClass("closeSlide");

				for (var i = 0; i < arrayOfVisibles.length; i++) 
				{
					
					if( $(arrayOfVisibles[i]).is(":visible"))
					{
						counter++;
					}
				};
				
				if(  ($(this).parent().parent().parent().find('.detalles-pasajeros')).is(":visible") && (counter>0) )
				{

						$(this).parent().parent().addClass("closeSlide");
						$(this).parent().parent().removeClass("openSlide");
						$(this).parent().parent().parent().find('.detalles-pasajeros').slideUp("slow");

				}else
				{
					$(this).parent().parent().addClass("openSlide");
					$(this).parent().parent().removeClass("closeSlide");	
					$(this).parent().parent().parent().find('.detalles-pasajeros').slideDown("slow");
					$(this).parent().parent().parent().find('.detalles-pasajeros').find('.data-passenger').first().click();
				}
			}else
			{
				return;
			}

			
		});
	}

//If passenger does not have a N/A text, this changes his/her seat
	function assignPassenger()
	{
		$('.data-passenger').unbind('click').click( function(e)
		{
			if($(this).find(".data-passenger-seat")[0].innerText == "N/A"){
				return;
			}else{
				$('.data-passenger').removeClass("activePassenger");

				$(this).addClass("activePassenger");
			}
			
		});
	}
//This sets seats back to original y asigned seats
	function resetSeatsFunction()
	{
		$('.btn-reestablecer').unbind('click').click( function(e)
		{

			for(var i = 0 ; i < $('.asignado').length; i++){
				var arrayAsientosAsignados = $('.asignado');
				var currentAsientoAsignado = arrayAsientosAsignados[i];

				$(currentAsientoAsignado).removeClass("asignado"); 

				
			}
			var  arrayOfThisFlightPassenger = $(this).parent().parent().find('.data-passenger-seat');
			for(var i = 0; i<arrayOfThisFlightPassenger.length;i++){
				arrayOfThisFlightPassenger[i].innerText = _defaultSeat[i];
			}
			for(var i=0; i<_defaultSeat.length;i++)
			{
				if(_defaultSeat[i] != 'N/A'){

					
				var fixedId = _defaultSeat[i].replace(" ","-");
				var nameFixedId = _defaultSeat[i].substring(0,1) + "-" + _defaultSeat[i].substring(1,2);
				
				$('#'+_defaultSeat[i]).removeClass("ocupado");
				$('#'+_defaultSeat[i]).removeClass("disponible");
				$('#'+_defaultSeat[i]).removeClass("especial");
				$('#'+_defaultSeat[i]).addClass("asignado");     

				$('#'+fixedId).removeClass("ocupado");
				$('#'+fixedId).removeClass("disponible");
				$('#'+fixedId).removeClass("especial");
				$('#'+fixedId).addClass("asignado"); 

				$('#'+nameFixedId).removeClass("ocupado");
				$('#'+nameFixedId).removeClass("disponible");
				$('#'+nameFixedId).removeClass("especial");
				$('#'+nameFixedId).addClass("asignado"); 

				

				var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/);
				var inicialesPassengers = ( primeraLetra[0].substring(0,1) + primeraLetra[1].substring(0,1) );
				$('#'+nameFixedId).text(inicialesPassengers); 


				}
			}
			for (var i = 0; i < $('.btn-reestablecer').length; i++) 
			{
				($('.btn-reestablecer')[i]).disabled=true;
				$('.data-passenger-seat').removeClass("selected-green");
			}
			$('.data-passenger-seat').removeClass("selected-green");
		});
	}

//This creates the desktop version tooltip when hovering over each seat
	function showSeatPrice()
	{
		$(document).on('mouseover',".asiento",function(e)
		{
			if(!$(this).hasClass("ocupado") && !$(this).hasClass("asignado") )
			{
				$('.tooltip-asiento').remove();  
				var position = 'En medio';
				var newCopy = "Cambia tu asiento por";
				var evalPos = $(this).attr('id');
				evalPos =  evalPos.split(" ");
				if(evalPos[1] == "C" || evalPos[1] == "D")
				{
					position = 'Pasillo';
				}
				if(evalPos[1] == "A" || evalPos[1] == "F")
				{
					position = 'Ventana';
				}	
				var precio = '<span class="seat-price">$489 MXN</span>';
				var specialSeat = '<span class="exit-row">Fila de salida de emergencia</span>';
				var asientoID = '<span class="seat-num">'+($(this).attr('id')).replace("-","")+'</span>';
				var addHover = '<div style="position:absolute; height:250%; width:700%;" class="tooltip-asiento"><p>';
				if($(this).hasClass("especial")){
					addHover += ''+ asientoID +' '+ newCopy +' '+ specialSeat +' '+ precio +'';
				}else{
					addHover += ''+ asientoID +' '+ newCopy +'  '+ precio +'';
				}
				addHover += '</p></div>';
				$(this).append(addHover);

//If tooltip is too close to left, right or bottom edges this adds the classes that change the styles
				var popUpOffset = $($(this).find('.tooltip-asiento')[0]).offset();
			
				if(popUpOffset.top > $(window).height()-160)
				{
					$($(this).find('.tooltip-asiento')[0]).addClass("bottom-margin");
					
				}else{
					$($(this).find('.tooltip-asiento')[0]).removeClass("bottom-margin");
				}
				if(popUpOffset.left < 0)
				{
					$($(this).find('.tooltip-asiento')[0]).addClass("left-margin");

				}else{
					$($(this).find('.tooltip-asiento')[0]).removeClass("left-margin");
				}
				if(popUpOffset.left > $(window).width()-190)
				{
					$($(this).find('.tooltip-asiento')[0]).addClass("right-margin");

				}else{
					$($(this).find('.tooltip-asiento')[0]).removeClass("right-margin");
				}
				

	
			   //on Internet Explorer there is an issue with positioning after styles, this solves the issue
				if(msieversion())
				{
					var thisLeft = $($(this).find('.tooltip-asiento')[0]).position().left;
					 var thisStringLeft = ( thisLeft-125).toString();
					 $($(this).find('.tooltip-asiento')[0]).css("left", thisStringLeft + "px");
					
				}
			}
			//on Safari there is an issue regarding scrolling of seats, this solves the issue
			if(is_safari)
			{
				$('#asientos-en-avion-filas').click();
				$('#asientos-en-avion-filas').focus();
			}

		});
//Once you stop hovering over a seat, the tooltip is removed
		$(document).on('mouseleave',".asiento",function(e)
		{
			$('.tooltip-asiento').remove();  
		});
		
		


	}
//This checks if Internet Explorer is being used
	function msieversion() {

	    var ua = window.navigator.userAgent;

	    var msie = ua.indexOf("MSIE");

	    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
	    {

	        return true;
	    }


	    return false;
	}

//This changes both in desktop and mobile the passenger from the $oldSeat to the $newSeat, leaving available the $oldSeat
	function asignNewSeat($oldSeatID, $newSeatID){
		if(($oldSeatID.length)<3)
		{
			var newOldSeatId = $oldSeatID.substring(0,1) + "-" + $oldSeatID.substring(1,2);
			$oldSeatID = newOldSeatId ;
		}
		var newSeat = $('#'+$newSeatID);
		newSeat.addClass("asignado");


		var oldSeat = $('#'+$oldSeatID);
		oldSeat.addClass("disponible");
		oldSeat.removeClass("asignado");
	}

//This creates the Seat Chart structure on desktop
	function pintarTabla($wrapper)
	{
		_verticalSpaceFix = 0;
		//TOTAL SIZE to handle
		var name = $wrapper;

		//Get responsive Height
		_availableHeight = $(name).prop('scrollHeight')*_factor;
		var spaceBetweenSeats = 4 * _numberOfRows; //padding
		var tempMarginTop = 30; //marginTop
		var tempTotalHeight = _availableHeight-spaceBetweenSeats-tempMarginTop;
		_seatWidth =   tempTotalHeight /_numberOfRows;

		//Get responsive Width and fill with space
		var tempFixHorixontal = 0.23;
		if($(window).width() <768)
		{

		}
		var availableWidth = $(name).width()*tempFixHorixontal;
		var spaceBetweenSeatsV = 2 * _numberOfCols;
		var tempTotalWidth = availableWidth - spaceBetweenSeatsV;
		_seatWidth = tempTotalWidth/(_numberOfCols+1);

		var fix = ((_seatWidth + _verticalSpaceFix) * (_numberOfRows));
		
		if(fix < tempTotalHeight)
		{
			while(fix < tempTotalHeight)
			{
				_verticalSpaceFix++;
				fix = ((_seatWidth + _verticalSpaceFix) * _numberOfRows);

			}
		}
		else if(fix > tempTotalHeight)
		{
			while(fix > tempTotalHeight)
			{
				_verticalSpaceFix--;
				fix = (_seatWidth + _verticalSpaceFix) * _numberOfRows;
			}
		}

		if($(window).width() <860)
		{
			_spaceBetweenSeats = 5;
			_verticalSpaceFix = 5;
		}
		
		$('#asientos-en-avion-filas .seatRow').remove();

		for(j=0; j<_numberOfRows;j++)
		{
			var addHTML1='<div class="seatRow row" id="seatRow'+j+'"></div>';
			    
			$('#asientos-en-avion-filas').append(addHTML1);

			for(i=0; i<=_numberOfCols;i++)
			{
				var randomAsiento = Math.random();
				var tipoDeAsiento = "disponible";
				//Random occupied seats for demonstrative purposes
				if(randomAsiento > 0.8)
				{
					tipoDeAsiento = "ocupado";
				}
				//Rows 10 and 11 are special seats
				if(j==9 || j ==10)
				{
					tipoDeAsiento = "especial";
				}

				
				var numberfix = 0;
				if(j+1 >= 13)
				{
					numberfix++;
				}

				var hauntedRowFix = (j+1+numberfix)+' '+_ABCdario[i];
				var hauntedRowNumber = (j+1+numberfix);
				var verticalAlign =  ((j*_seatWidth)+((_spaceBetweenSeats+_verticalSpaceFix)*j));
				
				var iterate = 'seatRow';
				//Actual structure of seats
				if(i < (_rowsBeforeAisle))
				{
					var addHTML2= '<div id="'+(hauntedRowFix.replace(" ","-"))+'" class="asiento '
					+tipoDeAsiento+'" style="text-align:center; top:'
					+ verticalAlign +'px ; left:'
					+ ((i*_seatWidth)+(_spaceBetweenSeats*i)) +'px ;  position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+_ABCdario[i]+'<div>'
					$('#'+iterate+j).append(addHTML2);	
				}
				else if(i == (_rowsBeforeAisle))
				{
					var addHTML2= '<div class="pasillo" style="text-align:center; top:'
					+ verticalAlign +'px ; left:'
					+ ((i*_seatWidth)+(_spaceBetweenSeats*i)) +'px ; position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+hauntedRowNumber+'</div>'
					$('#'+iterate+j).append(addHTML2);
				}else
				{
					var addHTML2= '<div id="'+(hauntedRowNumber)+'-'+_ABCdario[i-1]+'" class="asiento '
					+tipoDeAsiento+'" style="text-align:center; top:'
					+ verticalAlign +'px ; left:'
					+ ((i*_seatWidth)+ (_spaceBetweenSeats*i)) +'px ;  position: absolute;  width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+_ABCdario[i-1]+'<div>'
					$('#'+iterate+j).append(addHTML2);
				}
			}
			

		}

//This gets the asigned-to-passenger seats their class while removing all others
		for(var i=0; i<_defaultSeat.length;i++){
			if(_defaultSeat[i] != 'N/A'){
			
				var fixedId = _defaultSeat[i].replace(" ","-");
				var nameFixedId = _defaultSeat[i].substring(0,1) + "-" + _defaultSeat[i].substring(1,2);
				
				$('#'+_defaultSeat[i]).removeClass("ocupado");
				$('#'+_defaultSeat[i]).removeClass("disponible");
				$('#'+_defaultSeat[i]).removeClass("especial");
				$('#'+_defaultSeat[i]).addClass("asignado");     

				$('#'+fixedId).removeClass("ocupado");
				$('#'+fixedId).removeClass("disponible");
				$('#'+fixedId).removeClass("especial");
				$('#'+fixedId).addClass("asignado"); 

				$('#'+nameFixedId).removeClass("ocupado");
				$('#'+nameFixedId).removeClass("disponible");
				$('#'+nameFixedId).removeClass("especial");
				$('#'+nameFixedId).addClass("asignado");   

				var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/);
				var inicialesPassengers = ( primeraLetra[0].substring(0,1) + primeraLetra[1].substring(0,1) );
				$('#'+nameFixedId).text(inicialesPassengers); 


			}
		}

//Changes chart size according to window size
		$(".selectSeats .plane-seats .select-seats #asientos-en-avion-filas").css("margin-left","44px");
		if($(window).width()<1200)
		{
			$(".selectSeats .plane-seats .select-seats #asientos-en-avion-filas").css("margin-left","33px");
		}
		if($(window).width()<860)
		{
			$(".selectSeats .plane-seats .select-seats #asientos-en-avion-filas").css("margin-left","18px");
		}

		if(is_safari)
		{
			$('#asientos-en-avion-filas').click();
			$('#asientos-en-avion-filas').focus();
		}
	}



	function pintarTablaMobile($wrapper)
	{
		//This creates the Seat Chart structure on mobile
		var mobileVerticalSpace = 2;
		var name = $wrapper;
		_availableHeight = $(window).height();
		var spaceBetweenSeats = 4 * _numberOfRows; 
		var tempMarginTop = 10; 
		var tempTotalHeight = _availableHeight-tempMarginTop;
		
		var aspectRatio = tempTotalHeight/($(name).width()/3.7);

		var widthFixer = 0;
		//Check for horizontal or vertical orientation
		if($(window).width() > $(window).height())
		{
		
			widthFixer = 4;
		}

		var availableWidth = $(window).width() - 75;
		var spaceBetweenSeatsV = 4 * _numberOfCols;
		var tempTotalWidth = availableWidth - spaceBetweenSeatsV;

			_seatWidth =   tempTotalHeight /_numberOfRows;

			_seatWidth = (tempTotalWidth/(_numberOfCols+1))-widthFixer ;
		

		$('#asientos-en-avion-filas-mobile .seatRowMobile').remove();

//Actual chart structure
		for(j=0; j<=_numberOfRows;j++)
		{	
			var addHTML1='<div class="seatRowMobile row" id="seatRowMobile'+j+'"></div>';


			$('#asientos-en-avion-filas-mobile').append(addHTML1);
			for(i=0; i<=_numberOfCols;i++)
			{
				var randomAsiento = Math.random();
				var tipoDeAsiento = "disponible";
				if(randomAsiento > 0.8)
				{
					tipoDeAsiento = "ocupado";
				}

				if(j==9 || j ==10)
				{
					tipoDeAsiento = "especial";
				}
				var numberfix = 0;
				if(j+1 >= 13)
				{
					numberfix++;
				}
				var valueMobile = 5;

				var hauntedRowFix = (j+1+numberfix)+' '+_ABCdario[i];
				var hauntedRowNumber = (j+1+numberfix);
				var verticalAlign =  ((j*_seatWidth)+((mobileVerticalSpace)*j));

				
				var iterate = 'seatRowMobile';
				if(j != _numberOfRows)
				{
					if(i < (_rowsBeforeAisle))
					{
						var addHTML2= '<div id="'+(hauntedRowFix.replace(" ","-"))+'" class="asientoMobile '+tipoDeAsiento+'" style="margin-left:'+(widthFixer*3)+'px; text-align:center; top:'
						+ verticalAlign +'px ; left:'
						+ ((i*_seatWidth)+(_spaceBetweenSeats*i))+'px ;  position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+_ABCdario[i]+'<div>'
						$('#'+iterate+j).append(addHTML2);	
					}else if(i == (_rowsBeforeAisle))
					{
						var addHTML2= '<div class="pasilloMobile" style="margin-left:'+(widthFixer*3)+'px; text-align:center; top:'
						+ verticalAlign +'px ; left:'
						+ ((i*_seatWidth)+(_spaceBetweenSeats*i)) +'px ; position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+hauntedRowNumber+'</div>'
						$('#'+iterate+j).append(addHTML2);
					}else
					{
						var addHTML2= '<div id="'+ (hauntedRowNumber)+'-'+_ABCdario[i-1]+'" class="asientoMobile '+tipoDeAsiento+'" style="margin-left:'+(widthFixer*3)+'px; text-align:center; top:'
						+ verticalAlign +'px ; left:'
						+ ((i*_seatWidth)+(_spaceBetweenSeats*i)) +'px ;  position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth) +'px;">'+_ABCdario[i-1]+'<div>'
						$('#'+iterate+j).append(addHTML2);
					}
				}
				
				//Issue displaying chart all the way down while scrolling, this fixes that issue
				if(j == _numberOfRows)
				{
					var horizontalAxis = 2;
					if($(window).width() > $(window).height())
					{
						horizontalAxis = 0;
					}
					var addHTML2 = '<div class="col-sm-12" style="text-align:center; top:'
					+ verticalAlign +'px ; left:'
					+ ((i*_seatWidth)+(_spaceBetweenSeats*i)) +'px ;  position: absolute; width:'+ (_seatWidth) +'px; height:'+ (_seatWidth)/(horizontalAxis) +'px; background-color:red; visibility:hidden">';
					addHTML2 += '<div class="row" >';
					addHTML2 += '<div class="col-sm-12" >';
					addHTML2 += '</div>';
					addHTML2 += '</div>';
					addHTML2 += '</div>';
					$('#'+iterate+j).append(addHTML2);
				}
			}
			

			for (var i = 0; i < $('.seatRowMobile').length; i++) {
				$($('.seatRowMobile')[i]).css('margin-left",'+(widthFixer*3)+'px');

			}
			$('mobile-seats-wrp').css('margin-left",'+(widthFixer*3)+'px');
			selectSeatMobile();
		}

		

//This assigns seats currently assigned to passengers
		for(var i=0; i<_defaultSeat.length;i++){
			if(_defaultSeat[i] != 'N/A'){
				var fixedId = _defaultSeat[i].replace(" ","-");
				var nameFixedId = _defaultSeat[i].substring(0,1) + "-" + _defaultSeat[i].substring(1,2);
				
				$('#'+_defaultSeat[i]).removeClass("ocupado");
				$('#'+_defaultSeat[i]).removeClass("disponible");
				$('#'+_defaultSeat[i]).removeClass("especial");
				$('#'+_defaultSeat[i]).addClass("asignado");     

				$('#'+fixedId).removeClass("ocupado");
				$('#'+fixedId).removeClass("disponible");
				$('#'+fixedId).removeClass("especial");
				$('#'+fixedId).addClass("asignado"); 

				$('#'+nameFixedId).removeClass("ocupado");
				$('#'+nameFixedId).removeClass("disponible");
				$('#'+nameFixedId).removeClass("especial");
				$('#'+nameFixedId).addClass("asignado"); 

				var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/);
				var inicialesPassengers = ( primeraLetra[0].substring(0,1) + primeraLetra[1].substring(0,1) );
				$('#'+nameFixedId).text(inicialesPassengers); 
			}
		}
		
		if($(window).width() > $(window).height())
		{
			$("#asientos-en-avion-filas-mobile").css("padding-left", "38px");
		}
		else
		{
			$("#asientos-en-avion-filas-mobile").css("padding-left", "32px");
		}
		
		
	}


});

//////// Fin Seccion Seats  /////////
//////// Inicio Seccion Extras  /////////

$(document).ready(function()
{

//JSON Test package
console.log( document.location.href.match(/[^\/]+$/)[0] );
    var passenger = 
    {
        firstName:"John", 
        lastName:"Doe", 
        specialService:"", 
        extraWeight:"",
        otherWeight:"",
        pet:""
    };

//Global variables
if( document.location.href.match(/[^\/]+$/)[0] == "extras.html")
{
    var valorServicio = "500 MXN";
    var tipoServicio = "1 maleta extra";
    var pasajeroServicio = "Luisa Meneses";
    var addHTML = '';
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var _arrayOfPassengers = $('.passengerCol').find('input');
    var _arrayOfChoiceOne = $('.complementCol').find(".select-complement");
    var _arrayOfChoiceTwo = $('.complementCol2').find(".select-complement");
    var isIE = (navigator.userAgent.indexOf("MSIE") != -1);
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    var _passengerNames = new Array();
    _passengerNames = ["Luisa Meneses","Ryan Golsling","James Blake","Sylvia Plat"];

    var _isMobile = false;


    initSection();
}
    

    function initSection()
    {
        setUp();
    }
if (!!navigator.userAgent.match(/Trident\/7\./))
{
   isIE = true;
}else{
   isIE = false;
}

// Checks and sets if mobile or desktop version should be used
    function checkVersion()
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width()<760 )
        {
            _isMobile = true;
        }else
        {
            _isMobile = false;
        }

    }

//Checks version everytime windows changes size
    $(window).resize(function()
    {
        checkVersion();

    });

//Sets basic functionability
    function setUp()
    {
        $(".select-options").hide();

        $(".close-btn").click(function()
        {
            $("#modalServices").modal("hide");
        });
        $(".btn-secondary").click(function()
        {
            $("#modalServices").modal("hide");
        });
        
       

        $('.box-hotel-info').hide();
        $($('.hotelListHotels').find('.box-hotel-info')[0]).show();
        
        checkVersion();
        openSection();
        selectOptions();
       
        deleteService();
        addDeleteServices();

//Checks if mobile or desktop version is being used and calls either functionability
        if(_isMobile)
        {
            mobileSetUp();
        }else
        {
            desktopSetUp();
        }
        closeAllSections();
        checkBoxVisibility();
        clickSection();
        modalCalls();

        selectPassenger();
    }

//When section is clicked call according functions
    function clickSection()
    {
        addSpecialService();
        addExtraWeight();
        otherWeight();
        pet();
    }

//Makes sure all sections are closed to be later opened
    function closeAllSections()
    {
        //Desktop
        $("#slideServiciosEspeciales").hide();
        $("#slideEquipajeExtra").hide();
        $("#slideDeportivoInstrumento").hide();
        $("#slideMascota").hide();
        $("#slideSeguroViaje").hide();
        $("#slideInterjetTierra").hide();
        $("#slideEstacionamiento").hide();
        $("#slideRentaAuto").hide();
        $("#slideapartarhotel").hide();
        $('.col-delete').hide();
        $('.link-delete-car').hide();
        $('.link-delete-parking').hide();
       
        //Mobile
        $("#slideServiciosEspecialesMobile").hide();
        $("#slideEquipajeExtraMobile").hide();
        $("#slideDeportivoInstrumentoMobile").hide();
        $("#slideMascotaMobile").hide();
        $("#slideSeguroViajeMobile").hide();
        $("#slideInterjetTierraMobile").hide();
        $("#slideEstacionamientoMobile").hide();
        $("#slideRentaAutoMobile").hide();
        $("#slideapartarhotelMobile").hide();
        $('.col-delete').hide();
    }

   
//When   $selector  is clicked either   $target   or   $targetMobile   slides open depending of version
    function openSectionBindClick($selector, $target, $targetMobile)
    {
        $("#"+$selector).click(function()
        {
            if(_isMobile)
            {
                $('#'+$targetMobile).slideToggle( "slow", function() 
                {
                    checkBoxVisibility();
                });
            }else
            {
                $('#'+$target).slideToggle( "slow", function() 
                {
                    checkBoxVisibility();
                });
            }
        });
    }

//After section slides up or down it adds or removes "open" classes for styles
    function checkBoxVisibility()
    {
        for(var i = 0; i < $('.complementaTuViajeWrp .ico-slider').length ; i++)
        {   

           if(  $($('.complementaTuViajeWrp .ico-slider')[i]).closest(".container").find(".infoComplements").is(":visible") )
           {
                $($('.complementaTuViajeWrp .ico-slider')[i]).addClass("open");
                $($('.complementaTuViajeWrp .ico-slider')[i]).closest(".container").addClass("open-mobile");
                //open-mobile
           }else
           {
                $($('.complementaTuViajeWrp .ico-slider')[i]).removeClass("open");
                $($('.complementaTuViajeWrp .ico-slider')[i]).closest(".container").removeClass("open-mobile");
           }
           
        }
    }

//Opening of sections gets called
    function openSection()
    {   
        openSectionBindClick("sliderServiciosEsp","slideServiciosEspeciales", "slideServiciosEspecialesMobile");
        openSectionBindClick("sliderEquipajeExtra","slideEquipajeExtra", "slideEquipajeExtraMobile");
        openSectionBindClick("sliderDeportivoInstrumento","slideDeportivoInstrumento", "slideDeportivoInstrumentoMobile");
        openSectionBindClick("sliderMascota","slideMascota", "slideMascotaMobile");
        openSectionBindClick("sliderSeguroViaje","slideSeguroViaje", "slideSeguroViajeMobile");
        openSectionBindClick("sliderInterjetTierra","slideInterjetTierra", "slideInterjetTierraMobile");
        openSectionBindClick("sliderEstacionamiento","slideEstacionamiento", "slideEstacionamientoMobile");
        openSectionBindClick("sliderRentaAuto","slideRentaAuto", "slideRentaAutoMobile");
        openSectionBindClick("sliderapartarhotel","slideapartarhotel", "slideapartarhotelMobile");
        openSectionBindClick("btn-table-mobile","table-mobile-info","table-mobile-info");
        $('.btn-table-mobile').on('click',function()
        {
            $(".table-mobile-info").slideToggle( "slow", function() 
                {

                   
                     if(  $(this).is(":visible") )
                       {
                            $(this).parent().addClass("open");
                       }else
                       {
                            $(this).parent().removeClass("open");
                       } 
                });
        });

    }
//Modal alerts get called
    function modalCalls()
    {

        showModals(".cancel-policy","#modalCancelPolicy");
        showModals('.link-more-pets','#modalPets');
        showModals('.link-more-sport','#modalSport');
        showModals('.link-more-seguro','#modalSeguro');
        showModals('#hotel-parking-01','#hotelParking-01');
        showModals('#hotel-parking-02','#hotelParking-02');
        showModals('#mapMarriot','#modalMarriot');
        showModals('#mapCaminoReal','#modalCaminoReal');
        showModals('.link-more-info','#modalParking');
        showModals('#terms-avis','#modalAvis');
        showModals('#mapShuttle','#modalInterjetTierra');
        
    }

//When $linkClicked  is clicked $modalToShow is shown
    function showModals($linkClicked , $modalToShow)
    {
        //Check if there's a checked checkbox and preserve state
        /*var boxes = $(linkClicked).parent().find('input')
        if( boxes.length > 0 )
        {
            for (var i = 0; i < boxes.length; i++) 
            {
                if($(boxes[i])[0].checked)
                {
                    $(boxes[i])[0].checked = true;
                }
            };
        }*/
        $($linkClicked).on('click',function(e){
            $($modalToShow).modal("show");
        });
    }

//if desktop version is being used, makes sure mobile items are hidden and desktop items are shown
    function desktopSetUp()
    {
        $('.hiddenMobile').show();
        $('.viewMobile').hide();
    }
//if mobile version is being used, makes sure desktop items are hidden and mobile items are shown
    function mobileSetUp()
    {
        $('.hiddenMobile').hide();
        $('.viewMobile').show();
    }

//Use this section to remove services
    function addDeleteServices()
    {
        $('.btn-add, .btn-primary').on('click',function(e)
        {
           
            $(this).closest('.modalComplements').modal("hide");
        });
        $('.link-delete-green, .eliminar-servicio-solicitado, .link-delete').on('click',function(e)
        {
            
            $('#modalDelete').modal("show");
        });
        $('.link-modify').on('click',function(e)
        {
           
            $('.col-delete').show();
        });
    }


    function selectOptions()
    {

//When clicking outside of an input/menu or clicking a different one, this removes active styles and closes sections
      
        $(document).on('click', function(e){
            $('.input-material').removeClass("active");
            $(".select-options").slideUp("slow");
            $('.btn-select').removeClass("open");
        });
       
        $("input, .btn-select, .option-complementos, .btn-select, .datepicker, .btn-num, input-material").on('click', function(e){
            $('.input-material').removeClass("active");
            $(".select-options").slideUp("slow");
            $('.btn-select').removeClass("open");
            
            $(($(this).closest('.input-material'))[0]).addClass('active');
        });
        

        $("input[type=text]").on('click',function(e)
        {
            e.stopPropagation();
            $(this).addClass("active");
            $(this).closest('.input-material').addClass("active");
        });
//When clicking a dropdown menu this adds active class and either closes or opens the menu
        $('.btn-select').on('click', function(e)
        {
            var btnOptions = $(this).parent().find(".select-options");
             $('.btn-select').removeClass("open");
             $(this).addClass("open");

            if(btnOptions.is(":visible"))
            {
                btnOptions.slideUp("slow");
                $(this).removeClass("open");
            }else
            {
                btnOptions.slideDown("slow");
            }
        });
        $('.option-complementos').on('click', function(e)
        {
           var  newOption = $(this).text();
           var  newCost = 'Con X cargo';
           var newText = newOption + '<span class="option-cost">'+ newCost +'</span>';
           $(this).closest(".select-complement").find(".option-active").html(newText) ;
           $(this).closest(".select-options").slideUp("slow");
        });
//adds active class for styles to input selected
        $('.input-material').on('focus click', function(e)
        {
            $(this).addClass("active");
        });
//when selecting an option inside a dropdown menu, changes the button's text to the option's, also adds price to Total
        $('.select-complement .btn-select').on('click', function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            $('.select-options-list li').on('click', function(event)
            {
                event.stopPropagation();
                event.preventDefault();
                //gets the option's text

                var newText = $(this).text();
                var newParsedText = '';
                var cont = 0;

                for (var i = 0; i < newText.split(" ").length ; i++) {
                    
                    if( newText.split(" ")[i] != undefined )
                    {
                        
                        if( (newText.split(" ")[i]).substring(0,1) == "$" )
                        {
                            cont++;
                        }
                        if (cont <1)
                        {
                            newParsedText += newText.split(" ")[i] + " ";
                        }else if(cont == 1)
                        {
                            newParsedText += '<span class="option-cost">'+newText.split(" ")[i]+' ';
                            cont++;
                        }else if(cont == 2)
                        {
                            newParsedText += " " + newText.split(" ")[i]+'</span>' + " ";
                            cont++;
                        }else
                        {
                            newParsedText += newText.split(" ")[i] + " ";
                        }
                        
                        
                    }
                    
                }
                if(newText.substring(0,7) == "1 silla")
                {
                    newParsedText = '<span class="option-active">1 silla de ruedas <span class="option-cost">Sin cargo extra</span></span>';
                }
                
                var newTotal = 0;
                //changes button's text for option's
                $(this).closest('.select-complement').find('.option-active').html(newParsedText);
                $(this).closest('.select-complement').find('.select-options').slideUp("slow");
                var arrayOfBtns = $(this).closest(".infoComplements").find(".btn-select");

                //gets price valie from all enabled options buttons and adds them together
                for (var i = 0; i < arrayOfBtns.length; i++) 
                {
                  if(  !$(arrayOfBtns[i]).is(":disabled")  ) 
                  {    
                        var arrayForPrice = $($(arrayOfBtns[i]).find(".option-active").text().replace(",","").split(" ")) ;
                        for(var j = 1 ; j < arrayForPrice.length ; j++)
                        {              
                            if(arrayForPrice[j] != undefined)
                            {
                                
                                if( !isNaN( parseInt(arrayForPrice[j].substring(1)) )  )
                                {
                                    newTotal = newTotal + parseInt(arrayForPrice[j].substring(1)) ;
                                }
                                else
                               {
                                    newTotal = newTotal ;
                                }
                            }
                            else
                            {
                                
                            }
                        }
                   }
                }
                if(newTotal.toString().split('').length > 3)
                {
                    var newParsedTotal = newTotal.toString().substring(0,1) + ","+ newTotal.toString().substring(1);
                }else
                {
                    var newParsedTotal = newTotal;
                }

                //sets added price value as new text
                $(this).closest('.container').find('.comp-total').html('Total: <span> $'+newParsedTotal+' MXN </span>');
                
            });
            //makes whole datepicker area clickable
            var datepickerFailsafe = $(this).find('.datepicker');
            if(datepickerFailsafe != undefined)
            {
                datepickerFailsafe.focus();

            }
        });
        //checks and unchecks Insurance
        if(isFirefox)
        {
            $('.checkbox-label-secure').click(function(e)
            {
                $('.newsquare').click();
                

            });
        }
        $('.newsquare').click(function(e)
        {
            $(this).parent().find("input").focus();
            if(isFirefox)
            {
                $('#checkboxsecure').click();
            }
           
           
        });
        //adds or removes value from Insurance when checkbox is clicked
        
        $('#checkboxsecure').click(function(e){
        
            
            if($('#checkboxsecure').is(":checked"))
            {
               
                $(this).closest('.container').find('.comp-total').html('Total <span> $'+89+' MXN </span>');
                return;
            }else
            {
                
                $(this).closest('.container').find('.comp-total').html('Total <span> $'+0+' MXN </span>');
                return;
            }
            return;
        });

        var checkCont = 0;
        $('#readTerms').on('click', function(e){  
        checkCont++  
        
        if(isFirefox)
        {

            if(checkCont%3 == 0)
             {
            
                if( ($(this).parent().find("input").prop("checked")) )
                {
                    ($(this).parent().find("input").prop("checked",true));
                }else
                {
                    ($(this).parent().find("input").prop("checked",false));
                } 
             } 
        }else if(isIE || isIE11)
        {
            
          clearSelection();
            if(checkCont%1 == 0)
            {
               
                if( ($(this).parent().find("input").prop("checked")) )
                {

                   
                    ($(this).parent().find("input").prop("checked",true));
                }else
                {
                  
                    ($(this).parent().find("input").prop("checked",false));
                } 
            }
            
        }else
        {

            if(checkCont%2 == 0)
            {
                
                if( (!$(this).parent().find("input").prop("checked")) )
                {
                    
                    ($(this).parent().find("input").prop("checked",true));
                }else
                {
                  

                    ($(this).parent().find("input").prop("checked",false));
                } 
            }
        }
   
        });
//changes between car model options
        $('.car-info').on('click',function(e)
        {
            $('.link-delete-car').hide();
            $('.car-info').removeClass("active");
            $(this).addClass("active");
            //link-delete-car
            $(this).find(".link-delete-car").show();
        });

//changes between parking options
        $('.box-parking').on('click',function(e)
        {
            $('.link-delete-parking').hide();
            $('.box-parking').removeClass("active");
            $(this).addClass("active");
            $(this).find(".link-delete-parking").show();
        });
//Calendar begins on Mondat rather than Sunday, calendar day names are contractions set here
        var firstDay = $( ".datepicker" ).datepicker( "option", "firstDay" );
        var dayNames = $( ".datepicker" ).datepicker( "option", "dayNames" );
        var dayNamesMin = $( ".datepicker" ).datepicker( "option", "dayNamesMin" );
        var dayNamesShort = $( ".datepicker" ).datepicker( "option", "dayNamesShort" );
 
        $( ".datepicker" ).datepicker( "option", "firstDay", 1 );
        $( ".datepicker" ).datepicker( "option", "dayNames", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );
        $( ".datepicker" ).datepicker( "option", "dayNamesMin", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );
        $( ".datepicker" ).datepicker( "option", "dayNamesShort", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );

        $('.datepicker').datepicker({
            firstDay: 1,
            dayNames: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ],
            dayNamesMin: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ],
            dayNamesShort: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ]
        });
        $('#ui-datepicker-div').hide();

//changes between car type options
        $('.menuSelectCar li').on('click' , function(e)
        {
            $('.menuSelectCar li').removeClass("active");
            $(this).addClass("active");
        });
//allows change of hotel options
        $('.moreHotels').on('click',function(e){
            $('.box-hotel-info').show();
        });
        $('.box-hotel-info').on('click',function(e){
            $('.box-hotel-info').hide();
            $('.box-hotel-info').removeClass("active");
            $(this).show();
            $(this).addClass("active");
        });
//  
        $('.input-material').on('click', function(e){
            $(this).addClass("active");
        });

    }
    function activeOptionBox()
    {
        for (var i = 0; i < _arrayOfPassengers.length; i++) 
        {
            if(!$( _arrayOfPassengers[i]).is(":checked"))
            {
                $(_arrayOfChoiceOne[i]).find(".btn-select").prop("disabled",true);
                $(_arrayOfChoiceTwo[i]).find(".btn-select").prop("disabled",true);
               
            }else
            {
                $(_arrayOfChoiceOne[i]).find(".btn-select").prop("disabled",false);
                $(_arrayOfChoiceTwo[i]).find(".btn-select").prop("disabled",false);
            }
        }
    }
    //Enables or disables passenger options depending of checkbox status
    function selectPassenger()
    {
        activeOptionBox();

        $('.checkbox-wrp').click(function(e) 
        {
            e.preventDefault();
            e.stopPropagation();
            console.log( $(this) );
           if($(this).parent().find('#terms-avis')[0] === null || $(this).parent().find('#terms-avis')[0] === undefined)
           {
            var input = $(this).find("input")[0];
            $(input)[0].checked =  !$(input)[0].checked;
            activeOptionBox();
            console.log("great1");
           }
                         
        }); 

        $('.checkbox-label-service').click(function(e) 
        {
            e.preventDefault();
            e.stopPropagation();
            console.log($(this).parent().find("a")[0]);
            if($(this).parent().find("a")[0] === null || $(this).parent().find("a")[0] === undefined)
            {
                var input = $(this).parent().find("input")[0];
                console.log("clickCheck");
                $(input)[0].checked =  !$(input)[0].checked;
                activeOptionBox();
                console.log("great3", $(this).attr("id"));
            }else
            {
                var input = $(this).parent().find("input")[0];
                console.log("clickCheck");
                $(input)[0].checked =  !$(input)[0].checked;
                activeOptionBox();
                console.log("great3", $(this).attr("id"));
            } 
        }); 

        $('.square, .newsquare').click(function(e) 
        {
                e.preventDefault();
                e.stopPropagation();
                var input = $(this).parent().find("input")[0];
                $(input)[0].checked =  !$(input)[0].checked;
                activeOptionBox();
            
        }); 
    }

    //Changes icon of selected service when called
    function iconDisplay($serviceText)
    {
        var iconCode = "nocost";
        if($serviceText == "instrumento")
        {
            iconCode = "bags";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "bike";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "instrument";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "pet";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "secure";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "car";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "parking";
            return iconCode;
        }else if($serviceText == "instrumento")
        {
            iconCode = "hotel";
            return iconCode;
        }else{
            return iconCode;
        }
    }

//
    function mobileArrowValidation($arrowId, $checkboxId )
    {
        var checked = $("#"+$checkboxId)[0].checked;

        if(_isMobile)
        {
            if(checked)
            {
                $("#"+$arrowId).hide();
            }
            else
            {
                $("#"+$arrowId).show();
            }
        }
    }

//Lightbox from mobile is opened here
    function arrowStructure($id, $modalToOpen,$this)
    {
        $($("#"+$id).find(".add-btn")).on(('change click'), function(e)
        {
            var agregarModificar = $(this).text();
            $($("#"+$id).find(".add-btn")).unbind('change');
            $("#"+$modalToOpen).modal("show");

            $(".btn-secondary").click(function()
            {
                checkForCheckboxes($id, "specialArrow", $(this).attr("id") );
            });
            $(this).text("Modificar");
            $($("#"+$id).find(".add-btn")).bind('change');
        });
    }
//
    function checkForCheckboxes($idParent, $arrowAsigned, $checkboxId)
    {

        $("#"+$idParent).addClass("check-mobile");

    }

//lightboxes are called here
    function addSpecialService()
    {
        arrowStructure("servicios-especiales-wrp","modalServices");
        
    }

    function addExtraWeight($idCheckbox)
    {
         arrowStructure("equipaje-extra-wrp","modalExtraLug");
    }

    function otherWeight($idCheckbox)
    {
         arrowStructure("deportivo-instrumento-wrp","modalSportMusic");
    }

    function pet($idCheckbox)
    {
         arrowStructure("mascota-wrp","modalTravelPet");
    }

//delestesServices
    function deleteService()
    {
        $(document).on('click', '.link-delete', function(e)
        {
            $(this).closest(".servicios-de-pasajero").remove();
        });
    }

    function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
  
    }
}

});
//////// Fin Seccion Extras  /////////
//////// Inicio Seccion Payment  /////////
$(document).ready(function()
{
    var _tabReference = null;
    var _pastModal = null;

    if( document.location.href.match(/[^\/]+$/)[0] == "payment.html")
    {
        var mobile = false;
        var tabWrp = "#menuTabs";
        var desgloseWrp = '#infoTabs';
        var detailsMobile = '#returnAndDetail';
        var IntervaleSection1 = '#intervaleSinValidar';
        init();
    }
    
    //initializes all functions
    function init()
    {
        hideAll();

        $('#intervaleValidado').hide();
        $('#paybackAvailableAmount').hide();
        $('#payback-wrp').hide();
        $('.return-tabs').hide();
        $('#intervale-wrp').hide();
        $(detailsMobile).hide();
        $("#secondCardWrp").hide();

        showSection("desgloseTarjeta");
        if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) && $(window).width() < 991 || $(window).width()<991 )
        {
            $("#buttonsRow").hide();
            mobile = true;
            mobileSetUp();
            $("#desgloseTarjeta").hide();
        }
        selectSucursal();
        checkWebVersion();

        inputClick();
        calendarDisplay();
        onResize();


    }
//whenever browser window changes size, desktop or mobile version is used
    function onResize()
    {
        $(window).resize(function() 
        {
            checkWebVersion();
        });

        $( window ).on( "orientationchange", function( event ) 
        {
            checkWebVersion();
        });
    }
    
    function isiPhone(){
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    }

//if mobile is being used or window is too small, mobile version is used
    function checkWebVersion()
    {
        if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) && $(window).width() < 991 || $(window).width()<991 )
        {
            mobile = true;
            mobileSetUp();
                        
        }else
        {
            mobile = false;
            desktupSetUp();
            $(tabWrp).show();

            $('#paymentTitle').show();
            $('.return-tabs').hide();
            $(detailsMobile).hide();
            $('#purchaseDetails').show();
          
        }

    }

//inputs are deselected and styles of active are removed when called
  function deselectInputs()
  {
    $(".input-material").removeClass("active");
    $(".select-options").slideUp("slow");
    $('.btn-select').removeClass("open");
    $('.detail-purchase').removeClass("open");
    
  }

  var disable_click_flag = false;

//re-parses numbers to "4's" format XXXX XXXX XXXX XXXX, used for credit cards
  function creditcardBreak($string)
  {
    var parts = '';   
    var splitStr = $string.split("");
    for (var i = 0; i < splitStr.length; i ++) {

        if(i<20)
        {
            if( splitStr[i] != " " && $.isNumeric(splitStr[i]))
            {

                if((i-3)%5 == 0)
                {
                    parts +=  (splitStr[i]).toString() + " " ;
                }else
                {
                    parts +=  (splitStr[i]).toString() ;
                }
            }
        }
        
    }   
    

        return parts;
    
    
  }

//credit card inputs are reparsed to 4's
  $('.nu-de-tarjeta').on('change', function (e)
  {
        $(this).val( creditcardBreak($(this).val()) );

        $(this).val( creditcardBreak($(this).val()) );
        $(this).val( $(this).val().substring(0,19) );
   
  });// $(this).val( creditcardBreak($(this).val()) );


//inputs functionability when clicked
    function inputClick()
    { 
        clickSection('#tarjetaTab','desgloseTarjeta',"disable",null);
        clickSection('#sucursalTab','desgloseSucursal',"show",null);
        clickSection('#paypalTab','desglosePaypal',"hide",null);
        clickSection('#visaTab','desgloseVisa',"hide",null);
        clickSection('#masterpassTab','desgloseMasterpass',"hide",null);
        clickSection('#intervaleTab','desgloseIntervale',"show",null);
        clickSection('#paybackTab','desglosePayback',"show","modalDeletePayback");

         modalAlerts('.link-interest' ,'#modalBankCards');
         modalAlerts('#mapShuttle','#modalInterjetTierra');
         modalAlerts('#link-terms-ref','#modalPaymentRef');
         modalAlerts('.link-prices','.modalPrices');
         modalAlerts('.links-rules','#ReglasOptima');
         $(".has-tooltip").tooltip("disable");

        $(".input-material").on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            $(this).find("input")[0].focus();
        });

        $("input[type=text], input[type=number]").on('click focus',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            
            deselectInputs();
         
            $(this).closest(".input-material").addClass("active");

        });
        //green buttons functionality
        $('.btn-primary').on('click',function(e)
        {
            //$('.btn-secondary').click();
        });

        $('.btn-confirm').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            //class incorrect adds red outline and X mark
            //class correct adds green outline and check mark
            $('#nu-tarjeta').addClass("incorrect");
            $('#nu-payback').addClass("correct");
        });

        $('.detail-purchase').on('click', function (e)
        {

            if( $('#purchaseDetails').hasClass("open") )
            {
                $('#purchaseDetails').removeClass("open");
                $('#purchaseDetails').slideUp("slow");
                $('.detail-purchase').removeClass("show");
            }
            else
            {
                $('#purchaseDetails').addClass("open");
                $('#purchaseDetails').slideDown("slow");
                $('.detail-purchase').addClass("show");
            }

        });

        $('.navbar-brand').on('click',function(e)
        {
            window.location.href = "home.html";
        });

        $('.btn-validate').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();

            $('#nu-intervale').addClass("incorrect");
            $('#nu-tarjeta-int').addClass("correct");
            $('#titularTarjeta').addClass("incorrect");
            $(IntervaleSection1).hide();
            $('#intervaleValidado').show();
            $('#intervale-wrp').slideDown("slow");
        });

        $('#valid-paybck').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            $("#paybackValidate").hide();
            $('#paybackAvailableAmount').slideDown("slow");
        });

        $('#confirm-paybck').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            $('#payback-wrp').slideDown("slow");
            $( '.payback-use' ).hide();
            $( '.payback-use-modify' ).show();
        });

        $('.btn-delete').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            $('#nu-intervale').removeClass("correct");
            $('#intervaleValidado').hide();
            $(IntervaleSection1).show();
        });

        $('.btn-check').on('click',function(e)
        {
            $('#nu-payback').addClass("correct");
        });

        //calendar click
        $('.option-active').on('focus',function(e)
        {
          
            deselectInputs();
            
            $(this).parent().addClass("open");
           if($(this).parent().hasClass("select-date"))
            {
                $(this).find('.datepicker').click();
               
            }
        });
        //dropdown click
        $('.select-generic').on('click',function(e)
        {
           
            $(this).find('.select-options').slideDown("down");
            
            e.stopPropagation();
            e.preventDefault();
            //if dropdown is already opened this closes it
            if(  $($(this).find('.btn-select')[0]).hasClass("open")  )
            {
                $(".input-material").removeClass("active");
                $('.btn-select').removeClass("open");
                for (var i = 0; i < $('.select-options').length; i++) {
                    $($(".select-options")[i]).slideUp("slow");
            }
            }else
            {
                $(".input-material").removeClass("active");
            $('.btn-select').removeClass("open");

             $($(this).find('.btn-select')[0]).addClass("open");
            $('.detail-purchase').removeClass("open");
            console.log(  $($(this).find('.btn-select')[0]).hasClass("open")  );
            for (var i = 0; i < $('.select-options').length; i++) {
                //closes all dropdowns but the one clicked
                if( $('.select-options')[i] != $(this).find('.select-options')[0] )
                {
                    $($(".select-options")[i]).slideUp("slow");
                }
            }

            $(this).find(".option-active").focus();
            $(this).find(".option-active").addClass("open");
            }
            
            
        });

        //dropdown option selected
         $('.option-item').on('click', function(e)
        {
           e.stopPropagation();
           e.preventDefault(); 
           var  newOption = $(this).text();
           $(this).closest(".select-generic").find(".option-active").html(newOption) ;
          
           $($(this).closest(".select-generic").find(".btn-select")[0]).removeClass("open");
           $(this).closest(".select-options").slideUp("slow"); 
           
        });
            
        $('.checkbox-wrp').on('click', function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            checkboxClick('#checkpayback',$(this));
        });

        $('#paybackCheck').on('click',function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            checkboxClick('#checkpayback',$(this).find(".checkbox-label")[0]);
        });

        //when clicking outside of inputs this makes them all inactive
        $('body').on('click', function(e)
        {
            e.stopPropagation();
            e.preventDefault();
            deselectInputs();

        });

        /*$( '.link-delete-payback' ).bind( 'click', function(e){
            e.preventDefault();
            $('#modalDeletePayback').modal("show");
        } )*/

        clickSecondCard();
    }

    
    function checkboxClick($targetInput , $clickedThis)
    {
        //when clicking on a checkbox , checkbox is turned on or off               
        $($($clickedThis).parent().find($targetInput)).prop("checked", !$($($clickedThis).parent().find($targetInput)).prop("checked") ) ;

       //Modal shows up
        if(  !$($($clickedThis).parent().find($targetInput)).is(":checked") )
        {
           $('#modalDeletePayback').modal("show");
        }
        
    }

    //if desktop section is used, desktop functions are called
    function desktupSetUp()
    {
        $('.no-mobile').show();
        $('.mobile').hide();
    }
    //if mobile section is used, mobile functions are called
    function mobileSetUp()
    {
      
        $('.no-mobile').hide();
        $('.mobile').show();
    }   

    //when clicking a tab in desktop, that section gets shown and all others are hiden
     function clickSection($Tab , $desglose, $payState, $alertDelete)
     {
        
        $($Tab).click(function()
         {  
            $("#paybackValidate").show();
            $("#buttonsRow").show();
            if(_tabReference !=  $desglose)
            {
                $("#"+ _pastModal).modal("show");
            }
            _pastModal =  $alertDelete;
            _tabReference = $desglose;

            $(this).parent().children().removeClass("tabActive");
            $(this).parent().children().addClass("tabInactive");
            $(this).addClass("tabActive");
            $(this).removeClass("tabInactive");

            showSection($desglose);
            payButtonManager($payState);

            //mobile:
            if( mobile ){
                $(tabWrp).hide();
                $(desgloseWrp).removeClass('hidden-mobile');
                $(detailsMobile).show();
                $('#purchaseDetails').hide();
                $(".mainSectionBottom").hide();
                $( '#paymentTitle' ).hide();
            }

           

        });

        $('#bck-methods').on('click',function(e)
        {
            $('html, body').animate({scrollTop: 0}, 'fast');
            $("#buttonsRow").hide();
            $(tabWrp).show();
            $('#paymentTitle').show();
            $(desgloseWrp).addClass('hidden-mobile');
            $(".tab").removeClass("tabActive");
            $(".tab").addClass("tabInactive");
            $('.return-tabs').hide();
            $(detailsMobile).hide();
            $('.menuScheduleWrp').show();
            $('#purchaseDetails').show();
            $(".mainSectionBottom").show();
        });
     }

     function payButtonManager($payState)
     {
        switch($payState)
        {
            case "show":
                $("#payBtn").show();
                $("#payBtn").prop( "disabled", false);
                $("#payBtn").css( 'pointer-events', 'all' );
            break;
            case "hide":
                $("#payBtn").hide();
            break;
            case "disable":
                $("#payBtn").show();
                $("#payBtn").prop( "disabled", true);
                $("#payBtn").css( 'pointer-events', 'none' );
            break;
        }
     }

     //Hide all sections that are not visible from the start
     function hideAll()
     {
        $('#paybackAvailableAmount').hide();
        $('#payback-wrp').hide();
        $('#nu-payback').removeClass("correct");


        $('.desglosePago').hide();
        $('.desglosePagoEmpty').hide();
        $('#desgloseIntervale').hide();
        $('#desglosePaypal').hide();
        $('#intervaleValidado').hide();
        $('#desgloseSucursal').hide();
        $('#desgloseTarjeta').hide();
        $('.section-wrp').hide();
     }

    //when clicking on a given $linkClicked the modal $modalToOpen is shown
     function modalAlerts($linkClicked, $modalToOpen)
     {
        $($linkClicked).on('click',function(e)
        {
 
             $($modalToOpen).modal("show");
             $(this).tooltip('hide');
        });
       
     }
    // hide all sections but the one selected
     function showSection($sectionName)
     {
        hideAll();
        $("#"+ $sectionName).show();
     }

     $( function() {
        $( ".datepicker" ).datepicker();
      });

     function selectSucursal()
     {
        $('.sucursal').on('click',function(e)
        {
            if($(this).hasClass("selected"))
            {
                $('.sucursal').removeClass("selected");
            }
            else
            {
                $('.sucursal').removeClass("selected");
                $(this).addClass("selected");
            }
            
        });
     }

     //Divide Payment functionality
     function clickSecondCard()
     {  
        //Remove other wrapper functionallity
        $($("#dividePayment").find(".checkbox-wrp")).off('click');
        $("#dividePayment").on('click',function(e)
        {
            var checkbox =  $(this).find('input');
            if( checkbox[0].checked)
            {
                $("#secondCardWrp").slideUp();
            }
            else
            {
                $("#secondCardWrp").slideDown();
            }
            $($(this).find('input')).prop("checked", !$(this).find('input').prop("checked") ) ;
        });
     }

    //shows calendar and sets format for it
     function calendarDisplay()
     {

        $.datepicker.setDefaults({
            onSelect: function () {
                var oldValue = $(this).val();
                var newValue = " "+oldValue.substring(0,2)+" / "+oldValue.substring(8,10);
                $(this).val( newValue );
                //console.log("calendarClosed");
                //console.log($(this));
            }
        });
 
        $( ".datepicker" ).datepicker( "option", "firstDay", 1 );
        $( ".datepicker" ).datepicker( "option", "maxDate", null );
        $( ".datepicker" ).datepicker( "option", "dayNames", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );
        $( ".datepicker" ).datepicker( "option", "dayNamesMin", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );
        $( ".datepicker" ).datepicker( "option", "dayNamesShort", [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ] );
        $( ".datepicker" ).datepicker( "option", "monthNames", [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ] );


        $('.datepicker').datepicker({
            firstDay: 1,
            dayNames: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ],
            dayNamesMin: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ],
            dayNamesShort: [ "DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB" ],
            monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
            maxDate: null,
            changeMonth: true,
            changeYear: true
        });
        $('#ui-datepicker-div').hide();
     }

});

//////// Fin Seccion Payment  /////////
//////// Inicio Seccion Resumen  /////////
$(document).ready(function()
{
	$(".modal-optima").on('click',function(e)
    {
         $("#ReglasOptima").modal("show");
    });

    $("#terms-avis").on('click',function(e)
    {

         $("#modalAvis").modal("show");
    });
});
//////// Fin Seccion Resumen  /////////
$(document).ready(function() {
    //Google Maps JS
    //Set Map

    var _sw = window.innerWidth ? window.innerWidth : $(window).width();

    function resize() {
        _sw = window.innerWidth ? window.innerWidth : $(window).width();
    }

    resize();
    $(window).bind('resize', function() {
        resize();
    });

    function initialize() {

        // Inicia mapa de Google
        //disableDefaultUI: se ocultan los features del mapa (zoom y controles)
        var myLatlng = new google.maps.LatLng(21.1212853, -86.9893194);
        var imagePath = 'http://m.schuepfen.ch/icons/helveticons/black/60/Pin-location.png'
        var mapOptions = {
            zoom: 11,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        }

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);
        //Callout Content
        var contentString = 'Some address here..';
        //Set window width + content
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 500
        });

        //Add Marker
        /*var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            icon: imagePath,
            title: 'image title'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
        });*/

        //Resize Function
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    }

    // se inicia función de carga de mapa
    if ( $('.destination').get(0) ) {

        setTimeout(function() {
            initialize();
        }, 1200);

        console.log('google map');
    }


    //Charts
    var labels = ['Dom<br/>18', 'Lun<br/>18', 'Mar<br/>18', 'Mié<br/>18', 'Jue<br/>18', 'Vie<br/>18', 'Sáb<br/>18', 'Dom<br/>18'];
    var values = [900, 1200, 800, 900, 1000, 900, 800, 900];
    var outputValues = ['$900<br/>USD', '$1,200<br/>USD', '$800<br/>USD', '$900<br/>USD', '$1,000<br/>USD', '$900<br/>USD', '$800<br/>USD', '$900<br/>USD'];
    var labelsMob = ['Dom<br/>18', 'Lun<br/>18', 'Mar<br/>18', 'Mié<br/>18', 'Jue<br/>18', 'Vie<br/>18', 'Sáb<br/>18', 'Dom<br/>18'];
    var valuesMob = [900, 1200, 800, 900, 1000, 900, 800];
    //var width = $(window).width();
    if (_sw < 768) {
        $('.chart-container').simpleChart({

            item: {
                label: labels, // string
                value: values, //integer
                outputValue: outputValues, // Optimized values: instead of 10240 bytes you can output 10kb if you provide the array
                color: ['#1b4298'],
                prefix: '',
                suffix: '',
                decimals: 2,
                height: null,
                render: {
                    size: 'relative',
                    /* Relative - the height of the items is relative to the maximum value */
                    margin: 2,
                    radius: null
                }
            },
            // chart title
            title: {
                text: '',
                align: 'center'
            },

            // progress, bar, waterfall, column, step
            type: 'column',

            // in px or percentage
            layout: {
                width: '700px',
                height: '300px'
            }

        });
    } else {
        $('.chart-container').simpleChart({

            item: {
                label: labels, // string
                value: values, //integer
                outputValue: outputValues, // Optimized values: instead of 10240 bytes you can output 10kb if you provide the array
                color: ['#1b4298'],
                prefix: '',
                suffix: '',
                decimals: 2,
                height: null,
                render: {
                    size: 'relative',
                    /* Relative - the height of the items is relative to the maximum value */
                    margin: 2,
                    radius: null
                }
            },
            // chart title
            title: {
                text: '',
                align: 'center'
            },

            // progress, bar, waterfall, column, step
            type: 'column'

            // in px or percentage
            /*layout: {
             width: '100%',
             height: '300px'
             }*/

        });
    }
    //$('.sc-item').eq(3).addClass('selected');
        /*$('.sc-item').unbind('click')
        .bind('mouseenter', function(e) {
            var tgt = $(this),
                day;
            day = tgt.find('.sc-label').html().split('<br>');
            if (day[2]) {
                day = day[2].toLowerCase();
                $('h3 .week-day').text(day);
            }

            //console.log(tgt.find('.sc-label').text(), day);
        });

    var firstDay = $('.sc-item .sc-label').html().split('<br>');
    firstDay = firstDay[2].toLowerCase();
    $('h3 .week-day').text(firstDay);
*/

    $('.play-favideo').unbind('click')
        .bind('click', function(e) {
            e.preventDefault();
            $('.modalvideodestination').modal('show')
                .find('.video-wrp').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BCAvTEgA6vM" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>');
        });
    $('.modal-content').on('click', function() {
        $('.modalvideodestination').modal('hide');
        $('.video-wrp').html(' ');
    });

    $('.videoWrp').unbind('click')
        .bind('click', function(e) {
            resize();
            if (_sw < 992) {
                e.preventDefault();
                $('.modalvideodestination').modal('show')
                    .find('.video-wrp').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BCAvTEgA6vM" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>');
            }

        });


});
$(document).ready(function() {

    function checkBoxVisibility() {

      console.log( 'checkBoxVisibility' );

        $('.announcement-wrp .ico-slider').each(function() {

            var tgt = $(this);

            tgt
                .unbind('click')
                .bind('click', function(e) {
                    e.preventDefault();
                    console.log( tgt, tgt.closest( '.announcement-container' ).find( '.announcement-info' ) );

                    /*if( tgt.closest( '.announcement-container' ).find( '.announcement-info' ).hasClass('open') ){
                      tgt.closest( '.announcement-container' ).find( '.announcement-info' ).removeClass( 'open' );
                    } else {
                      tgt.closest( '.announcement-container' ).find( '.announcement-info' ).addClass( 'open' )
                    }*/
                    if( tgt.hasClass( 'open' ) ){
                      tgt.removeClass( 'open' );
                    } else {
                      tgt.addClass( 'open' );
                    }
                    tgt.closest( '.announcement-container' ).find( '.announcement-info' ).slideToggle( 'slow', function(){
                      if( $( this ).hasClass('active') ) {
                        $( this ).removeClass('active')
                      } else {
                        $( this ).addClass('active');
                      }
                    } );
                    /*if ( tgt.closest( '.announcement-container' ).find( '.announcement-info' ).is( ':visible' ) ) {
                      tgt.addClass( 'open' );
                      tgt.closest( '.announcement-container' ).addClass( 'open-mobile' );
                      //open-mobile
                    } else {
                      tgt.removeClass( 'open' );
                      tgt.closest( '.announcement-container' ).removeClass( 'open-mobile' );
                    }*/

                });
        });

        /*{
        for(var i = 0; i < $('.ico-slider').length ; i++)
        {   

        if(  $($('.ico-slider')[i]).closest(".announcement-container").find(".announcement-info").is(":visible") )
        {
        $($('.ico-slider')[i]).addClass("open");
        $($('.ico-slider')[i]).closest(".announcement-container").addClass("open-mobile");
        //open-mobile
        }else
        {
        $($('.ico-slider')[i]).removeClass("open");
        $($('.ico-slider')[i]).closest(".announcement-container").removeClass("open-mobile");
        }

        }
        }*/
    }
    checkBoxVisibility();
});