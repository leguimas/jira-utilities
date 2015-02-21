package br.com.leguimas.utilities.proxy;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.log.Log;
import org.eclipse.jetty.util.log.Logger;
import org.eclipse.jetty.webapp.WebAppContext;

public class WebServer {

	private static final Logger LOG = Log.getLogger(WebServer.class);

	public static void main(String[] args) throws Exception {
		int serverPort = args.length == 0 ? 8080 : Integer.parseInt(args[0]);
		Server server = new Server(serverPort);

		WebAppContext webApp = new WebAppContext();

		webApp.setDescriptor(WebServer.class.getClassLoader()
				.getResource("WEB-INF/web.xml").toExternalForm());
		webApp.setResourceBase(WebServer.class.getClassLoader()
				.getResource("pages").toExternalForm());
		webApp.setContextPath("/jira-utilities");
		webApp.setParentLoaderPriority(true);

		server.setHandler(webApp);
		server.start();

		LOG.debug("The server has started at port " + serverPort + ".");

		LOG.info("");
		LOG.info("+---------------------------------------------------------------------------------------------------------+");
		LOG.info("|                                           J I R A    P R O X Y                                          |");
		LOG.info("+---------------------------------------------------------------------------------------------------------+");
		LOG.info("");
		LOG.info(" Welcome to the JIRA UTILITIES. The server is online. Go to http://localhost:8080/jira-utilities to access the utilities.");
		LOG.info("");

		server.join();
	}

}
