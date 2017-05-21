 angular.module('servicios', [])//Declaramos el modulo
  .factory('consultaBio', function($http) {
    var path = "http://www.procevinos.com/Christian/Api/api.php";//API path
    return{
      buscarEspecimen : function(especimen,tipo){
        global = $http.post(path,{accion: "consulta", especimen: especimen, tipo: tipo});
        return global;
      },
      consultarEspecimen : function (id,tipo){
        global = $http.post(path,{accion: "consultaE", idEspecimen:id, tipo: tipo});
        return global;
      }
    }
  })
	.factory('usuarios', function($http) { //declaramos la factory
		var path = "http://lukgo.com/APITesting/api.php";//API path
		return {
      //busqueda plan
			//Login
      consultaperfil : function(id,tipoperfil){ //retornara el post por el id
				global = $http.get(path+'?accion=consulta&id='+id+'&tpperfil='+tipoperfil);
				return global;
			},
      consultaperfilprof : function(idProfesional, idUsuario, tipoperfil){ //retornara el post por el id
        global = $http.get(path+'?accion=consulta&idProfesional='+idProfesional+'&idUsuario='+idUsuario+'&tpperfil='+tipoperfil);
				return global;
			},
      consultaperfilprofCedula : function(cedula){ //retornara el post por el id
				global = $http.post(path,{accion: "consultaProfesionalCedula",cedula: cedula, servicio :"establecimiento"});
				return global;
			},
      agregarProfesionalEstablecimiento : function(idProfesional,idEstablecimiento){
        global = $http.post(path,{accion: "solicitudagregarProfesionalEstablecimiento", idProfesional: idProfesional, idEstablecimiento : idEstablecimiento, servicio : "establecimiento"});
        return global;
      },

			eliminar : function(id,tipoperfil){ //retornara el post por el id
				golbal = $http.post(path, {accion: "eliminar", id: id, tpperfil: tipoperfil });
				return global;
			},
			/*
				recibe los datos con los que se editara el perfil
				retorna un true en caso de que el registro se guarde exitosamente
			*/
			guardar : function(id,tipoperfil,datos){ //retornara el post por el id
				global = $http.post(path, {accion: "editar", id: id, tpperfil: tipoperfil, arraydatos: datos });
				return global;
			},
			/*
				recibe los datos basicos para el registro de un nuevo usuario
				retorna un true en caso de que el registro se guarde exitosamente
			*/
			crear : function(nombre,apellido,correo,telefono,genero,fechanacimiento,contrasena,imagen,tipoperfil){
        global = $http.post(path, {accion: "crear", tpperfil:tipoperfil, nombre: nombre, apellido: apellido, correo: correo, tel: telefono, genero: genero, fechanacimiento: fechanacimiento, imagen: imagen, contrasena: contrasena });
        return global;
			},
      /*
        recibe el id del usuario y un array con la direccion y el numero de cedula
        retorna true en caso de exito
      */
      duplicarperfilCl_Pr : function(idUsuario,datos){
				global = $http.post(path, {accion: "duplicarCl_Pr", id: idUsuario, arraydatos: datos});
				return global;
			},
    	/*
				recibe un array con los datos basicos para el registro de un nuevo con los datos obtenidos de facebook
				retorna un true en caso de que el registro se guarde exitosamente
			*/
			crear_fb : function(datos,tipoperfil){
				global = $http.post(path, {accion: "crear_fb", tpperfil:tipoperfil, datos: datos });
				return global;
			},
			/*
				recibe el correo con el que se va a crear un nuevo perfil de usuario
				retorna un true en caso de que exista el correo
			*/
			validarcorreo : function(correo,tipoperfil){ //retornara el post por el id
				global = $http.post(path, {accion: "validarcorreo",  tpperfil: tipoperfil, correo: correo});
				return global;
			},

      /*
        recibe el correo y la contraseña para iniciar sesion
        retorna en la posicion "resultado" del array los datos del inicio de sesion
      */
      confirmarCedula : function(cedula,idUsuario,tipoperfil){
        global = $http.post(path, {accion: "validarCedulaProfesional", id: idUsuario, cedula : cedula, tpperfil: tipoperfil});
        return global;
      },
      /*
        recibe el correo y la contraseña para iniciar sesion
        retorna en la posicion "resultado" del array los datos del inicio de sesion
      */
      validarPeticionEstablecimiento : function(idUsuario,idEstablecimiento,tipoperfil){
        global = $http.post(path, {accion: "validarPeticionEstablecimiento", id: idUsuario, idEstablecimiento : idEstablecimiento, tpperfil: tipoperfil});
        return global;
      },
			/*
				recibe el correo y la contraseña para iniciar sesion
				retorna en la posicion "resultado" del array los datos del inicio de sesion
			*/
			iniciarsesion : function(correo, contrasena, tipoperfil){
				global = $http.post(path, {accion: "iniciosesion",  correo: correo, contrasena: contrasena, tpperfil: tipoperfil});
				return global;
			},
      /*
        recibe el correo
        retorna en la posicion el resultado de la transaccion
      */
      recuperarContrasena : function(correo, tipoperfil){
        global = $http.post(path, {accion: "recuperarContrasena",  correo: correo,  tpperfil: tipoperfil});
        return global;
      },
			/*
				recibe el correo y la contraseña para iniciar sesion
				retorna en la posiscion "resultado" del array los datos del inicio de sesion
			*/
			verificarsesion : function(){
				global = $http.post(path, {accion: "estadosesion"});
				return global;
			},
			/*
				recibe el correo y la contraseña para iniciar sesion
				retorna en la posicion "resultado" del array los datos del cierre de sesion
			*/
			cerrarsesion : function(){
				global = $http.post(path, {accion: "cerrarsesion"});
				return global;
			},
			/*-------------------------
				SERVICIOS
			----------------------------*/
			consultaservicios : function(){
				global = $http.post(path, {accion: "consulta", servicio: "categorias"});
				return global;
			},
			consultaprofesionales : function(idservicio){
				global = $http.post(path, {accion: "consulta", servicio: "profesionales", idservicio: idservicio});
				return global;
			},
      /*
        recibe el id del usuario, el tipo de perfil y un array con los datos del establecimiento
        retorna los resultados del procedimiento
      */
      crearestablecimientonuevo : function(idUsuario,tipoperfil,datos){
        global = $http.post(path, {accion: "crearestablecimientonuevo", servicio : "establecimiento", id : idUsuario, tpperfil : tipoperfil, arraydatos: datos});
        return global;
      },

      /*
        recibe el nombre del establecimiento que se desea crear
        retorna un true si ya existe o un false si no
      */
      actualizarestablecimiento : function(datos){
        global = $http.post(path,{accion : "actualizarestablecimiento", servicio :"establecimiento", arraydatos : datos});
        return global;
      },
      /*
        recibe el id del establecimiento que se desea modificar
        retorna un false si no hay solcitud de edicion, en caso contrario retorna los datos que ya se han enviado
      */
      validarEdicionEstablecimiento: function(idEstablecimiento){
        global = $http.post(path,{accion : "validarEdicionEstablecimiento", servicio : "establecimiento", idEstablecimiento : idEstablecimiento });
        return global;
      },

      /*
        recibe el id del establecimiento
        retorna un array con una respuesta true o false / y los datos de los profesionales asociados al establecimiento
      */
      listaProfesionalesEstablecimiento: function(idEstablecimiento){
        global = $http.post(path,{accion: "listaProfesionalesEstablecimiento", servicio : "establecimiento", idEstablecimiento : idEstablecimiento});
        return global;
      },

      /*
        recibe el id del profesional y del establecimiento para eliminar
        retorna un true con los resultados de los profesionales restantes
      */
      eliminarprofEst: function(idProfesional,idEstablecimiento){
        global = $http.post(path,{accion : "eliminarProfEst", servicio : "establecimiento", idProfesional : idProfesional, idEstablecimiento : idEstablecimiento });
        return global;
      },

      /*
        recibe el id del profesional
        retorna un true con los resultados de las solicitudes pendientes de establecimientos para agregarlo
      */
      notificacionesProfesionalSolicitudesEstablecimiento: function(idProfesional){
        global = $http.post(path,{accion: "notificacionesSolicitudProfesionalEst",servicio: "profesional", idProfesional: idProfesional});
        return global;
      },
      /*
        recibe el id de la solicitud y la confirmacion de la solicitud ("conf" =>si confirma, "rech" => si rechaza)
        retorna la respuesta de la solicitud
      */
      confirmarSolicitudEstablecimientoProfesional: function(idSolicitud,confirmacion){
        global = $http.post(path,{accion: "confirmarSolicitudEstablecimientoProfesional",servicio: "profesional", idSolicitud: idSolicitud, confirmacion: confirmacion});
        return global;
      },

      /*
        recibe el nombre del establecimiento que se desea crear
        retorna un true si ya existe o un false si no
      */
      validarNombreEstablecimiento : function(nombreEstablecimiento){
        global = $http.post(path,{accion: "validarNombreEstablecimiento", servicio : "establecimiento", nombreEstablecimiento: nombreEstablecimiento});
        return global;
      },
      /*
				recibe un parametro de busqueda para el establecimiento por nombre
				retorna los resultados a la busqueda
			*/
			consultaestablecimientos : function(busqueda){
				global = $http.post(path, {accion: "buscar_establecimiento", servicio: "establecimiento", busqueda: busqueda});
				return global;
			},

      /*
        recibe el id del establecimiento
        retorna los datos del establecimiento
      */
      consultaestablecimientoid : function(id){
        global = $http.post(path, {accion: "consulta_establecimiento_id", servicio: "establecimiento", idEstablecimiento: id});
        return global;
      },
      /*
        recibe los datos de solicitud del establecimiento en un objeto, el id del establecimiento
      */
      solicitudpropiedadestablecimiento : function(idEstablecimiento,datos){
        global = $http.post(path, {accion: "solicitudPropiedadEst", servicio : "establecimiento", idEstablecimiento : idEstablecimiento, arraydatos : datos });
        return global;
      },
      /*
        recibe el id del usuario y el tipo de usuario del cual se desea sacar la lista de peticiones
      */
      listapeticionestablecimiento : function (idUsuario,tipoperfil){
        global = $http.post(path, {accion: "listapeticionestablecimiento", servicio : "establecimiento", id : idUsuario, tpperfil : tipoperfil });
        return global;
      },
      /*
        recibe el id del usuario y el tipo de usuario del cual se desea sacar la lista de establecimientos asociados ya confirmados
      */
      listaEstablecimientosConf : function (idUsuario,tipoPerfil){
        global = $http.post(path, {accion: "listaEstablecimientosConf", servicio : "establecimiento", id : idUsuario, tpperfil : tipoPerfil});
        return global;
      },
      listaFavoritos : function( idUsuario ){
        global = $http.post( path, { accion: "consulta", servicio: "favoritosUsuario", idUsuario: idUsuario } )
        return global;
      }
		}
	})
	//FACTORIA PARA EL ENVIO DE DATOS A FACEBOOK Y COMPROBAR LOS DATOS DE PERFIL
	//RETORNA NOMBRE, CORREO E IMAGEN DEL PERFIL
	.factory('facebook', function($http) {
		var path = "https://graph.facebook.com/v2.2/me";//API path
		return {
			//Login
			iniciosesionfb : function(access_token){ //retornara el post por el id
				global = $http.get(path,{params: {access_token: access_token, fields: "name,email,picture", format: "json" }});
				return global;
			},
			//Login
			registrofb : function(access_token){ //retornara el post por el id
				global = $http.get(path,{params: {access_token: access_token, fields: "name,email,picture", format: "json" }});
				return global;
			},
		}
	})

	//FACTORIA PARA EL ENVIO DE DATOS A GOOGLE Y COMPROBAR LOS DATOS DE PERFIL
	//RETORNA NOMBRE, CORREO E IMAGEN DEL PERFIL
	.factory('google', function($http) {
		var path = "https://www.googleapis.com/plus/v1/people/me?key={AIzaSyApznqISalQxVoU4BasKdOQdqt9Yt1-4fM}";//API path
		return {
			//Login
			iniciosesiongoogle : function(token){ //retornara el post por el id

				global = $http.get(path, {params: {access_token: token}});

				return global;
			},
			//registro
			registrogoogle : function(token){ //retornara el post por el id
				global = $http.get(path, {params: {access_token: token}});
				return global;
			},
		}
	})
  .factory('perfiles', function($http) { //declaramos la factory
    var path = "http://lukgo.com/Api/api.php";//API path
    return {
      actualizarVoto : function( servicio, idEstablecimiento, idUsuario, voto ) {
        global = $http.post( path, { accion: "carga", servicio: servicio, idEstablecimiento: idEstablecimiento, idUsuario: idUsuario, voto: voto} )
        return global;
      },
      realizarComentario : function( servicio, idEstablecimiento, idUsuario, comentario ) {
        global = $http.post( path, { accion: "subir", servicio: servicio, idEstablecimiento: idEstablecimiento, idUsuario: idUsuario, comentario: comentario } )
        return global;
      },
      cargarMasComentarios : function( seccion, idEstablecimiento, offset ) {
        global = $http.post( path, {accion: "cargarComentarios", servicio: seccion, idEstablecimiento: idEstablecimiento, offset: offset } )
        return global;
      }
    }
  })

  .factory('establecimientos', function($http) { //declaramos la factory
		var path = "http://lukgo.com/Api/api.php";//API path
		return {
			consultaEstablecimientoPorId : function( idEstablecimiento, idUsuario ){
				//global = $http.post(path, {accion: "consulta", servicio: "categorias"});
				global = $http.post( path, { accion: "consulta", servicio: "salonId", idEstablecimiento: idEstablecimiento, idUsuario: idUsuario }  )
				return global;
			},
      consultaEstablecimientosPorRadio : function( centro, filtros ){
        global = $http.post( path, { accion: "consulta", servicio: "salonesRadio", centro: centro, filtros: filtros } )
        return global;
      },
      consultaProfesionalesPorEstablecimiento : function( idEstablecimiento, idServicio ) {
				global = $http.post( path, { accion: "consulta", servicio: "salonProfesionales", idEstablecimiento: idEstablecimiento, idServicio: idServicio } )
				return global;
			},
			anadirFavoritos : function( idEstablecimiento, idUsuario ){
				global = $http.post( path, { accion: "crearFavorito", servicio: "anadirEstablecimiento", idEstablecimiento: idEstablecimiento, idUsuario: idUsuario } )
				return global;
			},
			sacarFavoritos : function( idEstablecimiento, idUsuario ){
				global = $http.post( path, { accion: "borrarFavorito", servicio: "borrarEstablecimiento", idEstablecimiento: idEstablecimiento, idUsuario: idUsuario } )
				return global;
			}
		}
	})
  .factory('profesionales', function($http) { //declaramos la factory
    var path = "http://lukgo.com/Api/api.php";//API path
    return {
      cargarMasComentarios : function(params) {
        global = $http.post( path, params )
        return global;
      }
    }
  })
  .factory('reservas', function($http) { //declaramos la factory
    var path = "http://lukgo.com/APITesting/api.php";//API path
    return {
      consulta : function( idUsuario, tipoUsuario, fecha, hora, limite, filtros = null ) {
        global = $http.post( path, { accion: "consulta", servicio: "reservas", idUsuario: idUsuario, tipoUsuario: tipoUsuario, fecha: fecha, hora: hora, limite: limite } )
        return global;
      },
      reservar : function( idProfesional, idServicio, idCliente, fecha, hora, notas ) {
        global = $http.post( path, { accion: "crearReserva", servicio: "reservas", idProfesional: idProfesional, idServicio: idServicio, idCliente: idCliente, fecha: fecha, hora: hora, notas: notas } )
        return global;
      },
      cancelar : function( idUsuario, tipoUsuario, fecha, hora, idAgenda ){
        global = $http.post( path, { accion: "cancelar", servicio: "reservas", idUsuario: idUsuario, tipoUsuario: tipoUsuario, fecha: fecha, hora: hora, idAgenda: idAgenda } )
        return global;
      }
    }
  })
  ;
