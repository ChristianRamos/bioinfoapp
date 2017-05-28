angular.module('your_app_name.controllers', ['servicios', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache','ngCordovaOauth','ngCordova']);
angular.module('your_app_name.controllers', ['servicios', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache','ngCordovaOauth','ngCordova'])

.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', ['$scope','$ionicConfig', '$localStorage','usuarios', 'establecimientos', 'profesionales', 'reservas', '$state','$ionicModal','$mdDialog','$ionicHistory', '$window',  '$cordovaOauth', 'facebook', 'google',function($scope, $ionicConfig, $localStorage, usuarios, establecimientos, profesionales, reservas, $state, $ionicModal,$mdDialog,	$ionicHistory, $window,$cordovaOauth, facebook, google) {
	$scope.user = {};
	$scope.loginError = false;

	//proceso cuando carga la pagina
	angular.element(document).ready(function () {
		//limpia las variables para donde se almacena la sesion
		if(	$localStorage.sesion==undefined){
			$localStorage.sesion={};
		}
		if($localStorage.sesion.id==undefined){
					$localStorage.sesion.id="";
		}

		//redirecciona segun el estado de sesion
		$scope.iniciarsesion=function(id){
			if(id==""){
				$ionicHistory.clearCache().then(function(){ $state.go('app.categorias');});
			}else{
				$ionicHistory.clearCache().then(function(){ $state.go('app.profile');});
			}
		};

		$scope.id=$localStorage.sesion.id;
		if($localStorage.sesion.id==""){
			$scope.datos={};
			$scope.id="";
			$scope.mensajebv="Bienvenido";
			$scope.datos.nombre="inicia sesion.";
			$scope.datos.avatar="img/avatarvacio.png";
		}else{
			usuarios.consultaperfil($localStorage.sesion.id, $localStorage.sesion.tipousr)
				.success(function (data){
					$scope.datos=data;
					console.log($scope.datos);
					$scope.validaciongenero=angular.equals($scope.datos.genero,'Masculino');
			  	if($scope.validaciongenero){
			  		$scope.mensajebv="Bienvenido";
			  	}else{
			  		$scope.mensajebv="Bienvenida";
			  	}
				});
		}

	});
		$scope.status = '  ';
  	$scope.customFullscreen = false;
		//modal registro
		$scope.showRegistro = function(ev) {
			$mdDialog.show({
			 controller: 'SignupCtrl',
			 templateUrl: 'views/modals/modal-registro-usuario.html',
			 parent: angular.element(document.body),
			 targetEvent: ev,
			 clickOutsideToClose:true,
			 fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
		};

		/*//Modal login
		$scope.showLogin = function(ev) {
			$mdDialog.show({
			 controller: 'LoginCtrl',
			 templateUrl: 'views/modals/modal-inicio-sesion.html',
			 parent: angular.element(document.body),
			 targetEvent: ev,
			 clickOutsideToClose:true,
			 fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
		};*/
		/*---------------TEMPLATES DE LOS MODALES ---------------------------*/
			$ionicModal.fromTemplateUrl('views/app/logintemplate.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modalLogin = modal;
		  });

			$ionicModal.fromTemplateUrl('views/app/registrotemplate.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modalRegistro = modal;
		  });
			$ionicModal.fromTemplateUrl('views/app/logouttemplate.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modalLogOut = modal;
			});
		/*---------------TEMPLATES DE LOS MODALES ---------------------------*/
		/*---------------- FUNCIONES DE INICIO DE SESION -------------------*/
			$scope.doLogIn = function(tp){
				tp=1;
				$scope.loginError = false;
				if( $scope.user.tipoperfil == true ) tp = 2;
				else tp = 1;

				usuarios.iniciarsesion($scope.user.email, $scope.user.password, tp).success(function (data){
					if( data.resultado == "el usuario no existe" || data.resultado == "la contrasena no coincide" ){
						$scope.loginError = true;
					}else{
						$scope.inises=data; // Asignaremos los datos del post
						$scope.inicioSesion($scope.inises);
					}
				});
			};

			//PROCESO PARA INICIO DE SESION
			$scope.inicioSesion=function(data){
				console.log(data);
				$scope.data=data;
				//Se almacena los datos de sesion en la variable $localStorage
				$scope.respuesta=$scope.data.resultado;

				if($scope.respuesta=="el usuario no existe"){
					alert("El Usuario no existe");
				}else{
					if($scope.data.resultado.login==1){
						$localStorage.$reset();
						$localStorage.sesion=$scope.data.resultado;
						$mdDialog.cancel();
						//location.reload();
						$ionicHistory.clearCache().then(function(){
							$state.go('app.home', {}, {
									notify: false
								}).then(function() {
									$window.location.reload();
								});
						});
					}else{
						alert("Verifica tu correo y contraseña, estan incorrectas.");
					}
				}
			}
			//FIN PROCESO PARA INICIO DE SESION

			//INICIO  DE SESION CON FACEBOOK
			$scope.LoginwithFacebook = function(tp){
				$cordovaOauth.facebook("1259705227414283", ["email","public_profile", "user_friends"]).then(function(result) {
		    	facebook.iniciosesionfb(result.access_token).success(function (data){
						var emailf=data.email;
						var idusrf=data.id;
						usuarios.validarcorreo(data.email,tp).success(function (res){
							if(res.resultado=="false"){
								alert("lo sentimos la cuenta aun no esta registrada");
							}else{
								usuarios.iniciarsesion(emailf, idusrf, tp).success(function (data){
									$scope.inises=data; // Asignaremos los datos del post
									inicioSesion($scope.inises);
								});
							}
						});
					});
		  	}, function(error) {
		        alert("Auth Failed..!!"+error);
		    });
		  };
			// FIN INICIO SESION CON FACEBOOK

			//INICIO DE SESION CON GOOGLE+
		  $scope.LoginwithGoogle = function(tp){
			 	$cordovaOauth.google("368699238304-i1fv4h6f4sn1q0vn7ofkqhbmvjnvt64n.apps.googleusercontent.com", ["email"]).then(function(result) {
			 		google.iniciosesiongoogle(result.access_token).success(function (data){
						var emailg="";
			 			var imageng="";
			 			var idusr="";
						for (key in data) {
							if(key=="emails"){
								email=data[key];
								emailg=email[0]["value"];
							}
							if(key=="image"){
								image=data[key];
								imageng=image["url"];
							}
							if(key=="id"){
								idusr=data[key];
							}
						}
		        usuarios.validarcorreo(emailg,tp).success(function (res){
		        	if(res.resultado=="false"){
								alert("La cuenta aun no esta registrada");
							}else{
								usuarios.iniciarsesion(emailg, idusr,tp).success(function (data){
									$scope.inises=data; // Asignaremos los datos del post
									inicioSesion($scope.inises);
								});
							}
			      });
					});
			 	}, function(error) {
			 		alert("Error !!"+error);
			 	});
			};
			//FIN INICIO SESION CON GOOGLE+
		/*-----------------FUNCIONES DE REGISTRO -----------------------*/
			$scope.doSignUp = function(tp){
				$scope.crear={};
				usuarios.validarcorreo($scope.user.email,tp).success(function (res){
					if(res.resultado=="true"){
						$scope.RegistroCorreoExistente = true;
					}else{
						//nombre,apellido,correo,telefono,genero,fechanacimiento,contrasena,imagen,tipoperfil
						usuarios.crear($scope.user.nombre, $scope.user.apellidos, $scope.user.email, "", "","",$scope.user.password,"",tp).success(function (data){
							console.log(data);
							$scope.crear=data; // Asignaremos los datos del post
							usuarios.iniciarsesion($scope.user.email, $scope.user.password, tp).success(function (data){
									$scope.inises=data; // Asignaremos los datos del post
									$scope.inicioSesion($scope.inises);
							});
						});
					}
				});
			};
		/*-----------------FIN FUNCIONES DE REGISTRO -----------------------*/
		/*------------------FIN FUNCIONES INICIO DE SESION ------------------------*/
		/*-----------------FUNCIONES DE CIERRE DE SESION -----------------------*/
			$scope.cerrarSesion = function(){
					$localStorage.sesion={};
					//alert("Se ha cerrado sesion correctamente, hasta la proxima.");
					//$ionicHistory.clearCache().then(function(){ $state.go('app.home');});
					$mdDialog.cancel();
					location.reload();
				}
		/*-----------------FIN FUNCIONES DE CIERRE DE SESION --------------------*/

		/*----------------FUNCIONES DE APERTURA Y CIERRE DE MODALES------------------*/
			$scope.openModalLogin = function(){
				$scope.modalLogin.show();
			};

			$scope.closeModalLogin = function() {
		    $scope.modalLogin.hide();
		  };


			$scope.openModalRegistro = function(){
				$scope.modalRegistro.show();
			};

			$scope.closeModalRegistro = function() {
		    $scope.modalRegistro.hide();
		  };

			$scope.registrarme = function(){
				$scope.closeModalLogin();
				$scope.openModalRegistro();
			};

			$scope.openModalLogOut = function(){
				$scope.modalLogOut.show();
			};

			$scope.closeModalLogOut = function() {
		    $scope.modalLogOut.hide();
		  };
		/*-------------FIN FUNCIONES DE APERTURA Y CIERRE DE MODALES -------------------*/
		//Modal cerrar sesion
		$scope.showLogOut = function(ev) {
			$mdDialog.show({
			 controller: 'LogOutCtrl',
			 templateUrl: 'views/modals/modal-cierre-sesion.html',
			 parent: angular.element(document.body),
			 targetEvent: ev,
			 clickOutsideToClose:true,
			 fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
		};

}])
/*------------------
	buscar especimen
-------------------*/
.controller('buscarEspecimenCtrl',['$scope','consultaBio', '$stateParams','$ionicHistory', '$state',function($scope,consultaBio,$stateParams,$ionicHistory,$state){
	$scope.parametro = {};
	$scope.resultado = {};
	angular.element(document).ready(function () {
		consultaBio.buscarEspecimen($stateParams.especie,"flora").success(function (data){
			$scope.resultado = data;
		})
	});
	$scope.ir = function (){
		$ionicHistory.clearCache().then(function(){ $state.go('app.buscarEspecie',{ "especie": $scope.parametro.busqueda});});
	}
	$scope.ver = function (idEspecie){
		$ionicHistory.clearCache().then(function(){ $state.go('app.especie',{ "idEspecimen": idEspecie});});
	}
}])
/*----------------
	vista del especimen
------------------*/
.controller('especimenCtrl',['$scope','consultaBio','$stateParams','$state','$ionicSlideBoxDelegate','$cordovaGeolocation','$ionicLoading','$compile',function($scope,consultaBio,$stateParams,$state,$ionicSlideBoxDelegate,$cordovaGeolocation,$ionicLoading,compile){
	$scope.id=$stateParams.idEspecimen;
	$scope.datos = {};
	$scope.center_position = {};

	//consulta del la planta
	consultaBio.consultarEspecimen($scope.id,"flora").success(function(data){
		$scope.resultado = data;
		console.log($scope.resultado);
	})
	//slide de la galeria
	$scope.slideVisible = function(index){
			 if(  index < $ionicSlideBoxDelegate.currentIndex() -1
			|| index > $ionicSlideBoxDelegate.currentIndex() + 1){
		 return false;
	 }
			 return true;
	 }
	 $scope.center_position = {};
/*------- MAPA ---------*/
		//variables del mapa
		$scope.map = null;
		$scope.markers = {};
		$scope.markers.latitud = $scope.datos.latitud;
		$scope.markers.longitud = $scope.datos.longitud;

		$scope.$on('mapInitialized', function(event, map) {
			$scope.map = map;
			$scope.map.setZoom(15);
			$scope.map.addListener('dragend', $scope.handleDragend);
			console.log($scope.datos);
		});
		//ubicacion actual
		$scope.centerOnMe= function(){
			$scope.positions = [];
			$ionicLoading.show({
				template: 'Cargando...'
			});
			// with this function you can get the user’s current position
			// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
			var options = { enableHighAccuracy: false};
			$cordovaGeolocation.getCurrentPosition(options).then(function(position){
				var pos = new google.maps.LatLng(4.653417, -74.128417);
				$scope.map.setZoom(15);
				$scope.map.setCenter(pos);
				$ionicLoading.hide();
			});
		};

	/*-------FIN MAPA 	---------*/
	$scope.centerOnMe();

}])

/*------------------
	PERFIL DE USUARIO
-------------------*/
.controller('ProfileCtrl', ['$scope','usuarios', '$localStorage', 'upload', '$state','$ionicHistory', '$ionicModal','$mdDialog', function($scope,usuarios,$localStorage,upload,$state,$ionicHistory,$ionicModal, $mdDialog) {
	$scope.imagen={};
	$scope.vgen={};
	$scope.myDate = new Date();
	$scope.minDate = new Date(
	  $scope.myDate.getFullYear(),
	  $scope.myDate.getMonth() - 2,
	  $scope.myDate.getDate()
	);

	$scope.maxDate = new Date(
	  $scope.myDate.getFullYear(),
	  $scope.myDate.getMonth() + 2,
	  $scope.myDate.getDate()
	);

	$scope.onlyWeekendsPredicate = function(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	};
	//verificacion del estado de las sesion

	if($localStorage.sesion.id=="" || $localStorage.sesion==undefined){
		$ionicHistory.clearCache().then(function(){ $state.go('app.home');});
	}
	$scope.edicion=true;

		angular.element(document).ready(function () {
			//obtiene los datos del perfil del usuario
				usuarios.consultaperfil($localStorage.sesion.id, $localStorage.sesion.tipousr).success(function (data){
      		$scope.datos=data;

      		//visibilidad de los botones de acciones de acuerdo al tipo de perfil
      		$scope.datos.fechana = new Date(
      			$scope.datos.fnacimiento
      		);
      		if($scope.datos.genero=="M"){
						$scope.genero="Masculino";
						$scope.vgen.mas=true;
						$scope.vgen.fem=false;
      		}
      		if($scope.datos.genero=="F"){
						$scope.genero="Femenino";
						$scope.vgen.fem=true;
						$scope.vgen.mas=false;
      		}
      		if($scope.datos.genero==""){
      			$scope.vgen.mas=true;
      			$scope.vgen.fem=true;
      		}
      		if($localStorage.sesion.tipousr=="2"){
      			$scope.tp=true ;
      			$scope.tpu=false;
      		}else{
      			$scope.tp=false ;
      			$scope.tpu=true;
      		}
      		$localStorage.avatar=$scope.datos.avatar;
      		//console.log($scope.datos.avatar);
      	});
			//obtiene la lista de peticiones de establecimientos
				usuarios.listapeticionestablecimiento($localStorage.sesion.id, $localStorage.sesion.tipousr).success(function (data){
					$scope.establecimientos = data;
				});
			//obtiene la lista de establecimientos confirmados al usuario
				usuarios.listaEstablecimientosConf($localStorage.sesion.id, $localStorage.sesion.tipousr).success(function (data){
					$scope.establecimientosConf = data;
				});
    });
    $scope.editarperfil=function(){
    	//habilita edicion
    	$scope.edicion=false;
    }
    $scope.guardardatos=function(){
    	//tratamiento de datos
    	$scope.update={};
    	$scope.arrayp={};
   		$scope.update.nombre=$scope.datos.nombre;
   		$scope.update.apellido=$scope.datos.apellido;
   		$scope.update.nacimiento=$scope.datos.fechana;
   		$scope.update.genero=$scope.datos.genero;
   		$scope.update.correo=$scope.datos.correo;
   		$scope.update.telefono=$scope.datos.telefono;
   		$scope.update.info=$scope.datos.sobre;
   		//informacion adicional para el prefil de profesional
   		if($localStorage.sesion.tipousr==2){
   			$scope.arrayp.direccion=$scope.datos.datosp.direccion;
   			$scope.arrayp.cedula=$scope.datos.datosp.cedula
				$scope.update.datosp=$scope.arrayp;
   		}
   		var file = $scope.file;
   		//envio de datos a la api
   		//console.log($scope.update.datosp);

   		usuarios.guardar($localStorage.sesion.id,$localStorage.sesion.tipousr,$scope.update).success(function (data){
				$scope.respuest=data;
				$val=angular.equals($scope.respuest.resultado,"true")
				if($val){
					alert("los datos han sido guardados");
					$state.reload();
				}else{
					alert("error al guardar los datos");
				}

   		});

    	//deshabilita edicion
    	$scope.edicion=true;
    }
    //carga de imagen
    $scope.uploadFile = function(){
			var file = $scope.file;
			console.log(file);
			upload.uploadFile(file, $localStorage.sesion.id,$localStorage.sesion.tipousr,"fotoperfil").then(function(res){
				console.log(res);
				$state.reload();
			})
		}
		//modal confirmacion profesionales
		$scope.status = '  ';
		$scope.customFullscreen = false;
		$scope.showConfirmacionProfesional = function(ev) {
			$mdDialog.show({
			 controller: 'confirmacionProfesionalCtrl',
			 templateUrl: 'views/modals/modal-confirmacion-profesionales.html',
			 parent: angular.element(document.body),
			 targetEvent: ev,
			 clickOutsideToClose:true,
			 fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
		}
		//envio al formulario de edicion de establecimiento confirmados
		$scope.editarEstablecimiento = function(idEstablecimiento){
				$scope.idEstablecimientoEditar=idEstablecimiento;
				//alert($scope.idEstablecimientoEditar);
				$ionicHistory.clearCache().then(function(){ $state.go('app.editarEstablecimiento',{ "idEstablecimiento": $scope.idEstablecimientoEditar});});


		}
    //$scope.edicion=edicion;
   $scope.image = $localStorage.avatar;
}])
/*-------------
	AREA DE NOTIFICACIONES DE PERFIL PROFESIONAL
--------------*/
.controller('NotificacionesProfesionalCtrl',['$scope','usuarios','$localStorage', function($scope,usuarios,$localStorage){
	$scope.notficaciones = {};
	$scope.mensajeConf = {};
	$scope.mensajeConf.vis = "false";
	angular.element(document).ready(function () {
		usuarios.notificacionesProfesionalSolicitudesEstablecimiento($localStorage.sesion.id).success(function (data){
			$scope.respuesta=data;
		})
	});
	//funcion para confirmar notificaciion de solicitud de establecimientos
	//recibe como parametro el id de la notificacion
	$scope.confirmarSolicitudEstablecimientoProfesional = function(idNotificacion,accion){
		if(accion == "conf"){
			testRequest.confirmarSolicitudEstablecimientoProfesional(idNotificacion,accion).success(function(data){
				$scope.respuestaconf = data;

				if($scope.respuestaconf.respuesta == "solicitud aceptada"){
					$scope.mensajeConf.mensaje = "la solicitud fue aceptada";
					$scope.mensajeConf.vis = "true";
				}
				if($scope.respuestaconf.respuesta == "solicitud rechazada"){
					$scope.mensajeConf.mensaje = "la solicitud fue rechazada";
					$scope.mensajeConf.vis = "true";
				}
				console.log($scope.respuestaconf);
			})
		}
		alert(accion);

	}

}])

/*-------------
	CONFIRMACION DE PERFIL TIPO CLIENTE A PROFESIONAL (MODAL)
--------------*/
.controller('confirmacionProfesionalCtrl',['$scope','$mdDialog', '$ionicHistory', '$state', function($scope,$mdDialog,$ionicHistory,$state){

	$scope.irCrearPerfilPro= function(){
		$scope.cancel();
		$ionicHistory.clearCache().then(function(){ $state.go('app.confirmarPerfilPro');});
	};

	//funciones de cierre de modal
	//cierre de modal
	$scope.hide = function() {
	 $mdDialog.hide();
	};

	$scope.cancel = function() {
	 $mdDialog.cancel();
	};

	$scope.answer = function(answer) {
	 $mdDialog.hide(answer);
	};
}])

/*----------------
	Creacion perfil profesional a partir de un perfil Cliente (formulario)
-------------------*/
.controller('confirmacionPerCl-PrCtrl',['$scope','usuarios', '$localStorage', '$ionicHistory','$state','upload','$timeout',function($scope,usuarios,$localStorage,$ionicHistory,$state,upload,$timeout){
	$scope.datos	=	{};
	$scope.archivos	=	{};
	$scope.upload	=	{};
	//funcion para guardar datos y subir archivos
	$scope.guardardatosProfesional = function(){
		//datos ingresados
		$scope.upload.cedula = $scope.datos.cedula;
		$scope.upload.direccion = $scope.datos.direccion;
		if($scope.datos.cedula!=undefined && $scope.datos.direccion!=undefined){
			if($scope.archivos.cedula != undefined && $scope.archivos.rutCdC != undefined && $scope.archivos.antecedentes != undefined){
				usuarios.duplicarperfilCl_Pr($localStorage.sesion.id,$scope.upload).success(function (data){
						$scope.respuest=data;
						if($scope.respuest.resultado=="true"){
							$localStorage.sesion.tipousr=2;
							//archivos
							//cedula
							if($scope.archivos.cedula != undefined){
								var filec = $scope.archivos.cedula;
								upload.uploadFile(filec, $localStorage.sesion.id,$localStorage.sesion.tipousr,"cedula").then(function(data){
									$scope.rescedula=data;
									console.log($scope.rescedula.data);
									if($scope.rescedula.data.respuesta == "true"){

									}else if($scope.rescedula.data.respuesta == "true2"){

									}else{
										alert("Error al guardar la cedula");

									}
								})
							}
							//rut
							if($scope.archivos.rutCdC != undefined){
								var filer =$scope.archivos.rutCdC;
								upload.uploadFile(filer, $localStorage.sesion.id,$localStorage.sesion.tipousr,"rut").then(function(res){
									$scope.resrut = res;
									if($scope.resrut.data.respuesta == "true"){
										estadoRut=1;
									}else	if($scope.resrut.data.respuesta == "true2"){
										estadoRut=2;
									}else{
										alert("Error al cargar el Rut o Camara de Comercio");
										estadoRut=0;
									}
								})
							}
							//antecedentes
							if($scope.archivos.antecedentes != undefined){
								var filea =$scope.archivos.antecedentes;
								upload.uploadFile(filea, $localStorage.sesion.id,$localStorage.sesion.tipousr,"antecedentes").then(function(res){
									$scope.resantecedentes = res;
									if($scope.resantecedentes.data.respuesta == "true"){

									}else if($scope.resantecedentes.data.respuesta == "true2"){

									}else{
										alert("Error al cargar los antecedentes");
									}

								})
							}

							alert("perfil creado con exito");
							//$localStorage.sesion.tipousr=2;
							$timeout(500);
							$ionicHistory.clearCache().then(function(){ $state.go('app.profile');});
						}else{
							alert($scope.respuest.resultado);
						}
				});
			}else{
				alert("Todos los documetos deben ser adjuntados");
			}
		}else{
			alert("Los datos deben ser diligenciados");
		}
	}
	//carga de archivos
	/*$scope.uploadFile = function(archivo){
		var file = archivo;
		console.log(file);
		upload.uploadFile(file, $localStorage.sesion.id,$localStorage.sesion.tipousr,"fotoperfil").then(function(res)
		{
			console.log(res);
			$state.reload();
		})
	}*/
}])
/*--------------
	Adicion de establecimientos al perfil profesional
---------------*/
.controller('AddSiteprfCtrl',['$scope','usuarios','$localStorage','$ionicHistory','$state','$stateParams', function($scope, usuarios, $localStorage,$ionicHistory,$state,$stateParams) {
	$scope.resultadosBusqueda = {};
	$scope.establecimientos = {};
	angular.element(document).ready(function () {
			//redirecciona en caso del que el usuario sea de tipo cliente
			if($localStorage.tpuser==1){
    		alert("Lo sentimos no tienes autorizacion para estar en esta area...");
    		$ionicHistory.clearCache().then(function(){ $state.go('app.profile');});
    	}
			//realiza la busqueda cuando se carga la pagina con los parametros que recebe por el $stateParams
			usuarios.consultaestablecimientos($stateParams.establecimiento).success(function(data){
				$scope.establecimientos=data;
				if($scope.establecimientos.resultado == "No ha resultados"){
						$scope.establecimientos=[];
						$scope.agregar.mensaje="No hay resultados para tu busqueda";
				}else{
							$scope.agregar.mensaje="No esta tu establecimiento, agregalo aqui.";
				}
				//console.log($scope.establecimientos);
			})
	});
	//Recarga la pagina para obtener los resultados de la busqueda
	$scope.ir = function (){
		$ionicHistory.clearCache().then(function(){ $state.go('app.addsite',{ "establecimiento": $scope.busqueda});});
	}
	//redirecciona a la carga de documentos para la confirmacion del propietario del establecimiento
	$scope.agregar = function(idEstablecimiento){

		$ionicHistory.clearCache().then(function(){ $state.go('app.documentosEstablecimientos',{ "idEstablecimiento": idEstablecimiento});});
	}
	//redirecciona al area para crear un establecimiento  que no este en la base de datos

}])
/*-----------------------
	vista del perfil del establecimiento
-------------------------*/
.controller('SiteProfileCtrl', [ '$scope', '$http', '$localStorage', '$ionicLoading', '$stateParams', 'establecimientos', 'perfiles', function($scope, $http, $localStorage, $ionicLoading, $stateParams, establecimientos, perfiles ) {
		$scope.idEstablecimiento = $stateParams.idEstablecimiento;
		$scope.datos = null;
		$scope.login = false;
		$scope.idUsuario = null;
		$scope.comentario = null;
		$scope.disabled = false;
		$scope.categorias = {};
		$scope.servicios = {};


		$scope.inicializarEstablecimiento = function(){

			if( $localStorage.sesion.login == 1 ){
				$scope.login = true;
				$scope.idUsuario = $localStorage.sesion.id;
			}
			establecimientos.consultaEstablecimientoPorId( $scope.idEstablecimiento, $scope.idUsuario )
				.success(function(data){
					$scope.datos = data;
					$scope.cargarValoracion();
					if( $scope.datos.voto != null ){
						var star = $scope.datos.voto - 1;
						var stars = document.getElementsByClassName('star_rate');
						for( var i = 0; i <= star; i++ ) stars[i].className = "icon star_rate ion-ios-star siteprofile-star-icon";
						for( var i = star+1; i < 5; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline siteprofile-star-icon";
					}
					var i = 0;
					for( var key in $scope.datos.categorias ){
						$scope.categorias[i] = false;
						i++;
					}
					$scope.comentario = { contenido: "" };
				});
		};

		$scope.anadirFavoritos = function(){
			establecimientos.anadirFavoritos( $scope.idEstablecimiento, $scope.idUsuario )
				.success( function(data){
					if( data == "true" )
							$scope.datos.favoritos = true;
				});
		};

		$scope.sacarFavoritos = function(){
			establecimientos.sacarFavoritos( $scope.idEstablecimiento, $scope.idUsuario )
				.success( function(data){
					if( data == "true" )
							$scope.datos.favoritos = false;
				});
		};

		$scope.clickStar = function( star ){
			var stars = document.getElementsByClassName('star_rate');

			for( var i = 0; i <= star; i++ ) stars[i].className = "icon star_rate ion-ios-star siteprofile-star-icon";
			for( var i = star+1; i < 5; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline siteprofile-star-icon";

			perfiles.actualizarVoto( "votoEstablecimiento", $scope.idEstablecimiento, $scope.idUsuario, star+1 )
				.success( function(data){

				});
		};

		$scope.cargarValoracion = function(){
			var star_cant = Math.round($scope.datos.valoracion-1);
			var stars_value = document.getElementsByClassName('star_value');
			for( var i = 0; i <= star_cant; i++ ) stars_value[i].className = "icon star_value ion-ios-star siteprofile-star-icon";
			for( var i = star_cant+1; i < 5; i++ ) stars_value[i].className = "icon star_value ion-ios-star-outline siteprofile-star-icon";
		};

		$scope.realizarComentario = function(){
			var d = new Date();
			var fecha = ""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
			var comentario = {comentario: $scope.comentario.contenido, fecha: fecha, idUsuario: $scope.idUsuario, foto: $localStorage.sesion.foto, nombre: $localStorage.sesion.nickname };

			perfiles.realizarComentario( "comentarioEstablecimiento", $scope.idEstablecimiento, $scope.idUsuario, $scope.comentario.contenido )
				.success( function(data){
					$scope.datos.comentarios = [comentario].concat($scope.datos.comentarios);
					$scope.comentario.contenido = "";
				});
		};

		$scope.cargarMasComentarios = function(){
			perfiles.cargarMasComentarios( "establecimiento", $scope.idEstablecimiento, $scope.datos.comentarios.length )
				.success( function(data){
					if(data.resultado != false)
						$scope.datos.comentarios = $scope.datos.comentarios.concat(data.resultado);
					else
						$scope.disabled = true;
				});
		};

		$scope.inicializarEstablecimiento();

		$scope.onSlideMove = function(data){
			//console.log("You have selected " + data.index + " tab");
		};

		$scope.openServices = function( index ){
			var elem = document.getElementById( "services-wrapper-"+index );
			if (elem.style.display === 'none') {
	        elem.style.display = 'block';
	    } else {
	        elem.style.display = 'none';
	    }
		};

		$scope.openService = function( categoria, servicio ){
			var elem = document.getElementById( "service-description-"+categoria+"-"+servicio );
			console.log(elem);
			if (elem.style.display === 'none') {
	        elem.style.display = 'block';
	    } else {
	        elem.style.display = 'none';
	    }
		};
}])
/*-----------------
	Creacion de un establecimiento nuevo
--------------------*/
.controller('crearEstablecimientoNuevosCtrl',['$scope', 'usuarios', '$localStorage', '$ionicHistory','$state','upload','$cordovaGeolocation','$ionicLoading','$stateParams','$ionicModal', function($scope,usuarios,$localStorage,$ionicHistory,$state,upload,$cordovaGeolocation,$ionicLoading,$stateParams,$ionicModal){
	$scope.datos={};
	$scope.upload={};
	$scope.archivos={};
	$scope.error = 0;
	/*------- MAPA ---------*/
		//variables del mapa
		$scope.map = null;
		$scope.markers = {};
		$scope.markers.latitud = 4.6603324;
		$scope.markers.longitud = -74.0908335;
		$scope.center_position = {
			lat: 4.6603324,
			lng: -74.0908335
		};
		$scope.$on('mapInitialized', function(event, map) {
			$scope.map = map;
			$scope.map.addListener('dragend', $scope.handleDragend);
			$scope.centerOnMe();
		});
		//ubicacion actual
		$scope.centerOnMe= function(){
			$scope.positions = [];
			$ionicLoading.show({
			  template: 'Cargando...'
			});
			// with this function you can get the user’s current position
			// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
			var options = {timeout: 10000, enableHighAccuracy: false};
			$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  $scope.map.setZoom(15);
			  $scope.map.setCenter(pos);
			  $ionicLoading.hide();
			});
		};
		//arrastre del mapa obtiene la ubicacion central del mapa
		$scope.handleDragend = function(){
		$scope.markers={};
		$scope.markers.latitud = $scope.map.getCenter().lat();
		$scope.markers.longitud = $scope.map.getCenter().lng();
		console.log($scope.markers);
	};
	/*-------FIN MAPA ---------*/
	$scope.crearestablecimiento= function (){
		$scope.errormsg = {};
		$scope.datos.latitudlocal=$scope.markers.latitud;
		$scope.datos.longitudlocal=$scope.markers.longitud;
		//validacion de campos
		//imagen
		if($scope.archivos.foto == undefined){
			$scope.error = 1;
			$scope.errormsg.foto = "No has cargado ninguna imagen";
		}
		//nombre
		if($scope.datos.nombrelocal == undefined || $scope.datos.nombrelocal == "" ){
			$scope.error = 2;
			$scope.errormsg.nombre = "Ingresa un nombre";
		}
		//direccion
		if($scope.datos.direccionlocal == undefined || $scope.datos.direccionlocal == "" ){
			$scope.error = 3;
			$scope.errormsg.direccion = "Ingresa una direccion valida";
		}
		//telefono
		if( validarNumero($scope.datos.telefonolocal)=="false" || $scope.datos.telefonolocal == undefined){
			$scope.error = 4;
			$scope.errormsg.telefono="Ingrese un numero de telefono valido";
		}
		//celular
		if(validarNumero($scope.datos.celularlocal)=="false" || $scope.datos.celularlocal == undefined || $scope.datos.celularlocal==""){
			$scope.error = 5;
			$scope.errormsg.celular ="Ingrese un numero de celular valido";
		}
		//CORREO
		if(validarCorreo($scope.datos.correolocal) =="false"){
			$scope.error = 6;
			$scope.errormsg.correo = "Ingrese un correo valido";
			console.log(validarCorreo($scope.datos.correolocal));
		}

		if($scope.error == 0){
			$ionicLoading.show({
			  template: 'Cargando...'
			});
			//validacion del nombre del establecimiento
			usuarios.validarNombreEstablecimiento($scope.datos.nombrelocal).success(function (data){
				$scope.validacionNombre=data;
				$ionicLoading.hide();
				if($scope.validacionNombre.resultado == "false"){
					//creacion del registro del establecimiento
					usuarios.crearestablecimientonuevo($localStorage.sesion.id,$localStorage.sesion.tipousr,$scope.datos).success(function (data) {
						$scope.respuesta = data;
						console.log($scope.respuesta);
						if($scope.respuesta.resultado !=""){
							cargaArchivo($scope.archivos.foto,"fotoEstablecimiento",$scope.respuesta.resultado);
							alert("El establecimiento se ha creado con exito");
							$ionicHistory.clearCache().then(function(){ $state.go('app.documentosEstablecimientos',{ "idEstablecimiento": $scope.respuesta.resultado});});
						}else{
							alert("error al guardar");
						}
					})
				}else if($scope.validacionNombre.resultado == "true"){
					alert("ya hay un establecimiento con este nombre.");

				}
			})
		}else{
			alert("Faltan campos por llenar, todos los campos son obligatorios");
			$scope.error = 0;
		}
		console.log($scope.datos);
	}
	/*---------
		valida si la cadena es numerica
		recibe como parametro la cadena a revisar(numero telefono)
	------------------*/
	var validarNumero = function(numero){
		if (!/^([0-9])*$/.test(numero)){
			return "false";
		}else{
			return "true";
		}
		console.log($scope.datos);
	}
	/*---------
		valida si la cadena es un correo electronico valido
		recibe como parametro la cadena a revisar(correo electronico)
	------------------*/
	var validarCorreo = function(correo){
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(correo)){
			return "true";
		}else{
			return "false";
		}
	}
	/*---------
		carga de archivos,
		recibe como parametros el archivo y la descripcion(rutEstb, camaraEst,)
		en el campo del id del usuario se inserta el id de la solicitud (2do. parametro de la fumncion)
	------------------*/
	var cargaArchivo = function(archivo,descripcion,idRegistro){
		var file = archivo;
		upload.uploadFile(file, idRegistro,$localStorage.sesion.tipousr,descripcion).then(function(res)
		{
			console.log(res);
			$state.reload();
		})
	}
}])
/*-----------------
	Edicion de un establecimiento
--------------------*/
.controller('editarEstablecimientoCtrl',['$scope','usuarios', '$localStorage', '$ionicHistory','$state','upload','$cordovaGeolocation','$ionicLoading','$stateParams', function($scope,usuarios,$localStorage,$ionicHistory,$state,upload,$cordovaGeolocation,$ionicLoading,$stateParams){
	$scope.datos={};
	$scope.archivos={};
	$scope.validacion={};
	$scope.center_position = {};
	$scope.profesionales = {};
	/*------------CARGA INICIAL DEL FORMULARIO ------------------------*/
	angular.element(document).ready(function () {
		/*----validacion de edicion de establecimiento----*/
		usuarios.validarEdicionEstablecimiento($stateParams.idEstablecimiento).success(function(data){
			$scope.validacion=data;
			console.log($scope.validacion);
			//validacion de la existencia de una solicitud de edicion previa y la muesta
			if($scope.validacion.resultado == "true"){
				$scope.datos=$scope.validacion.datos;
				$scope.center_position = {
					lat: $scope.validacion.datos.latitud,
					lng: $scope.validacion.datos.longitud
				};
			//si no hay solicitud previa trae los datos originales
			}else if($scope.validacion.resultado == "false"){
				usuarios.consultaestablecimientoid($stateParams.idEstablecimiento).success(function (data){
					$localStorage.avatar="";
					$scope.datos=data;
					$scope.center_position = {
						lat: $scope.datos.latitud,
						lng: $scope.datos.longitud
					};
				});
			}

		})
		/*----lista de profesionales asociados al establecimiento ------*/
		usuarios.listaProfesionalesEstablecimiento($stateParams.idEstablecimiento).success(function(data){
			$scope.profesionales = data;
			if($scope.profesionales.respuesta == "true" ){
				$scope.profesionales.mensaje = "Profesionales del establecimiento";
			}else{
				$scope.profesionales.mensaje = "No hay profesionales asociados al establecimiento";
			}
		})

	});
	/*------------FIN CARGA INICIAL DEL FORMULARIO ------------------------*/
	/*------- MAPA ---------*/
		//variables del mapa
		$scope.map = null;
		$scope.markers = {};
		$scope.markers.latitud = $scope.datos.latitud;
		$scope.markers.longitud = $scope.datos.longitud;

		$scope.$on('mapInitialized', function(event, map) {
			$scope.map = map;
			$scope.map.setZoom(15);
			$scope.map.addListener('dragend', $scope.handleDragend);
			console.log($scope.datos);
		});
		//ubicacion actual
		$scope.centerOnMe= function(){
			$scope.positions = [];
			$ionicLoading.show({
				template: 'Cargando...'
			});
			// with this function you can get the user’s current position
			// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
			var options = {timeout: 10000, enableHighAccuracy: false};
			$cordovaGeolocation.getCurrentPosition(options).then(function(position){
				var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				$scope.map.setZoom(15);
				$scope.map.setCenter(pos);
				$ionicLoading.hide();
			});
		};
		//arrastre del mapa obtiene la ubicacion central del mapa
		$scope.handleDragend = function(){
		$scope.markers={};
		$scope.markers.latitud = $scope.map.getCenter().lat();
		$scope.markers.longitud = $scope.map.getCenter().lng();
		console.log($scope.markers);
	};
	/*-------FIN MAPA ---------*/
	/*---------ACTUALIZACION DE INFORMACION -----*/
		$scope.actualizarestablecimiento = function(){
		$scope.datos.idUsuario = $localStorage.sesion.id;
		usuarios.actualizarestablecimiento($scope.datos).success(function(data){
			$scope.resultado=data;
			if($scope.resultado.resultado==1){
				alert("tu informacion esta siendo procesada, pronto te contactaremos");
				if($scope.archivos.foto != undefined){
					cargaArchivo($scope.archivos.foto,"solicitudEdicionLocal",$stateParams.idEstablecimiento);
				}
			}
			console.log($scope.resultado);
		})

	}
	/*--------FIN ACTUALIZACION DE INFO ----------*/
	/*-------CARGA FOTO ------*/
		var cargaArchivo = function(archivo,descripcion,idEstablecimiento){
			var file = archivo;
			upload.uploadFile(file, idEstablecimiento,$localStorage.sesion.tipousr,descripcion).then(function(res)
			{
				console.log(res);
				$state.reload();
			})
		}
	/*-------FIN CARGA FOTO----*/
	/*-------REDIRECCIONAMIENTO A BUSCAR PROFESIONAL----*/
	$scope.agregarProf = function(){
		$ionicHistory.clearCache().then(function(){ $state.go('app.addprofesite',{ "idestablecimiento": $stateParams.idEstablecimiento});});
	}
	/*-------FIN REDIRECCIONAMIENTO A BUSCAR PROFESIONAL----*/
	/*-------Eliminar profesional de la lista--------*/
	$scope.dltrest={};
	$scope.eliminarProf = function(idProfesional){
		usuarios.eliminarprofEst(idProfesional,$stateParams.idEstablecimiento).success(function(data){
			$scope.dltrest=data;
			console.log(data);
			if($scope.dltrest.respuesta == "true"){
				$scope.profesionales.profesionales={};
				$scope.profesionales.profesionales=$scope.dltrest.profesionales;
				alert("El profesional ha sido removido con exito.");
			}else{
				alert("Error al eliminar el profesional");
			}
		})
	}
	/*-------fin eliminar profesional de la lista-----*/
}])
/*------------------
	confirmacion y carga de documentacion para el asociar establecimiento
-------------**/
.controller('documentosEstablecimientoCtrl',['$scope', 'usuarios','$localStorage','$ionicHistory','$state','$stateParams','upload','$timeout',function($scope,usuarios, $localStorage,$ionicHistory,$state,$stateParams,upload,$timeout){
	$scope.datos	=	{};
	$scope.archivos	=	{};
	$scope.upload	=	{};
	/*--------
		trae los datos existentes del establecimiento
	----------*/
	angular.element(document).ready(function () {
		usuarios.consultaestablecimientoid($stateParams.idEstablecimiento).success(function(data){
			$scope.establecimiento=data;
			console.log($scope.establecimiento);
		})
	})
	/*--------
		Guarda los datos del formulario
	---------*/
	$scope.guardardatosEstablecimiento = function(){
		if($scope.datos.cedula!=undefined && $scope.datos.direccion!=undefined && $scope.datos.telefono!=undefined){
			if($scope.archivos.cedula!=undefined && $scope.archivos.camaracomercio!=undefined && $scope.archivos.rut!=undefined){
				$scope.upload.idUsuario = $localStorage.sesion.id;
				$scope.upload.cedula = $scope.datos.cedula;
				$scope.upload.direccion = $scope.datos.direccion;
				$scope.upload.telefono = $scope.datos.telefono;
				usuarios.confirmarCedula($scope.datos.cedula,$localStorage.sesion.id,$localStorage.sesion.tipousr).success(function (data) {
					$scope.validacion = data;
					if($scope.validacion.resultado == "true"){
						usuarios.validarPeticionEstablecimiento($localStorage.sesion.id,$stateParams.idEstablecimiento,$localStorage.sesion.tipousr).success(function (data) {
							$scope.validacionpeticion = data;
							if($scope.validacionpeticion.resultado == "false"){
								usuarios.solicitudpropiedadestablecimiento($stateParams.idEstablecimiento,$scope.upload).success(function (data){
									$scope.resultado=data;
									if($scope.resultado.resultado != 0){
										console.log($scope.resultado.resultado);
										$scope.id=$scope.resultado.resultado;
										//carga de la cedula
										cargaArchivo($scope.archivos.cedula,"cedulalocal",$scope.resultado.resultado);
										cargaArchivo($scope.archivos.camaracomercio,"camaraComerciolocal",$scope.resultado.resultado);
										cargaArchivo($scope.archivos.rut,"rutlocal",$scope.resultado.resultado);
										alert("La solicitud ha sido enviada con exito, pronto nos pondremos en contacto");
										$timeout(500);
										$ionicHistory.clearCache().then(function(){ $state.go('app.profile');});
									}else{
										alert("error");
									}
								})
							}else{
								alert("Ya tienes una peticion sobre este establecimiento en proceso.");
								$ionicHistory.clearCache().then(function(){ $state.go('app.addsite',{ "establecimiento": ""});});
							}
						})
					}else{
						alert("El numero de cedula no coicide");
					}


				})
			}else{
				alert("Es necesario cargar todos los documentos");
			}
		}else{
			alert("Todos los campos deben ser diligenciados");
		}

	}
	/*---------
	carga de archivos,
	recibe como parametros el archivo y la descripcion(rutEstb, camaraEst,)
	en el campo del id del usuario se inserta el id de la solicitud (2do. parametro de la fumncion)
	------------------*/
	var cargaArchivo = function(archivo,descripcion,idRegistro){
		var file = archivo;
		upload.uploadFile(file, idRegistro,$localStorage.sesion.tipousr,descripcion).then(function(res)
		{
			console.log(res);
			$state.reload();
		})
	}

}])

/*----------------
	agregar procesional al establecimiento
-----------------*/
.controller('AddProfesionalEstablecimientoCtrl',['$scope','$stateParams','$state','$localStorage','$ionicHistory','usuarios',function($scope,$stateParams,$state,$localStorage,$ionicHistory,usuarios){
	$scope.validacion = {};
	$scope.resultado = {};
	$scope.datos = {};

	if($stateParams.profesional!=""){
		angular.element(document).ready(function () {
			$scope.datos = {};
			$scope.validacion = {};
			usuarios.consultaperfilprofCedula($stateParams.profesional).success(function(data){
				$scope.resultado = data;
				if($scope.resultado.resultado == "true"){
					$scope.validacion.resultado = true;
					cargardatos($scope.resultado.datos);
				}else{
					$scope.validacion.resultado = false;
					$scope.mensaje = "No hay resultados para la busqueda, vuelva a intentarlo";
				}
			})
		})
	}else{
		$scope.validacion.resultado = false;
		$scope.mensaje = "Ingrese el numero de cedula del Profesional";
	}
	//boton busqueda del numero de cedula del profesional
	$scope.ir = function(){
		if(/^([0-9])*$/.test($scope.busqueda)){
			$scope.datos = {};
			$ionicHistory.clearCache().then(function(){ $state.go('app.addprofesite',{ "idestablecimiento":$stateParams.idestablecimiento,"profesional": $scope.busqueda});});
		}else{
			alert("Ingrese un numero de cedula valido");
		}
	}
	//fin boton busqueda
	//carga los datos del formulario
	var cargardatos = function(datos){
		$scope.datos=datos;
	}
	//fin carga datos formulario
	//Agrega el ptrofesional al establecimiento
	$scope.agregarProfesional = function(){
		$scope.addres = {};
		usuarios.agregarProfesionalEstablecimiento($scope.datos.idUsuario,$stateParams.idestablecimiento).success(function(data){
			$scope.addres = data;
			if($scope.addres.respuesta == "true"){
				alert("Se agrego exitosamente el Profesional a tu establecimiento");
				$ionicHistory.clearCache().then(function(){ $state.go('app.editarEstablecimiento',{ "idEstablecimiento":$stateParams.idestablecimiento});});
			}
		})
	}
	//Agrega el profesional al establecimiento
}])


/*------------------
	EDICION PERFIL DE USUARIO
-------------------*/
.controller('EditProfileCtrl', ['$scope','usuarios', '$localStorage', 'upload', '$state', function($scope,usuarios,$localStorage,upload,$state) {
	$scope.image = $localStorage.avatar;
	//date picker
	$scope.myDate = new Date();

	$scope.minDate = new Date(
	  $scope.myDate.getFullYear(),
	  $scope.myDate.getMonth() - 2,
	  $scope.myDate.getDate());

	$scope.maxDate = new Date(
	  $scope.myDate.getFullYear(),
	  $scope.myDate.getMonth() + 2,
	  $scope.myDate.getDate());

	$scope.onlyWeekendsPredicate = function(date) {
	var day = date.getDay();
	return day === 0 || day === 6;
	};
	//cierre date picker
	//verificacion del estado de las sesion
	$scope.mostrar={};
	//$scope.mostrar.imagen="https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg";
	angular.element(document).ready(function () {
      	usuarios.consultaperfil($localStorage.iduser, $localStorage.tpuser).success(function (data){
      		$localStorage.avatar="";
      		$scope.datos=data;
      		$localStorage.avatar=$scope.datos.avatar;
      		$scope.fechana = new Date(
      			$scope.datos.fnacimiento
      		);
      		///carga de datos al formulario
      		$scope.mostrar.nombreUsuario=$scope.datos.nombre;
      		$scope.mostrar.apellidoUsuario=$scope.datos.apellido;
      		$scope.mostrar.fecha=$scope.fechana;
      		$scope.mostrar.mas=angular.equals($scope.datos.genero, "Masculino");
      		$scope.mostrar.fem=angular.equals($scope.datos.genero, "Femenino");
					$scope.mostrar.correoUsuario=$scope.datos.correo;
					$scope.mostrar.telefonoUsuario=$scope.datos.telefono;
					$scope.mostrar.inf_user=$scope.datos.sobre;
					$scope.mostrar.imagen=$scope.datos.avatar;

      	});

    });

   	//actualiza los datos del perfil
	$scope.Guardarperfil=function(){
   		$scope.update={};
   		$scope.update.nombre=$scope.mostrar.nombreUsuario;
   		$scope.update.apellido=$scope.mostrar.apellidoUsuario;
   		$scope.update.nacimiento=$scope.mostrar.fecha;
   		var vali=angular.equals($scope.mostrar.prueba, undefined);
   		if(vali){
   			$scope.mostrar.prueba=$scope.datos.genero;
   		}
   		$scope.update.genero=$scope.mostrar.prueba;
   		$scope.update.correo=$scope.mostrar.correoUsuario;
   		$scope.update.telefono=$scope.mostrar.telefonoUsuario;
   		$scope.update.info=$scope.mostrar.inf_user;
   		var file = $scope.file;
   		//envio de datos a la api
   		usuarios.guardar($localStorage.iduser,$localStorage.tpuser,$scope.update).success(function (data){
				$scope.respuest=data;
				$val=angular.equals($scope.respuest.resultado,"true")
				if($val){
					alert("los datos han sido guardados");
					$state.reload();
				}else{
					alert("error al guardar los datos");
				}

   		});
   	}
	//carga la imagen
    $scope.uploadFile = function(){
		var file = $scope.file;
		console.log(file);
		upload.uploadFile(file, $localStorage.iduser,$localStorage.tpuser,"avatar").then(function(res)
		{
			console.log(res);
			$state.reload();
		})
	}

}])


/*------------------
	INICIO SESION
-------------------*/
.controller('LoginCtrl', [ '$scope', '$state', '$templateCache', '$q', '$rootScope', 'usuarios', '$localStorage','$ionicHistory', '$cordovaOauth', 'facebook', 'google', '$mdDialog', function($scope, $state, $templateCache, $q, $rootScope, usuarios, $localStorage, $ionicHistory, $cordovaOauth, facebook, google, $mdDialog) {
	$scope.inises={};
	$scope.data={};
	$scope.respuesta={};
	//INICIO SESION CON CORREO
	$scope.doLogIn = function(tp){
		usuarios.iniciarsesion($scope.user.email, $scope.user.password, tp).success(function (data){
			$scope.inises=data; // Asignaremos los datos del post
			inicioSesion($scope.inises);

		});

	};
	// FIN INICIO SESIO CON CORREO
	//PROCESO PARA INICIO DE SESION
	var inicioSesion=function(data){
		$scope.data=data;
		//Se almacena los datos de sesion en la variable $localStorage
		$scope.respuesta=$scope.data.resultado;

		if($scope.respuesta=="el usuario no existe"){
			alert("El Usuario no existe");
		}else{
			if($scope.data.resultado.login==1){
				$localStorage.$reset();
				$localStorage.sesion=$scope.data.resultado;
				$mdDialog.cancel();
				location.reload()
				//$ionicHistory.clearCache().then(function(){ $state.go('app.home');});
			}else{
				alert("Verifica tu correo y contraseña, estan incorrectas.");
			}
		}
	}
	//FIN PROCESO PARA INICIO DE SESION
	$scope.user = {};
	// We need this for the form validation
	$scope.selected_tab = "";
	$scope.$on('my-tabs-changed', function (event, data) {
		$scope.selected_tab = data.title;
	});
	//INICIO  DE SESION CON FACEBOOK
	$scope.LoginwithFacebook = function(tp){
		$cordovaOauth.facebook("1259705227414283", ["email","public_profile", "user_friends"]).then(function(result) {
    	facebook.iniciosesionfb(result.access_token).success(function (data){
				var emailf=data.email;
				var idusrf=data.id;
				usuarios.validarcorreo(data.email,tp).success(function (res){
					if(res.resultado=="false"){
						alert("lo sentimos la cuenta aun no esta registrada");
					}else{
						usuarios.iniciarsesion(emailf, idusrf, tp).success(function (data){
							$scope.inises=data; // Asignaremos los datos del post
							inicioSesion($scope.inises);
						});
					}
				});
			});
  	}, function(error) {
        alert("Auth Failed..!!"+error);
    });
  };
	// FIN INICIO SESION CON FACEBOOK
  //INICIO DE SESION CON GOOGLE+
  $scope.LoginwithGoogle = function(tp){
	 	$cordovaOauth.google("368699238304-i1fv4h6f4sn1q0vn7ofkqhbmvjnvt64n.apps.googleusercontent.com", ["email"]).then(function(result) {
	 		google.iniciosesiongoogle(result.access_token).success(function (data){
				var emailg="";
	 			var imageng="";
	 			var idusr="";
				for (key in data) {
					if(key=="emails"){
						email=data[key];
						emailg=email[0]["value"];
					}
					if(key=="image"){
						image=data[key];
						imageng=image["url"];
					}
					if(key=="id"){
						idusr=data[key];
					}
				}
        usuarios.validarcorreo(emailg,tp).success(function (res){
        	if(res.resultado=="false"){
						alert("La cuenta aun no esta registrada");
					}else{
						usuarios.iniciarsesion(emailg, idusr,tp).success(function (data){
							$scope.inises=data; // Asignaremos los datos del post
							inicioSesion($scope.inises);
						});
					}
	      });
			});
	 	}, function(error) {
	 		alert("Error !!"+error);
	 	});
	};
	//FIN INICIO SESION CON GOOGLE+
	//cierre de modal
	$scope.hide = function() {
	 $mdDialog.hide();
	};

	$scope.cancel = function() {
	 $mdDialog.cancel();
	};

	$scope.answer = function(answer) {
	 $mdDialog.hide(answer);
	};

}])
/*---------------
	FIN INICIO SESION
---------------*/
/*---------------
	REGISTRO DE USUARIO (CORREO/FACEBOOK/GOOGLE)
---------------*/

.controller('SignupCtrl', ['$scope','usuarios','$state', '$cordovaOauth', 'facebook', 'google','$localStorage', '$ionicHistory', '$mdDialog', function($scope, usuarios, $state, $cordovaOauth, facebook, google, $localStorage, $ionicHistory,  $mdDialog) {
	//REGISTRO CON CORREO
	$scope.user = {};
	$scope.doSignUp = function(tp){
		$scope.crear={};
		usuarios.validarcorreo($scope.user.email,tp).success(function (res){
			if(res.resultado=="true"){
				alert("Ya existe una cuenta asociada a este correo: "+$scope.user.email);
			}else{
				//nombre,apellido,correo,telefono,genero,fechanacimiento,contrasena,imagen,tipoperfil
				usuarios.crear("", "", $scope.user.email, "", "","",$scope.user.password,"",tp).success(function (data){
					$scope.crear=data; // Asignaremos los datos del post
				});
				usuarios.iniciarsesion($scope.user.email, $scope.user.password, tp).success(function (data){
					$scope.inises=data; // Asignaremos los datos del post
					inicioSesion($scope.inises);
				});
				$state.go('app.profile');
			}
		});


	};
	//FIN REGISTRO CON CORREO
	//PROCESO PARA INICIO DE SESION
	var inicioSesion=function(data){
		$scope.data=data;
		//Se almacena los datos de sesion en la variable $localStorage
		$scope.respuesta=$scope.data.resultado;

		if($scope.respuesta=="el usuario no existe"){
			alert("El Usuario no existe");
		}else{
			if($scope.data.resultado.login==1){
				$localStorage.$reset();
				$localStorage.sesion=$scope.data.resultado;
				$mdDialog.cancel();
				$ionicHistory.clearCache().then(function(){ $state.go('app.home');});
			}else{
				alert("Verifica tu correo y contraseña, estan incorrectas."+$scope.data.resultado.login);
			}
		}
	}
	//FIN PROCESO PARA INICIO DE SESION
	//REGISTRO CON FACEBOOK
	$scope.SignupwithFacebook = function(tp){
		$cordovaOauth.facebook("1259705227414283", ["email","public_profile", "user_friends"]).then(function(result) {
      $scope.datosfb={};
     	$scope.validacioncorreo={};
			facebook.registrofb(result.access_token).success(function (data){
				var arrayimg=data.picture.data;
	            $scope.datosfb.img=arrayimg.url;
	            var emailf=data.email;
	            var idusrf=data.id;
	            usuarios.validarcorreo(data.email,tp).success(function (res){
	            	if(res.resultado=="true"){
									alert("Ya existe una cuenta asociada a este correo: "+data.email);
								}else{
										usuarios.crear(data.name,"",data.email,"","","",data.id,arrayimg.url,tp).success(function (data){
										$scope.inises=data; // Asignaremos los datos del post
										//$scope.inises.logeado=$scope.inises.resultado.login;
										//INICIO DE SESION
										usuarios.iniciarsesion(emailf, idusrf,tp).success(function (data){
											$scope.inises=data; // Asignaremos los datos del post
											inicioSesion($scope.inises);
										});

									}, function(error) {
				            	alert("Error al realizar el registro..!!"+error);
				        		}
								);

					}
	            });
			 });

        }, function(error) {
            alert("Auth Failed..!!"+error);
        });
    };

	//FIN REGISTRO CON FACEBOOK
  //REGISTRO CON GOOGLE+
  $scope.SignupwithGoogle = function(tp){
		$cordovaOauth.google("368699238304-i1fv4h6f4sn1q0vn7ofkqhbmvjnvt64n.apps.googleusercontent.com", ["email"]).then(function(result) {
	 		google.registrogoogle(result.access_token).success(function (data){
	 			var emailg="";
	 			var imageng="";
	 			var idusr="";
	 			var tpu=tp;
				for (key in data) {
					if(key=="emails"){
						email=data[key];
						emailg=email[0]["value"];
					}
					if(key=="image"){
						image=data[key];
						imageng=image["url"];
					}
					if(key=="id"){
						idusr=data[key];
					}
				}
				usuarios.validarcorreo(emailg,tp).success(function (res){
	            	if(res.resultado=="true"){
						alert("Ya existe una cuenta asociada a este correo: "+data.email);
					}else{
						//nombre,apellido,correo,telefono,genero,fechanacimiento,contrasena,imagen,tipoperfil
						var genero;
						if(data.gender=="male"){
							genero="Masculino";
						}else{
							genero="Femenino";
						}

						usuarios.crear(data.displayName,"",emailg,"",genero,"",data.id,imageng,tpu).success(function (data){
							$scope.inises=data;
							//INICIO DE SESION
							usuarios.iniciarsesion(emailg, idusr, tpu).success(function (data){
								$scope.inises=data; // Asignaremos los datos del post
								inicioSesion($scope.inises);
							});
						}, function(error) {
				            alert("Error al realizar el registro..!!"+error);
				        });

					}
	            });
			});
	 	}, function(error) {
	 		alert("Error en el token..!!"+error);
	 	});
	};
	//FIN REGISTRO CON GOOGLE
	//CIERRE MODAL
	//cierre de modal
	$scope.hide = function() {
	 $mdDialog.hide();
	};

	$scope.cancel = function() {
	 $mdDialog.cancel();
	};

	$scope.answer = function(answer) {
	 $mdDialog.hide(answer);
	};

}])

/*----------------
	CIERRE DE SESION
------------------*/
.controller('LogOutCtrl',['$scope','$mdDialog','$localStorage','$ionicHistory', '$state',function($scope, $mdDialog, $localStorage,	$ionicHistory, $state ){
	$scope.cerrarSesion = function(){
			$localStorage.sesion={};
			alert("Se ha cerrado sesion correctamente, hasta la proxima.");
			//$ionicHistory.clearCache().then(function(){ $state.go('app.home');});
			$mdDialog.cancel();
			location.reload();
		}

	//funciones cierre de modal
	$scope.hide = function() {
	 $mdDialog.hide();
	};
	$scope.cancel = function() {
	 $mdDialog.cancel();
	};
	$scope.answer = function(answer) {
	 $mdDialog.hide(answer);
	};
}])

/*---------------
	RECUPERACION DE CONTRASEÑA
---------------*/
.controller('recuperarContrasenaCtrl',['$scope','usuarios',function($scope,usuarios){
	$scope.user={};
	 var value=1;
	 $scope.recordarContrasena = function(){
		if($scope.user.cbProfesional){
			value=2;
		}else{
			value=1;
		}
	  usuarios.recuperarContrasena($scope.user.email, value).success(function (data){
			$scope.inises=data; // Asignaremos los datos del post
			if($scope.inises == "correo enviado"){
				alert("Tu solicitud se proceso con exito, por favor revisa tu correo electronico "+$scope.user.email+" para completar el proceso.");
			}else{
				alert($scope.inises);
			}
		});
	}

}])
/*--------------
	VISUALIZACION DE LAS CATEGORIAS
---------------*/
.controller('vistacategoriasCtrl',['$scope','usuarios','$localStorage', function($scope, usuarios, $localStorage) {
	$scope.feeds_categories = [];
	angular.element(document).ready(function () {
      	usuarios.consultaservicios().success(function (data){
      		$scope.feeds_categories = data;
      	});

    });
}])
/*--------------
	VISUALIZACION DE PROFESIONALES POR CATEGORIAS
---------------*/
.controller('vistaprfcategoriasCtrl',['$scope','usuarios','$stateParams', function($scope,usuarios,$stateParams) {
	var idservicio=$stateParams.idCategoria;
	$scope.feeds_categories = [];
	angular.element(document).ready(function () {
      	usuarios.consultaprofesionales(idservicio).success(function (data){
      		$scope.feeds_categories = data;
      	});

    });
}])
/*--------------
	VISUALIZACION DEL PERFIL DEL PROFESIONAL
---------------*/
.controller('vistaperfilprfCtrl',['$scope','usuarios', 'profesionales', '$stateParams','$localStorage', '$http', 'perfiles', function($scope,usuarios, profesionales, $stateParams,$localStorage, $http, perfiles ) {
	$scope.idprofesional = $stateParams.idprofesional;
	$scope.login = false;
	$scope.comentario = null;

	angular.element(document).ready(function () {
				if( $localStorage.sesion.login == 1 ){
					$scope.login = true;
					$scope.idUsuario = $localStorage.sesion.id;
				}else {
					$scope.idUsuario = 0;
				}
      	usuarios.consultaperfilprof( $scope.idprofesional, $scope.idUsuario, 2).success(function (data){
					$scope.datos=data;
      		$localStorage.avatarprf=$scope.datos.avatar;
					if( $scope.datos.datosp != null ){
						if( $scope.datos.datosp.valoracion == null || $scope.datos.datosp.valoracion == 0 ){
							$scope.datos.stars = [];
							$scope.datos.nostars = [0,1,2,3,4];
						}else{
							$scope.datos.stars = [];
							$scope.datos.nostars = [];
							for( var j = 0; j < $scope.datos.datosp.valoracion; j++ ) $scope.datos.stars.push(j);
							for( var j = 0; j < 5 - $scope.datos.datosp.valoracion; j++ ) $scope.datos.nostars.push(j);
						}
					}

					if( $scope.datos.valoracion != null && $scope.datos.valoracion != 0 ){
						var star = $scope.datos.valoracion - 1;
						var stars = document.getElementsByClassName('star_rate');
						for( var i = 0; i <= star; i++ ) stars[i].className = "icon star_rate ion-ios-star siteprofile-star-icon";
						for( var i = star+1; i < 5; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline siteprofile-star-icon";
					}
					$scope.servicios = data.servicios;
					$scope.comentario = { contenido: "" };
      	});
    });
    $scope.image = $localStorage.avatarprf;

		$scope.openServices = function( index ){
			var elem = document.getElementById( "services-wrapper-"+index );
			if (elem.style.display === 'none') {
	        elem.style.display = 'block';
	    } else {
	        elem.style.display = 'none';
	    }
		};

		$scope.openService = function( categoria, servicio ){
			var elem = document.getElementById( "service-description-"+categoria+"-"+servicio );

			if (elem.style.display === 'none') {
	        elem.style.display = 'block';
	    } else {
	        elem.style.display = 'none';
	    }
		};

		$scope.realizarComentario = function(){
			var d = new Date();
			var fecha = ""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
			var comentario = {comentario: $scope.comentario.contenido, fecha: fecha, idUsuario: $scope.idUsuario, foto: $localStorage.sesion.foto, nombre: $localStorage.sesion.nickname };
			perfiles.realizarComentario( "comentarioProfesional", $scope.idprofesional, $scope.idUsuario, $scope.comentario.contenido )
				.success(function(data){
					if( data == "true" ){
						$scope.datos.comentarios = [comentario].concat($scope.datos.comentarios);
						$scope.comentario.contenido = "";
					}
				});
		};

		$scope.cargarMasComentarios = function(){
			perfiles.cargarMasComentarios( "profesional", $scope.idprofesional, $scope.datos.comentarios.length )
				.success(function(data){
					if( data != "false" )
						$scope.datos.comentarios = $scope.datos.comentarios.concat(data);
					else
						$scope.disabled = true;
				});
		};

		$scope.clickStar = function( star ){
			var stars = document.getElementsByClassName('star_rate');

			for( var i = 0; i <= star; i++ ) stars[i].className = "icon star_rate ion-ios-star siteprofile-star-icon";
			for( var i = star+1; i < 5; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline siteprofile-star-icon";

			perfiles.actualizarVoto( "votoProfesional", $scope.idprofesional, $scope.idUsuario, star+1 )
				.success(function(data){

				});
		};
}])

/*----------------
	MAPA PROFESIONALES CERCA
------------------*/

.controller('MapsCtrl', function($scope, $ionicLoading) {

	$scope.info_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.center_position = {
		lat: 43.07493,
		lng: -89.381388
	};

	$scope.my_location = "";

	$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
	});

	$scope.centerOnMe= function(){

		$scope.positions = [];

		$ionicLoading.show({
			template: 'Loading...'
		});

		// with this function you can get the user’s current position
		// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.current_position = {lat: position.coords.latitude, lng: position.coords.longitude};
			$scope.my_location = position.coords.latitude + ", " + position.coords.longitude;
			$scope.map.setCenter(pos);
			$ionicLoading.hide();
		}, function(err) {
				 // error
				$ionicLoading.hide();
		});
	};
})

/*-------------
	CODIGO BASE PLANTILLA
--------------*/

.controller('ForgotPasswordCtrl', function($scope, $state) {
	$scope.recoverPassword = function(){
		$state.go('app.feeds-categories');
	};

	$scope.user = {};
})

.controller('RateApp', function($scope) {
	$scope.rateApp = function(){
		if(ionic.Platform.isIOS()){
			//you need to set your own ios app id
			AppRate.preferences.storeAppURL.ios = '1234555553>';
			AppRate.promptForRating(true);
		}else if(ionic.Platform.isAndroid()){
			//you need to set your own android app id
			AppRate.preferences.storeAppURL.android = 'market://details?id=ionFB';
			AppRate.promptForRating(true);
		}
	};
})


.controller('SendMailCtrl', function($scope, $cordovaEmailComposer, $ionicPlatform) {
  //we use email composer cordova plugin, see the documentation for mor options: http://ngcordova.com/docs/plugins/emailComposer/
  $scope.sendMail = function(){
    $ionicPlatform.ready(function() {
      $cordovaEmailComposer.isAvailable().then(function() {
        // is available
        console.log("Is available");
        $cordovaEmailComposer.open({
          to: 'hi@startapplabs.com',
          subject: 'Nice Theme!',
  				body:    'How are you? Nice greetings from IonFullApp'
        }).then(null, function () {
          // user cancelled email
        });
      }, function () {
        // not available
        console.log("Not available");
      });
    });
  };
})


.controller('AdsCtrl', function($scope, $ionicActionSheet, AdMob, iAd) {

	$scope.manageAdMob = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
				{ text: 'Show Banner' },
				{ text: 'Show Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				AdMob.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show Banner')
				{
					console.log("show banner");
					AdMob.showBanner();
				}

				if(button.text == 'Show Interstitial')
				{
					console.log("show interstitial");
					AdMob.showInterstitial();
				}

				return true;
			}
		});
	};

	$scope.manageiAd = function() {

		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			buttons: [
			{ text: 'Show iAd Banner' },
			{ text: 'Show iAd Interstitial' }
			],
			destructiveText: 'Remove Ads',
			titleText: 'Choose the ad to show - Interstitial only works in iPad',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			destructiveButtonClicked: function() {
				console.log("removing ads");
				iAd.removeAds();
				return true;
			},
			buttonClicked: function(index, button) {
				if(button.text == 'Show iAd Banner')
				{
					console.log("show iAd banner");
					iAd.showBanner();
				}
				if(button.text == 'Show iAd Interstitial')
				{
					console.log("show iAd interstitial");
					iAd.showInterstitial();
				}
				return true;
			}
		});
	};
})

