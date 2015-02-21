package br.com.leguimas.utilities.proxy;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class RestApplication extends Application {

	private Set<Object> singletons = new HashSet<Object>();

	public RestApplication() {
		singletons.add(new JiraRestProxy());
	}

	@Override
	public Set<Object> getSingletons() {
		return singletons;
	}

}
