package com.epatrimonio.api.model.auth;

import jakarta.validation.constraints.NotBlank;

public record GoogleOAuthTokenRequest(
        @NotBlank String grant_type,
        @NotBlank String code,
        String redirect_uri,
        String client_id,
        String code_verifier) {
}
