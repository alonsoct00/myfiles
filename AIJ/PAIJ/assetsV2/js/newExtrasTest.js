// Variables globales
var map;
var open = false;
var rooms = 0;
var adults = new Array();
var childrens = new Array();
var servicioHabitacion = '';
var datePolicy = '';
var amountPolicy = '';
var idSelectHotel = 0;
var selectHotel = false;
var adult = "adult";
var menor = "child";
var ageMenor = "ageChild";

//Ready Hotel
$(function(){
	rooms = $("#selectRooms").html();
	blockElementsAdults();
	blockElementsMenors();
	blockElementsAgeMenors();
	var countRoom = parseInt(ParamHotel.Adults);
	if(countRoom>3) countRoom = 3;
	//Validamos si solo es una habitación
	switch(ParamHotel.Adults){
		case "1":
			$("#divRoom2").css("display", "none");
			$("#divRoom3").css("display", "none");
			configSelect(1);
			blockElements();
			hideElementsDivMenors(ParamHotel.Childs)
			break;
		case "2":
			$("#divRoom3").css("display", "none");
			generateOptions("optionsRoom", countRoom);
			if(parseInt(ParamHotel.Childs) > 0){
				hideElementsDivMenors(ParamHotel.Adults)
				validateAgeMenors();
			} 
			break;
		default:
			generateOptions("optionsRoom", countRoom);
			if(parseInt(ParamHotel.Childs) > 0){
				hideElementsDivMenors(ParamHotel.Adults)
				validateAgeMenors();
			} 
			break;
	}

	hideElementsDivMenors(ParamHotel.Childs)
	
	if(ParamHotel.Hotelid && ParamHotel.Hotelid != ''){
		$("#costHotel").html(number_format(ParamHotel.Amount));
		var datosHotel = ParamHotel.Hotelid.split('|');
		idSelectHotel = datosHotel[4];
		selectHotel = true;
		$('html,body').animate({
			scrollTop: 1350
		}, 500);
	}
});

function configSelect(countRoom){
	switch (countRoom){
		case 1:
			$("#selectRooms").html(1);
			$("#adultsActive1").html(ParamHotel.Adults);
			$("#selectMenors1").html(ParamHotel.Childs);
			$("#adult1").removeAttr("disabled");
			$("#menor1").removeAttr("disabled");
			$("#optionsRoom").html("");
			break;
	}
}

function getHotels(){
	if(open){
		open = false;
	}else{
		rooms = $("#selectRooms").html();
		var data = getData(1, false, rooms);
		llamadoAjaxHotels(data);		
		open = true;
	}
}

// Obtenemos los datos seleccionados para el llamado
function getData(page, seleccionHotel, idHotel, position){
	getOrderPassengers();
	var occuppancies = getOccupancies();
	console.log(occuppancies);
	return data =
	{
		"destCode": ParamHotel.DestCode,
		"language": ParamHotel.Lenguage,
		"currency": ParamHotel.Currency,
	 	"arrivalDate": ParamHotel.ArrivalDate,
		"departureDate": ParamHotel.DepartureDate,
		"adults": ParamHotel.Adults,
		"children": ParamHotel.Childs,
		"childAges": ParamHotel.ChildAges,
		"rooms": rooms,
		"page": page,
		"seleccionHotel": seleccionHotel,
		"idHotel": idHotel,
		"position": position,
		"occuppancies": JSON.stringify(occuppancies)
	};
}

function getOccupancies(){	
	var occuppancies = new Array();
	for(var i = 0; i < rooms; i++){
		var occuppancie = new Object();
		occuppancie.rooms = 1;
		occuppancie.adults = adults[i];
		occuppancie.children = childrens[i];
		occuppancie.paxes = new Array();
		for(var j = 0; j < occuppancie.adults; j++){
			var paxes = new Object();
			paxes.type = "AD";
			paxes.age = 30;
			occuppancie.paxes.push(paxes);
		}
		for(var j = 0; j < occuppancie.children; j++){
			var paxes = new Object();
			paxes.type = "CH";
			if(occuppancie.children == 1) paxes.age = 5;
			else paxes.age = parseInt($("#optionsActiveAgeMenor" + (i+1) + (j+1)).html());
			occuppancie.paxes.push(paxes);

		}
		occuppancies.push(occuppancie);
	}
	return occuppancies;
}

