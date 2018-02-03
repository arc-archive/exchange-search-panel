[![Build Status](https://travis-ci.org/advanced-rest-client/exchange-search-panel.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/exchange-search-panel)  

# exchange-search-panel

An element that displays an UI to search Anypoint Exchange for RAML (REST API) resources.

It handles queries to the exchange server, displays list of results, handles user query
and downloads API data on user request.
It dispatches `process-incoming-data` custom event when user data are ready.

### Example
```
<exchange-search-panel on-process-incoming-data="_dataReady"></exchange-search-panel>
```

Note: This is very early version of the element and it most probably will change.
However the genral logic will be the same for this element.

### Styling
`<exchange-search-panel>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--exchange-search-panel` | Mixin applied to the element | `{}`
`--exchange-search-panel-header` | Mixin applied to the header section with title and the list control buttons | `{}`
`--arc-font-headline` | Mixin applied to the title of the panel | `{}`
`--exchange-search-panel-toggle-view-active-background-color` | Background color of the lost control buttons | `#00A1DF`
`--exchange-search-panel-toggle-view-active-color` | Color of the lost control buttons | `#00A1DF`
`--warning-primary-color` | Main color of the warning messages | `#FF7043`
`--warning-contrast-color` | Contrast color for the warning color | `#fff`
`--error-toast` | Mixin applied to the error toast | `{}`
`--empty-info` | Mixin applied to the label rendered when no data is available. | `{}`
`--exchange-search-panel-list` | Mixin applied to the list element | `{}`
`--action-button` | Mixin applied to the "load more" button | `{}`
`--action-button-hover` | Mixin applied to the "load more" button when hovered | `{}`



### Events
| Name | Description | Params |
| --- | --- | --- |
| oauth2-token-requested | Dispatched when the element or user request access token from the Exchange server. | state **String** -  |
clientId **String** -  |
redirectUrl **String** -  |
type **String** - Always `implicit` |
authorizationUrl **String** -  |
interactive **String** - After loading the element it tries the non-interactive method of authorization. When auth button is clicked then this value is always `true`. |
| process-incoming-data | Fired when RAML data were read and ready to be processed.  Note, the event can be canceled. | type **String** - Always `raml`. |
filesystem **?Array** - Optional. If there was a list of files associated with the import then it contains list of the files. |
file **Blob** - The main RAML file. |