// FEED
//brings all feed categories
.controller('FeedsCategoriesCtrl', function($scope, $http) {
	$scope.feeds_categories = [];

	$http.get('feeds-categories.json').success(function(response) {
		$scope.feeds_categories = response;
	});
})

//bring specific category providers
.controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
	$scope.category_sources = [];

	$scope.categoryId = $stateParams.categoryId;

	$http.get('feeds-categories.json').success(function(response) {
		var category = _.find(response, {id: $scope.categoryId});
		$scope.categoryTitle = category.title;
		$scope.category_sources = category.feed_sources;
	});
})

//this method brings posts for a source provider
.controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {
	$scope.feed = [];

	var categoryId = $stateParams.categoryId,
			sourceId = $stateParams.sourceId;

	$scope.doRefresh = function() {

		$http.get('feeds-categories.json').success(function(response) {

			$ionicLoading.show({
				template: 'Loading entries...'
			});

			var category = _.find(response, {id: categoryId }),
					source = _.find(category.feed_sources, {id: sourceId });

			$scope.sourceTitle = source.title;

			FeedList.get(source.url)
			.then(function (result) {
				$scope.feed = result.feed;
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			}, function (reason) {
				$ionicLoading.hide();
				$scope.$broadcast('scroll.refreshComplete');
			});
		});
	};

	$scope.doRefresh();

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkFeedPost(post);
	};
})