function getOrderPassengers(){
	rooms = $("#selectRooms").html();
	rooms = rooms.trim();
	adults = [];
	childrens = [];
	switch(rooms){
		case "1":
			adults.push(parseInt(ParamHotel.Adults));
			childrens.push(parseInt(ParamHotel.Childs));
			break;
		case "2":
			adults.push($("#adult1 .option-active").html());
			adults.push($("#adult2 .option-active").html());
			if(parseInt(ParamHotel.Childs) > 0){
				childrens.push($("#menor1 .option-active").html());
				childrens.push($("#menor2 .option-active").html());
			}
			break;
		case "3":
			adults.push($("#adult1 .option-active").html());
			adults.push($("#adult2 .option-active").html());
			adults.push($("#adult3 .option-active").html());
			if(parseInt(ParamHotel.Childs) > 0){
				childrens.push($("#menor1 .option-active").html());
				childrens.push($("#menor2 .option-active").html());
				childrens.push($("#menor3 .option-active").html());
			}
			break;
	}
}

function llamadoAjaxHotels(data){
	$.ajax({
	  	type: "GET",
	  	url: "HotelsAjaxNewTest.aspx",
		data: data,		
	  	beforeSend: function(){
			$('#hotelsAddon').html('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%; height:20px; margin-bottom:10px"><span class="sr-only">100 Complete</span></div>');
   		}
	}).done(function( info, msg ) {
		if(info == ""){
			$('#hotelsAddon').html('<br/><br/><b>Sin disponibilidad de hoteles</b>');							
		} else{			
			//alert(ParamHotel.ChildAges);	
			$('#hotelsAddon').html(info);	
			slickImages();
			showStartHotel();
			var ubicaciones = mostrarUbicacionesHotels(idSelectHotel);
			if(ubicaciones.length != 0)	initialize(ubicaciones);
			if(ParamHotel.Hotelid != ''){
				hideHotels(idSelectHotel);
			}		
		}																												
	}).fail(function( jqXHR, textStatus ) {
		
	});
}

function slickImages(){
	$('.slide-hotel').each(function(key, item) {
		key = key + 1;
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
	});	
	
	$('.slider-for-hotel').each(function(key, item) {
		var BigsliderIdName = 'Bigslider' + key;
		this.id = BigsliderIdName;
		var SliderChild = $('.slide-hotel');
		var BigsliderId = '#' + BigsliderIdName;

		$(BigsliderId).has('img').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: true,
			fade: true,
			dots: true,
			infinite: false,
			asNavFor: SliderChild,
			responsive: [{
				breakpoint: 500,
				settings: {
					dots: false,
					arrows: true,
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}],
			customPaging: function(slider, i) {
				var thumb = $(slider.$slides[i]).data('thumb');
				return '<a><img src="' + thumb + '"></a>';
			},
		});

		$('#hotelModal' + key).on('shown.bs.modal', function(e) {
			$('.slider-for-hotel').slick('setPosition');
		});
	});
}

function showStartHotel(){
	$('.star-rating').each(function(key, item){
		var starIdName = 'hotelsStar' + key;
		this.id = starIdName;
		var numStarts = this.innerText;				        
		validateStarts(numStarts, starIdName);
	});
}

