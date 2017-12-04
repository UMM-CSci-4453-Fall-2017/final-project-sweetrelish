angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function ButtonCtrl($scope,buttonApi){
    $scope.studentWorkers=[];
    $scope.searchTerms=[{term: "studentID"},{term: "Last Name"},{term: "First Name"},{term: "Email Address"},{term: "City"},{term: "State"},{term: "Country"},{term: "Graduation Year"},{term: "Major"}]
    $scope.searchTerm;
    $scope.updateStudentWorkers=updateStudentWorkers;
    $scope.queryStudentWorkers=queryStudentWorkers;

    var loading = false;

    function isLoading(){
      return loading;
    }

  function queryStudentWorkers($event){
    loading=true;
    console.log($scope.selectedSearchTerm);
    console.log($scope.searchTerm);
    buttonApi.queryStudentWorkers($scope.selectedSearchTerm, $scope.searchTerm)
      .success(function(data){
         $scope.studentWorkers=data;
         loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable click";
        loading=false;
      });
  }

  function updateStudentWorkers(){
    loading=true;
    buttonApi.getStudentWorkers()
        .success(function(data){
            $scope.studentWorkers=data;
            loading = false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
    }

  updateStudentWorkers();
  }

  function buttonApi($http,apiUrl){
    return{
      getStudentWorkers: function(){
          var url = apiUrl + '/getstudentWorkers';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },
      queryStudentWorkers: function(selectedSearchTerm, searchTerm){
        var url = apiUrl + '/query?selectedSearchTerm=' +selectedSearchTerm + '&searchTerm=' + searchTerm;
        return $http.get(url);
      }
    };
  }
