<?php
class BookingHelperRender
{
	public function __construct()
	{
		add_action( 'get_header', array(&$this, 'isPageEvent') );
		add_filter( 'em_booking_save', array(&$this, 'saveAmounts'), 1, 2 );
		add_filter( 'em_booking_set_status', array(&$this, 'cancelBooking'), 10, 2 );
	}
	public function isPageEvent()
	{
		global $wp_query;
		
		$page = $wp_query->get_queried_object();
		
		if( $page->post_type == 'event' && !is_admin() )
		{
			wp_deregister_script( 'ui-core' );
			wp_deregister_script( 'ui-widget' );
			wp_enqueue_style( 'events-manager-booking-helper-ui-custom', BOOKING_HELPER_URL.'js/jquery-ui-custom/css/ui-lightness/jquery-ui-custom.css', '', '0.1' );
			wp_enqueue_script( 'events-manager-booking-helper-ui-custom', BOOKING_HELPER_URL.'js/jquery-ui-custom/jquery-ui-custom.min.js', array('jquery'), '0.1', false );
			wp_enqueue_style( 'events-manager-booking-helper', BOOKING_HELPER_URL.'css/css.css', '', '0.1' );
			wp_enqueue_script( 'events-manager-booking-helper', BOOKING_HELPER_URL.'js/js.js', array('jquery'), '0.1', false);
			wp_localize_script( 'events-manager-booking-helper', 'NonnaHelper', array( 'post_id' => $page->ID ));
		}
	}
	public function saveAmounts( $result,$EM_Event  )
	{
		global $wpdb;
		
		if( $result && !empty($_POST['donate']) )
		{
			wp_parse_args($_POST);
			extract($_POST, EXTR_SKIP);
			$wpdb->query("INSERT INTO ".EM_META_TABLE." (object_id, meta_key, meta_value) VALUES ( {$EM_Event->id}, 'split_amount_dev', {$split_amount_dev})");
			$wpdb->query("INSERT INTO ".EM_META_TABLE." (object_id, meta_key, meta_value) VALUES ( {$EM_Event->id}, 'split_amount_cook', {$split_amount_cook})");
			$wpdb->query("INSERT INTO ".EM_META_TABLE." (object_id, meta_key, meta_value) VALUES ( {$EM_Event->id}, 'split_amount_charity', {$split_amount_charity})");
		}
		return true;
	}
	public function cancelBooking( $result, $EM_Booking  )
	{
		global $wpdb;
		if( $EM_Booking->can_manage('manage_bookings','manage_others_bookings') && $EM_Booking->booking_status == 3 )
		{
			$sql = $wpdb->prepare("DELETE FROM ". EM_META_TABLE . " WHERE object_id = '$EM_Booking->booking_id'");
			$result = $wpdb->query( $sql );
		}
		return $result;
	}
}
?>