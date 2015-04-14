var app = angular.module("myWorld", ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
        .when("/", {
            controller : "HomeCtrl",
            templateUrl : "/templates/index.html"
        })
        .when("/people", {
            controller : "PeopleCtrl",
            templateUrl : "/templates/people/list.html"
        })
        .when("/things", {
            controller : "ThingsCtrl",
            templateUrl : "/templates/things/list.html"

        });

        $locationProvider.html5Mode(true);
});

app.controller("HeaderCtrl", function($scope, HeaderSvc){
    $scope.tabs = HeaderSvc.tabs;
    $scope.foo = "bar";
});

app.controller("HomeCtrl", function($scope, HeaderSvc){
    $scope.foo = "bar";
    HeaderSvc.setTab("Home");
});

app.controller("PeopleCtrl", function($scope, HeaderSvc, PeopleSvc){
    $scope.foo = "bar";
    function activate(){
        $scope.people = people;
    };

    activate();

    HeaderSvc.setTab("People");
    PeopleSrv.getPeople().then(function(people){
        $scope.people = people;
    });

    $scope.delete = function(person){
        PeopleSvc.deletePerson(person).then(function(){
            activate();
        });
    };

    $scope.insert = function(){ // not sure this is right
        PeopleSvc.insertPerson($scope.inserting).then(function(){
            activate();
        });
        // alert("boo!");
    };

    $scope.edit = function(person){
        $scope.editing = person;
    };
});

app.controller("ThingsCtrl", function($scope, HeaderSvc){
    $scope.foo = "bar";
    HeaderSvc.setTab("Things");
});

app.factory("HeaderSvc", function(){
    var _tabs = [
        { title : "Home", path = "/" },
        { title : "People", path = "/people" },
        { title : "Things", path = "/things" }
    ];
    return {
        tabs : _tabs
        setTab : function(title){
            for(var i = 0; i < tabs.length; i++){
                if(title.toLowerCase() == _tabs[i].title.toLowerCase()){
                    _tabs[i].active = true;
                    _tabs[i].title = _tabs[i].title.toUpperCase();
                } else {
                    _tabs[i].active = false;
                    _tabs[i].title = _tabs[i].title.toLowerCase();
                };
            };
        };
    };
});

app.factory("PeopleSvc", function(){
    return {
        getPeople : function($q, $http){
            var dfd = $q.defer();
            $http.get("/api/people").then(function(result){
                dfd.resolve(result.data);
            });
            return dfd.promise;
        },
        deletePerson : function(person){
            var dfd = $q.defer();
            $http.delete("/api/people/" + person._id).then(function(){
                dfd.resolve();
            });
            return dfd.promise;
        },
        insertPerson : function(person){
            var dfd = $q.defer();
            $http.post("/api/people", person).then(function(){
                dfd.resolve();
            });
            return dfd.promise;
        }
    };
});



