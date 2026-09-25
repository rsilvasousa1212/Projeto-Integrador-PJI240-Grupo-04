package com.epatrimonio.api.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String apiSchemeName = "bearerAuth";
        final String googleSchemeName = "googleAuth";
        
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes(apiSchemeName,
                                new SecurityScheme()
                                        .name(apiSchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                        .addSecuritySchemes(googleSchemeName,
                                new SecurityScheme()
                                        .name(googleSchemeName)
                                        .type(SecurityScheme.Type.OAUTH2)
                                        .flows(new OAuthFlows()
                                                .authorizationCode(new OAuthFlow()
                                                        .authorizationUrl("https://accounts.google.com/o/oauth2/v2/auth")
                                                        .tokenUrl("https://oauth2.googleapis.com/token")
                                                        .scopes(new Scopes()
                                                                .addString("openid", "Identidade OpenID")
                                                                .addString("email", "E-mail")
                                                                .addString("profile", "Perfil"))))
                        )
                );
    }
}