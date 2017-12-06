angular.module('addRecord',[])
    .controller('addRecordCtrl',addRecordCtrl)
    .factory('addRecordApi',addRecordApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function addRecordCtrl($scope,addRecordApi){
    $scope.studentLastName="";
    $scope.studentFirstName="";
    $scope.studentEmailAddress="";
    $scope.studentCity="";
    $scope.studentState="";
    $scope.studentCountry="";
    $scope.studentGraduationYear="";
    $scope.studentMajor="";
    $scope.projectStatus="";
    $scope.projectTitle="";
    $scope.project_start_date="";
    $scope.project_end_date="";
    $scope.projectIntensity="";
    $scope.projectDescription="";
    $scope.projectFunding="";
    $scope.projectStatusStatus="";
    $scope.projectLink="";
    $scope.projectSynopsis="";
    $scope.projectMethodology="";
    $scope.storeToDatabase=storeToDatabase;

    var loading = false;
    var begin = 0;
    //var studentID = 0;

  function isLoading(){
      return loading;
  }

  function warning_box($event){
    if (confirm("Are you sure you want to delete this person record from database?") == true) {
      deleteStudentWorker($event);
    } else {
      return;
    }
  }


  function storeToDatabase($event){
    addRecordApi.storeToDatabase($scope.studentLastName, $scope.studentFirstName, $scope.studentEmailAddress, $scope.studentCity, $scope.studentState, $scope.studentCountry, $scope.studentGraduationYear,
    $scope.studentMajor, $scope.projectStatus, $scope.projectTitle, $scope.project_start_date, $scope.project_end_date, $scope.projectIntensity, $scope.projectDescription, $scope.projectFunding,
    $scope.projectStatusStatus, $scope.projectLink, $scope.projectSynopsis, $scope.projectMethodology)
      .success(function(){
        loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable click";
      loading=false;
    });
  }
}

  function addRecordApi($http,apiUrl){
    return{
      storeToDatabase: function(studentLastName, studentFirstName, studentEmailAddress, studentCity, studentState, studentCountry, studentGraduationYear, studentMajor, projectStatus, projectTitle, project_start_date, project_end_date,
        projectIntensity, projectDescription, projectFunding, projectStatusStatus, projectLink, projectSynopsis, projectMethodology){
          var url = apiUrl + '/storeToDatabase?studentLastName' + studentLastName + '?studentFirstName=' + studentFirstName + '?studentEmailAddress=' + studentEmailAddress + '?studentCity=' + studentCity + '?studentState=' + studentState
          + '?studentCountry=' + studentCountry + '?studentGraduationYear=' + studentGraduationYear + '?studentMajor=' + studentMajor + '?projectStatus=' + projectStatus + '?projectTitle=' + projectTitle + '?project_start_date=' + project_start_date
          + '?project_end_date=' + project_end_date + '?projectIntensity=' + projectIntensity + '?projectDescription=' + projectDescription + '?projectFunding=' + projectFunding + '?projectStatusStatus=' + projectStatusStatus
          + '?projectLink=' + projectLink + '?projectSynopsis=' + projectSynopsis + '?projectMethodology=' + projectMethodology;
          console.log("Attempting with " + url);
          return $http.get(url);
      },
    };
  }
