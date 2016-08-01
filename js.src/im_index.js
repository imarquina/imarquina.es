// JavaScript Document
//hashTable de fotos
var typesHash = new Hashtable();
/* Evento de window
  ================================================== */
$(window).ready(function() {
	initialize();
	//Cargar tabla imagenes
	imagenesCargar(typesHash);
	//Para anchos de pantalla especiales
	if ($(window).width() < App.Config.windowWidthStd) {
		$(".header-texto").css({"margin":"0.5% 0 0 0"});
		$(".header-texto-titulo").css({"margin":"-2% 0 -0.2% 2%"});
		$(".header-texto-titulo").css({"font-size":"175%"});
		$(".header-texto-subtitulo").css({"margin":"0 2%"});
		$(".header-texto-subtitulo").css({"font-size":"65%"});
	}
	var sGallery=queryStringParamGet('gallery');
	if (queryStringParamValue(sGallery)) {
		galeriaCargar(sGallery,queryStringParamGet('news'));	
			
		//Cargar imagen si se indica en el QueryString
		var sIndex=queryStringParamGet('index');	
		if (queryStringParamValue(sIndex)) {
			var oImagen=$('#'+sIndex);
			if (imageValidar(oImagen)) {
				nodoImagenLocalizar(App.Constantes.origenInicio,sGallery, sIndex);
			}
		}
	} else {
		var sFolder=queryStringParamGet('folder');
		if (queryStringParamValue(sFolder)) {
			folderCargar(sFolder,queryStringParamGet('news'));
		} else {
			var sMultiMed=queryStringParamGet('multimedia');
			if (queryStringParamValue(sMultiMed)) {
				multimediaCargar(sMultiMed,queryStringParamGet('news'));
			} else {
				var sNews=queryStringParamGet('news');
				if (queryStringParamValue(sNews)) {
					newsCargar(sNews)
				} else {
					newsMostrar();
				}
			}
		}
	}	
});
/* Inicializa estados generales
  ================================================== */
initialize=function(){
	//
	$('#annio').text(App.Config.annio);
	$('#version').text(App.Config.version);
	$('.header-logo').wrap("<a href='./index.html'>");
}
/* Inicializa el plugin wookmark
  ================================================== */
gridEstablecer=function(){	
	//Si el ancho de pantalla es estrecho seleccionar un ancho de elemento especial
	var iElemWidth=App.Config.elemWidthStd;
	var iElemOffset=App.Config.elemOffsetStd;
	//Para anchos de pantalla especiales
	if ($(window).width() < App.Config.windowWidthStd) {
		$("#tiles li").css({"width":"130px"});
		iElemWidth=App.Config.elemWidthSpe;
		iElemOffset=App.Config.elemOffsetSpe;
		$("#tiles li p").css({"font-size":"70%"});	
		$('.panel-section ul').css({"font-size":"70%"});
		$('.datos p').css({"font-size":"65%!important"});
	}
	//Inicializa el grid de paneles
	(function() {
      function getWindowWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      }

      // Instantiate wookmark after all images have been loaded
      var wookmark;
      imagesLoaded('#tiles', function() {
        wookmark = new Wookmark('#tiles', {
		  autoresize: App.Config.autoResize,	
		  itemWidth: iElemWidth, // Optional min width of a grid item
          offset: iElemOffset // Optional the distance from grid to parent
        });

		bannerCookies();
		socialMediaPrincipal();
      });
    })();
}
/* Evalua si el objeto imagen es válido
  ================================================== */
imageValidar=function(oImagen) {
	if (oImagen!=undefined) return true;
	else return false;
}
/* Establece y muestra el popup para una imagen
  ================================================== */
