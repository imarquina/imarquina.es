// JavaScript Document
//hashTable de fotos
var typesHash = new Hashtable();
/* Evento de window
  ================================================== */
$(window).ready(function() {
	//Cargar tabla imagenes
	imagenesCargar(typesHash);
	newsCargar();	
});
/* Crea el elemento de lista para novedades
  ================================================== */
newsCargar=function(){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {	
			var colImages=new Array;
			var iCol=0;			
			//El nodo root es config
			$(xml).find('img').each(function() {
				var IDImage=$(this).attr('ID');
				var hImage=typesHash.get(IDImage);
				if (hImage != null){
					var idImage=hImage.SRC;
					var datUpdateImage=hImage.UPDATE;
					var datPublicImage=hImage.PUBLIC;
					var captionImage=hImage.CAPTION;
					var linkUrlImage=hImage.LINKURL;
					var infoTextImage=hImage.INFOTEXT;
					var parentFolder=htmlReplace(($(this).parent()).attr("NAME"));
					var parentNameFolder=pathImagenComponer($(this),App.Config.separadorPathPanel);				
				
					colImages[iCol]=[{id:idImage,update:datUpdateImage,public:datPublicImage,titulo:captionImage,linkurl:linkUrlImage,infoimagen:infoTextImage,parentFolder:parentFolder,parentName:parentNameFolder}];
					iCol++;
				}
			});
			//Ordenar colección
			colImages.sort(arrayDateSort)
			
			//Cargar los N primeros
			for (var i=0;i<colImages.length-1&&i<App.Config.elemNuevos&&i<3;i++) {
				//Cargar panel con primera imagen
				var elmPan=$("<li>").appendTo("#tiles");
				var divPan=$("<div class='elemento thumb'>").appendTo(elmPan);						
				var divImg=$("<img id='thumb"+i+"' class='panel-imagen' id='"+colImages[i][0].id.replace(".jpg","")+"' style='cursor:pointer' src='"+App.Config.rutaThumb+colImages[i][0].id.replace(".jpg","")+".jpg' title='"+colImages[i][0].titulo+"' />").appendTo(divPan);
				//Capa de referencia galeria
				//$(divImg).wrap("<a href='"+App.Config.home+"/index.html?gallery="+colImages[i][0].parentFolder+"&index="+colImages[i][0].id.replace(".jpg","")+"' target='_blank'>");
				$(divImg).wrap("<a href='"+App.Config.home+"/detail.html?news="+colImages[0][0].update+"&photo="+i+"' target='_blank'>");
			}
			var elmPan=$("<li>").appendTo("#tiles");
			var divPan=$("<div class='elemento thumb'>").appendTo(elmPan);						
			var divImg=$("<img id='thumb99' class='panel-imagen' id='flickr_banner' style='cursor:pointer' src='./resources/flickr_banner.jpg' title='flickr night.noise' />").appendTo(divPan);
			//Capa de referencia galeria
			$(divImg).wrap("<a href='http://www.flickr.com/photos/night-noise' target='_blank'>");			
		}
	});				
}
/* Compone la ruta de galería y/o colección de una
/* imagen
  ================================================== */
pathImagenComponer=function(elemNode,separador) {
	var oObj=elemNode;
	var sText='';
	var iRow=0;
	while ((oObj.parent()).attr("NAME")!=undefined){
		sText=(oObj.parent()).attr("NAME")+(iRow!=0?separador+sText:"");
		iRow++;
		oObj=oObj.parent();
	}
	return sText;
}