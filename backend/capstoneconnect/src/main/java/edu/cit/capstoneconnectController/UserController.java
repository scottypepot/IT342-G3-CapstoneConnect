package edu.cit.capstoneconnectController;

import edu.cit.capstoneconnectEntity.UserEntity;
import edu.cit.capstoneconnectService.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
public class UserController {
	private final UserService userService;
	public UserController(UserService userService) {
		this.userService = userService;
	}
	@GetMapping("/api/auth/user")
	public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User oauth2User) {
		if (oauth2User != null) {
			String oauthId = oauth2User.getAttribute("oid");
			String email = oauth2User.getAttribute("email");
			String name = oauth2User.getAttribute("name");

			System.out.println("✅ Fetching user data: " + email);

			boolean isFirstTimeUser = userService.isFirstTimeUser(email);

			return ResponseEntity.ok("{\"email\": \"" + email + "\", \"name\": \"" + name + "\", \"firstTimeUser\": " + isFirstTimeUser + "}");
		}
		return ResponseEntity.status(401).body("{\"error\": \"User not authenticated\"}");
	}
}

