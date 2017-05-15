// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
  'ionic',
  'angularMoment',
  'your_app_name.controllers',
  'your_app_name.directives',
  'your_app_name.filters',
  'your_app_name.services',
  'servicios',
  'your_app_name.factories',
  'your_app_name.config',
  'your_app_name.views',
  'underscore',
  'ngMap',
  'ngResource',
  'ngStorage',
  'ngCordova',
  'ngCordovaOauth',
  'slugifier',
  'onezone-datepicker',
  'tabSlideBox',
  'ionic.contrib.ui.tinderCards',
  'youtube-embed',
  'ksSwiper'
])

.run(function($q, $ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout) {

  $ionicPlatform.on("deviceready", function(){
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    PushNotificationsService.register();
  });

  // This fixes transitions for transparent background views
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('app.home') > -1)
    {
      // set transitions to android to avoid weird visual effect in the walkthrough transitions
      $timeout(function(){
        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
      	console.log("setting transition to android and disabling swipe back");
      }, 0);
    }
  });
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('app.home') > -1)
    {
      // Restore platform default transition. We are just hardcoding android transitions to auth views.
      $ionicConfig.views.transition('platform');
      // If it's ios, then enable swipe back again
      if(ionic.Platform.isIOS())
      {
        $ionicConfig.views.swipeBackEnabled(true);
      }
    	console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
    }
  });

  $ionicPlatform.on("resume", function(){
    PushNotificationsService.register();
  });

})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

  //INTRO
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })

  /*----------------------------
    AUTENTICACION Y MANEJO DE SESIONES
  ----------------------------*/
  .state('auth.walkthrough', {
    url: '/walkthrough',
    templateUrl: "views/auth/walkthrough.html"
  })
  /*----------------------------
    Inicio de sesion
  ----------------------------*/
  .state('auth.login', {
    url: '/login',
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl'
  })
  /*----------------------------
    Registro de usuario
  ----------------------------*/
  .state('auth.signup', {
    url: '/signup',
    templateUrl: "views/auth/signup.html",
    controller: 'SignupCtrl',
  })

  .state('auth.forgot-password', {
    url: "/forgot-password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl'
  })
  /*----------------------------
    FIN AUTENTICACION
  ----------------------------*/

  /*----------------------------
    MENU
  ----------------------------*/

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  /*------------
    HOME
  --------------*/
  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: "views/app/home.html",
      controller: 'HomeCtrl',
      }
    }
  })
  /*------------
    busqueda especie
  --------------*/
  .state('app.buscarEspecie', {
   url: "/buscarEspecie/:especie",
    views: {
      'menuContent': {
        templateUrl: "views/app/buscarEspecimen.html",
        controller: "buscarEspecimenCtrl"
      }
    }
  })
/*

.state('app.buscarEspecie', {
    url: '/buscarEspecie',
    views: {
      'menuContent': {
        templateUrl: "views/app/buscarEspecimen.html",
        controller: 'buscarEspecimenCtrl',
      }
    }
  })*/
  /*------------
    Recuperar contraseña
  --------------*/
  .state('app.recuperarContrasena', {
    url: '/recuperarContrasena',
    views: {
      'menuContent': {
        templateUrl: "views/app/recuperarContrasena.html",
        controller: 'recuperarContrasenaCtrl',
      }
    }
  })
   /*----------------------------
    PERFILES
  ----------------------------*/
  //Vista y edicion de perfil usuario
  .state('app.profile', {
    url: "/profile",
    views: {
      'menuContent': {
        templateUrl: "views/app/profile.html",
        controller: "ProfileCtrl"
      }
    }
  })
  //Edicion perfil usuario
  .state('app.editprofile', {
    url: "/editprofile",
    views: {
      'menuContent': {
        templateUrl: "views/app/editprofile.html",
        controller: "EditProfileCtrl"
      }
    }
  })

  //Confirmacion perfil Cliente Profesional
  .state('app.confirmarPerfilPro', {
    url: "/confirmacionPerfPro",
    views: {
      'menuContent': {
        templateUrl: "views/app/confirmacionPerCl-Pr.html",
        controller: "confirmacionPerCl-PrCtrl"
      }
    }
  })

  //Vista de perfil establecimiento
  .state('app.site', {
    url: "/site/:idEstablecimiento",
    views: {
      'menuContent': {
        templateUrl: "views/app/siteprofile.html",
        controller: "SiteProfileCtrl"
      }
    }
  })

  //agregar establecimiento a perfil profesional
  .state('app.addsite', {
   url: "/addsite/:establecimiento",
    views: {
      'menuContent': {
        templateUrl: "views/app/agregarestablecimiento.html",
        controller: "AddSiteprfCtrl"
      }
    }
  })

  //agregar documentos de establecimientos
  .state('app.documentosEstablecimientos', {
   url: "/documentosEstablecimientos/:idEstablecimiento",
    views: {
      'menuContent': {
        templateUrl: "views/app/documentosEstablecimiento.html",
        controller: "documentosEstablecimientoCtrl"
      }
    }
  })

  // crear un establoecimiento nuevo
  .state('app.nuevoEstablecimiento', {
    url: "/nuevoEstablecimiento",
    views: {
      'menuContent': {
        templateUrl: "views/app/crearEstablecimiento.html",
        controller: "crearEstablecimientoNuevosCtrl"
      }
    }
  })

  //edicion de establecimiento
  .state('app.editarEstablecimiento', {
    url: "/edirtarEstablecimiento/:idEstablecimiento",
    views: {
      'menuContent': {
        templateUrl: "views/app/editarEstablecimiento.html",
        controller: "editarEstablecimientoCtrl"
      }
    }
  })

  // agregar profesional a establecimiento (envio de solicitud)
  .state('app.addprofesite', {
   url: "/addprofesite/:idestablecimiento/:profesional",
    views: {
      'menuContent': {
        templateUrl: "views/app/buscarProfesionalEstablecimiento.html",
        controller: "AddProfesionalEstablecimientoCtrl"
      }
    }
  })

