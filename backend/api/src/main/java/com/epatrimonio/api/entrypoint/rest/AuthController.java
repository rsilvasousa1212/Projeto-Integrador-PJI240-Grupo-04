package com.epatrimonio.api.entrypoint.rest;

import com.epatrimonio.api.entrypoint.rest.dto.GoogleAuthResponse;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleAuthRequest;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleOAuthTokenRequest;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleOAuthTokenResponse;
import com.epatrimonio.api.infrastructure.security.GoogleAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final GoogleAuthService googleAuthService;

    public AuthController(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/google")
    @Operation(summary = "Autentica com o token Google autorizado pelo Swagger")
    @SecurityRequirement(name = "googleAuth", scopes = {"openid", "email", "profile"})
    public GoogleAuthResponse autenticarGoogle(
            @RequestHeader(value = "Authorization") String authorization) {
        if (!authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization deve conter um Bearer token Google");
        }
        return googleAuthService.autenticarAccessToken(authorization.substring(7));
    }

    @PostMapping("/google/id-token")
    @Operation(summary = "Autentica com um ID token Google enviado pelo frontend")
    public GoogleAuthResponse autenticarGoogleIdToken(@Valid @RequestBody GoogleAuthRequest request) {
        return googleAuthService.autenticar(request.idToken());
    }

    @PostMapping("/google/register")
    @Operation(summary = "Cadastra um usuário Google aguardando aprovação")
    public GoogleAuthResponse cadastrarGoogle(@Valid @RequestBody GoogleAuthRequest request) {
        return googleAuthService.cadastrar(request.idToken());
    }

    @PostMapping("/google/token")
    @Operation(summary = "Troca o código OAuth do Google pelo JWT da API")
    public GoogleOAuthTokenResponse trocarCodigoGoogle(@RequestParam Map<String, String> form) {
        return googleAuthService.trocarCodigoPorJwt(new GoogleOAuthTokenRequest(
                form.get("grant_type"),
                form.get("code"),
                form.get("redirect_uri"),
                form.get("client_id"),
                form.get("code_verifier")));
    }
}
