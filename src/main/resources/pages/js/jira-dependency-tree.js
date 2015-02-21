jiraDependencyTree = {};

jiraDependencyTree.getDependencies = function(jiraURL, projectID, username, password) {

	var jiraURLComplement = "/rest/api/2/search?";
	var jiraJQL = "jql=project=" + projectID.toUpperCase();

	var jiraCompleteURL = jiraURL + jiraURLComplement + jiraJQL;

	console.debug("Requesting " + jiraCompleteURL + " - " + username + ":" + password);

	$.ajax
	  ({
	    type: "GET",
	    url: jiraCompleteURL,
	    contentType:"application/json; charset=utf-8",
	    dataType: "jsonp",
	    async: false,
	    headers: {
	        "Authorization": "Basic " + btoa(username+ ":" + password)
	    },
	    success: function (jiraData){
	        console.log(jiraData);
	    },
	    error : function(xhr, errorText){
	        console.log('Error '+ xhr.responseText);
	    }
	});

	var tree = [
	  {
	    text: "Parent 1",
	    nodes: [
	      {
	        text: "Child 1",
	        nodes: [
	          {
	            text: "Grandchild 1"
	          },
	          {
	            text: "Grandchild 2"
	          }
	        ]
	      },
	      {
	        text: "Child 2"
	      }
	    ]
	  },
	  {
	    text: "Parent 2"
	  },
	  {
	    text: "Parent 3"
	  },
	  {
	    text: "Parent 4"
	  },
	  {
	    text: "Parent 5"
	  }
	];

	return tree;
}