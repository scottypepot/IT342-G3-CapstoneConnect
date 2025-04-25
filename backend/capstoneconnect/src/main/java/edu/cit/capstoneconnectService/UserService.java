package edu.cit.capstoneconnectService;

import edu.cit.capstoneconnectEntity.UserEntity;
import edu.cit.capstoneconnectRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean saveUserIfNotExists(String oauthId, String email, String name) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);
        System.out.println("🔍 Checking database before saving - Exists? " + existingUser.isPresent());

        if (existingUser.isPresent()) {
            System.out.println("✅ User already exists: " + email);
            return false; // Not a first-time user
        }

        System.out.println("🚀 Creating new user in database: " + email);
        UserEntity newUser = new UserEntity(oauthId, email, name);
        userRepository.saveAndFlush(newUser);

        System.out.println("✅ User saved successfully: " + email);
        return true; // First-time user
    }


    public boolean isFirstTimeUser(String email) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);

        boolean isFirstTime = existingUser.isEmpty();
        System.out.println("🚀 First-time user check for " + email + " → " + isFirstTime);

        return isFirstTime;
    }
}
