

$(document).ready(function() {



    /***login flip**/


    $('#forgotPass').on('click', function() {
        $('.mainflip').addClass('flipped');
        $('#resetpswd').prop("disabled", false);
        $('#forgetpass,#resetpswd,.form-resetpsswd > .input-wrp,#BackBtn').show();
        $('.forgot-msg,#btnContinPsswd').hide();
    });

    $('#BackBtn').on('click', function() {
        $('.mainflip').removeClass('flipped');
    });




    $('#resetpswd').on('click', function(c) {
        $(this).hide();
        $('#forgetpass,.form-resetpsswd > .input-wrp,#BackBtn').hide();
        $('.forgot-msg,#btnContinPsswd').show(200);

        c.preventDefault();
    });




    /***Tables Data Tables functions**/
    /*Documentation: https://datatables.net/reference/option/ and https://datatables.net/manual/*/

    var tablaPasajeros = $('#PassengersTable');
    $(tablaPasajeros).DataTable({
        language: {
            //Cambiar según cultura
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            //"url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/English.json"
        },
        "pageLength": 10,
        "responsive": false,
        "searching": true,
        "info": false,
        "paging": true,
        "lengthChange": false,
        "dom": '<"no-padding tableSearch"f>rt<"col-12 footTable no-padding"i<"row"<"col-lg-5 col-sm-12 controlBtns"B><"col-lg-7 col-sm-12 tablePag"p>>>',
        "fnDrawCallback": function() {
            if (Math.ceil((this.fnSettings().fnRecordsDisplay()) / this.fnSettings()._iDisplayLength) > 1) {
                $('.dataTables_paginate').css("display", "block");
                $('.dataTables_length').css("display", "block");
            } else {
                $('.dataTables_paginate').css("display", "none");
                $('.dataTables_length').css("display", "none");
            }
        },
        "select": {
            style: 'multi',
            selector: 'td:first-child',
            blurable: true
        },
        "order": [
            [2, "desc"]
        ],
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        buttons: [{}]
    });


    var tablaVuelos = $('#FlightsTable');
    $(tablaVuelos).DataTable({
        language: {
            //Cambiar según cultura
            "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
            //"url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/English.json"
        },
        "pageLength": 10,
        "responsive": false,
        "searching": true,
        "info": false,
        "paging": true,
        "lengthChange": false,
        "dom": '<"no-padding tableSearch"f>rt<"col-12 footTable no-padding"i<"row"<"col-lg-5 col-sm-12 controlBtns"B><"col-lg-7 col-sm-12 tablePag"p>>>',
        "fnDrawCallback": function() {
            if (Math.ceil((this.fnSettings().fnRecordsDisplay()) / this.fnSettings()._iDisplayLength) > 1) {
                $('.dataTables_paginate').css("display", "block");
                $('.dataTables_length').css("display", "block");
            } else {
                $('.dataTables_paginate').css("display", "none");
                $('.dataTables_length').css("display", "none");
            }
        },
        "select": {
            style: 'single',
            blurable: true
        },
        "order": [
            [0, "desc"]
        ],
        buttons: [{}]
    });





    /**Single or Multielements**/


    $('.panelContainer').each(function() {
        var thispanel = $(this);
        var numOfChildren = thispanel.children().length;
        //alert(ne);
        if (numOfChildren <= 1) {
            thispanel.addClass('singleElement');
        } else {
            thispanel.addClass('multiElement');
        }
    });






});

/**Flip function call*/
function flipThis() {
    $('.mainflip').toggleClass('flipped');
}




/**modal behavior timeout on locked padlock click**/

setTimeout(function() {
    $('.IndemityBenefit.disabled > .indemBenfit.disabled').children('button.disabled').click(function(f) {

        f.preventDefault();


        if ($(this).hasClass("disabled")) {

            $('#allowBenefit').modal('show');
            $(this).parent().addClass("activeBenefit").siblings().removeClass("activeBenefit");

        } else {}


    });
}, 800);


/**Disallow modal close with keyboard or outside click**/

$('#allowBenefit,#SuccessBenefit').modal({
    backdrop: 'static',
    keyboard: false,
    show: false 
});




/**Array to validate input with "autorized" Codes wirh inArray function**/




var codes = ["CA238", "AIJ998", "POS0DJ"];

$('#verifyCode').click(function(c) {
    var codeVal = $('#OpenCode').val();

    if ($.inArray(codeVal, codes) === 0) {

       console.log(codeVal + " it_s valid" + " return: " + $.inArray(codeVal, codes));

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(s) {
            $('#SuccessBenefit').modal('show');

        });

        return true;

    } else if ($.inArray(codeVal, codes) === -1) {

      console.log(codeVal + " it_s invalid" + " return: " + $.inArray(codeVal, codes));

        $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(e) {
            $('#ErrorBenefit').modal('show');
        });


        return false;

     
    } else if ($.inArray(codeVal, codes) !== -1){

      $('#allowBenefit').modal('hide').on('hidden.bs.modal', function(s) {
            $('#SuccessBenefit').modal('show');

        });
      console.log(codeVal + " return: " + $.inArray(codeVal, codes));

       return true;


    }


    else{


       console.log(codeVal + "return:" + $.inArray(codeVal, codes));


    } 

    
    c.preventDefault();
});



$(function() {
    $('#OpenCode').keyup(function() {
        this.value = this.value.toLocaleUpperCase();
    });
});




  /* $('#ErrorBenefit').modal('hide').on('hidden.bs.modal', function(e) {
            $('#SuccessBenefit,#allowBenefit').modal('hide');
    });*/


$('#CloseModal').click(function() {
  $('#SuccessBenefit,#ErrorBenefit,#allowBenefit').modal('hide');
});


/**Remove disabled classes when the validate is successful**/

$('#SuccessBenefit').modal('hide').on('hidden.bs.modal', function(h) {
    $('.indemBenfit.activeBenefit > button.btn.dropdown-toggle, .indemBenfit.activeBenefit, .IndemityBenefit').removeClass('disabled');
    $('.indemBenfit.activeBenefit > button.btn.dropdown-toggle').attr("aria-disabled", "false");
    $('.indemBenfit.activeBenefit > select').prop("disabled", false);


});