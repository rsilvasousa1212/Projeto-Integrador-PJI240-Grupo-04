# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM eclipse-temurin:26-jdk-alpine AS builder
WORKDIR /app

# Copia o Maven Wrapper e o pom.xml primeiro (cache de dependências)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Garante que o mvnw tem permissão de execução
RUN chmod +x mvnw

# Baixa as dependências (camada cacheada separadamente)
RUN ./mvnw dependency:go-offline -B

# Copia o código fonte
COPY src ./src

# Gera o JAR (sem rodar testes — testes usam H2, não necessário no build)
RUN ./mvnw clean package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:26-jre-alpine
WORKDIR /app

# Copia apenas o JAR gerado no stage anterior
COPY --from=builder /app/target/*.jar app.jar

# Porta padrão (Render injeta $PORT automaticamente)
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
