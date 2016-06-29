// JavaScript Document
/* Establece los botones de social-media de la 
/* página principal
  ================================================== */
socialMediaPrincipal = function(){
	var dataLink = $('#shareme').data('text') + ' ' + $('#shareme').data('url');
	$('#shareme').sharrre({
		share: {
			googlePlus: true,
			twitter: true,
			facebook: true/*,
			pinterest: true*/
		},
		buttons: {
			googlePlus: {url: $('#shareme').data('url'), size: 'medium', lang: 'es-ES', annotation: dataLink},
			facebook: {url: $('#shareme').data('url'), action: 'like', layout: 'button_count', lang: 'es_ES'},
			twitter: {url: $('#shareme').data('url'), count: 'horizontal', related: App.Config.refererTwitter, lang: 'es'}/*,
			pinterest: {media: 'http://sharrre.com/img/example1.png', description: $('#shareme').data('text'), layout: 'horizontal'}*/
		},
		urlCurl: '',
		//template: '<div class="box"><div class="left">Comparte</div><div class="middle"><a href="#" class="facebook">f</a><a href="#" class="twitter">t</a><a href="#" class="googleplus">+1</a><a href="#" class="pinterest">p</a></div><div class="right">{total}</div></div>',
		enableHover: false,
		enableCounter: false,
		enableTracking: true
	});
}
/* Establece los botones de social-media del popup
  ================================================== */
socialMediaPopup = function(){
	var dataLink = $('#shareme-popup').data('text') + ' ' + $('#shareme-popup').data('url');
	$('#shareme-popup').sharrre({
		share: {
			googlePlus: true,
			twitter: true,
			facebook: true,
			pinterest: true
		},
		buttons: {
			googlePlus: {url: $('#shareme-popup').data('url'), size: 'medium', lang: 'es-ES', annotation: dataLink},
			facebook: {url: $('#shareme-popup').data('url'), action: 'like', layout: 'button_count', lang: 'es_ES'},
			twitter: {url: $('#shareme-popup').data('url'), count: 'horizontal', related: App.Config.refererTwitter, lang: 'es'},
			pinterest: {media: $('#shareme-popup').data('image'), description: $('#shareme-popup').data('text'), layout: 'horizontal'}
		},
		urlCurl: '',
		//template: '<div class="box"><div class="left">Comparte</div><div class="middle"><a href="#" class="facebook">f</a><a href="#" class="twitter">t</a><a href="#" class="googleplus">+1</a><a href="#" class="pinterest">p</a></div><div class="right">{total}</div></div>',
		enableHover: false,
		enableCounter: false,
		enableTracking: true
	});
}