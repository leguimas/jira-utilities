package br.com.leguimas.utilities.proxy;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

@Path("/jira-api")
public class JiraRestProxy {

	@POST
	@Produces("application/json;charset=utf-8")
	public Response invokeJiraAPI(@FormParam("url") String url,
			@FormParam("username") String username,
			@FormParam("password") String password) {

		Response result = null;

		CloseableHttpClient httpRequest = HttpClients.createDefault();

		try {
			try {
				HttpGet jiraRequest = new HttpGet(url);
				String basic_auth = new String(Base64.encodeBase64((username + ":" + password).getBytes()));
				jiraRequest.addHeader("Authorization", "Basic " + basic_auth);

				CloseableHttpResponse response = httpRequest.execute(jiraRequest);
				try {
					int statusCode = response.getStatusLine().getStatusCode();
					if (statusCode >= HttpStatus.SC_OK && statusCode < HttpStatus.SC_MULTIPLE_CHOICES) {
						result = Response.ok(EntityUtils.toString(response.getEntity())).build();
					} else {
						result = Response.status(statusCode).entity(response.getStatusLine().getReasonPhrase()).build();
					}
				} finally {
					response.close();
				}
			} catch (Exception ex) {
				throw new WebApplicationException(ex.getMessage());
			} finally {
				httpRequest.close();
			}
		} catch (Exception ex) {
			throw new WebApplicationException(ex.getMessage());
		}

		return result;
	}

}
