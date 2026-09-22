package com.epatrimonio.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/sistema-interno-dados/**").authenticated()
						.anyRequest().permitAll())
				.httpBasic(Customizer.withDefaults())
				.csrf(csrf -> csrf.ignoringRequestMatchers("/sistema-interno-dados/**"));

		return http.build();
	}
}