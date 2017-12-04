      angular.module('buttons',[])
        .controller('buttonCtrl',ButtonCtrl)
        .factory('buttonApi',buttonApi)
        .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

      function ButtonCtrl($scope,buttonApi){
         $scope.logOutClick=logOutClick;

         function logOutClick($event) {
           buttonApi.logOutClick()
            .success(function(data){
            })
            .error(function(){$scope.errorMessage="Unable click";});
         }
      }

      function buttonApi($http,apiUrl){
        return{
          //getting the buttons coordinates from till_buttons
          logOutClick: function(){
            var url = apiUrl + '/test';
            console.log("Attempting with "+url);
            return $http.get(url);
          }
          //deleting the specified record with the coresponding id

       };
      }
