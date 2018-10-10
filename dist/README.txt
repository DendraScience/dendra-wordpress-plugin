=== Plugin Name ===
Contributors: (this should be a list of wordpress.org userid's)
Tags: data, environmental, sensor, weather
Requires at least: 4.0
Tested up to: 4.9.8
Stable tag: trunk
License: BSD-2-Clause-FreeBSD
License URI: https://opensource.org/licenses/BSD-2-Clause

Shortcodes for displaying environmental sensor data stored in Dendra -- a cyberinfrastructure project for real-time sensor data storage, retrieval, management, and curation.

== Description ==

Dendra is a cyberinfrastructure project for real-time sensor data storage, retrieval, management, and curation. It is a cloud-based, multi-organizational system, designed to support massive permanent monitoring efforts.

This plugin provides a set of WordPress shortcodes for displaying environmental sensor data stored in Dendra.

At present, the shortcodes only work on non-SSL enabled WordPress sites.

Shortcodes:

*   `[dendra_station_conditions slug="angelo-south-meadow"]` -- Displays current station conditions in a table. A station slug must be provided. Multiple instances of this shortcode are allowed to be used on one page. No styling is applied, which allows the site's theme styling to take precedence.

== Installation ==

1. Upload `dendra.php` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Changelog ==

= 1.0 =
* Initial release.
