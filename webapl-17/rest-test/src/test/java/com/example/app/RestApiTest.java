//package com.example.app;
package com.example.visitorsbook.it;

import org.junit.Test;
import static org.hamcrest.CoreMatchers.*; 
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.*;


import java.io.*;
import java.util.*;

import org.apache.http.*;
import org.apache.http.client.*;
import org.apache.http.client.methods.*;
import org.apache.http.message.*;
import org.apache.http.util.*;
import org.apache.http.entity.*;
import org.apache.http.client.entity.*;
import org.apache.http.impl.client.*;

import org.json.simple.*;
import org.json.simple.parser.*;

public class RestApiTest
{

    //private String url = "http://webapl-17.test.k8s4.labo.local";
	private String url = "https://ingress.k8s4.labo.local/";
    private String user_data = "{ \"name\": \"広瀬 アリス\", \"email\": \"alice@labo.local\", \"preference\": \"emacs\"}";
    private String[] users = {
	"{ \"name\": \"広瀬 アリス\", \"email\": \"alice@labo.local\", \"preference\": \"emacs\"}",
	"{ \"name\": \"広瀬 すず\",   \"email\": \"suzu@labo.local\", \"preference\": \"emacs\"}",
	"{ \"name\": \"吉岡 里帆\",   \"email\": \"riho@labo.local\", \"preference\": \"emacs\"}"
    };

    
    
    /*
       ダミーテスト
    */
    @Test
    public void test0()
    {
	assertTrue( true );
    }

    /*
       ユーザー登録のテスト
     */
    @Test
    public void IT1_ユーザー登録_test1() throws ClientProtocolException, IOException, Exception {
	System.out.println("---------------- test1");
	long uid;

	// セットアップ
	CloseableHttpClient client = HttpClients.createDefault();
	HttpPost httpPost = new HttpPost(url + "/user");
	httpPost.addHeader("content-type", "application/json; charset=utf-8");
        //httpPost.addHeader("X-Auth-Key", "token123");

	// データ準備
	//String testData = user_data;
	//	httpPost.setEntity(new StringEntity(testData,"UTF-8"));
	httpPost.setEntity(new StringEntity(users[0],"UTF-8"));	

	// 送信と応答
	CloseableHttpResponse response = client.execute(httpPost);

	// 応答の評価
	assertThat(response.getStatusLine().getStatusCode(), equalTo(200));

	// レスポンス取得
	HttpEntity entity = response.getEntity();
	String respString = EntityUtils.toString(entity,"UTF-8");
	System.out.println("応答JSON = " + respString);
	
	// 登録IDの取得 IDが取れていることの評価
	JSONParser parser = new JSONParser();
	JSONObject json = (JSONObject) parser.parse(respString);
	System.out.println("*** UID = " + json.get("id"));
	uid = (long) json.get("id");
	assertNotEquals((long)uid, (long)-1);

	client.close();
    }

    
    /*
       ユーザーの登録リストと削除
     */

    @Test 
    public void IT2_リスト削除_test2() throws Exception {
	long uid;
	System.out.println("---------------- test2");
	// リスト取得
	CloseableHttpClient client = HttpClients.createDefault();	
        HttpGet request = new HttpGet(url + "/users");
        HttpResponse response = client.execute(request);
        BufferedReader rd = new BufferedReader (new InputStreamReader(response.getEntity().getContent()));
	String buff = rd.readLine();
	JSONParser parser = new JSONParser();
	JSONArray jsons = (JSONArray) parser.parse(buff);

	for (int i = 0; i < jsons.size(); i++) {
	  JSONObject json = (JSONObject) jsons.get(i);
	  System.out.println(json);	    
	}
	client.close();

	int i;
	for (i = 0; i < jsons.size(); i++) {
	    CloseableHttpClient client2 = HttpClients.createDefault();		    
	    JSONObject json = (JSONObject) jsons.get(i);
	    uid = (long) json.get("id");
	    // 削除
	    HttpDelete request2 = new HttpDelete(url + "/user/" + String.valueOf(uid));
	    HttpResponse response2 = client2.execute(request2);
	    // 応答の評価
	    assertThat(response2.getStatusLine().getStatusCode(), equalTo(200));
	    client2.close();	    
	}
	System.out.println("oop i = " + i);
	assertNotEquals((long)i, (long)0);

    }


    @Test
    public void IT3_登録と番号指定取得_test3() throws ClientProtocolException, IOException, Exception {

	long uid;
	System.out.println("---------------- test3");
	// セットアップ
	CloseableHttpClient client = HttpClients.createDefault();
	HttpPost httpPost = new HttpPost(url + "/user");
	httpPost.addHeader("content-type", "application/json; charset=utf-8");
	// データ準備
	//String testData = "{ \"name\": \"吉岡 里帆\", \"email\": \"riho@labo.local\", \"preference\": \"vi\"}";
	//httpPost.setEntity(new StringEntity(testData,"UTF-8"));
	httpPost.setEntity(new StringEntity(users[2],"UTF-8"));
	// 送信と応答
	CloseableHttpResponse response = client.execute(httpPost);
	// 応答の評価
	assertThat(response.getStatusLine().getStatusCode(), equalTo(200));
	// レスポンス取得
	HttpEntity entity = response.getEntity();
	String respString = EntityUtils.toString(entity, "UTF-8");
	System.out.println("応答JSON = " + respString);
	// 登録IDの取得 IDが取れていることの評価
	JSONParser parser = new JSONParser();
	JSONObject json = (JSONObject) parser.parse(respString);
	System.out.println("*** UID = " + json.get("id"));
	uid = (long) json.get("id");
	assertNotEquals(uid, -1);
	client.close();


	CloseableHttpClient client2 = HttpClients.createDefault();
        HttpGet request2 = new HttpGet( url + "/user/" + String.valueOf(uid));
        HttpResponse response2 = client2.execute(request2);
        BufferedReader rd2 = new BufferedReader (new InputStreamReader(response2.getEntity().getContent()));
        String line2 = null;
	System.out.println("--------");
	JSONParser parser2 = new JSONParser(); 	
        while ((line2 = rd2.readLine()) != null) {
	    System.out.println("=== LN " + line2);
	    JSONObject json2 = (JSONObject) parser2.parse(line2);
	    assertThat(String.valueOf(json2.get("name")), is("吉岡 里帆"));
	    System.out.println("ID " + json2.get("id"));
	    System.out.println("NM " + json2.get("name"));
	    System.out.println("EM " + json2.get("email"));
	    System.out.println("ED " + json2.get("preference"));
        }
	client2.close();
    }
}
