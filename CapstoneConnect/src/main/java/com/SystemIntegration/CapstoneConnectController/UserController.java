package com.SystemIntegration.CapstoneConnectController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.SystemIntegration.CapstoneConnectEntity.UserEntity;
import com.SystemIntegration.CapstoneConnectService.UserService;

@RestController
@RequestMapping("api/users")
public class UserController {

	 @Autowired
	 private UserService userService;
	 
	 @PostMapping
	    public ResponseEntity<Object> createUser(@RequestBody UserEntity user) {
	        if (userService.emailExists(user.getEmail())) {
	            return ResponseEntity.status(HttpStatus.CONFLICT)
	                    .body(Collections.singletonMap("message", "Email already exists"));
	        }

	        UserEntity savedUser = userService.createUser(user);

	        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	    }
	 
	@GetMapping("/{id}")
	public ResponseEntity<Object> getUserById(@PathVariable Integer Id){
		Optional<UserEntity> user = userService.getUserById(Id);
		
		if(user.isPresent()) {
			return ResponseEntity.ok(user.get());
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
		}
	}

	
}
