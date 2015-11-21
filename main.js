var app = angular.module('lph', []);

app.controller('CreateLandingPageController', function($scope, $rootScope, $http) {
    $scope.create = function(newLandingPage) {
        $http.put('http://api.lph.dev/management/landing-pages', {
            name: newLandingPage.name,
            jobNumber: newLandingPage.jobNumber,
            gitUri: newLandingPage.gitUri
        })
        .then(function(response) {
            $rootScope.currentTab = 'listLandingPages';
            alert('Landing page created!');
        })
        .catch(response => alert('Error! Could not load landing pages.'));
    };
});

app.controller('ListLandingPagesController', function($scope, $http) {
    function loadLandingPages() {
        $http.get('http://api.lph.dev/management/landing-pages')
            .then(function(response) {
                $scope.count = response.data.count;
                $scope.landingPages = response.data.landingPages;
            })
            .catch(response => alert('Error! Could not load landing pages.'));
    }

    loadLandingPages();

    $scope.delete = function(landingPage) {
        $http.delete('http://api.lph.dev/management/landing-pages/' + landingPage.id)
            .then(function(deleteResponse) {
                loadLandingPages();
                alert('Deleted ' + landingPage.name);
            })
            .catch(response => alert('Error! Could not delete landing page.'));
    };
});
