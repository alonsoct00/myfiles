$(document).ready(function(){
	   
    var Regional = "es";

    if(carRentAvis.CultureCode != undefined){
        if(carRentAvis.CultureCode.indexOf("es-") !== -1) Regional = "es";        
        if(carRentAvis.CultureCode.indexOf("en-") !== -1) Regional = "en";                       
    }
   
		var DeliveryDateParts = carRentAvis.MinDate.split(' ');
		var ReturnDateParts= carRentAvis.MaxDate.split(' ');

		var BDValues0 =  DeliveryDateParts[0].split('-');
		var BTValues0 =  DeliveryDateParts[1].split(':');
		
		var EDValues1 =  ReturnDateParts[0].split('-');		
		var ETValues1 =  ReturnDateParts[1].split(':');
		 
		 
		 var MinDate = new Date(Number(BDValues0[0]), Number(BDValues0[1])-1, Number(BDValues0[2]), Number(BTValues0[0]), Number(BTValues0[1]))
		 var MaxDate = new Date(Number(EDValues1[0]), Number(EDValues1[1])-1, Number(EDValues1[2]), Number(ETValues1[0]), Number(ETValues1[1]))
		 
		$.datepicker.setDefaults($.datepicker.regional[Regional])	   

    	$('input[id*="TextBoxDeliveryCarDate"]').datepicker({
			showOn: "both",
			buttonImageOnly: true,
			buttonImage: "../../assetsV2/img/ico_view_cal.svg",
			dateFormat: 'yy-mm-dd',			
			minDate: MinDate,
			maxDate: MaxDate,			
			onSelect: function(dateText){	
				
				updateDateValues(dateText,$('select[id*="DropDownDeliveryTime"]').val(),'TextBoxDeliveryCarDate');	
			}   
		});


    	$('input[id*="TextBoxReturnCarDate"]').datepicker({
			showOn: "both",
			buttonImageOnly: true,
			buttonImage: "../../assetsV2/img/ico_view_cal.svg",
			dateFormat: 'yy-mm-dd',
			minDate: MinDate,
			maxDate: MaxDate,
			onSelect: function(dateText){	
			updateDateValues(dateText,$('select[id*="DropDownReturnTime"]').val(),'TextBoxReturnCarDate');	
			}   
		});
	
		$('select[id*="DropDownDeliveryTime"]').change(function(){			
			updateDateValues($('input[id*="TextBoxDeliveryCarDate"]').val(),$(this).val(),'TextBoxDeliveryCarDate');
		})
		
		$('select[id*="DropDownReturnTime"]').change(function(){			
			updateDateValues($('input[id*="TextBoxReturnCarDate"]').val(),$(this).val(),'TextBoxReturnCarDate');
		})
	
	
	selectCar()
	
	$("#DeliveryCarSubmit, #sliderRentaAuto").click(function(){ 
		ReturnCarSubmit();
	});
	
	$("#DeliveryCarSubmit, #ReturnCarSubmit").click(function(){
				
	    var DeliveryCarDate = $('input[id*="TextBoxDeliveryCarDate"]').val()		
		var DeliveryCarTime = $('select[id*="DropDownDeliveryTime"]').val()		
		
		var ReturnCarDate = $('input[id*="TextBoxReturnCarDate"]').val()
		var ReturnCarTime = $('select[id*="DropDownReturnTime"]').val()	
		
		$.ajax({
			type: "POST",
			url: 'NewCarAvailabilityAjax.aspx',
			data: {Action: "UPDATECAR",DeliveryCarDate: DeliveryCarDate, DeliveryCarTime: DeliveryCarTime, ReturnCarDate: ReturnCarDate, ReturnCarTime:ReturnCarTime},
			beforeSend: function () {
                        $("#carAvailability").html('<div class="padd-all-15">  <div class="text-center">'+$('input[id*="hidden_cargando"]').val()+'</div> <div class="row"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div></div></div></div>');						
                },			
			 success: function(data) {				
				if(data.search('to be turned off')>0)
				{
					window.location.href='NewExtras.aspx';
				}
				else
				{				
					$('input[id*="TextBoxSelectedGroupId"]').val('')			
					$("#carAvailability").html(data);
					$('body').css('overflow-y','scroll');
					selectCar();
				}			
			}
		});
		
	});
	
	
});
var change = false;

updateDateValues = function(dateText,timeText, elementId){
	
	var auxDate = new Date(dateText);
	var DayNumber = auxDate.getDay();		
	var DayName = '';	
	
	switch(DayNumber) {				
			case 0:DayName = 'Monday';break;
			case 1:DayName = 'Tuesday';break;
			case 2:DayName = 'Wednesday';break;
			case 3:DayName = 'Thursday';break;
			case 4:DayName = 'Friday';break;				
			case 5:DayName = 'Saturday';break;
			case 6:DayName = 'Sunday';break;
		}
		
	ChangeDay(DayName, dateText, timeText, elementId)
	
	var dropdownToPopulate = $('input[id*="'+elementId+'"]').closest('.inputdate').find('.time-select');
	dropdownToPopulate.find('option').remove().end();
	
	$.each($.parseJSON(carRentAvis.Schedules)[DayName], function(i, item) {
			dropdownToPopulate.append($("<option></option>").attr("value",item).text(item));			
		}				
	)	
	
	$(elementId).val(dateText.toString());	
	
}

ChangeDay = function(DayName, dateText, timeText,  elementId){
	var auxDate = new Date(dateText);
	var NameDay = '';
	var MonthNumber = auxDate.getMonth();
	var MonthName = '';
	switch(DayName) {				
		case 'Monday':DayName = 'Lunes';break;
		case 'Tuesday':DayName = 'Martes';break;
		case 'Wednesday':DayName = 'Miercoles';break;
		case 'Thursday':DayName = 'Jueves';break;
		case 'Friday':DayName = 'Viernes' ;break;				
		case 'Saturday':DayName = 'Sabado';break;
		case 'Sunday':DayName = 'Domingo';break;
	}
	
	ChangeMonth(DayName, dateText, timeText,  elementId)
}

