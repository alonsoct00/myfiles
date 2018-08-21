
$(document).ready(function () {

    $('#Modal_Clasic .prev').click(function (e) {          
        var DateParts = ITJCalendars.SelectedDate.split("-");
        var BeginDate = new Date(DateParts[0], Number(DateParts[1])-1, DateParts[2]).addMonths(-1);               
        var StringBeginDate =   formatDate(BeginDate);        
        setValuesModalCalendarClasic(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);        
        SearchCalendarSelectClasic(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);
        e.preventDefault(); 
    });

    $('#Modal_Clasic .next').click(function (e) {        

        var DateParts = ITJCalendars.SelectedDate.split("-");
        var BeginDate = new Date(DateParts[0], Number(DateParts[1])-1, DateParts[2]).addMonths(1);        
        var StringBeginDate =   formatDate(BeginDate);        
        setValuesModalCalendarClasic(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);        
        SearchCalendarSelectClasic(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);
        e.preventDefault(); 
    });

     $('#Modal_Graphs .month .prev').click(function (e) {        
        var DateParts = ITJCalendars.SelectedDate.split("-");
        var BeginDate = new Date(DateParts[0], Number(DateParts[1])-1, DateParts[2]).addMonths(-1);               
        var StringBeginDate =   formatDate(BeginDate)
        setValuesModalCalendarGraph(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);        
        SearchCalendarSelectGraphs(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);
        e.preventDefault(); 
    });

    $('#Modal_Graphs .month .next').click(function (e) {    

        var DateParts = ITJCalendars.SelectedDate.split("-");
        var BeginDate = new Date(DateParts[0], Number(DateParts[1])-1, DateParts[2]).addMonths(1);               
        var StringBeginDate =   formatDate(BeginDate);        
        setValuesModalCalendarGraph(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);        
        SearchCalendarSelectGraphs(ITJCalendars.MarketIndex, StringBeginDate, ITJCalendars.DeptStationCode, ITJCalendars.ArrvStationCode);
        e.preventDefault(); 
    });

    function setValuesModalCalendarGraph(MarketIndex, BeginDate, DepartureStation, ArrivalStation){
        ITJCalendars.SelectedDate = BeginDate;
        ITJCalendars.DeptStationCode = DepartureStation;
        ITJCalendars.ArrvStationCode = ArrivalStation;
        ITJCalendars.MarketIndex = Number(MarketIndex);        
    }

    function setValuesModalCalendarClasic(MarketIndex, BeginDate, DepartureStation, ArrivalStation){
        $('.calendar-title .flight-type').hide();   
        $('#ClasicModalFlightTitle'+Number(MarketIndex+1)).show(); 

        ITJCalendars.SelectedDate = BeginDate;
        ITJCalendars.DeptStationCode = DepartureStation;
        ITJCalendars.ArrvStationCode = ArrivalStation;
        ITJCalendars.MarketIndex = Number(MarketIndex);        
    }

    function SearchCalendarSelectGraphs(ValMarketIndex, ValBeginDate,  ValDepartureStation, ValArrivalStation){
        $("#Calendar_Graphs").html("");      
        $("#Calendar_Graphs").append('<div id="img-logo"><img src="/assetsV2/img/logo-interjet-loader.png" alt="Interjet-Logo"/></div><br/><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');        
        $('#Modal_Graphs .next, #Modal_Graphs .prev').hide()
         $('#ChangeDateGraphCalendar').hide()
        $.ajax({
            type: "GET",
                url: 'CalendarSelectBarAjax.aspx',
                contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
                data: {MarketIndex: ValMarketIndex, BeginDate: ValBeginDate, DepartureStation:ValDepartureStation, ArrivalStation:ValArrivalStation,CurrencyCode:ITJCalendars.CurrencyCode, PaxResidentCountry:ITJCalendars.PaxResidentCountry},
                success: function(result) {                  
                   $("#Calendar_Graphs").html(result);                      
                   $('#Modal_Graphs .next, #Modal_Graphs .prev').show()
                   $('#ChangeDateGraphCalendar').show()
                }
        });
    }

    function SearchCalendarSelectClasic(ValMarketIndex, ValBeginDate,  ValDepartureStation, ValArrivalStation){
        $("#Calendar_Clasic").html("");      
        $("#Calendar_Clasic").append('<div id="img-logo"><img src="/assetsV2/img/logo-interjet-loader.png" alt="Interjet-Logo"/></div><br/><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');        
        $('#Modal_Clasic .next, #Modal_Clasic .prev').hide()
        $('#ChangeDateClasicCalendar').hide()
        $.ajax({
            type: "GET",
                url: 'CalendarSelectClasicAjax.aspx',
                contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
                data: {MarketIndex: ValMarketIndex, BeginDate: ValBeginDate, DepartureStation:ValDepartureStation, ArrivalStation:ValArrivalStation,CurrencyCode:ITJCalendars.CurrencyCode, PaxResidentCountry:ITJCalendars.PaxResidentCountry},
                success: function(result) {                   
                    $("#Calendar_Clasic").html(result);                      
                    $('#Modal_Clasic .next, #Modal_Clasic .prev').show()
                    $('#ChangeDateClasicCalendar').show()
                }
        });
    }
   
   
})