imagenPreview=function(origen,imagenSrc,imagenWidth,imagenHeight,galleryCode,imagenTitle,galleryName) {
	imageDialog=$("#dialog");
	
	switch (origen){
		case App.Constantes.origenInicio:
		case App.Constantes.origenGaleria:
			//organizar capas
			capasPopUpAjustar('imagen');	
			imageTag=$('#image');
			//vinculos social-media
			$('#shareme-popup').attr("data-url",App.Config.home+"?gallery="+galleryCode+'&index='+imagenSrc);
			$('#shareme-popup').attr("data-text",App.Config.dataTextTitle+galleryName+": "+imagenTitle);
			$("#shareme-popup").attr("data-image",App.Config.home+"/images/"+imagenSrc+'.jpg');		
			break;
		case App.Constantes.origenNews:
			//organizar capas
			capasPopUpAjustar('enlace');
			imageTag=$('#image');
			$("<a href='./index.html?gallery="+galleryCode+"'><span class='enlace-galeria'>Ver y compartir en &aacute;lbum<br />"+((galleryName.length>50)?galleryName.substr(0,47)+"...":galleryName)+"</span></a>").appendTo("#enlace");
			break;
	}
		
	var dialogWidth='auto';
	if (imagenWidth > $(window).width()) {
		dialogWidth=$(window).width() - 10;	
	}
	
	//Set the image src
	imageTag.attr("src", App.Config.rutaImage+imagenSrc+'.jpg');
	 
	//When the image has loaded, display the dialog
	imageTag.load(function(){
		$('#dialog').dialog({
			modal: true,
			resizable: false,
			draggable: false,
			width: dialogWidth,
			minWidth: "300px",
			/*title: uriParts[uriParts.length - 1]*/
			title: imagenTitle
		});
	}); 
	if(origen!=App.Constantes.origenNews) socialMediaPopup();

}
/* Establece y muestra el popup para un texto
  ================================================== */
textPreview=function(sParam) {
	$.ajax({
			type: "GET",
			url: App.Config.rutaCnf,
			dataType: "xml",
			success: function(xml) {	
				//organizar capas
				capasPopUpAjustar('texto');
				//El nodo root es config
				$(xml).find('section').each(function() {
					var section_name=$(this).attr("name");
	
					if (htmlReplace(section_name)==sParam){
						var sTitulo=$(this).attr("name").toUpperCase();
						var sTexto=$(this).text();

						//Get the HTML Elements
						imageDialog=$("#dialog");
						txtTag=$('#texto');
					
						$(txtTag).empty();
						$(txtTag).html(sTexto);
						
						var dialogWidth='60%';
						//Para anchos de pantalla especiales
						if ($(window).width() < App.Config.windowWidthStd) {
							dialogWidth='90%';
							$("#texto").css({"font-size":"90%"});	
						}
						 
						//When the image has loaded, display the dialog
						$('#dialog').dialog({
							modal: true,
							resizable: false,
							draggable: false,
							width: dialogWidth,
							title: sTitulo
						});
					}
				});
			}
	});

}
/* Crea la lista de elementos de una galería
/* El segundo parámetro sirve para crear la
/* miga de pan
  ================================================== */
