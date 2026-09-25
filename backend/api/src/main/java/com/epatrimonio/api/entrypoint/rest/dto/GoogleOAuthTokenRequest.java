package com.epatrimonio.api.entrypoint.rest.dto;

import jakarta.validation.constraints.NotBlank;

public record GoogleOAuthTokenRequest(
        @NotBlank String grant_type,
        @NotBlank String code,
        String redirect_uri,
        String client_id,
        String code_verifier
) {
}