function validateStarts(numStarts, element){
	var codHtml = "";
	if(numStarts == "1EST" || numStarts == "H1_5"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(numStarts == "2EST" || numStarts == "H2_5" || numStarts == "H2S"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(numStarts == "3EST" || numStarts == "H3_5" || numStarts == "H3S"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span><span class="ico-star"></span>';
	} else if(numStarts == "4EST"  || numStarts == "H4_5" || numStarts == "4LUX"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star"></span>';
	} else if(numStarts == "5EST"  || numStarts == "H5_5" || numStarts == "5LUX"){
		codHtml = '<span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span><span class="ico-star checked"></span>';
	} 
	$("#"+element).html(codHtml);
}

function blockElements(room){
	//$("#countRoom").attr("disabled", true);
	$("#updateHotels").attr("disabled", true);
}

function hideElementsDivMenors(adults){
	switch(adults){
		case "0":
			$("#divAgeMenors1").css("display", "none");
			$("#divAgeMenors2").css("display", "none");
			$("#divAgeMenors3").css("display", "none");
			break;
		case "1":
		
			break;
	}
	switch(ParamHotel.Childs){
		case "0":
			$("#divAgeMenors1").css("display", "none");
			$("#divAgeMenors2").css("display", "none");
			$("#divAgeMenors3").css("display", "none");
			break;
		case "1":
			$("#ageMenor12").css("display", "none");
			$("#ageMenor13").css("display", "none");
			$("#ageMenor22").css("display", "none");
			$("#ageMenor23").css("display", "none");
			$("#ageMenor32").css("display", "none");
			$("#ageMenor33").css("display", "none");
			break;
		case "2":			
			$("#ageMenor13").css("display", "none");
			$("#ageMenor23").css("display", "none");			
			$("#ageMenor33").css("display", "none");
			break;
	}
}

function blockElementsAdults(){	
	$("#adult1").attr("disabled", true);
	$("#adult2").attr("disabled", true);
	$("#adult3").attr("disabled", true);	
}

function blockElementsAgeMenors(){
	for(var i = 1; i <= 3; i++){
		for(var j = 1; j <= 3; j++){
			$("#ageMenor" + i + j).attr("disabled", true);
		}
	}
}

function blockElementsMenors(room){	
	$("#menor1").attr("disabled", true);
	$("#menor2").attr("disabled", true);
	$("#menor3").attr("disabled", true);		
}

function unlockElements(room){
	$("#countRoom").attr("disabled", "");
	$("#updateHotels").attr("disabled", "");
}

function unlockElementsAdults(room){
	switch (room){
		case 1:
			
			break;
		case 2:
			$("#adult1").removeAttr("disabled", "");
			$("#adult2").removeAttr("disabled", "");
			break;
		case 3:
			$("#adult1").removeAttr("disabled", "");
			$("#adult2").removeAttr("disabled", "");
			$("#adult3").removeAttr("disabled", "");
			break;
	}
}

function unlockElementsMenors(room){
	switch (room){
		case 0:			
			break;
		case 1:			
			break;
		case 2:
			$("#menor1").removeAttr("disabled");
			$("#menor2").removeAttr("disabled");
			break;
		case 3:
			$("#menor1").removeAttr("disabled");
			$("#menor2").removeAttr("disabled");
			$("#menor3").removeAttr("disabled");
			break;
	}
}

function unlockElementsAgeMenors(){
	var menorsRoom1 = parseInt($("#selectMenors1").html());
	var menorsRoom2 = parseInt($("#selectMenors2").html());
	var menorsRoom3 = parseInt($("#selectMenors3").html());
	
	for(var i = 0; i < menorsRoom1; i++){
		$("#ageMenor1"+(i+1)).removeAttr("disabled");
		$("#ageMenor1"+(i+1)).css("display", "");
	}
	for(var i = 0; i < menorsRoom2; i++){
		$("#ageMenor2"+(i+1)).removeAttr("disabled");
		$("#ageMenor2"+(i+1)).css("display", "");
	}
	for(var i = 0; i < menorsRoom3; i++){
		$("#ageMenor3"+(i+1)).removeAttr("disabled");
		$("#ageMenor3"+(i+1)).css("display", "");
	}
}

function windowModalDetail(position, idHotel){
	$.ajax({
		type: "GET",
		url: "DetailHotelNew.aspx",
		data: {
			idHotel : idHotel
		},
		beforeSend: function(){
			$('#loader').modal('show');
		}
  	}).done(function( data, msg ) {
		$('#loader').modal('toggle');
	  	$("#detailHotel" + position).modal("show");
	  	$("#detailBodyHotel" + position).html(data);
	  	getNumberStar(ObjectParams.Category);
		slickImagesDetail();																
  	});
}

function windowModalRoomsHotel(position, idHotel){
	var roomsSelect = $("#selectRooms").html();
	var data = getData(1, false, idHotel, position);

	$.ajax({
		type: "GET",
		url: "RoomsHotelNew.aspx",
		data: data,
		beforeSend: function(){
			$('#loader').modal('show');
			}
	}).done(function( data, msg ) {
		$('#loader').modal('toggle');
		$("#TipoHabitacion" + position).modal("show");
		$("#tipoHabitacionBody" + position).html(data);	
	});		
}

function seleccionHabitacion(id, costo, rateKey, codeHotel, codeRoom, tipoHabitacion, serviceRoom, nameHotel, date, amount, roomPlan, boardName, promotion){
	var cadenaHref = id + "+" + costo + "+" + rateKey + "+" + codeHotel + "+" + codeRoom + "+" + tipoHabitacion + "+" + nameHotel + "+" + roomPlan + "+" + boardName + "+" + promotion;
	servicioHabitacion = serviceRoom;
	datePolicy = date;
	amountPolicy = amount;
	$("#valoreshRef").html(cadenaHref);
}

function confirmarHabitacion(id, costo, rateKey, codeHotel, codeRoom, tipoHabitacion, roomPlan, boardCode, promotion){
	if(id == undefined){
		var cadenaHref = $("#valoreshRef").html();
		var valoresHref = cadenaHref.split("+");
		id = valoresHref[0];
		costo = valoresHref[1];
		rateKey = valoresHref[2];
		codeHotel = valoresHref[3];
		codeRoom = valoresHref[4];
		tipoHabitacion = valoresHref[5];
		nameHotel = valoresHref[6];
		roomPlan = valoresHref[7];
		boardCode = valoresHref[8];
		promotion = valoresHref[9];
	}
	configurarHref(id, costo, rateKey, codeHotel, codeRoom, tipoHabitacion, nameHotel, roomPlan, boardCode);	

	if(promotion == undefined) promotion = "";
	
	assignarTarifas(id, costo);
	$("#tipoHabitacion"+id).html(tipoHabitacion);
	$("#tipoServicio"+id).html(servicioHabitacion);
	$("#datePolicy"+id).html(datePolicy);
	$("#amountPolicy"+id).html(amountPolicy);
	$("#promocion"+id).html(promotion);
	$('#TipoHabitacion'+id).modal('hide');
}

function configurarHref(id, costo, rateKey, codeHotel, codeRoom, tipoHabitacion, nameHotel, roomPlan, boardCode){
	var hrefAdd = $("#agregarHotel"+id).attr('href');
	var arreglohrefAdd = hrefAdd.split("'");
	var arreglohrefAdd2 = arreglohrefAdd[3].split("+");

	arreglohrefAdd2[0] = number_format((costo/0.83)/0.95);
	arreglohrefAdd2[1] = rateKey;
	arreglohrefAdd2[2] = codeHotel;
	arreglohrefAdd2[3] = codeRoom;
	arreglohrefAdd2[5] = id;
	arreglohrefAdd2[6] = tipoHabitacion;
	arreglohrefAdd2[8] = nameHotel;
	arreglohrefAdd2[10] = boardCode;
	arreglohrefAdd2[11] = roomPlan;

	arreglohrefAdd[3] = arreglohrefAdd2.join("+");
	hrefAdd = arreglohrefAdd.join("'");
	$("#agregarHotel"+id).attr('href', hrefAdd);

	var hrefRemove = $("#removerHotel"+id).attr('href');
	var arreglohrefRemove = hrefRemove.split("'");
	var arreglohrefRemove2 = arreglohrefRemove[3].split("+");

	arreglohrefRemove2[0] = number_format((costo/0.83)/0.95);
	arreglohrefRemove2[1] = rateKey;
	arreglohrefRemove2[2] = codeHotel;
	arreglohrefRemove2[3] = codeRoom;
	arreglohrefRemove2[5] = id;
	arreglohrefRemove2[6] = tipoHabitacion;
	arreglohrefRemove2[8] = nameHotel;
	arreglohrefRemove2[11] = roomPlan;
	
	arreglohrefRemove[3] = arreglohrefRemove2.join("+");
	hrefRemove = arreglohrefRemove.join("'");
	$("#removerHotel"+id).attr('href', hrefRemove);
}

function number_format(amount) {
	decimals = 0;

    amount += ''; // por si pasan un numero en vez de un string
    amount = parseFloat(amount.replace(/[^0-9\.]/g, '')); // elimino cualquier cosa que no sea numero o punto

    decimals = decimals || 0; // por si la variable no fue fue pasada

    // si no es un numero o es igual a cero retorno el mismo cero
    if (isNaN(amount) || amount === 0) 
        return parseFloat(0).toFixed(decimals);

    // si es mayor o menor que cero retorno el valor formateado como numero
    amount = '' + amount.toFixed(decimals);

    var amount_parts = amount.split('.'),
        regexp = /(\d+)(\d{3})/;

    while (regexp.test(amount_parts[0]))
        amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

    return amount_parts.join('.');
}

function assignarTarifas(id, costo){
	$("#tarifaNeta"+id).html("$"+number_format(costo));
	$("#primerMargen"+id).html("$"+number_format(costo/0.83));
	$("#gastoFinanciero"+id).html("$"+number_format((costo/0.83)/0.95));
}

function hideHotels(idSelectHotel){
	var arrayIdHotels = [];
	$('.box-hotel-info').each(function(key, item) {
		arrayIdHotels.push(this.id);
	});
	for(var i = 0; i < 4; i++){
		if(idSelectHotel != arrayIdHotels[i]){
			$("#"+ arrayIdHotels[i]).css("display","none");
		} else {
			$("#agregarHotel"+(i+1)).css("display","none");
			$("#removerHotel"+(i+1)).css("display","");
			$("#"+idSelectHotel).css("border", "1px solid #53bb47");
			$("#"+idSelectHotel).css("background", "#e9f4f0");
		}
	}
}

function selectNumRoom(countRoom){
	blockElementsAdults();
	blockElementsMenors();
	blockElementsAgeMenors();
	unlockElementsAdults(countRoom);	
	calculatePassenger(countRoom);
	if(parseInt(ParamHotel.Childs) > 0){
		unlockElementsMenors(countRoom);
		if(parseInt(countRoom) > 1) unlockElementsAgeMenors();
	} 
	
}

function calculatePassenger(countRoom){
	if(parseInt(ParamHotel.Adults)>1){
		switch(countRoom){
			case 2:
				$("#adult1").html("<span class='select-label'>Adultos</span><span class='option-active' id='adultsActive1'>"+ (ParamHotel.Adults-1) +"</span>");
				$("#adult2").html("<span class='select-label'>Adultos</span><span class='option-active' id='adultsActive2'>1</span>");
				generateOptions("optionsAdults1",ParamHotel.Adults-1);
				generateOptions("optionsAdults2",ParamHotel.Adults-1);
				if(parseInt(ParamHotel.Childs) > 0){
					$("#menor1").html("<span class='select-label'>Menores</span><span class='option-active' id='selectMenors1'>"+ ParamHotel.Childs +"</span>");				
					$("#menor2").html("<span class='select-label'>Menores</span><span class='option-active' id='selectMenors2'>0</span>");
					generateOptions("optionsMenors1",ParamHotel.Childs);
					generateOptions("optionsMenors2",ParamHotel.Childs);
				}	
				break;
			case 3:
				$("#adult1").html("<span class='select-label'>Adultos</span><span class='option-active' id='adultsActive1'>"+ (ParamHotel.Adults-2) +"</span>");
				$("#adult2").html("<span class='select-label'>Adultos</span><span class='option-active' id='adultsActive2'>1</span>");
				$("#adult3").html("<span class='select-label'>Adultos</span><span class='option-active' id='adultsActive3'>1</span>");
				generateOptions("optionsAdults1",ParamHotel.Adults-2);
				generateOptions("optionsAdults2",ParamHotel.Adults-2);
				generateOptions("optionsAdults3",ParamHotel.Adults-2);
				if(parseInt(ParamHotel.Childs) > 0){
					$("#menor1").html("<span class='select-label'>Menores</span><span class='option-active' id='selectMenors1'>"+ ParamHotel.Childs +"</span>");				
					$("#menor2").html("<span class='select-label'>Menores</span><span class='option-active' id='selectMenors2'>0</span>");
					$("#menor3").html("<span class='select-label'>Menores</span><span class='option-active' id='selectMenors3'>0</span>");
					generateOptions("optionsMenors1",ParamHotel.Childs);
					generateOptions("optionsMenors2",ParamHotel.Childs);
					generateOptions("optionsMenors3",ParamHotel.Childs);
				}	
				break;
		}
	}
}

function updateHotel(){
	var data = getData(0, false, rooms);
	llamadoAjaxHotels(data);	
}

function generateOptions(element, count){
	var options = "";
	
	if(element == "optionsRoom"){
		for(var i = 0; i < count; i++) options += "<li onclick='selectNumRoom("+ (i+1) +")'>"+ (i+1) +"</li>";
	} else if(element == "optionsMenors1" || element == "optionsMenors2" || element == "optionsMenors3"){
		for(var i = 0; i <= count; i++) {
			if(element == "optionsMenors1") options += "<li onclick='orderPassengerCombo(menor, 1, "+ i +")'>"+ i +"</li>";
			if(element == "optionsMenors2") options += "<li onclick='orderPassengerCombo(menor, 2, "+ i +")'>"+ i +"</li>";
			if(element == "optionsMenors3") options += "<li onclick='orderPassengerCombo(menor, 3, "+ i +")'>"+ i +"</li>";
		}
	} else {
		for(var i = 1; i <= count; i++){
			if(element == "optionsAdults1") options += "<li onclick='orderPassengerCombo(adult, 1, "+ i +")'>"+ i +"</li>";
			if(element == "optionsAdults2") options += "<li onclick='orderPassengerCombo(adult, 2, "+ i +")'>"+ i +"</li>";
			if(element == "optionsAdults3") options += "<li onclick='orderPassengerCombo(adult, 3, "+ i +")'>"+ i +"</li>";
		}
	}
	
	$("#"+element).html(options);
}

function mostrarUbicacionesHotels(idCode){
	var totalHoteles = $("#countHotels").html();
	var Hoteles = [];
	for(var i = 1; i <= totalHoteles; i++){
		var ok = false;
		var longitude = parseFloat($("#longitude"+i).html());
		var latitude = parseFloat($("#latitude"+i).html());
		var name = $("#name"+i).html();
		var info = $("#information"+i).html();
		var code = $("#code"+i).html();
		if(code == idCode) var ok = true;
		var elementoHotel = {lng: longitude, lat: latitude, name: name, information: info, zoom: 20, ok: ok};
		Hoteles.push(elementoHotel);
	}
	return Hoteles;	
}

function initialize(markeData) {
	map = new google.maps.Map(document.getElementById('hotel-map-canvas'), {
		zoom: 10,
		disableDefaultUI: true,
		center: {
			lat: markeData[0].lat,
			lng: markeData[0].lng
		}
	});
	var intermark = {
		url: "/assets/images/PinBlueIcon.png", // url
		scaledSize: new google.maps.Size(13, 16), // scaled size
		origin: new google.maps.Point(0, 0), // origin
		anchor: new google.maps.Point(0, 0) // anchor
	};
	markeData.forEach(function(params) {
		var contentString = params.name;
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		var newmarker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			icon: intermark,
			position: {
				lat: params.lat,
				lng: params.lng
			},
			title: params.name
		});
		newmarker.addListener('click', function() {
			infowindow.open(map, newmarker);
		});
	});
}

