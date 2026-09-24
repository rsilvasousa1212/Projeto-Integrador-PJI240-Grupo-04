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
class UsuarioControllerTest {

    @LocalServerPort
    private int port;

    @Test
    void deveExibirListaDeUsuarios() throws Exception {
        URI endpoint = URI.create("http://localhost:" + port + "/api/usuarios");
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder(endpoint)
                .header("Authorization", "Basic " + Base64.getEncoder().encodeToString("admin_monitoramento:temp_pass".getBytes()))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @Test
    void deveExibirOpenApi() throws Exception {
        URI endpoint = URI.create("http://localhost:" + port + "/v3/api-docs");
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder(endpoint)
                .header("Authorization", "Basic " + Base64.getEncoder().encodeToString("admin_monitoramento:temp_pass".getBytes()))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("openapi");
    }
}
