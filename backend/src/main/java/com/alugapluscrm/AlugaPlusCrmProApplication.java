package com.alugapluscrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AlugaPlusCrmProApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlugaPlusCrmProApplication.class, args);
    }
}
