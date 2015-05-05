# jira-utilities
JIRA Utilities provides you a proxy for the JIRA REST API (you can extract all the information that you need with a simple JavaScript) and some useful tools that help you to visualize some JIRA data.

# disclaimer
I'm not a big JavaScript expert. I have implemented this quickly to help me at my work. So there are a lot of points to improve the code. If you want to help me, you'll be welcome! :)

## how to use
Download the [jira-utilities jar file](https://github.com/leguimas/jira-utilities/tree/master/dist) and run it:
`java -jar jira-utilities-1.1.0.jar`

You have to use a JRE 1.7 or higher. After that, open a internet browser and go to [http://localhost:8080/jira-utilities](http://localhost:8080/jira-utilities).

## utilities

### JIRA API Proxy
JIRA Utilities provides to you a proxy for the JIRA REST API. Actually, JIRA REST API doesn't support CORS or JSONP so you can't use a simple JavaScript to get JIRA data. Using this proxy, it's possible. You just need to do a POST request to [http://localhost:8080/jira-utilities/r/jira-api](http://localhost:8080/jira-utilities/r/jira-api) send as a POST parameters your username, your password and the [JIRA URL API that](https://docs.atlassian.com/jira/REST/latest/) you want to access.

### VSM Helper
Extract the information about the stories transition. It should be helpful if you want to make a Value Stream Mapping (VSM).

### Dependency Tree
Visualize the dependencies between the JIRA stories as a tree. It's under construction.