galeriaCargar=function(sParam,sNews){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {					
			//El nodo root es config
			$(xml).find('gallery').each(function() {
				var gallery_name=$(this).attr("name");

				if (htmlReplace(gallery_name)==sParam){
					//boton atras + datos social-media
					var dataText='';
					if (($(this).parent()).attr("name")!=undefined) {
						$('.backbottom').html(breadcrumbsEstablecer($(this),sNews));
						dataText=App.Config.dataTextTitle+($(this).parent()).attr("name")+":"+gallery_name;
					} else {
						$('.backbottom').html(breadcrumbsEstablecer($(this),sNews));
						dataText=App.Config.dataTextTitle+gallery_name;
					}
					$('.backbottom').css({"display":"block"});
					//vinculos social-media
					$('#shareme').attr("data-url",window.location.href);
					$('#shareme').attr("data-text",App.Config.dataTextTitle+dataText);
					//establecer valores para SEO
					seoValoresEstablecer($(this));
					//Coleccion de la galeria
					var iElem = 0;
					$(this).children().each(function() {
						var IDImage=$(this).attr("id");
						var hImage=typesHash.get(IDImage);
						if (hImage != null){
							//var image=$(this).attr("src");
							var imgName=hImage.SRC.replace(".jpg","");	
							var sName=hImage.CAPTION;
							var sInfT=hImage.INFOTEXT;
							var sFormat=hImage.FORMAT;
							var sStock=hImage.STOCK;
							var sPrice=hImage.PRICE;
							var sLnkUrl=hImage.LINKURL;
							var sUpdate=hImage.UPDATE;

							var elmPan=$("<li>").appendTo("#tiles");
							var divPan=$("<div class='panel'>").appendTo(elmPan);						
							var divImg=$("<img class='panel-imagen' id='"+imgName+"' style='cursor:pointer' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
							$("<p><span class='panel-titulo'>"+sName+". </span><span class='panel-descripcion'>"+sInfT+"</span></p>").appendTo(elmPan);
							//Sección precio copia
							var sCadena='';
							if ((sFormat!=undefined)&&(sFormat!='')) {
								sCadena+=App.Constantes.dimesion+sFormat;
							}
							if ((sStock!=undefined)&&(sStock!='')) {
								sCadena+=' '+sStock;
							}
							if ((sPrice!=undefined)&&(sPrice!='')) {
								if(sCadena!='') sCadena+='<br />';							
								sCadena+=App.Constantes.copia+sPrice+App.Constantes.moneda;
							}							
							$("<p class='panel-format'>"+sCadena+"</p>").appendTo(elmPan);

							var divDat=$("<div class='datos'>").appendTo(elmPan);
							
							var divSoc=$("<div class='datos-social'>").appendTo(divDat);
							$(infoLinkTratar(hImage.LINKURL)).appendTo(divSoc);
							$("<p>"+dateFormat(hImage.UPDATE)+"</p>").appendTo(divDat);
							if(sNews!=undefined){
								$(divImg).wrap("<a href='./detail.html?gallery="+sParam+"&photo="+iElem+"&news="+sNews+"'>");
							}else{
								$(divImg).wrap("<a href='./detail.html?gallery="+sParam+"&photo="+iElem+"'>");
							}
							
							iElem++;
						}
					});
					gridEstablecer();					
				}
			});
		}
	});				
}
/* Crea la lista de elementos de una carpeta
  ================================================== */
folderCargar=function(sParam,sNews){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {					
			//El nodo root es config
			$(xml).find('folder').each(function() {
				var folder_name=$(this).attr("name");
				
				if (htmlReplace(folder_name)==sParam){
					//vinculos social-media
					$('#shareme').attr("data-url",window.location.href);
					$('#shareme').attr("data-text",App.Config.dataTextTitle+folder_name);
					//boton atras
					$('.backbottom').html(breadcrumbsEstablecer($(this),sNews));
					$('.backbottom').css({"display":"block"});	
					//establecer valores para SEO
					seoValoresEstablecer($(this));
					//Coleccion de la carpeta				
					$(this).children().each(function() {
						var nObj=this;
						if (nObj.nodeName=='gallery') {
							var sName=$(nObj).attr("name");
							var image=$(nObj).attr("src");
							var imgName=$(nObj).attr("src").replace(".jpg","");										

							var elmPan=$("<li>").appendTo("#tiles");
							var divPan=$("<div class='panel'>").appendTo(elmPan);						
							$("<img class='panel-imagen' id='"+imgName+"' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
							$("<p><img class='panel-literal-img' src='./resources/flecha.png'/><span class='panel-literal'>"+App.Config.marcaGaleria+"</span><span class='panel-titulo'>"+sName+"</span></p>").appendTo(elmPan)

							var divDat=$("<div class='datos'>").appendTo(elmPan);
							$("<p>"+dateFormat($(nObj).attr("update"))+"</p>").appendTo(divDat);
							//Crear vínculo carpeta
							if(sNews!=undefined){
								$(divPan).wrap("<a href='./index.html?gallery="+htmlReplace(sName)+"&news="+sNews+"'>");
							}else{
								$(divPan).wrap("<a href='./index.html?gallery="+htmlReplace(sName)+"'>");
							}
						}							
					});
					gridEstablecer();
				}
			});
		}
	});				
}
/* Crea la lista de elementos de una galería
/* El segundo parámetro sirve para crear la
/* miga de pan
  ================================================== */