function orderPassengerCombo(type, number, value){
	switch(type){
		case "adult":
			var totalAdults = parseInt(ParamHotel.Adults);
			//sumamos el total de adultos seleccionados
			var totalAdultsCombo = getAdultsCombo(number, value);
			//obtenemos cuantos adultos esta sobrepasado para restarlo en las demas combos
			var difAdults = totalAdultsCombo - totalAdults;
			//restamos los adultos en los combos restantes
			adjustAdults(number, difAdults);			
		break;
		case "child":
			var totalMenors = parseInt(ParamHotel.Childs);
			var totalMenorsCombo = getMenorsCombo(number, value);
			var difMenors = totalMenorsCombo - totalMenors;
			adjusMenors(number, difMenors);
			orderAgeMenor(number, value);
		break;
		case "ageChild":
		break;
	}
}

function validateAgeMenors(){
	var arrayAgeMenors = ParamHotel.ChildAges.split(",");
	for(var i = 1; i <= 3; i++){
		for(var j = 1; j <= 3; j++){
			var options = "";
			for(var k = 0; k < arrayAgeMenors.length - 1; k++){
				options += "<li onclick='orderAgeMenorsCombo("+arrayAgeMenors[k]+","+i+","+j+")'>"+ arrayAgeMenors[k] +"</li>";
			}
			$("#optionsAgeMenor" + i + j).html(options);
			if(j == 1){
				$("#optionsActiveAgeMenor"+ i + j).html(arrayAgeMenors[j-1]);
			} else if(j == 2){
				$("#optionsActiveAgeMenor"+ i + j).html(arrayAgeMenors[j-1]);
			} else if(j == 3){
				$("#optionsActiveAgeMenor"+ i + j).html(arrayAgeMenors[j-1]);
			}
		}
	}
}

