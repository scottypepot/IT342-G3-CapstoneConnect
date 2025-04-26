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
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FileUploadController {

    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

    public FileUploadController() {
        // Create uploads directory when controller is initialized
        try {
            Files.createDirectories(Paths.get(uploadDir));
            // Copy default avatar if it doesn't exist
            Path defaultAvatarPath = Paths.get(uploadDir, "default-avatar.png");
            if (!Files.exists(defaultAvatarPath)) {
                // You need to ensure default-avatar.png exists in your resources
                Files.copy(getClass().getResourceAsStream("/static/default-avatar.png"), defaultAvatarPath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            // Generate a unique file name to prevent overwrites
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String fileName = System.currentTimeMillis() + "_" + Math.round(Math.random() * 1000) + extension;
            Path filePath = Paths.get(uploadDir, fileName);

            // Save the file
            Files.copy(file.getInputStream(), filePath);

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
