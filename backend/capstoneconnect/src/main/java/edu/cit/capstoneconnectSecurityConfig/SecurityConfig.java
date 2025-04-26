package edu.cit.capstoneconnectSecurityConfig;

import edu.cit.capstoneconnectService.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@Configuration
@RestController
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        // Invalidate the session
        if (session != null) {
            session.invalidate();
        }
        
        // Clear security context
        SecurityContextHolder.clearContext();
        
        return ResponseEntity.ok().build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowCredentials(true);
                    config.addAllowedOrigin("http://localhost:5173"); // Allow your frontend origin
                    config.addAllowedHeader("*");
                    config.addAllowedMethod("*");
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                        .requestMatchers("/api/auth/logout").permitAll()
                        .anyRequest().authenticated() // All other requests must be authenticated
                )
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (only if necessary)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuthSuccessHandler()) // Custom success handler for Microsoft login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .addLogoutHandler(new SecurityContextLogoutHandler())
                        .addLogoutHandler((request, response, authentication) -> {
                            HttpSession session = request.getSession(false);
                            if (session != null) {
                                session.invalidate();
                            }
                            
                            // Clear all cookies
                            Cookie[] cookies = request.getCookies();
                            if (cookies != null) {
                                for (Cookie cookie : cookies) {
                                    cookie.setValue("");
                                    cookie.setPath("/");
                                    cookie.setMaxAge(0);
                                    response.addCookie(cookie);
                                }
                            }
                        })
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuthSuccessHandler() {
        return (request, response, authentication) -> {
            var oauth2User = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
            String oauthId = oauth2User.getAttribute("oid");
            String email = oauth2User.getAttribute("email");
            String name = oauth2User.getAttribute("name");

            System.out.println("✅ OAuth Login Successful - Processing User Data");

            // Save user if not exists
            userService.saveUserIfNotExists(oauthId, email, name);

            // Always redirect to home page, let frontend handle the flow
            response.sendRedirect("http://localhost:5173/home");
        };
    }
}