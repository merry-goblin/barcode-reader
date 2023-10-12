
/** @namespace */
var buybox = buybox || {};

(function($, buybox) {

	buybox.errorHandler = function(settings) {

		var settings = $.extend({}, settings);

		/**
		 * @param  jQuery|array $fields
		 * @return array
		 */
		function setFieldsValid($fields) {

			if ($fields == null) {
				$fields = new Array();
			}
			else {
				$fields = (!Array.isArray($fields)) ? new Array($fields) : $fields;
			}

			return $fields;
		}

		var scope = {

			clear: function($fields) {

				$fields = setFieldsValid($fields);
				for (var i in $fields) {
					var $field = $fields[i];
					buybox.gc2.utils.resetSoftErrorOnField($field);
				}
			},

			/**
			 * @param  jQuery|array $fields
			 * @return null
			 */
			display: function(message, $fields) {

				$fields = setFieldsValid($fields);
				for (var i in $fields) {
					var $field = $fields[i];
					buybox.gc2.utils.softError(message, $field, false, null);
				}
			}
		};
		return scope;
	}

})(jQuery, buybox);