function getAdultsCombo(number, value){
	rooms = parseInt($("#selectRooms").html());
	var totalAdultsCombo = 0;
	for(var i = 1; i <= 3; i++){
		if(i <= rooms){
			if(number != i)	{
				totalAdultsCombo += parseInt($("#adultsActive" + i).html());
			}
			else {
				totalAdultsCombo += parseInt(value);
			}
		}
	}
	return totalAdultsCombo;
}

function adjustAdults(number, difAdults){
	if(difAdults > 0){
		if(number != 1){
			for(var i = 0; i < difAdults; i++){
				var adultsRoom1 = parseInt($("#adultsActive1").html());
				if(adultsRoom1 > 1){
					$("#adultsActive1").html(adultsRoom1-1);
					difAdults--;
				}		
			}
		}
		if(difAdults > 0 && number != 2){
			for(var i = 0; i < difAdults; i++){
				var adultsRoom2 = parseInt($("#adultsActive2").html());
				if(adultsRoom2 > 1){
					$("#adultsActive2").html(adultsRoom2-1);
					difAdults--;
				}		
			}
		}
		if(difAdults > 0 && number != 3){
			for(var i = 0; i < difAdults; i++){
				var adultsRoom3 = parseInt($("#adultsActive3").html());
				if(adultsRoom3 > 1){
					$("#adultsActive3").html(adultsRoom3-1);
					difAdults--;
				}		
			}
		}
	} else{
		if(number != 1){
			for(var i = difAdults; i < 0; i++){
				var adultsRoom1 = parseInt($("#adultsActive1").html());
				$("#adultsActive1").html(adultsRoom1+1);
				difAdults++;					
			}
		}
		if(difAdults < 0 && number != 2){
			for(var i = difAdults; i < 0; i++){
				var adultsRoom2 = parseInt($("#adultsActive2").html());				
				$("#adultsActive2").html(adultsRoom2+1);
				difAdults++;					
			}
		}
		if(difAdults < 0 && number != 3){
			for(var i = difAdults; i < 0; i++){
				var adultsRoom3 = parseInt($("#adultsActive3").html());
				$("#adultsActive3").html(adultsRoom3+1);
				difAdults++;
			}
		}
	}	
}

