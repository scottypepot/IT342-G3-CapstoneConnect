package edu.cit.capstoneconnectController;

import edu.cit.capstoneconnectEntity.UserEntity;
import edu.cit.capstoneconnectService.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {
	private final UserService userService;
	public UserController(UserService userService) {
		this.userService = userService;
	}
	@GetMapping("/api/auth/user")
	public ResponseEntity<?> getAuthenticatedUser(@AuthenticationPrincipal OAuth2User oauth2User) {
		if (oauth2User != null) {
			String email = oauth2User.getAttribute("email");

			Optional<UserEntity> userEntity = userService.findByEmail(email);
			if (userEntity.isPresent()) {
				UserEntity user = userEntity.get();
				Map<String, Object> userData = new HashMap<>();
				userData.put("id", user.getId());
				userData.put("name", user.getName());
				userData.put("email", user.getEmail());
				userData.put("firstTimeUser", user.isFirstTimeUser());
				return ResponseEntity.ok(userData);
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
	}
	@PutMapping("/api/users/{id}/profile")
	public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
		try {
			Optional<UserEntity> userEntity = userService.findById(id);
			if (userEntity.isPresent()) {
				UserEntity user = userEntity.get();

				// Update user fields
				user.setName((String) updates.get("fullName"));
				user.setRole((String) updates.get("role"));
				user.setAbout((String) updates.get("about"));
				user.setSkills((List<String>) updates.get("skills"));
				user.setInterests((List<String>) updates.get("interests"));
				user.setGithubLink((String) updates.get("githubLink"));

				// Update profile picture - handle null/empty case
				String profilePicture = (String) updates.get("profilePicture");
				if (profilePicture != null && !profilePicture.isEmpty()) {
					user.setProfilePicture(profilePicture);
				} else {
					// Set default avatar if no profile picture is provided
					user.setProfilePicture("/uploads/default-avatar.png");
				}

				userService.save(user); // Save the updated user
				return ResponseEntity.ok(user);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
		}
	}
	@GetMapping("/api/users/{id}/profile")
	public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
		try {
			Optional<UserEntity> userEntity = userService.findById(id);
			if (userEntity.isPresent()) {
				UserEntity user = userEntity.get();
				Map<String, Object> profileData = new HashMap<>();
				profileData.put("fullName", user.getName());
				profileData.put("role", user.getRole());
				profileData.put("about", user.getAbout());
				profileData.put("skills", user.getSkills());
				profileData.put("interests", user.getInterests());
				profileData.put("githubLink", user.getGithubLink());

				// Fix the profilePicture URL
				String profilePicturePath = user.getProfilePicture();
				if (profilePicturePath == null || profilePicturePath.isEmpty()) {
					profilePicturePath = "/uploads/default-avatar.png"; // Default avatar
				} else if (!profilePicturePath.startsWith("http")) {
					profilePicturePath = "http://localhost:8080" + profilePicturePath;
				}
				profileData.put("profilePicture", profilePicturePath);

				return ResponseEntity.ok(profileData);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
		}
	}
}
