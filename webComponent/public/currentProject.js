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
    $scope.tempProjectProjectStatus="";
    $scope.tempProjectTitle="";
    $scope.tempProjectStartDate="";
    $scope.tempProjectEndDate="";
    $scope.tempProjectIntensity="";
    $scope.tempProjectDescription="";
    $scope.tempProjectFundingType="";
    $scope.tempProjectStatus="";
    $scope.tempProjectLinkedtoProject="";
    $scope.tempProjectSynopsisLink="";
    $scope.tempProjectMethodology="";
    $scope.bool = true;
    $scope.getProjects=getProjects;
    $scope.openQuery=openQuery;
    $scope.warning_box=warning_box;
    $scope.deleteProject=deleteProject;
    $scope.saveChangestoProjects=saveChangestoProjects;
    $scope.queryProject=queryProject;
    $scope.scrollUpProject=scrollUpProject;
    $scope.scrollDownProject=scrollDownProject;
    var loading = false;
    var begin = 0;

  function warning_box($event){
      if (confirm("Are you sure you want to delete this project record from database?") == true) {
        deleteProject($event);
      } else {
        return;
      }
  }

  function saveChangestoProjects($event){
    console.log("Hello");
    projectApi.saveChangestoProjects($scope.projectID, $scope.tempProjectProjectStatus, $scope.tempProjectTitle, $scope.tempProjectStartDate, $scope.tempProjectEndDate,
    $scope.tempProjectIntensity, $scope.tempProjectDescription, $scope.tempProjectFundingType, $scope.tempProjectStatus,
    $scope.tempProjectLinkedtoProject, $scope.tempProjectSynopsisLink, $scope.tempProjectMethodology)
      .success(function(){
        $scope.bool=true;
        loading=false;
      })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
        $scope.bool=true;
  }

  function scrollDownProject($event){
    console.log($scope.currentProjects[0].projectID);
    loading=true;
    begin = $scope.currentProjects[0].projectID;
    begin = begin + 9;
    projectApi.scrollDownProject(begin)
      .success(function(data){
        $scope.currentProjects=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable click";
        loading=false;
      });
  }

  function scrollUpProject($event){
    loading=true;
    begin = $scope.currentProjects[0].projectID;
    if (begin <= 10){
      return;
    } else {
      begin = begin - 11;
      projectApi.scrollDownProject(begin)
        .success(function(data){
          $scope.currentProjects=data;
          loading=false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
    }
  }

  function deleteProject($event){
    projectApi.deleteProject($scope.projectID)
      .success(function(){
        $scope.bool=true;
        loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable click";
      loading=false;
    });
  }

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

  function queryProject($event){
    loading=true;
    projectApi.queryProject($scope.selectedSearchTerm, $scope.searchTerm)
      .success(function(data){
         $scope.currentProjects=data;
         loading=false;
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
      deleteProject: function(projectID){
        var url = apiUrl + '/deleteProject?projectID=' + projectID;
        return $http.get(url);
      },
      saveChangestoProjects: function(id, status, title, start_date, end_date, intensity, description, funding_type, project_status, linktoproject, synopsisLink, methodology){
        var url = apiUrl + '/saveChangestoProjects?projectID=' + id + '&status=' + status + '&title=' + title + '&start_date=' + start_date + '&end_date=' + end_date
        + '&intensity=' + intensity + '&description=' + description + '&funding_type=' + funding_type + '&project_status=' + project_status + + '&linktoproject=' + linktoproject +
        + '&synopsisLink=' + synopsisLink + + '&methodology=' + methodology;
        return $http.get(url);
      },
      queryProject: function(selectedSearchTerm, searchTerm){
        var url = apiUrl + '/queryProject?selectedSearchTerm=' +selectedSearchTerm + '&searchTerm=' + searchTerm;
        return $http.get(url);
      },
      scrollDownProject: function(skipTerm){
        var url = apiUrl + '/scrollDownProject?skipTerm=' + skipTerm;
        return $http.get(url);
      },
    };
  }
