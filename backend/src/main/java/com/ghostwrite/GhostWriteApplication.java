package com.ghostwrite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GhostWriteApplication {

    public static void main(String[] args) {
        SpringApplication.run(GhostWriteApplication.class, args);
    }
}
