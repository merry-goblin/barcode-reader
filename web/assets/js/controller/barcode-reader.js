(function($) {

    var errorHandler = new buybox.errorHandler();
    var postBarcode = new buybox.restAPI(errorHandler, {
        resource: 'barcode-reader-api.php',
        method: 'POST',
    });

    $('#cameraFileInput').change(function() {

        let $file = $('input[type="file"]');
        let file = $file[0].files[0];

        var restCallback = new buybox.restCallback();
        restCallback.success = function(response, customParameters) {
            $('#uploaded-photo').attr('src', 'data:image/png;base64,'+response.imageContent);
        };
        restCallback.error = function(response, customParameters, errorMessage) {
            console.log('error');
            console.log(response);
            console.log(errorMessage);
        };
        let multipleErrorsAllowed = false;
        let defaultErrorMessage = '';
        postBarcode.upload(file, null, restCallback, multipleErrorsAllowed, defaultErrorMessage);
    });

})(jQuery);