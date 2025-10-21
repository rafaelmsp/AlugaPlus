package com.alugapluscrm.storage;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${alugaplus.storage.base-path}")
    private String basePath;

    @Value("${alugaplus.storage.contratos}")
    private String contratosPath;

    @Value("${alugaplus.storage.vistorias}")
    private String vistoriasPath;

    @Value("${alugaplus.storage.comprovantes}")
    private String comprovantesPath;

    @Value("${alugaplus.storage.manutencoes}")
    private String manutencoesPath;

    @PostConstruct
    public void init() throws IOException {
        criarDiretorioSeNecessario(basePath);
        criarDiretorioSeNecessario(contratosPath);
        criarDiretorioSeNecessario(vistoriasPath);
        criarDiretorioSeNecessario(comprovantesPath);
        criarDiretorioSeNecessario(manutencoesPath);
    }

    public String storeContrato(MultipartFile file) {
        return armazenar(file, contratosPath);
    }

    public String storeComprovante(MultipartFile file) {
        return armazenar(file, comprovantesPath);
    }

    public List<String> storeVistoriaFotos(List<MultipartFile> files) {
        return armazenarLista(files, vistoriasPath);
    }

    public List<String> storeManutencaoFotos(List<MultipartFile> files) {
        return armazenarLista(files, manutencoesPath);
    }

    private List<String> armazenarLista(List<MultipartFile> files, String destino) {
        List<String> caminhos = new ArrayList<>();
        if (files == null) {
            return caminhos;
        }
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                caminhos.add(armazenar(file, destino));
            }
        }
        return caminhos;
    }

    private String armazenar(MultipartFile file, String destino) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo invalido para upload");
        }
        try {
            String originalFilenameRaw = file.getOriginalFilename();
            if (originalFilenameRaw == null || originalFilenameRaw.isBlank()) {
                originalFilenameRaw = file.getName();
            }
            String originalFilename = StringUtils.cleanPath(originalFilenameRaw);
            String filename = UUID.randomUUID() + "_" + originalFilename;
            Path targetLocation = Paths.get(destino).resolve(filename).normalize();
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return targetLocation.toString();
        } catch (IOException e) {
            throw new RuntimeException("Falha ao armazenar arquivo", e);
        }
    }

    private void criarDiretorioSeNecessario(String path) throws IOException {
        if (path == null || path.isBlank()) {
            return;
        }
        Path dir = Paths.get(path);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
    }
}
