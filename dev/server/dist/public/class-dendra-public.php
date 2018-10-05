<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Dendra
 * @subpackage Dendra/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Dendra
 * @subpackage Dendra/public
 * @author     Your Name <email@example.com>
 */
class Dendra_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private $client_js;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->client_js = get_option( 'dendra_client_js' );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Dendra_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Dendra_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( ! $this->client_js ) {
			wp_enqueue_style( $this->plugin_name . '-client', plugin_dir_url( __FILE__ ) . 'css/dendraClient.css', array(), $this->version, 'all' );
		}

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/dendra-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Dendra_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Dendra_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/dendra-public.js', array( 'jquery' ), $this->version, false );

		if ( $this->client_js ) {
			wp_register_script( $this->plugin_name . '-client', $this->client_js, array( ), $this->version, true );
		} else {
			wp_register_script( $this->plugin_name . '-vue', 'https://unpkg.com/vue', array( ), $this->version, true );
			wp_register_script( $this->plugin_name . '-client', plugin_dir_url( __FILE__ ) . 'js/dendraClient.umd.min.js', array( ), $this->version, true );
		}

	}

	public function register_shortcodes() {

		add_shortcode( 'dendra_station_month_table', array( $this, 'render_shortcode' ) );
		add_shortcode( 'dendra_station_oneday', array( $this, 'render_shortcode' ) );

	}

	public function render_shortcode( $atts = [], $content = null, $tag = '' ) {

		wp_enqueue_script( $this->plugin_name . '-vue' );
		wp_enqueue_script( $this->plugin_name . '-client' );

		$dataset = array_reduce(
        	array_keys($atts),
        	function ($carry, $key) use ($atts) {
            	return $carry . ' data-att-' . $key . '="' . esc_attr( $atts[$key] ) . '"';
        	},
        	'data-tag="' . esc_attr( $tag ) . '"'
    	);

		return '<div class="dendra"><div class="dendra-app" ' . $dataset . ' /></div>';

	}

}
