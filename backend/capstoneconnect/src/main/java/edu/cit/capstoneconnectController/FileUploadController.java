package edu.cit.capstoneconnectController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${FRONTEND_URL}", allowCredentials = "true")
public class FileUploadController {

    private final String uploadDir;

    public FileUploadController() {
        // Use persistent storage path in Render, fallback to local path for development
        String persistentPath = System.getenv("RENDER_PERSISTENT_DISK_PATH");
        if (persistentPath != null && !persistentPath.isEmpty()) {
            uploadDir = persistentPath + File.separator + "uploads";
        } else {
            uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
        }

        // Create uploads directory when controller is initialized
        try {
            Files.createDirectories(Paths.get(uploadDir));
            System.out.println("✅ Upload directory created at: " + uploadDir);
            
            // Copy default avatar if it doesn't exist
            Path defaultAvatarPath = Paths.get(uploadDir, "default-avatar.png");
            if (!Files.exists(defaultAvatarPath)) {
                Files.copy(getClass().getResourceAsStream("/static/default-avatar.png"), defaultAvatarPath);
                System.out.println("✅ Default avatar copied to: " + defaultAvatarPath);
            }
        } catch (IOException e) {
            System.err.println("❌ Error initializing upload directory: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please select a file to upload"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed"));
            }

            // Generate a unique file name to prevent overwrites
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String fileName = System.currentTimeMillis() + "_" + Math.round(Math.random() * 1000) + extension;
            Path filePath = Paths.get(uploadDir, fileName);

            // Save the file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Log the file save operation
            System.out.println("✅ File saved successfully at: " + filePath);
            
            // Return the relative URL path that will be used by the frontend
            String fileUrl = "/uploads/" + fileName;
            System.out.println("✅ File URL to be returned: " + fileUrl);
            
            return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }
}
