package com.epatrimonio.api.entrypoint.rest.dto;

public record GoogleAuthResponse(
	String status,
	String message,
	String accessToken,
	String tokenType,
	long expiresIn) {
}