// SETTINGS
.controller('SettingsCtrl', ['$scope', '$ionicActionSheet', '$state','$localStorage',function($scope, $ionicActionSheet, $state, $localStorage) {
	$scope.airplaneMode = true;
	$scope.wifi = false;
	$scope.bluetooth = true;
	$scope.personalHotspot = true;

	$scope.checkOpt1 = true;
	$scope.checkOpt2 = true;
	$scope.checkOpt3 = false;

	$scope.radioChoice = 'B';

	// Triggered on a the logOut button click
	$scope.showLogOutMenu = function() {
		$localStorage.sesion={};


		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {

				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){


				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
				$state.go('app.categorias');
				console.log($localStorage.sesion);
			}
		});

	};
}])

// TINDER CARDS
.controller('TinderCardsCtrl', function($scope, $http) {

	$scope.cards = [];


	$scope.addCard = function(img, name) {
		var newCard = {image: img, name: name};
		newCard.id = Math.random();
		$scope.cards.unshift(angular.extend({}, newCard));
	};

	$scope.addCards = function(count) {
		$http.get('http://api.randomuser.me/?results=' + count).then(function(value) {
			angular.forEach(value.data.results, function (v) {
				$scope.addCard(v.picture.large, v.name.first + " " + v.name.last);
			});
		});
	};

	$scope.addFirstCards = function() {
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/left.png","Nope");
		$scope.addCard("https://dl.dropboxusercontent.com/u/30675090/envato/tinder-cards/right.png", "Yes");
	};

	$scope.addFirstCards();
	$scope.addCards(5);

	$scope.cardDestroyed = function(index) {
		$scope.cards.splice(index, 1);
		$scope.addCards(1);
	};

	$scope.transitionOut = function(card) {
		console.log('card transition out');
	};

	$scope.transitionRight = function(card) {
		console.log('card removed to the right');
		console.log(card);
	};

	$scope.transitionLeft = function(card) {
		console.log('card removed to the left');
		console.log(card);
	};
})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, $state) {

	$scope.bookmarks = BookMarkService.getBookmarks();

	// When a new post is bookmarked, we should update bookmarks list
	$rootScope.$on("new-bookmark", function(event){
		$scope.bookmarks = BookMarkService.getBookmarks();
	});

	$scope.goToFeedPost = function(link){
		window.open(link, '_blank', 'location=yes');
	};
	$scope.goToWordpressPost = function(postId){
		$state.go('app.post', {postId: postId});
	};
})