ChangeMonth = function(DayName, dateText,timeText,  elementId){
	

	
	var auxDate = new Date(dateText);
	var YearDate = auxDate.getFullYear();
	var DayNum = auxDate.getDate() + 1;
	var NumDay = ""+ DayNum + "";
	var MonthNumber = auxDate.getMonth() + 1;
	var NumMon = "" + MonthNumber + "";
	var MonthName = '';
	var hDeliveryDate = '';
	
	switch(NumMon) {				
		case "1":MonthName = 'Enero';break;		case "7":MonthName = 'Julio';break;
		case "2":MonthName = 'Febrero';break;	case "8":MonthName = 'Agosto';break;
		case "3":MonthName = 'Marzo';break;		case "9":MonthName = 'Septiembre';break;
		case "4":MonthName = 'Abril';break;		case "10":MonthName = 'Octubre';break;
		case "5":MonthName = 'Mayo';break;		case "11":MonthName = 'Noviembre';break;
		case "6":MonthName = 'Junio';break;		case "12":MonthName = 'Diciembre';break;
	}
	
			
	var drpHours = ($("#ControlGroupNewExtras_CarRentControl_NewCarAvailabilitySearchView_DropDownReturnTime").val()).replace("p.m.","")
		// alert(drpHours);
	var changeHours = drpHours.replace("a.m.","");	
	var DateFinal=''; 
	var deliveryMonth= NumMon.length; 
	var deliveryDay= NumDay.length;
					
		
	if (deliveryMonth < 2 ){deliveryMonth = "0" + NumMon;}
	if (deliveryDay < 2){deliveryDay = "0" + deliveryDay;} else {deliveryDay=NumDay}
	
	
	if (elementId == 'TextBoxDeliveryCarDate'){	
		$("#DeliveryCar").html(DayName + ", " + DayNum + " " + MonthName + " " + YearDate + " " + timeText );		
		DateFinal = "" + YearDate + "-" + NumMon + "-" + deliveryDay + " " + changeHours + "";
		hDeliveryDate = carRentAvis.DeliveryCarDate;
	}else{		
		$("#ReturnCarDate").html(DayName + ", " + DayNum + " " + MonthName + " " + YearDate + " " + timeText );		
		DateFinal =""+ YearDate + "-" + deliveryMonth + "-" + deliveryDay + " " + changeHours + "";
		hDeliveryDate = carRentAvis.ReturnCarDate;
	}
	
	if(DateFinal!='' && hDeliveryDate!=''){
		var differenceTime = getDifference (DateFinal, hDeliveryDate);
		$('input[id*="TextBoxSelectedTotalDays"]').val(differenceTime.Days);
		$('input[id*="TextBoxSelectedTotalHours"]').val(differenceTime.Hours);
	}
	sessionStorage.setItem("DiffDays","OnChangeDiff");
	//$("#SelectedTotalDays").html(Math.abs(differenceTime.Days));
	//$("#SelectedTotalHours").html(Math.abs(differenceTime.Hours));	
}

ReturnCarSubmit = function(){	
	    var DeliveryCarDate = $('input[id*="TextBoxDeliveryCarDate"]').val()		
		var DeliveryCarTime = $('select[id*="DropDownDeliveryTime"]').val()			
		var ReturnCarDate = $('input[id*="TextBoxReturnCarDate"]').val()
		var ReturnCarTime = $('select[id*="DropDownReturnTime"]').val()			
		$.ajax({
			type: "POST",
			url: 'NewCarAvailabilityAjax.aspx',
			data: {Action: "SELECTCAR",DeliveryCarDate: DeliveryCarDate, DeliveryCarTime: DeliveryCarTime, ReturnCarDate: ReturnCarDate, ReturnCarTime:ReturnCarTime},
			beforeSend: function () {
                        $("#carAvailability").html('<div class="padd-all-15">  <div class="text-center">'+$('input[id*="hidden_cargando"]').val()+'</div> <div class="row"> <div class="spinner"> <div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div></div></div></div>');						
                },			
			 success: function(data) {				
				if(data.search('to be turned off')>0)
				{
					window.location.href='NewExtras.aspx';
				}
				else
				{				
					$('input[id*="TextBoxSelectedGroupId"]').val('')			
					$("#carAvailability").html(data);
					$('body').css('overflow-y','scroll');
					selectCar();
				}			
			}
		});
}

	
selectCar = function(){	

	// $(".select-car").click(function() {
		
		
	 // $('.link-delete-car').on('click', function (e) {
		 // alert("Entro A Eliminar");
	  // $('.link-delete-car').hide()
      // $('.car-info').removeClass('active')
	
		// $('#dialog_loading').modal({backdrop: 'static', keyboard: false});
		// $('.modal-backdrop').appendTo('#mainContent');

		// $.ajax({
			// type: "POST",
			// url: 'NewCarDeleteAjax.aspx',
			// data: {Action: "DELETE"},
			// beforeSend: function () {
                        // $("#product-chooser-item").html('<div class="padd-all-15">  <div class="text-center">Buscando lista de autos. Espere un momento por favor...</div>  <div class="progress">    <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width:100%">      <span class="sr-only"></span>    </div>  </div></div>');						
                // },
			// success: function(data) {				
				// if(data.search('to be turned off')>0)
				// {
					// window.location.href='NewExtras.aspx';
				// }
				// else
				// {		
					// alert("Se Elimino Correctamente");
					// e.preventDefault();
					
					// $("#product-chooser-item").html(data);
					// $('#dialog_loading').hide(); 
					// $('.modal-backdrop').hide();
					// $('body').css('overflow-y','scroll');	
					// $("#DeleteCarSubmit").hide();
				// }		
			// }
		// });
	
		// });
		
    $('.car-info').on('click', function (e) {
		 // $("input[id*='ButtonSubmitAvis']").attr("disabled", false);
		$("#lblvalidation").html('');
		
		$("input[id*='readTerms']").prop('checked', false);
		
		// $('.checkbox').removeAttr('checked');
	
	
      $('.link-delete-car').hide()
      $('.car-info').removeClass('active')
      $(this).addClass('active')
      // link-delete-car
      $(this).find('.link-delete-car').show()
    // })

		
		$(".car-info").each(function(index) {
			$(this).css({
				"background": "white",
				 "border-color": "#C7C7C7"
			});
			$(this).find(".select-car").css("display", "block");
		});
	
		$(this).closest(".car-info").css({
			"background": "url(//static.interjet.com/assets/images/icon/radio-green-on.png) no-repeat 15px 15px #FAFBEA",
			"border-color": "#ADD58F"
		});
		// $(this).css("display", "none");
		
		
		var DescriptionCar = '<b>'+$(this).closest(".car-info").find(".car-description").text() + " " +  $(this).closest(".car-info").find(".similar").text()	+	'</b>';
		var carPrice = $(this).closest(".car-info").find(".car-price").html();		
		$("#SelectedCarType").html(DescriptionCar);	
		$("#SelectedCarPrice").html(carPrice);		
				
		$('input[id*="TextBoxSelectedCarType"]').val( $(this).closest(".car-info").find(".car-description").html());
		$('input[id*="TextBoxSelectedCarPrice"]').val($(this).closest(".car-info").find(".car-price").html().replace('<b>','').replace('<b>','').replace('</b>','').replace('MXN','').replace('&nbsp;',''));
		
		var timeDifference		 = getDifference(carRentAvis.DeliveryCarDate, carRentAvis.ReturnCarDate)
		
		$("#SelectedTotalDays").html(timeDifference.Days);	
		$("#SelectedTotalHours").html(timeDifference.Hours);		
		$('input[id*="TextBoxSelectedGroupId"]').val($(this).attr("group-id"))
		
		sessionStorage.setItem("DiffDayRent",timeDifference.Days);
		sessionStorage.setItem("DiffHourRent",timeDifference.Hours);
		sessionStorage.setItem("DescriptionCar",DescriptionCar);
		
		$('input[id*="TextBoxSelectedTotalDays"]').val(timeDifference.Days);
		$('input[id*="TextBoxSelectedTotalHours"]').val(timeDifference.Hours);
		
		// $("#DeleteCarSubmit").show();
	});
}

	
function getDifference(BeginTime,EndTime){
	var BeginTimeParts = BeginTime.split(' ');
	var EndTimeParts = EndTime.split(' ');
	var BDValues =  BeginTimeParts[0].split('-');
	var EDValues =  EndTimeParts[0].split('-');

	var BTValues =  BeginTimeParts[1].split(':');
	var ETValues =  EndTimeParts[1].split(':');
	
  var t = (new Date(Number(EDValues[0]), Number(EDValues[1])-1, Number(EDValues[2]), Number(ETValues[0]), Number(ETValues[1])) - new Date(Number(BDValues[0]), Number(BDValues[1])-1, Number(BDValues[2]), Number(BTValues[0]), Number(BTValues[1])))
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'Total': t,
    'Days': days,
    'Hours': hours,
    'Minutes': minutes,
    'Seconds': seconds
  };
  
