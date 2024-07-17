class Base
{
	constructor()
	{
		this.loadBar = null;
	}

	/**
	 * initiate tooltips
	 */
	initTooltips()
	{
		var tooltipTriggerList = [].slice.call( document.querySelectorAll( '[data-bs-toggle="tooltip"]' ) );
		var tooltipList = tooltipTriggerList.map( function ( tooltipTriggerEl )
		{
			return new bootstrap.Tooltip( tooltipTriggerEl );
		} );

	}

	/**
	 * function to confirm
	 * @param {string} message 
	 * @param {function} callback 
	 */
	confirm( message, callback )
	{
		let btn = undefined;

		let dialog = new tingle.modal(
			{
				closeMethods: [],
				footer: true,
				stickyFooter: true,
				onOpen: () =>
				{
					if ( btn )
					{
						btn.focus();
					}
				},
				beforeOpen: () =>
				{
					const dialogContentDiv = document.getElementsByClassName( 'tingle-modal-box' );

					for ( let index = 0; index < dialogContentDiv.length; index++ )
					{
						const element = dialogContentDiv[ index ];
						element.classList.add( 'shadow' );
						if ( !element.classList.contains( 'custom-modal-large' ) )
						{

							element.classList.add( 'confirm-modal' );
						}
					}
				},
				onClose: () =>
				{
					dialog.destroy();
				}
			} );
		dialog.setContent( message );

		btn = dialog.addFooterBtn( 'YES', 'btn btn-primary float-end float-right', () =>
		{
			if ( typeof ( callback ) === 'function' )
			{
				callback( true );
			}
			dialog.close();
		} );



		dialog.addFooterBtn( 'No', 'btn btn-light border me-4 mr-4 float-end float-right', () =>
		{
			if ( typeof ( callback ) === 'function' )
			{
				callback( false );
			}
			dialog.close();
		} );

		dialog.open();
	}

	/**
	 * function to show alert
	 * @param {string} message 
	 */
	alert( message, callback )
	{
		let btn = undefined;
		let dialog = new tingle.modal(
			{
				closeMethods: [],
				footer: true,
				stickyFooter: true,
				onOpen: () =>
				{
					if ( btn )
					{
						btn.focus();
					}
				},
				beforeOpen: () =>
				{
					const dialogContentDiv = document.getElementsByClassName( 'tingle-modal-box' );
					for ( let index = 0; index < dialogContentDiv.length; index++ )
					{
						const element = dialogContentDiv[ index ];
						if ( !element.classList.contains( 'custom-modal-large' ) )
						{
							element.classList.add( 'alert-modal' );
						}
					}
				},
				onClose: () =>
				{
					dialog.destroy();
				}
			} );

		dialog.setContent( message );

		btn = dialog.addFooterBtn( 'OK', 'btn btn-primary float-end float-right', () =>
		{
			if ( typeof ( callback ) === 'function' )
			{
				callback();
			}
			dialog.close();
		} );

		dialog.open();
	}

	/**
	 * function show a bootbox prompt dialog
	 * @param {string} title 
	 * @param {function} callback 
	 */
	prompt( title, callback )
	{
		let dialog = new tingle.modal(
			{
				closeMethods: [],
				footer: true,
				stickyFooter: true,
				beforeOpen: () =>
				{
					const dialogContentDiv = document.getElementsByClassName( 'tingle-modal-box' );
					for ( let index = 0; index < dialogContentDiv.length; index++ )
					{
						const element = dialogContentDiv[ index ];
						element.classList.add( 'prompt-modal' );
					}
				},
				onClose: () =>
				{
					dialog.destroy();
				}
			} );
		let html = `
            <h5 class="card-title">${title}</h5>
            <input id='tinglePromptField' class='form-control'>
        `;
		dialog.setContent( html );

		dialog.addFooterBtn( 'OK', 'btn btn-primary float-end float-right', () =>
		{
			if ( typeof ( callback ) === 'function' )
			{
				callback( document.getElementById( 'tinglePromptField' ).value );
			}
			dialog.close();
		} );

		dialog.addFooterBtn( 'Cancel', 'btn btn-light border me-4 mr-4 float-end float-right', () =>
		{
			dialog.close();
		} );
		dialog.open();
	}

	/**
	 * function to load modal
	 * @param {string} title 
	 * @param {string} message 
	 * @param {function} showCallback 
	 * @param {function} submitCallback 
	 * @param {function} closeCallback 
	 * @param {string|bool} submitLabel 
	 * @param {bool} large
	 */
	modal( title, message, showCallback, submitCallback, closeCallback, submitLabel, large = false )
	{
		let showFooter = true;
		if ( typeof ( title ) === "undefined" )
		{
			title = "";
		}
		if ( typeof ( submitLabel ) === "undefined" )
		{
			submitLabel = "Submit";
		}

		if ( submitLabel === false )
		{
			showFooter = false;
		}

		let btn = undefined;
		let dialog = new tingle.modal(
			{
				closeMethods: [ 'escape' ],
				footer: true,
				stickyFooter: true,
				onOpen: () =>
				{
					if ( btn )
					{
						btn.focus();
					}

					if ( typeof ( showCallback ) === 'function' )
					{
						showCallback( dialog );
					}
					document.querySelector( 'body' ).classList.add( 'overflow-hidden' );
				},
				beforeOpen: () =>
				{
					const dialogContentDiv = document.getElementsByClassName( 'tingle-modal-box' );
					for ( let index = 0; index < dialogContentDiv.length; index++ )
					{
						const element = dialogContentDiv[ index ];
						element.classList.add( 'shadow' );
						if ( large ) 
						{
							element.classList.add( 'custom-modal-large' );
							document.querySelector( 'body' ).classList.add( 'has-large-modal' );
						}
						else
						{
							if ( !element.classList.contains( 'custom-modal-large' ) )
							{
								element.classList.add( 'custom-modal' );
							}
						}
					}
				},

				beforeClose: () =>
				{
					if ( typeof ( closeCallback ) === 'function' )
					{
						closeCallback();
					}
					return true;
				},
				onClose: () =>
				{
					dialog.destroy();
					document.querySelector( 'body' ).classList.remove( 'overflow-hidden' );
					document.querySelector( 'body' ).classList.remove( 'has-large-modal' );
				}
			} );

		let html = `
            <h1 class="color-1">${title}</h1>
            <div class="card border-0">
                <div class="card-body">
                    ${message}
                </div>
            </div>
        `;

		dialog.setContent( html );
		if ( showFooter )
		{
			btn = dialog.addFooterBtn( '<div class="modal-button-spinner d-none spinner-border text-light" role="status"> <span class="sr-only">Loading...</span></div>' + submitLabel, 'btn btn-primary float-end float-right', () =>
			{
				if ( typeof ( submitCallback ) === 'function' )
				{
					submitCallback( dialog );
				}
				// dialog.close();
			} );

			dialog.addFooterBtn( 'Cancel', 'btn btn-light border me-4 mr-4 float-end float-right', () =>
			{
				dialog.close();
			} );
		}
		else
		{
			dialog.addFooterBtn( 'Close', 'btn btn-dark border me-4 mr-4 float-end float-right', () =>
			{
				dialog.close();
			} );
		}
		dialog.open();

		return dialog;
	}

	resizeModal( modal, large = false )
	{
		modal.checkOverflow();
		setTimeout( () =>
		{
			if ( modal.isOverflow() ) 
			{
				modal.checkOverflow();
			}
		}, 300 );
		if ( large ) 
		{
			// console.log(document.querySelector('body.has-large-modal .tingle-modal .tingle-modal-box'));
			document.querySelector( 'body .tingle-modal .tingle-modal-box' ).style.height = 'auto';
		}
	}

	hashUrlParam( s )
	{
		//  discuss at: https://locutus.io/php/bin2hex/
		// original by: Kevin van Zonneveld (https://kvz.io)
		// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
		// bugfixed by: Linuxworld
		// improved by: ntoniazzi (https://locutus.io/php/bin2hex:361#comment_177616)
		//   example 1: bin2hex('Kev')
		//   returns 1: '4b6576'
		//   example 2: bin2hex(String.fromCharCode(0x00))
		//   returns 2: '00'
		let i;
		let l;
		let o = '';
		let n;
		s += '';
		for ( i = 0, l = s.length; i < l; i++ )
		{
			n = s.charCodeAt( i )
				.toString( 16 );
			o += n.length < 2 ? '0' + n : n;
		}
		return o;
	}

	unhashUrlParam( s )
	{
		const ret = [];
		let i = 0;
		let l;

		s += '';

		for ( l = s.length; i < l; i += 2 )
		{
			const c = parseInt( s.substr( i, 1 ), 16 );
			const k = parseInt( s.substr( i + 1, 1 ), 16 );
			if ( isNaN( c ) || isNaN( k ) ) return false;
			ret.push( ( c << 4 ) | k );
		}

		return String.fromCharCode.apply( String, ret );
	}

	ajax( url, method, data, successCallback, errorCallback, showLoad = true )
	{
		const self = this;
		let xhr = new XMLHttpRequest();
		xhr.open( method, url );
		// xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		xhr.responseType = 'json';

		// request state change event
		xhr.onreadystatechange = () =>
		{
			if ( showLoad ) 
			{
				self.loading( .2 );
			}
			// console.log( xhr );2
			// request completed?
			if ( xhr.readyState !== 4 )
			{
				if ( showLoad ) { self.loading( .5 ); }
			}
			else
			{
				if ( showLoad ) { self.loading( 1 ); }
				if ( xhr.status === 200 || xhr.status === 201)
				{

					// request successful - show response
					if ( typeof ( successCallback ) == 'function' ) 
					{
						successCallback( xhr.response );
					}

				}
				else
				{
					// request error

					if (
						typeof ( xhr.response.error ) &&
						typeof ( xhr.response.messages.error ) == 'string'
					) 
					{
						self.notify( xhr.statusText, xhr.response.messages.error, 'danger' );
					}
					else
					{
						/* generic errors */
						self.notify( xhr.statusText,
							`${xhr.response.title}<br>${xhr.response.message}`,
							'danger'
						);
					}

					/* load the callback */
					if ( typeof ( errorCallback ) == 'function' ) 
					{
						errorCallback( xhr.response );
					}
				}
			}
		};

		xhr.onprogress = ( event ) =>
		{
			if ( event.lengthComputable == true && showLoad ) 
			{
				self.loading( event.loaded / event.total );
			}
		};

		// start request
		xhr.send( data );
	}

	loading( percent )
	{
		const self = this;
		if ( self.loadBar == null )
		{
			self.loadBar = new ProgressBar.Line( '#progress', {
				strokeWidth: .5,
				easing: 'easeInOut',
				duration: 1000,
				color: 'var(--bs-primary)',
				trailColor: '#eee',
				trailWidth: 1,
				svgStyle: { width: '100%', height: '100%' }
			} );
		}

		self.loadBar.animate( percent, ( e ) =>
		{
			if ( percent == 1 )
			{
				self.loadBar.destroy();
				self.loadBar = null;
			}
		} );
	}

	notify( title, message, type, timeout = 0 )
	{
		const toastElmId = `toast-${Date.now()}`;
		const toastContainer = document.getElementById( 'toast-container' );
		let autoHide = 'false';
		if (type == 'success') 
		{
			autoHide  ='true';	
		}
		const toastHtml = `
        <div id="${toastElmId}" class="toast border-${type}" role="alert" 
        aria-live="assertive" aria-atomic="true" data-bs-autohide="${autoHide}">
            <div class="toast-header text-bg-${type} rounded-0">
                <strong class="me-auto text-capitalize">
                    ${title}
                </strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>`;

		if ( toastContainer ) 
		{
			toastContainer.innerHTML = toastContainer.innerHTML + toastHtml;
		}

		const newToast = document.getElementById( toastElmId );

		if ( newToast ) 
		{
			const toastBootstrap = bootstrap.Toast.getOrCreateInstance( newToast );
			toastBootstrap.show();
		}
		return newToast;
	}

	/**
	 * function to convert string to slug
	 * @param {string} str actual string
	 */
	slugify( str )
	{
		str = str.replace( /[\u0000-\u001F\u007F-\u009F]/g, "" );
		let strSlug = str.toLowerCase().replace( / /g, '-' ).replace( /[^\w-]+/g, '' );
		strSlug = strSlug.replace( /-+/g, "-" );
		return strSlug;
	}


	/**
	 * slug generator
	 *
	 * @memberof Base
	 */
	slugger()
	{
		let self = this;
		let inputs = document.getElementsByClassName( 'has-slug' );
		let slugFields = document.getElementsByClassName( 'slug-field' );
		if ( inputs ) 
		{
			for ( const inpt of inputs ) 
			{
				inpt.onkeyup = ( e ) =>
				{
					e.preventDefault();
					let target = document.getElementById( inpt.dataset.targetInput );
					if ( target ) 
					{
						target.onkeyup = ( e ) =>
						{
							target.value = self.slugify( target.value );
						};
						target.value = self.slugify( inpt.value );
					}
				};
			}
		}

		if ( slugFields ) 
		{
			for ( const fld of slugFields ) 
			{
				fld.onkeyup = ( e ) =>
				{
					e.preventDefault();
					fld.value = self.slugify( fld.value );
				};
			}
		}
	}

	/**
	 * Format bytes as human-readable text.
	 * 
	 * @param bytes Number of bytes.
	 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
	 *           binary (IEC), aka powers of 1024.
	 * @param dp Number of decimal places to display.
	 * 
	 * @return Formatted string.
	 */
	humanFileSize( bytes, si = false, dp = 1 )
	{
		const thresh = si ? 1000 : 1024;

		if ( Math.abs( bytes ) < thresh )
		{
			return bytes + ' B';
		}

		const units = si ? [ 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ] : [ 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB' ];
		let u = -1;
		const r = 10 ** dp;

		do
		{
			bytes /= thresh;
			++u;
		} while ( Math.round( Math.abs( bytes ) * r ) / r >= thresh && u < units.length - 1 );


		return bytes.toFixed( dp ) + ' ' + units[ u ];
	}

	initClipboard()
	{
		const self = this;
		const clipboardElms = document.getElementsByClassName( 'clipboard' );
		if ( clipboardElms ) 
		{
			for ( const elm of clipboardElms ) 
			{
				elm.onclick = ( e ) =>
				{
					navigator.clipboard.writeText( elm.dataset.text );
					self.notify('Success', 'Image path copied', 'success' );
				};
			}
		}
	}

	isInViewport( el, partiallyVisible = false )
	{
		const { top, left, bottom, right } = el.getBoundingClientRect();
		const { innerHeight, innerWidth } = window;
		return partiallyVisible
			? ( ( top > 0 && top < innerHeight ) ||
				( bottom > 0 && bottom < innerHeight ) ) &&
			( ( left > 0 && left < innerWidth ) || ( right > 0 && right < innerWidth ) )
			: top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
	}

	makeSelectSearchable( elm )
	{
		if ( elm )
		{
			let niceInstance = NiceSelect.bind( elm, { searchable: true } );
			return niceInstance;
		}
	}
}

( () =>
{
	let base = new Base();
	base.initTooltips();
	base.initClipboard();
	/* set footer at bottom */
	if ( document.body.classList.contains( 'desktop' ) ) 
	{
		let smhElm = document.getElementById( 'set-min-height' );
		let footer = document.getElementsByTagName( 'footer' );
		if ( smhElm && footer ) 
		{
			footer = footer[ 0 ];
			let height = window.innerHeight - ( footer.offsetHeight * 3 );
			console.log( height );
			smhElm.style.minHeight = `${height}px`;
		}
	}
} )();