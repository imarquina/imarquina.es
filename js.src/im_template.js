plantillaCargar=function(template){
	var vReturn='';

	$.ajax({
		type: "GET",
		async: false,
		url: App.Config.rutaTpt + template,
		dataType: "html",
		success: function(data) {
			vReturn = data;
		}
	});	
	return vReturn;
}

