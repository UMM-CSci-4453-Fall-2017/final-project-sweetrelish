angular.module('home',[])
    .controller('homeCtrl',homeCtrl)
    .factory('homeApi',homeApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function homeCtrl($scope,homeApi){
    $scope.projectInfo=[];
    $scope.studentInfo=[];
    $scope.organizationInfo=[];
    $scope.retrieveProjectInfo=retrieveProjectInfo;
    $scope.retrieveStudentInfo=retrieveStudentInfo;
    $scope.retrieveOrganizationInfo=retrieveOrganizationInfo;
    $scope.errorMessage="";

  function retrieveProjectInfo(){
    loading=true;
    homeApi.getProjectInfo()
      .success(function(data){
        $scope.projectInfo=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable to retrieve information";
        loading=false;
      })
  }

  function retrieveStudentInfo(){
    loading=true;
    homeApi.getStudentWorkersInfo()
      .success(function(data){
        $scope.studentInfo=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable to retrieve information";
        loading=false;
      })
  }

  function retrieveOrganizationInfo(){
    loading=true;
    homeApi.getOrganizationInfo()
      .success(function(data){
        $scope.studentInfo=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable to retrieve information";
        loading=false;
      })
  }

  retrieveProjectInfo();
  retrieveStudentInfo();
  retrieveOrganizationInfo();

  }

  function homeApi($http,apiUrl){
    return{
      getProjectInfo: function(){
          var url = apiUrl + '/getProjectInfo';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },
      getStudentWorkersInfo: function(){
          var url = apiUrl + '/getStudentWorkersInfo';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },

      getOrganizationInfo: function(){
        var url = apiUrl + '/getOrganizationInfo';
        // console.log("Attempting with " + url);
        return $http.get(url);
      }
    };
  }
