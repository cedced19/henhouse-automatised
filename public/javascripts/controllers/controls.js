module.exports = ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $rootScope.nav = 'controls';
        if (!$rootScope.user) {
            $location.path('/login');
        }

}];
