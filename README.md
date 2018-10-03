# Dendra WordPress Plugin

**!!! ACTIVELY BEING DEVELOPED !!!**

WordPress plugin for displaying weather station data.

## TODO

- [ ] [Reduce bundle size](https://github.com/rjm0017/external-bundle-issue/blob/master/vue.config.js)
- [ ] [Deploy clean archive for install](https://jonbellah.com/articles/recursively-remove-ds-store/)


## Notes

* Requires [WP-CLI](https://make.wordpress.org/cli/handbook/installing/). Example `brew install wp-cli`.

## Snippets

```
# For development via HMR
$ wp option add dendra_client_js http://localhost:8080/app.js

$ wp option delete dendra_client_js
```
