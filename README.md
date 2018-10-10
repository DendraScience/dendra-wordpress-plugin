# Dendra WordPress Plugin

This plugin provides a set of WordPress shortcodes for displaying environmental sensor data stored in Dendra.

At present, the shortcodes only work on non-SSL enabled WordPress sites.

Shortcodes:

*   `[dendra_station_conditions slug="angelo-south-meadow"]` -- Displays current station conditions in a table. A station slug must be provided. Multiple instances of this shortcode are allowed to be used on one page. No styling is applied, which allows the site's theme styling to take precedence.

## TODO

- [ ] [Reduce bundle size](https://github.com/rjm0017/external-bundle-issue/blob/master/vue.config.js)
- [ ] [Deploy clean archive for install](https://jonbellah.com/articles/recursively-remove-ds-store/)

## Notes

* Requires [WP-CLI](https://make.wordpress.org/cli/handbook/installing/). Example `brew install wp-cli`.

* Planned shortcodes

  * `dendra_station_conditions`
  * `dendra_station_month`
  * `dendra_station_month_table`
  * `dendra_variable_month`
  * `dendra_variable_week_graph`

## Snippets

```
# For development via HMR
$ wp option add dendra_client_js http://localhost:8080/app.js

$ wp option delete dendra_client_js
```