// WORDPRESS
.controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
	$scope.posts = [];
	$scope.page = 1;
	$scope.totalPages = 1;

	$scope.doRefresh = function() {
		$ionicLoading.show({
			template: 'Loading posts...'
		});

		//Always bring me the latest posts => page=1
		PostService.getRecentPosts(1)
		.then(function(data){
			$scope.totalPages = data.pages;
			$scope.posts = PostService.shortenPosts(data.posts);

			$ionicLoading.hide();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};

	$scope.loadMoreData = function(){
		$scope.page += 1;

		PostService.getRecentPosts($scope.page)
		.then(function(data){
			//We will update this value in every request because new posts can be created
			$scope.totalPages = data.pages;
			var new_posts = PostService.shortenPosts(data.posts);
			$scope.posts = $scope.posts.concat(new_posts);

			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

	$scope.moreDataCanBeLoaded = function(){
		return $scope.totalPages > $scope.page;
	};

	$scope.bookmarkPost = function(post){
		$ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
		BookMarkService.bookmarkWordpressPost(post);
	};

	$scope.doRefresh();
})

// WORDPRESS POST
.controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

	$scope.post = post_data.post;
	$ionicLoading.hide();

	$scope.sharePost = function(link){
		window.plugins.socialsharing.share('Check this post here: ', null, null, link);
	};
})


.controller('ImagePickerCtrl', function($scope, $rootScope, $ionicPlatform, $cordovaCamera) {

	$scope.images = [];
 $scope.image = {};

	$scope.openImagePicker = function(){
    //We use image picker plugin: http://ngcordova.com/docs/plugins/imagePicker/
    //implemented for iOS and Android 4.0 and above.

    $ionicPlatform.ready(function() {
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 350,
        targetHeight: 350,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options)
       .then(function (imageData) {
          var image = "data:image/jpeg;base64," + imageData;
          $scope.images.push(image);
        }, function(error) {
          console.log(error);
        });
    });
  };

	$scope.removeImage = function(image) {
		$scope.images = _.without($scope.images, image);
	};

	$scope.shareImage = function(image) {
		window.plugins.socialsharing.share(null, null, image);
	};

	$scope.shareAll = function() {
		window.plugins.socialsharing.share(null, null, $scope.images);
	};
})


