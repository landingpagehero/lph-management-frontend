'use strict';

const API_BASE = window.location.protocol + '//api.' + window.location.hostname;
const IS_DEV = window.location.hostname === 'lph.dev';
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

                if (!IS_DEV) {
                    $scope.landingPages.forEach(function(landingPage) {
                        $http.get('http://api.fileapi.net/v1/screenshot?key=lph&url=' + window.encodeURI(landingPage.stagingUrl))
                            .then(response => landingPage.screenshot = response.data.result.screenshot);
                    });
                }
            })
            .catch(response => alert('Error! Could not load landing pages.'));
    }

    loadLandingPages();

    $scope.edit = function(landingPage) {
        $rootScope.currentTab = 'editLandingPage';
        $rootScope.currentLandingPageId = landingPage.id;
    };

    $scope.delete = function(landingPage) {
        if (!window.confirm('Are you sure you want to delete ' + landingPage.name + '?')) {
            return;
        }

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

    $scope.viewCodeChangesLog = function(landingPage) {
        $rootScope.currentTab = 'viewLandingPageCodeChangesLog';
        $rootScope.currentLandingPageId = landingPage.id;
    };

    $scope.deploy = function(landingPage, environment) {
        const branch = window.prompt('What branch do you want to deploy?');
        if (!branch) {
            alert('Error! No branch entered.')
            return;
        }

        $http.post(API_BASE + '/management/landing-pages/' + landingPage.id + '/deploy/' + environment + '/' + branch)
            .then(response => alert(`Deployed ${landingPage.name} to ${response.data.url}`))
            .catch(response => alert('Error! Could not deploy landing page.'));
    };

    $scope.viewUserEvents = function(landingPage, environment) {
        $rootScope.currentTab = 'viewLandingPageUserEvents';
        $rootScope.currentEnvironment = environment;
        $rootScope.currentLandingPageId = landingPage.id;
    };

    $scope.viewFormSubmissions = function(landingPage, environment) {
        $rootScope.currentTab = 'viewLandingPageFormSubmissions';
        $rootScope.currentEnvironment = environment;
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
        $http.post(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId, $scope.landingPage)
            .then(response => alert('Edited landing page.'))
            .catch(response => alert('Error! Could not edit landing page.'));
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

app.controller('ViewLandingPageCodeChangesLogController', function($scope, $http, $rootScope) {
    $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId)
        .then(response => $scope.landingPage = response.data.landingPage)
        .catch(response => alert('Error! Could not load landing page.'));

    $scope.getChanges = function(branch) {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId + '/code-changes-log/' + $scope.branch)
            .then(response => $scope.codeChanges = response.data.codeChanges)
            .catch(response => alert('Error! Could not load landing page code changes.'));
    };
});

app.controller('ViewLandingPageUserEventsController', function($scope, $http, $rootScope) {
    function loadEvents() {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId + '/user-events/' + $rootScope.currentEnvironment)
            .then(response => $scope.events = response.data.events)
            .catch(response => alert('Error! Could not get landing page user events.'));
    }

    $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId)
        .then(response => $scope.landingPage = response.data.landingPage)
        .then(loadEvents)
        .catch(response => alert('Error! Could not load landing page.'));

});

app.controller('ViewLandingPageFormSubmissionsController', function($scope, $http, $rootScope, $window) {
    function loadFormSubmissions() {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId + '/form-submissions/' + $rootScope.currentEnvironment)
            .then(response => $scope.submissions = response.data.submissions)
            .catch(response => alert('Error! Could not get landing page form submissions.'));
    }

    $scope.downloadAsCsv = function() {
        $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId + '/form-submissions/' + $rootScope.currentEnvironment + '.csv')
            .then(response => $window.location.href = response.data.downloadUrl)
            .catch(response => alert('Error! Could not download as a CSV.'));
    }

    $http.get(API_BASE + '/management/landing-pages/' + $rootScope.currentLandingPageId)
        .then(response => $scope.landingPage = response.data.landingPage)
        .then(loadFormSubmissions)
        .catch(response => alert('Error! Could not load landing page.'));

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
        if (!window.confirm('Are you sure you want to delete ' + developer.realName + '?')) {
            return;
        }

        $http.delete(API_BASE + '/management/developers/' + developer.id)
            .then(function(deleteResponse) {
                loadDevelopers();
                alert('Deleted ' + developer.realName);
            })
            .catch(response => alert('Error! Could not delete developer.'));
    };
});

app.filter('join', function () {
    return function (input, delimiter) {
        return input.join(delimiter);
    };
});

app.filter('formatAsParagraph', function ($sce) {
    return function (input) {
        let html;
        if (input === null || input === undefined) {
            html = "";
        } else {
            html = input.replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\n/g, '<br />')
                        ;
        }

        return $sce.trustAsHtml(html);
    };
});
