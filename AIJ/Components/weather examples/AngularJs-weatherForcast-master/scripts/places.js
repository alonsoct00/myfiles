var geocoder;

function initialize() {
    geocoder = new google.maps.Geocoder();
}

$(document).ready(function () {
    setTimeout(function () {
        $("#search").autocomplete({
            appendTo: "#results",
            minLength: 3,
            source: function (request, response) {
                geocoder.geocode({
                    'address': request.term
                }, function (results) {
                    response($.map(results, function (item) {
                        return {
                            label: item.formatted_address
                        }
                    }))
                })
            }
        });
    }, 300);
    $("#search").autocomplete("destroy");
});
