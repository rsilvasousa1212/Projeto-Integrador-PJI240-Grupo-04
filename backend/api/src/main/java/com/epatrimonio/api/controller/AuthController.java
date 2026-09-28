package com.epatrimonio.api.controller;

import com.epatrimonio.api.model.auth.GoogleAuthRequest;
import com.epatrimonio.api.model.auth.GoogleAuthResponse;
import com.epatrimonio.api.model.auth.GoogleOAuthTokenRequest;
import com.epatrimonio.api.model.auth.GoogleOAuthTokenResponse;
import com.epatrimonio.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService service;

    @PostMapping("/google")
    public GoogleAuthResponse autenticarGoogle(@RequestHeader("Authorization") String authorization) {
        if (!authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Authorization deve conter um Bearer token Google");
        }
        return service.autenticarAccessToken(authorization.substring(7));
    }

    @PostMapping("/google/id-token")
    public GoogleAuthResponse autenticarGoogleIdToken(@Valid @RequestBody GoogleAuthRequest request) {
        return service.autenticar(request.idToken());
    }

    @PostMapping("/google/register")
    public GoogleAuthResponse cadastrarGoogle(@Valid @RequestBody GoogleAuthRequest request) {
        return service.cadastrar(request.idToken());
    }

    @PostMapping("/google/token")
    public GoogleOAuthTokenResponse trocarCodigoGoogle(@RequestParam Map<String, String> form) {
        return service.trocarCodigoPorJwt(new GoogleOAuthTokenRequest(
                form.get("grant_type"), form.get("code"), form.get("redirect_uri"),
                form.get("client_id"), form.get("code_verifier")));
    }
}
