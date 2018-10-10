<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://dendra.science
 * @since             1.0.0
 * @package           Dendra
 *
 * @wordpress-plugin
 * Plugin Name:       Dendra
 * Plugin URI:        https://github.com/DendraScience/dendra-wordpress-plugin
 * Description:       Shortcodes for displaying environmental sensor data stored in Dendra -- a cyberinfrastructure project for real-time sensor data storage, retrieval, management, and curation.
 * Version:           1.0.0
 * Author:            Dendra
 * Author URI:        http://dendra.science/
 * License:           BSD-2-Clause-FreeBSD
 * License URI:       https://opensource.org/licenses/BSD-2-Clause
 * Text Domain:       dendra
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'DENDRA_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-dendra-activator.php
 */
function activate_dendra() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-dendra-activator.php';
	Dendra_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-dendra-deactivator.php
 */
function deactivate_dendra() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-dendra-deactivator.php';
	Dendra_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_dendra' );
register_deactivation_hook( __FILE__, 'deactivate_dendra' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-dendra.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_dendra() {

	$plugin = new Dendra();
	$plugin->run();

}
run_dendra();
