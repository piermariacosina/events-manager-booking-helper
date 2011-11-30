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
		
		if( $page->post_name == 'events-eventi' )
		{
			wp_enqueue_style( 'events-manager-booking-helper', BOOKING_HELPER_URL.'css/css.css', '', '0.1' );
			wp_enqueue_script( 'events-manager-booking-helper', BOOKING_HELPER_URL.'js/js.js', array('jquery'), '0.1', false);
		}
	}
}
?>