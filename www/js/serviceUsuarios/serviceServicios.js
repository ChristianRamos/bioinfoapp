angular.module('serviceServicios', [])//Declaramos el modulo
	.factory('testRequest', function($http) { //declaramos la factory
		var path = "http://lukgo.com/Api/api.php";//API path
		return {
			consultaservicios : function(){
				global = $http.post(path, {accion: "consulta", servicio: "categorias"});
				return global;
			},
		}
	});
