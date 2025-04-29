package edu.cit.capstoneconnectController;

import edu.cit.capstoneconnectEntity.UserEntity;
import edu.cit.capstoneconnectMatch.Match;
import edu.cit.capstoneconnectMatch.Message;
import edu.cit.capstoneconnectService.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import edu.cit.capstoneconnectEntity.FileAttachment;
import edu.cit.capstoneconnectRepository.FileAttachmentRepository;
import java.time.LocalDateTime;
import java.util.Calendar;

@RestController
@CrossOrigin(origins = "${FRONTEND_URL}", allowCredentials = "true")
public class UserController {
	private final UserService userService;
	@Autowired
	private FileAttachmentRepository fileAttachmentRepository;

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
					profilePicturePath = "/uploads/default-avatar.png";
				} else if (!profilePicturePath.startsWith("http")) {
					profilePicturePath = System.getenv("BACKEND_URL") + profilePicturePath;
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
	@GetMapping("/api/users/{id}/potential-matches")
	public ResponseEntity<?> getPotentialMatches(@PathVariable Long id) {
		try {
			// Get the current user
			Optional<UserEntity> currentUserOpt = userService.findById(id);
			if (!currentUserOpt.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}

			UserEntity currentUser = currentUserOpt.get();
			List<String> currentUserSkills = currentUser.getSkills();
			List<String> currentUserInterests = currentUser.getInterests();

			// Get all other users
			List<UserEntity> allUsers = userService.findAll();
			List<Map<String, Object>> potentialMatches = new ArrayList<>();
			Date now = new Date();

			for (UserEntity user : allUsers) {
				// Skip the current user
				if (user.getId().equals(id)) {
					continue;
				}

				// Check for existing match and filter by status/cooldown
				Optional<Match> matchOpt = userService.findMatchBetweenUsers(id, user.getId());
				if (matchOpt.isPresent()) {
					Match match = matchOpt.get();
					if ((match.getStatus() == Match.MatchStatus.PASSED || match.getStatus() == Match.MatchStatus.REJECTED)
							&& match.getCooldownUntil() != null && match.getCooldownUntil().after(now)) {
						continue; // skip due to cooldown
					}
					if (match.getStatus() == Match.MatchStatus.ACCEPTED) {
						continue; // skip accepted
					}
				}

				// Calculate match score based on skills and interests
				List<String> userSkills = user.getSkills();
				List<String> userInterests = user.getInterests();

				// Count matching skills and interests
				long matchingSkills = currentUserSkills.stream()
					.filter(userSkills::contains)
					.count();
				long matchingInterests = currentUserInterests.stream()
					.filter(userInterests::contains)
					.count();

				// Calculate match score (you can adjust the weights)
				double matchScore = (matchingSkills * 0.6) + (matchingInterests * 0.4);

				// Only include users with some level of match
				if (matchScore > 0) {
					Map<String, Object> matchData = new HashMap<>();
					matchData.put("id", user.getId());
					matchData.put("fullName", user.getName());
					matchData.put("role", user.getRole());
					matchData.put("about", user.getAbout());
					matchData.put("skills", user.getSkills());
					matchData.put("interests", user.getInterests());
					matchData.put("githubLink", user.getGithubLink());
					matchData.put("matchScore", matchScore);

					// Fix the profilePicture URL
					String profilePicturePath = user.getProfilePicture();
					if (profilePicturePath == null || profilePicturePath.isEmpty()) {
						profilePicturePath = "/uploads/default-avatar.png";
					} else if (!profilePicturePath.startsWith("http")) {
						profilePicturePath = "http://localhost:8080" + profilePicturePath;
					}
					matchData.put("profilePicture", profilePicturePath);

					potentialMatches.add(matchData);
				}
			}

			// Sort matches by match score in descending order
			potentialMatches.sort((a, b) ->
				Double.compare((double) b.get("matchScore"), (double) a.get("matchScore")));

			return ResponseEntity.ok(potentialMatches);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
		}
	}
	@PutMapping("/api/users/{id}/first-time")
	public ResponseEntity<?> updateFirstTimeUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> request) {
		try {
			userService.updateFirstTimeUserStatus(id, request.get("firstTimeUser"));
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
		}
	}
	@PostMapping("/api/users/{userId}/matches")
	public ResponseEntity<?> saveMatch(@PathVariable Long userId, @RequestBody Map<String, Long> matchRequest) {
		try {
			Long matchedUserId = matchRequest.get("matchedUserId");
			if (matchedUserId == null) {
				return ResponseEntity.badRequest().body("Matched user ID is required");
			}

			UserEntity user = userService.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
			UserEntity matchedUser = userService.findById(matchedUserId)
				.orElseThrow(() -> new RuntimeException("Matched user not found"));

			// Check if match already exists
			Optional<Match> existingMatch = userService.findMatchBetweenUsers(userId, matchedUserId);
			if (existingMatch.isPresent()) {
				return ResponseEntity.ok().body("Match already exists");
			}

			// Create new match
			Match match = new Match();
			match.setUser(user);
			match.setMatchedUser(matchedUser);
			match.setMatchDate(new Date());
			match.setStatus(Match.MatchStatus.PENDING);

			// Add initial connection request message
			Message initialMessage = new Message(
				"👋 Hey! Would love to connect and collaborate - no pressure, just good ideas and good vibes. Let's build something awesome! ✨",
				user
			);
			match.addMessage(initialMessage);

			userService.saveMatch(match);

			Map<String, Object> response = new HashMap<>();
			response.put("matchId", match.getId());
			response.put("status", "pending");
			response.put("message", "Connection request sent successfully");

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error saving match: " + e.getMessage());
		}
	}
	@GetMapping("/api/users/{userId}/matches")
	public ResponseEntity<?> getUserMatches(@PathVariable Long userId) {
		try {
			UserEntity user = userService.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

			List<Match> matches = userService.findUserMatches(userId);
			List<Map<String, Object>> matchesData = matches.stream()
				.map(match -> {
					Map<String, Object> matchData = new HashMap<>();
					UserEntity otherUser = match.getUser().getId().equals(userId) 
						? match.getMatchedUser() 
						: match.getUser();

					matchData.put("matchId", match.getId());
					matchData.put("userId", otherUser.getId());
					matchData.put("name", otherUser.getName());
					matchData.put("profilePicture", otherUser.getProfilePicture());
					matchData.put("role", otherUser.getRole());
					matchData.put("status", match.getStatus());
					matchData.put("matchDate", match.getMatchDate());
					matchData.put("lastMessage", getLastMessage(match));
					matchData.put("unreadCount", getUnreadMessageCount(match, userId));

					return matchData;
				})
				.collect(Collectors.toList());

			return ResponseEntity.ok(matchesData);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error fetching matches: " + e.getMessage());
		}
	}
	@PutMapping("/api/matches/{matchId}/status")
	public ResponseEntity<?> updateMatchStatus(
			@PathVariable Long matchId,
			@RequestBody Map<String, String> statusUpdate) {
		try {
			Match match = userService.findMatchById(matchId)
				.orElseThrow(() -> new RuntimeException("Match not found"));

			Match.MatchStatus newStatus = Match.MatchStatus.valueOf(statusUpdate.get("status").toUpperCase());
			match.setStatus(newStatus);

			// Set cooldowns for PASSED and REJECTED
			Calendar cal = Calendar.getInstance();
			if (newStatus == Match.MatchStatus.PASSED) {
				cal.add(Calendar.HOUR, 3);
				match.setCooldownUntil(cal.getTime());
			} else if (newStatus == Match.MatchStatus.REJECTED) {
				cal.add(Calendar.HOUR, 1);
				match.setCooldownUntil(cal.getTime());
			} else {
				match.setCooldownUntil(null);
			}

			// Get the user who initiated the status change
			UserEntity actionUser = match.getMatchedUser(); // Default to matchedUser
			if (statusUpdate.containsKey("userId")) {
				Long actionUserId = Long.parseLong(statusUpdate.get("userId"));
				if (match.getUser().getId().equals(actionUserId)) {
					actionUser = match.getUser();
				}
			}

			// Add appropriate message based on the new status
			if (newStatus == Match.MatchStatus.REJECTED) {
				Message rejectionMessage = new Message(
					actionUser.getName() + " declined your collaboration request. Wish you luck!",
					actionUser
				);
				match.addMessage(rejectionMessage);
			} else if (newStatus == Match.MatchStatus.ACCEPTED) {
				Message acceptanceMessage = new Message(
					"🎉 " + actionUser.getName() + " accepted your collaboration request! You can now start messaging each other.🎉 ",
					actionUser
				);
				match.addMessage(acceptanceMessage);
			}

			userService.saveMatch(match);
			return ResponseEntity.ok().body("Match status updated successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error updating match status: " + e.getMessage());
		}
	}
	@PostMapping("/api/matches/{matchId}/messages")
	public ResponseEntity<?> sendMessage(
			@PathVariable Long matchId,
			@RequestBody Map<String, Object> messageRequest) {
		try {
			Match match = userService.findMatchById(matchId)
				.orElseThrow(() -> new RuntimeException("Match not found"));

			if (match.getStatus() != Match.MatchStatus.ACCEPTED) {
				return ResponseEntity.badRequest()
					.body("Cannot send messages until the match is accepted");
			}

			UserEntity sender = userService.findById(Long.parseLong(messageRequest.get("senderId").toString()))
				.orElseThrow(() -> new RuntimeException("Sender not found"));

			Message message = new Message(messageRequest.get("content").toString(), sender);
			message.setMatch(match);

			// If this is a file message, associate the attachment
			if (messageRequest.containsKey("attachmentId")) {
				Long attachmentId = Long.parseLong(messageRequest.get("attachmentId").toString());
				FileAttachment attachment = fileAttachmentRepository.findById(attachmentId)
					.orElseThrow(() -> new RuntimeException("Attachment not found"));
				message.addAttachment(attachment);
			}

			match.addMessage(message);
			userService.saveMatch(match);

			return ResponseEntity.ok().body("Message sent successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error sending message: " + e.getMessage());
		}
	}
	@GetMapping("/api/matches/{matchId}/messages")
	public ResponseEntity<?> getMessages(@PathVariable Long matchId, @RequestParam Long userId) {
		try {
			Match match = userService.findMatchById(matchId)
				.orElseThrow(() -> new RuntimeException("Match not found"));

			List<Map<String, Object>> messages = match.getMessages().stream()
				.map(message -> {
					Map<String, Object> messageData = new HashMap<>();
					messageData.put("id", message.getId());
					messageData.put("content", message.getContent());
					messageData.put("senderId", message.getSender().getId());
					messageData.put("senderName", message.getSender().getName());
					messageData.put("timestamp", message.getTimestamp());
					messageData.put("isRead", message.isRead());

					// Add attachments data if present
					if (!message.getAttachments().isEmpty()) {
						List<Map<String, Object>> attachmentsData = message.getAttachments().stream()
							.map(attachment -> {
								Map<String, Object> attachmentData = new HashMap<>();
								attachmentData.put("id", attachment.getId());
								attachmentData.put("fileName", attachment.getFileName());
								attachmentData.put("fileUrl", attachment.getFileUrl());
								attachmentData.put("contentType", attachment.getContentType());
								attachmentData.put("fileSize", attachment.getFileSize());
								return attachmentData;
							})
							.collect(Collectors.toList());
						messageData.put("attachments", attachmentsData);
					}

					return messageData;
				})
				.collect(Collectors.toList());

			// Mark messages as read
			match.getMessages().stream()
				.filter(message -> !message.getSender().getId().equals(userId) && !message.isRead())
				.forEach(message -> message.setRead(true));
			userService.saveMatch(match);

			return ResponseEntity.ok(messages);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error fetching messages: " + e.getMessage());
		}
	}
	private Map<String, Object> getLastMessage(Match match) {
		if (match.getMessages().isEmpty()) {
			return null;
		}
		Message lastMessage = match.getMessages().get(match.getMessages().size() - 1);
		Map<String, Object> messageData = new HashMap<>();
		messageData.put("content", lastMessage.getContent());
		messageData.put("timestamp", lastMessage.getTimestamp());
		messageData.put("senderId", lastMessage.getSender().getId());
		return messageData;
	}
	private int getUnreadMessageCount(Match match, Long userId) {
		return (int) match.getMessages().stream()
			.filter(message -> !message.getSender().getId().equals(userId) && !message.isRead())
			.count();
	}
	@DeleteMapping("/api/matches/{matchId}")
	public ResponseEntity<?> deleteMatch(@PathVariable Long matchId) {
		try {
			userService.deleteMatch(matchId);
			return ResponseEntity.ok().body("Match deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error deleting match: " + e.getMessage());
		}
	}
	@GetMapping("/uploads/{fileName}")
	public ResponseEntity<Resource> serveFile(
			@PathVariable String fileName,
			@RequestParam(required = false) boolean view) {
		try {
			Path projectRoot = Paths.get(System.getProperty("user.dir"));
			Path filePath = projectRoot.resolve("uploads").resolve(fileName);
			Resource resource = new UrlResource(filePath.toUri());

			if (resource.exists() || resource.isReadable()) {
				// Determine content type
				String contentType = Files.probeContentType(filePath);
				boolean isImage = contentType != null && contentType.startsWith("image/");

				if (view && isImage) {
					// For images when viewing, send with content-type for browser display
					return ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_TYPE, contentType)
						.body(resource);
				} else {
					// For downloads or non-images, send as attachment
					return ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
						.body(resource);
				}
			} else {
				throw new RuntimeException("Could not read the file!");
			}
		} catch (Exception e) {
			e.printStackTrace(); // Print the full stack trace
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	@PostMapping("/api/matches/{matchId}/attachments")
	public ResponseEntity<?> uploadAttachment(
			@PathVariable Long matchId,
			@RequestParam("file") MultipartFile file) {
		try {
			Match match = userService.findMatchById(matchId)
				.orElseThrow(() -> new RuntimeException("Match not found"));

			if (match.getStatus() != Match.MatchStatus.ACCEPTED) {
				return ResponseEntity.badRequest()
					.body("Cannot share files until the match is accepted");
			}

			// Generate a unique filename while preserving the original name
			String originalFilename = file.getOriginalFilename();
			String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
			String uniqueId = UUID.randomUUID().toString();
			String filename = uniqueId + extension;

			// Create uploads directory in the project root
			Path projectRoot = Paths.get(System.getProperty("user.dir"));
			Path uploadPath = projectRoot.resolve("uploads");
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			// Save the file
			Path filePath = uploadPath.resolve(filename);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			// Create and save file attachment
			FileAttachment attachment = new FileAttachment();
			attachment.setFileName(originalFilename);
			attachment.setFileUrl("/uploads/" + filename);
			attachment.setContentType(file.getContentType());
			attachment.setFileSize(file.getSize());
			attachment.setUploadDate(LocalDateTime.now());

			// Save the attachment
			FileAttachment savedAttachment = fileAttachmentRepository.save(attachment);

			// Create response with file details
			Map<String, Object> response = new HashMap<>();
			response.put("fileUrl", savedAttachment.getFileUrl());
			response.put("fileName", savedAttachment.getFileName());
			response.put("fileSize", savedAttachment.getFileSize());
			response.put("contentType", savedAttachment.getContentType());
			response.put("attachmentId", savedAttachment.getId());

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Error uploading file: " + e.getMessage());
		}
	}
}
