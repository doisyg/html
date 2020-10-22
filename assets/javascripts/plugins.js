// Slider
(function( $ ) {

	'use strict';

	if ( $.isFunction($.fn[ 'slider' ]) ) {

		$(function() {
			$('[data-plugin-slider]').each(function() {
				var $this = $( this ),
					opts = {};

				var pluginOptions = $this.data('plugin-options');
				if (pluginOptions) {
					opts = pluginOptions;
				}

				$this.adminPluginSlider(opts);
			});
		});

	}

}).apply(this, [ jQuery ]);

// Slider
(function(admin, $) {

	admin = admin || {};

	var instanceName = '__slider';

	var PluginSlider = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginSlider.defaults = {

	};

	PluginSlider.prototype = {
		initialize: function($el, opts) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setVars()
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setVars: function() {
			var $output = $( this.$el.data('plugin-slider-output') );
			this.$output = $output.get(0) ? $output : null;

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			var _self = this;
			this.options = $.extend( true, {}, PluginSlider.defaults, opts );

			if ( this.$output ) {
				$.extend( this.options, {
					slide: function( event, ui ) {
						_self.onSlide( event, ui );
					}
				});
			}

			return this;
		},

		build: function() {
			this.$el.slider( this.options );

			return this;
		},

		onSlide: function( event, ui ) {
			if ( !ui.values ) {
				this.$output.val( ui.value );
			} else {
				this.$output.val( ui.values[ 0 ] + '/' + ui.values[ 1 ] );
			}

			this.$output.trigger('change');
		}
	};

	// expose to scope
	$.extend(admin, {
		PluginSlider: PluginSlider
	});

	// jquery plugin
	$.fn.adminPluginSlider = function(opts) {
		return this.each(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginSlider($this, opts);
			}

		});
	}

}).apply(this, [ window.admin, jQuery ]);

// Colorpicker
(function( $ ) {

	'use strict';

	if ( $.isFunction($.fn[ 'colorpicker' ]) ) {

		$(function() {
			$('[data-plugin-colorpicker]').each(function() {
				var $this = $( this ),
					opts = {};

				var pluginOptions = $this.data('plugin-options');
				if (pluginOptions)
					opts = pluginOptions;

				$this.adminPluginColorPicker(opts);
			});
		});

	}

}).apply(this, [ jQuery ]);

// Colorpicker
(function(admin, $) {

	admin = admin || {};

	var instanceName = '__colorpicker';

	var PluginColorPicker = function($el, opts) {
		return this.initialize($el, opts);
	};

	PluginColorPicker.defaults = {
	};

	PluginColorPicker.prototype = {
		initialize: function($el, opts) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.setOptions(opts)
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		setOptions: function(opts) {
			this.options = $.extend( true, {}, PluginColorPicker.defaults, opts );

			return this;
		},

		build: function() {
			this.$el.colorpicker( this.options );

			return this;
		}
	};

	// expose to scope
	$.extend(admin, {
		PluginColorPicker: PluginColorPicker
	});

	// jquery plugin
	$.fn.adminPluginColorPicker = function(opts) {
		return this.each(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginColorPicker($this, opts);
			}

		});
	}

}).apply(this, [ window.admin, jQuery ]);


// iosSwitcher
(function(theme, $) {

	theme = theme || {};

	var instanceName = '__IOS7Switch';

	var PluginIOS7Switch = function($el) {
		return this.initialize($el);
	};

	PluginIOS7Switch.prototype = {
		initialize: function($el) {
			if ( $el.data( instanceName ) ) {
				return this;
			}

			this.$el = $el;

			this
				.setData()
				.build();

			return this;
		},

		setData: function() {
			this.$el.data(instanceName, this);

			return this;
		},

		build: function() {
			var switcher = new Switch( this.$el.get(0) );

			$( switcher.el ).on( 'click', function( e ) {
				e.preventDefault();
				switcher.toggle();
			});

			return this;
		}
	};

	// expose to scope
	$.extend(theme, {
		PluginIOS7Switch: PluginIOS7Switch
	});

	// jquery plugin
	$.fn.themePluginIOS7Switch = function(opts) {
		return this.each(function() {
			var $this = $(this);

			if ($this.data(instanceName)) {
				return $this.data(instanceName);
			} else {
				return new PluginIOS7Switch($this);
			}

		});
	}

}).apply(this, [ window.theme, jQuery ]);



// iosSwitcher
(function( $ ) {

	'use strict';

	if ( typeof Switch !== 'undefined' && $.isFunction( Switch ) ) {

		$(function() {
			$('[data-plugin-ios-switch]').each(function() {
				var $this = $( this );

				$this.themePluginIOS7Switch();
			});
		});

	}

}).apply(this, [ jQuery ]);