//vista de notificaciones para perfil profesional
.state('app.notificacionesProfesional',{
  url:"/notificaciones",
  views:{
    'menuContent': {
      templateUrl: "views/app/areaNotificacionProf.html",
      controller: "NotificacionesProfesionalCtrl"
    }
  }
})

  /*----------------------------
    FIN PERFILES
  ----------------------------*/
  /*----------------------------
    SERVICIOS
  ----------------------------*/
  //CATEGORIAS
  .state('app.categorias', {
    url: "/categorias",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/categorias.html",
        controller: 'vistacategoriasCtrl'
      }
    }
  })
  //CATEGORIA DEFINIDA
  .state('app.profesionales', {
    url: "/profesionales/:idCategoria",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/vistaprfcategorias.html",
        controller: 'vistaprfcategoriasCtrl'
      }
    }
  })
  //Vista perfil profesional
  .state('app.perfilpfr', {
    url: "/profesionales/perfil/:idprofesional",
    views: {
      'menuContent': {
        templateUrl: "views/app/profilePrf.html",
        controller: "vistaperfilprfCtrl"
      }
    }
  })

  //seccion para realizar reservas a profesionales
  .state('app.reservarProfesional', {
    url: "/reservasProf/:idprofesional/:servicio/",
    views: {
      'menuContent': {
        templateUrl: "views/app/reservasProf.html",
        controller: "reservasProfCtrl"
      }
    }
  })

  //seccion para realizar reservas a profesionales
  .state('app.reservarEstablecimiento', {
    url: "/reservasEstb/:idestablecimiento/:servicio/",
    views: {
      'menuContent': {
        templateUrl: "views/app/reservasEstb.html",
        controller: "reservasEstbCtrl"
      }
    }
  })

  //seccion para enlistar las reservas activas de los perfiles
  .state('app.misreservas', {
    url: "/misreservas/",
    views: {
      'menuContent': {
        templateUrl: "views/app/misreservas.html",
        controller: "reservasperfilctrl"
      }
    },
    params: { saved: 0 }
  })
 /*----------------------------
    FIN SERVICIOS
  ----------------------------*/

  /*----------------------------
     FAVORITOS
   ----------------------------*/
   //seccion para enlistar las reservas activas de los perfiles
   .state('app.misfavoritos', {
     url: "/misfavoritos/",
     views: {
       'menuContent': {
         templateUrl: "views/app/misfavoritos.html",
         controller: "favoritosperfilctrl"
       }
     }
   })
   /*----------------------------
      FIN FAVORITOS
    ----------------------------*/

  /*----------------------------
    MAPAS
  ----------------------------*/
  ///ESTABLECIMIENTOS CERCANOS
   .state('app.establecimientoscerca', {
    url: "/establecimientos/cerca",
    views: {
      'menuContent': {
        templateUrl: "views/app/establecimientoscerca.html",
        controller: 'mapaprfcercaCtrl'
      }
    },
    params: { filtros: { } }
  })

  /*----------------------------
    FIN MAPAS
  ----------------------------*/

  //MISCELLANEOUS
  .state('app.miscellaneous', {
    url: "/miscellaneous",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/miscellaneous.html"
      }
    }
  })

  .state('app.maps', {
    url: "/miscellaneous/maps",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/maps.html",
        controller: 'MapsCtrl'
      }
    }
  })

  .state('app.image-picker', {
    url: "/miscellaneous/image-picker",
    views: {
      'menuContent': {
        templateUrl: "views/app/miscellaneous/image-picker.html",
        controller: 'ImagePickerCtrl'
      }
    }
  })

  //LAYOUTS
  .state('app.layouts', {
    url: "/layouts",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/layouts.html"
      }
    }
  })

  .state('app.tinder-cards', {
    url: "/layouts/tinder-cards",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/tinder-cards.html",
        controller: 'TinderCardsCtrl'
      }
    }
  })

  .state('app.slider', {
    url: "/layouts/slider",
    views: {
      'menuContent': {
        templateUrl: "views/app/layouts/slider.html"
      }
    }
  })

  //FEEDS
  .state('app.feeds-categories', {
    url: "/feeds-categories",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feeds-categories.html",
        controller: 'FeedsCategoriesCtrl'
      }
    }
  })


  .state('app.feed-entries', {
    url: "/feed-entries/:categoryId/:sourceId",
    views: {
      'menuContent': {
        templateUrl: "views/app/feeds/feed-entries.html",
        controller: 'FeedEntriesCtrl'
      }
    }
  })

  //WORDPRESS
  .state('app.wordpress', {
    url: "/wordpress",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress.html",
        controller: 'WordpressCtrl'
      }
    }
  })

  .state('app.post', {
    url: "/wordpress/:postId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress_post.html",
        controller: 'WordpressPostCtrl'
      }
    },
    resolve: {
      post_data: function(PostService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
      		template: 'Loading post ...'
      	});

        var postId = $stateParams.postId;
        return PostService.getPost(postId);
      }
    }
  })

  //OTHERS
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.forms', {
    url: "/forms",
    views: {
      'menuContent': {
        templateUrl: "views/app/forms.html"
      }
    }
  })


  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    }
  })

;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/home');
});