function getMenorsCombo(number, value){
	rooms = parseInt($("#selectRooms").html());
	var totalMenorsCombo = 0;
	for(var i = 1; i <= 3; i++){
		if(i <= rooms){
			if(number != i)	{
				totalMenorsCombo += parseInt($("#selectMenors" + i).html());
			}
			else {
				totalMenorsCombo += parseInt(value);
			}
		}
	}
	return totalMenorsCombo;
}

function adjusMenors(number, difMenors){
	if(difMenors > 0){
		if(number != 1){
			for(var i = 0; i <= difMenors; i++){
				var menorsRoom1 = parseInt($("#selectMenors1").html());
				if(menorsRoom1 > 0){
					$("#selectMenors1").html(menorsRoom1-1);
					difMenors--;
				}		
			}
		}
		if(difMenors > 0 && number != 2){
			for(var i = 0; i <= difMenors; i++){
				var menorsRoom2 = parseInt($("#selectMenors2").html());
				if(menorsRoom2 > 0){
					$("#selectMenors2").html(menorsRoom2-1);
					difMenors--;
				}		
			}
		}
		if(difMenors > 0 && number != 3){
			for(var i = 0; i <= difMenors; i++){
				var menorsRoom3 = parseInt($("#selectMenors3").html());
				if(menorsRoom3 > 0){
					$("#selectMenors3").html(menorsRoom3-1);
					difMenors--;
				}		
			}
		}
	} else{
		if(number != 1){
			for(var i = difMenors; i < 0; i++){
				var menorsRoom1 = parseInt($("#selectMenors1").html());
				$("#selectMenors1").html(menorsRoom1+1);
				difMenors++;					
			}
		}
		if(difMenors < 0 && number != 2){
			for(var i = difMenors; i < 0; i++){
				var menorsRoom2 = parseInt($("#selectMenors2").html());				
				$("#selectMenors2").html(menorsRoom2+1);
				difMenors++;					
			}
		}
		if(difMenors < 0 && number != 3){
			for(var i = difMenors; i < 0; i++){
				var menorsRoom3 = parseInt($("#selectMenors3").html());
				$("#selectMenors3").html(menorsRoom3+1);
				difMenors++;
			}
		}
	}	
}