.controller('mapaprfcercaCtrl', function($scope, $state, $http, $ionicLoading, $ionicModal, $stateParams, $cordovaGeolocation, establecimientos) {
	$scope.map = null;
	$scope.markers = {};
	$scope.sitios = {};
	$scope.infowindow = new google.maps.InfoWindow();

	$scope.optionscard = {
		slidesPerView: 1,
		spaceBetween: 10,
		loop: false,
	  speed: 1000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	}
	}

	$scope.center_position = {
		lat: 4.6603324,
		lng: -74.0908335
	};

	$scope.filtros = $stateParams.filtros;

	/*$scope.$on('mapInitialized', function(event, map) {
		$scope.map = map;
		console.log($scope.map);
		$scope.map.addListener('dragend', $scope.handleDragend);
		$scope.centerOnMe();
	});*/

	$scope.centerOnMe= function(){

		$scope.positions = [];

		$ionicLoading.show({
			template: 'Cargando...'
		});

		// with this function you can get the user’s current position
		// we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
		var options = {timeout: 10000, enableHighAccuracy: false};
		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			$scope.map.setZoom(15);
			$scope.map.setCenter(pos);
			$ionicLoading.hide();
			var bounds = $scope.map.getBounds();
			var centro = { lat: position.coords.latitude, lng: position.coords.longitude };
			var limite1 = { lat: bounds.f.b, lng: bounds.b.b };

			var d = $scope.calcularDistancia( centro, limite1 );
			$scope.filtros.radio = d;
			$scope.filtros.limite = 20;

			establecimientos.consultaEstablecimientosPorRadio( centro, $scope.filtros )
				.success(function(data){
					$scope.sitios = data;
					for( var i = 0; i < $scope.sitios.length; i++ ){
						(function(){
							var cual = i;
							$scope.markers[$scope.sitios[cual].nombre ] = new google.maps.Marker({
								position: new google.maps.LatLng( $scope.sitios[cual].latitud, $scope.sitios[cual].longitud ),
								map: $scope.map
							});
							$scope.markers[$scope.sitios[cual].nombre ].addListener('click', function(){
								$scope.setMarkerClick( this, cual );
							});

						}());
					}
				});
		});

	};

	$scope.setMapOnAll = function(){
		for( var k in $scope.markers )
			$scope.markers[k].setMap(null);
		$scope.markers = {};
		$scope.sitios = {};
	};

	$scope.calcularDistancia = function( p1, p2 ){
		var R = 6371; // metres
		var omg1 = p1.lat * (Math.PI/180);
		var omg2 = p2.lat * (Math.PI/180);
		var deltomg = (p2.lat - p1.lat) * (Math.PI/180);
		var deltlamb = (p2.lng - p1.lng) * (Math.PI/180);
		var a = Math.sin(deltomg/2) * Math.sin(deltomg/2) +
						Math.cos(omg1) * Math.cos(omg2) *
						Math.sin(deltlamb/2) * Math.sin(deltlamb/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d;
	}

	$scope.handleDragend = function(){
		$scope.setMapOnAll();
		var centro = { lat: $scope.map.getCenter().lat(), lng: $scope.map.getCenter().lng() };
		var bounds = $scope.map.getBounds();
		establecimientos.consultaEstablecimientosPorRadio( centro, $scope.filtros )
			.success(function(data){
				$scope.sitios = data;
				for( var i = 0; i < $scope.sitios.length; i++ ){
					(function(){
						var cual = i;
						$scope.markers[$scope.sitios[cual].nombre ] = new google.maps.Marker({
							position: new google.maps.LatLng( $scope.sitios[cual].latitud, $scope.sitios[cual].longitud ),
							map: $scope.map
						});
						$scope.markers[$scope.sitios[cual].nombre ].addListener('click', function(){
							$scope.setMarkerClick( this, cual );
						});

					}());
				}
			});
	};

	$scope.setMarkerClick = function( marker, cual ){
		var response = $scope.sitios[cual];
		$scope.slider._slideTo(cual);

		var pos = new google.maps.LatLng(marker.internalPosition.lat(), marker.internalPosition.lng());
		$scope.map.panTo(pos);

		if( response.valoracion == null ){
			response.stars = [];
			response.nostars = [0,1,2,3,4];
		}else{
			response.stars = [];
			response.nostars = [];
			for( var j = 0; j < response.valoracion; j++ ) response.stars.push(j);
			for( var j = 0; j < 5 - response.valoracion; j++ ) response.nostars.push(j);
		}

		$scope.$apply();
	};

	$scope.goSite = function( id ){
		$state.go('app.site', { idEstablecimiento: id });
	};

	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  $scope.slider = data.slider;
	});

	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
		$scope.map.panTo( new google.maps.LatLng( $scope.sitios[data.slider.activeIndex].latitud, $scope.sitios[data.slider.activeIndex].longitud  ) );
	});

	$ionicModal.fromTemplateUrl('views/app/establecimientosfiltros.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

	$scope.openModal = function(){
		$scope.modal.show();
	};

	$scope.closeModal = function() {
    $scope.modal.hide();
  };

	$scope.filtrarMapa = function(){
		$scope.closeModal();
		$scope.handleDragend();
	};

	$scope.limpiarFiltros = function(){
		$scope.filtros = { radio: 1, limite: 20 };
		var stars = document.getElementsByClassName('star_rate');
		for( var i = 0; i < stars.length; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline";
		$scope.closeModal();
		$scope.handleDragend();
	};

	$scope.clickStar = function( star ){
		var stars = document.getElementsByClassName('star_rate');

		for( var i = 0; i <= star; i++ ) stars[i].className = "icon star_rate ion-ios-star";
		for( var i = star+1; i < 5; i++ ) stars[i].className = "icon star_rate ion-ios-star-outline";

		$scope.filtros.voto = star+1;
	};

	$scope.inicializarCerca = function(){
		$scope.map = new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			center: $scope.center_position,
			disableDefaultUI: true
		});
		$scope.map.addListener('dragend', $scope.handleDragend);
		$scope.centerOnMe();
	};

	$scope.inicializarCerca();

})



