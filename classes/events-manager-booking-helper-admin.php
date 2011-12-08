<?php
class EventsManagerBookingHelperAdmin
{
	public function __construct()
	{
		$plugin_page = add_submenu_page( 'edit.php?post_type='.EM_POST_TYPE_EVENT, 'Event Bookings Splits', 'Styles', 'edit_events', "events-manager-splits", 'nonna_nonna_admin_splits_page');
		add_action( 'admin_print_styles-'. $plugin_page, 'nonna_admin_load_styles' );
		add_action( 'admin_head-'. $plugin_page, 'nonna_admin_general_style' );
		add_action( 'admin_print_styles-'. $plugin_page, 'nonna_admin_load_styles' );
	}
}
?>