function orderAgeMenor(number, value){
	var menorsRoom1 = parseInt($("#selectMenors1").html());
	var menorsRoom2 = parseInt($("#selectMenors2").html());
	var menorsRoom3 = parseInt($("#selectMenors3").html());

	if(number == 1){
		menorsRoom1 = value;
	} else if(number == 2){
		menorsRoom2 = value;
	} else if(number == 3){
		menorsRoom3 = value;
	}
	
	var blockmenorsRoom1 = 3 - menorsRoom1;
	var blockmenorsRoom2 = 3 - menorsRoom2;
	var blockmenorsRoom3 = 3 - menorsRoom3;
	
	var arrayAgeMenors = ParamHotel.ChildAges.split(",");
	var j = 0;

	// Asignamos edades prioritarias a los combos seleccionados
	for(var i = 1; i <= menorsRoom1; i++){
		$("#optionsActiveAgeMenor1"+i).html(arrayAgeMenors[j]);
		$("#ageMenor1"+i).removeAttr("disabled");
		j++;
	}
	for(var i = 1; i <= menorsRoom2; i++){
		$("#optionsActiveAgeMenor2"+i).html(arrayAgeMenors[j]);
		$("#ageMenor2"+i).removeAttr("disabled");
		j++;
	}
	for(var i = 1; i <= menorsRoom3; i++){
		$("#optionsActiveAgeMenor3"+i).html(arrayAgeMenors[j]);
		$("#ageMenor3"+i).removeAttr("disabled");
		j++;
	}

	// Bloqueamos los combos que no se van a utilizar
	for(var i = 3; i >= 1; i--){
		if(blockmenorsRoom1 > 0) {
			$("#ageMenor1"+i).attr("disabled", true);
			blockmenorsRoom1--;
		}
		if(blockmenorsRoom2 > 0) {
			$("#ageMenor2"+i).attr("disabled", true);
			blockmenorsRoom2--;
		}
		if(blockmenorsRoom3 > 0) {
			$("#ageMenor3"+i).attr("disabled", true);
			blockmenorsRoom3--;
		}
	}	
}