multimediaCargar=function(sParam,sNews){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {					
			//El nodo root es config
			$(xml).find('multimedia').each(function() {
				var multimedia_name=$(this).attr("name");

				if (htmlReplace(multimedia_name)==sParam){
					//boton atras + datos social-media
					var dataText='';
					if (($(this).parent()).attr("name")!=undefined) {
						$('.backbottom').html(breadcrumbsEstablecer($(this),sNews));
						dataText=App.Config.dataTextTitle+($(this).parent()).attr("name")+":"+multimedia_name;
					} else {
						$('.backbottom').html(breadcrumbsEstablecer($(this),sNews));
						dataText=App.Config.dataTextTitle+multimedia_name;
					}
					$('.backbottom').css({"display":"block"});
					//vinculos social-media
					$('#shareme').attr("data-url",window.location.href);
					$('#shareme').attr("data-text",App.Config.dataTextTitle+dataText);
					//establecer valores para SEO
					seoValoresEstablecer($(this));
					//Coleccion de la galeria
					var iElem = 0;
					var templateTpt = '';
					$(this).children().each(function() {
						var IDImage=$(this).attr("id");
						var hImage=typesHash.get(IDImage);
						if (hImage != null){
							//var image=$(this).attr("src");
							var imgName=hImage.SRC.replace(".jpg","");	
							var sName=hImage.CAPTION;
							var sInfT=hImage.INFOTEXT;
							var sFormat=hImage.FORMAT;
							var sStock=hImage.STOCK;
							var sPrice=hImage.PRICE;
							var sLnkUrl=hImage.LINKURL;
							var sUpdate=hImage.UPDATE;

							var elmPan=$("<li>").appendTo("#tiles");
							var divPan=$("<div class='panel video'>").appendTo(elmPan);						
							var divImg=$("<img class='panel-imagen' id='"+imgName+"' style='cursor:pointer' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
							$("<p><span class='panel-titulo'>"+sName+". </span><span class='panel-descripcion'>"+sInfT+"</span></p>").appendTo(elmPan);
							//Sección precio copia
							var sCadena='';
							if ((sFormat!=undefined)&&(sFormat!='')) {
								sCadena+=App.Constantes.dimesion+sFormat;
							}
							if ((sStock!=undefined)&&(sStock!='')) {
								sCadena+=' '+sStock;
							}
							if ((sPrice!=undefined)&&(sPrice!='')) {
								if(sCadena!='') sCadena+='<br />';							
								sCadena+=App.Constantes.copia+sPrice+App.Constantes.moneda;
							}							
							$("<p class='panel-format'>"+sCadena+"</p>").appendTo(elmPan);

							var divDat=$("<div class='datos'>").appendTo(elmPan);
							
							var divSoc=$("<div class='datos-social'>").appendTo(divDat);
							$(infoLinkTratar(hImage.LINKURL)).appendTo(divSoc);
							$("<p>"+dateFormat(hImage.UPDATE)+"</p>").appendTo(divDat);
							if(sNews!=undefined){
								$(divImg).wrap("<a data-lity='' href='"+sLnkUrl+"' title='"+sName+"'>");
							}else{
								$(divImg).wrap("<a data-lity='' href='"+sLnkUrl+"' title='"+sName+"'>");
							}
							
							iElem++;
						}
					});
					gridEstablecer();					
				}
			});
		}
	});				
}
/* Crea la lista de elementos de la home: carpetas,
/* galerias
  ================================================== */
