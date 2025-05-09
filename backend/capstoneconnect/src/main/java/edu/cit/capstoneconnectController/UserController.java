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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    public ResponseEntity<?> getAuthenticatedUser(@AuthenticationPrincipal Object principal) {
        String email = null;
        String name = null;
        String oid = null;

        if (principal instanceof org.springframework.security.oauth2.core.user.OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
            oid = oauth2User.getAttribute("oid");
        } else if (principal instanceof org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken jwtToken) {
            email = jwtToken.getToken().getClaim("preferred_username");
            name = jwtToken.getToken().getClaim("name");
            oid = jwtToken.getToken().getClaim("oid");
        }

        if (email != null || oid != null) {
            Optional<UserEntity> userEntity = (email != null)
                ? userService.findByEmail(email)
                : Optional.empty();
            if (userEntity.isEmpty() && oid != null) {
                userEntity = userService.findByOauthId(oid);
            }
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
                
                // Handle skills list
                Object skillsObj = updates.get("skills");
                if (skillsObj instanceof List) {
                    user.setSkills((List<String>) skillsObj);
                } else if (skillsObj != null) {
                    // If it's not a List, try to convert it
                    List<String> skillsList = new ArrayList<>();
                    if (skillsObj instanceof String) {
                        // If it's a string, try to parse it as JSON array
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            skillsList = mapper.readValue((String) skillsObj, new TypeReference<List<String>>() {});
                        } catch (Exception e) {
                            // If parsing fails, add as single item
                            skillsList.add((String) skillsObj);
                        }
                    }
                    user.setSkills(skillsList);
                } else {
                    user.setSkills(new ArrayList<>());
                }

                // Handle interests list
                Object interestsObj = updates.get("interests");
                if (interestsObj instanceof List) {
                    user.setInterests((List<String>) interestsObj);
                } else if (interestsObj != null) {
                    // If it's not a List, try to convert it
                    List<String> interestsList = new ArrayList<>();
                    if (interestsObj instanceof String) {
                        // If it's a string, try to parse it as JSON array
                        try {
                            ObjectMapper mapper = new ObjectMapper();
                            interestsList = mapper.readValue((String) interestsObj, new TypeReference<List<String>>() {});
                        } catch (Exception e) {
                            // If parsing fails, add as single item
                            interestsList.add((String) interestsObj);
                        }
                    }
                    user.setInterests(interestsList);
                } else {
                    user.setInterests(new ArrayList<>());
                }

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

                // Build response similar to GET /profile
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
                }
                if (!profilePicturePath.startsWith("http")) {
                    String backendUrl = System.getenv("BACKEND_URL");
                    if (backendUrl != null && !backendUrl.isEmpty()) {
                        profilePicturePath = backendUrl + profilePicturePath;
                    }
                }
                profileData.put("profilePicture", profilePicturePath);

                return ResponseEntity.ok(profileData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred: " + e.getMessage());
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
                }
                // Always prepend the backend URL if it's not already a full URL
                if (!profilePicturePath.startsWith("http")) {
                    String backendUrl = System.getenv("BACKEND_URL");
                    if (backendUrl != null && !backendUrl.isEmpty()) {
                        profilePicturePath = backendUrl + profilePicturePath;
                    }
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
                    
                    // Skip if match is accepted (permanent hide)
                    if (match.getStatus() == Match.MatchStatus.ACCEPTED) {
                        continue;
                    }
                    
                    // Skip if there's an active cooldown
                    if (match.getCooldownUntil() != null && match.getCooldownUntil().after(now)) {
                        continue;
                    }
                    
                    // Skip if there's a pending request (waiting for decision)
                    if (match.getStatus() == Match.MatchStatus.PENDING) {
                        continue;
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
                        profilePicturePath = System.getenv("BACKEND_URL") + profilePicturePath;
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

            // Set cooldowns based on the new status
            Calendar cal = Calendar.getInstance();
            switch (newStatus) {
                case PASSED:
                    // 3-hour cooldown for passed matches
                    cal.add(Calendar.HOUR, 3);
                    match.setCooldownUntil(cal.getTime());
                    break;
                case REJECTED:
                    // 1-hour cooldown for rejected matches
                    cal.add(Calendar.HOUR, 1);
                    match.setCooldownUntil(cal.getTime());
                    break;
                case ACCEPTED:
                    // No cooldown for accepted matches (permanent hide)
                    match.setCooldownUntil(null);
                    break;
                case PENDING:
                    // No cooldown for pending matches (will be hidden until decision)
                    match.setCooldownUntil(null);
                    break;
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
            // Use persistent storage path in Render, fallback to local path for development
            String persistentPath = System.getenv("RENDER_PERSISTENT_DISK_PATH");
            Path uploadsDir;
            if (persistentPath != null && !persistentPath.isEmpty()) {
                uploadsDir = Paths.get(persistentPath, "uploads");
            } else {
                uploadsDir = Paths.get(System.getProperty("user.dir"), "uploads");
            }
            
            Path filePath = uploadsDir.resolve(fileName);
            
            // Log the file path for debugging
            System.out.println("Attempting to serve file from: " + filePath.toAbsolutePath());
            
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Determine content type
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                boolean isImage = contentType.startsWith("image/");

                if (view && isImage) {
                    // For images when viewing, send with content-type for browser display
                    return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .body(resource);
                } else {
                    // For downloads or non-images, send as attachment
                    return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .body(resource);
                }
            } else {
                System.err.println("File not found or not readable: " + filePath.toAbsolutePath());
                // Return a default avatar if the requested file is not found
                Path defaultAvatarPath = uploadsDir.resolve("default-avatar.png");
                Resource defaultResource = new UrlResource(defaultAvatarPath.toUri());
                
                if (defaultResource.exists() && defaultResource.isReadable()) {
                    return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, "image/png")
                        .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                        .body(defaultResource);
                }
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
            }
        } catch (Exception e) {
            System.err.println("Error serving file: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
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
