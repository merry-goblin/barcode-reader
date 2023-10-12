
/** @namespace */
var buybox = buybox || {};

buybox.restCallback = function() {
	this.success = function(response, customParameters) {};
	this.error = function(response, customParameters) {};
	this.any = function(response, customParameters) {};
	this.parameters = {};
}
