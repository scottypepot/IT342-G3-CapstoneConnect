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
    public UserEntity saveUserIfNotExists(String oauthId, String email, String name) {
        Optional<UserEntity> existingUser = userRepository.findByOauthId(oauthId);
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        if (email != null && !email.isEmpty()) {
            existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                UserEntity user = existingUser.get();
                if (user.getOauthId() == null) {
                    user.setOauthId(oauthId);
                    userRepository.saveAndFlush(user);
                }
                return user;
            }
        }

        return userRepository.saveAndFlush(new UserEntity(oauthId, email, name));
    }

    public boolean isFirstTimeUser(String email) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(email);
        return existingUser.isEmpty(); // If no user exists, return true
    }
}
