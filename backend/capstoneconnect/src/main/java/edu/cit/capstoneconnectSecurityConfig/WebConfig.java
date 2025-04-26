package edu.cit.capstoneconnectSecurityConfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    private final String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Log the absolute path being used
        System.out.println("✅ Configuring upload directory at: " + uploadDir);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + File.separator)
                .setCachePeriod(3600);
    }
}
