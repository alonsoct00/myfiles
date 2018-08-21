$().ready(function() {

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    var form = document.forms[form];


    //Mensajes default
    /*jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es requerido.",
        remote: "Este campo es requerido.",
        email: "Introduce una dirección de e-mail válida.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Introduce un número válido.",
        digits: "Sólo números es permitdo.",
        creditcard: "Introduce un número de tarjeta válido.",
        equalTo: "Introduce el mismo valor nuevamente.",
        accept: "Please enter a value with a valid extension.",
        maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
        minlength: jQuery.validator.format("Please enter at least {0} characters."),
        rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
        range: jQuery.validator.format("Please enter a value between {0} and {1}."),
        max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
        min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
    });*/

    //Adding REGEX validator

    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Por favor verifica el patrón introducido"
    );



     //$("#Textbox").rules("add", { regex: "^[a-zA-Z'.\\s]{1,40}$" })



    //Adding dates range validator

    jQuery.validator.addMethod("greaterThan",
        function(value, element, params) {

            if (!/Invalid|NaN/.test(new Date(value))) {
                return new Date(value) > new Date($(params).val());
            }

            return isNaN(value) && isNaN($(params).val()) || (Number(value) > Number($(params).val()));
        }, 'Must be greater than {0}.');

                /*$("form").validate({
                rules: {
                    EndDate: { greaterThan: "#StartDate" }
                }
                });*/



   





    //-----------------------Validacion formularios de pasajeros-----------

    $('#checkout-03-passengers').validate({});




    function parseDMY(value) {
        var date = value.split("/");
        var d = parseInt(date[0], 10),
            m = parseInt(date[1], 10),
            y = parseInt(date[2], 10);
        return new Date(y, m - 1, d);
    }



    $("[name^=passengername]").each(function() {
        $(this).rules("add", {
            required: true,
            minlength: 3,
            messages: {
                required: "Por favor introduce lo(s) nombre(s) tal cual aparecen en el documento oficial de indentidad.",
                minlength: "Este campo debe tener mas de 3 caracteres."
            }
        });
    });

    $("[name^=passengerlastname]").each(function() {
        $(this).rules("add", {
            required: true,
            minlength: 3,
            messages: {
                required: "Por favor introduce los apellidos tal cual aparecen en el documento oficial de indentidad.",
                minlength: "Este campo debe tener mas de 3 caracteres."
            }
        });
    });

    $("[name^=genderop]").each(function() {
        $(this).rules("add", {
            required: true,
            messages: {
                required: "Por favor selecciona una opción."
            }
        });
    });

    $("[name^=passengerbirthday]").each(function() {
        $(this).rules("add", {
            required: true,
            date: true,
            messages: {
                required: "Por favor introduce la fecha de nacimiento."
            }
        });
    });



    $("[name^=contactbuyer]").each(function() {
        $(this).rules("add", {
            required: true,
            messages: {
                required: "Por favor selecciona al contacto de compra."
            }
        });
    });


    $("[name^=cname]").each(function() {
        $(this).rules("add", {
            required: true,
            minlength: 3,
            messages: {
                required: "Por favor introduce el nombre completo",
                minlength: "Este campo debe tener mas de 3 caracteres."
            }
        });
    });

    $("[name^=cphone]").each(function() {
        $(this).rules("add", {
            required: true,
            minlength: 8,
            messages: {
                required: "Por favor introduce un número de telefono",
                minlength: "Este campo debe tener mínimo 8 números."
            }
        });
    });


    //----------------Fin Validacion formularios de pasajeros--->




    //-----------------------Validacion formularios de pago-----------



    //----------------Fin Validacion formularios de pago--->



    //Prevent cut & paste--->


    $('#password, #email,#confirm_password').on('copy paste cut', function(e) {
        e.preventDefault();
    });



    //-----------------------Validacion formularios CI CUSTOM MSGS-----------//




    //Agregar vuelo

    $.validator.addMethod('reservationkey', function(value) {
        return /^[a-zA-Z][a-zA-Z0-9]{4}[a-zA-Z]$/.test(value);
    }, 'Verifica tu clave de reservación.');

    $("#addtheFlight").validate({
        rules: {

            flighDate: {
                required: true
            },

            reservationkey: {
                required: true,
                minlength: 6
            }
        }
    });


    //Tarjetas


    //Contraseña
    $("#UpdatePassword").validate({
        rules: {

            old_password: {
                required: true,
                minlength: 6
            },

            new_password: {
                required: true,
                minlength: 6

            },
            confirm_new_password: {
                required: true,
                minlength: 6,
                equalTo: "#new_password"
            }
        }
        /*,
                messages: {
                    old_password: {
                        required: "Por favor introduce tu último password",
                        minlength: "Tu password debe ser de mas de 6 carácteres alfanuméricos"
                    },

                    new_password: {
                        required: "Por favor introduce tu nuevo password",
                        minlength: "Tu password debe ser de mas de 6 carácteres alfanuméricos"
                    },
                    confirm_new_password: {
                        required: "Por favor introduce de tu nuevo password ot",
                        minlength: "Tu password debe ser de mas de 6 carácteres alfanuméricos",
                        equalTo: "Tu password no coincide con el anterior"
                    }
                }*/
    });



    $('#registerUser').validate({
        rules: {

            regpassword: {
                required: true,
                minlength: 6
            },

            regconfirmpassword: {
                required: true,
                minlength: 6,
                equalTo: "#mypassword"
            } 
        }
    });

   


//Validaciones generales

    $('#newsletter-info').validate();

    $('#TransferData').validate();

    $('#SpecialServices').validate();

    $('.NewCreditCard').validate();

    $('#ticketRecovery').validate();

    $('#changeMyFlight').validate();

     $('#mailbox_interjet').validate();












    //----------------Fin Validacion formularios CI--->




});
