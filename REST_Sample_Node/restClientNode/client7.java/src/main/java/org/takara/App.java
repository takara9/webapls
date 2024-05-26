package org.takara;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.Feature;

import org.glassfish.jersey.client.authentication.HttpAuthenticationFeature;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.takara.Hash;


/**
 * Smaple REST Client 
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        System.out.println("Smaple REST Client");
    }

    // POST
    public static Hash restClientPost(String uri, String user, String password, String textbody) {
	final Client client = ClientBuilder.newClient();
	final WebTarget target = client
	    .target(uri)
	    .register( HttpAuthenticationFeature.basic(user, password));
	final Invocation.Builder builder = target.request();
	final Form form = new Form();
	form.param("textbody", textbody);
	final String returnValue = builder.post(Entity.form(form), String.class);
	try {
	    ObjectMapper mapper = new ObjectMapper();
	    Hash dto = mapper.readValue(returnValue, Hash.class);
	    return dto;
	}
	catch (Exception e) {
	    System.out.println(e);
	    return null;
	}
    }

    // GET
    public static String restClientGet(String uri) {
        final Client client = ClientBuilder.newClient();
        final WebTarget target = client.target(uri);
        final Invocation.Builder builder = target.request();
        final String responseString = builder.get(String.class);
	return responseString;
    }
}
