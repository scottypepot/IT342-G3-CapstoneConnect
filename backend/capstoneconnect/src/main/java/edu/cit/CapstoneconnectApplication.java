package edu.cit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
public class CapstoneconnectApplication {

	public static void main(String[] args) {
		SpringApplication.run(CapstoneconnectApplication.class, args);
	}

	@Bean
	public CommandLineRunner validateEnvironment() {
		return args -> {
			// Validate required environment variables
			String[] requiredVars = {
				"BACKEND_URL",
				"FRONTEND_URL",
				"MICROSOFT_CLIENT_ID",
				"MICROSOFT_CLIENT_SECRET",
				"MICROSOFT_ISSUER_URI",
				"DATABASE_URL",
				"DATABASE_USERNAME",
				"DATABASE_PASSWORD"
			};

			for (String var : requiredVars) {
				String value = System.getenv(var);
				if (value == null || value.trim().isEmpty()) {
					throw new RuntimeException("Required environment variable " + var + " is not set!");
				}
			}

			System.out.println("✅ All required environment variables are set");
		};
	}

}
