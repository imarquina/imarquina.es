loadXml = function() {
    var vReturn;

    $.ajax({
            type: "GET",
            async: false,
            url: App.Config.rutaCnf,
            dataType: "xml"
        })
        .done(function(xml) {
            //El nodo root es config
            vReturn = $(xml);
        })
        .fail(function() {
            alert("Error de acceso a datos");
        })
        .always(function() {
            //alert("complete");
        });
    return vReturn;
}
loadTemplate = function(template) {
    var vReturn = '';

    $.ajax({
            type: "GET",
            async: false,
            url: App.Config.rutaTpt + template,
            dataType: "html"
        })
        .done(function(data) {
            vReturn = data;
        })
        .fail(function() {
            alert("Error de acceso a plantilla");
        })
        .always(function() {
            //alert("complete");
        });
    return vReturn;
}