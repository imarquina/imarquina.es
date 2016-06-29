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
								$(this).attr('SRC').replace(".jpg",""),
								new Photo(
										$(this).attr('SRC').replace(".jpg",""),
										$(this).attr('WIDTH'),
										$(this).attr('HEIGHT'),
										$(this).attr('CAPTION'),
										$(this).attr('SRC'),
										$(this).attr('LINKTEXT'),
										$(this).attr('LINKURL'),
										$(this).attr('INFOTEXT'),
										$(this).attr('FORMAT'),
										$(this).attr('STOCK'),
										$(this).attr('PRICE'),
										$(this).attr('UPDATE'),
										$(this).attr('PUBLIC')
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