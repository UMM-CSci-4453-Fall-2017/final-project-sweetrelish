angular.module('organization',[])
    .controller('organizationCtrl',organizationCtrl)
    .factory('organizationApi',organizationApi)
    .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

  function organizationCtrl($scope,organizationApi){
    $scope.currentOrganizations=[];
    $scope.individualOrganization=[];
    $scope.searchTerms=[{term: "Organization"},{term: "Type"},{term: "City"}]
    $scope.organizationID="";
    $scope.organizationOrganization="";
    $scope.organizationType="";
    $scope.organizationCity="";
    $scope.temporganizationOrganization="";
    $scope.temporganizationType="";
    $scope.temporganizationCity="";
    $scope.bool = true;
    $scope.getOrganizations=getOrganizations;
    $scope.openQuery=openQuery;
    $scope.warning_box=warning_box;
    $scope.deleteOrganization=deleteOrganization;
    $scope.saveChangesToOrganizations=saveChangesToOrganizations;
    $scope.queryOrganization=queryOrganization;
    $scope.scrollUpOrganization=scrollUpOrganization;
    $scope.scrollDownOrganization=scrollDownOrganization;
    var loading = false;
    var begin = 0;

  function warning_box($event){
      if (confirm("Are you sure you want to delete this organization record from database?") == true) {
        deleteOrganization($event);
      } else {
        return;
      }
  }

  function saveChangesToOrganizations($event){
    console.log("Hello");
    organizationApi.saveChangesToOrganizations($scope.organizationID, $scope.temporganizationOrganization, $scope.temporganizationType, $scope.temporganizationCity)
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

  function scrollDownOrganization($event){
    console.log($scope.currentOrganizations[0].organizationID);
    loading=true;
    begin = $scope.currentOrganizations[0].organizationID;
    begin = begin + 9;
    organizationApi.scrollDownOrganization(begin)
      .success(function(data){
        $scope.currentOrganizations=data;
        loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable click";
        loading=false;
      });
  }

  function scrollUpOrganization($event){
    loading=true;
    begin = $scope.currentOrganizations[0].organizationID;
    if (begin <= 10){
      return;
    } else {
      begin = begin - 11;
      organizationApi.scrollDownOrganization(begin)
        .success(function(data){
          $scope.currentOrganizations=data;
          loading=false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
    }
  }

  function deleteOrganization($event){
    organizationApi.deleteOrganization($scope.organizationID)
      .success(function(){
        $scope.bool=true;
        loading=false;
    })
    .error(function () {
      $scope.errorMessage="Unable click";
      loading=false;
    });
  }

  function getOrganizations(){
    loading=true;
    organizationApi.getOrganizations()
        .success(function(data){
            $scope.currentOrganizations=data;
            loading = false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
  }

  function queryOrganization($event){
    loading=true;
    organizationApi.queryOrganization($scope.selectedSearchTerm, $scope.searchTerm)
      .success(function(data){
         $scope.currentOrganizations=data;
         loading=false;
      })
      .error(function () {
        $scope.errorMessage="Unable click";
        loading=false;
      });
  }

  function openQuery($event, id, organization, type, city){
        $scope.organizationID=id;
        $scope.organizationOrganization=organization;
        $scope.organizationType=type;
        $scope.organizationCity=city;
        $scope.bool=false;
        console.log(event.target.id);
        organizationApi.getSpecificOrganization(event.target.id)
        .success(function(data){
          $scope.individualOrganization=data;
          loading=false;
        })
        .error(function () {
          $scope.errorMessage="Unable click";
          loading=false;
        });
  }

  getOrganizations();
  }

  function organizationApi($http,apiUrl){
    return{
      getOrganizations: function(){
          var url = apiUrl + '/getOrganizations';
          // console.log("Attempting with " + url);
          return $http.get(url);
      },
      getSpecificOrganization: function(organizationID){
        var url = apiUrl + '/getSpecificOrganization?organizationID=' + organizationID;
        return $http.get(url);
      },
      deleteOrganization: function(organizationID){
        var url = apiUrl + '/deleteOrganization?organizationID=' + organizationID;
        return $http.get(url);
      },
      saveChangesToOrganizations: function(id, organization, type, city){
        var url = apiUrl + '/saveChangesToOrganizations?organizationID=' + id + '&organization=' + organization + '&type=' + type + '&city=' + city;
        return $http.get(url);
      },
      queryOrganization: function(selectedSearchTerm, searchTerm){
        var url = apiUrl + '/queryOrganization?selectedSearchTerm=' +selectedSearchTerm + '&searchTerm=' + searchTerm;
        return $http.get(url);
      },
      scrollDownOrganization: function(skipTerm){
        var url = apiUrl + '/scrollDownOrganization?skipTerm=' + skipTerm;
        return $http.get(url);
      },
    };
  }
