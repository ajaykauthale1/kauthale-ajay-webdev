$(document).ready(function(){
    var response = $.ajax({
        url: '/api/users',
        type: 'GET',
        data: 'query=' + "",
        datatType: 'JSON',
        async: true
    });

    var results = [];
    response.done(function (data) {
        var results = [];
        for (var d in data) {
            results.push(data[d].username);
        }
        var results = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: results
        });

        $('#typeahead').typeahead({
                hint: true,
                highlight: true, /* Enable substring highlighting */
                minLength: 1 /* Specify minimum characters required for showing result */
            },
            {
                source: results
            });

        $('#typeahead').on('typeahead:selected', function(evt, item) {
            $(location).attr('href','/EMS/#/user_friend/'+item);
            location.reload();
        });

        $('#typeahead1').typeahead({
                hint: true,
                highlight: true, /* Enable substring highlighting */
                minLength: 1 /* Specify minimum characters required for showing result */
            },
            {
                source: results
            });

        $('#typeahead1').on('typeahead:selected', function(evt, item) {
            $(location).attr('href','/EMS/#/user_friend/'+item);
            location.reload();
        });

        $('#typeahead2').typeahead({
                hint: true,
                highlight: true, /* Enable substring highlighting */
                minLength: 1 /* Specify minimum characters required for showing result */
            },
            {
                source: results
            });

        $('#typeahead1').on('typeahead:selected', function(evt, item) {
            $(location).attr('href','/EMS/#/user_friend/'+item);
            location.reload();
        });


        $('#datetimepicker').datepicker();
        $('#timepicker').timepicker(
            {
                timeFormat: 'h:mm p',
                interval: 15,
                defaultTime: '11',
                startTime: '10:00',
                dynamic: false,
                dropdown: true,
                scrollbar: true
            }
        );
        $('#timepicker').on('changeTime', function() {
            alert($(this).val());
        });

        $("#location")
            .geocomplete()
            .bind("geocode:result", function(event, result){
                $("#location").value = result.formatted_address;
            });
    });
});