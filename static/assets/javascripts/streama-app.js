'use strict';

var streamaApp = angular.module('streamaApp', [
	'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui.slider', 'LocalStorageModule'
]);



streamaApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

	$stateProvider
		.state('dash', {
			url: '/',
			templateUrl: 'dash.tpl.htm',
			controller: 'dashCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', function (apiService, $rootScope) {
          return apiService.currentUser().success(function (data) {
            if (data) {
              $rootScope.currentUser = data;
              return data;
            }
          });
        }]
      }
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'profile.tpl.htm',
			controller: 'profileCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', function (apiService, $rootScope) {
          return apiService.currentUser().success(function (data) {
            if (data) {
              $rootScope.currentUser = data;
              return data;
            }
          });
        }]
      }
		})
		.state('player', {
			url: '/player/:videoId?currentTime?sessionId',
			templateUrl: 'player.tpl.htm',
			controller: 'playerCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', function (apiService, $rootScope) {
          return apiService.currentUser().success(function (data) {
            if (data) {
              $rootScope.currentUser = data;
              return data;
            }
          });
        }]
      }
		})
		.state('admin', {
			url: '/admin',
			templateUrl: 'admin.tpl.htm',
			controller: 'adminCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', '$state', function (apiService, $rootScope, $state) {
          return apiService.currentUser().success(function (data) {
            if (data && data.authorities.length) {
              $rootScope.currentUser = data;
              return data;
            } else {
              $state.go('dash');
            }
          });
        }]
      }
		})
		.state('admin.movies', {
			url: '/movies',
			templateUrl: 'admin-movies.tpl.htm',
			controller: 'adminMoviesCtrl'
		})
		.state('admin.movie', {
			url: '/movie/:movieId',
			templateUrl: 'admin-movie.tpl.htm',
			controller: 'adminMovieCtrl'
		})
		.state('admin.users', {
			url: '/users',
			templateUrl: 'admin-users.tpl.htm',
			controller: 'adminUsersCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', '$state', function (apiService, $rootScope, $state) {
          return apiService.currentUser().success(function (data) {
            if (data && data.isAdmin) {
              $rootScope.currentUser = data;
              return data;
            } else {
              $state.go('dash');
            }
          });
        }]
      }
		})
		.state('admin.settings', {
			url: '/settings',
			templateUrl: 'admin-settings.tpl.htm',
			controller: 'adminSettingsCtrl',
      resolve: {
        currentUser: ['apiService', '$rootScope', '$state', function (apiService, $rootScope, $state) {
          return apiService.currentUser().success(function (data) {
            if (data.isAdmin) {
              $rootScope.currentUser = data;
              return data;
            } else {
              $state.go('dash');
            }
          });
        }]
      }
		})
		.state('admin.shows', {
			url: '/shows',
			templateUrl: 'admin-shows.tpl.htm',
			controller: 'adminShowsCtrl'
		})
		.state('admin.show', {
			url: '/show/:showId',
			templateUrl: 'admin-show.tpl.htm',
			controller: 'adminShowCtrl'
		});


	$urlRouterProvider.otherwise('/');


	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	$httpProvider.interceptors.push('httpInterceptor');

}])

	.factory('httpInterceptor', ['$rootScope', '$q', function ($rootScope, $q) {
		return {
			request: function (config) {
				config.params = config.params || {};
        if(config.params.socketSessionId){
          config.params.browserSocketUUID = $rootScope.browserSocketUUID;
        }
				return config || $q.when(config);
			},
			response: function (response) {
				return response || $q.when(response);
			},
			responseError: function (response) {

        if(response.status == 403){
          alertify.error('You do not have the rights to carry out this action.');
        }
        else if(response.status != 404 && response.status != 401 && response.status != 406){
          //alertify.error('A system error occurred');
        }


				return $q.reject(response);
			}
		};
	}]);


streamaApp.run(['$rootScope', '$state', 'localStorageService', function ($rootScope, $state, localStorageService) {
  $rootScope.baseData = {};
	$rootScope.isCurrentState = function (stateName) {
		return ($state.current.name == stateName);
	};

  $rootScope.$on('$stateChangeSuccess', function (e, toState) {
    if(toState.name == "player"){
      localStorageService.set('originUrl', location.href);
    }
  });
}]);
