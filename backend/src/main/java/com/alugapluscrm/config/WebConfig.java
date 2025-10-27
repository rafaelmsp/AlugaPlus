package com.alugapluscrm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${alugaplus.storage.base-path}")
    private String basePath;

    @Value("${alugaplus.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(originPatterns())
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        try {
            Path uploadPath = Paths.get(basePath).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations("file:" + uploadPath + "/")
                    .setCachePeriod(0)
                    .resourceChain(true);

            String[] subDirs = {"contracts", "comprovantes", "vistorias", "manutencoes"};
            for (String dir : subDirs) {
                Path subPath = Paths.get(basePath, dir).toAbsolutePath().normalize();
                Files.createDirectories(subPath);

                registry.addResourceHandler("/" + dir + "/**")
                        .addResourceLocations("file:" + subPath + "/")
                        .setCachePeriod(0)
                        .resourceChain(true);
            }
        } catch (IOException e) {
            throw new RuntimeException("Nao foi possivel criar os diretorios de upload", e);
        }
    }

    private String[] originPatterns() {
        return splitValues(allowedOrigins);
    }

    private String[] splitValues(@Nullable String raw) {
        if (raw == null || raw.isBlank()) {
            return new String[0];
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toArray(String[]::new);
    }
}
