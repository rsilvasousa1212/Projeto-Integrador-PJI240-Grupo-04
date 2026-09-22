package com.epatrimonio.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiApplicationTests {

	@LocalServerPort
	private int port;

	@Test
	void contextLoads() {
	}

	@Test
	void actuatorHealthRequiresCredentialsAndReportsDatabaseUp() throws Exception {
		URI endpoint = URI.create("http://localhost:" + port + "/sistema-interno-dados/health");
		HttpClient client = HttpClient.newHttpClient();

		HttpRequest unauthorizedRequest = HttpRequest.newBuilder(endpoint).GET().build();
		HttpResponse<String> unauthorized = client.send(
				unauthorizedRequest, HttpResponse.BodyHandlers.ofString());
		assertThat(unauthorized.statusCode()).isEqualTo(401);

		String credentials = Base64.getEncoder().encodeToString(
				"admin_monitoramento:temp_pass".getBytes());
		HttpRequest authenticatedRequest = HttpRequest.newBuilder(endpoint)
				.header("Authorization", "Basic " + credentials)
				.GET()
				.build();
		HttpResponse<String> health = client.send(
				authenticatedRequest, HttpResponse.BodyHandlers.ofString());

		assertThat(health.statusCode()).isEqualTo(200);
		assertThat(health.body()).contains("\"status\":\"UP\"");
		assertThat(health.body()).contains("\"db\"");
	}

}
