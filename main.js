const API_BASE = window.location.protocol + '//api.' + window.location.hostname;

const app = angular.module('lph', []);

app.controller('CreateLandingPageController', function($scope, $rootScope, $http) {
    $scope.create = function(newLandingPage) {
        $http.put(API_BASE + '/management/landing-pages', newLandingPage)
            .then(function(response) {
                $rootScope.currentTab = 'listLandingPages';
                alert('Landing page created!');
            })
            .catch(response => alert('Error! Could not create landing page.'));
    };
});

app.controller('ListLandingPagesController', function($scope, $http) {
    function loadLandingPages() {
        $http.get(API_BASE + '/management/landing-pages')
            .then(function(response) {
                $scope.count = response.data.count;
                $scope.landingPages = response.data.landingPages;
            })
            .catch(response => alert('Error! Could not load landing pages.'));
    }

    loadLandingPages();

    $scope.delete = function(landingPage) {
        $http.delete(API_BASE + '/management/landing-pages/' + landingPage.id)
            .then(function(deleteResponse) {
                loadLandingPages();
                alert('Deleted ' + landingPage.name);
            })
            .catch(response => alert('Error! Could not delete landing page.'));
    };
});

app.controller('CreateDeveloperController', function($scope, $rootScope, $http) {
    $scope.create = function(newDeveloper) {
        $http.put(API_BASE + '/management/developers', newDeveloper)
            .then(function(response) {
                $rootScope.currentTab = 'listDevelopers';
                alert('Developer created!');
            })
            .catch(response => alert('Error! Could not create developer.'));
    };
});

app.controller('ListDevelopersController', function($scope, $http) {
    function loadDevelopers() {
        $http.get(API_BASE + '/management/developers')
            .then(function(response) {
                $scope.count = response.data.count;
                $scope.developers = response.data.developers;
            })
            .catch(response => alert('Error! Could not load developers.'));
    }

    loadDevelopers();

    $scope.delete = function(developer) {
        $http.delete(API_BASE + '/management/developers/' + developer.id)
            .then(function(deleteResponse) {
                loadDevelopers();
                alert('Deleted ' + developer.realName);
            })
            .catch(response => alert('Error! Could not delete developer.'));
    };
});
