
/** @namespace */
var buybox = buybox || {};

(function($, buybox) {

	buybox.restAPI = function(errorHandler, settings) {

		var errorHandler = errorHandler;
		var settings = $.extend({
			resource: null,
			method: 'GET',
			contentType: 'application/json',
			//lang: 'fr'
		}, settings);

		function extractErrorResponse(jqXHR) {

			var response = null;

			if (jqXHR != null && jqXHR.responseText != null) {
				try {
					var response = JSON.parse(jqXHR.responseText);
				}
				catch (e) {}
			}

			return response;
		}

		function extractErrorMessages(response) {

			var message = "";

			if (response != null && response.message != null) {
				try {
					var errors = JSON.parse(response.message);
					for (var i=0, len=errors.length; i<len; i++) {
						if (i > 0) {
							message += "<br>";
						}
						message += errors[i];
					}
				}
				catch (e) {}
			}

			return message;
		}

		function extractOneErrorMessage(response) {

			var message = "";

			if (response != null && response.message != null) {
				try {
					var errors = JSON.parse(response.message);
					if (errors.length > 0) {
						message += errors[0];
					}
				}
				catch (e) {}
			}

			return message;
		}

		var scope = {

			/**
			 * @param  array data
			 * @param  jQuery|array $fields [to display error message]
			 * @param  buybox.restCallback|null
			 * @return null
			 */
			call: function(data, $fields, restCallback, multipleErrorsAllowed) {

				multipleErrorsAllowed = (multipleErrorsAllowed !== false) ? true : false;

				// Remove any error on the passed fields
				if (errorHandler != null) {
					errorHandler.clear($fields)
				}

				// Callback called according to success and error
				if (restCallback == null) {
					restCallback = new buybox.restCallback();
				}

				// Ajax request
				if (settings.lang != null) {
					data['lang'] = settings.lang;
				}
				var jsonData = JSON.stringify(data);
				$.ajax({
					url : settings.resource,
					data : jsonData,
					type : settings.method,
					contentType : settings.contentType,
					headers: {"X-Experimental": "true"}, // force response to respond data or datas properties
					success : function(response, textStatus, jqXhr) {
						restCallback.any(response, restCallback.parameters);
						restCallback.success(response, restCallback.parameters);
					},
					error : function(jqXHR, textStatus, errorThrown) {
						var response = extractErrorResponse(jqXHR);
						restCallback.any(response, restCallback.parameters);
						restCallback.error(response, restCallback.parameters);

						// Display an error message
						var message = (multipleErrorsAllowed) ? extractErrorMessages(response) : extractOneErrorMessage(response);
						if (errorHandler != null) {
							errorHandler.display(message, $fields);
						}
					},
				});
			},

			upload: function(file, $fields, restCallback, multipleErrorsAllowed, defaultErrorMessage, fileKey) {

				// var fileSize = file.size; // Seems like Chrome doesn't like it
				fileKey = (fileKey != null) ? fileKey : 'uploaded-photo';
       			var formData = new FormData();
        		formData.append(fileKey, file);
        		if (settings.lang != null) {
					formData.append('lang', settings.lang);
				}
 
				multipleErrorsAllowed = (multipleErrorsAllowed !== false) ? true : false;

				// Remove any error on the passed fields
				if (errorHandler != null) {
					errorHandler.clear($fields);
				}

				// Callback called according to success and error
				if (restCallback == null) {
					restCallback = new buybox.restCallback();
				}

				// Ajax request
				$.ajax({
					url : settings.resource,
					data : formData,
					type : settings.method,
		            contentType: false, // obligatoire pour de l'upload
		            processData: false, // obligatoire pour de l'upload
		            dataType: 'json', // selon le retour attendu,
					headers: {
						"X-Experimental": "true"
					}, // force response to respond data or data properties
					success : function(response, textStatus, jqXhr) {
						restCallback.any(response, restCallback.parameters);
						restCallback.success(response, restCallback.parameters);
					},
					error : function(jqXHR, textStatus, errorThrown) {

						var response = extractErrorResponse(jqXHR);

						// Display an error message
						var errorMessage = (defaultErrorMessage != null) ? defaultErrorMessage : "";
						if (response != null) {
							errorMessage = (multipleErrorsAllowed) ? extractErrorMessages(response) : extractOneErrorMessage(response);
						}
						if (errorHandler != null) {
							errorHandler.display(errorMessage, $fields);
						}

						// Handle error
						restCallback.any(response, restCallback.parameters);
						restCallback.error(response, restCallback.parameters, errorMessage);
					}
				});
			}
		};
		return scope;
	}

})(jQuery, buybox);
