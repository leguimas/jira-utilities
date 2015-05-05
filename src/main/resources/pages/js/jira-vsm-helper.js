jiraVsmHelper = {};

jiraVsmHelper.processErrorMessages = function(errorMessages) {
	var message = "";
	for (var i=0; i < errorMessages.length; i++) {
		message += errorMessages[i] + ". ";
	}

	$("#message-info").hide();
	$('#message-error').text(message);
	$('#message-error').show();
}

jiraVsmHelper.getStatusTransitions = function(jiraData) {
	var stories = [];
	for (var s=0; s < jiraData.issues.length; s++) {
		var story = jiraData.issues[s];
		
		var transitions = [];
		transitions.push({ created: story.fields.created, info: { fromString: "New", toString: "Open"} });
	
		var histories = story.changelog.histories;
		for (var i=0; i < histories.length; i++) {
			var history = histories[i];
			for (var x=0; x < history.items.length; x++) {
				var historyItem = history.items[x];
				if (historyItem.field == "status") {
					var newTransition = { created: history.created, info: historyItem };
					transitions.push(newTransition);
				}
			}
		}

		var storyObject = { 'key': story.key, 'status': story.fields.status.name, 'summary': story.fields.summary };
		stories.push({'story': storyObject, 'transitions': transitions});
	}
	
	return stories;
}

jiraVsmHelper.calculateTransitionsTime = function(stories) {
	for (var s=0; s < stories.length; s++) {
		var story = stories[s];
		var transitions = story.transitions;
	
		var transitionsTime = [];
		var statusName = transitions[0].info.toString;
		transitionsTime[statusName] = 0;
		var lastStatusDate = new Date(transitions[0].created);
	
		if (transitions.length > 1) {
			for (var i=1; i < transitions.length; i++) {
				var transition = transitions[i];
				var currentStatusDate = new Date(transition.created);
	
				var transitionTimeInMilliseconds = currentStatusDate - lastStatusDate;
				statusName = transition.info.fromString;
	
				if (transitionsTime[statusName] == null) {
					transitionsTime[statusName] = 0;
				}
				transitionsTime[statusName] += transitionTimeInMilliseconds;
	
				lastStatusDate = currentStatusDate;
			}
		}

		story.transitionsTime = transitionsTime;
	}

	return stories;
}

jiraVsmHelper.showStatusTransitions = function(stories) {
	$('#tasks-transitions-time').html("");

	for (var i=0; i < stories.length; i++) {
		var story = stories[i].story;
		var transitions = stories[i].transitionsTime;

		var html = '<div class="row"><div class="col-sm-12"><div class="panel panel-default" id="historical-transition"><div class="panel-heading"><h3 class="panel-title"><span id="task-key-info">';
		html = html.concat(story.key + ': ' + story.summary);
		html = html.concat('</span></h3></div><div class="panel-body"><table class="table table-stripped"><thead><tr><th>Status</th><th>Duration (days)</th><th>Duration (hours)</th></tr></thead><tbody>');
	
		var totalInHours = 0;
		var totalInDays = 0;
	
		for (transition in transitions) {
			var timeInMilliseconds = transitions[transition];
			var timeInHours = timeInMilliseconds / (1000*60*60);
			var timeInDays = timeInMilliseconds / (1000*60*60*24);
			html = html.concat("<tr><td>" + transition + "</td><td>" + Number(timeInDays).toFixed(2) + "</td><td>" + Number(timeInHours).toFixed(2) + "</td></tr>");
	
			totalInHours += timeInHours;
			totalInDays += timeInDays;
		}
	
		html = html.concat("<tr><th> TOTAL </th><th>" + Number(totalInDays).toFixed(2) + "</th><th>" + Number(totalInHours).toFixed(2) + "</th></tr>");
		html = html.concat('</tbody></table></div></div></div></div>');
		
		$('#tasks-transitions-time').append(html);
	}
}

jiraVsmHelper.getData = function(jiraURL, jql, username, password) {

	var jiraURLComplement = "/rest/api/2/search?jql=" + escape(jql) + "&expand=changelog";
	var jiraCompleteURL = jiraURL + jiraURLComplement;

	$.post('r/jira-api', { url: jiraCompleteURL, username: username, password: password}, 
		function(jiraData) {

			if (jiraData.errorMessages) {
				jiraVsmHelper.processErrorMessages(jiraData.errorMessages);
			} else { 
				$('#task-key-info').text(" - " + jiraData.key);

				var stories = jiraVsmHelper.getStatusTransitions(jiraData);
				stories = jiraVsmHelper.calculateTransitionsTime(stories);
				jiraVsmHelper.showStatusTransitions(stories);
			}
			
			$('#btnGetData').button('reset');
	}).error(function(jqXHR, textStatus, errorThrown) {
		var errorMessages = []
		errorMessages.push("HTTP-" + jqXHR.status + ": " + errorThrown);
		jiraVsmHelper.processErrorMessages(errorMessages);
		$('#btnGetData').button('reset');
	});
}