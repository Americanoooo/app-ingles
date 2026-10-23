-- CreateTable
CREATE TABLE `pergunta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quiz_id` INTEGER NOT NULL,
    `enunciado` VARCHAR(1000) NOT NULL,
    `categoria` ENUM('preposicao', 'tempo_verbal', 'contexto') NOT NULL,
    `opcoes` VARCHAR(1000) NOT NULL,
    `resposta_certa` VARCHAR(1000) NOT NULL,
    `resposta_usuario` VARCHAR(1000) NULL,
    `acertou` BOOLEAN NULL DEFAULT false,

    INDEX `quiz_id`(`quiz_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `dificuldade` INTEGER NOT NULL,
    `nota` DECIMAL(4, 2) NULL,
    `data` DATE NOT NULL,
    `total_perguntas` INTEGER NULL,

    INDEX `usuario_id`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pergunta` ADD CONSTRAINT `pergunta_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

