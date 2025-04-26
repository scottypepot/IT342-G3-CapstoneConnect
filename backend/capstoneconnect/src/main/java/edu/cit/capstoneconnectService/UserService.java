package edu.cit.capstoneconnectService;

import edu.cit.capstoneconnectEntity.UserEntity;
import edu.cit.capstoneconnectMatch.Match;
import edu.cit.capstoneconnectRepository.UserRepository;
import edu.cit.capstoneconnectRepository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    @Autowired
    public UserService(UserRepository userRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
    }

    public Optional<UserEntity> findByOauthId(String oauthId) {
        return userRepository.findByOauthId(oauthId);
    }
    public Optional<UserEntity> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<UserEntity> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    @Transactional
    public UserEntity save(UserEntity user) {
        return userRepository.save(user); // Delegate save operation to UserRepository
    }
    @Transactional
    public boolean saveUserIfNotExists(String oauthId, String email, String name) {
        System.out.println("🔍 Debug: oauthId=" + oauthId + ", email=" + email + ", name=" + name);

        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

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

    @Transactional
    public UserEntity updateUserProfile(Long userId, UserEntity updatedUser) {
        Optional<UserEntity> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();
            user.setName(updatedUser.getName());
            user.setRole(updatedUser.getRole());
            user.setAbout(updatedUser.getAbout());
            user.setSkills(updatedUser.getSkills());
            user.setInterests(updatedUser.getInterests());
            user.setGithubLink(updatedUser.getGithubLink());
            user.setProfilePicture(updatedUser.getProfilePicture());
            return userRepository.save(user);
        }
        throw new RuntimeException("User not found");
    }

    @Transactional
    public void updateFirstTimeUserStatus(Long userId, boolean isFirstTimeUser) {
        Optional<UserEntity> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            UserEntity user = existingUser.get();
            user.setFirstTimeUser(isFirstTimeUser);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Transactional
    public void saveMatch(Match match) {
        matchRepository.save(match);
    }

    public List<UserEntity> findAll() {
        return userRepository.findAll();
    }

    public Optional<Match> findMatchById(Long matchId) {
        return matchRepository.findById(matchId);
    }

    public Optional<Match> findMatchBetweenUsers(Long userId1, Long userId2) {
        return matchRepository.findByUserIdAndMatchedUserId(userId1, userId2);
    }

    public List<Match> findUserMatches(Long userId) {
        return matchRepository.findMatchesByUserId(userId);
    }

    @Transactional
    public void deleteMatch(Long matchId) {
        Optional<Match> match = matchRepository.findById(matchId);
        if (match.isPresent()) {
            matchRepository.delete(match.get());
        } else {
            throw new RuntimeException("Match not found");
        }
    }
}