(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){var t=e.datepicker;t.regional.af={closeText:"Selekteer",prevText:"Vorige",nextText:"Volgende",currentText:"Vandag",monthNames:["Januarie","Februarie","Maart","April","Mei","Junie","Julie","Augustus","September","Oktober","November","Desember"],monthNamesShort:["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Des"],dayNames:["Sondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrydag","Saterdag"],dayNamesShort:["Son","Maa","Din","Woe","Don","Vry","Sat"],dayNamesMin:["So","Ma","Di","Wo","Do","Vr","Sa"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.af),t.regional.af,t.regional["ar-DZ"]={closeText:"?????",prevText:"&#x3C;??????",nextText:"??????&#x3E;",currentText:"?????",monthNames:["?????","?????","????","?????","???","????","??????","???","??????","??????","??????","??????"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["?????","???????","????????","????????","??????","??????","?????"],dayNamesShort:["?????","???????","????????","????????","??????","??????","?????"],dayNamesMin:["?????","???????","????????","????????","??????","??????","?????"],weekHeader:"?????",dateFormat:"dd/mm/yy",firstDay:6,isRTL:!0,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["ar-DZ"]),t.regional["ar-DZ"],t.regional.ar={closeText:"?????",prevText:"&#x3C;??????",nextText:"??????&#x3E;",currentText:"?????",monthNames:["????? ??????","????","????","?????","????","??????","????","??","?????","????? ?????","????? ??????","????? ?????"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["?????","???????","????????","????????","??????","??????","?????"],dayNamesShort:["?????","???????","????????","????????","??????","??????","?????"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"?????",dateFormat:"dd/mm/yy",firstDay:6,isRTL:!0,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ar),t.regional.ar,t.regional.az={closeText:"Bagla",prevText:"&#x3C;Geri",nextText:"Ir?li&#x3E;",currentText:"Bugün",monthNames:["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"],monthNamesShort:["Yan","Fev","Mar","Apr","May","Iyun","Iyul","Avq","Sen","Okt","Noy","Dek"],dayNames:["Bazar","Bazar ert?si","Ç?rs?nb? axsami","Ç?rs?nb?","Cüm? axsami","Cüm?","S?nb?"],dayNamesShort:["B","Be","Ça","Ç","Ca","C","S"],dayNamesMin:["B","B","Ç","?","Ç","C","S"],weekHeader:"Hf",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.az),t.regional.az,t.regional.be={closeText:"????????",prevText:"&larr;?????.",nextText:"????.&rarr;",currentText:"??????",monthNames:["????????","????","???????","????????","???????","???????","??????","???????","????????","??????????","????????","????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["???????","??????????","???????","??????","???????","???????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"??",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.be),t.regional.be,t.regional.bg={closeText:"???????",prevText:"&#x3C;?????",nextText:"??????&#x3E;",nextBigText:"&#x3E;&#x3E;",currentText:"????",monthNames:["??????","????????","????","?????","???","???","???","??????","?????????","????????","???????","????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["??????","??????????","???????","?????","?????????","?????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"Wk",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.bg),t.regional.bg,t.regional.bs={closeText:"Zatvori",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"Danas",monthNames:["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:["Nedelja","Ponedeljak","Utorak","Srijeda","Cetvrtak","Petak","Subota"],dayNamesShort:["Ned","Pon","Uto","Sri","Cet","Pet","Sub"],dayNamesMin:["Ne","Po","Ut","Sr","Ce","Pe","Su"],weekHeader:"Wk",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.bs),t.regional.bs,t.regional.ca={closeText:"Tanca",prevText:"Anterior",nextText:"Següent",currentText:"Avui",monthNames:["gener","febrer","març","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre"],monthNamesShort:["gen","feb","març","abr","maig","juny","jul","ag","set","oct","nov","des"],dayNames:["diumenge","dilluns","dimarts","dimecres","dijous","divendres","dissabte"],dayNamesShort:["dg","dl","dt","dc","dj","dv","ds"],dayNamesMin:["dg","dl","dt","dc","dj","dv","ds"],weekHeader:"Set",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ca),t.regional.ca,t.regional.cs={closeText:"Zavrít",prevText:"&#x3C;Dríve",nextText:"Pozdeji&#x3E;",currentText:"Nyní",monthNames:["leden","únor","brezen","duben","kveten","cerven","cervenec","srpen","zárí","ríjen","listopad","prosinec"],monthNamesShort:["led","úno","bre","dub","kve","cer","cvc","srp","zár","ríj","lis","pro"],dayNames:["nedele","pondelí","úterý","streda","ctvrtek","pátek","sobota"],dayNamesShort:["ne","po","út","st","ct","pá","so"],dayNamesMin:["ne","po","út","st","ct","pá","so"],weekHeader:"Týd",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.cs),t.regional.cs,t.regional["cy-GB"]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["Ionawr","Chwefror","Mawrth","Ebrill","Mai","Mehefin","Gorffennaf","Awst","Medi","Hydref","Tachwedd","Rhagfyr"],monthNamesShort:["Ion","Chw","Maw","Ebr","Mai","Meh","Gor","Aws","Med","Hyd","Tac","Rha"],dayNames:["Dydd Sul","Dydd Llun","Dydd Mawrth","Dydd Mercher","Dydd Iau","Dydd Gwener","Dydd Sadwrn"],dayNamesShort:["Sul","Llu","Maw","Mer","Iau","Gwe","Sad"],dayNamesMin:["Su","Ll","Ma","Me","Ia","Gw","Sa"],weekHeader:"Wy",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["cy-GB"]),t.regional["cy-GB"],t.regional.da={closeText:"Luk",prevText:"&#x3C;Forrige",nextText:"Næste&#x3E;",currentText:"Idag",monthNames:["Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"],dayNamesShort:["Søn","Man","Tir","Ons","Tor","Fre","Lør"],dayNamesMin:["Sø","Ma","Ti","On","To","Fr","Lø"],weekHeader:"Uge",dateFormat:"dd-mm-yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.da),t.regional.da,t.regional.de={closeText:"Schließen",prevText:"&#x3C;Zurück",nextText:"Vor&#x3E;",currentText:"Heute",monthNames:["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],monthNamesShort:["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],dayNames:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],dayNamesShort:["So","Mo","Di","Mi","Do","Fr","Sa"],dayNamesMin:["So","Mo","Di","Mi","Do","Fr","Sa"],weekHeader:"KW",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.de),t.regional.de,t.regional.el={closeText:"??e?s?µ?",prevText:"???????µe???",nextText:"?p?µe???",currentText:"?????? ???a?",monthNames:["?a????????","Feß????????","???t???","?p??????","?????","???????","???????","?????st??","Sept?µß????","??t?ß????","???µß????","?e??µß????"],monthNamesShort:["?a?","Feß","?a?","?p?","?a?","????","????","???","Sep","??t","??e","?e?"],dayNames:["????a??","?e?t??a","???t?","?et??t?","??µpt?","?a?as?e??","S?ßßat?"],dayNamesShort:["???","?e?","???","?et","?eµ","?a?","Saß"],dayNamesMin:["??","?e","??","?e","?e","?a","Sa"],weekHeader:"?ßd",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.el),t.regional.el,t.regional["en-AU"]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["en-AU"]),t.regional["en-AU"],t.regional["en-GB"]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["en-GB"]),t.regional["en-GB"],t.regional["en-NZ"]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["en-NZ"]),t.regional["en-NZ"],t.regional.eo={closeText:"Fermi",prevText:"&#x3C;Anta",nextText:"Sekv&#x3E;",currentText:"Nuna",monthNames:["Januaro","Februaro","Marto","Aprilo","Majo","Junio","Julio","Augusto","Septembro","Oktobro","Novembro","Decembro"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:["Dimanco","Lundo","Mardo","Merkredo","Jaudo","Vendredo","Sabato"],dayNamesShort:["Dim","Lun","Mar","Mer","Jau","Ven","Sab"],dayNamesMin:["Di","Lu","Ma","Me","Ja","Ve","Sa"],weekHeader:"Sb",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.eo),t.regional.eo,t.regional.es={closeText:"Cerrar",prevText:"&#x3C;Ant",nextText:"Sig&#x3E;",currentText:"Hoy",monthNames:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],monthNamesShort:["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],dayNames:["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],dayNamesShort:["dom","lun","mar","mié","jue","vie","sáb"],dayNamesMin:["D","L","M","X","J","V","S"],weekHeader:"Sm",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.es),t.regional.es,t.regional.et={closeText:"Sulge",prevText:"Eelnev",nextText:"Järgnev",currentText:"Täna",monthNames:["Jaanuar","Veebruar","Märts","Aprill","Mai","Juuni","Juuli","August","September","Oktoober","November","Detsember"],monthNamesShort:["Jaan","Veebr","Märts","Apr","Mai","Juuni","Juuli","Aug","Sept","Okt","Nov","Dets"],dayNames:["Pühapäev","Esmaspäev","Teisipäev","Kolmapäev","Neljapäev","Reede","Laupäev"],dayNamesShort:["Pühap","Esmasp","Teisip","Kolmap","Neljap","Reede","Laup"],dayNamesMin:["P","E","T","K","N","R","L"],weekHeader:"näd",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.et),t.regional.et,t.regional.eu={closeText:"Egina",prevText:"&#x3C;Aur",nextText:"Hur&#x3E;",currentText:"Gaur",monthNames:["urtarrila","otsaila","martxoa","apirila","maiatza","ekaina","uztaila","abuztua","iraila","urria","azaroa","abendua"],monthNamesShort:["urt.","ots.","mar.","api.","mai.","eka.","uzt.","abu.","ira.","urr.","aza.","abe."],dayNames:["igandea","astelehena","asteartea","asteazkena","osteguna","ostirala","larunbata"],dayNamesShort:["ig.","al.","ar.","az.","og.","ol.","lr."],dayNamesMin:["ig","al","ar","az","og","ol","lr"],weekHeader:"As",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.eu),t.regional.eu,t.regional.fa={closeText:"????",prevText:"&#x3C;????",nextText:"????&#x3E;",currentText:"?????",monthNames:["???????","????????","?????","???","?????","??????","???","????","???","??","????","?????"],monthNamesShort:["1","2","3","4","5","6","7","8","9","10","11","12"],dayNames:["??????","??????","???????","????????","???????","????","????"],dayNamesShort:["?","?","?","?","?","?","?"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"??",dateFormat:"yy/mm/dd",firstDay:6,isRTL:!0,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.fa),t.regional.fa,t.regional.fi={closeText:"Sulje",prevText:"&#xAB;Edellinen",nextText:"Seuraava&#xBB;",currentText:"Tänään",monthNames:["Tammikuu","Helmikuu","Maaliskuu","Huhtikuu","Toukokuu","Kesäkuu","Heinäkuu","Elokuu","Syyskuu","Lokakuu","Marraskuu","Joulukuu"],monthNamesShort:["Tammi","Helmi","Maalis","Huhti","Touko","Kesä","Heinä","Elo","Syys","Loka","Marras","Joulu"],dayNamesShort:["Su","Ma","Ti","Ke","To","Pe","La"],dayNames:["Sunnuntai","Maanantai","Tiistai","Keskiviikko","Torstai","Perjantai","Lauantai"],dayNamesMin:["Su","Ma","Ti","Ke","To","Pe","La"],weekHeader:"Vk",dateFormat:"d.m.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.fi),t.regional.fi,t.regional.fo={closeText:"Lat aftur",prevText:"&#x3C;Fyrra",nextText:"Næsta&#x3E;",currentText:"Í dag",monthNames:["Januar","Februar","Mars","Apríl","Mei","Juni","Juli","August","September","Oktober","November","Desember"],monthNamesShort:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Des"],dayNames:["Sunnudagur","Mánadagur","Týsdagur","Mikudagur","Hósdagur","Fríggjadagur","Leyardagur"],dayNamesShort:["Sun","Mán","Týs","Mik","Hós","Frí","Ley"],dayNamesMin:["Su","Má","Tý","Mi","Hó","Fr","Le"],weekHeader:"Vk",dateFormat:"dd-mm-yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.fo),t.regional.fo,t.regional["fr-CA"]={closeText:"Fermer",prevText:"Précédent",nextText:"Suivant",currentText:"Aujourd'hui",monthNames:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],monthNamesShort:["janv.","févr.","mars","avril","mai","juin","juil.","août","sept.","oct.","nov.","déc."],dayNames:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],dayNamesShort:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],dayNamesMin:["D","L","M","M","J","V","S"],weekHeader:"Sem.",dateFormat:"yy-mm-dd",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["fr-CA"]),t.regional["fr-CA"],t.regional["fr-CH"]={closeText:"Fermer",prevText:"&#x3C;Préc",nextText:"Suiv&#x3E;",currentText:"Courant",monthNames:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],monthNamesShort:["janv.","févr.","mars","avril","mai","juin","juil.","août","sept.","oct.","nov.","déc."],dayNames:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],dayNamesShort:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],dayNamesMin:["D","L","M","M","J","V","S"],weekHeader:"Sm",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["fr-CH"]),t.regional["fr-CH"],t.regional.fr={closeText:"Fermer",prevText:"Précédent",nextText:"Suivant",currentText:"Aujourd'hui",monthNames:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"],monthNamesShort:["janv.","févr.","mars","avril","mai","juin","juil.","août","sept.","oct.","nov.","déc."],dayNames:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],dayNamesShort:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],dayNamesMin:["D","L","M","M","J","V","S"],weekHeader:"Sem.",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.fr),t.regional.fr,t.regional.gl={closeText:"Pechar",prevText:"&#x3C;Ant",nextText:"Seg&#x3E;",currentText:"Hoxe",monthNames:["Xaneiro","Febreiro","Marzo","Abril","Maio","Xuño","Xullo","Agosto","Setembro","Outubro","Novembro","Decembro"],monthNamesShort:["Xan","Feb","Mar","Abr","Mai","Xuñ","Xul","Ago","Set","Out","Nov","Dec"],dayNames:["Domingo","Luns","Martes","Mércores","Xoves","Venres","Sábado"],dayNamesShort:["Dom","Lun","Mar","Mér","Xov","Ven","Sáb"],dayNamesMin:["Do","Lu","Ma","Mé","Xo","Ve","Sá"],weekHeader:"Sm",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.gl),t.regional.gl,t.regional.he={closeText:"????",prevText:"&#x3C;?????",nextText:"???&#x3E;",currentText:"????",monthNames:["?????","??????","???","?????","???","????","????","??????","??????","???????","??????","?????"],monthNamesShort:["???","???","???","???","???","????","????","???","???","???","???","???"],dayNames:["?????","???","?????","?????","?????","????","???"],dayNamesShort:["?'","?'","?'","?'","?'","?'","???"],dayNamesMin:["?'","?'","?'","?'","?'","?'","???"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!0,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.he),t.regional.he,t.regional.hi={closeText:"???",prevText:"?????",nextText:"????",currentText:"??",monthNames:["????? ","?????","?????","??????","??","???","?????","????? ","???????","???????","??????","???????"],monthNamesShort:["??","??","?????","??????","??","???","?????","??","???","????","??","??"],dayNames:["??????","??????","???????","??????","???????","????????","??????"],dayNamesShort:["???","???","????","???","????","?????","???"],dayNamesMin:["???","???","????","???","????","?????","???"],weekHeader:"?????",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.hi),t.regional.hi,t.regional.hr={closeText:"Zatvori",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"Danas",monthNames:["Sijecanj","Veljaca","Ožujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"],monthNamesShort:["Sij","Velj","Ožu","Tra","Svi","Lip","Srp","Kol","Ruj","Lis","Stu","Pro"],dayNames:["Nedjelja","Ponedjeljak","Utorak","Srijeda","Cetvrtak","Petak","Subota"],dayNamesShort:["Ned","Pon","Uto","Sri","Cet","Pet","Sub"],dayNamesMin:["Ne","Po","Ut","Sr","Ce","Pe","Su"],weekHeader:"Tje",dateFormat:"dd.mm.yy.",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.hr),t.regional.hr,t.regional.hu={closeText:"bezár",prevText:"vissza",nextText:"elore",currentText:"ma",monthNames:["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],monthNamesShort:["Jan","Feb","Már","Ápr","Máj","Jún","Júl","Aug","Szep","Okt","Nov","Dec"],dayNames:["Vasárnap","Hétfo","Kedd","Szerda","Csütörtök","Péntek","Szombat"],dayNamesShort:["Vas","Hét","Ked","Sze","Csü","Pén","Szo"],dayNamesMin:["V","H","K","Sze","Cs","P","Szo"],weekHeader:"Hét",dateFormat:"yy.mm.dd.",firstDay:1,isRTL:!1,showMonthAfterYear:!0,yearSuffix:""},t.setDefaults(t.regional.hu),t.regional.hu,t.regional.hy={closeText:"?????",prevText:"&#x3C;???.",nextText:"???.&#x3E;",currentText:"?????",monthNames:["???????","???????","????","?????","?????","??????","??????","???????","?????????","?????????","????????","?????????"],monthNamesShort:["?????","????","????","???","?????","??????","????","???","???","???","???","???"],dayNames:["??????","?????????","?????????","??????????","?????????","??????","?????"],dayNamesShort:["???","???","???","???","???","????","???"],dayNamesMin:["???","???","???","???","???","????","???"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.hy),t.regional.hy,t.regional.id={closeText:"Tutup",prevText:"&#x3C;mundur",nextText:"maju&#x3E;",currentText:"hari ini",monthNames:["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember"],monthNamesShort:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agus","Sep","Okt","Nop","Des"],dayNames:["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],dayNamesShort:["Min","Sen","Sel","Rab","kam","Jum","Sab"],dayNamesMin:["Mg","Sn","Sl","Rb","Km","jm","Sb"],weekHeader:"Mg",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.id),t.regional.id,t.regional.is={closeText:"Loka",prevText:"&#x3C; Fyrri",nextText:"Næsti &#x3E;",currentText:"Í dag",monthNames:["Janúar","Febrúar","Mars","Apríl","Maí","Júní","Júlí","Ágúst","September","Október","Nóvember","Desember"],monthNamesShort:["Jan","Feb","Mar","Apr","Maí","Jún","Júl","Ágú","Sep","Okt","Nóv","Des"],dayNames:["Sunnudagur","Mánudagur","Þriðjudagur","Miðvikudagur","Fimmtudagur","Föstudagur","Laugardagur"],dayNamesShort:["Sun","Mán","Þri","Mið","Fim","Fös","Lau"],dayNamesMin:["Su","Má","Þr","Mi","Fi","Fö","La"],weekHeader:"Vika",dateFormat:"dd.mm.yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.is),t.regional.is,t.regional["it-CH"]={closeText:"Chiudi",prevText:"&#x3C;Prec",nextText:"Succ&#x3E;",currentText:"Oggi",monthNames:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],monthNamesShort:["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],dayNames:["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],dayNamesShort:["Dom","Lun","Mar","Mer","Gio","Ven","Sab"],dayNamesMin:["Do","Lu","Ma","Me","Gi","Ve","Sa"],weekHeader:"Sm",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["it-CH"]),t.regional["it-CH"],t.regional.it={closeText:"Chiudi",prevText:"&#x3C;Prec",nextText:"Succ&#x3E;",currentText:"Oggi",monthNames:["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],monthNamesShort:["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"],dayNames:["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],dayNamesShort:["Dom","Lun","Mar","Mer","Gio","Ven","Sab"],dayNamesMin:["Do","Lu","Ma","Me","Gi","Ve","Sa"],weekHeader:"Sm",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.it),t.regional.it,t.regional.ja={closeText:"???",prevText:"&#x3C;?",nextText:"?&#x3E;",currentText:"??",monthNames:["1?","2?","3?","4?","5?","6?","7?","8?","9?","10?","11?","12?"],monthNamesShort:["1?","2?","3?","4?","5?","6?","7?","8?","9?","10?","11?","12?"],dayNames:["???","???","???","???","???","???","???"],dayNamesShort:["?","?","?","?","?","?","?"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"?",dateFormat:"yy/mm/dd",firstDay:0,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"?"},t.setDefaults(t.regional.ja),t.regional.ja,t.regional.ka={closeText:"???????",prevText:"&#x3c; ????",nextText:"??????? &#x3e;",currentText:"????",monthNames:["???????","?????????","?????","??????","?????","??????","??????","???????","??????????","?????????","????????","?????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["?????","????????","?????????","?????????","?????????","?????????","??????"],dayNamesShort:["??","???","???","???","???","???","???"],dayNamesMin:["??","???","???","???","???","???","???"],weekHeader:"?????",dateFormat:"dd-mm-yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ka),t.regional.ka,t.regional.kk={closeText:"????",prevText:"&#x3C;???????",nextText:"??????&#x3E;",currentText:"?????",monthNames:["??????","?????","??????","?????","?????","??????","?????","?????","????????","?????","??????","?????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["????????","????????","????????","????????","????????","????","?????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"??",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.kk),t.regional.kk,t.regional.km={closeText:"????????",prevText:"???",nextText:"???????",currentText:"????????",monthNames:["????","??????","????","????","????","??????","??????","????","?????","????","????????","????"],monthNamesShort:["????","??????","????","????","????","??????","??????","????","?????","????","????????","????"],dayNames:["???????","????","??????","???","??????????","?????","????"],dayNamesShort:["??","?","?","??","????","??","??"],dayNamesMin:["??","?","?","??","????","??","??"],weekHeader:"???????",dateFormat:"dd-mm-yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.km),t.regional.km,t.regional.ko={closeText:"??",prevText:"???",nextText:"???",currentText:"??",monthNames:["1?","2?","3?","4?","5?","6?","7?","8?","9?","10?","11?","12?"],monthNamesShort:["1?","2?","3?","4?","5?","6?","7?","8?","9?","10?","11?","12?"],dayNames:["???","???","???","???","???","???","???"],dayNamesShort:["?","?","?","?","?","?","?"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"Wk",dateFormat:"yy-mm-dd",firstDay:0,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"?"},t.setDefaults(t.regional.ko),t.regional.ko,t.regional.ky={closeText:"?????",prevText:"&#x3c;???",nextText:"???&#x3e;",currentText:"?????",monthNames:["??????","???????","????","??????","???","????","????","??????","????????","???????","??????","???????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["????????","????????","????????","????????","????????","????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ky),t.regional.ky,t.regional.lb={closeText:"Fäerdeg",prevText:"Zréck",nextText:"Weider",currentText:"Haut",monthNames:["Januar","Februar","Mäerz","Abrëll","Mee","Juni","Juli","August","September","Oktober","November","Dezember"],monthNamesShort:["Jan","Feb","Mäe","Abr","Mee","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],dayNames:["Sonndeg","Méindeg","Dënschdeg","Mëttwoch","Donneschdeg","Freideg","Samschdeg"],dayNamesShort:["Son","Méi","Dën","Mët","Don","Fre","Sam"],dayNamesMin:["So","Mé","Dë","Më","Do","Fr","Sa"],weekHeader:"W",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.lb),t.regional.lb,t.regional.lt={closeText:"Uždaryti",prevText:"&#x3C;Atgal",nextText:"Pirmyn&#x3E;",currentText:"Šiandien",monthNames:["Sausis","Vasaris","Kovas","Balandis","Geguže","Birželis","Liepa","Rugpjutis","Rugsejis","Spalis","Lapkritis","Gruodis"],monthNamesShort:["Sau","Vas","Kov","Bal","Geg","Bir","Lie","Rugp","Rugs","Spa","Lap","Gru"],dayNames:["sekmadienis","pirmadienis","antradienis","treciadienis","ketvirtadienis","penktadienis","šeštadienis"],dayNamesShort:["sek","pir","ant","tre","ket","pen","šeš"],dayNamesMin:["Se","Pr","An","Tr","Ke","Pe","Še"],weekHeader:"SAV",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!0,yearSuffix:""},t.setDefaults(t.regional.lt),t.regional.lt,t.regional.lv={closeText:"Aizvert",prevText:"Iepr.",nextText:"Nak.",currentText:"Šodien",monthNames:["Janvaris","Februaris","Marts","Aprilis","Maijs","Junijs","Julijs","Augusts","Septembris","Oktobris","Novembris","Decembris"],monthNamesShort:["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNames:["svetdiena","pirmdiena","otrdiena","trešdiena","ceturtdiena","piektdiena","sestdiena"],dayNamesShort:["svt","prm","otr","tre","ctr","pkt","sst"],dayNamesMin:["Sv","Pr","Ot","Tr","Ct","Pk","Ss"],weekHeader:"Ned.",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.lv),t.regional.lv,t.regional.mk={closeText:"???????",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"?????",monthNames:["???????","????????","????","?????","???","????","????","??????","?????????","????????","???????","????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["??????","??????????","???????","?????","????????","?????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.mk),t.regional.mk,t.regional.ml={closeText:"???",prevText:"?????????",nextText:"???????? ",currentText:"?????",monthNames:["??????","?????????","?????????","????????","????","?????","????","????????","????????????","?????????","???????","????????"],monthNamesShort:["???","????","?????","?????","????","?????","????","??","????","?????","???","???"],dayNames:["??????","????????","?????","??????","??????","??????","???"],dayNamesShort:["???","?????","?????","???","??????","??????","???"],dayNamesMin:["??","??","??","??","????","??","?"],weekHeader:"?",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ml),t.regional.ml,t.regional.ms={closeText:"Tutup",prevText:"&#x3C;Sebelum",nextText:"Selepas&#x3E;",currentText:"hari ini",monthNames:["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"],monthNamesShort:["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogo","Sep","Okt","Nov","Dis"],dayNames:["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"],dayNamesShort:["Aha","Isn","Sel","Rab","kha","Jum","Sab"],dayNamesMin:["Ah","Is","Se","Ra","Kh","Ju","Sa"],weekHeader:"Mg",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ms),t.regional.ms,t.regional.nb={closeText:"Lukk",prevText:"&#xAB;Forrige",nextText:"Neste&#xBB;",currentText:"I dag",monthNames:["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember"],monthNamesShort:["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],dayNamesShort:["søn","man","tir","ons","tor","fre","lør"],dayNames:["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],dayNamesMin:["sø","ma","ti","on","to","fr","lø"],weekHeader:"Uke",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.nb),t.regional.nb,t.regional["nl-BE"]={closeText:"Sluiten",prevText:"?",nextText:"?",currentText:"Vandaag",monthNames:["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],monthNamesShort:["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],dayNames:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],dayNamesShort:["zon","maa","din","woe","don","vri","zat"],dayNamesMin:["zo","ma","di","wo","do","vr","za"],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["nl-BE"]),t.regional["nl-BE"],t.regional.nl={closeText:"Sluiten",prevText:"?",nextText:"?",currentText:"Vandaag",monthNames:["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],monthNamesShort:["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],dayNames:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],dayNamesShort:["zon","maa","din","woe","don","vri","zat"],dayNamesMin:["zo","ma","di","wo","do","vr","za"],weekHeader:"Wk",dateFormat:"dd-mm-yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.nl),t.regional.nl,t.regional.nn={closeText:"Lukk",prevText:"&#xAB;Førre",nextText:"Neste&#xBB;",currentText:"I dag",monthNames:["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember"],monthNamesShort:["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],dayNamesShort:["sun","mån","tys","ons","tor","fre","lau"],dayNames:["sundag","måndag","tysdag","onsdag","torsdag","fredag","laurdag"],dayNamesMin:["su","må","ty","on","to","fr","la"],weekHeader:"Veke",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.nn),t.regional.nn,t.regional.no={closeText:"Lukk",prevText:"&#xAB;Forrige",nextText:"Neste&#xBB;",currentText:"I dag",monthNames:["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember"],monthNamesShort:["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],dayNamesShort:["søn","man","tir","ons","tor","fre","lør"],dayNames:["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],dayNamesMin:["sø","ma","ti","on","to","fr","lø"],weekHeader:"Uke",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.no),t.regional.no,t.regional.pl={closeText:"Zamknij",prevText:"&#x3C;Poprzedni",nextText:"Nastepny&#x3E;",currentText:"Dzis",monthNames:["Styczen","Luty","Marzec","Kwiecien","Maj","Czerwiec","Lipiec","Sierpien","Wrzesien","Pazdziernik","Listopad","Grudzien"],monthNamesShort:["Sty","Lu","Mar","Kw","Maj","Cze","Lip","Sie","Wrz","Pa","Lis","Gru"],dayNames:["Niedziela","Poniedzialek","Wtorek","Sroda","Czwartek","Piatek","Sobota"],dayNamesShort:["Nie","Pn","Wt","Sr","Czw","Pt","So"],dayNamesMin:["N","Pn","Wt","Sr","Cz","Pt","So"],weekHeader:"Tydz",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.pl),t.regional.pl,t.regional["pt-BR"]={closeText:"Fechar",prevText:"&#x3C;Anterior",nextText:"Próximo&#x3E;",currentText:"Hoje",monthNames:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],dayNamesMin:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],weekHeader:"Sm",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["pt-BR"]),t.regional["pt-BR"],t.regional.pt={closeText:"Fechar",prevText:"Anterior",nextText:"Seguinte",currentText:"Hoje",monthNames:["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],monthNamesShort:["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],dayNames:["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"],dayNamesShort:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],dayNamesMin:["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],weekHeader:"Sem",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.pt),t.regional.pt,t.regional.rm={closeText:"Serrar",prevText:"&#x3C;Suandant",nextText:"Precedent&#x3E;",currentText:"Actual",monthNames:["Schaner","Favrer","Mars","Avrigl","Matg","Zercladur","Fanadur","Avust","Settember","October","November","December"],monthNamesShort:["Scha","Fev","Mar","Avr","Matg","Zer","Fan","Avu","Sett","Oct","Nov","Dec"],dayNames:["Dumengia","Glindesdi","Mardi","Mesemna","Gievgia","Venderdi","Sonda"],dayNamesShort:["Dum","Gli","Mar","Mes","Gie","Ven","Som"],dayNamesMin:["Du","Gl","Ma","Me","Gi","Ve","So"],weekHeader:"emna",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.rm),t.regional.rm,t.regional.ro={closeText:"Închide",prevText:"&#xAB; Luna precedenta",nextText:"Luna urmatoare &#xBB;",currentText:"Azi",monthNames:["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"],monthNamesShort:["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Duminica","Luni","Marti","Miercuri","Joi","Vineri","Sâmbata"],dayNamesShort:["Dum","Lun","Mar","Mie","Joi","Vin","Sâm"],dayNamesMin:["Du","Lu","Ma","Mi","Jo","Vi","Sâ"],weekHeader:"Sapt",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ro),t.regional.ro,t.regional.ru={closeText:"???????",prevText:"&#x3C;????",nextText:"????&#x3E;",currentText:"???????",monthNames:["??????","???????","????","??????","???","????","????","??????","????????","???????","??????","???????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["???????????","???????????","???????","?????","???????","???????","???????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ru),t.regional.ru,t.regional.sk={closeText:"Zavriet",prevText:"&#x3C;Predchádzajúci",nextText:"Nasledujúci&#x3E;",currentText:"Dnes",monthNames:["január","február","marec","apríl","máj","jún","júl","august","september","október","november","december"],monthNamesShort:["Jan","Feb","Mar","Apr","Máj","Jún","Júl","Aug","Sep","Okt","Nov","Dec"],dayNames:["nedela","pondelok","utorok","streda","štvrtok","piatok","sobota"],dayNamesShort:["Ned","Pon","Uto","Str","Štv","Pia","Sob"],dayNamesMin:["Ne","Po","Ut","St","Št","Pia","So"],weekHeader:"Ty",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.sk),t.regional.sk,t.regional.sl={closeText:"Zapri",prevText:"&#x3C;Prejšnji",nextText:"Naslednji&#x3E;",currentText:"Trenutni",monthNames:["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"],dayNames:["Nedelja","Ponedeljek","Torek","Sreda","Cetrtek","Petek","Sobota"],dayNamesShort:["Ned","Pon","Tor","Sre","Cet","Pet","Sob"],dayNamesMin:["Ne","Po","To","Sr","Ce","Pe","So"],weekHeader:"Teden",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.sl),t.regional.sl,t.regional.sq={closeText:"mbylle",prevText:"&#x3C;mbrapa",nextText:"Përpara&#x3E;",currentText:"sot",monthNames:["Janar","Shkurt","Mars","Prill","Maj","Qershor","Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor"],monthNamesShort:["Jan","Shk","Mar","Pri","Maj","Qer","Kor","Gus","Sht","Tet","Nën","Dhj"],dayNames:["E Diel","E Hënë","E Martë","E Mërkurë","E Enjte","E Premte","E Shtune"],dayNamesShort:["Di","Hë","Ma","Më","En","Pr","Sh"],dayNamesMin:["Di","Hë","Ma","Më","En","Pr","Sh"],weekHeader:"Ja",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.sq),t.regional.sq,t.regional["sr-SR"]={closeText:"Zatvori",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"Danas",monthNames:["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"],dayNames:["Nedelja","Ponedeljak","Utorak","Sreda","Cetvrtak","Petak","Subota"],dayNamesShort:["Ned","Pon","Uto","Sre","Cet","Pet","Sub"],dayNamesMin:["Ne","Po","Ut","Sr","Ce","Pe","Su"],weekHeader:"Sed",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional["sr-SR"]),t.regional["sr-SR"],t.regional.sr={closeText:"???????",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"?????",monthNames:["??????","???????","????","?????","???","???","???","??????","?????????","???????","????????","????????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["??????","?????????","??????","?????","????????","?????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.sr),t.regional.sr,t.regional.sv={closeText:"Stäng",prevText:"&#xAB;Förra",nextText:"Nästa&#xBB;",currentText:"Idag",monthNames:["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],dayNamesShort:["Sön","Mån","Tis","Ons","Tor","Fre","Lör"],dayNames:["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"],dayNamesMin:["Sö","Må","Ti","On","To","Fr","Lö"],weekHeader:"Ve",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.sv),t.regional.sv,t.regional.ta={closeText:"????",prevText:"?????????",nextText:"????????",currentText:"?????",monthNames:["??","????","???????","????????","??????","???","???","????","?????????","??????","??????????","???????"],monthNamesShort:["??","????","???","????","????","???","???","??","???","???","????","????"],dayNames:["???????????????","????????????","???????????????","??????????","????????????","?????????????","??????????"],dayNamesShort:["??????","???????","????????","?????","???????","??????","???"],dayNamesMin:["??","??","??","??","??","??","?"],weekHeader:"??",dateFormat:"dd/mm/yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.ta),t.regional.ta,t.regional.th={closeText:"???",prevText:"&#xAB;&#xA0;????",nextText:"?????&#xA0;&#xBB;",currentText:"??????",monthNames:["??????","??????????","??????","??????","???????","????????","???????","???????","???????","??????","?????????","???????"],monthNamesShort:["?.?.","?.?.","??.?.","??.?.","?.?.","??.?.","?.?.","?.?.","?.?.","?.?.","?.?.","?.?."],dayNames:["???????","??????","??????","???","????????","?????","?????"],dayNamesShort:["??.","?.","?.","?.","??.","?.","?."],dayNamesMin:["??.","?.","?.","?.","??.","?.","?."],weekHeader:"Wk",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.th),t.regional.th,t.regional.tj={closeText:"?????",prevText:"&#x3c;????",nextText:"???&#x3e;",currentText:"?????",monthNames:["?????","??????","????","?????","???","???","???","??????","???????","??????","?????","??????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["???????","???????","???????","????????","?????????","?????","?????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"??",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.tj),t.regional.tj,t.regional.tr={closeText:"kapat",prevText:"&#x3C;geri",nextText:"ileri&#x3e",currentText:"bugün",monthNames:["Ocak","Subat","Mart","Nisan","Mayis","Haziran","Temmuz","Agustos","Eylül","Ekim","Kasim","Aralik"],monthNamesShort:["Oca","Sub","Mar","Nis","May","Haz","Tem","Agu","Eyl","Eki","Kas","Ara"],dayNames:["Pazar","Pazartesi","Sali","Çarsamba","Persembe","Cuma","Cumartesi"],dayNamesShort:["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],dayNamesMin:["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],weekHeader:"Hf",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.tr),t.regional.tr,t.regional.uk={closeText:"???????",prevText:"&#x3C;",nextText:"&#x3E;",currentText:"????????",monthNames:["??????","?????","????????","???????","???????","???????","??????","???????","????????","???????","????????","???????"],monthNamesShort:["???","???","???","???","???","???","???","???","???","???","???","???"],dayNames:["??????","?????????","????????","??????","??????","?’??????","??????"],dayNamesShort:["???","???","???","???","???","???","???"],dayNamesMin:["??","??","??","??","??","??","??"],weekHeader:"???",dateFormat:"dd.mm.yy",firstDay:1,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.uk),t.regional.uk,t.regional.vi={closeText:"Ðóng",prevText:"&#x3C;Tru?c",nextText:"Ti?p&#x3E;",currentText:"Hôm nay",monthNames:["Tháng M?t","Tháng Hai","Tháng Ba","Tháng Tu","Tháng Nam","Tháng Sáu","Tháng B?y","Tháng Tám","Tháng Chín","Tháng Mu?i","Tháng Mu?i M?t","Tháng Mu?i Hai"],monthNamesShort:["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"],dayNames:["Ch? Nh?t","Th? Hai","Th? Ba","Th? Tu","Th? Nam","Th? Sáu","Th? B?y"],dayNamesShort:["CN","T2","T3","T4","T5","T6","T7"],dayNamesMin:["CN","T2","T3","T4","T5","T6","T7"],weekHeader:"Tu",dateFormat:"dd/mm/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},t.setDefaults(t.regional.vi),t.regional.vi,t.regional["zh-CN"]={closeText:"??",prevText:"&#x3C;??",nextText:"??&#x3E;",currentText:"??",monthNames:["??","??","??","??","??","??","??","??","??","??","???","???"],monthNamesShort:["??","??","??","??","??","??","??","??","??","??","???","???"],dayNames:["???","???","???","???","???","???","???"],dayNamesShort:["??","??","??","??","??","??","??"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"?",dateFormat:"yy-mm-dd",firstDay:1,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"?"},t.setDefaults(t.regional["zh-CN"]),t.regional["zh-CN"],t.regional["zh-HK"]={closeText:"??",prevText:"&#x3C;??",nextText:"??&#x3E;",currentText:"??",monthNames:["??","??","??","??","??","??","??","??","??","??","???","???"],monthNamesShort:["??","??","??","??","??","??","??","??","??","??","???","???"],dayNames:["???","???","???","???","???","???","???"],dayNamesShort:["??","??","??","??","??","??","??"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"?",dateFormat:"dd-mm-yy",firstDay:0,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"?"},t.setDefaults(t.regional["zh-HK"]),t.regional["zh-HK"],t.regional["zh-TW"]={closeText:"??",prevText:"&#x3C;??",nextText:"??&#x3E;",currentText:"??",monthNames:["??","??","??","??","??","??","??","??","??","??","???","???"],monthNamesShort:["??","??","??","??","??","??","??","??","??","??","???","???"],dayNames:["???","???","???","???","???","???","???"],dayNamesShort:["??","??","??","??","??","??","??"],dayNamesMin:["?","?","?","?","?","?","?"],weekHeader:"?",dateFormat:"yy/mm/dd",firstDay:1,isRTL:!1,showMonthAfterYear:!0,yearSuffix:"?"},t.setDefaults(t.regional["zh-TW"]),t.regional["zh-TW"]
});  
  
}




