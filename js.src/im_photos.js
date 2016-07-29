imagenesCargar=function(){
	$.ajax({
		type: "GET",
		url: App.Config.rutaPho,
		dataType: "xml",
		async: false, 
		success: function(xml) {					
			//El nodo root es config
			$(xml).find('photos').each(function() {
				//Coleccion de la galeria
				var iElem = 0;
				$(this).children().each(function() {
					typesHash.put(
								$(this).attr('src').replace(".jpg",""),
								new Photo(
										$(this).attr('src').replace(".jpg",""),
										$(this).attr('width'),
										$(this).attr('height'),
										$(this).attr('caption'),
										$(this).attr('src'),
										$(this).attr('linktext'),
										$(this).attr('linkurl'),
										$(this).attr('infotext'),
										$(this).attr('format'),
										$(this).attr('stock'),
										$(this).attr('price'),
										$(this).attr('update'),
										$(this).attr('public')
										)
								);
										
					iElem++;
				});
				//return true;
			});
			$(xml).find('videos').each(function() {
				//Coleccion de la galeria
				var iElem = 0;
				$(this).children().each(function() {
					typesHash.put(
								$(this).attr('src').replace(".jpg",""),
								new Photo(
										$(this).attr('src').replace(".jpg",""),
										$(this).attr('width'),
										$(this).attr('height'),
										$(this).attr('caption'),
										$(this).attr('src'),
										$(this).attr('linktext'),
										$(this).attr('linkurl'),
										$(this).attr('infotext'),
										$(this).attr('format'),
										$(this).attr('stock'),
										$(this).attr('price'),
										$(this).attr('update'),
										$(this).attr('public')
										)
								);
										
					iElem++;
				});
				//return true;
			});
		}
	});				
}
function Photo(id,width,height,caption,src,linktext,linkurl,infotext,format,stock,price,update,publi){
	this.ID = id;
	this.WIDTH = width;
	this.HEIGHT = height;
	this.CAPTION = caption;
	this.SRC = src;
	this.LINKTEXT = linktext;
	this.LINKURL = linkurl;
	this.INFOTEXT = infotext;
	this.FORMAT = format;
	this.STOCK = stock;
	this.PRICE = price;
	this.UPDATE = update;
	this.PUBLIC = publi;
}