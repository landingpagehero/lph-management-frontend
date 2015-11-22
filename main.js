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

app.controller('ListLandingPagesController', function($scope, $http, $rootScope) {
    function loadLandingPages() {
        $http.get(API_BASE + '/management/landing-pages')
            .then(function(response) {
                $scope.count = response.data.count;
                $scope.landingPages = response.data.landingPages;
            })
            .catch(response => alert('Error! Could not load landing pages.'));
    }

    loadLandingPages();

    $scope.edit = function(landingPage) {
        $rootScope.currentTab = 'editLandingPage';
        $rootScope.currentLandingPageId = landingPage.id;
    };

    $scope.delete = function(landingPage) {
        $http.delete(API_BASE + '/management/landing-pages/' + landingPage.id)
            .then(function(deleteResponse) {
                loadLandingPages();
                alert('Deleted ' + landingPage.name);
            })
            .catch(response => alert('Error! Could not delete landing page.'));
    };

    $scope.viewAuditLog = function(landingPage) {
        $rootScope.currentTab = 'viewLandingPageAuditLog';
        $rootScope.currentLandingPageId = landingPage.id;
    };
});

app.controller('EditLandingPageController', function($scope, $http, $rootScope) {
    function loadLandingPage() {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId)
            .then(function(response) {
                $scope.landingPage = response.data.landingPage;
            })
            .catch(response => alert('Error! Could not load landing page.'));
    }

    loadLandingPage();

    $scope.save = function(landingPage) {
    };
});

app.controller('ViewLandingPageAuditLogController', function($scope, $http, $rootScope) {
    function load() {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId)
            .then(function(response) {
                $scope.landingPage = response.data.landingPage;
            })
            .catch(response => alert('Error! Could not load landing page.'));

        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId + '/audit-log')
            .then(function(response) {
                $scope.auditLog = response.data.auditLog;
            })
            .catch(response => alert('Error! Could not load landing page audit log.'));
    }

    load();
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
