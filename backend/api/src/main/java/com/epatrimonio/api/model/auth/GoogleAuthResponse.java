package com.epatrimonio.api.model.auth;

public record GoogleAuthResponse(String status, String message, String accessToken,
                                 String tokenType, long expiresIn) {
}
