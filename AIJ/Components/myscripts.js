
    $('input:radio[name="contactbuyer"]').change(function() {
        $('input:radio[name="contactbuyer"]', this).prop("checked", true);
        $(".contact-data").slideUp(function() {
            $('input:checkbox[name="chkallpassengers"]', this).prop("checked", false);

        });
        $(this).closest('.passenger').find('.contact-data').slideDown();
    });


    $.validator.addMethod(
    "mxnDate",
    function(value, element) {
        // put your own logic here, this is just a (crappy) example
        return value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/);
    },
    "Please enter a date in the format dd/mm/yyyy."
);


//Check if input value exists in declared array

var invalidkeyreservation = ['ABCDEF','GHIJKM','LMNOPQ'];


        if (invalidkeyreservation.indexOf($("input.reservationkey").val()) > -1){

        }



//All fileds are filled

var $input = $('#ticketRecovery input:text'),
                $button = $('#findPromo');
            $button.attr('disabled', true);

            $input.keyup(function() {
                var trigger = false;
                $input.each(function() {
                    if (!$(this).val()) {
                        trigger = true;
                    }
                });
                trigger ? $button.attr('disabled', true) : $button.removeAttr('disabled');
            });



        //Fields valid with jqueryvalidate
         $('#ticketRecovery input').on('blur keyup', function() {
        if ($("#ticketRecovery").valid()) {
            $('#findPromo').attr('disabled', false);

        } else {
            $('#findPromo').attr('disabled', true);

        }
    });




$('#checkout-03-passengers').each(function() {  

    $(this).validate({        
        rules: {
				passengername: {
					required: true,
					minlength: 3
				},
				passengerlastname: {
					required: true,
					minlength: 3
				},
				cname: {
					required: true,
					minlength: 3,
				},
				cphone: {
					required: true,
					minlength: 8
				},
				contactbuyer: {
					required: true
				},
				passengerbirthday: {
					required: true
				},
				genderop: {
					required: true
				}

			},
			messages: {
				passengername: {
					required: "Por favor introduce tu(s) nombre(s) tal cual aparece en tu documento oficial de indentidad.",
					minlength: "Este campo debe tener mas de 3 caracteres."
				},
				passengerlastname: {
					required: "Por favor introduce tu(s) apellidos(s) tal cual aparece en tu documento oficial de indentidad.",
					minlength: "Este campo debe tener mas de 3 caracteres."
				},
				cname: {
					required: "Por favor introduce tu nombre completo",
					minlength: "Este campo debe tener mas de 3 caracteres."
				},
				cphone: {
					required: "Por favor introduce un número de telefono",
					minlength: "Este campo debe tener mínimo 8 números."
				},
				contactbuyer: "Por favor selecciona la persona que será el contacto de compra.",
				passengerbirthday: {
					required: "Por favor introduce la fecha de nacimiento.",
				},
				genderop: {
					required: "Por favor selecciona una opción."
				}
			}
		});
    });





//VALIDATE IF ONLY HAS 1 DESTINATION

('.trip-detination').each(function(){
	if ($(this).find(".list-group.trip-grid-view > div").length === 1) {
     $(this).closest('.trip-detination').find('.travel.item').addClass('single-element-list');
   } 

});



/**Array validate**/


var codes = ["CA238", "AIJ998", "POS0DJ"];
var codeVal = $('#OpenCode').val();

$('#verifyCode').click(function(c) {

  var index = $.inArray(codeVal, codes);

    if (index != '-1') {

      
      console.log(codeVal+" it_s valid" + jQuery.inArray());

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(s) {
            $('#SuccessBenefit').modal('show');

        });
        //return true;

    } else if (index == '-1') {

      console.log(codeVal+" it_s invalid" + jQuery.inArray());


        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(e) {
            $('#ErrorBenefit').modal('show');

            //return false;
        });

     
    }

    else{
        console.log(codeVal+" it_s valid" + jQuery.inArray());

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(s) {
            $('#SuccessBenefit').modal('show');

        });
        //return true;

    }


    c.preventDefault();
});




var codes = ["CA238", "AIJ998", "POS0DJ"];

$('#verifyCode').click(function(c) {
    var codeVal = $('#OpenCode').val();

    if ($.inArray(codeVal, codes) != '-1') {

       console.log(codeVal + " it_s valid" + jQuery.inArray());

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(s) {
            $('#SuccessBenefit').modal('show');

        });

    } else if ($.inArray(codeVal, codes) == '-1') {

      console.log(codeVal + " it_s invalid" + jQuery.inArray());

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(e) {
            $('#ErrorBenefit').modal('show');
        });

     
    }

    else{

    }
    c.preventDefault();
});



