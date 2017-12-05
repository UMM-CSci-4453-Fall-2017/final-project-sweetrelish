angular.module('components',[])
    .controller('compCtrl',compCtrl)
    .factory('compApi',compApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function compCtrl($scope,compApi){
    $scope.studentWorkers=[];
    $scope.studentWorker=[];
    $scope.searchTerms=[{term: "studentID"},{term: "Last Name"},{term: "First Name"},{term: "Email Address"},{term: "City"},{term: "State"},{term: "Country"},{term: "Graduation Year"},{term: "Major"}]
    $scope.searchTerm;
    $scope.selectedSearchTerm;
    $scope.studentid;
    $scope.updateStudentWorkers=updateStudentWorkers;
    $scope.queryStudentWorkers=queryStudentWorkers;
    $scope.scrollDownStudentWorkers=scrollDownStudentWorkers;
    $scope.scrollUpStudentWorkers=scrollUpStudentWorkers;
    $scope.selectStudentWorkersProject=selectStudentWorkersProject;

    var loading = false;
    var begin = 0;
    var studentID = 0;

    function isLoading(){
      return loading;
    }

  function selectStudentWorkersProject($event){
    studentID = event.target.id;
    buttonApi.selectStudentWorkersProject(studentID)
    .success(function(data){
      $scope.studentWorker=data;
      loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable click";
      loading=false;
    });
  }

  function scrollDownStudentWorkers($event){
    loading=true;
    begin = $scope.studentWorkers[0].studentID;
    begin = begin + 17;
    buttonApi.scrollDownStudentWorkers(begin)
      .success(function(data){
        $scope.studentWorkers=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable click";
        loading=false;
      });
  }

  function scrollUpStudentWorkers($event){
    loading=true;
    begin = $scope.studentWorkers[0].studentID;
    if (begin <= 18){
      return;
    } else {
      begin = begin - 19;
      buttonApi.scrollDownStudentWorkers(begin)
        .success(function(data){
          $scope.studentWorkers=data;
          loading=false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
    }
  }

  function queryStudentWorkers($event){
    loading=true;
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

    function updateStudentWorkersProjects(){
      loading=true;
      buttonApi.selectStudentWorkersProject(studentID)
          .success(function(data){
              $scope.studentWorker=data;
              loading = false;
          })
          .error(function () {
            $scope.errorMessage="Unable click";
            loading=false;
          });
      }

  updateStudentWorkers();
  updateStudentWorkersProjects();
  }

  function compApi($http,apiUrl){
    return{
      getStudentWorkers: function(){
          var url = apiUrl + '/getstudentWorkers';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },
      queryStudentWorkers: function(selectedSearchTerm, searchTerm){
        var url = apiUrl + '/query?selectedSearchTerm=' +selectedSearchTerm + '&searchTerm=' + searchTerm;
        return $http.get(url);
      },
      scrollDownStudentWorkers: function(skipTerm){
        var url = apiUrl + '/scrollDownStudentWorkers?skipTerm=' + skipTerm;
        return $http.get(url);
      },
      selectStudentWorkersProject: function(studentID){
        var url = apiUrl + '/selectStudentWorkersProject?studentID=' + studentID;
        return $http.get(url);
      },
    };
  }
