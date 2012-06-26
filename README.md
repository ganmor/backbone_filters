_Disclaimer: This fork has been updated to work with Backbone 0.9.2
# Usage

Include `backbone_filters.js` after Backbone.

In your router you can now add:

```javascript
before: {
	'^clerks' : function( args , regexpResult ) {
		/* do stuff to all routes starting with 'clerks' */
		/* return deferred resolved when before filter applied , reject deferred to alter execution */
		/* regexpResult Match found on your regexp*/
	},
	'another reg ex' : function() { }
}
```

If a before filter deferred is rejected, the action in the Router will not be called. 
Your filters will receive the same arguments that get passed to the actions.