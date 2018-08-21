var interjetApp;

interjetApp = angular.module('interjetApp', [])


function chunk(arr, size) {
  var newArr = [];
  for (var i=0; i<arr.length; i+=size) {
    newArr.push(arr.slice(i, i+size));
  }
  return newArr;
}


interjetApp.controller('StationsController', ["$scope", function($scope,  $http) {

    angular.element(document).ready(function () {       
	    setTimeout(function() {

	       $('input[id*="TextBoxMarketOrigin1"]').val()		       	
	        $('.station[stationcode = "'+INTERJET.SearchAvailability.DefaultStationCode+'"]').click();
	        
	    }, 1500);

    });



  // // // Actions booking // // //

  // Open and close options booking
  $('button.btn-select').on('click', function (e) {
    e.preventDefault()    
    $('.booking-bg').fadeIn()
    var optionID = $(this).parent().attr('data-option')
    switch (optionID) {
      case 'origin':
        // se reinician todos los options
        $('.booking-options-item [data-option="origin"]').find('.label-origin').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
        $('.booking-options-item [data-option="origin"]').find('.select-origin').html(' ')
        $('.booking-options-item [data-option="destination"]').find('.label-destination').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
        $('.booking-options-item [data-option="destination"]').find('.select-destination').html(' ')
        $('.booking-options-item [data-option="passengers"]').find('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
        $('.booking-options-item [data-option="passengers"]').find('.select-passengers').html(' ')
        // se ocultan las opciones abiertas

        if ($(this).hasClass('active')) {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $('.booking-bg').fadeOut()
        } else {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $(this).parent().find('.booking-options-menu').slideDown('400', function () {
            $(this).parent().find('button.btn-select').addClass('active')
          })
        }
        break
      case 'destination':      
        // se reinician todos los options

        var SelectedOriginCode  = $('input[id*="OriginStationCode"]').val()
		
        if(SelectedOriginCode!=null){ 
        	if(!$(this).hasClass('active')){       	
        		$('.station[stationcode = "'+SelectedOriginCode+'"]').click();	
        	  	$('.booking-bg').fadeIn()
        	}
    	}

        $('.booking-options-item [data-option="destination"]').find('.label-destination').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
        $('.booking-options-item [data-option="destination"]').find('.select-destination').html(' ')
        $('.booking-options-item [data-option="passengers"]').find('.label-passengers').removeClass('description').removeClass('txt-blue').addClass('txt-gray')
        $('.booking-options-item [data-option="passengers"]').find('.select-passengers').html(' ')
        // se ocultan las opciones abiertas

        if ($(this).hasClass('active')) {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $('.booking-bg').fadeOut()
        } else {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $(this).parent().find('.booking-options-menu').slideDown('400', function () {
            $(this).parent().find('button.btn-select').addClass('active')
          })
        }
        break
      case 'passengers':
      // se ocultan las opciones abiertas

        if ($(this).hasClass('active')) {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $('.booking-bg').fadeOut()
        } else {
          $('.booking-options-menu').stop().slideUp()
          $('.booking-options-item').find('button.btn-select').removeClass('active')
          $(this).parent().find('.booking-options-menu').slideDown('400', function () {
            $(this).parent().find('button.btn-select').addClass('active')
          })
        }
        break
    }
  })


    $scope.StationsAndMarketsInfo = Interjet.StationsAndMarketsInfo;
    	
 	var Countries = [];							
	$.each(Interjet.StationsAndMarketsInfo.Countries , function( index, value ) {		
		Countries.push(value);    							
	});
	
	$scope.Countries = Countries;		
	
	var StationsNA = [];
	
	var counter = 0;
	

	$.each(Interjet.StationsAndMarketsInfo.Zones , function( ZoneIndex, value ) {

			var country = {Code:ZoneIndex, Name:value.Name, type:"Country"}
			StationsNA.push(country);						
			
			$.each(Interjet.StationsAndMarketsInfo.Stations , function( index, value ) {							
				if(value.CustomZone==ZoneIndex){
					var station = {Code:value.Code, Name:value.Name, CustomStyle:value.CustomStyle, type:"Station"}
					StationsNA.push(station);    								
				}	   
			});
	});		
	$scope.StationsNA = chunk(StationsNA, 12);	

	
	$scope.ShowDestinationsModal = function (OriginStationCode, OriginStationName, $event){	

				
		$('input[id*="TextBoxMarketOrigin1"]').val(OriginStationCode.substring(0,3));
		$('input[id="OriginStationCode"]').val(OriginStationCode);
		$('input[id="OriginStation"]').val(OriginStationName);		
		$('input[id*="TextBoxMarketDestination1"]').val();

		$('input[id="DestinationStation"]').val();
		$('input[id="DestinationStationCode"]').val();
		$('.select-destination').html('');

		INTERJET.SearchAvailability.EnableSearchButton($event);			
		$scope.SetLabelForInput('origin',OriginStationCode,OriginStationName, $event);
						
		var DestinationsNA = [];
	
		var Destinations = Interjet.StationsAndMarketsInfo.Markets[OriginStationCode]				
		var StatusDisplay = "";
		
		var counter = 0;

		$.each(Interjet.StationsAndMarketsInfo.Zones , function( ZoneIndex, value ) {			
				var country = {Code:ZoneIndex, Name:value.Name, type:"Country"}
				DestinationsNA.push(country);
				$.each(Interjet.StationsAndMarketsInfo.Stations , function( index, value ) {
					if(value.CustomZone==ZoneIndex){		
						StatusDisplay = (Destinations.indexOf(value.Code) >= 0) ? "1" : "0";								
						var station = {Code:value.Code, Name:value.Name, type:"Station", CustomStyle:value.CustomStyle, StatusDisplay: StatusDisplay}
						DestinationsNA.push(station);    								
					}	   
				});		
			
		});
		$scope.DestinationsNA = chunk(DestinationsNA, 12);			
		
		//$('.booking-options-item[data-option="destination"] .btn-select').click();

				
	}
	
	
	$scope.SetLabelForInput = function(optionID, StationCode, StationName, $event){			
			switch(optionID) {
            case 'origin':
                var origin = StationName;
                var codeid = StationCode; 
                            
                $( $event.target).parents('.booking-options-item').find('.label-origin').removeClass('txt-gray').addClass('description txt-blue');
                $( $event.target).parents('.booking-options-item').find('.select-origin').html(origin + ' <span class="txt-blue station-code">('+ codeid +')</span>');
                $('.search-origin').val('');
                $('.places-origin').find('li').show();
                $('.booking-options-menu').stop().slideUp();
                $('.booking-bg').fadeOut();
                $('.booking-options-item').find('button.btn-select').removeClass('active');
                break;
            case 'destination':
                var destination = StationName;
                var codeid = StationCode;
                $($event.target).parents('.booking-options-item').find('.label-destination').removeClass('txt-gray').addClass('description txt-blue');
                $($event.target).parents('.booking-options-item').find('.select-destination').html(destination + ' <span class="txt-blue station-code">('+ codeid +')</span>');
                $('.search-destination').val('');
                $('.places-destination').find('li').show();
                $('.booking-options-menu').stop().slideUp();
                $('.booking-bg').fadeOut();
                $('.booking-options-item').find('button.btn-select').removeClass('active');
                break;
        }
	}

	$scope.CloseDestinationsModal = function (DestinationStationCode, DestinationStationName, event){					
		$('input[id*="TextBoxMarketDestination1"]').val(DestinationStationCode.substring(0,3));			
		$('input[id="DestinationStationCode"]').val(DestinationStationCode);
		$('input[id="DestinationStation"]').val(DestinationStationName);		
		$('.booking-options-menu').stop().slideUp();
		INTERJET.SearchAvailability.EnableSearchButton($(this));
		$scope.SetLabelForInput('destination',DestinationStationCode, DestinationStationName, event);					

		if(INTERJET.SearchAvailability.IsMobile()==false){
			INTERJET.SearchAvailability.ShowPassengersContainer();	
		}		
		
	}	

}])	


$(function(){




	/*
	Validate if exist the enough values set in the booking search for enable the Search button.
	*/
	INTERJET.SearchAvailability.IsCriteriaSearchComplete = function(){
		if($('input[id*="TextBoxMarketOrigin1"]').val() !="" && $('input[id*="TextBoxMarketDestination1"]').val() != "" && ($('select[id*="DropDownListPassengerType_ADT"]').val() > 0 || $('select[id*="DropDownListPassengerType_CHD"]').val() > 0 )){			
			return true;
		}else{			
			return false;
		}
	}


	/*
	Enable Search button if exist the enought values set in the search criteria.
	*/

	INTERJET.SearchAvailability.EnableSearchButton = function(e){				

		if(INTERJET.SearchAvailability.IsCriteriaSearchComplete()){				
			$('#SearchAvailabilityButton').prop('disabled', false);
		}else{				
			$('#SearchAvailabilityButton').prop('disabled', true);			

			if(e.target.className.indexOf("btn-less") >= 0){				
				INTERJET.SearchAvailability.ShowValidationModal(e);
			}
			
		}
		return;
	}	

	INTERJET.SearchAvailability.ShowValidationModal = function(e){
			if(e.target.className.indexOf("btn-less") >= 0){				
				$('#BookingEngineDisplayErrors').modal("show");
			}
	}

	INTERJET.SearchAvailability.ShowPassengersContainer = function(){		
		 $('.booking-bg').fadeIn();
		if($('input[id*="TextBoxMarketOrigin1"]').val() !="" && $('input[id*="TextBoxMarketDestination1"]').val() != ""){
			  $('.booking-options-item[data-option="passengers"] .booking-options-menu').slideDown('400', function(){			  	
                        $(this).parent().find('button.btn-select').addClass('active');
                    });
				;	
			//$('.booking-options-item[data-option="passengers"] .btn-select').click();

                  /*  $('.booking-options-item[data-option="passengers"] .booking-options-menu').slideUp();
                    $('.booking-options-item').find('button.btn-select').removeClass('active');
                    $(this).parent().find('.booking-options-menu').slideDown('400', function(){
                        $(this).parent().find('button.btn-select').addClass('active');
                    });*/
		}
	}	




	$('input[id*="TextBoxMarketOrigin1"]').click(function(){		
		$('#OriginStations').modal("show");
	})

	var IsCriteriaSearchComplete = INTERJET.SearchAvailability.IsCriteriaSearchComplete();
	if(IsCriteriaSearchComplete){				
		$('#SearchAvailabilityButton').prop('disabled', false);
	}else{				
		$('#SearchAvailabilityButton').prop('disabled', true);			

		if(e.target.className.indexOf("btn-less") >= 0){				
			INTERJET.SearchAvailability.ShowValidationModal(e);
		}
		
	}

})
