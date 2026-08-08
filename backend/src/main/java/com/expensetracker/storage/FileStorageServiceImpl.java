package com.expensetracker.storage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file) {

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();


            System.out.println("========================================");
            System.out.println("Upload Directory : " + uploadPath.toAbsolutePath());

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Uploads folder created successfully.");
            }

            // Generate unique filename
            String fileName = UUID.randomUUID() + "_"
                    + file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            System.out.println("Saving File To : " + filePath.toAbsolutePath());

            // Save file
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            System.out.println("File uploaded successfully.");
            System.out.println("Saved File Name : " + fileName);
            System.out.println("========================================");

            return fileName;

        } catch (IOException e) {

            System.out.println("========== FILE UPLOAD ERROR ==========");
            e.printStackTrace();
            System.out.println("=======================================");

            throw new RuntimeException("File upload failed.", e);
        }
    }
}