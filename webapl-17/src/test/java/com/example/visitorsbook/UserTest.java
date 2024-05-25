package com.example.visitorsbook;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;
import org.junit.Test;

public class UserTest {

    User user = new User(9999, "test_name","test@labo.local","emacs");
    
	@Test
	public void ユニットテスト_user_getId() {
		assertThat(user.getId(), is(9999));
	}

    @Test
    public void ユニットテスト_user_getName() {
        assertThat(user.getName(), is("test_name"));
    }

    @Test
    public void ユニットテスト_user_getEmail() {
        assertThat(user.getEmail(), is("test@labo.local"));
    }

	@Test
    public void ユニットテスト_user_getPreference() {
        assertThat(user.getPreference(), is("emacs"));
    }

}
