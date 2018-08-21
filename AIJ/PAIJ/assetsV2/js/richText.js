$(document).ready(function() {

    // Breadcrumbs
    setBreadcrumbs();

    // Iframe Height
    setIfrmHeight();

    //video modal
    $('.show-rich-video').unbind('click')
        .bind('click', function(e) {
            var tgt = $(this);
            var id = tgt.attr('data-yt-id');
            e.preventDefault();
            $('.modal-body .video-wrp').html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>');
            $('.modalvideo').modal('show');
        })
        .on('hidde.bs.modal', function(e) {
            e.preventDefault();
            $('.video-wrp').html(' ');
        });

    $('.modal-content').on('click', function() {
        $('.modalvideo').modal('hide');
        $('.video-wrp').html(' ');
    });

    $(window).bind('resize', function() {

        setIfrmHeight();

    });

    // Funciones

    function setIfrmHeight() {

        if ($('.gap-pb iframe').get(0)) {

            for (var i = 0; i < $('.gap-pb iframe').length; i++) {

                var src = $('.gap-pb iframe').eq(i).attr('src');

                if (src.indexOf('youtube') != -1) {

                    $('.gap-pb iframe').eq(i).height(parseInt($('.gap-pb iframe').eq(i).offsetParent().parent().find('img').eq(0).height()));

                }
            };

        }

    }

    function setBreadcrumbs() {
        var urlHref = location.href.split('/').slice(3);
        var parts = [{ "text": 'Home', "link": '/' }];

        var breadcrumbWrp = $('<nav aria-label="breadcrumb" class="row">' +
            '<ol class="breadcrumb breadcrumb-nav">' +
            '</ol>' +
            '</nav>');

        $(' .breadcrumb-container ').html(breadcrumbWrp);

        for (var i = 1; i < urlHref.length; i++) {
            var part = urlHref[i];
            var tempText = part.toLowerCase().replace(/-/g, ' ').split('.');
            var text = capitalize(tempText[0]);
            var link = '/' + urlHref.slice(0, i + 1).join('/');
            parts.push({ "text": text, "link": link });
        }

        for (var n = 0; n < parts.length; n++) {
            var html;
            if (n === 0) {
                html = $('<li class="breadcrumb-item"><a href="' + parts[n].link + '">' + parts[n].text + '</a></li>');
            } else if (n < parts.length - 1) {
                html = $('<li class="breadcrumb-item">' + parts[n].text + '</li>');
            } else {
                html = $('<li class="breadcrumb-item active" aria-current="page">' + parts[n].text + '</li>');
            }
            $('.breadcrumb-nav').append(html);
        };
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

});