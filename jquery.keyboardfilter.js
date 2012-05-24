/**
 * Keyboard Filter v0.1.0
 * A jQuery plugin for filtering keypresses on elements
 * 
 * Boilerplate by http://jqueryboilerplate.com/
 * 
 * Author: Hannes Diercks, Hamburg 2012
 */
;(function ( $ ) {
	var pluginName = 'keybordfilter',
			document = window.document,
			defaults = {
				keydown: false,
				keyup: false,
				keypress: false,
				checkfailed: function( e ) {
					e.preventDefault();
					return false;
				},
				enable: [],
				disable: [],
				strictModifiers: true,
				groups: {
					keyboardNumbers: [48,49,50,51,52,53,54,55,56,57],
					numpadNumbers: [96,97,98,99,100,101,102,103,104,105],
					lowerLetters: [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90],
					upperLetters: ['+65','+66','+67','+68','+69','+70','+71','+72','+73','+74','+75','+76','+77','+78','+79','+80','+81','+82','+83','+84','+85','+86','+87','+88','+89','+90'],
					space: [32],
					backspace: [8],
					delete: [46],
					enter: [13],
					ccp: ['^88', '^67', '^86'], // CUT COPY PASE
					selectAll: ['^65'],
					arrows: [37,38,39,40],
					numpad: [
						'numpadNumbers',
						106,107,109,110,111,114,13
					],
					numbers: [
						'keyboardNumbers',
						'numpadNumbers'
					],
					keyboard: [
						'letters', 'keyboardNumbers'
					],
					letters: ['lowerLetters', 'upperLetters'],
					basicEdits: ['ccp', 'delete', 'backspace', 'selectAll', 'arrows'],
					alphaNumeric: ['numbers', 'letters']
				}
			};
			

	function Plugin( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options) ;
		this.init();
	}

	Plugin.prototype.init = function () { var
		thiz = this,

		_checkInternal = function( e, tocheck ) {
			// console.log(tocheck);
			var check = false;

			$.each( tocheck, function(k,v) {
				if( v == 'all' ) {
					// console.log('All');
					check = true;
					return false;
				} 
				else if(typeof v == 'number' && e.keyCode == v) {
					// console.log('number');
					if( thiz.options.strictModifiers 
					 && !e.ctrlKey && !e.shiftKey && !e.shiftKey
					) {
						check = true;
						return false;
					} else if( !thiz.options.strictModifiers ) {
						check = true;
						return false;
					}
					
				} 
				else if( typeof v == 'string' && typeof thiz.options.groups[v] != 'undefined' ) {
					// console.log('group');
					check = _checkInternal( e, thiz.options.groups[v] );
					if( check == true ) {
						return false;
					}
				} else if( typeof v == 'string' ) { var 
					v = new String(v),
					mod = v.replace(/[0-9]+/g,''),
					v = v.replace(/[^0-9]+/g,'');
					// console.log('mod');
					if( ( mod.indexOf('^') > -1 && e.ctrlKey && e.keyCode == v )
					 || ( mod.indexOf('+') > -1 && e.shiftKey && e.keyCode == v )
					 || ( mod.indexOf('!') > -1 && e.altKey && e.keyCode == v )
					) {
						check = true;
						return false;
					}
				}
			});
			return check;
		},

		_check = function( e ) {
			// console.log(_checkInternal( e, thiz.options.disable ));
			// console.log(_checkInternal( e, thiz.options.enable ));
			if( ( _checkInternal( e, thiz.options.disable ) && !_checkInternal( e, thiz.options.enable ) )
			 // || 
			){
				return false;
			}
			return true;
		};

		$(thiz.element).keydown( function( e ) {
			// console.log(e.keyCode);
			if( thiz.options.keydown ) {
				if( _check( e ) ) {
					if( typeof thiz.options.keydown == 'function' ) {
						thiz.options.keydown.call(thiz.element, e);
					}
					return true;
				}
				return thiz.options.checkfailed(e);
			}
		}).keyup( function( e ) {
			if( thiz.options.keyup ) {
				if( _check( e ) ) {
					if( typeof thiz.options.keyup == 'function' ) {
						thiz.options.keyup.call(thiz.element, e);
					}
					return true;
				}
				return thiz.options.checkfailed(e);
			}
		}).keypress( function( e ) {
			if( thiz.options.keypress ) {
				if( _check( e ) ) {
					if( typeof thiz.options.keypress == 'function' ) {
						thiz.options.keypress.call(thiz.element, e);
					}
					return true;
				}
				return thiz.options.checkfailed(e);
			}
		});
	};


	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
			}
		});
	}

}(jQuery));