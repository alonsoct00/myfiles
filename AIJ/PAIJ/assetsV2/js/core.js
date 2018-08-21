// ////// Inicio seccion Home /////////////
$(document).ready(function () {

  // IJ ADD
  window.INTERJET = {}
  var INTERJET = window.INTERJET
  // IJ ADD

  // console.log('testing')
  var width = window.innerWidth ? window.innerWidth : $(window).width(),
    _sw

  $('[data-toggle="tooltip"]').tooltip()

  // Actions para menu
  // resizeMenu() // se agrega resize IJ

  function resizeMenu () {
    _sw = window.innerWidth ? window.innerWidth : $(window).width()

    if (_sw < 992) {
      $('.menu-subtitle').next('ul').addClass('hidden')
      $('.cities').addClass('hidden')
      $('.menu-subtitle').addClass('menumobile')
      $('.cities').addClass('hidden').removeClass('open')

      $('ul.navbar-nav').find('.nav-link').bind('touchstart touchend').on('click', function (e) {
        e.preventDefault()
        $('.nav-item').removeClass('active')
        if ($(this).parents('.nav-item').find('> .menu-option').hasClass('open-option')) {
          $(this).parents('.nav-item').removeClass('active').find('> .menu-option').removeClass('open-option').stop().slideUp('fast')
        } else {
          $('.menu-option').removeClass('open-option').stop().slideUp('fast')
          $(this).parents('.nav-item').addClass('active').find('> .menu-option').addClass('open-option').stop().slideDown()
        }
      })
    } else {
      $('.menu-subtitle').next('ul').removeClass('hidden')
      $('.cities').addClass('hidden')
      $('.menu-subtitle').removeClass('menumobile')
      $('.cities').eq(0).removeClass('hidden').addClass('open')

      $('ul.navbar-nav').find('li.nav-item').on('mouseenter', function () {
        $('.admin-vuelo').removeClass('active')
        $(this).addClass('active')
        if ($('.country-list').hasClass('open')) {
          $('.language').children('.country-list').slideUp('fast').removeClass('open').addClass('close')
          $('.language').children('.arrow').removeClass('up').addClass('down')
          // resizeMenu()

        }
        if ($(this).hasClass('open-option')) {
          $(this).find('> .menu-option').removeClass('open-option').stop().slideUp('fast')
        } else {
          $(this).find('> .menu-option').addClass('open-option').stop().slideDown()
        }

        // se oculta user
        $('.userWrp .arrow').removeClass('up')
        $('.user-menu').stop().slideUp('fast')
      }).on('mouseleave', function () {
        $(this).removeClass('active')
        $(this).find('> .menu-option').removeClass('open-option').stop().slideUp('fast')
      }).on('click', function (e) {
        // e.preventDefault() IJ MAX CHANGE menu links
      })
    }

    $('.menu-option').hide()
  }

  // end resize

  $('.language-mobile').on('click', function (e) {
    // e.preventDefault(); IJ MAX
    $('.nav-link').parent().removeClass('active')
    $('.menu-option').stop().slideUp()
    $(this).children('.country-list').toggleClass('open close')
    $(this).children('.arrow').toggleClass('up down')
  })

  $('.menu-subtitle').on('click', function (e) {
    // e.preventDefault() IJ MAX CHANGE menu links
    if (_sw < 992) {
      if ($(this).next('ul').hasClass('hidden')) {
        $('.menu-subtitle').removeClass('show')
        $('.menu-subtitle').next('ul').addClass('hidden')
        $(this).next('ul').removeClass('hidden')
        $(this).addClass('show')
      } else {
        $(this).next('ul').addClass('hidden')
        $(this).removeClass('show')
      }
    }
  })

  if (_sw < 992) {

    // Arrow log user click

    $('.preferencesWrp .log').on('click', function (e) {
      // e.preventDefault()
      $('.userWrp .arrow').toggleClass('up')
      $('.user-menu').slideToggle('fast')
    })
  } else {
    $('.language')
      .on('mouseenter', function (e) {
        $('.nav-link').parent().removeClass('active')
        $('.menu-option').stop().slideUp('fast')
        $('.preferencesWrp .country-list.open').css({ 'min-height': 28 * $('.preferencesWrp .country-list li').length })
        // console.log( 28 * $('.country-list.open li').length, $('.country-list.open li').length )
        $(this).children('.country-list').slideDown('fast').removeClass('close').addClass('open')
        $(this).children('.arrow').removeClass('down').addClass('up')
        $('.preferencesWrp .country-list.open').css({ 'min-height': 28 * $('.preferencesWrp .country-list li').length })

        // se oculta user
        $('.userWrp .arrow').removeClass('up').addClass('down')
        $('.user-menu').slideUp('fast')
      })

    $('.country-list')
      .on('mouseleave', function (e) {
        // e.preventDefault()
        if ($('.country-list').hasClass('open')) {
          $('.preferencesWrp .country-list.open').css({ 'height': 'auto', 'min-height': '120px' })
          $('.language').children('.country-list').slideUp('100').removeClass('open').addClass('close')
          $('.language').children('.arrow').removeClass('up').addClass('down')
        }
      })

    $('.preferencesWrp .log')
      .on('mouseenter', function (e) {
        // e.preventDefault()
        $('.userWrp .arrow').addClass('up')
        $('.user-menu').stop().slideDown()
        if ($('.country-list').hasClass('open')) {
          $('.language').children('.country-list').slideUp('fast').removeClass('open').addClass('close')
          $('.language').children('.arrow').removeClass('up').addClass('down')
        }
      })
    $('.user-menu').on('mouseleave', function (e) {
      // e.preventDefault()
      $('.userWrp .arrow').removeClass('up')
      $('.user-menu').slideUp('fast')
    })
  }

  // change languaje
  $('.country-list a').on('click', function (e) {
    // e.preventDefault() IJ
    var country = $(this).attr('class')
    $('.active-country, .act-country-mobile').removeClass('eu').removeClass('mx').removeClass('gt').removeClass('co').removeClass('cr').removeClass('pe').removeClass('ca').removeClass('ca-fr').addClass(country)
      .text($(this).text())
    $('.language').children('.country-list').stop().slideUp().removeClass('open').addClass('close')
    $('.language').children('.arrow').removeClass('up').addClass('down')
    $('.country-list a').removeClass('selected')
    $(this).addClass('selected')
    $(this).parent().parent().prepend($(this).parent())
  // $( '.country-list-name a.'+ country ).parent().before('.country-list-name a:first')
  })

  $('.profile-mobile').on('click', function (e) {
    // e.preventDefault()
    $('.userWrp .arrow').toggleClass('up')
    $('.user-menu').stop().slideToggle()

    $('button.navbar-toggler').addClass('collapsed')
    $('.navbar-collapse').stop().slideUp()

    if ($('.userWrp .arrow').hasClass('up')) {
      $('.overlay-interjet').fadeIn().addClass('show-mobile')
    } else {
      $('.overlay-interjet').fadeOut().removeClass('show-mobile')
    }
  })

  $('.destinations-menu').each(function () {
    var tgt = $(this)

    tgt
      .unbind('click')
      .bind('click', function (e) {
        // e.preventDefault()
        if (_sw < 992) {

          // tgt.toggleClass('selected')
          // tgt.next('.cities').removeClass('open').addClass('hidden')

          if ($(this).hasClass('mobile-open')) {
            // console.log('removeClass')
            tgt.removeClass('selected').removeClass('mobile-open')
            $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden')
          } else {
            // console.log('addClass')
            tgt.addClass('selected mobile-open')
            $('.destinations-menu.selected').next('.cities').removeClass('hidden').addClass('open')
          }

        // console.log($('.destinations-menu').next('.cities'))
        } else {
          if (!tgt.hasClass('selected')) {
            // console.log('hasClass selected')
            $('.destinations-menu').toggleClass('selected')
            $('.cities').toggleClass('hidden open')
          }
        }
      })
  }); /*.unbind( 'click' )
    .bind( 'click' , function(e) {
        e.preventDefault()

        if (_sw < 992) {

            console.log( $( this ).hasClass( 'selected' ) )

            // if ( !$( this ).hasClass( 'selected' )  ){
            $('.destinations-menu').toggleClass('selected')
            $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden')
            //$('.destinations-menu').removeClass('mobile-open')
            //}

            if ($(this).hasClass('selected')) {
                console.log( 'removeClass' )
                $('.destinations-menu').next('.cities').removeClass('open').addClass('hidden')
                $('.destinations-menu').removeClass('selected').removeClass('mobile-open')
            } else {
                console.log( 'addClass' )
                $(this).addClass('selected mobile-open')
                $(this).next('.cities').removeClass('hidden').addClass('open')
            }

        } else {

            if (!$(this).hasClass('selected')) {
                console.log('hasClass selected')
                $('.destinations-menu').toggleClass('selected')
                $('.cities').toggleClass('hidden open')
            }

        }
    });*/

  // Terminan Actions para menu

  // slick slider booking (la llama)
  // HomeCms

  $('.booking-carousel').slick({
    autoplay: true,
    autoplaySpeed: 4000,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
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
  })
  // Fin HomeCms

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
  })

  // close alert on top
  $('.closeBtn').on('click', function (e) {
    e.preventDefault()
    $('.alertTop').slideUp('400', function () {
      $('.booking-wrp').addClass('no-alert')
    })
    $('.navbar').animate({ top: '0px' })
  })

  INTERJET.SearchAvailability = {}
  INTERJET.SearchAvailability.DepartureDate = null
  INTERJET.SearchAvailability.SetDepartureDate = false
  INTERJET.SearchAvailability.ReturnDate = null
  INTERJET.SearchAvailability.FlightType = 'one-way'
  INTERJET.SearchAvailability.SetReturnDate = false
  INTERJET.SearchAvailability.SelectedDates = []

  if (Interjet.Stations.GeoStationCode != undefined) {
    INTERJET.SearchAvailability.DefaultStationCode = Interjet.Stations.GeoStationCode
    $('input[id*="TextBoxMarketOrigin1"]').val(INTERJET.SearchAvailability.DefaultStationCode)
  }

  if (Interjet.AddOnCultureText != undefined) {
    INTERJET.SearchAvailability.AltTextDepartureDate = Interjet.AddOnCultureText.AltTextDepartureDate
    INTERJET.SearchAvailability.AltTextReturnDate = Interjet.AddOnCultureText.AltTextReturnDate
  }else {
    INTERJET.SearchAvailability.AltTextDepartureDate = 'Departure date'
    INTERJET.SearchAvailability.AltTextReturnDate = 'Return date'
  }

  INTERJET.SearchAvailability.IsMobile = function () {
    var IsMobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() < 760) {
      IsMobile = true
    }else {
      IsMobile = false
    }

    return IsMobile
  }

  INTERJET.SearchAvailability.OpenDatePicker = function () {
    // init datepicker    
    var Regional = 'en'
    if (Interjet.CultureCode != undefined) {
      if (Interjet.CultureCode.indexOf('ES-') !== -1) Regional = 'es'
      if (Interjet.CultureCode.indexOf('EN-') !== -1) Regional = 'en'
      if (Interjet.CultureCode.indexOf('FR-') !== -1) Regional = 'fr'
    }

    $.datepicker.setDefaults($.datepicker.regional[Regional])

    $('.bookingInterjet .datepicker').datepicker({
      dateFormat: 'dd-mm-yy',
      defaultDate: null,
      numberOfMonths: 1,
      dayNamesMin: $.datepicker._defaults.dayNamesShort,
      minDate: new Date(),

      onSelect: function (date) {
        var FlightType = $('.calendar-options .btn-radio.active').attr('id')
        var DepartureDateArray
        var ReturnDateArray
        INTERJET.SearchAvailability.FlightType = FlightType

        // console.log(INTERJET.SearchAvailability.FlightType)

        if (INTERJET.SearchAvailability.FlightType == 'round-trip') {
          if (INTERJET.SearchAvailability.SetDepartureDate == false) {
            $('#labelDepartureDate').hide()
            $('#labelReturnDate').show()
            INTERJET.SearchAvailability.DepartureDate = date
            INTERJET.SearchAvailability.ReturnDate = null
            INTERJET.SearchAvailability.SelectedDates.push(date)
            INTERJET.SearchAvailability.SetDepartureDate = true

            DepartureDateArray = INTERJET.SearchAvailability.DepartureDate.split('-')

            $('select[id*="DropDownListMarketDay1"]').val(DepartureDateArray[0])
            $('select[id*="DropDownListMarketMonth1"]').val(DepartureDateArray[2] + '-' + DepartureDateArray[1])
            $('.calendar-content .btn-next').attr('disabled', true)
          }else {
            $('#labelDepartureDate').show()
            $('#labelReturnDate').hide()
            INTERJET.SearchAvailability.ReturnDate = date
            INTERJET.SearchAvailability.SelectedDates.push(date)
            INTERJET.SearchAvailability.SetDepartureDate = false

            DepartureDateArray = INTERJET.SearchAvailability.DepartureDate.split('-')
            ReturnDateArray = INTERJET.SearchAvailability.ReturnDate.split('-')
            var DepartureDate = new Date(DepartureDateArray[2], DepartureDateArray[1], DepartureDateArray[0])
            var ReturnDate = new Date(ReturnDateArray[2], ReturnDateArray[1], ReturnDateArray[0])

            if (DepartureDate <= ReturnDate) {
              $('select[id*="DropDownListMarketDay2"]').val(ReturnDateArray[0])
              $('select[id*="DropDownListMarketMonth2"]').val(ReturnDateArray[2] + '-' + ReturnDateArray[1])
              $('.calendar-content .btn-next').attr('disabled', false)
            }else {
              $('#labelDepartureDate').hide()
              $('#labelReturnDate').show()
              INTERJET.SearchAvailability.DepartureDate = INTERJET.SearchAvailability.ReturnDate
              INTERJET.SearchAvailability.ReturnDate = null
              $('select[id*="DropDownListMarketDay1"]').val(ReturnDateArray[0])
              $('select[id*="DropDownListMarketMonth1"]').val(ReturnDateArray[2] + '-' + ReturnDateArray[1])
              INTERJET.SearchAvailability.SetDepartureDate = true
              $('.calendar-content .btn-next').attr('disabled', true)
            }
          }

          /*  if (INTERJET.SearchAvailability.SelectedDates.length == 1) {
                $('.calendar-content .btn-next').attr('disabled', true)
            }

            if (INTERJET.SearchAvailability.SelectedDates.length == 2) {
                $('.calendar-content .btn-next').attr('disabled', false)
            }*/

          if (INTERJET.SearchAvailability.SelectedDates.length >= 3) {
            INTERJET.SearchAvailability.SelectedDates.splice(0, 1)
            INTERJET.SearchAvailability.SelectedDates.splice(1, 1)
            INTERJET.SearchAvailability.SelectedDates.push(date)
          }
        }else {
          INTERJET.SearchAvailability.DepartureDate = date
          INTERJET.SearchAvailability.ReturnDate = null
          DepartureDateArray = INTERJET.SearchAvailability.DepartureDate.split('-')
          $('select[id*="DropDownListMarketDay1"]').val(DepartureDateArray[0])
          $('select[id*="DropDownListMarketMonth1"]').val(DepartureDateArray[2] + '-' + DepartureDateArray[1])

          if (INTERJET.SearchAvailability.DepartureDate != null) {
            $('.calendar-content .btn-next').attr('disabled', false)
          }
        }
      },

      beforeShowDay: function (d) {
        var dmy = (d.getDate())
        if (d.getDate() < 10)
          dmy = '0' + dmy

        dmy += '-'

        if (d.getMonth() < 9) dmy += '0'
        dmy += d.getMonth() + 1 + '-' + d.getFullYear()

        if ($.inArray(dmy, INTERJET.SearchAvailability.SelectedDates) != -1) {
          if (INTERJET.SearchAvailability.DepartureDate == dmy) {
            return [true, 'departure-date ui-datepicker-current-day ui-datepicker-today departure', INTERJET.SearchAvailability.AltTextDepartureDate]
          }else {
            if (INTERJET.SearchAvailability.ReturnDate !== null) {
              return [true, 'return-date ui-datepicker-current-day ui-datepicker-today return', INTERJET.SearchAvailability.AltTextReturnDate]
            }else {
              return [true, 'ui-datepicker-today', '']
            }
          }
        } else {
          if (INTERJET.SearchAvailability.DepartureDate !== null && INTERJET.SearchAvailability.ReturnDate !== null) {
            var dateParts = dmy.split('-')
            var arrayDepDate = INTERJET.SearchAvailability.DepartureDate.split('-')
            var arrayRetDate = INTERJET.SearchAvailability.ReturnDate.split('-')

            var CurrentDate = new Date(dateParts[2], dateParts[1], dateParts[0])
            var DepartureDate = new Date(arrayDepDate[2], arrayDepDate[1], arrayDepDate[0])
            var ReturnDate = new Date(arrayRetDate[2], arrayRetDate[1], arrayRetDate[0])

            if ($.inArray(dmy, INTERJET.SearchAvailability.SelectedDates) == -1 && ((CurrentDate > DepartureDate && CurrentDate < ReturnDate) || (CurrentDate > ReturnDate && CurrentDate < DepartureDate))) {
              return [true, 'ui-date-range', 'date range']
            }else {
              return [true, '', '']
            }
          }else {
            return [true, 'ui-datepicker-today departure', '']
          }
        }
      }
    })
  }

  if ($('#flightSearchContainer').length > 0) {
    INTERJET.SearchAvailability.OpenDatePicker()
    $('.bookingInterjet .datepicker').datepicker('setDate', null)
  }


    var defaultDiacriticsRemovalap = [
        {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
        {'base':'AA','letters':'\uA732'},
        {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
        {'base':'AO','letters':'\uA734'},
        {'base':'AU','letters':'\uA736'},
        {'base':'AV','letters':'\uA738\uA73A'},
        {'base':'AY','letters':'\uA73C'},
        {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
        {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
        {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
        {'base':'DZ','letters':'\u01F1\u01C4'},
        {'base':'Dz','letters':'\u01F2\u01C5'},
        {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
        {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
        {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
        {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
        {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
        {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
        {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
        {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
        {'base':'LJ','letters':'\u01C7'},
        {'base':'Lj','letters':'\u01C8'},
        {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
        {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
        {'base':'NJ','letters':'\u01CA'},
        {'base':'Nj','letters':'\u01CB'},
        {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
        {'base':'OI','letters':'\u01A2'},
        {'base':'OO','letters':'\uA74E'},
        {'base':'OU','letters':'\u0222'},
        {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
        {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
        {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
        {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
        {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
        {'base':'TZ','letters':'\uA728'},
        {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
        {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
        {'base':'VY','letters':'\uA760'},
        {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
        {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
        {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
        {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
        {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
        {'base':'aa','letters':'\uA733'},
        {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
        {'base':'ao','letters':'\uA735'},
        {'base':'au','letters':'\uA737'},
        {'base':'av','letters':'\uA739\uA73B'},
        {'base':'ay','letters':'\uA73D'},
        {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
        {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
        {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
        {'base':'dz','letters':'\u01F3\u01C6'},
        {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
        {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
        {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
        {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
        {'base':'hv','letters':'\u0195'},
        {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
        {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
        {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
        {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
        {'base':'lj','letters':'\u01C9'},
        {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
        {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
        {'base':'nj','letters':'\u01CC'},
        {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
        {'base':'oi','letters':'\u01A3'},
        {'base':'ou','letters':'\u0223'},
        {'base':'oo','letters':'\uA74F'},
        {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
        {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
        {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
        {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
        {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
        {'base':'tz','letters':'\uA729'},
        {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
        {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
        {'base':'vy','letters':'\uA761'},
        {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
        {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
        {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
        {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
    ];
    
    var diacriticsMap = {};
    
    for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
        var letters = defaultDiacriticsRemovalap[i].letters.split("");
        for (var j=0; j < letters.length ; j++){
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
        }
    }


  INTERJET.SearchAvailability.accentFold = function (inStr) {

     return inStr.replace(/[^A-Za-z0-9\s]/g, function(a){ 
       return diacriticsMap[a] || a; 
    });
  }

  INTERJET.SearchAvailability.UpdateTotalPassengers = function () {
    var totalpass = 0
    $('.passenger-item').each(function () {
      totalpass += $(this).find('.passenger-num').text() * 1
    })
    if (totalpass >= 0) {
      $('.label-passengers').removeClass('txt-gray').addClass('description txt-blue')
      if (totalpass <= 1) {
        $('.booking-options-item .select-passengers').find('span').html(totalpass)
      }else {
        $('.booking-options-item .select-passengers').find('span').html(totalpass)
      }
    }else {
      $('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
      $('.booking-options-item .select-passengers').html(' ')
    }
  }

  /*home CMS*/
  INTERJET.SearchAvailability.UpdateTotalPassengers()

  // Search Origin
  $('.search-origin').on('keyup', function (e) {
    e.preventDefault()
    var filter = $(this).val()
    $('.places-origin').find('li').each(function () {
      if ((INTERJET.SearchAvailability.accentFold($(this).text()).search(new RegExp(filter, 'i')) < 0)  && $(this).text().search(new RegExp(filter, 'i')) < 0 ){
        $(this).hide()
      } else {
        $(this).show()
      }
    })
  })

  // Select destination
  $('.search-destination').on('keyup', function (e) {
    e.preventDefault()
    var filter = $(this).val()
    $('.places-destination').find('li').each(function () {
      if ((INTERJET.SearchAvailability.accentFold($(this).text()).search(new RegExp(filter, 'i')) < 0) && $(this).text().search(new RegExp(filter, 'i')) < 0 ) {
        $(this).hide()
      } else {
        $(this).show()
      }
    })
  })

  // Select origin or destination
  /*$('.booking-options-menu li').on('click', function (e) {
    e.preventDefault()
    var optionID = $(this).parents('.booking-options-item').attr('data-option')
    switch (optionID) {
      case 'origin':
        var origin = $(this).text()
        var codeid = $(this).attr('data-codeid')
        $(this).parents('.booking-options-item').find('.label-origin').removeClass('txt-gray').addClass('description txt-blue')
        $(this).parents('.booking-options-item').find('.select-origin').html(origin + ' <span class="txt-blue">(' + codeid + ')</span>')
        $('.search-origin').val('')
        $('.places-origin').find('li').show()
        $('.booking-options-menu').stop().slideUp()
        $('.booking-bg').fadeOut()
        $('.booking-options-item').find('button.btn-select').removeClass('active')
        break
      case 'destination':
        var destination = $(this).text()
        var codeid = $(this).attr('data-codeid')
        $(this).parents('.booking-options-item').find('.label-destination').removeClass('txt-gray').addClass('description txt-blue')
        $(this).parents('.booking-options-item').find('.select-destination').html(destination + ' <span class="txt-blue">(' + codeid + ')</span>')
        $('.search-destination').val('')
        $('.places-destination').find('li').show()
        $('.booking-options-menu').stop().slideUp()
        $('.booking-bg').fadeOut()
        $('.booking-options-item').find('button.btn-select').removeClass('active')
        break
    }
  })*/

  // add passanger button IJ Modify
  $('.btn-add').on('click', function (e) {
    e.preventDefault()
    var PaxType = $(this).parents('.passenger-item').attr('id')
    var TotalPaxADT = $('.passenger-adult .passenger-num').text()
    var c = $(this).parents('.passenger-item').find('.passenger-num').text() * 1
    // console.log(c)
    if (c == 8) {
      $(this).parents('.passenger-item').find('.passenger-num').text('9')
      $(this).addClass('disable')
    }else {
      /*console.log(PaxType + ": " + TotalPaxADT + ":"+c)
      if(PaxType=='INFPax'){
        if(c+1 >TotalPaxADT){
            alert("error...")
        }
      }*/
      if (c < 8) {
        $(this).removeClass('disable')
        $(this).parents('.passenger-item').find('.btn-less').removeClass('disable')
        $(this).parents('.passenger-item').find('.passenger-num').text((c + 1))
      }else {
        $(this).addClass('disable')
      }
    }

    var RealValue = Number($(this).parents('.passenger-item').find('.passenger-num').text())
    switch (PaxType) {
      case 'ADTPax':

        $('select[id*="DropDownListPassengerType_ADT"]').val(RealValue)
        break
      case 'CHDPax':
        $('select[id*="DropDownListPassengerType_CHD"]').val(RealValue)
        break
      case 'INFPax':
        $('select[id*="DropDownListPassengerType_INFANT"]').val(RealValue)
        break
      default:
        break
    }
    INTERJET.SearchAvailability.EnableSearchButton(e)
    INTERJET.SearchAvailability.UpdateTotalPassengers()
  })

  // less passanger button IJ Modify
  $('.btn-less').on('click', function (e) {
    e.preventDefault()
    var PaxType = $(this).parents('.passenger-item').attr('id')
    var c = $(this).parents('.passenger-item').find('.passenger-num').text() * 1
    if (c == 1 || c == 0) {
      $(this).parents('.passenger-item').find('.passenger-num').text('0')
      $(this).addClass('disable')
    }else {
      $(this).removeClass('disable')
      $(this).parents('.passenger-item').find('.btn-add').removeClass('disable')
      $(this).parents('.passenger-item').find('.passenger-num').text((c - 1))
    }

    var RealValue = Number($(this).parents('.passenger-item').find('.passenger-num').text())
    switch (PaxType) {
      case 'ADTPax':
        $('select[id*="DropDownListPassengerType_ADT"]').val(RealValue)
        break
      case 'CHDPax':
        $('select[id*="DropDownListPassengerType_CHD"]').val(RealValue)
        break
      case 'INFPax':
        $('select[id*="DropDownListPassengerType_INFANT"]').val(RealValue)
        break
      default:
        break
    }
    INTERJET.SearchAvailability.EnableSearchButton(e)
    INTERJET.SearchAvailability.UpdateTotalPassengers()
  })

  // Update passengers
  $('.btn-update-passengers').on('click', function (e) {
    e.preventDefault()
    var totalpass = 0
    $('.passenger-item').each(function () {
      totalpass += $(this).find('.passenger-num').text() * 1
    })
    if (totalpass > 0) {
      $('.label-passengers').removeClass('txt-gray').addClass('description txt-blue')
      if (totalpass <= 1) {
        $('.select-passengers').html(totalpass + ' pasajero')
      } else {
        $('.select-passengers').html(totalpass + ' pasajeros')
      }
    } else {
      $('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
      $('.select-passengers').html(' ')
    }
    $('.booking-options-menu').stop().slideUp()
    $('.booking-options-item').find('button.btn-select').removeClass('active')
    $('.booking-bg').fadeOut()
  })

  // Radio buttons IJ Modified
  $('.booking-content-tab .btn-radio, .calendar-options .btn-radio').on('click', function (e) {
    e.preventDefault()
    var ElementId = $(this).attr('id')

    $('.booking-content-tab .btn-radio, .calendar-options .btn-radio').toggleClass('active')
    if (ElementId == 'one-way' || ElementId == 'btn-one-way') {
      $('input[id*="OneWay"]').prop('checked', true)
      $('input[id*="OneWay"]').attr('checked', true)
      if (INTERJET.SearchAvailability.DepartureDate != null) {
        $('.calendar-content .btn-next').attr('disabled', false)
      }
    }
    if (ElementId == 'round-trip' || ElementId == 'btn-round-trip') {
      $('input[id*="RoundTrip"]').prop('checked', true)
      $('input[id*="RoundTrip"]').attr('checked', true)

      if (INTERJET.SearchAvailability.DepartureDate != null && INTERJET.SearchAvailability.ReturnDate != null) {
        $('.calendar-content .btn-next').attr('disabled', false)
      }else {
        $('.calendar-content .btn-next').attr('disabled', true)
      }
    }
  })

  /*.on('click', function(e){
          e.preventDefault()
          $('.booking-content-tab .btn-radio, .calendar-options .btn-radio').toggleClass('active')
      });*/

  // // //end Action booking // // //

  // video modal
  // HomeCms
  $('.showvideo').on('click', function (e) {
    // e.preventDefault()
    var urlvideohomemosaico = $('#urlvideohome').attr('url')
    $('.modal-body .video-wrp').html('<iframe width="560" height="315" src="' + urlvideohomemosaico + '" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>')
    $('.modalvideo').modal('show')
  })
  $('.showvideo').on('hidde.bs.modal', function (e) {
    // e.preventDefault()
    $('.video-wrp').html(' ')
  })
  $('.modal-content').on('click', function () {
    $('.modalvideo').modal('hide')
    $('.video-wrp').html(' ')
  })
  // Fin HomeCms

  // Modal Login (Max Changes - remove prevent)
  $('.miperfil, .iniciasesion, .registrate').on('click', function (e) {
    // e.preventDefault()
    $('.modallogin').modal('show')
  })

  // ButtonRegisterRedirect
  $('.registerModalButton').on('click', function (e) {
    window.location.href = 'register.aspx'
  })

  // Modal Newsletter
  $('.btn-newsletter').on('click', function (e) {
    e.preventDefault()
    $('.modalnewsletter').modal('show')
  })

  // Modal Chat (Max Changes - remove prevent)
  $('.chat').on('click', function (e) {
    // e.preventDefault()
    // $('.modalchat').modal('show')
    open('http://interjetchat.atento.com.mx:1001/wfClient.aspx', '', 'top=100,left=100,width=410,height=700')
  })

  // Modal TEst
  $('.test-modal').on('click', function (e) {
    e.preventDefault()
    $('.modalalert').modal('show')
  })

  // Administra tu vuelo Desktop
  if (_sw < 992) {
    $('.admin-vuelo').on('click', function (e) {
      e.preventDefault()
      $('.admin-vuelo').toggleClass('active')
      $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
    })
  } else {
    $('.admin-vuelo')
      .on('mouseenter', function () {
        $('.admin-vuelo').addClass('active')
        $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
      })
      .on('mouseleave', function () {
        // $('.admin-vuelo').toggleClass('active')
        $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
      })
      .on('click', function (e) {
        e.preventDefault()
			if ($(this).hasClass('Adm')) {
				if ($(this).hasClass('active')) {
				  $(this).removeClass('active')
				} else {
				  $(this).addClass('active')
				}		
			  	$('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
            } else {
				$(this).addClass('Adm')	
				$('.admin-vuelo').addClass('active')
            }
      })
    $('.sub-gst, .sub-gst-mb')
      .on('mouseenter', function () {
        // $('.admin-vuelo').removeClass('active')
        $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
      })
      .on('mouseleave', function () {
        $('.admin-vuelo').removeClass('active')
        $('.sub-gst, .sub-gst-mb').stop().slideToggle('hidden')
      })
  }

  // Show calendar IJ Modify
  $('.btn-step-calendar').on('click', function (e) {
    e.preventDefault()

    $('.calendar-content .ui-datepicker-current-day').removeClass('ui-datepicker-current-day')
    $('.calendar-content .ui-date-range').removeClass('ui-date-range')

    INTERJET.SearchAvailability.DepartureDate = null
    INTERJET.SearchAvailability.ReturnDate = null

    $('.booking-calendar').slideDown('fast')
    $('.overlay-interjet').fadeIn()
  })

  $('.bookingInterjet .btn-next').on('click', function (e) {
    e.preventDefault()
    $('.booking-calendar').slideUp('fast')
    $('.overlay-interjet').fadeOut()
    $('#PassengersContainer').hide()
    $('#loader').modal({backdrop: 'static', keyboard: false})
    $('.bookingInterjet input[id*="ButtonSubmit"]').click()
  })
  // Show calendar IJ Modify

  // Select tab booking
  $('.tab-flights, .tab-hotelflights').on('click', function (e) {
    e.preventDefault()
    $('.tab-flights, .tab-hotelflights').toggleClass('disable')
    $('.booking-content-tab').toggleClass('hidden')
  })

  // Scroll to top
  $('.btn-up').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 1000)
    return false
  })

  // Hide overlay booking
  $('.booking-bg').on('click', function (e) {
    e.preventDefault()
    $('.booking-calendar').slideUp('fast')
    $('.booking-options-menu').stop().slideUp('fast')
    $('.booking-options-item').find('button.btn-select').removeClass('active')
    $('.booking-bg').fadeOut()
    $('.userWrp .arrow').removeClass('up')
    $('.user-menu').stop().slideUp()
    $('button.navbar-toggler').addClass('collapsed')
    $('.navbar-collapse').stop().slideUp()
  })

  // Hide overlay interjet
  $('.overlay-interjet').on('click', function (e) {
    e.preventDefault()
    $('.overlay-interjet').fadeOut()
    $('button.navbar-toggler').addClass('collapsed')
    $('.navbar-collapse').stop().slideUp()
    $('.userWrp .arrow').removeClass('up')
    $('.user-menu').stop().slideUp()
    $('.booking-calendar').slideUp('fast')

  /*if( $('body').hasClass('hide-overflow') ){
      $('body').removeClass('hide-overflow')
  }
  else{
      $('body').addClass('hide-overflow')
  }*/
  })

  // Open Menu
  $('button.navbar-toggler').on('click', function (e) {
    e.preventDefault()

    if ($(this).hasClass('collapsed')) {
      $('.overlay-interjet').fadeIn().addClass('show-mobile')
    } else {
      $('.overlay-interjet').fadeOut().removeClass('show-mobile')
    }

    if ($('body').hasClass('hide-overflow')) {
      // $('body').removeClass('hide-overflow')
    } else {
      // $('body').addClass('hide-overflow')
    }

    $(this).toggleClass('collapsed')
    $('.navbar-collapse').slideToggle()

    $('.userWrp .arrow').removeClass('up')
    $('.user-menu').stop().slideUp()
  })

  // Homecms

  function elemMaxHeight ($elem) {
    var maxHeight = 0
    $elem.css('height', 'auto')
    $elem.each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height()
      }
    })
    $elem.css('height', parseInt(maxHeight + 10))
  }
  function elemMaxHeightfromto ($elem) {
    var maxHeight = 0
    $elem.css('height', 'auto')
    $elem.each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height()
      }
    })
    $elem.css('height', parseInt(maxHeight))
  }
  // Homecms

  resizeMenu()

  $(window).bind('resize', function () {
    resizeMenu()

    if ($('.destination-wrp').get(0)) {
      elemMaxHeightfromto($('.destination-wrp')) // IJ CHANGE
    }
    if ($('.product-wrp').get(0)) {
      elemMaxHeight($('.product-wrp'))
    }
    if ($('.blog-articles .blog-title').get(0)) {
      elemMaxHeight($('.blog-articles .blog-title'))
    }
    if ($('.blog-articles p:nth-child(3)').get(0)) {
      elemMaxHeight($('.blog-articles p:nth-child(3)'))
    }
  })

  setTimeout(function () {
    if ($('.destination-wrp').get(0)) {
      elemMaxHeightfromto($('.destination-wrp')) // IJ CHANGE
    }
    if ($('.product-wrp').get(0)) {
      elemMaxHeight($('.product-wrp'))
    }
    if ($('.blog-articles .blog-title').get(0)) {
      elemMaxHeight($('.blog-articles .blog-title'))
    }
    if ($('.blog-articles p:nth-child(3)').get(0)) {
      elemMaxHeight($('.blog-articles p:nth-child(3)'))
    }
  }, 800)
  var hs = new KC(function () {
    // alert('knm kd')
    var width = $(window).width()
    $('body').append('<div class="plane-ee"></div>')

    $('.plane-ee').show().animate({
      right: '0'
    }, 2500, function () {
      $('.plane-ee').slideUp('fast', function () {
        $('.plane-ee').remove()
      })
    })
  })

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

    $('body').addClass('ie10')
  }

  if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
    $('body').addClass('ie10')
  }
})

var KC = function (t) {var e = {addEvent: function (t, e, n, o) {
      t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent && (t['e' + e + n] = n, t[e + n] = function () {t['e' + e + n](window.event, o)}, t.attachEvent('on' + e, t[e + n]))},removeEvent: function (t, e, n) {
      t.removeEventListener ? t.removeEventListener(e, n) : t.attachEvent && t.detachEvent(e)},input: '',pattern: '38384040373937396665',keydownHandler: function (t, n) {if (n && (e = n), e.input += t ? t.keyCode : event.keyCode, e.input.length > e.pattern.length && (e.input = e.input.substr(e.input.length - e.pattern.length)), e.input === e.pattern)return e.code(this._currentLink), e.input = '', t.preventDefault(), !1},load: function (t) {this.addEvent(document, 'keydown', this.keydownHandler, this), this.iphone.load(t)},unload: function () {this.removeEvent(document, 'keydown', this.keydownHandler), this.iphone.unload()},code: function (t) {window.location = t},iphone: {start_x: 0,start_y: 0,stop_x: 0,stop_y: 0,tap: !1,capture: !1,orig_keys: '',keys: ['UP', 'UP', 'DOWN', 'DOWN', 'LEFT', 'RIGHT', 'LEFT', 'RIGHT', 'TAP', 'TAP'],input: [],code: function (t) {e.code(t)},touchmoveHandler: function (t) {if (1 === t.touches.length && !0 === e.iphone.capture) {var n = t.touches[0]
      e.iphone.stop_x = n.pageX, e.iphone.stop_y = n.pageY, e.iphone.tap = !1, e.iphone.capture = !1, e.iphone.check_direction()}},touchendHandler: function () {if (e.iphone.input.push(e.iphone.check_direction()), e.iphone.input.length > e.iphone.keys.length && e.iphone.input.shift(), e.iphone.input.length === e.iphone.keys.length) { for (var t = !0,n = 0;n < e.iphone.keys.length;n++)e.iphone.input[n] !== e.iphone.keys[n] && (t = !1);t && e.iphone.code(this._currentLink)}},touchstartHandler: function (t) {e.iphone.start_x = t.changedTouches[0].pageX, e.iphone.start_y = t.changedTouches[0].pageY, e.iphone.tap = !0, e.iphone.capture = !0},load: function (t) {this.orig_keys = this.keys, e.addEvent(document, 'touchmove', this.touchmoveHandler), e.addEvent(document, 'touchend', this.touchendHandler, !1), e.addEvent(document, 'touchstart', this.touchstartHandler)},unload: function () {e.removeEvent(document, 'touchmove', this.touchmoveHandler), e.removeEvent(document, 'touchend', this.touchendHandler), e.removeEvent(document, 'touchstart', this.touchstartHandler)},check_direction: function () {return x_magnitude = Math.abs(this.start_x - this.stop_x), y_magnitude = Math.abs(this.start_y - this.stop_y), x = this.start_x - this.stop_x < 0 ? 'RIGHT' : 'LEFT', y = this.start_y - this.stop_y < 0 ? 'DOWN' : 'UP', result = x_magnitude > y_magnitude ? x : y, result = !0 === this.tap ? 'TAP' : result, result}}}
  return 'string' == typeof t && e.load(t), 'function' == typeof t && (e.code = t, e.load()), e}
'undefined' != typeof module && void 0 !== module.exports ? module.exports = KC : 'function' == typeof define && define.amd ? define([], function () {return KC}) : window.KC = KC
// ////// Fin seccion Home /////////////
// ////// Inicio Seccion Passengers  /////////
$(document).ready(function () {

  // console.log("Core - Passengers")
  $('.flight-origin, .flight-destination, .edit').mouseover(function (e) {
    e.preventDefault()
    $('.edit').show()
  })
  $('.edit').mouseout(function (e) {
    e.preventDefault()
    $('.edit').hide()
  })
  // Hover Passengers
  $('.flight-passengers, .editPassengers').mouseover(function (e) {
    e.preventDefault()
    $('.editPassengers').show()
  })
  $('.editPassengers').mouseout(function (e) {
    e.preventDefault()
    $('.editPassengers').hide()
  })


  /**UX Fix click out hide elements**/

    $("main").click
(
  function(e)
  {
    if(e.target.className !== "edit, editPassengers")
    {
      $(".edit, .editPassengers").hide();
    }
  }
);



  $('.ie-datepicker').hide()
  var isFirefox = typeof InstallTrigger !== 'undefined'
  var isIE = /*@cc_on!@*/false || !!document.documentMode
  var _dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
  var _meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  $('[data-toggle="tooltip"]').tooltip()
  $('.menu-opcion-pais').hide()
  $('.menu-programa-recompensas').hide()

  $('input, .select-wrp, .btn-programa-recompensas, .btn-opcion-pais').on('click', function (e) {
    e.stopPropagation()
    $('.select-options').slideUp('fast')
    $('.datepickery').hide()
    $('.btn-programa-recompensas, .btn-opcion-pais').removeClass('open')
    $('.scheduleFlightsWrp button').removeClass('active')
    $('.select-birthday').removeClass('active')
  })

  $('.select-wrp').on('click', function (e) {
    var child = $(this).children(0)
    $(child).focus
  })

  /* SE MUEVE A CHECKOUT.JS IJ QUIQUE*/
  /*$('.btn-programa-recompensas').on('click', function (e) {
    if ($('.menu-programa-recompensas').is(':hidden')) {
      $('.btn-programa-recompensas').addClass('open')
    }else {
      $('.btn-programa-recompensas').removeClass('open')
    }
    $('.menu-programa-recompensas').slideToggle('slow', function () {})
  })

  $('.opcion-programaRecompensas').on('click', function (e) {
    var thisDropdown = $(this).parent().parent().parent().parent().find('button')
    var arrayOfSpan = thisDropdown.find('span')
    $(arrayOfSpan[arrayOfSpan.length - 1]).text($(this).text())
    $('.menu-programa-recompensas').slideToggle('fast')
    $('.btn-programa-recompensas').removeClass('open')
    if ($(this).text() == 'Ninguno') {
      $('.numSocio, .btn-check, .forgetNumber').hide()
    }else {
      $('.numSocio, .btn-check, .forgetNumber').show()
    }
  })*/

  $('.btn-opcion-pais').on('click', function (e) {
    $(this).children().removeClass('hidden')
    var parentdiv = $(this).parent().find($('.menu-opcion-pais'))
    if ((parentdiv).is(':hidden')) {
      $(this).parent().addClass('open')
    }else {
      $(this).parent().removeClass('open')
    }
    parentdiv.slideToggle('slow')
  })

  $('.opcion-pais').on('click', function (e) {
    var btnParent = $(this).parent().parent().parent().find('.btn-opcion-pais')
    var arrayOfSpan = btnParent.find('span')

    var classList = $(this)[0].className.split(' ')
    $(arrayOfSpan[1]).text($(this).text())
    var classList2 = $(arrayOfSpan[1])[0].className.split(' ')
    $(arrayOfSpan[1]).removeClass(classList2[2])
    $(arrayOfSpan[1]).addClass(classList[1])
    $(this).parent().parent().slideToggle('fast')
    btnParent.parent().removeClass('open')
  })

  $('.input-wrp').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    // IJ MODIFY
    // $('.scheduleFlightsWrp .input-wrp').removeClass('active')
    // $('.scheduleFlightsWrp button').removeClass('active')
    $('.select-birthday').removeClass('active')
    $('.ie-datepicker').hide()
    $(this).addClass('active')
    ;($(this).children().find('input')).focus()
  })
  $('input').on('click', function (e) {
    // IJ MODIFY
    // $('.scheduleFlightsWrp .input-wrp').removeClass('active')
    // $('.scheduleFlightsWrp button').removeClass('active')
    $('.select-birthday').removeClass('active')
    $(this).parent().parent().addClass('active')
  })

  $('.contratoPrestServicio').on('click', function (e) {
    e.preventDefault()
    $('.modalcontract').modal('show')
  })
  $('.avisoPrivacidad').on('click', function (e) {
    e.preventDefault()
    $('.modaltext').modal('show')
  })
  $('.forgetNumber').on('click', function (e) {
    e.preventDefault()
    $('.modalclub').modal('show')
  })

  // IJ - SE PASA A CHECKOUT.JS
  /*$('.btn-check').on('click', function (e) {
    $('.numSocio').addClass('incorrect')
    $('.nombrSocio').addClass('correct')
  })*/
  /*
  if($.browser.chrome) {
     alert(1)
  } else if ($.browser.mozilla) {
     alert(2)
  } else if ($.browser.msie) {
     alert(3)
  }
  */

  if (isIE) {
    // console.log("yesIE")

    $('.empty-dater').on('click', function (e) {
      e.stopPropagation()
      // createIECalendars($(this).parent()) IJ MODIFIED
      $(this).parent().find('input').focus()
    })
  }
  else if (isFirefox) {
    // console.log("Mozilla");	
    $('.date-input').datebox({
      mode: 'flipbox'
    })
  }else {
    // console.log("browser");	
    $('.date-input').datebox({
      mode: 'flipbox'
    })
  }

  function createIECalendars ($wrapper) {
    var calendario = $('.ie-datepicker')
    $wrapper.addClass('active')
    calendario.show()
    var currentInput = $($wrapper).find('input[type=text]')
    $($wrapper).append(calendario)

    var $selectDays = $('.pickerDay')
    for (i = 1;i <= 31;i++) {
      $selectDays.append($('<option></option>').val(i).html(i))
    }

    var $selectMonth = $('.pickerMonth')
    for (i = 1;i <= 12;i++) {
      var currentMonth = _meses[(i - 1)]
      $selectMonth.append($('<option></option>').val(currentMonth).html(currentMonth))
    }

    var $selectYear = $('.pickerYear')
    for (i = 1920;i <= 2018;i++) {
      $selectYear.append($('<option></option>').val(i).html(i))
    }

    var currentConfirm = $($wrapper).find('.ieCalendarData')

    currentConfirm.on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()

      var tempDay = $($wrapper).find('.pickerDay').val()
      var tempMonth = $($wrapper).find('.pickerMonth').val()
      var tempYear = $($wrapper).find('.pickerYear').val()

      if (tempDay != undefined) {
        $(currentInput).val(tempDay + '/' + tempMonth + '/' + tempYear)
      }

      calendario.hide()
    })
  }

  $(document).click(function () {
    $('.input-wrp').removeClass('active')
    $('.select-birthday').removeClass('active')
    $('.ie-datepicker').hide()
    // $('.scheduleFlightsWrp button').removeClass('active') IJ MODIFY
    $('.select-options').slideUp('fast')
    $('.btn-programa-recompensas, .btn-opcion-pais').removeClass('open')
    $('.datepickery').hide()
  })

  $('.select-options').click(function (event) {
    event.stopPropagation()
  })

  $('.radio-switch').on('click', function (event) {
    var arrayOfInputs = $(this).find('input')
    if ($(this).hasClass('women')) {
      $(this).removeClass('women')
      $(this).addClass('men')
      arrayOfInputs[0].checked = true
      arrayOfInputs[1].checked = false
    }else if ($(this).hasClass('men')) {
      $(this).removeClass('men')
      $(this).addClass('women')
      arrayOfInputs[1].checked = true
      arrayOfInputs[0].checked = false
    }
  })

  $('.empty-dater').on('click', function (e) {
    e.stopPropagation()
    e.preventDefault()
    // console.log(":OH!!!")
    $(this).parent().find('input').focus()
  })
})
// ////// Fin Seccion Passengers  /////////
// ////// Inicio Seccion Seats  /////////

// This creates the desktop version tooltip when hovering over each seat
function showSeatPrice (container, unitDetailHtml) {
  // $(document).on('mouseover', '.asiento', function (e) {
  if (!$(container).hasClass('ocupado') && !$(container).hasClass('asignado')) {
    var specialTooltipFix = false
    $('.tooltip-asiento').remove()
    var position = 'En medio'
    var newCopy = 'Cambia tu asiento por'
    var evalPos = $(container).attr('name')
    evalPos = evalPos.split(' ')
    if (evalPos[1] == 'C' || evalPos[1] == 'D') {
      position = 'Pasillo'
    }
    if (evalPos[1] == 'A' || evalPos[1] == 'F') {
      position = 'Ventana'
    }
    var precio = '<span class="seat-price">$489 MXN</span>'
    var specialSeat = '<span class="exit-row">Fila de salida de emergencia</span>'
    var asientoID = '<span class="seat-num">' + ($(container).attr('name')).replace('-', '') + '</span>'
    var addHover = '<div style="position:absolute; height:250%; width:700%;" class="tooltip-asiento"><p>'
    if ($(container).hasClass('especial')) {
      addHover += '' + asientoID + ' ' + newCopy + ' ' + specialSeat + ' ' + precio + ''
      specialTooltipFix = true
    }else {
      addHover += '' + asientoID + ' ' + newCopy + '  ' + precio + ''
      specialTooltipFix = false
    }
    // addHover += '</p></div>'
    addHover = unitDetailHtml
    $(container).append(addHover)

    // If tooltip is too close to left, right or bottom edges this adds the classes that change the styles
    var popUpOffset = $($(container).find('.tooltip-asiento')[0]).offset()

    if (popUpOffset.top > $(window).height() - 160) {
      $($(container).find('.tooltip-asiento')[0]).addClass('bottom-margin')
      if (specialTooltipFix) {
        $($(this).find('.tooltip-asiento')[0]).css('margin-top', '-145px')
      }else {
        $($(this).find('.tooltip-asiento')[0]).css('margin-top', '-105px')
      }
    }else {
      $($(container).find('.tooltip-asiento')[0]).removeClass('bottom-margin')
    }
    if (popUpOffset.left < 0) {
      $($(container).find('.tooltip-asiento')[0]).addClass('left-margin')
    }else {
      $($(container).find('.tooltip-asiento')[0]).removeClass('left-margin')
    }
    if (popUpOffset.left > $(window).width() - 190) {
      $($(container).find('.tooltip-asiento')[0]).addClass('right-margin')
    }else {
      $($(container).find('.tooltip-asiento')[0]).removeClass('right-margin')
    }

    // on Internet Explorer there is an issue with positioning after styles, this solves the issue
    if (msieversion()) {
      var thisLeft = $($(container).find('.tooltip-asiento')[0]).position().left
      var thisStringLeft = (thisLeft - 125).toString()
      $($(this).find('.tooltip-asiento')[0]).css('left', thisStringLeft + 'px')
    }
  }
  // on Safari there is an issue regarding scrolling of seats, this solves the issue
  if (is_safari) {
    $('#asientos-en-avion-filas').click()
    $('#asientos-en-avion-filas').focus()
  }
  // })
  // Once you stop hovering over a seat, the tooltip is removed
  $(document).on('mouseleave', '.asiento', function (e) {
    $('.tooltip-asiento').remove()
  })
}
// This checks if Internet Explorer is being used
function msieversion () {
  var ua = window.navigator.userAgent

  var msie = ua.indexOf('MSIE')

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer, return version number
  {
    return true
  }

  return false
}

var is_safari = navigator.userAgent.indexOf('Safari') > -1
var modalPassengerMobile = false

function confirmEmergencySeat () {
  if ($(window).width() >= 768) {
    $('#ssrConfirmButton').click()
  }
}
// Selects seat clicked over, mobile version
function selectSeatMobile (container, unitDetailHtml) {
  // if seat is special this displays alert
  $('.especial').click(function (e) {
    // e.preventDefault()
    // $('.modalemergency').modal('show')
  })

  // $('.disponible, .asignado, .especial').click(function (e) {
  $('.seleccion-asiento-mobile').bind('click', function () {
    // removes tolltip if any exists
    $('.popUp-seleccion-mobile').remove()
    $('.seleccion-asiento-mobile').unbind('click')
  })
  // Gets current ID
  pasajeroActualId = $(container).attr('id')
  // e.preventDefault()
  // e.stopPropagation()
  var mobileArrayPassengerChange = $('.pasajeros-vuelo-mobile').find('.data-passenger')
  var mobileArrayPassengerSeat = []
  var mobileArrayPassengerName = []

  costToMove = '$489'
  if ($(container).hasClass('asignado')) {
    costToMove = 'Cambio sin costo'
  }
  if (modalPassengerMobile) {
    var popUpOffset = $($(container).find('.popUp-seleccion-mobile')[0]).offset()
    var wantedSeat = $(container).attr('id')
    // when clicking on a passenger from the tooltip this changes the passenger's seat 
    /*$('.passengerMobile').on('click', function (e) {
      e.stopPropagation()

      var arrayParent = $('.passengerMobileParent').children()
      for (var t = 0; t < arrayParent.length; t++) {
        var parentArray = $(arrayParent[t])
        var thisArray = $(container)

        if (parentArray.is(thisArray)) {
          _mobilePasChanged = t + 1
        }
      }
      $('.passengerMobile').removeClass('activePassengerMobile')
      $('.pasajeroCheckbox').prop('checked', false)
      $(container).addClass('activePassengerMobile')
      $(container).find('.pasajeroCheckbox').prop('checked', true)
      var verifySeat = function () {
        if (numasiento[0] != undefined) {

          // Changes the seat of the passenger from current to new selected
          mobileArrayPassengerSeat[_mobilePasChanged] = mobileArrayPassengerChange.find('.data-passenger-seat')[_mobilePasChanged]
          mobileArrayPassengerName[_mobilePasChanged] = mobileArrayPassengerChange.find('.data-passenger-name')[_mobilePasChanged]
          var primeraLetra = $(mobileArrayPassengerName[_mobilePasChanged]).text().split(/(?=[A-Z])/)

          var oldSeat = numasiento[0].innerText

          var inicialesPassengers = (primeraLetra[1].substring(0, 1) + primeraLetra[2].substring(0, 1))
          $('#' + pasajeroActualId).text(inicialesPassengers)
          // Accounts from parsing of ID from 2B to 2-B
          if ((oldSeat.length) < 3) {
            var newOldSeatId = oldSeat.substring(0, 1) + '-' + oldSeat.substring(1, 2)
          }
          $('#' + (newOldSeatId)).text(newOldSeatId.substring(2, 3))
          $('#' + (oldSeat).replace(' ', '-')).removeClass('asignado')
          $('#' + (oldSeat).replace(' ', '-')).addClass('disponible')
          $('#' + (wantedSeat).replace(' ', '-')).addClass('asignado')
          $('#' + ((oldSeat).replace(' ', '-'))).text(oldSeat.substring(2, 3))

          $(mobileArrayPassengerSeat[_mobilePasChanged]).addClass('selected-green')
          numasiento[0].innerText = wantedSeat.replace('-', '')
          _defaultSeat[ indexPasActivo ] = wantedSeat

          asignNewSeat(oldSeat, wantedSeat)

          modalPassengerMobile = false
          $('.popUp-seleccion-mobile').hide()
        }
      }
      // Waits 0.3 seconds to stop displaying the tooltip, as to verify selection
      setTimeout(verifySeat, 300)

      var numasiento = $('.activePassengerMobile').find('.mobilePassengerSeat')
      var indexPasajero = 0
      var indexPasActivo = 0
      // this checks which passenger is changing seats
      $('.passengerMobile').each(function () {
        if ($(container).hasClass('activePassengerMobile')) {
          indexPasActivo = indexPasajero
          return
        }
        indexPasajero++
      })

      var arrayofAsignados = $('#deck').find('.asignado')
      // this cheks the IDs of current asigned seats
      for (var k = 0; k < arrayofAsignados.length; k++) {
        _tempSeats[k] = $(arrayofAsignados[k]).attr('id')
      }
    })*/

    modalPassengerMobile = false
  // return
  }
  if (modalPassengerMobile == false) {
    // This creates the tooltip structure
    $('.popUp-seleccion-mobile').remove()
    var addHTML3 = '<div class="popUp-seleccion-mobile" style="position:absolute; background-color:white; z-index:100;">'
    addHTML3 += '<div class="col-xs-12 cost-to-change-seats">'
    addHTML3 += ($(container).attr('id')).replace('-', '') + '   ' + costToMove + ' MXN'
    addHTML3 += '</div>'
    addHTML3 += '<div class="col-xs-12 passengerMobileParent">'
    /*for (var i = 0;i < _numPassengers;i++) {
      addHTML3 += '<div class="row passengerMobile ' + i + 'b">'
      addHTML3 += '<div class="col-xs-8 mobilePassengerName">'
      addHTML3 += 'Omar Caballero ' + (i + 1) + ''
      addHTML3 += '</div>'
      addHTML3 += '<div class="col-xs-2 mobilePassengerSeat">'
      addHTML3 += '' + ((_defaultSeat[i]).replace(' ', '')).replace('-', '') + ''
      addHTML3 += '</div>'
      addHTML3 += '<div class="col-xs-2 mobilePassengerCheck">'
      addHTML3 += '<input type="checkbox" class="pasajeroCheckbox">'
      addHTML3 += '<div class="circle"></div>'
      addHTML3 += '</div>'

      addHTML3 += '</div>'
    }*/
    addHTML3 += '</div>'
    addHTML3 += '</div>'

    var idToEval = $(container).attr('name')

    $(container).append(unitDetailHtml)

    // If tooltip is too close to left, right or bottom edges this adds the classes that change the styles
    var popUpOffset = $($(container).find('.popUp-seleccion-mobile')[0]).offset()

    var popUpWidth = $($(container).find('.popUp-seleccion-mobile')[0]).width()
    if (popUpOffset.top > $(window).height() - 160) {
      $($(container).find('.popUp-seleccion-mobile')[0]).addClass('bottom-margin')
    }else {
      $($(container).find('.popUp-seleccion-mobile')[0]).removeClass('bottom-margin')
    }

    if ((idToEval.includes('A')) || (idToEval.includes('B'))) {
      $($(container).find('.popUp-seleccion-mobile')[0]).addClass('left-margin')
    }else {
      $($(container).find('.popUp-seleccion-mobile')[0]).removeClass('left-margin')
    }

    if (popUpOffset.left > $(window).width() - popUpWidth) {
      $($(container).find('.popUp-seleccion-mobile')[0]).addClass('right-margin')
    }else {
      $($(container).find('.popUp-seleccion-mobile')[0]).removeClass('right-margin')
    }

    if ($(window).height() < 560) {
      if (idToEval.includes('C')) {
        $($(container).find('.popUp-seleccion-mobile')[0]).addClass('left-margin')
      }
      if (idToEval.includes('E')) {
        $($(container).find('.popUp-seleccion-mobile')[0]).addClass('right-margin')
      }
    }

    modalPassengerMobile = true
    return
  }
// })
}

$(document).ready(function () {
  /*Seats variables*/
  var _availableHeight
  var _numberOfSeats = 124
  var _numberOfCols = 6
  var _numberOfRows = Math.floor(_numberOfSeats / _numberOfCols)
  var _rowsBeforeAisle = 3
  var _seatWidth
  var _spaceBetweenSeats = 2
  var _verticalSpaceFix = 0
  var _ABCdario = []
  _ABCdario = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  var _factor = 3.8
  var _mobilePasChanged
  var pasajeroActualId

  $('[data-toggle="tooltip"]').tooltip()
  var mobile = true
  var _numPassengers = 4

  var _defaultSeat = []
  _defaultSeat = []
  var _tempSeats = []
  _tempSeats = []
  $(window).resize(function () {
    init()
    if ($(window).width() < 768 && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && window.location.href.indexOf('SeatMap') > -1) {
      /*$("#loader").modal('show')
      $(window).off('resize')
      location.reload();*/
    }
  })

  $(window).on('orientationchange', function (event) {
    init()
  })
  init()

  function init () {
    // console.log("Seats section")
    if (window.location.href.indexOf('SeatMap') > -1) {
      seatValidation()
      checkWebVersion()
    }
  }
  function isiPhone () {
    return (
      (navigator.platform.indexOf('iPhone') != -1) ||
      (navigator.platform.indexOf('iPod') != -1)
    )
  }

  // Seats width change according to window's
  function seatValidation () {
    if ($(window).width() < 1200) {
      _factor = 1
    }
    if ($(window).width() < 850) {
      _factor = 0.92
    }
    if ($(window).width() < 800) {
      _factor = 0.905
    }
    else if ($(window).width() > 1200) {
      _factor = 1
    }
  }

  // If desktop version is used this makes sure all desktop items are shown and all mobile are hidden
  function setDesktop () {
    desktopStartUp()
    $('.desktopVersion').show()
    $('.mobileVersion').hide()
    $('.pasajeros-vuelo-mobile').hide()
    pintarTabla('.plane-seats')
  }

  // If mobile version is used this makes sure all mobile items are shown and all desktop are hidden
  function setMobile () {
    $('.desktopVersion').hide()
    $('.mobileVersion').show()
    $('.pasajeros-vuelo-mobile').hide()
    pintarTablaMobile('.mobile-seats-wrp')
    mobileStartUp()
  }

  // Checks if mobile or desktop is being used to browse
  function checkWebVersion () {
    if ($(window).width() < 768) {
      setMobile()
    }else {
      setDesktop()
    }
  }

  // Initializes desktop functions
  function desktopStartUp () {
    for (var i = 0; i < $('.btn-reestablecer').length; i++) {
      ($('.btn-reestablecer')[i]).disabled = true
    }
    $('.detalles-pasajeros').hide()
    $('.detalles-vuelo').addClass('closeSlide')
    // $('.detalles-pasajeros').first().show()
    $('.openSlide').next().show()
    $(document).on('click', '.btn-green-interjet', function (e) {
      $('.close').click()
    })

    $('.openSlide').next().find('.data-passenger').each(function () {
      // $( this ).addClass( "foo" )
      // var primeraLetra = $($( this ).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/)
      var primeraLetra = $($(this).find('.data-passenger-name')[0].children[0]).text().split(/\s+/g)
      var asiento = $($(this).find('.data-passenger-seat')[0].children[0]).text()
      var inicialesPassengers = (primeraLetra[0].substring(0, 1) + primeraLetra[1].substring(0, 1))
      if (asiento != '') {
        $('.aUnit[name="' + asiento + '"]').text(inicialesPassengers)
        $('.aUnit[name="' + asiento + '"]').addClass('asignado')
      }
    // console.log(inicialesPassengers)
    })

    passengersDetaillsUnfold()
    assignPassenger()
    // resetSeatsFunction()
    // showSeatPrice()
    selectSeatDesktop()
  }

  // Initializes mobile functions 
  function mobileStartUp () {
    $('#deck').css('position', 'relative')
    $('#deck').css('overflow-y', 'scroll')
    $('#deck').css('height', '100vh')
    $('#deck').css('box-sizing', 'padding-box')
    $('#deck').css('-moz-box-sizing', 'padding-box')
    $('#deck').css('-webkit-box-sizing', 'padding-box')
    $('#deck').css('padding-bottom', '60px')
    $('#deck').css('background-size', '102% 102%')

    var pasajeros = $('.unfoldMobile').parent().find('.pasajeros-vuelo-mobile')
    $(pasajeros).show()

    $('.btn-cambiar-asientos-mobile').unbind('click').click(function (e) {
      $('.atn-mobile').removeClass('open')
      $('.atn-footer').slideDown().addClass('hidden')

      $('.detalles-vuelo-mobile').hide()
      $('.seleccion-asiento-mobile').show()

      $('footer').hide()
      $('.menuScheduleWrp').hide()
      $('.btn-next').hide()
      $('.btn-next-wrp').hide()
    })

    $('.btn-mobile-actualizar').on('click' , function (e) {
      $('.detalles-vuelo-mobile').show()
      $('.seleccion-asiento-mobile').hide()
      $('footer').show()
      $('.menuScheduleWrp').show()
      $('.btn-next').show()
      $('.btn-next-wrp').show()
    })

    $(document).on('click', '.passengerMobile', function (e) {
      e.stopPropagation()

      $('.passengerMobile').removeClass('activePassengerMobile')
      $(this).addClass('activePassengerMobile')

      $(this).find('input [type=checkbox]').click()
    })

    $('.return-passenger-list').unbind('click').click(function (e) {
      e.preventDefault()
      e.stopPropagation()
      $('.detalles-vuelo-mobile').show()
      $('.seleccion-asiento-mobile').hide()
      $('.atn-mobile').toggleClass('open')
      $('.atn-footer').slideToggle().toggleClass('hidden')
      $('footer').show()
      $('.menuScheduleWrp').show()
      $('.btn-next').show()
      $('.btn-next-wrp').show()
    })

    $(document).on('click', '.btn-green-interjet', function (e) {
      $('.close').click()
    })

    $('.modal-footer').on('click', function (e) {
      $('.close').click()
    })

    $('.btn-actualizar-mobile').on('click', function (e) {
      for (var i = 0; i < _defaultSeat.length; i++) {
        _defaultSeat[i] = _tempSeats[i]
      }
      var arrayOfDataPSeat = $('.pasajeros-vuelo-mobile').find('.data-passenger-seat')
      for (var i = 0; i < arrayOfDataPSeat.length; i++) {
        if (_tempSeats[i] != undefined) {
          if (_tempSeats[i] != 'N/A') {
            $(arrayOfDataPSeat[i]).text(_tempSeats[i].replace('-', ''))
          }else {
            $(arrayOfDataPSeat[i]).text(_tempSeats[i])
          }
        }
      }
      $('.return-passenger-list').click()
    })
  }

  // Selects seat clicked on, desktop version
  function selectSeatDesktop () {
    $(document).on('click', '.asiento', function (e) {
      // removes previous tolltip if any exists
      $('.tooltip-asiento').remove()
      // checks current passenger selected
      var activePassenger = $(document).find('.activePassenger')

      if ($(this).hasClass('asignado')) {
        return
      }
      // if this is a special seat, displays warning
      if ($(this).hasClass('especial')) {
        e.preventDefault()
        $('.modalemergency').modal('show')
      // $('.modal-body').css('overflow-y', 'scroll')
      // $('.modal-header').css('overflow-y', 'scroll')
      // $('.modal-title').css('overflow-y', 'scroll')
      }
      if ($(this).hasClass('ocupado')) {
        return
      }

      if ($(this).hasClass('disponible')) {
        /*var innerTextAsientoPasajero = activePassenger.find('.data-passenger-seat')[0].innerText
        // Breaks name of passenger at every Uppercase
        var primeraLetra = $(activePassenger.find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/)
        // Gets first letter of every name a passenger has
        var inicialesPassengers = (primeraLetra[0].substring(0, 1) + primeraLetra[1].substring(0, 1))
        $(this).text(inicialesPassengers)
        // IDs have 2-B parsing while texts have 2B, this adjusts ID search accounting for such
        $('#' + innerTextAsientoPasajero.replace(/\s/g, '-') + '').text(innerTextAsientoPasajero.substring(2, 3))
        activePassenger.find('.data-passenger-seat')[0].innerText = ($(this).attr('name')).replace('-', '')
        $(activePassenger.find('.data-passenger-seat')[0]).addClass('selected-green')
        // Accounts for possible 2B id instead of 2-B
        if (innerTextAsientoPasajero.replace(/\s/g, '-').split('').length < 2) {
          var nomenclatura = (innerTextAsientoPasajero.replace(/\s/g, '-')).substring(0, 1) + '-' + (innerTextAsientoPasajero.replace(/\s/g, '-')).substring(1, 2)
          asignNewSeat(nomenclatura, $(this).attr('name'))
          $(activePassenger.find('.data-passenger-seat')[0]).text(nomenclatura.substring(1, 2))
        }else {
          var nomenclatura = (innerTextAsientoPasajero.replace(/\s/g, '-').substring(0, 1) + '-' + innerTextAsientoPasajero.replace(/\s/g, '-').substring(1, 2))

          asignNewSeat(nomenclatura, $(this).attr('name'))
          $('#' + (innerTextAsientoPasajero.substring(0, 1) + '-' + innerTextAsientoPasajero.substring(1, 2))).text(nomenclatura.substring(2, 3))
        }

        // Once a seat has been changed this enables "Reestablecer" buttons
        activePassenger.parent().parent().find('.btn-reestablecer')[0].disabled = false*/

        return
      }
    })
  }

  // This opens the passengers details, there is only one open at a time
  function passengersDetaillsUnfold () {
    $('.btn-slide-pasajeros').unbind('click').click(function (e) {
      e.preventDefault()
      e.stopPropagation()
      if (!$(this).closest('.vuelo-wrp').find('.detalles-pasajeros').is(':visible')) {
        var arrayOfVisibles = $('.detalles-pasajeros')
        var flag = false
        var counter = 0
        arrayOfVisibles.slideUp('slow')
        $('.detalles-vuelo').removeClass('openSlide')
        $('.detalles-vuelo').addClass('closeSlide')

        for (var i = 0; i < arrayOfVisibles.length; i++) {
          if ($(arrayOfVisibles[i]).is(':visible')) {
            counter++
          }
        }

        if (($(this).parent().parent().parent().find('.detalles-pasajeros')).is(':visible') && (counter > 0)) {
          $(this).parent().parent().addClass('closeSlide')
          $(this).parent().parent().removeClass('openSlide')
          $(this).parent().parent().parent().find('.detalles-pasajeros').slideUp('slow')
        }else {
          $(this).parent().parent().addClass('openSlide')
          $(this).parent().parent().removeClass('closeSlide')
          $(this).parent().parent().parent().find('.detalles-pasajeros').slideDown('slow')
          $(this).parent().parent().parent().find('.detalles-pasajeros').find('.data-passenger').first().click()
        }

        $('#loader').modal('show')
      }else {
        $('#loader').modal('hide')
        return
      }
    })
  }

  // If passenger does not have a N/A text, this changes his/her seat
  function assignPassenger () {
    $('.data-passenger').unbind('click').click(function (e) {
      if ($(this).find('.data-passenger-seat')[0].innerText == 'N/A') {
        return
      }else {
        $('.data-passenger').removeClass('activePassenger')

        $(this).addClass('activePassenger')
      }
    })
  }
  // This sets seats back to original y asigned seats
  function resetSeatsFunction () {
    $('.btn-reestablecer').unbind('click').click(function (e) {
      for (var i = 0; i < $('.asignado').length; i++) {
        var arrayAsientosAsignados = $('.asignado')
        var currentAsientoAsignado = arrayAsientosAsignados[i]

        $(currentAsientoAsignado).removeClass('asignado')
      }
      var arrayOfThisFlightPassenger = $(this).parent().parent().find('.data-passenger-seat')
      for (var i = 0; i < arrayOfThisFlightPassenger.length;i++) {
        arrayOfThisFlightPassenger[i].innerText = _defaultSeat[i]
      }
      for (var i = 0; i < _defaultSeat.length;i++) {
        if (_defaultSeat[i] != 'N/A') {
          var fixedId = _defaultSeat[i].replace(' ', '-')
          var nameFixedId = _defaultSeat[i].substring(0, 1) + '-' + _defaultSeat[i].substring(1, 2)

          $('#' + _defaultSeat[i]).removeClass('ocupado')
          $('#' + _defaultSeat[i]).removeClass('disponible')
          $('#' + _defaultSeat[i]).removeClass('especial')
          $('#' + _defaultSeat[i]).addClass('asignado')

          $('#' + fixedId).removeClass('ocupado')
          $('#' + fixedId).removeClass('disponible')
          $('#' + fixedId).removeClass('especial')
          $('#' + fixedId).addClass('asignado')

          $('#' + nameFixedId).removeClass('ocupado')
          $('#' + nameFixedId).removeClass('disponible')
          $('#' + nameFixedId).removeClass('especial')
          $('#' + nameFixedId).addClass('asignado')

          var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/)
          var inicialesPassengers = (primeraLetra[0].substring(0, 1) + primeraLetra[1].substring(0, 1))
          $('#' + nameFixedId).text(inicialesPassengers)
        }
      }
      for (var i = 0; i < $('.btn-reestablecer').length; i++) {
        ($('.btn-reestablecer')[i]).disabled = true
        $('.data-passenger-seat').removeClass('selected-green')
      }
      $('.data-passenger-seat').removeClass('selected-green')
    })
  }

  // This changes both in desktop and mobile the passenger from the $oldSeat to the $newSeat, leaving available the $oldSeat
  function asignNewSeat ($oldSeatID, $newSeatID) {
    if (($oldSeatID.length) < 3) {
      var newOldSeatId = $oldSeatID.substring(0, 1) + '-' + $oldSeatID.substring(1, 2)
      $oldSeatID = newOldSeatId
    }
    var newSeat = $('#' + $newSeatID)
    newSeat.addClass('asignado')

    var oldSeat = $('#' + $oldSeatID)
    oldSeat.addClass('disponible')
    oldSeat.removeClass('asignado')
  }

  // This creates the Seat Chart structure on desktop
  function pintarTabla ($wrapper) {
    _verticalSpaceFix = 0
    // TOTAL SIZE to handle
    var name = $wrapper

    // Get responsive Height
    _availableHeight = $(name).prop('scrollHeight') * _factor
    var spaceBetweenSeats = 4 * _numberOfRows // padding
    var tempMarginTop = 30 // marginTop
    var tempTotalHeight = _availableHeight - spaceBetweenSeats - tempMarginTop
    _seatWidth = tempTotalHeight / _numberOfRows

    // Get responsive Width and fill with space
    var tempFixHorixontal = 0.20
    if ($(window).width() < 768) {
    }
    var availableWidth = $(name).width() * tempFixHorixontal
    var spaceBetweenSeatsV = 2 * _numberOfCols
    var tempTotalWidth = availableWidth - spaceBetweenSeatsV
    _seatWidth = tempTotalWidth / (_numberOfCols + 1)

    var fix = ((_seatWidth + _verticalSpaceFix) * (_numberOfRows))

    if (fix < tempTotalHeight) {
      while(fix < tempTotalHeight){
        _verticalSpaceFix++
        fix = ((_seatWidth + _verticalSpaceFix) * _numberOfRows)
      }
    }
    else if (fix > tempTotalHeight) {
      while(fix > tempTotalHeight){
        _verticalSpaceFix--
        fix = (_seatWidth + _verticalSpaceFix) * _numberOfRows
      }
    }

    if ($(window).width() < 860) {
      _spaceBetweenSeats = 5
      _verticalSpaceFix = 5
    }

    $('#asientos-en-avion-filas .seatRow').remove()
    $('.aUnit').each(function () {
      var top = parseInt($(this).css('top'), 10)
      var left = parseInt($(this).css('left'), 10)
      $(this).css('width', _seatWidth + 'px')
      $(this).css('height', _seatWidth + 'px')
      if ($(window).width() < 1200) {
        $(this).css('margin-left', (left - 18) * (-.15) + 'px')
        $(this).css('margin-top', (top - 72) * (-.15) + 'px')
      }else {
        $(this).css('margin-left', '0px')
        $(this).css('margin-top', '0px')
      }
    })

    $('.unit').each(function () {
      var top = parseInt($(this).css('top'), 10)
      var left = parseInt($(this).css('left'), 10)
      if ($(window).width() < 1200) {
        $(this).css('margin-left', (left) * (-.15) + 'px')
        $(this).css('margin-top', (top) * (-.15) + 'px')
      }else {
        $(this).css('margin-left', '0px')
        $(this).css('margin-top', '0px')
      }
    })

    for (j = 0; j < _numberOfRows;j++) {
      var addHTML1 = '<div class="seatRow row" id="seatRow' + j + '"></div>'

      $('#asientos-en-avion-filas').append(addHTML1)

      for (i = 0; i <= _numberOfCols;i++) {
        var randomAsiento = Math.random()
        var tipoDeAsiento = 'disponible'
        // Random occupied seats for demonstrative purposes
        if (randomAsiento > 0.8) {
          tipoDeAsiento = 'ocupado'
        }
        // Rows 10 and 11 are special seats
        if (j == 9 || j == 10) {
          tipoDeAsiento = 'especial'
        }

        var numberfix = 0
        if (j + 1 >= 13) {
          numberfix++
        }

        var hauntedRowFix = (j + 1 + numberfix) + ' ' + _ABCdario[i]
        var hauntedRowNumber = (j + 1 + numberfix)
        var verticalAlign = ((j * _seatWidth) + ((_spaceBetweenSeats + _verticalSpaceFix) * j))

        var iterate = 'seatRow'
        // Actual structure of seats
        if (i < (_rowsBeforeAisle)) {
          var addHTML2 = '<div id="' + (hauntedRowFix.replace(' ', '-')) + '" class="asiento '
            + tipoDeAsiento + '" style="text-align:center; top:'
            + verticalAlign + 'px ; left:'
            + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ;  position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + _ABCdario[i] + '<div>'
          $('#' + iterate + j).append(addHTML2)
        }
        else if (i == (_rowsBeforeAisle)) {
          var addHTML2 = '<div class="pasillo" style="text-align:center; top:'
            + verticalAlign + 'px ; left:'
            + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ; position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + hauntedRowNumber + '</div>'
          $('#' + iterate + j).append(addHTML2)
        }else {
          var addHTML2 = '<div id="' + (hauntedRowNumber) + '-' + _ABCdario[i - 1] + '" class="asiento '
            + tipoDeAsiento + '" style="text-align:center; top:'
            + verticalAlign + 'px ; left:'
            + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ;  position: absolute;  width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + _ABCdario[i - 1] + '<div>'
          $('#' + iterate + j).append(addHTML2)
        }
      }
    }

    // This gets the asigned-to-passenger seats their class while removing all others
    for (var i = 0; i < _defaultSeat.length;i++) {
      /*if (_defaultSeat[i] != 'N/A') {
        var fixedId = _defaultSeat[i].replace(' ', '-')
        var nameFixedId = _defaultSeat[i].substring(0, 1) + '-' + _defaultSeat[i].substring(1, 2)

        $('#' + _defaultSeat[i]).removeClass('ocupado')
        $('#' + _defaultSeat[i]).removeClass('disponible')
        $('#' + _defaultSeat[i]).removeClass('especial')
        $('#' + _defaultSeat[i]).addClass('asignado')

        $('#' + fixedId).removeClass('ocupado')
        $('#' + fixedId).removeClass('disponible')
        $('#' + fixedId).removeClass('especial')
        $('#' + fixedId).addClass('asignado')

        $('#' + nameFixedId).removeClass('ocupado')
        $('#' + nameFixedId).removeClass('disponible')
        $('#' + nameFixedId).removeClass('especial')
        $('#' + nameFixedId).addClass('asignado')

        var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/)
        var inicialesPassengers = (primeraLetra[0].substring(0, 1) + primeraLetra[1].substring(0, 1))
        $('#' + nameFixedId).text(inicialesPassengers)
      }*/
    }

    // Changes chart size according to window size
    $('.selectSeats .plane-seats .select-seats #asientos-en-avion-filas').css('margin-left', '44px')
    if ($(window).width() < 1200) {
      $('.selectSeats .plane-seats .select-seats #asientos-en-avion-filas').css('margin-left', '33px')
    }
    if ($(window).width() < 860) {
      $('.selectSeats .plane-seats .select-seats #asientos-en-avion-filas').css('margin-left', '18px')
    }

    if (is_safari) {
      $('#asientos-en-avion-filas').click()
      $('#asientos-en-avion-filas').focus()
    }
  }

  function pintarTablaMobile ($wrapper) {
    // This creates the Seat Chart structure on mobile
    var mobileVerticalSpace = 2
    var name = $wrapper
    _availableHeight = $(window).height()
    var spaceBetweenSeats = 4 * _numberOfRows
    var tempMarginTop = 10
    var tempTotalHeight = _availableHeight - tempMarginTop

    var aspectRatio = tempTotalHeight / ($(name).width() / 3.7)

    var widthFixer = 0
    // Check for horizontal or vertical orientation
    if ($(window).width() > $(window).height()) {
      widthFixer = 4
    }

    var availableWidth = $(window).width() - 75
    var spaceBetweenSeatsV = 4 * _numberOfCols
    var tempTotalWidth = availableWidth - spaceBetweenSeatsV

    _seatWidth = tempTotalHeight / _numberOfRows

    _seatWidth = (tempTotalWidth / (_numberOfCols + 1)) - widthFixer

    $('#deck .seatRowMobile').remove()

    // Actual chart structure
    /*for (j = 0; j <= _numberOfRows;j++) {
      var addHTML1 = '<div class="seatRowMobile row" id="seatRowMobile' + j + '"></div>'

      $('#deck').append(addHTML1)
      for (i = 0; i <= _numberOfCols;i++) {
        var randomAsiento = Math.random()
        var tipoDeAsiento = 'disponible'
        if (randomAsiento > 0.8) {
          tipoDeAsiento = 'ocupado'
        }

        if (j == 9 || j == 10) {
          tipoDeAsiento = 'especial'
        }
        var numberfix = 0
        if (j + 1 >= 13) {
          numberfix++
        }
        var valueMobile = 5

        var hauntedRowFix = (j + 1 + numberfix) + ' ' + _ABCdario[i]
        var hauntedRowNumber = (j + 1 + numberfix)
        var verticalAlign = ((j * _seatWidth) + ((mobileVerticalSpace) * j))

        var iterate = 'seatRowMobile'
        if (j != _numberOfRows) {
          if (i < (_rowsBeforeAisle)) {
            var addHTML2 = '<div id="' + (hauntedRowFix.replace(' ', '-')) + '" class="asientoMobile ' + tipoDeAsiento + '" style="margin-left:' + (widthFixer * 3) + 'px; text-align:center; top:'
              + verticalAlign + 'px ; left:'
              + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ;  position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + _ABCdario[i] + '<div>'
            $('#' + iterate + j).append(addHTML2)
          }else if (i == (_rowsBeforeAisle)) {
            var addHTML2 = '<div class="pasilloMobile" style="margin-left:' + (widthFixer * 3) + 'px; text-align:center; top:'
              + verticalAlign + 'px ; left:'
              + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ; position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + hauntedRowNumber + '</div>'
            $('#' + iterate + j).append(addHTML2)
          }else {
            var addHTML2 = '<div id="' + (hauntedRowNumber) + '-' + _ABCdario[i - 1] + '" class="asientoMobile ' + tipoDeAsiento + '" style="margin-left:' + (widthFixer * 3) + 'px; text-align:center; top:'
              + verticalAlign + 'px ; left:'
              + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ;  position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) + 'px;">' + _ABCdario[i - 1] + '<div>'
            $('#' + iterate + j).append(addHTML2)
          }
        }

        // Issue displaying chart all the way down while scrolling, this fixes that issue
        if (j == _numberOfRows) {
          var horizontalAxis = 2
          if ($(window).width() > $(window).height()) {
            horizontalAxis = 0
          }
          var addHTML2 = '<div class="col-sm-12" style="text-align:center; top:'
            + verticalAlign + 'px ; left:'
            + ((i * _seatWidth) + (_spaceBetweenSeats * i)) + 'px ;  position: absolute; width:' + (_seatWidth) + 'px; height:' + (_seatWidth) / (horizontalAxis) + 'px; background-color:red; visibility:hidden">'
          addHTML2 += '<div class="row" >'
          addHTML2 += '<div class="col-sm-12" >'
          addHTML2 += '</div>'
          addHTML2 += '</div>'
          addHTML2 += '</div>'
          $('#' + iterate + j).append(addHTML2)
        }
      }

      for (var i = 0; i < $('.seatRowMobile').length; i++) {
        $($('.seatRowMobile')[i]).css('margin-left",' + (widthFixer * 3) + 'px')
      }
      $('mobile-seats-wrp').css('margin-left",' + (widthFixer * 3) + 'px')
      selectSeatMobile()
    }*/

    // This assigns seats currently assigned to passengers
    for (var i = 0; i < _defaultSeat.length;i++) {
      /*if (_defaultSeat[i] != 'N/A') {
        var fixedId = _defaultSeat[i].replace(' ', '-')
        var nameFixedId = _defaultSeat[i].substring(0, 1) + '-' + _defaultSeat[i].substring(1, 2)

        $('#' + _defaultSeat[i]).removeClass('ocupado')
        $('#' + _defaultSeat[i]).removeClass('disponible')
        $('#' + _defaultSeat[i]).removeClass('especial')
        $('#' + _defaultSeat[i]).addClass('asignado')

        $('#' + fixedId).removeClass('ocupado')
        $('#' + fixedId).removeClass('disponible')
        $('#' + fixedId).removeClass('especial')
        $('#' + fixedId).addClass('asignado')

        $('#' + nameFixedId).removeClass('ocupado')
        $('#' + nameFixedId).removeClass('disponible')
        $('#' + nameFixedId).removeClass('especial')
        $('#' + nameFixedId).addClass('asignado')

        var primeraLetra = $($($(document).find('.data-passenger')[i]).find('.data-passenger-name')[0].children[0]).text().split(/(?=[A-Z])/)
        var inicialesPassengers = (primeraLetra[0].substring(0, 1) + primeraLetra[1].substring(0, 1))
        $('#' + nameFixedId).text(inicialesPassengers)
      }*/
    }

    if ($(window).width() > $(window).height()) {
      $('#deck').css('padding-left', '38px')
    }else {
      $('#deck').css('padding-left', '32px')
    }
  }
})

// ////// Fin Seccion Seats  /////////
// ////// Inicio Seccion Extras  /////////

$(document).ready(function () {

  // JSON Test package
  // console.log(document.location.href.match(/[^\/]+$/)[0])
  var passenger =
  {
    firstName: 'John',
    lastName: 'Doe',
    specialService: '',
    extraWeight: '',
    otherWeight: '',
    pet: ''
  }

  // Global variables
  if (window.location.href.indexOf('xtras') >= 0 || window.location.href.indexOf('dicionales') >= 0) {
    var valorServicio = '500 MXN'
    var tipoServicio = '1 maleta extra'
    var pasajeroServicio = 'Luisa Meneses'
    var addHTML = ''
    var isFirefox = typeof InstallTrigger !== 'undefined'
    var _arrayOfPassengers = $('.passengerCol').find('input')
    var _arrayOfChoiceOne = $('.complementCol').find('.select-complement')
    var _arrayOfChoiceTwo = $('.complementCol2').find('.select-complement')
    var isIE = (navigator.userAgent.indexOf('MSIE') != -1)
    var isIE11 = !!window.MSInputMethodContext && !!document.documentMode
    var _passengerNames = []
    _passengerNames = ['Luisa Meneses', 'Ryan Golsling', 'James Blake', 'Sylvia Plat']

    var _isMobile = false

    initSection()
  }

  function initSection () {
    setUp()
  }
  if (!!navigator.userAgent.match(/Trident\/7\./)) {
    isIE = true
  }else {
    isIE = false
  }

  // Checks and sets if mobile or desktop version should be used
  function checkVersion () {
    if (navigator.platform == 'iPad') {
      _isMobile = false
      $('#interjet-tierra-wrp').css('display', 'block')
      $('#renta-auto-wrp').css('display', 'block')
      $('#estacionamiento-wrp').css('display', 'block')
      $('#apartarhotel-wrp').css('display', 'block')
    } else if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() < 760) {
      _isMobile = true
    } else {
      _isMobile = false
    }
  // console.log('Estás entrando desde un ' + navigator.platform)
  }

  // Checks version everytime windows changes size
  $(window).resize(function () {
    checkVersion()
  })

  // Sets basic functionability
  function setUp () {
    $('.select-options').hide()

    $('.close-btn').click(function () {
      $('#modalServices').modal('hide')
    })
    $('.btn-secondary').click(function () {
      $('#modalServices').modal('hide')
    })

    $('.box-hotel-info').hide()
    $($('.hotelListHotels').find('.box-hotel-info')[0]).show()

    checkVersion()
    openSection()
    selectOptions()

    deleteService()
    addDeleteServices()

    // Checks if mobile or desktop version is being used and calls either functionability
    if (_isMobile) {
      mobileSetUp()
    }else {
      desktopSetUp()
    }
    closeAllSections()
    checkBoxVisibility()
    clickSection()
    modalCalls()

    selectPassenger()
  }

  // When section is clicked call according functions
  function clickSection () {
    addSpecialService()
    addExtraWeight()
    otherWeight()
    pet()
  }

  // Makes sure all sections are closed to be later opened
  function closeAllSections () {
    // Desktop
    $('#slideServiciosEspeciales').hide()
    $('#slideEquipajeExtra').hide()
    $('#slideDeportivoInstrumento').hide()
    $('#slideMascota').hide()
    $('#slideSeguroViaje').hide()
    $('#slideInterjetTierra').hide()
    $('#slideEstacionamiento').hide()
    $('#slideRentaAuto').hide()
    $('#slideapartarhotel').hide()
    $('.col-delete').hide()
    $('.link-delete-car').hide()
    $('.link-delete-parking').hide()

    // Mobile
    $('#slideServiciosEspecialesMobile').hide()
    $('#slideEquipajeExtraMobile').hide()
    $('#slideDeportivoInstrumentoMobile').hide()
    $('#slideMascotaMobile').hide()
    $('#slideSeguroViajeMobile').hide()
    $('#slideInterjetTierraMobile').hide()
    $('#slideEstacionamientoMobile').hide()
    $('#slideRentaAutoMobile').hide()
    $('#slideapartarhotelMobile').hide()
    $('.col-delete').hide()
  }

  // When   $selector  is clicked either   $target   or   $targetMobile   slides open depending of version
  function openSectionBindClick ($selector, $target, $targetMobile) {
    $('#' + $selector).click(function () {
      $('#' + $selector + 'Input').val() == 0 ? $('#' + $selector + 'Input').val(1) : $('#' + $selector + 'Input').val(0)
      if (_isMobile) {
        $('#' + $targetMobile).slideToggle('slow', function () {
          checkBoxVisibility()
        })
      }else {
        $('#' + $target).slideToggle('slow', function () {
          checkBoxVisibility()
        })
      }
    })
  }

  // After section slides up or down it adds or removes "open" classes for styles
  function checkBoxVisibility () {
    for (var i = 0; i < $('.complementaTuViajeWrp .ico-slider').length; i++) {
      if ($($('.complementaTuViajeWrp .ico-slider')[i]).closest('.container').find('.infoComplements').is(':visible')) {
        $($('.complementaTuViajeWrp .ico-slider')[i]).addClass('open')
        $($('.complementaTuViajeWrp .ico-slider')[i]).closest('.container').addClass('open-mobile')
      // open-mobile
      }else {
        $($('.complementaTuViajeWrp .ico-slider')[i]).removeClass('open')
        $($('.complementaTuViajeWrp .ico-slider')[i]).closest('.container').removeClass('open-mobile')
      }
    }
  }

  // Opening of sections gets called
  function openSection () {
    openSectionBindClick('sliderServiciosEsp', 'slideServiciosEspeciales', 'slideServiciosEspecialesMobile')
    openSectionBindClick('sliderEquipajeExtra', 'slideEquipajeExtra', 'slideEquipajeExtraMobile')
    openSectionBindClick('sliderDeportivoInstrumento', 'slideDeportivoInstrumento', 'slideDeportivoInstrumentoMobile')
    openSectionBindClick('sliderMascota', 'slideMascota', 'slideMascotaMobile')
    openSectionBindClick('sliderSeguroViaje', 'slideSeguroViaje', 'slideSeguroViajeMobile')
    openSectionBindClick('sliderInterjetTierra', 'slideInterjetTierra', 'slideInterjetTierraMobile')
    openSectionBindClick('sliderEstacionamiento', 'slideEstacionamiento', 'slideEstacionamientoMobile')
    openSectionBindClick('sliderRentaAuto', 'slideRentaAuto', 'slideRentaAutoMobile')
    openSectionBindClick('sliderapartarhotel', 'slideapartarhotel', 'slideapartarhotelMobile')
    openSectionBindClick('btn-table-mobile', 'table-mobile-info', 'table-mobile-info')
    $('.btn-table-mobile').on('click', function () {
      $('.table-mobile-info').slideToggle('slow', function () {
        if ($(this).is(':visible')) {
          $(this).parent().addClass('open')
        }else {
          $(this).parent().removeClass('open')
        }
      })
    })
  }
  // Modal alerts get called
  function modalCalls () {
    showModals('.cancel-policy', '#modalCancelPolicy')
    showModals('.link-more-pets', '#modalPets')
    showModals('.link-more-sport', '#modalSport')
    showModals('.link-more-seguro', '#modalSeguro')
    showModals('#hotel-parking-01', '#hotelParking-01')
    showModals('#hotel-parking-02', '#hotelParking-02')
    showModals('#mapMarriot', '#modalMarriot')
    showModals('#mapCaminoReal', '#modalCaminoReal')
    showModals('.link-more-info', '#modalParking')
    showModals('#terms-avis', '#modalAvis')
    showModals('#mapShuttle', '#modalInterjetTierra')
  }

  // When $linkClicked  is clicked $modalToShow is shown
  function showModals ($linkClicked , $modalToShow) {
    // Check if there's a checked checkbox and preserve state
    /*var boxes = $(linkClicked).parent().find('input')
    if( boxes.length > 0 )
    {
        for (var i = 0; i < boxes.length; i++) 
        {
            if($(boxes[i])[0].checked)
            {
                $(boxes[i])[0].checked = true
            }
        }
    }*/
    $($linkClicked).on('click', function (e) {
      $($modalToShow).modal('show')
    })
  }

  // if desktop version is being used, makes sure mobile items are hidden and desktop items are shown
  function desktopSetUp () {
    $('.hiddenMobile').show()
    $('.viewMobile').hide()
  }
  // if mobile version is being used, makes sure desktop items are hidden and mobile items are shown
  function mobileSetUp () {
    $('.hiddenMobile').hide()
    $('.viewMobile').show()
  }

  // Use this section to remove services
  function addDeleteServices () {
    $('.btn-add, .btn-primary').on('click', function (e) {
      $(this).closest('.modalComplements').modal('hide')
    })
    $('.link-delete-green, .eliminar-servicio-solicitado, .link-delete').on('click', function (e) {
      $('#modalDelete').modal('show')
    })
    $('.link-modify').on('click', function (e) {
      $('.col-delete').show()
    })
  }

  function selectOptions () {

    // When clicking outside of an input/menu or clicking a different one, this removes active styles and closes sections

    $(document).on('click', function (e) {
      $('.input-material').removeClass('active')
      $('.select-options').slideUp('slow')
      $('.btn-select').removeClass('open')
    })

    $('input, .btn-select, .option-complementos, .btn-select, .datepicker, .btn-num, input-material').on('click', function (e) {
      $('.input-material').removeClass('active')
      $('.select-options').slideUp('slow')
      $('.btn-select').removeClass('open')

      $(($(this).closest('.input-material'))[0]).addClass('active')
    })

    $('input[type=text]').on('click', function (e) {
      e.stopPropagation()
      $(this).addClass('active')
      $(this).closest('.input-material').addClass('active')
    })
    // When clicking a dropdown menu this adds active class and either closes or opens the menu
    $('.btn-select').on('click', function (e) {
      var btnOptions = $(this).parent().find('.select-options')
      $('.btn-select').removeClass('open')
      $(this).addClass('open')

      if (btnOptions.is(':visible')) {
        btnOptions.slideUp('slow')
        $(this).removeClass('open')
      }else {
        btnOptions.slideDown('slow')
      }
    })
    $('.option-complementos').on('click', function (e) {
      $('#loader').modal('show')
      var newOption = $(this).text()
      var newCost = 'Con X cargo'
      var newText = newOption + '<span class="option-cost">' + newCost + '</span>'
      $(this).closest('.select-complement').find('.option-active').html(newText)
      $(this).closest('.select-options').slideUp('slow')
    })
    // adds active class for styles to input selected
    $('.input-material').on('focus click', function (e) {
      $(this).addClass('active')
    })
    // when selecting an option inside a dropdown menu, changes the button's text to the option's, also adds price to Total
    $('.select-complement .btn-select').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      $('.select-options-list li').on('click', function (event) {
        event.stopPropagation()
        event.preventDefault()
        // gets the option's text

        var newText = $(this).text()
        var newParsedText = ''
        var cont = 0

        for (var i = 0; i < newText.split(' ').length; i++) {
          if (newText.split(' ')[i] != undefined) {
            if ((newText.split(' ')[i]).substring(0, 1) == '$') {
              cont++
            }
            if (cont < 1) {
              newParsedText += newText.split(' ')[i] + ' '
            }else if (cont == 1) {
              newParsedText += '<span class="option-cost">' + newText.split(' ')[i] + ' '
              cont++
            }else if (cont == 2) {
              newParsedText += ' ' + newText.split(' ')[i] + '</span>' + ' '
              cont++
            }else {
              newParsedText += newText.split(' ')[i] + ' '
            }
          }
        }
        if (newText.substring(0, 7) == '1 silla') {
          newParsedText = '<span class="option-active">1 silla de ruedas <span class="option-cost">Sin cargo extra</span></span>'
        }

        var newTotal = 0
        // changes button's text for option's
        $(this).closest('.select-complement').find('.option-active').html(newParsedText)
        $(this).closest('.select-complement').find('.select-options').slideUp('slow')
        var arrayOfBtns = $(this).closest('.infoComplements').find('.btn-select')

        // gets price valie from all enabled options buttons and adds them together
        for (var i = 0; i < arrayOfBtns.length; i++) {
          if (!$(arrayOfBtns[i]).is(':disabled')) {
            var arrayForPrice = $($(arrayOfBtns[i]).find('.option-active').text().replace(',', '').split(' '))
            for (var j = 1; j < arrayForPrice.length; j++) {
              if (arrayForPrice[j] != undefined) {
                if (!isNaN(parseInt(arrayForPrice[j].substring(1)))) {
                  newTotal = newTotal + parseInt(arrayForPrice[j].substring(1))
                }else {
                  newTotal = newTotal
                }
              }else {
              }
            }
          }
        }
        if (newTotal.toString().split('').length > 3) {
          var newParsedTotal = newTotal.toString().substring(0, 1) + ',' + newTotal.toString().substring(1)
        }else {
          var newParsedTotal = newTotal
        }

        // sets added price value as new text
        $(this).closest('.container').find('.comp-total').html('Total: <span> $' + newParsedTotal + ' MXN </span>')
      })
      // makes whole datepicker area clickable
      var datepickerFailsafe = $(this).find('.datepicker')
      if (datepickerFailsafe != undefined) {
        datepickerFailsafe.focus()
      }
    })
    // checks and unchecks Insurance
    $('.checkbox-label-secure').click(function (e) {
      if (isFirefox) {
        $('.newsquare').click()
      }
      $('#loader').modal('show')
      if (hassatls == 0) {
        __doPostBack('SellFee', 'INSURANCE_ATLS_0_0_PAY')
      }else {
        __doPostBack('CancelFee', 'INSURANCE_ATLS_0_0')
      }
    })
    $('.newsquare').click(function (e) {
      $(this).parent().find('input').focus()
      $('#loader').modal('show')
      if (hassatls == 0) {
        __doPostBack('SellFee', 'INSURANCE_ATLS_0_0')
      }else {
        __doPostBack('CancelFee', 'INSURANCE_ATLS_0_0')
      }
      if (isFirefox) {
        $('#checkboxsecure').click()
      }
    })
    // adds or removes value from Insurance when checkbox is clicked

    $('#checkboxsecure').click(function (e) {
      if ($('#checkboxsecure').is(':checked')) {
        // $(this).closest('.container').find('.comp-total').html('Total <span> $' + 89 + ' MXN </span>')
        return
      }else {
        // $(this).closest('.container').find('.comp-total').html('Total <span> $' + 0 + ' MXN </span>')
        return
      }
      return
    })

    var checkCont = 0
    $('#readTerms').on('click', function (e) {
      checkCont++

      if (isFirefox) {
        if (checkCont % 3 == 0) {
          if( ($(this).parent().find('input').prop('checked')) ) {
            ($(this).parent().find('input').prop('checked', true))
          }else {
            ($(this).parent().find('input').prop('checked', false))
          }
        }
      }else if (isIE || isIE11) {
        clearSelection()
        if (checkCont % 1 == 0) {
          if( ($(this).parent().find('input').prop('checked')) ) {
            ($(this).parent().find('input').prop('checked', true))
          }else {
            ($(this).parent().find('input').prop('checked', false))
          }
        }
      }else {
        if (checkCont % 2 == 0) {
          if( (!$(this).parent().find('input').prop('checked')) ) {
            ($(this).parent().find('input').prop('checked', true))
          }else {
            ($(this).parent().find('input').prop('checked', false))
          }
        }
      }
    })
    // changes between car model options
    /* $('.car-info').on('click', function (e) {
       $('.link-delete-car').hide()
       $('.car-info').removeClass('active')
       $(this).addClass('active')
       // link-delete-car
       $(this).find('.link-delete-car').show()
     })*/

    // changes between parking options
    $('.box-parking').on('click', function (e) {
      $('.link-delete-parking').hide()
      $('.box-parking').removeClass('active')
      $(this).addClass('active')
      $(this).find('.link-delete-parking').show()
    })
    // Calendar begins on Mondat rather than Sunday, calendar day names are contractions set here
    var firstDay = $('.datepicker').datepicker('option', 'firstDay')
    var dayNames = $('.datepicker').datepicker('option', 'dayNames')
    var dayNamesMin = $('.datepicker').datepicker('option', 'dayNamesMin')
    var dayNamesShort = $('.datepicker').datepicker('option', 'dayNamesShort')

    $('.datepicker').datepicker('option', 'firstDay', 1)
    $('.datepicker').datepicker('option', 'dayNames', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])
    $('.datepicker').datepicker('option', 'dayNamesMin', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])
    $('.datepicker').datepicker('option', 'dayNamesShort', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])

    $('.datepicker').datepicker({
      firstDay: 1,
      dayNames: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ],
      dayNamesMin: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ],
      dayNamesShort: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ]
    })
    $('#ui-datepicker-div').hide()

    // changes between car type options
    $('.menuSelectCar li').on('click' , function (e) {
      $('.menuSelectCar li').removeClass('active')
      $(this).addClass('active')
    })
    // allows change of hotel options
    $('.moreHotels').on('click', function (e) {
      $('.box-hotel-info').show()
    })
    $('.box-hotel-info').on('click', function (e) {
      $('.box-hotel-info').hide()
      $('.box-hotel-info').removeClass('active')
      $(this).show()
      $(this).addClass('active')
    })
    //  
    $('.input-material').on('click', function (e) {
      $(this).addClass('active')
    })
  }
  function activeOptionBox () {
    for (var i = 0; i < _arrayOfPassengers.length; i++) {
      if (!$(_arrayOfPassengers[i]).is(':checked')) {
        $(_arrayOfChoiceOne[i]).find('.btn-select').prop('disabled', true)
        $(_arrayOfChoiceTwo[i]).find('.btn-select').prop('disabled', true)
      }else {
        $(_arrayOfChoiceOne[i]).find('.btn-select').prop('disabled', false)
        $(_arrayOfChoiceTwo[i]).find('.btn-select').prop('disabled', false)
      }
    }
  }
  // Enables or disables passenger options depending of checkbox status
  function selectPassenger () {
    activeOptionBox()

    $('.checkbox-wrp').click(function (e) {
      e.preventDefault()
      e.stopPropagation()
      // console.log($(this))
      if ($(this).parent().find('#terms-avis')[0] === null || $(this).parent().find('#terms-avis')[0] === undefined) {
        var input = $(this).find('input')[0]
        $(input)[0].checked = !$(input)[0].checked
        activeOptionBox()
      // console.log('great1')
      }
    })

    $('.checkbox-label-service').click(function (e) {
      e.preventDefault()
      e.stopPropagation()
      // console.log($(this).parent().find('a')[0])
      if ($(this).parent().find('a')[0] === null || $(this).parent().find('a')[0] === undefined) {
        var input = $(this).parent().find('input')[0]
        //  console.log('clickCheck')
        $(input)[0].checked = !$(input)[0].checked
        activeOptionBox()
      // console.log('great3', $(this).attr('id'))
      }else {
        var input = $(this).parent().find('input')[0]
        // console.log('clickCheck')
        $(input)[0].checked = !$(input)[0].checked
        activeOptionBox()
      // console.log('great3', $(this).attr('id'))
      }
    })

    $('.square, .newsquare').click(function (e) {
      e.preventDefault()
      e.stopPropagation()
      var input = $(this).parent().find('input')[0]
      $(input)[0].checked = !$(input)[0].checked
      activeOptionBox()
    })
  }

  // Changes icon of selected service when called
  function iconDisplay ($serviceText) {
    var iconCode = 'nocost'
    if ($serviceText == 'instrumento') {
      iconCode = 'bags'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'bike'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'instrument'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'pet'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'secure'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'car'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'parking'
      return iconCode
    }else if ($serviceText == 'instrumento') {
      iconCode = 'hotel'
      return iconCode
    }else {
      return iconCode
    }
  }

  //
  function mobileArrowValidation ($arrowId, $checkboxId) {
    var checked = $('#' + $checkboxId)[0].checked

    if (_isMobile) {
      if (checked) {
        $('#' + $arrowId).hide()
      }else {
        $('#' + $arrowId).show()
      }
    }
  }

  // Lightbox from mobile is opened here
  function arrowStructure ($id, $modalToOpen, $this) {
    $($('#' + $id).find('.add-btn')).on(('change click'), function (e) {
      var pax = $(this).attr('pax')
      var agregarModificar = $(this).text()
      $($('#' + $id).find('.add-btn')).unbind('change')
      $('#' + $modalToOpen + pax).modal('show')

      $('.btn-secondary').click(function () {
        checkForCheckboxes($id, 'specialArrow', $(this).attr('id'))
      })
      // $(this).text('Modificar')
      $($('#' + $id).find('.add-btn')).bind('change')
    })
  }
  //
  function checkForCheckboxes ($idParent, $arrowAsigned, $checkboxId) {
    $('#' + $idParent).addClass('check-mobile')
  }

  // lightboxes are called here
  function addSpecialService () {
    arrowStructure('servicios-especiales-wrp', 'modalServices')
  }

  function addExtraWeight ($idCheckbox) {
    arrowStructure('equipaje-extra-wrp', 'modalExtraLug')
  }

  function otherWeight ($idCheckbox) {
    arrowStructure('deportivo-instrumento-wrp', 'modalSportMusic')
  }

  function pet ($idCheckbox) {
    arrowStructure('mascota-wrp', 'modalTravelPet')
  }

  // delestesServices
  function deleteService () {
    $(document).on('click', '.link-delete', function (e) {
      $(this).closest('.servicios-de-pasajero').remove()
    })
  }

  function clearSelection () {
    if (document.selection && document.selection.empty) {
      document.selection.empty()
    } else if (window.getSelection) {
      var sel = window.getSelection()
      sel.removeAllRanges()
    }
  }
})
// ////// Fin Seccion Extras  /////////
// ////// Inicio Seccion Payment  /////////
$(document).ready(function () {
  var _tabReference = null
  var _pastModal = null

  var page = document.location.href
  var n = page.toLowerCase().search('payment');

  if (n != -1) {
    var mobile = false
    var tabWrp = '#menuTabs'
    var desgloseWrp = '#infoTabs'
    var detailsMobile = '#returnAndDetail'
    var IntervaleSection1 = '#intervaleSinValidar'
    init()
  }

  // initializes all functions
  function init () {
    hideAll()

    
    $('#paybackAvailableAmount').hide()
    $('#payback-wrp').hide()
    $('.return-tabs').hide()
    $('#intervale-wrp').hide()
    $(detailsMobile).hide()
    $('#secondCardWrp').hide()

    showSection('desgloseTarjeta')
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) && $(window).width() < 991 || $(window).width() < 991) {
      $('#buttonsRow').hide()
      mobile = true
      mobileSetUp()
      $('#desgloseTarjeta').hide()
    }
    selectSucursal()
    checkWebVersion()

    inputClick()
    calendarDisplay()
    onResize()
  }
  // whenever browser window changes size, desktop or mobile version is used
  function onResize () {
    $(window).resize(function () {
      checkWebVersion()
    })

    $(window).on('orientationchange', function (event) {
      checkWebVersion()
    })
  }

  function isiPhone () {
    return (
      (navigator.platform.indexOf('iPhone') != -1) ||
      (navigator.platform.indexOf('iPod') != -1)
    )
  }

  // if mobile is being used or window is too small, mobile version is used
  function checkWebVersion () {
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad/i.test(navigator.userAgent) && $(window).width() < 991 || $(window).width() < 991) {
      mobile = true
      mobileSetUp()
    }else {
      mobile = false
      desktupSetUp()
      $(tabWrp).show()

      $('#paymentTitle').show()
      $('.return-tabs').hide()
      $(detailsMobile).hide()
      $('#purchaseDetails').show()
    }
  }

  // inputs are deselected and styles of active are removed when called
  function deselectInputs () {
    $('.input-material').removeClass('active')
    $('.select-options').slideUp('slow')
    $('.btn-select').removeClass('open')
    $('.detail-purchase').removeClass('open')
  }

  var disable_click_flag = false

  // re-parses numbers to "4's" format XXXX XXXX XXXX XXXX, used for credit cards
  function creditcardBreak ($string) {
    var parts = ''
    var splitStr = $string.split('')
    for (var i = 0; i < splitStr.length; i++) {
      if (i < 20) {
        if (splitStr[i] != ' ' && $.isNumeric(splitStr[i])) {
          if ((i - 3) % 5 == 0) {
            parts += (splitStr[i]).toString() + ' '
          }else {
            parts += (splitStr[i]).toString()
          }
        }
      }
    }

    return parts
  }

  // credit card inputs are reparsed to 4's

  $('.nu-de-tarjeta').on('focus', function (e) {
    var card = $(this).val().replace(/ /g, "");
    $(this).val(card)
  })
  $('.nu-de-tarjeta').on('change', function (e) {
    $(this).val(creditcardBreak($(this).val()))
    $(this).val(creditcardBreak($(this).val()))
    $(this).val($(this).val().substring(0, 19))
  })

  // inputs functionability when clicked
  function inputClick () {
    clickSection('#tarjetaTab', 'desgloseTarjeta', 'show', null)
    clickSection('#sucursalTab', 'desgloseSucursal', 'show', null)
    clickSection('#paypalTab', 'desglosePaypal', 'hide', null)
    clickSection('#visaTab', 'desgloseVisa', 'hide', null)
    clickSection('#masterpassTab', 'desgloseMasterpass', 'hide', null)
    clickSection('#intervaleTab', 'desgloseIntervale', 'show', null)
    clickSection('#paybackTab', 'desglosePayback', 'disable', null)
    clickSection('#ClubTab', 'desgloseClubInterjet', 'disable', null)

    modalAlerts('.link-interest' , '#modalBankCards')
    modalAlerts('#mapShuttle', '#modalInterjetTierra')
    modalAlerts('#link-terms-ref', '#modalPaymentRef')
    modalAlerts('.link-prices', '.modalPrices')
    modalAlerts('.links-rules', '#ReglasOptima')
    $('.has-tooltip').tooltip('disable')

    $('.input-material').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()

      $(this).find('input')[0].focus()
    })

    $('input[type=text], input[type=number]').on('click focus', function (e) {
      e.stopPropagation()
      e.preventDefault()

      deselectInputs()

      $(this).closest('.input-material').addClass('active')
    })
    // green buttons functionality
    $('.btn-primary').on('click', function (e) {
      // $('.btn-secondary').click()
    })

    $('.btn-confirm').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      // class incorrect adds red outline and X mark
      // class correct adds green outline and check mark
      $('#nu-tarjeta').addClass('incorrect')
      $('#nu-payback').addClass('correct')
    })

    $('.detail-purchase').on('click', function (e) {
      if ($('#purchaseDetails').hasClass('open')) {
        $('#purchaseDetails').removeClass('open')
        $('#purchaseDetails').slideUp('slow')
        $('.detail-purchase').removeClass('show')
      }else {
        $('#purchaseDetails').addClass('open')
        $('#purchaseDetails').slideDown('slow')
        $('.detail-purchase').addClass('show')
      }
    })

    $('.navbar-brand').on('click', function (e) {
      window.location.href = 'home.aspx'
    })

    /*$('.btn-validate').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()

      $('#nu-intervale').addClass('incorrect')
      $('#nu-tarjeta-int').addClass('correct')
      $('#titularTarjeta').addClass('incorrect')
      $(IntervaleSection1).hide()
      $('#intervaleValidado').show()
      $('#intervale-wrp').slideDown('slow')
    })

    $('#valid-paybck').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      $('#paybackValidate').hide()
      $('#paybackAvailableAmount').slideDown('slow')
    }) */

    $('.btn-delete').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      $('#nu-intervale').removeClass('correct')
      $('#intervaleValidado').hide()
      $(IntervaleSection1).show()
    })

    $('.btn-check').on('click', function (e) {
      $('#nu-payback').addClass('correct')
    })

    // calendar click
    $('.option-active').on('focus', function (e) {
      deselectInputs()

      $(this).parent().addClass('open')
      if ($(this).parent().hasClass('select-date')) {
        $(this).find('.datepicker').click()
      }
    })
    // dropdown click
    $('.select-generic').on('click', function (e) {
      $(this).find('.select-options').slideDown('down')

      e.stopPropagation()
      e.preventDefault()
      // if dropdown is already opened this closes it
      if ($($(this).find('.btn-select')[0]).hasClass('open')) {
        $('.input-material').removeClass('active')
        $('.btn-select').removeClass('open')
        for (var i = 0; i < $('.select-options').length; i++) {
          $($('.select-options')[i]).slideUp('slow')
        }
      }else {
        $('.input-material').removeClass('active')
        $('.btn-select').removeClass('open')

        $($(this).find('.btn-select')[0]).addClass('open')
        $('.detail-purchase').removeClass('open')
        // console.log($($(this).find('.btn-select')[0]).hasClass('open'))
        for (var i = 0; i < $('.select-options').length; i++) {
          // closes all dropdowns but the one clicked
          if ($('.select-options')[i] != $(this).find('.select-options')[0]) {
            $($('.select-options')[i]).slideUp('slow')
          }
        }

        $(this).find('.option-active').focus()
        $(this).find('.option-active').addClass('open')
      }
    })

    // dropdown option selected
    $('.option-item').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      var newOption = $(this).text()
      $(this).closest('.select-generic').find('.option-active').html(newOption)

      $($(this).closest('.select-generic').find('.btn-select')[0]).removeClass('open')
      $(this).closest('.select-options').slideUp('slow')
    })

    // Meses sin Interes *********************
    $('.select-MSI').on('click', function (e) {
      $(this).find('.select-options').slideDown('down')
      e.stopPropagation()
      e.preventDefault()
      // if dropdown is already opened this closes it
      if ($($(this).find('.btn-select')[0]).hasClass('open')) {
        $('.btn-select').removeClass('open')
        for (var i = 0; i < $('.select-options').length; i++) {
          $($('.select-options')[i]).slideUp('slow')
        }
      }else {
        $('.btn-select').removeClass('open')

        $($(this).find('.btn-select')[0]).addClass('open')

        for (var i = 0; i < $('.select-options').length; i++) {
          // closes all dropdowns but the one clicked
          if ($('.select-options')[i] != $(this).find('.select-options')[0]) {
            $($('.select-options')[i]).slideUp('slow')
          }
        }

        $(this).find('.option-active').focus()
        $(this).find('.option-active').addClass('open')
      }
    })

    $('.option-item-MSI').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      var newOption = $(this).text()
      $(this).closest('.select-MSI').find('.option-active').html(newOption)

      if ($("select[id$='INSTALLMENTS']")) {
        $("select[id$='INSTALLMENTS']").val($(this).attr('value'))
      }


      $($(this).closest('.select-MSI').find('.btn-select')[0]).removeClass('open')
      $(this).closest('.select-options').slideUp('slow')
    })
    // Meses sin Interes *********************

    $('.checkbox-wrp').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      checkboxClick('#checkpayback', $(this))
    })

    $('#paybackCheck').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      checkboxClick('#checkpayback', $(this).find('.checkbox-label')[0])
    })

    // when clicking outside of inputs this makes them all inactive
    $('body').on('click', function (e) {
      e.stopPropagation()
      e.preventDefault()
      deselectInputs()
    })

    /*$( '.link-delete-payback' ).bind( 'click', function(e){
        e.preventDefault()
        $('#modalDeletePayback').modal("show")
    } )*/

    //clickSecondCard()
  }

  function checkboxClick ($targetInput , $clickedThis) {
    // when clicking on a checkbox , checkbox is turned on or off               
    $($($clickedThis).parent().find($targetInput)).prop('checked', !$($($clickedThis).parent().find($targetInput)).prop('checked'))

    // Modal shows up
    if (!$($($clickedThis).parent().find($targetInput)).is(':checked')) {
      $('#modalDeletePayback').modal('show')
    }
  }

  // if desktop section is used, desktop functions are called
  function desktupSetUp () {
  
    $('.no-mobile').show()
	$('#AutenticationRequest_butt').addClass('btn-check1').removeClass('btn-validate');
    $('.mobile').hide()
  }
  // if mobile section is used, mobile functions are called
  function mobileSetUp () {
    $('.no-mobile').hide()
	 $('#AutenticationRequest_butt').addClass('btn-validate').removeClass('btn-check1');
    $('.mobile').show()
  }

  // when clicking a tab in desktop, that section gets shown and all others are hiden
  function clickSection ($Tab , $desglose, $payState, $alertDelete) {
    $($Tab).click(function () {

      //mover el contenedor de tarjeta en caso de que se necesite MAP
      if ($desglose == "desgloseTarjeta") {
        $("#desgloseTarjeta").append($("#CCForm"));
        PaymentForTwo = false;
      }

    
      if ($desglose == "desgloseClubInterjet") { 
        if (!$(".payback-amount").hasClass("hidden"))
        {
         $("#desgloseTarjeta").append($("#CCForm"));
        }
      }


      $('#paybackValidate').show()
      $('#buttonsRow').show()
      if (_tabReference != $desglose) {
        $('#' + _pastModal).modal('show')
      }
      _pastModal = $alertDelete
      _tabReference = $desglose

      $(this).parent().children().removeClass('tabActive')
      $(this).parent().children().addClass('tabInactive')
      $(this).addClass('tabActive')
      $(this).removeClass('tabInactive')

      showSection($desglose)
      payButtonManager($payState)

      $('#PaymentTab').val($desglose)

      // mobile:
      if (mobile) {
        $(tabWrp).hide()
        $(desgloseWrp).removeClass('hidden-mobile')
        $(detailsMobile).show()
        $('#purchaseDetails').hide()
        $('.mainSectionBottom').hide()
        $('#paymentTitle').hide()
      }
    })

    $('#bck-methods').on('click', function (e) {
      $('html, body').animate({scrollTop: 0}, 'fast')
      $('#buttonsRow').hide()
      $(tabWrp).show()
      $('#paymentTitle').show()
      $(desgloseWrp).addClass('hidden-mobile')
      $('.tab').removeClass('tabActive')
      $('.tab').addClass('tabInactive')
      $('.return-tabs').hide()
      $(detailsMobile).hide()
      $('.menuScheduleWrp').show()
      $('#purchaseDetails').show()
      $('.mainSectionBottom').show()
    })
  }

  function payButtonManager ($payState) {
    switch ($payState) {
      case 'show':
        $('#payBtn').show()
        $('#payBtn').prop('disabled', false)
        $('#payBtn').css('pointer-events', 'all')
        break
      case 'hide':
        $('#payBtn').hide()
        break
      case 'disable':
        $('#payBtn').show()
        $('#payBtn').prop('disabled', true)
        $('#payBtn').css('pointer-events', 'none')
        break
    }
  }

  // Hide all sections that are not visible from the start
  function hideAll () {
    $('#paybackAvailableAmount').hide()
    $('#payback-wrp').hide()
    $('#nu-payback').removeClass('correct')

    $('.desglosePago').hide()
    $('.desglosePagoEmpty').hide()
    $('#desgloseIntervale').hide()
    $('#desglosePaypal').hide()
    $('#desgloseSucursal').hide()
    $('#desgloseTarjeta').hide()
    $('.section-wrp').hide()
  }

  // when clicking on a given $linkClicked the modal $modalToOpen is shown
  function modalAlerts ($linkClicked, $modalToOpen) {
    $($linkClicked).on('click', function (e) {
      $($modalToOpen).modal('show')
      $(this).tooltip('hide')
    })
  }
  // hide all sections but the one selected
  function showSection ($sectionName) {
    hideAll()
    $('#' + $sectionName).show()
  }

  $(function () {
    $('.datepicker').datepicker()
  })


  function selectSucursal () {
    $('.sucursal').on('click', function (e) {
      if ($(this).hasClass('selected')) {
        $('.sucursal').removeClass('selected')
        $('[id$=TextBoxHoldPayment]').val('')
      }else {
        $('.sucursal').removeClass('selected')
        $(this).addClass('selected')
      }
    })
  }

  // Divide Payment functionality
  function clickSecondCard () {
    // Remove other wrapper functionallity
    $($('#dividePayment').find('.checkbox-wrp')).off('click')
    $('#dividePayment').on('click', function (e) {
      var checkbox = $(this).find('input')
      if (checkbox[0].checked) {
        $('#secondCardWrp').slideUp()
      }else {
        $('#secondCardWrp').slideDown()
      }
      $($(this).find('input')).prop('checked', !$(this).find('input').prop('checked'))
    })
  }

  // shows calendar and sets format for it
  function calendarDisplay () {
    $.datepicker.setDefaults({
      onSelect: function () {
        var oldValue = $(this).val()
        var newValue = ' ' + oldValue.substring(0, 2) + ' / ' + oldValue.substring(8, 10)
        $(this).val(newValue)
      // console.log("calendarClosed")
      // console.log($(this))
      }
    })

    $('.datepicker').datepicker('option', 'firstDay', 1)
    $('.datepicker').datepicker('option', 'maxDate', null)
    $('.datepicker').datepicker('option', 'dayNames', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])
    $('.datepicker').datepicker('option', 'dayNamesMin', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])
    $('.datepicker').datepicker('option', 'dayNamesShort', [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ])
    $('.datepicker').datepicker('option', 'monthNames', [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ])

    $('.datepicker').datepicker({
      firstDay: 1,
      dayNames: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ],
      dayNamesMin: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ],
      dayNamesShort: [ 'DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB' ],
      monthNames: [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
      maxDate: null,
      changeMonth: true,
      changeYear: true
    })
    $('#ui-datepicker-div').hide()
  }
})



// ////// Fin Seccion Payment  /////////
// ////// Inicio Seccion Resumen  /////////
$(document).ready(function () {
  $('.modal-optima').on('click', function (e) {
    $('#ReglasOptima').modal('show')
  })

  $('#terms-avis').on('click', function (e) {
    $('#modalAvis').modal('show')
  })
})
// ////// Fin Seccion Resumen  /////////
$(document).ready(function () {
  // Google Maps JS
  // Set Map

  var _sw = window.innerWidth ? window.innerWidth : $(window).width()

  function resize () {
    _sw = window.innerWidth ? window.innerWidth : $(window).width()
  }

  resize()
  $(window).bind('resize', function () {
    resize()
  })

  function initialize () {

    // Inicia mapa de Google
    // disableDefaultUI: se ocultan los features del mapa (zoom y controles)
    // CAMBIO 23/02/18 LP DESTINATIONS CMS
    var ladD = $('#coordinate').attr('lat')
    var logD = $('#coordinate').attr('log')
    var myLatlng = new google.maps.LatLng(logD , ladD)
    // var myLatlng = new google.maps.LatLng(21.1212853, -86.9893194)
    var imagePath = 'http://m.schuepfen.ch/icons/helveticons/black/60/Pin-location.png'
    var mapOptions = {
      zoom: 11,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions)
    // Callout Content
    var contentString = 'Some address here..'
    // Set window width + content
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500
    })

    // Add Marker
    /*var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: imagePath,
        title: 'image title'
    })

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker)
    });*/

    // Resize Function
    google.maps.event.addDomListener(window, 'resize', function () {
      var center = map.getCenter()
      google.maps.event.trigger(map, 'resize')
      map.setCenter(center)
    })
  }

  // se inicia función de carga de mapa
  if ($('.destination').get(0)) {
    setTimeout(function () {
      initialize()
    }, 1200)

  // console.log('google map')
  }

// Charts
/*var labels = ['Dom<br/>18', 'Lun<br/>18', 'Mar<br/>18', 'Mié<br/>18', 'Jue<br/>18', 'Vie<br/>18', 'Sáb<br/>18', 'Dom<br/>18']
var values = [900, 1200, 800, 900, 1000, 900, 800, 900]
var outputValues = ['$900<br/>USD', '$1,200<br/>USD', '$800<br/>USD', '$900<br/>USD', '$1,000<br/>USD', '$900<br/>USD', '$800<br/>USD', '$900<br/>USD']
var labelsMob = ['Dom<br/>18', 'Lun<br/>18', 'Mar<br/>18', 'Mié<br/>18', 'Jue<br/>18', 'Vie<br/>18', 'Sáb<br/>18', 'Dom<br/>18']
var valuesMob = [900, 1200, 800, 900, 1000, 900, 800]
// var width = $(window).width()
if (_sw < 768) {
  $('.chart-container').simpleChart({
    item: {
      label: labels, // string
      value: values, // integer
      outputValue: outputValues, // Optimized values: instead of 10240 bytes you can output 10kb if you provide the array
      color: ['#1b4298'],
      prefix: '',
      suffix: '',
      decimals: 2,
      height: null,
      render: {
        size: 'relative',
        //Relative - the height of the items is relative to the maximum value
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

  })
} else {
  $('.chart-container').simpleChart({
    item: {
      label: labels, // string
      value: values, // integer
      outputValue: outputValues, // Optimized values: instead of 10240 bytes you can output 10kb if you provide the array
      color: ['#1b4298'],
      prefix: '',
      suffix: '',
      decimals: 2,
      height: null,
      render: {
        size: 'relative',
        //Relative - the height of the items is relative to the maximum value
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
    //layout: {
     //width: '100%',
     //height: '300px'
     //}

  })
}*/
// $('.sc-item').eq(3).addClass('selected')
/*$('.sc-item').unbind('click')
.bind('mouseenter', function(e) {
    var tgt = $(this),
        day
    day = tgt.find('.sc-label').html().split('<br>')
    if (day[2]) {
        day = day[2].toLowerCase()
        $('h3 .week-day').text(day)
    }

    //console.log(tgt.find('.sc-label').text(), day)
})

var firstDay = $('.sc-item .sc-label').html().split('<br>')
firstDay = firstDay[2].toLowerCase()
$('h3 .week-day').text(firstDay)
 */
/*
 $('.play-favideo').unbind('click')
   .bind('click', function (e) {
     e.preventDefault()
     $('.modalvideodestination').modal('show')
       .find('.video-wrp').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BCAvTEgA6vM" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>')
   })
 $('.modal-content').on('click', function () {
   $('.modalvideodestination').modal('hide')
   $('.video-wrp').html(' ')
 })

 $('.videoWrp').unbind('click')
   .bind('click', function (e) {
     resize()
     if (_sw < 992) {
       e.preventDefault()
       $('.modalvideodestination').modal('show')
         .find('.video-wrp').html('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BCAvTEgA6vM" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>')
     }
   })*/
})
$(document).ready(function () {
  function checkBoxVisibility () {
    // console.log('checkBoxVisibility')

    $('.announcement-wrp .ico-slider').each(function () {
      var tgt = $(this)

      tgt
        .unbind('click')
        .bind('click', function (e) {
          e.preventDefault()
          // console.log(tgt, tgt.closest('.announcement-container').find('.announcement-info'))

          /*if( tgt.closest( '.announcement-container' ).find( '.announcement-info' ).hasClass('open') ){
            tgt.closest( '.announcement-container' ).find( '.announcement-info' ).removeClass( 'open' )
          } else {
            tgt.closest( '.announcement-container' ).find( '.announcement-info' ).addClass( 'open' )
          }*/
          if (tgt.hasClass('open')) {
            tgt.removeClass('open')
          } else {
            tgt.addClass('open')
          }
          tgt.closest('.announcement-container').find('.announcement-info').slideToggle('slow', function () {
            if ($(this).hasClass('active')) {
              $(this).removeClass('active')
            } else {
              $(this).addClass('active')
            }
          })
          /*if ( tgt.closest( '.announcement-container' ).find( '.announcement-info' ).is( ':visible' ) ) {
            tgt.addClass( 'open' )
            tgt.closest( '.announcement-container' ).addClass( 'open-mobile' )
            //open-mobile
          } else {
            tgt.removeClass( 'open' )
            tgt.closest( '.announcement-container' ).removeClass( 'open-mobile' )
          }*/

        })
    })

  /*{
  for(var i = 0; i < $('.ico-slider').length ; i++)
  {   

  if(  $($('.ico-slider')[i]).closest(".announcement-container").find(".announcement-info").is(":visible") )
  {
  $($('.ico-slider')[i]).addClass("open")
  $($('.ico-slider')[i]).closest(".announcement-container").addClass("open-mobile")
  //open-mobile
  }else
  {
  $($('.ico-slider')[i]).removeClass("open")
  $($('.ico-slider')[i]).closest(".announcement-container").removeClass("open-mobile")
  }

  }
  }*/
  }
  checkBoxVisibility()
})

/***UX scripts***/

function flipThis () {
  $('.mainflip').toggleClass('flipped')
}

$('.modallogin').on('hidden.bs.modal', function (e) {
  $('#loginflip').removeClass('flipped')
})

$('#clock-fix').countdown('2018/05/27 00:00').on('update.countdown', function (event) {
  var totalHours = event.offset.totalDays * 24 + event.offset.hours
  var $this = $(this).html(event.strftime('' + '<div clas="countDown"><p>' + totalHours + ' h</p></div>'))
})

/***Validaciones REGEX***/
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

    
//Only dates numbers /
    $('.isaDate').bind('keyup blur', function(event) {
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







/***END Validaciones REGEX***/

/**forzar fecha nativa + DATE**/


    /**forzar fecha nativa + DATE**/

//if ( $('.isDate')[0].type != 'date' ) $('.isDate').datepicker();

/*if (!Modernizr.inputtypes.date) {
    $('input.isDate').datepicker({
        dateFormat: 'dd/mm/yyyy',
        maxDate: 'today',
        minDate: 0,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        constrainInput: true
        
    });
}*/






/**END forzar fecha nativa**/





/***END UX scripts***/

// CAMBIO 20/06/18 LP DESTINATIONS CMS
/*destinations*/

function redirectionSelectDestinationDay (e, t, FlightType, SelectedDay, My) {
  $('select[id*="DropDownListSearchBy"]').val('columnView');
  if (FlightType == 'O') {
    $('input[id*="OneWay"]').attr('checked', true)
    $('input[id*="RoundTrip"]').attr('checked', false)
  }else {
    $('input[id*="RoundTrip"]').attr('checked', true)
    $('input[id*="OneWay"]').attr('checked', false)
  }

  var ExistItem = IsItemInDropDown(Number(SelectedDay), Number('0'))
  if (ExistItem) {
    $('select[id*="DropDownListMarketDay1"]').val(Number(SelectedDay))
  }else {
    $('select[id*="DropDownListMarketDay1"]').append(new Option('', Number(SelectedDay), true, true))
  }
  $('select[id*="DropDownListMarketMonth1"]').val(My)

  $('select[id*="originStation1"]').val(e)
  $('input[id*="TextBoxMarketOrigin1"]').val(e)
  $('select[id*="destinationStation1"]').val(t)
  $('input[id*="TextBoxMarketDestination1"]').val(t)

  $('input[id*="ButtonSubmit"]').first().click()
}

function redirectionSelectDestination (e, t, FlightType) {
  $('select[id*="DropDownListSearchBy"]').val('columnView');
  if (FlightType == 'O') {
    $('input[id*="OneWay"]').attr('checked', true)
    $('input[id*="RoundTrip"]').attr('checked', false)
  }else {
    $('input[id*="RoundTrip"]').attr('checked', true)
    $('input[id*="OneWay"]').attr('checked', false)
  }

  $('select[id*="originStation1"]').val(e)
  $('input[id*="TextBoxMarketOrigin1"]').val(e)
  $('select[id*="destinationStation1"]').val(t)
  $('input[id*="TextBoxMarketDestination1"]').val(t)

  $('input[id*="ButtonSubmit"]').first().click()
}

function IsItemInDropDown (ValueToCheck, marketIndex) {
  var IsExists = false

  if (marketIndex == 0) {
    $('select[id*="DropDownListMarketDay1"] option').each(function () {
      if (Number(this.value) == ValueToCheck)
        IsExists = true
      return IsExists
    })
  }else {
    $('select[id*="DropDownListMarketDay2"] option').each(function () {
      if (Number(this.value) == ValueToCheck)
        IsExists = true
      return IsExists
    })
  }
}

/*destinations*/