homeCargar=function(){	
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {								
			//vinculos social-media
			$('#shareme').attr("data-url",App.Config.home);
			$('#shareme').attr("data-text",App.Config.dataTextTitle+App.Config.dataTextHome);
			//Ajuste de margen
			$('#main').css({"padding-top":"0.6rem"});
			//El nodo root es config
			$(xml).find('config').each(function() {	
				//establecer valores para SEO
				seoValoresEstablecer($(this));
				//recorrer los nodos de primer nivel
				$(this).children().each(function() {
					var nObj=this;
					//tratamiento en función del tipo de nodo
					switch(nObj.nodeName)
					{
						case 'galleries':
							$(nObj).children().each(function() {
								var nGls=this;
								switch(nGls.nodeName)
								{
									case 'folder':
										var sName=$(nGls).attr("name");
										var image=$(nGls).attr("src");
										var imgName=$(nGls).attr("src").replace(".jpg","");										

										var elmPan=$("<li>").appendTo("#tiles");
										var divPan=$("<div class='panel'>").appendTo(elmPan);						
										$("<img class='panel-imagen' id='"+imgName+"' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
										$("<p><img class='panel-literal-img' src='./resources/flechadoble.png'/><span class='panel-literal'>"+App.Config.marcaColeccion+"</span><span class='panel-titulo'>"+sName+"</span></p>").appendTo(elmPan)
										//Capa de thumbs de galeria
										if($(nGls).find("gallery").size() > 0){
											var divTmb=$("<div class='panel-thumb'>").appendTo(elmPan);
											var iCnt=0;
											$(nGls).children().each(function() {
                                                var nGal=this;
												if (nGal.nodeName=='gallery' && iCnt < 4) {
													var divMig=$("<div class='panel-thumb-imagen'>").appendTo(divTmb);
													$("<img class='panel-thumbs' src='"+App.Config.rutaThumb+$(nGal).attr("src")+"' title='"+$(nGal).attr("name")+"' alt='"+$(nGal).attr("name")+"'>").appendTo(divMig);
													iCnt++;
												}
                                            });
											while (iCnt < 4) {
												var divMig=$("<div class='panel-thumb-imagen'>").appendTo(divTmb);
												$("<img class='panel-thumbs' src='resources/000000000.png' alt='no imagen'>").appendTo(divMig);
												iCnt++;
											}
										}
										var divDat=$("<div class='datos'>").appendTo(elmPan);
										$("<p>"+dateFormat($(nGls).attr("update"))+"</p>").appendTo(divDat);	
										//Crear vínculo carpeta
										$(divPan).wrap("<a href='./index.html?folder="+htmlReplace(sName)+"'>");										
										break;
									case 'gallery':		
										var sName=$(nGls).attr("name");
										var image=$(nGls).attr("src");
										var imgName=$(nGls).attr("src").replace(".jpg","");										

										var elmPan=$("<li>").appendTo("#tiles");
										var divPan=$("<div class='panel'>").appendTo(elmPan);						
										$("<img class='panel-imagen' id='"+imgName+"' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
										$("<p><img class='panel-literal-img' src='./resources/flecha.png'/><span class='panel-literal'>"+App.Config.marcaGaleria+"</span><span class='panel-titulo'>"+sName+"</span></p>").appendTo(elmPan)

										var divDat=$("<div class='datos'>").appendTo(elmPan);
										$("<p>"+dateFormat($(nGls).attr("update"))+"</p>").appendTo(divDat);
										//Crear vínculo carpeta
										$(divPan).wrap("<a href='./index.html?gallery="+htmlReplace(sName)+"'>");										
										break;
									case 'multimedia':
										var sName=$(nGls).attr("name");
										var image=$(nGls).attr("src");
										var imgName=$(nGls).attr("src").replace(".jpg","");										

										var elmPan=$("<li>").appendTo("#tiles");
										var divPan=$("<div class='panel video'>").appendTo(elmPan);						
										$("<img class='panel-imagen' id='"+imgName+"' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
										$("<p><img class='panel-literal-img' src='./resources/multimedia.png'/><span class='panel-literal'>"+App.Config.marcaGaleria+"</span><span class='panel-titulo'>"+sName+"</span></p>").appendTo(elmPan)

										var divDat=$("<div class='datos'>").appendTo(elmPan);
										$("<p>"+dateFormat($(nGls).attr("update"))+"</p>").appendTo(divDat);
										//Crear vínculo carpeta
										$(divPan).wrap("<a href='./index.html?multimedia="+htmlReplace(sName)+"'>");										
										break;
								}
							});
							//Enlace RSS
							$("<a type='application/rss+xml' href='./feed.xml' target='_blank'><img src='./resources/rss.png'></a>").appendTo('#rss');
							break;
						case 'folder':
							var sName=$(nObj).attr("name");	
							
							var elmPan=$("<li>").appendTo("#tiles");
							var divPan=$("<div class='panel-section'>").appendTo(elmPan);
							var blqTit=$("<p><b>"+sName+"</b></p>").appendTo(divPan)
							//Capa de thumbs de galeria
							if($(nObj).find("section").size() > 0){
								var lstSec=$("<ul>").appendTo(divPan);
								$(nObj).children().each(function() {
									if (this.nodeName=='section') {
										var elmLst=$("<li>"+$(this).attr("name")+"</li>").appendTo(lstSec);
										var nSec=$(this);
										//Establecer eventos
										elmLst.click(function(e) {
											e.preventDefault();
											textPreview(htmlReplace(nSec.attr("name")));
										});						
									}
								});
							}							
							var divDat=$("<div class='datos'>").appendTo(elmPan);
							$("<p>"+dateFormat($(nObj).attr("update"))+"</p>").appendTo(divDat);									
							break;
						case 'section':
							var sName=$(nObj).attr("name");	
							
							var elmPan=$("<li>").appendTo("#tiles");
							var divPan=$("<div class='panel-section'>").appendTo(elmPan);
							var blqTit=$("<p style='cursor:pointer'><b>"+sName+"</b></p>").appendTo(divPan)
							
							//Establecer eventos
							blqTit.click(function(e) {
								e.preventDefault();
								textPreview(htmlReplace($(nObj).attr("name")));
							});
							
							var divDat=$("<div class='datos'>").appendTo(elmPan);
							$("<p>"+dateFormat($(nObj).attr("update"))+"</p>").appendTo(divDat);							
							break;
					}
				});			
			});
			gridEstablecer();
		}
	});
}	
/* Crea la lista de elementos en base al dato PUBLIC
  ================================================== */
newsMostrar=function(){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {		
			var colImages=new Array;
			var iCol=0;			
			//El nodo root es config
			$(xml).find('img').each(function() {
				var IDImage=$(this).attr("id");
				var hImage=typesHash.get(IDImage);
				if (hImage != null){
					var idImage=hImage.SRC;
					var datPublicImage=hImage.PUBLIC;
					var datUpdateImage=hImage.UPDATE;
					var captionImage=hImage.CAPTION;
					
					colImages[iCol]=[{id:idImage,update:datUpdateImage,public:datPublicImage,titulo:captionImage,type:'imagen'}];
					iCol++;
				}
			});
			$(xml).find('vid').each(function() {
				var IDImage=$(this).attr("id");
				var hImage=typesHash.get(IDImage);
				if (hImage != null){
					var idImage=hImage.SRC;
					var datPublicImage=hImage.PUBLIC;
					var datUpdateImage=hImage.UPDATE;
					var captionImage=hImage.CAPTION;
					
					colImages[iCol]=[{id:idImage,update:datUpdateImage,public:datPublicImage,titulo:captionImage,type:'video'}];
					iCol++;
				}
			});
			//Ordenar colección
			colImages.sort(arrayDateSort)
			
			//Cargar panel con primera imagen
			var sName=colImages[0][0].titulo;
			var image=colImages[0][0].id;
			var imgName=image.replace(".jpg","");
			var typeCss=(colImages[0][0].type=='video')?'video':'';								

			var elmPan=$("<li>").appendTo("#tiles");
			var divPan=$("<div class='panel "+typeCss+"'>").appendTo(elmPan);						
			$("<img class='panel-imagen' id='"+imgName+"' src='"+App.Config.rutaImage+imgName+".jpg' title='"+sName+"' alt='Columnas Css' />").appendTo(divPan);
			$("<p><img class='panel-literal-img' src='./resources/nuevo.png'/><span class='panel-literal'>"+App.Config.marcaGaleria+"</span><span class='panel-titulo'>Lo &uacute;ltimo</span></p>").appendTo(elmPan)

			var divDat=$("<div class='datos'>").appendTo(elmPan);
			$("<p>"+dateFormat(colImages[0][0].update)+"</p>").appendTo(divDat);
			//Crear vínculo carpeta
			$(divPan).wrap("<a href='./index.html?news="+colImages[0][0].update+"'>");	
			homeCargar();		
		}
	});				
}
/* Crea el elemento de lista para novedades
  ================================================== */
