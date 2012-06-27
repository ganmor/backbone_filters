(function() {
	_.extend(Backbone.Router.prototype, Backbone.Events, {
		before: {},
		_runFilters: function(filters, fragment, args) {
			if (_(filters).isEmpty()) 
				return true;
			
			var def = new $.Deferred();
			var beforeFiltersDefArray = [];
			_(filters).each(function(func, filterRoute) {
				if (!_.isRegExp(filterRoute)) {
					filterRoute = new RegExp(filterRoute);
				}
				if (filterRoute.test(fragment)) {
					var regexpResult = new RegExp( filterRoute ).exec( fragment );
					var result = (_.isFunction(func) ? func.apply(this, [ args , regexpResult ]) : this[func].apply(this, [ args , regexpResult] ));
					beforeFiltersDefArray.push( result );
				}
			}, this );
			
			$.when.apply( null, beforeFiltersDefArray ).done( function(){
				def.resolve();
			}); 
			return def;
		},
		 
		route: function( route , name , callback) {
			var instance_ = this;
			Backbone.history || (Backbone.history = new Backbone.History);
			if (!_.isRegExp(route)) route = this._routeToRegExp(route);
			Backbone.history.route(route, _.bind(function(fragment) {
				var args = this._extractParameters(route, fragment);
				this._runFilters(this.before, fragment, args).done(function(){
					if( !instance_.checkPageValidity( fragment )) return; // Warning : page will still be in the history..
					callback && callback.apply(instance_, [ args , fragment ] );
					instance_.trigger.apply(instance_, ['route:' + name].concat(args));
				});
			}, this));
		},
		
		/**
		 * Check if a particular fragment is still requested
		 * This will prevent user to be redirected to a page he did not want anymore
		 */
		checkPageValidity : function( fragment ){
			
			var normalisedFragment = Backbone.history.getFragment();
			if( normalisedFragment != fragment )
				return false;
			
			// TODO: If fragment is different from current fragment, return false
			return true;
		}
	});
}).call(this);