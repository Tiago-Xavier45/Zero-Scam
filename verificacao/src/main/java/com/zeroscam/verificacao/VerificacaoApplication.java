package com.zeroscam.verificacao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class VerificacaoApplication {

	public static void main(String[] args) {
		SpringApplication.run(VerificacaoApplication.class, args);
	}

}
