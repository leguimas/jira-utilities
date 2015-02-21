Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

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
	var transitions = [];
	transitions.push({ created: jiraData.fields.created, info: { fromString: "New", toString: "Open"} });

	var histories = jiraData.changelog.histories;
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
	
	return transitions;
}

jiraVsmHelper.calculateTransitionsTime = function(transitions) {
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

	return transitionsTime;
}

jiraVsmHelper.showStatusTransitions = function(transitions) {
	$('#historical-transition table tbody').html("");

	for (transition in transitions) {
		var timeInMilliseconds = transitions[transition];
		var timeInDays = timeInMilliseconds / (1000*60*60*24);
		var newRow = "<tr><td>" + transition + "</td><td>" + timeInDays.toFixedDown(2) + "</td></tr>"
		$('#historical-transition table tbody').append(newRow);
	}

	$('#historical-transition').show();
}

jiraVsmHelper.getTaskData = function(jiraURL, taskKey, username, password) {

	var jiraURLComplement = "/rest/api/2/issue/" + taskKey.toUpperCase() + "?expand=changelog";
	var jiraCompleteURL = jiraURL + jiraURLComplement;

	$.post('r/jira-api', { url: jiraCompleteURL, username: username, password: password}, 
		function(jiraData) {

			if (jiraData.errorMessages) {
				jiraVsmHelper.processErrorMessages(jiraData.errorMessages);
			} else { 
				$('#task-key-info').text(" - " + jiraData.key);

				var transitions = jiraVsmHelper.getStatusTransitions(jiraData);
				transitions = jiraVsmHelper.calculateTransitionsTime(transitions);
				jiraVsmHelper.showStatusTransitions(transitions);
			}
			
			$('#btnGetTaskData').button('reset');
	}).error(function(jqXHR, textStatus, errorThrown) {
		var errorMessages = []
		errorMessages.push("HTTP-" + jqXHR.status + ": " + errorThrown);
		jiraVsmHelper.processErrorMessages(errorMessages);
		$('#btnGetTaskData').button('reset');
	});
}