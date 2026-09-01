CREATE DATABASE IF NOT EXISTS app_ingles;

use app_ingles;

CREATE TABLE usuario (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL
);

CREATE TABLE quiz(
	id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    dificuldade INT NOT NULL,
    nota INT NOT NULL,
    data DATE NOT NULL,
    total_perguntas INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE pergunta(
	id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    enunciado VARCHAR(1000) NOT NULL,
    categoria ENUM ("preposicao","tempo_verbal","contexto")NOT NULL,
    opcoes VARCHAR(1000) NOT NULL,
    resposta_certa VARCHAR(1000) NOT NULL,
    resposta_usuario VARCHAR(1000) ,
    acertou BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
    );