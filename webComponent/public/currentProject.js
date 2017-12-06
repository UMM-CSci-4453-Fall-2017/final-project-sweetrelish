angular.module('projects',[])
    .controller('projectCtrl',projectCtrl)
    .factory('projectApi',projectApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function projectCtrl($scope,projectApi){
    $scope.currentProjects=[];
    $scope.individualProject=[];
    $scope.searchTerms=[{term: "Project Status"},{term: "Project Title"},{term: "Project Intensity"},{term: "Description"}]
    $scope.projectID="";
    $scope.projectProjectStatus="";
    $scope.projectTitle="";
    $scope.projectStartDate="";
    $scope.projectEndDate="";
    $scope.projectIntensity="";
    $scope.projectDescription="";
    $scope.projectFundingType="";
    $scope.projectStatus="";
    $scope.projectLinktoProject="";
    $scope.projectSynopsisLink="";
    $scope.projectMethodology="";
    $scope.bool = true;
    $scope.getProjects=getProjects;
    $scope.openQuery=openQuery;

  function getProjects(){
    loading=true;
    projectApi.getProjects()
        .success(function(data){
            $scope.currentProjects=data;
            loading = false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
  }

  function openQuery($event, id, project_status, project_title, project_start_date, project_end_date,
    project_intensity, project_description, project_funding_type, project_status, project_link, project_synpsis_link, project_methodology){
        $scope.projectID=id;
        $scope.projectProjectStatus=project_status;
        $scope.projectTitle=project_title;
        $scope.projectStartDate=project_start_date;
        $scope.projectEndDate=project_end_date;
        $scope.projectIntensity=project_intensity;
        $scope.projectDescription=project_description;
        $scope.projectFundingType=project_funding_type;
        $scope.projectStatus=project_status;
        $scope.projectLinktoProject=project_link;
        $scope.projectSynopsisLink=project_synpsis_link;
        $scope.projectMethodology=project_methodology;
        $scope.bool=false;
        console.log(event.target.id);
        projectApi.getSpecificProject(event.target.id)
        .success(function(data){
          $scope.individualProject=data;
          loading=false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
  }

  getProjects();
  }

  function projectApi($http,apiUrl){
    return{
      getProjects: function(){
          var url = apiUrl + '/getProjects';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },
      getSpecificProject: function(projectID){
        var url = apiUrl + '/getSpecificProject?projectID=' + projectID;
        return $http.get(url);
      },
      // queryStudentWorkers: function(selectedSearchTerm, searchTerm){
      //   var url = apiUrl + '/query?selectedSearchTerm=' +selectedSearchTerm + '&searchTerm=' + searchTerm;
      //   return $http.get(url);
      // },
      // scrollDownStudentWorkers: function(skipTerm){
      //   var url = apiUrl + '/scrollDownStudentWorkers?skipTerm=' + skipTerm;
      //   return $http.get(url);
      // },
      // selectStudentWorkersProject: function(studentID){
      //   var url = apiUrl + '/selectStudentWorkersProject?studentID=' + studentID;
      //   return $http.get(url);
      // },
      // updateStudentWorkers: function(id, last_name, first_name, email_address, city, state, country, graduation_year, major){
      //   var url = apiUrl + '/updateStudentWorkers?studentID=' + id + '&last_name=' + last_name + '&first_name=' + first_name + '&email_address=' + email_address +
      //   '&city=' + city + '&state=' + state + '&country=' + country + '&graduation_year=' + graduation_year + '&major=' + major;
      //   return $http.get(url);
      // },
      // deleteStudentWorker: function(id){
      //   console.log("Hello2");
      //   var url = apiUrl + '/deleteStudentWorker?studentID=' + id;
      //   return $http.get(url);
      // },
    };
  }

  // $scope.individualStudentInfo=[];
  // $scope.searchTerms=[{term: "studentID"},{term: "Last Name"},{term: "First Name"},{term: "Email Address"},{term: "City"},{term: "State"},{term: "Country"},{term: "Graduation Year"},{term: "Major"}]
  // $scope.searchTerm="";
  // $scope.studentID = 3;
  // $scope.studentLastName="";
  // $scope.studentFirstName="";
  // $scope.studentEmailAddress="";
  // $scope.studentCity="";
  // $scope.studentState="";
  // $scope.studentCountry="";
  // $scope.studentGraduationYear="";
  // $scope.studentMajor="";
  // $scope.tempstudentLast_Name="";
  // $scope.tempstudentFirst_Name="";
  // $scope.tempstudentEmailAddress="";
  // $scope.tempstudentCity="";
  // $scope.tempstudentState="";
  // $scope.tempstudentCountry="";
  // $scope.tempstudentGraduationYear="";
  // $scope.tempstudentMajor="";
  // $scope.selectedSearchTerm="";
  // $scope.searchTermsforUpdate=[];
  // $scope.updateStudentWorkers=updateStudentWorkers;
  // $scope.queryStudentWorkers=queryStudentWorkers;
  // $scope.scrollDownStudentWorkers=scrollDownStudentWorkers;
  // $scope.scrollUpStudentWorkers=scrollUpStudentWorkers;
  // $scope.openQuery=openQuery;
  // $scope.saveChangestoStudentWorkers=saveChangestoStudentWorkers;
  // $scope.deleteStudentWorker=deleteStudentWorker;
  // $scope.warning_box=warning_box;

  var loading = false;
//   var begin = 0;
//   //var studentID = 0;
//
// function isLoading(){
//     return loading;
// }
//
// function warning_box($event){
//   if (confirm("Are you sure you want to delete this person record from database?") == true) {
//     deleteStudentWorker($event);
//   } else {
//     return;
//   }
// }
//
// function deleteStudentWorker($event){
//   console.log("Hello");
//   projectApi.deleteStudentWorker($scope.studentID)
//     .success(function(){
//       loading=false;
//   })
//   .error(function () {
//     $scope.errorMessage="Unable click";
//     loading=false;
//   });
// }
//
// function saveChangestoStudentWorkers($event){
//     projectApi.updateStudentWorkers($scope.studentID, $scope.tempstudentLast_Name, $scope.tempstudentFirst_Name, $scope.tempstudentEmailAddress, $scope.tempstudentCity,
//     $scope.tempstudentState, $scope.tempstudentCountry, $scope.tempstudentGraduationYear, $scope.tempstudentMajor)
//       .success(function(data){
//       $scope.individualStudentInfo=data;
//       updateStudentWorkers();
//       loading=false;
//     })
//     .error(function () {
//       $scope.errorMessage="Unable click";
//       loading=false;
//     });
//     $scope.bool=true;
//   }
//
// function openQuery($event, id, last_name, first_name, email_address, city, state, country, graduation_year, major){
//     $scope.studentID = id;
//     $scope.studentLastName = last_name;
//     $scope.studentFirstName = first_name;
//     $scope.studentEmailAddress = email_address;
//     $scope.studentCity = city;
//     $scope.studentState = state;
//     $scope.studentCountry = country;
//     $scope.studentGraduationYear = graduation_year;
//     $scope.studentMajor = major;
//     $scope.bool=false;
//     projectApi.selectStudentWorkersProject(event.target.id)
//     .success(function(data){
//       $scope.individualStudentInfo=data;
//       loading=false;
//     })
//     .error(function () {
//       $scope.errorMessage="Unable click";
//       loading=false;
//     });
//   }
//
// function scrollDownStudentWorkers($event){
//   loading=true;
//   begin = $scope.studentWorkers[0].studentID;
//   begin = begin + 17;
//   projectApi.scrollDownStudentWorkers(begin)
//     .success(function(data){
//       $scope.studentWorkers=data;
//       loading=false;
//     })
//     .error(function () {
//       $scope.errorMessage="Unable click";
//       loading=false;
//     });
// }
//
// function scrollUpStudentWorkers($event){
//   loading=true;
//   begin = $scope.studentWorkers[0].studentID;
//   if (begin <= 18){
//     return;
//   } else {
//     begin = begin - 19;
//     projectApi.scrollDownStudentWorkers(begin)
//       .success(function(data){
//         $scope.studentWorkers=data;
//         loading=false;
//       })
//       .error(function () {
//         $scope.errorMessage="Unable click";
//         loading=false;
//       });
//   }
// }
//
// function queryStudentWorkers($event){
//   loading=true;
//   projectApi.queryStudentWorkers($scope.selectedSearchTerm, $scope.searchTerm)
//     .success(function(data){
//        $scope.studentWorkers=data;
//        loading=false;
//     })
//     .error(function () {
//       $scope.errorMessage="Unable click";
//       loading=false;
//     });
// }
//
