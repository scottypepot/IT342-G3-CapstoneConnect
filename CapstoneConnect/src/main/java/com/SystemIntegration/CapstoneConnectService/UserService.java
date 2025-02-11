package com.SystemIntegration.CapstoneConnectService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.SystemIntegration.CapstoneConnectEntity.UserEntity;
import com.SystemIntegration.CapstoneConnectRepository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	
	public Optional<UserEntity> getUserById(Integer id){
		return userRepository.findById(id);
	}
	
	public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
	public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }
}
