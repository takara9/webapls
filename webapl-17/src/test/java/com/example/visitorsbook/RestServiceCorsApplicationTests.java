package com.example.visitorsbook;

//import org.junit.Test;
//import static org.hamcrest.CoreMatchers.*;
//import static org.junit.Assert.*;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = RestServiceCorsApplication.class)
public class RestServiceCorsApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    // トップページは単独て表示可能なため、成功しなければならない。
    @Test
    public void ブラウザアクセス_トップページ() throws Exception {
	     mockMvc.perform(get("/"))
	       .andExpect(status().is2xxSuccessful());
    }

    // テストの状態ではDBへの接続が無いため、エラーが発生することが期待値
    // ユニットテストの範囲外として、統合テストの項目として処理する
    @Test
    public void モック_ビジターリスト() throws Exception {
	mockMvc.perform(get("/users"))
		.andExpect(status().is4xxClientError());
    }

    // テストの状態ではDBへの接続が無いため、エラーが発生することが期待値
    // ユニットテストの範囲外として、統合テストの項目として処理する
    @Test
    public void モック_ビジター情報() throws Exception {
	mockMvc.perform(get("/user"))
	    .andExpect(status().is4xxClientError());
    }
  
}
