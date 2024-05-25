package com.example.visitorsbook;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@RestController
public class UserController {


	@Autowired
    private UserRepository userRepository;
    @CrossOrigin(origins = "http://localhost:8080")


   	@PostMapping("/user")
	User addUser(@RequestBody User user) {
	    System.out.println("==== post add user ==== ");
	    return userRepository.save(user);
	}

    @GetMapping(path="/users")
    public @ResponseBody Iterable<User> getAllUsers() {
	    System.out.println("==== get all user ==== ");
        return userRepository.findAll();
    }    

    @GetMapping("/user/{id}")
    Optional<User> getUser(@PathVariable Integer id) {
    	Optional<User> user = userRepository.findById(id);
    	return user;
    }

    @DeleteMapping("/user/{id}")
    void delUser(@PathVariable Integer id) {
    	userRepository.deleteById(id);
    }

}
