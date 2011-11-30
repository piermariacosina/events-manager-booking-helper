<?php
/*
Plugin Name: Events manager Booking Helper
Plugin URI: 
Description: Adds controls over booking process, helps sharing payments between Nonna actors
Version: Alpha 0.1
Requires at least: WordPress 2.9.1 / BuddyPress 1.2
Tested up to: WordPress 2.9.1 / BuddyPress 1.2
License: GNU/GPL 2
Author: Riccardo Strobbia
Author URI: 
*/

/****DEBUG ONLY************* SET TO "0" IN PRODUCTION************/
//error_reporting(E_ALL); 
//ini_set("display_errors", 0);

/* Only load code that needs BuddyPress to run once BP is loaded and initialized. */
function bpBookingHelper() {
	require_once( dirname( __FILE__ ) . '/events-manager-booking-helper.php' );
}
add_action( 'bp_include', 'bpBookingHelper' );
?>