newsCargar=function(sParam){
	$.ajax({
		type: "GET",
		url: App.Config.rutaCnf,
		dataType: "xml",
		success: function(xml) {	
			//boton atras
			$('.backbottom').html("<a href='./index.html'>inicio</a> | lo &uacute;ltimo");	
			$('.backbottom').css({"display":"block"});		
			
			var colImages=new Array;
			var iCol=0;			
			//El nodo root es config
			$(xml).find('img').each(function() {
				var IDImage=$(this).attr("id");
				var hImage=typesHash.get(IDImage);
				if (hImage != null){
					var idImage=hImage.SRC;
					var datUpdateImage=hImage.UPDATE;
					var datPublicImage=hImage.PUBLIC;
					var captionImage=hImage.CAPTION;
					var linkUrlImage=hImage.LINKURL;
					var infoTextImage=hImage.INFOTEXT;
					var parentFolder=htmlReplace(($(this).parent()).attr("name"));
					var parentNameFolder=pathImagenComponer($(this),App.Config.separadorPathPanel);
					
					colImages[iCol]=[{id:idImage,update:datUpdateImage,public:datPublicImage,titulo:captionImage,
										linkurl:linkUrlImage,infoimagen:infoTextImage,parentFolder:parentFolder,
										parentName:parentNameFolder,type:'imagen'}];
					iCol++;
				}
			});
			$(xml).find('vid').each(function() {
				var IDImage=$(this).attr("id");
				var hImage=typesHash.get(IDImage);
				if (hImage != null){
					var idImage=hImage.SRC;
					var datUpdateImage=hImage.UPDATE;
					var datPublicImage=hImage.PUBLIC;
					var captionImage=hImage.CAPTION;
					var linkUrlImage=hImage.LINKURL;
					var infoTextImage=hImage.INFOTEXT;
					var parentFolder=htmlReplace(($(this).parent()).attr("name"));
					var parentNameFolder=pathImagenComponer($(this),App.Config.separadorPathPanel);
					
					colImages[iCol]=[{id:idImage,update:datUpdateImage,public:datPublicImage,titulo:captionImage,
										linkurl:linkUrlImage,infoimagen:infoTextImage,parentFolder:parentFolder,
										parentName:parentNameFolder,type:'video'}];
					iCol++;
				}
			});
			//Ordenar colección
			colImages.sort(arrayDateSort)
			
			//Cargar los N primeros
			var iCnt=0;
			for (var i=0;i<colImages.length-1&&i<App.Config.elemNuevos;i++) {
				var typeCss=(colImages[i][0].type=='video')?'video':'';	
				var icoImagen=(colImages[i][0].type=='video')?'multimedia.png':'flecha.png';
				//Cargar panel con primera imagen
				var elmPan=$("<li>").appendTo("#tiles");
				var divPan=$("<div class='panel "+typeCss+"'>").appendTo(elmPan);						
				var divImg=$("<img class='panel-imagen' name='"+colImages[i][0].parentFolder+"' id='"+colImages[i][0].id.replace(".jpg","")+"' style='cursor:pointer' src='"+App.Config.rutaImage+colImages[i][0].id.replace(".jpg","")+".jpg' title='"+colImages[i][0].titulo+"' alt='Columnas Css' />").appendTo(divPan);
				$("<p><span class='panel-titulo'>"+colImages[i][0].titulo+". </span><span class='panel-descripcion'>"+colImages[i][0].infoimagen+"</span></p>").appendTo(elmPan);
				//Capa de referencia galeria
				var divPar;$("<p><img class='panel-literal-img' src='./resources/"+icoImagen+"'/><span class='panel-parent'>"+colImages[i][0].parentName+"</span></p>").appendTo(elmPan);
				var divDat=$("<div class='datos'>").appendTo(elmPan);

				if (colImages[i][0].type=='video') {
					$(divImg).wrap("<a data-lity='' href='"+colImages[i][0].linkurl+"' title='"+colImages[i][0].titulo+"'>");
					$(divPar).wrap("<a href='./index.html?multimedia="+colImages[i][0].parentFolder+"&news="+sParam+"'>");
				} else {					
					$(divImg).wrap("<a href='./detail.html?news="+sParam+"&photo="+iCnt+"'>");
					$(divPar).wrap("<a href='./index.html?gallery="+colImages[i][0].parentFolder+"&news="+sParam+"'>");

					//Capa social-media					
					var divSoc=$("<div class='datos-social'>").appendTo(divDat);
					$(infoLinkTratar(colImages[i][0].linkurl)).appendTo(divSoc);

					iCnt++;
				}
		
				$("<p>"+dateFormat(colImages[i][0].update)+"</p>").appendTo(divDat);					
			}
			gridEstablecer();
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
	while ((oObj.parent()).attr("name")!=undefined){
		sText=(oObj.parent()).attr("name")+(iRow!=0?separador+sText:"");
		iRow++;
		oObj=oObj.parent();
	}
	return sText;
}
/* Busca el node de una imagen en base a su nombre
/* de archivo
  ================================================== */
nodoImagenLocalizar=function(origen,sParamGaleria,sParamImagen) {
	var imagenLocalizada=0;
	$.ajax({
			type: "GET",
			url: App.Config.rutaCnf,
			dataType: "xml",
			success: function(xml) {					
				//El nodo root es config
				$(xml).find('gallery').each(function() {
					var gallery_name=$(this).attr("name");
	
					if (htmlReplace(gallery_name)==sParamGaleria){
						//Coleccion de la galeria
						$(this).children().each(function() {
							//Romper el bucle
							if (imagenLocalizada==1) return false;
							//Path de la imagen
							var parentNameFolder=pathImagenComponer($(this),App.Config.separadorPathEnlace);
							//Nombre archivo
							var imagen_name=$(this).attr("src").replace(".jpg","");
							if (imagen_name==sParamImagen) {
								imagenPreview(origen,imagen_name,$(this).attr("width"),$(this).attr("height"),sParamGaleria,$(this).attr("caption"),parentNameFolder);
								imagenLocalizada=1;
								return false;
							}
						});
					}
					if (imagenLocalizada==1) return false;
				});
			}
	});
}
