package com.epatrimonio.api.infrastructure.security;

import com.epatrimonio.api.core.domain.Perfil;
import com.epatrimonio.api.core.domain.Usuario;
import com.epatrimonio.api.core.usecase.usuario.SincronizarUsuarioGoogleUseCase;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleAuthResponse;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleOAuthTokenRequest;
import com.epatrimonio.api.entrypoint.rest.dto.GoogleOAuthTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class GoogleAuthService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleAuthService.class);

    private final GoogleIdTokenVerifier googleTokenVerifier;
    private final SincronizarUsuarioGoogleUseCase sincronizarUsuario;
    private final JwtEncoder jwtEncoder;
    private final String jwtIssuer;
    private final long jwtExpirationSeconds;
    private final String clientId;
    private final String clientSecret;

    public GoogleAuthService(
            @Value("${google.client-id}") String clientId,
            @Value("${google.client-secret}") String clientSecret,
            SincronizarUsuarioGoogleUseCase sincronizarUsuario,
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.issuer}") String jwtIssuer,
            @Value("${app.jwt.expiration-seconds}") long jwtExpirationSeconds) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.googleTokenVerifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
        this.sincronizarUsuario = sincronizarUsuario;
        this.jwtEncoder = jwtEncoder;
        this.jwtIssuer = jwtIssuer;
        this.jwtExpirationSeconds = jwtExpirationSeconds;
    }

    public GoogleOAuthTokenResponse trocarCodigoPorJwt(GoogleOAuthTokenRequest request) {
        if (!"authorization_code".equals(request.grant_type())
                || request.code() == null || request.redirect_uri() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "grant_type inválido");
        }
        if (request.client_id() != null && !clientId.equals(request.client_id())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "client_id inválido");
        }

        try {
            String form = "code=" + encode(request.code())
                    + "&client_id=" + encode(clientId)
                    + "&client_secret=" + encode(clientSecret)
                    + "&grant_type=authorization_code"
                    + "&redirect_uri=" + encode(request.redirect_uri())
                    + (request.code_verifier() == null ? "" : "&code_verifier=" + encode(request.code_verifier()));
            HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form))
                    .build();
            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() / 100 != 2) {
                logger.warn("Google recusou a troca OAuth: status={}, body={}",
                        response.statusCode(), response.body());
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Código OAuth Google inválido");
            }
            JsonObject googleResponse = JsonParser.parseString(response.body()).getAsJsonObject();
            if (!googleResponse.has("id_token")) {
                logger.warn("Resposta OAuth do Google não contém id_token");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google não retornou id_token");
            }
            String idToken = googleResponse.get("id_token").getAsString();
            GoogleAuthResponse appToken = autenticar(idToken);
            return new GoogleOAuthTokenResponse(appToken.accessToken(), appToken.tokenType(), appToken.expiresIn(), "openid email profile");
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            logger.warn("Falha na troca OAuth com o Google: {}", exception.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível trocar o código Google", exception);
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    public GoogleAuthResponse autenticarAccessToken(String accessToken) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest tokenInfoRequest = HttpRequest.newBuilder(
                            URI.create("https://oauth2.googleapis.com/tokeninfo?access_token="
                                    + encode(accessToken)))
                    .GET()
                    .build();
            HttpResponse<String> tokenInfoResponse = client.send(
                    tokenInfoRequest, HttpResponse.BodyHandlers.ofString());
            if (tokenInfoResponse.statusCode() / 100 != 2) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Access token Google inválido");
            }

            JsonObject tokenInfo = JsonParser.parseString(tokenInfoResponse.body()).getAsJsonObject();
            if (!clientId.equals(tokenInfo.get("aud").getAsString())
                    || !tokenInfo.has("user_id")
                    || tokenInfo.get("expires_in").getAsLong() <= 0) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Access token Google não confiável");
            }

            HttpRequest userInfoRequest = HttpRequest.newBuilder(URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();
            HttpResponse<String> userInfoResponse = client.send(
                    userInfoRequest, HttpResponse.BodyHandlers.ofString());
            if (userInfoResponse.statusCode() / 100 != 2) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível obter a identidade Google");
            }

            JsonObject userInfo = JsonParser.parseString(userInfoResponse.body()).getAsJsonObject();
            String googleId = userInfo.get("sub").getAsString();
            String email = userInfo.get("email").getAsString();
            if (!Boolean.parseBoolean(userInfo.get("email_verified").getAsString())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail Google não verificado");
            }

            Usuario usuario = obterOuCadastrar(googleId, email,
                    userInfo.has("name") ? userInfo.get("name").getAsString() : email,
                    userInfo.has("picture") ? userInfo.get("picture").getAsString() : null);
            return autenticarUsuario(usuario);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível validar o access token Google", exception);
        }
    }

    public GoogleAuthResponse autenticar(String idToken) {
        try {
            GoogleIdToken googleIdToken = googleTokenVerifier.verify(idToken);
            if (googleIdToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido");
            }

            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            if (!isGoogleIssuer(payload.getIssuer()) || !Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google não confiável");
            }

            String googleId = payload.getSubject();
            String email = payload.getEmail();
            if (googleId == null || email == null || email.isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google sem identidade válida");
            }

                Usuario usuario = obterOuCadastrar(googleId, email,
                    payload.get("name") != null ? payload.get("name").toString() : email,
                    payload.get("picture") != null ? payload.get("picture").toString() : null);
                return autenticarUsuario(usuario);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível validar o token Google", exception);
        }
    }

    private GoogleAuthResponse emitirJwt(Usuario usuario) {
        Instant issuedAt = Instant.now();
            Instant expiresAt = issuedAt.plusSeconds(jwtExpirationSeconds);
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer(jwtIssuer)
                    .subject(usuario.googleId())
                    .issuedAt(issuedAt)
                    .expiresAt(expiresAt)
                    .claim("uid", usuario.id())
                    .claim("email", usuario.email())
                    .claim("perfis", perfis(usuario))
                    .claim("permissoes", permissoes(usuario))
                    .build();

            String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
                return new GoogleAuthResponse(
                    "AUTHENTICATED",
                    "Login realizado com sucesso",
                    accessToken,
                    "Bearer",
                    jwtExpirationSeconds);
    }

    public GoogleAuthResponse cadastrar(String idToken) {
        GoogleIdToken token = validarIdToken(idToken);
        GoogleIdToken.Payload payload = token.getPayload();
        Usuario usuario = cadastrarUsuario(payload.getSubject(), payload.getEmail(),
                payload.get("name") != null ? payload.get("name").toString() : payload.getEmail(),
                payload.get("picture") != null ? payload.get("picture").toString() : null);
        return respostaPendente(usuario);
    }

    private Usuario obterOuCadastrar(String googleId, String email, String nome, String fotoUrl) {
        return cadastrarUsuario(googleId, email, nome, fotoUrl);
    }

    private Usuario cadastrarUsuario(String googleId, String email, String nome, String fotoUrl) {
        return sincronizarUsuario.cadastrarPendente(new Usuario(
                null, googleId, email, nome, fotoUrl, false, null, null, List.of()));
    }

    private GoogleAuthResponse autenticarUsuario(Usuario usuario) {
        if (!Boolean.TRUE.equals(usuario.ativo())) {
            return respostaPendente(usuario);
        }
        return emitirJwt(usuario);
    }

    private GoogleAuthResponse respostaPendente(Usuario usuario) {
        return new GoogleAuthResponse(
                "PENDING",
                "Sua conta foi cadastrada e aguarda aprovação de um administrador",
                null,
                null,
                0);
    }

    private GoogleIdToken validarIdToken(String idToken) {
        try {
            GoogleIdToken token = googleTokenVerifier.verify(idToken);
            if (token == null || !isGoogleIssuer(token.getPayload().getIssuer())
                    || !Boolean.TRUE.equals(token.getPayload().getEmailVerified())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google não confiável");
            }
            return token;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google inválido", exception);
        }
    }

    private boolean isGoogleIssuer(String issuer) {
        return "accounts.google.com".equals(issuer) || "https://accounts.google.com".equals(issuer);
    }

    private List<String> perfis(Usuario usuario) {
        return usuario.perfis() == null ? List.of() : usuario.perfis().stream()
                .filter(perfil -> Boolean.TRUE.equals(perfil.ativo()))
                .map(Perfil::nome)
                .toList();
    }

    private List<String> permissoes(Usuario usuario) {
        return usuario.perfis() == null ? List.of() : usuario.perfis().stream()
                .filter(perfil -> Boolean.TRUE.equals(perfil.ativo()))
                .flatMap(perfil -> perfil.permissoes() == null ? List.<String>of().stream() : perfil.permissoes().stream())
                .distinct()
                .toList();
    }
}
