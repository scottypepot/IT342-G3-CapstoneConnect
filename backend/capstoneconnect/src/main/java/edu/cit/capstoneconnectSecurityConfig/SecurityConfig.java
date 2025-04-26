package edu.cit.capstoneconnectSecurityConfig;

import edu.cit.capstoneconnectService.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class SecurityConfig {

    @Autowired
    private UserService userService;

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
                        .anyRequest().authenticated() // All other requests must be authenticated
                )
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (only if necessary)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuthSuccessHandler()) // Custom success handler for Microsoft login
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("http://localhost:5173")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
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