<?php
define( 'BOOKING_HELPER_PATH', dirname(__FILE__) );
define( 'BOOKING_HELPER_URL', site_url().'/wp-content/plugins/events-manager-booking-helper/' );

require_once(BOOKING_HELPER_PATH.'/classes/events-manager-booking-helper-render.php');
require_once(BOOKING_HELPER_PATH.'/classes/events-manager-booking-helper-admin.php');

add_action( 'init', 'booking_helper_init_render', 10);
add_action( 'admin_menu', 'eventsManagerBookingHelperAdmin_init', 10);

function booking_helper_init_render()
{
	global $bookingHelperRender;
	$bookingHelperRender = new BookingHelperRender();
}
function eventsManagerBookingHelperAdmin_init()
{
	global $eventsManagerBookingHelperAdmin;
	$EventsManagerBookingHelperAdmin = new EventsManagerBookingHelperAdmin();
}
?>