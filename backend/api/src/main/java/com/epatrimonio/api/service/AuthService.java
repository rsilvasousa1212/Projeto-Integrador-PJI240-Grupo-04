package com.epatrimonio.api.service;

import com.epatrimonio.api.model.auth.GoogleAuthResponse;
import com.epatrimonio.api.model.auth.GoogleOAuthTokenRequest;
import com.epatrimonio.api.model.auth.GoogleOAuthTokenResponse;
import com.epatrimonio.api.infra.security.GoogleAuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final GoogleAuthService googleAuthService;

    public AuthService(GoogleAuthService googleAuthService) {
        this.googleAuthService = googleAuthService;
    }

    public GoogleAuthResponse autenticarAccessToken(String token) {
        return googleAuthService.autenticarAccessToken(token);
    }

    public GoogleAuthResponse autenticar(String token) {
        return googleAuthService.autenticar(token);
    }

    public GoogleAuthResponse cadastrar(String token) {
        return googleAuthService.cadastrar(token);
    }

    public GoogleOAuthTokenResponse trocarCodigoPorJwt(GoogleOAuthTokenRequest request) {
        return googleAuthService.trocarCodigoPorJwt(request);
    }
}