/***********************************
	Controlador para la seccion de Home, controla las
	slides y las cards de la seccion
***********************************/

.controller('HomeCtrl', function($scope, $cordovaGeolocation, $http, $ionicLoading, $localStorage, $controller) {
	console.log($localStorage.sesion);
	$scope.path = "http://lukgo.com/Api/api.php";
	$scope.cercanos = null;
	$scope.recomendados = null;

	//banner
	$scope.optionsBanner = {
		autoplay: 5000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	},
		loop: false,
	  speed: 1000
	}
	//busca
	$scope.optionsBusca = {
		spaceBetween: 10,
		slidesPerView: 2,
		loop: false,
	  speed: 1000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	}
	}
	//servicios
	$scope.optionsServicios = {
		spaceBetween: 10,
		slidesPerView: 1,
		loop: false,
	  speed: 1000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	}
	}
	//cerca a ti
	$scope.optionscard = {
		slidesPerView: 'auto',
		spaceBetween: 10,
		loop: false,
	  speed: 1000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	}
	}
	//profesional
	//cerca a ti
	$scope.optionsProfesional = {
		slidesPerView: 'auto',
		spaceBetween: 10,
		loop: false,
	  speed: 1000,
		paginationBulletRender: function (swiper, index, className) {
      return '';
  	}
	}


	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  // data.slider is the instance of Swiper
	  $scope.slider = data.slider;
	});

	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){

	});

	$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
	  // note: the indexes are 0-based
	  $scope.activeIndex = data.slider.activeIndex;
	  $scope.previousIndex = data.slider.previousIndex;
	});

	$scope.inicializarHome = function(){

		var options = {timeout: 10000, enableHighAccuracy: false};
		$cordovaGeolocation.getCurrentPosition(options).then(function(position){
				//var centro = { lat: position.coords.latitude, lng: position.coords.longitude };
				var centro = { lat: 4.665858, lng: -74.058951 };

				$http.post($scope.path, {accion: "home", centro: centro,  filtros: { radio: 2, limite: 5 } } )
						.then( function(response){
							$scope.servicios = response.data.servicios;
							$scope.cercanos = response.data.cercanos;
							for( var i = 0; i < $scope.cercanos.length; i++ ){
								if( $scope.cercanos[i].valoracion == null ){
									$scope.cercanos[i].stars = [];
									$scope.cercanos[i].nostars = [0,1,2,3,4];
								}else{
									$scope.cercanos[i].stars = [];
									$scope.cercanos[i].nostars = [];
									for( var j = 0; j < $scope.cercanos[i].valoracion; j++ ) $scope.cercanos[i].stars.push(j);
									for( var j = 0; j < 5-$scope.cercanos[i].valoracion; j++ ) $scope.cercanos[i].nostars.push(j);
								}
							}
							$scope.recomendados = response.data.recomendados;
							for( var i = 0; i < $scope.recomendados.length; i++ ){
								if( Math.round($scope.recomendados[i].valoracion) == null ){
									$scope.recomendados[i].stars = [];
									$scope.recomendados[i].nostars = [0,1,2,3,4];
								}else{
									$scope.recomendados[i].stars = [];
									$scope.recomendados[i].nostars = [];
									for( var j = 0; j < $scope.recomendados[i].valoracion; j++ ) $scope.recomendados[i].stars.push(j);
									for( var j = 0; j < 5-$scope.recomendados[i].valoracion; j++ ) $scope.recomendados[i].nostars.push(j);
								}
							}
							$scope.profesionales = response.data.profesionales;
							for( var i = 0; i < $scope.profesionales.length; i++ ){
								if( Math.round($scope.profesionales[i].valoracion) == null ){
									$scope.profesionales[i].stars = [];
									$scope.profesionales[i].nostars = [0,1,2,3,4];
								}else{
									$scope.profesionales[i].stars = [];
									$scope.profesionales[i].nostars = [];
									for( var j = 0; j < $scope.profesionales[i].valoracion; j++ ) $scope.profesionales[i].stars.push(j);
									for( var j = 0; j < 5-$scope.profesionales[i].valoracion; j++ ) $scope.profesionales[i].nostars.push(j);
								}
							}
						});
		});
	};

	$scope.inicializarHome();

	})

	.controller('reservasProfCtrl', function($scope, $state, $localStorage, $stateParams, $http, $ionicLoading, reservas) {
		$scope.idProfesional = ( $stateParams.idprofesional == "" )? null: parseInt( $stateParams.idprofesional );
		$scope.idServicio = ( $stateParams.servicio == "" )? null: $stateParams.servicio;

		$scope.fecha = null;
		$scope.hora = null;
		$scope.notas = null;

		$scope.horas = ["12:00 am", "12:15 am", "12:30 am", "12:45 am", "01:00 am", "01:15 am", "01:30 am", "01:45 am",
										"02:00 am", "02:15 am", "02:30 am", "02:45 am", "03:00 am", "03:15 am", "03:30 am", "03:45 am",
										"04:00 am", "04:15 am", "04:30 am", "04:45 am", "05:00 am", "05:15 am", "05:30 am", "05:45 am",
									  "06:00 am", "06:15 am", "06:30 am", "06:45 am", "07:00 am", "07:15 am", "07:30 am", "07:45 am",
										"08:00 am", "08:15 am", "08:30 am", "08:45 am", "09:00 am", "09:15 am", "09:30 am", "09:45 am",
										"10:00 am", "10:15 am", "10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am",
										"12:00 pm", "12:15 pm", "12:30 pm", "12:45 pm", "01:00 pm", "01:15 pm", "01:30 pm", "01:45 pm",
										"02:00 pm", "02:15 pm", "02:30 pm", "02:45 pm", "03:00 pm", "03:15 pm", "03:30 pm", "03:45 pm",
										"04:00 pm", "04:15 pm", "04:30 pm", "04:45 pm", "05:00 pm", "05:15 pm", "05:30 pm", "05:45 pm",
										"06:00 pm", "06:15 pm", "06:30 pm", "06:45 pm", "07:00 pm", "07:15 pm", "07:30 pm", "07:45 pm",
										"08:00 pm", "08:15 pm", "08:30 pm", "08:45 pm", "09:00 pm", "09:15 pm", "09:30 pm", "09:45 pm",
										"10:00 pm", "10:15 pm", "10:30 pm", "10:45 pm", "11:00 pm", "11:15 pm", "11:30 pm", "11:45 pm",
									];
		$scope.usadas = [ 	0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0
										];

		//opciones del slider de horas
		$scope.optionscard = {
			slidesPerView: 4,
			spaceBetween: 10,
			centeredSlides: true,
			loop: false,
		  speed: 1000,
			paginationBulletRender: function (swiper, index, className) {
	      return '';
	  	}
		}

		$scope.optionsProfesional = {
			slidesPerView: 'auto',
			spaceBetween: 10,
			loop: false,
		  speed: 1000,
			paginationBulletRender: function (swiper, index, className) {
	      return '';
	  	}
		}

		//configuración del calendario
		$scope.onezoneDatepicker = {
			date: new Date(), // MANDATORY
			mondayFirst: true,
			months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			daysOfTheWeek: [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
			/*startDate: startDate,
			endDate: endDate,*/
			disablePastDays: true,
			disableSwipe: false,
			disableWeekend: false,
			/*disableDates: disableDates,
			disableDaysOfWeek: disableDaysOfWeek,*/
			showDatepicker: true,
			showTodayButton: true,
			calendarMode: true,
			hideCancelButton: true,
			hideSetButton: true,
			//highlights: highlights
			callback: function(value){
					if( $scope.isToday(value) ){
						$scope.iniciarReservasHoras();
					}else{
						var fecha = value.getFullYear()+"-"+( value.getMonth()+1)+"-"+value.getDate();
						var hora = "00:00:00.000000";
						$scope.usadas = [ 	0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0
														];
						reservas.consulta( $scope.idProfesional, 2, fecha, hora, true )
							.success(function(data){
								if( data != "false" )
									for( var i = 0; i < data.length; i++ ){
										var hora = data[i].fecha;
										hora = hora.split(" ")[1];
										$scope.usadas[ $scope.horas.indexOf( $scope.convertirHora(hora) ) ] = 1;
									}
							});
					}

				}
		};

		//función para saber si la fecha es del día de hoy
    $scope.isToday = function ( value ) {
        var today = new Date(),
            currentCalendarDate = new Date(value);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

		//función al iniciar el slider, lo desplaza a la hora actual más cercana
		$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
			// data.slider is the instance of Swiper
			$scope.slider = data.slider;
			$scope.slider.slideTo( $scope.horaActual );
		});

		//inicia los objetos de horas para el slider de selección de horas
		$scope.iniciarReservasHoras = function(){
				$scope.date = new Date();
				var zone = "am";
				var hours = $scope.date.getHours();
				var minutes = $scope.date.getMinutes();
				if( hours > 12 ){
					hours = hours - 12;
					zone = "pm";
				}else if( hours == 12 ) zone = "pm";

				$scope.key = "";
				if( hours == 0 ) hours = 12;
				if( minutes > 0 && minutes < 15 ){
					$scope.key = hours+":15 "+zone;
				}else if( minutes >= 15 && minutes < 30 ){
					$scope.key = hours+":30 "+zone;
				}else if( minutes >= 30 && minutes < 45 ){
					$scope.key = hours+":45 "+zone;
				}else if( minutes >= 45 ) {
					if( hours+1 == 12 ) zone = "am";
					if( (hours + 1) < 12  )
						$scope.key = (hours+1) + ":00 "+zone;
					else{
						if( (hours+1) -12 < 10 )
							$scope.key = "0"+(hours+1 -12) + ":00 "+zone;
						else
							$scope.key = (hours+1 -12) + ":00 "+zone;
					}
				}
				if( (hours+1) < 10 || hours == 9 ) $scope.key = "0"+$scope.key;
				$scope.horaActual = $scope.horas.indexOf($scope.key );
				for( var i  = 0; i < $scope.horaActual; i++ )		$scope.usadas[i] = 1;
				var fecha = $scope.date.getFullYear()+"-"+( $scope.date.getMonth()+1 )+"-"+$scope.date.getDate();
				var hora = $scope.date.getHours()+":"+$scope.date.getMinutes()+":00";

				reservas.consulta( $scope.idProfesional, 2, fecha, hora, true )
					.success(function(data){
						if( data != "false" )
							for( var i = 0; i < data.length; i++ ){
								var hora = data[i].fecha;
								hora = hora.split(" ")[1];
								$scope.usadas[ $scope.horas.indexOf( $scope.convertirHora(hora) ) ] = 1;
							}
					});

		};

		//convierte horas de 24h a 12h
		$scope.convertirHora = function( hora ){
				var zone = "am";
				hora = hora.split( ":" );
				if( parseInt( hora[0] ) > 12 ){
					hora[0] = parseInt( hora[0] - 12 );
					zone = "pm";
				}
				if( hora[0] < 10 )
					return "0"+hora[0]+":"+hora[1]+" "+zone;
				return hora[0]+":"+hora[1]+" "+zone;
		};

		//función para guardar la fecha y hora que se
		$scope.seleccionarFecha = function( value ){
				if( $scope.index != null )
					$scope.usadas[ $scope.index ] = 0;
				$scope.index = $scope.horas.indexOf(value);
				if( $scope.usadas[ $scope.index ] == 0 ){
					$scope.slider.slideTo( $scope.index );
					$scope.usadas[ $scope.index ] = 2;

					$scope.fecha = ""+$scope.onezoneDatepicker.date.getFullYear()+"-"+($scope.onezoneDatepicker.date.getMonth()+1)+"-"+$scope.onezoneDatepicker.date.getDate();
					var hora = parseInt(value.substr(0, 2));
					var minutos = parseInt(value.substr(3, 2));
					var zona = value.substr(6,8);
					if(zona == "pm") hora += 12;
					value = "";
					if( hora < 10 ) value = "0";

					$scope.hora = value+""+hora+":"+minutos+":00.000000";
				}
		};

		$scope.reservar = function(){
			reservas.reservar( $scope.idProfesional, $scope.idServicio, $localStorage.sesion.id, $scope.fecha, $scope.hora, $scope.notas )
				.success(function(data){
					if( data == "true" ){
						$state.go('app.misreservas', {saved: 1} );
					}else
						alert("Se ha presentado un error");
				});
		}

		$scope.iniciarReservasHoras();
	})


	.controller('reservasEstbCtrl', function($scope, $localStorage, $stateParams, $http, $ionicLoading, $state, reservas, establecimientos) {
		$scope.idEstablecimiento = ( $stateParams.idestablecimiento == "" )? null: parseInt( $stateParams.idestablecimiento );
		$scope.idServicio = ( $stateParams.servicio == "" )? null: $stateParams.servicio;

		$scope.fecha = null;
		$scope.hora = null;
		$scope.notas = null;
		$scope.idProfesional = null;
		$scope.profesionales = null;



		$scope.horas = ["12:00 am", "12:15 am", "12:30 am", "12:45 am", "01:00 am", "01:15 am", "01:30 am", "01:45 am",
										"02:00 am", "02:15 am", "02:30 am", "02:45 am", "03:00 am", "03:15 am", "03:30 am", "03:45 am",
										"04:00 am", "04:15 am", "04:30 am", "04:45 am", "05:00 am", "05:15 am", "05:30 am", "05:45 am",
									  "06:00 am", "06:15 am", "06:30 am", "06:45 am", "07:00 am", "07:15 am", "07:30 am", "07:45 am",
										"08:00 am", "08:15 am", "08:30 am", "08:45 am", "09:00 am", "09:15 am", "09:30 am", "09:45 am",
										"10:00 am", "10:15 am", "10:30 am", "10:45 am", "11:00 am", "11:15 am", "11:30 am", "11:45 am",
										"12:00 pm", "12:15 pm", "12:30 pm", "12:45 pm", "01:00 pm", "01:15 pm", "01:30 pm", "01:45 pm",
										"02:00 pm", "02:15 pm", "02:30 pm", "02:45 pm", "03:00 pm", "03:15 pm", "03:30 pm", "03:45 pm",
										"04:00 pm", "04:15 pm", "04:30 pm", "04:45 pm", "05:00 pm", "05:15 pm", "05:30 pm", "05:45 pm",
										"06:00 pm", "06:15 pm", "06:30 pm", "06:45 pm", "07:00 pm", "07:15 pm", "07:30 pm", "07:45 pm",
										"08:00 pm", "08:15 pm", "08:30 pm", "08:45 pm", "09:00 pm", "09:15 pm", "09:30 pm", "09:45 pm",
										"10:00 pm", "10:15 pm", "10:30 pm", "10:45 pm", "11:00 pm", "11:15 pm", "11:30 pm", "11:45 pm",
									];
		$scope.usadas = [ 	0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0,
												0, 0, 0, 0, 0, 0, 0, 0
										];

		//opciones del slider de horas
		$scope.optionscard = {
			slidesPerView: 4,
			spaceBetween: 10,
			centeredSlides: true,
			loop: false,
		  speed: 1000,
			paginationBulletRender: function (swiper, index, className) {
	      return '';
	  	}
		}

		$scope.optionsProfesional = {
			slidesPerView: 'auto',
			spaceBetween: 10,
			loop: false,
		  speed: 1000,
			paginationBulletRender: function (swiper, index, className) {
	      return '';
	  	}
		}

		//configuración del calendario
		$scope.onezoneDatepicker = {
			date: new Date(), // MANDATORY
			mondayFirst: true,
			months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			daysOfTheWeek: [ "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sáb"],
			/*startDate: startDate,
			endDate: endDate,*/
			disablePastDays: true,
			disableSwipe: false,
			disableWeekend: false,
			/*disableDates: disableDates,
			disableDaysOfWeek: disableDaysOfWeek,*/
			showDatepicker: true,
			showTodayButton: true,
			calendarMode: true,
			hideCancelButton: true,
			hideSetButton: true,
			//highlights: highlights
			callback: function(value){
					if( $scope.isToday(value) ){
						$scope.selectProf( $scope.idProfesional );
					}else{
						var fecha = value.getFullYear()+"-"+( value.getMonth()+1)+"-"+value.getDate();
						var hora = "00:00:00.000000";
						$scope.usadas = [ 	0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0,
																0, 0, 0, 0, 0, 0, 0, 0
														];
						reservas.consulta( $scope.idProfesional, 2, fecha, hora, true )
							.success(function(data){
								if( data != "false" )
									for( var i = 0; i < data.length; i++ ){
										var hora = data[i].fecha;
										hora = hora.split(" ")[1];
										$scope.usadas[ $scope.horas.indexOf( $scope.convertirHora(hora) ) ] = 1;
									}
							});
					}
				}
		};

		//función para saber si la fecha es del día de hoy
    $scope.isToday = function ( value ) {
        var today = new Date(),
            currentCalendarDate = new Date(value);

        today.setHours(0, 0, 0, 0);
        currentCalendarDate.setHours(0, 0, 0, 0);
        return today.getTime() === currentCalendarDate.getTime();
    };

		//función al iniciar el slider, lo desplaza a la hora actual más cercana
		$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
			// data.slider is the instance of Swiper
			$scope.sliderHoras = data.slider;
			$scope.sliderHoras.slideTo( $scope.horaActual );
		});

		$scope.selectProf = function( id ){
			if( $scope.idProfesional != null )
				document.getElementById("prof-card-"+$scope.idProfesional ).style.backgroundColor = "white";

			document.getElementById("prof-card-"+id).style.backgroundColor = " rgb(143, 212, 136)";
			$scope.idProfesional = id;
			$scope.onezoneDatepicker.date = new Date();

			$scope.fecha= null;
			$scope.hora = null;
			$scope.notas = null;
			$scope.usadas = [ 	0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0,
													0, 0, 0, 0, 0, 0, 0, 0
											];

			$scope.date = new Date();
			var zone = "am";
			var hours = $scope.date.getHours();
			var minutes = $scope.date.getMinutes();
			if( hours > 12 ){
				hours = hours - 12;
				zone = "pm";
			}else if( hours == 12 ) zone = "pm";

			$scope.key = "";
			if( hours == 0 ) hours = 12;
			if( minutes > 0 && minutes < 15 ){
				$scope.key = hours+":15 "+zone;
			}else if( minutes >= 15 && minutes < 30 ){
				$scope.key = hours+":30 "+zone;
			}else if( minutes >= 30 && minutes < 45 ){
				$scope.key = hours+":45 "+zone;
			}else if( minutes >= 45 ) {
				if( hours+1 == 12 ) zone = "am";
				if( (hours + 1) < 12  )
					$scope.key = (hours+1) + ":00 "+zone;
				else{
					if( (hours+1) -12 < 10 )
						$scope.key = "0"+(hours+1 -12) + ":00 "+zone;
					else
						$scope.key = (hours+1 -12) + ":00 "+zone;
				}
			}
			if( (hours+1) < 10 || hours == 9 ) $scope.key = "0"+$scope.key;
			$scope.horaActual = $scope.horas.indexOf($scope.key );
			for( var i  = 0; i < $scope.horaActual; i++ )		$scope.usadas[i] = 1;
			var fecha = $scope.date.getFullYear()+"-"+( $scope.date.getMonth()+1 )+"-"+$scope.date.getDate();
			var hora = $scope.date.getHours()+":"+$scope.date.getMinutes()+":00";

				reservas.consulta( $scope.idProfesional, 2, fecha, hora, true )
					.success(function(data){
						if( data != "false" )
							for( var i = 0; i < data.length; i++ ){
								var hora = data[i].fecha;
								hora = hora.split(" ")[1];
								$scope.usadas[ $scope.horas.indexOf( $scope.convertirHora(hora) ) ] = 1;
							}
					});
		}

		//inicia los objetos de horas para el slider de selección de horas
		$scope.iniciarReservasHoras = function(){
				establecimientos.consultaProfesionalesPorEstablecimiento( $scope.idEstablecimiento, $scope.idServicio )
				.success(function(data){
					if( data != "false" )
						$scope.profesionales = data;
				});
		};

		//convierte horas de 24h a 12h
		$scope.convertirHora = function( hora ){
				var zone = "am";
				hora = hora.split( ":" );
				if( parseInt( hora[0] ) > 12 ){
					hora[0] = parseInt( hora[0] - 12 );
					zone = "pm";
				}
				if( hora[0] < 10 )
					return "0"+hora[0]+":"+hora[1]+" "+zone;
				return hora[0]+":"+hora[1]+" "+zone;
		};

		//función para guardar la fecha y hora que se
		$scope.seleccionarFecha = function( value ){
				if( $scope.index != null )
					$scope.usadas[ $scope.index ] = 0;
				$scope.index = $scope.horas.indexOf(value);
				if( $scope.usadas[ $scope.index ] == 0 ){
					$scope.sliderHoras.slideTo( $scope.index );
					$scope.usadas[ $scope.index ] = 2;

					$scope.fecha = ""+$scope.onezoneDatepicker.date.getFullYear()+"-"+($scope.onezoneDatepicker.date.getMonth()+1)+"-"+$scope.onezoneDatepicker.date.getDate();
					var hora = parseInt(value.substr(0, 2));
					var minutos = parseInt(value.substr(3, 2));
					var zona = value.substr(6,8);
					if(zona == "pm") hora += 12;
					value = "";
					if( hora < 10 ) value = "0";

					$scope.hora = value+""+hora+":"+minutos+":00.000000";
				}
		};

		$scope.reservar = function(){
			if( $scope.idProfesional != null && $scope.idServicio != null && $scope.fecha != null && $scope.hora != null )
				reservas.reservar( $scope.idProfesional, $scope.idServicio, $localStorage.sesion.id, $scope.fecha, $scope.hora, $scope.notas )
					.success(function(data){
						console.log(data);
						if( data == "true" ){
							$state.go('app.misreservas', {saved: 1} );
						}else{
							alert("Se ha presentado un error");
						}
					});
		}

		$scope.iniciarReservasHoras();
	})
	//controlador de página de reservas
	.controller('reservasperfilctrl', function($scope, $http, $ionicModal, $localStorage, $state, $stateParams, reservas) {
		$scope.saved = ( $stateParams.saved == 0 )? null: true;

		$scope.idUsuario = $localStorage.sesion.id;
		$scope.tipoUsuario = $localStorage.sesion.tipousr;
		$scope.reservas = null;
		$scope.cancela = null;

		$scope.iniciarReservas = function(){
			var date = new Date();
			var fecha = ""+date.getFullYear()+"-"+( date.getMonth()+1 )+"-"+date.getDate()+"";
			var hora = ""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
			console.log({ accion: "consulta", servicio: "reservas", idUsuario: $scope.idUsuario, tipoUsuario: $scope.tipoUsuario, fecha: fecha, hora: hora, limite: false, filtros: { cantidad: 3, order: "ASC", canceladas: false } });
			reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, order: "ASC", canceladas: false } )
				.success(function(data){
					console.log(data);
					if( data != "false" ){
						for( var i = 0; i < data.length; i++ ){
							var hora = data[i].fecha.split(" ");
							data[i].fecha = hora[0];
							hora = hora[1];
							data[i].hora = $scope.convertirHora( hora );
							data[i].index = i;
						}
						$scope.reservas = data;
					}else
						$scope.reservas = false;
				});
			reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, pasadas: true, order: "DESC", canceladas: false } )
				.success(function(data){
					if( data != "false" ){
						for( var i = 0; i < data.length; i++ ){
							var hora = data[i].fecha.split(" ");
							data[i].fecha = hora[0];
							hora = hora[1];
							data[i].hora = $scope.convertirHora( hora );
							data[i].index = i;
						}
						$scope.pasadas = data;
					}else
						$scope.pasadas = false;
				});
			reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, order: "ASC", canceladas: true } )
				.success(function(data){
					if( data != "false" ){
						for( var i = 0; i < data.length; i++ ){
							var hora = data[i].fecha.split(" ");
							data[i].fecha = hora[0];
							hora = hora[1];
							data[i].hora = $scope.convertirHora( hora );
							data[i].index = i;
						}
						$scope.canceladas = data;
					}else
						$scope.canceladas = false;
				});
		};

		$ionicModal.fromTemplateUrl('views/app/misReservasEspecifica.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });

		$scope.openModal = function( tipo, index ){
			$scope.modal.show();
			$scope.mod = {};
			$scope.mod.tipo = tipo
			$scope.mod.index = index;
		};

		$scope.closeModal = function() {
	    $scope.modal.hide();
			$scope.mod.index = null;
	  };

		//convierte horas de 24h a 12h
		$scope.convertirHora = function( hora ){
				var zone = "am";
				hora = hora.split( ":" );
				if( parseInt( hora[0] ) > 12 ){
					hora[0] = parseInt( hora[0] - 12 );
					zone = "pm";
				}
				if( hora[0] < 10 )
					return "0"+hora[0]+":"+hora[1]+" "+zone;
				return hora[0]+":"+hora[1]+" "+zone;
		};

		$scope.cargarMas = function( tipo ){
				var date = new Date();
				var fecha = ""+date.getFullYear()+"-"+( date.getMonth()+1 )+"-"+date.getDate()+"";
				var hora = ""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
				if( tipo == 1 )
					reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, offset: $scope.reservas.length, order: "ASC" } )
						.success(function(data){
							if( data != "false" ){
								for( var i = 0; i < data.length; i++ ){
									var hora = data[i].fecha.split(" ");
									data[i].fecha = hora[0];
									hora = hora[1];
									data[i].hora = $scope.convertirHora( hora );
									data[i].index = i + $scope.reservas.length;
								}
								$scope.reservas = $scope.reservas.concat(data);
							}
						});
				else if( tipo == 2 )
					reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, offset: $scope.pasadas.length, pasadas: true, order: "DESC" } )
						.success( function(data){
							if( data != "false" ){
								for( var i = 0; i < data.length; i++ ){
									var hora = data[i].fecha.split(" ");
									data[i].fecha = hora[0];
									hora = hora[1];
									data[i].hora = $scope.convertirHora( hora );
									data[i].index = i + $scope.pasadas.length;
								}
								$scope.pasadas = $scope.pasadas.concat(data);
							}
						});
				else if( tipo == 3 )
					reservas.consulta( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, false, { cantidad: 3, offset: $scope.canceladas.length, order: "ASC", canceladas: true } )
						.success(function(data){
							if( data != "false" ){
								for( var i = 0; i < data.length; i++ ){
									var hora = data[i].fecha.split(" ");
									data[i].fecha = hora[0];
									hora = hora[1];
									data[i].hora = $scope.convertirHora( hora );
									data[i].index = i;
								}
								$scope.canceladas = $scope.canceladas.concat(data);
							}
						});
		};

		$scope.cancelarReserva = function(){
				var date = new Date();
				var fecha = ""+date.getFullYear()+"-"+( date.getMonth()+1 )+"-"+date.getDate()+"";
				var hora = ""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
				reservas.cancelar( $scope.idUsuario, $scope.tipoUsuario, fecha, hora, ( $scope.mod.tipo == 1 )? $scope.reservas[$scope.mod.index].idAgenda: $scope.pasadas[$scope.mod.index].idAgenda )
					.success(function(data){
						if(data.resultado == true ){
								if( $scope.canceladas == false )
									$scope.canceladas = [].concat($scope.reservas[$scope.mod.index]);
								else if( $scope.canceladas != null )
									$scope.canceladas = [].concat($scope.reservas[$scope.mod.index]).concat( $scope.canceladas );
								$scope.reservas.splice( $scope.mod.index, 1 );
								$scope.closeModal();
						}
					});
		};

		$scope.confirmaCancelacion = function(){
				$scope.cancela = 1;

		};

		$scope.iniciarReservas();
	})

	.controller('favoritosperfilctrl', function($scope, $http, $ionicModal, $localStorage, $state, $stateParams, usuarios) {
		$scope.idUsuario = $localStorage.sesion.id;
		$scope.tipoUsuario = $localStorage.sesion.tipousr;

		$scope.iniciarFavoritos = function(){
			usuarios.listaFavoritos( $scope.idUsuario )
				.success(function(data){
					if( data != "null"  ){
						$scope.favoritos = data;
					}else{
						$scope.favoritos = false;
					}
				});
		};

		$scope.goSite = function( idEstablecimiento ){
				$state.go('app.site', { idEstablecimiento: idEstablecimiento });
		};

		$scope.iniciarFavoritos();
	})
;
