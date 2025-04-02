//package edu.cit.capstoneconnectService;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import edu.cit.capstoneconnectEntity.UserEntity;
//import edu.cit.capstoneconnectRepository.UserRepository;
//
//
//@Service
//public class UserService {
//	
//	@Autowired
//	private UserRepository userRepository;
//	
//	
//	public Optional<UserEntity> getUserById(Integer id){
//		return userRepository.findById(id);
//	}
//	
//	public boolean emailExists(String email) {
//        return userRepository.findByEmail(email).isPresent();
//    }
//	public UserEntity createUser(UserEntity user) {
//        return userRepository.save(user);
//    }
//}