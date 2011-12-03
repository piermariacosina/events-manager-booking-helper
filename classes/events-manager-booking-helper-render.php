<?php
class BookingHelperRender
{
	public function __construct()
	{
		add_action( 'get_header', array(&$this, 'isPageEvent') );
	}
	public function isPageEvent()
	{
		global $wp_query;
		
		$page = $wp_query->get_queried_object();
		
		if( $page->post_type == 'event' )
		{
			wp_deregister_script( 'ui-core' );
			wp_deregister_script( 'ui-widget' );
			wp_enqueue_style( 'events-manager-booking-helper-ui-custom', BOOKING_HELPER_URL.'js/jquery-ui-custom/css/ui-lightness/jquery-ui-custom.css', '', '0.1' );
			wp_enqueue_script( 'events-manager-booking-helper-ui-custom', BOOKING_HELPER_URL.'js/jquery-ui-custom/jquery-ui-custom.min.js', array('jquery'), '0.1', false );
			wp_enqueue_style( 'events-manager-booking-helper', BOOKING_HELPER_URL.'css/css.css', '', '0.1' );
			wp_enqueue_script( 'events-manager-booking-helper', BOOKING_HELPER_URL.'js/js.js', array('jquery'), '0.1', true);
		}
	}
}
?>