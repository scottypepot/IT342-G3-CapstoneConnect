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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@RestController
public class SecurityConfig {

    @Autowired
    private UserService userService;

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(System.getenv("FRONTEND_URL")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/logout").permitAll()
                .requestMatchers("/error").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuthSuccessHandler())
                .failureHandler((request, response, exception) -> {
                    System.err.println("❌ OAuth2 Login Failed: " + exception.getMessage());
                    response.sendRedirect(System.getenv("FRONTEND_URL") + "/login?error=true");
                })
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    // Clear session
                    HttpSession session = request.getSession(false);
                    if (session != null) {
                        session.invalidate();
                    }
                    
                    // Clear cookies
                    Cookie[] cookies = request.getCookies();
                    if (cookies != null) {
                        for (Cookie cookie : cookies) {
                            cookie.setValue("");
                            cookie.setPath("/");
                            cookie.setMaxAge(0);
                            response.addCookie(cookie);
                        }
                    }
                    
                    response.setStatus(200);
                })
                .permitAll()
            )
            // Enable JWT Bearer token authentication for APIs
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuthSuccessHandler() {
        return (request, response, authentication) -> {
            try {
                var oauth2User = (org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal();
                String oauthId = oauth2User.getAttribute("oid");
                String email = oauth2User.getAttribute("email");
                String name = oauth2User.getAttribute("name");

                System.out.println("✅ OAuth Login Successful - Processing User Data");
                System.out.println("User Email: " + email);

                // Save user if not exists
                userService.saveUserIfNotExists(oauthId, email, name);

                // Set session attributes
                HttpSession session = request.getSession(true);
                session.setAttribute("user_email", email);
                session.setAttribute("user_name", name);

                // Redirect to frontend
                response.sendRedirect(System.getenv("FRONTEND_URL") + "/home");
            } catch (Exception e) {
                System.err.println("❌ Error in OAuth Success Handler: " + e.getMessage());
                response.sendRedirect(System.getenv("FRONTEND_URL") + "/login?error=true");
            }
        };
    }
}