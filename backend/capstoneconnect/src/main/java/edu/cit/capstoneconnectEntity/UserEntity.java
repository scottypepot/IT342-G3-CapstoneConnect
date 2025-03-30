//package edu.cit.capstoneconnectEntity;
//
//
//import com.fasterxml.jackson.annotation.JsonManagedReference;
//import jakarta.persistence.*;
//import java.util.List;
//
//
//@Entity
//@Table(name = "users")
//public class UserEntity {
//	
//	@Id
//	@GeneratedValue(strategy = GenerationType.IDENTITY)
//	
//	private Integer userID;
//	private String name,password,email;
//	
//	public UserEntity() {}
//	
//	public UserEntity(String name, String password, String email) {
//		this.name = name; 
//		this.password = password;
//		this.email = email;
//	}
//	
//	public String getName() {
//		return name;
//	}
//	
//	public void setName(String name) {
//		this.name = name;
//	}
//	
//	public String getPassword() {
//		return password;
//	}
//	
//	public void setPassword(String password) {
//		this.password = password;
//	}
//	
//	public String getEmail() {
//		return email;
//	}
//	
//	public void setEmail(String email) {
//		this.email = email;
//	}
//	
//
//}