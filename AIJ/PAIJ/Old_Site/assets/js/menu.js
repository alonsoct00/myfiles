jQuery(document).ready(function($) {


    

    //Mash meni init
    $('.mash-menu').mashableMenu({
        separator: true, //-- Options (true) or (false). This option is used to show the vertical line between menu list items
        ripple_effect: true, //-- Options (true) or (false). This option is used to on - off the google ripple effect on menu items. Which is shown on mouse click
        search_bar_hide: false, //-- Options (true) or (false). This option is used to hide the search bar
        top_fixed: false, //-- Options (true) or (false). This option is used to fixed the menu top of the screen. Note: If this option becomes true then the sticky_header option will not work
        full_width: true, //-- Options (true) or (false). This option is used to make the menu full with
        trigger: 'hover', //-- Options (click) or (hover). This option is used to showing the drop down on mouse click or mouse hover
        /* VERTICAL TABS */
        vertical_tabs_trigger: 'hover', // Options (click) or (hover). This option is used to showing the vertical tabs on mouse click or mouse hover
        vertical_tabs_effect_speed: 800, // Value in milliseconds. This option is used to change the vertical tabs showing or hiding speed
        /* RESPONSIVE TABS */
        //responsive_tabs_effect_speed   : 200,       // Value in milliseconds. This option is used to change the responsive tabs showing or hiding speed
        /* DROP DOWN */
        drop_down_effect_in_speed: 100, // Value in milliseconds. This options is used to change the drop downs showing speed
        drop_down_effect_out_speed: 100, // Value in milliseconds. This option is used for change the drop downs hiding speed
        drop_down_effect_in_delay: 100, // Value in milliseconds. This option is used to change the drop downs showing delay speed. It means drop down shows after some time
        drop_down_effect_out_delay: 100, // Value in milliseconds. This option is used to change the drop downs hiding delay speed. It means drop down hides after some time
        outside_close_dropDown: true, // Options (true) or (false). This option is used to hide the showing drop downs when user click outside the menu
        /* STICKY HEADER */
        sticky_header: false, //-- Options (true) or (false). This option is used to make the menu sticky on top of the screen on desktop mode. When user scroll down or reach the specific height
        sticky_header_height: 768, //-- Value in px. This option is used to define the sticky header height on desktop mode.
        sticky_header_animation_speed: 100, //-- Value in milliseconds. This option is used to change the sticky header animation effect speed on desktop mode
        /* INTERNAL LINKS */
        internal_links_enable: true, // Options (true) or (false). This option is used to enable the internal links target buttons to show the drop downs
        internal_links_toggle_drop_down: true, // Options (true) or (false). This option is used for toggle. Means show or hide the drop down with same button. If this option is not true. The drop down is not hide with click on same button
        internal_links_target_speed: 400, // Value set in milliseconds. This option is used to internal links target animation speed.
        /* MOBILE SETTINGS */
        mobile_search_bar_hide: false, //-- Options (true) or (false). This option is used to hide the search bar on mobile mode
        mobile_sticky_header: false, //-- Options (true) or (false). This options is used to make the menu sticky on top of the screen on mobile mode
        mobile_sticky_header_height: 100, //-- Value in milliseconds. This option is used to change the sticky header animation effect speed on mobile mode
        /* MEDIA QUERY WIDTH */
        media_query_max_width: 920 //-- This is media query max width in px unit. Which is Used for mobile screen. Don't change if you don't know about media query
    });

    





    $('.navbar-toggle').click(function() {
        $(".mash-list-items, .mash-search-bar, .mash-menu-club-interjet, .mash-help-items-mobile").slideToggle("fast");
        $(".mash-menu .vertical-tabs-content-container > a").removeClass("active");
    });

    function inicio() {
        var w = $(window).width();
        if (w > 768) {
            desktop();
        } else {
            mobile();
        }
    }

    function mobile() {}

    function desktop() {
        $('#club-interjet-menu, #bottom-navigation').remove();
    }


    

    


});
