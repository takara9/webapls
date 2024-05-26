package org.takara;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;
import org.takara.Hash;

/**
 * Unit test for simple App.
 */
public class AppTest extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public AppTest( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( AppTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }

    // GETのテスト
    public void testGet() {
	//String uri = "http://localhost:3000";
	String uri = "https://nodehashxx.mybluemix.net";
	String expect = "hello world";
	String result = App.restClientGet(uri);
	System.out.println("GET = " + result);
        assertEquals(expect,result);
    }

    // POSTのテスト
    public void testPost() {
	//String uri = "http://localhost:3000/hash";
	String uri = "https://nodehashxx.mybluemix.net/hash";
	String textbody = "Hello World";
	String user = "takara";
	String password = "hogehoge";
	Hash result = App.restClientPost(uri, user, password, textbody);
	System.out.println("POST");
	System.out.println("md5    = " + result.md5);
	System.out.println("sha1   = " + result.sha1);
	System.out.println("sha256 = " + result.sha256);

	assertNotNull("should not be null", result);
    }


}