function orderAgeMenorsCombo(ageSelect, positionRoom, positionAge){
	var agePrevious = parseInt($("#optionsActiveAgeMenor"+positionRoom+positionAge).html());
	var menorsRoom1 = parseInt($("#selectMenors1").html());
	var menorsRoom2 = parseInt($("#selectMenors2").html());
	var menorsRoom3 = parseInt($("#selectMenors3").html());

	var ageChanghe = false;

	for(var i = 1; i <= menorsRoom1; i++){
		ageTmp = parseInt($("#optionsActiveAgeMenor1"+i).html());
		if(ageTmp == ageSelect) {
			$("#optionsActiveAgeMenor1"+i).html(agePrevious);
			ageChanghe = true;
		}
	}
	if(!ageChanghe){
		for(var i = 1; i <= menorsRoom2; i++){
			ageTmp = parseInt($("#optionsActiveAgeMenor2"+i).html());
			if(ageTmp == ageSelect) {
				$("#optionsActiveAgeMenor2"+i).html(agePrevious);
				ageChanghe = true;
			}
		}
	}
	if(!ageChanghe){
		for(var i = 1; i <= menorsRoom3; i++){
			ageTmp = parseInt($("#optionsActiveAgeMenor3"+i).html());
			if(ageTmp == ageSelect) {
				$("#optionsActiveAgeMenor3"+i).html(agePrevious);
				ageChanghe = true;
			}
		}
	}
}


/* Funciones de Interjet por tierra */

function fHabilita(id){

	var lb = id;
	lb = lb.toString().replace('_Chk','_STT');
	//alert(id);

	if (document.getElementById(id).checked==true)
	{
        document.getElementById(lb).disabled =false;
        //alert(document.getElementById(id).checked);
	}
	
    if (document.getElementById(id).checked==false)
    {
        document.getElementById(lb).disabled =true ;
    }
}

var ant1="";
var ant2="";
var aux="";

function cambiaEstilo(id){
    if(String(id).indexOf("RadioButtonMkt1") != -1){
        if(ant1 == ""){
            ant1 = "#_" + String(id);
            jQuery(ant1).addClass("selectEstilo");
        }
        else if(ant1 != String(id)){
            aux = "#_" + String(id);
            jQuery(ant1).removeClass("selectEstilo");
            ant1 = aux;
            jQuery(ant1).addClass("selectEstilo");
        }
    }
    else{
        if(ant2 == ""){
            ant2 = "#_" + String(id);
            jQuery(ant2).addClass("selectEstilo");
        }
        else if(ant2 != String(id)){
            aux = "#_" + String(id);
            jQuery(ant2).removeClass("selectEstilo");
            ant2 = aux;
            jQuery(ant2).addClass("selectEstilo");
        }
    }
}

function sliderModalImages(){
	$('.flexslider').flexslider({
		animation: "slide",
	});
}

//Functions Bus

function DezpBus(){
	$('html,body').animate({
		scrollTop: 1000
	}, 500);
}

function showMapDeparture(){
	var inputVal = $("#ControlGroupNewExtras_InterjetLandControl_STTB0_0").val();
	//validamos el destino a mostrar en el mapa
	switch(inputVal){
		case "CUN-CPC":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/PLAYA-DEL-CARMEN.jpg");
			break;
		case "CUN-CCE":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/cancun-downtown.jpg");
			break;
		case "CUN-PMO":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa-ado-puerto-morelos.jpg");
			break;
		case "CUN-TUL":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa-ado-tulum.jpg");
			break;
		case "TLC-CUER":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/CUERNAVACA.jpg");
			break;
		case "CTM-BAC":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa%20bacalar.jpg");
			break;
		case "CTM-MAH":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/terminal%2020ado%2020chetumal.jpg");
			break;
	}
	$("#modalInterjetTierra").modal();
}

function showMapArrival(){
	var inputVal = $("#ControlGroupNewExtras_InterjetLandControl_STTA1_0").val();
	//validamos el destino a mostrar en el mapa
	switch(inputVal){
		case "CPC-CUN":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/PLAYA-DEL-CARMEN.jpg");
			break;
		case "CCE-CUN":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/cancun-downtown.jpg");
			break;
		case "PMO-CUN":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa-ado-puerto-morelos.jpg");
			break;
		case "TUL-CUN":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa-ado-tulum.jpg");
			break;
		case "CUER-TLC":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/STT/CUERNAVACA.jpg");
			break;
		case "BAC-CTM":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/mapa%20bacalar.jpg");
			break;
		case "MAH-CTM":
			$("#imgModalMap").attr("src","https://static.interjet.com/assets/images/landings/terminal%2020ado%2020chetumal.jpg");
			break;
	}
	$("#modalInterjetTierra").modal();
}


$(function(){
	if(ParamBus.currency != "" || ParamHotel.currency != ""){
		var costBus = "$" + number_format(ParamBus.amountBus) + "MXN";
		var costHot = "$" + number_format(ParamHotel.amountHot) +" "+ ParamHotel.currency;
		$("#costBus").html(costBus);
		$("#costHotel").html(costHot);
	}
});

function modalCargando(){
	$('#loader').modal('show');	
}

//Functions Price Display
