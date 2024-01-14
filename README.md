# Express_Sequelize_Fulll_Stack

Se crea una base de datos con dos tablas usando Express, Sequelize, Mysql y EJS.
Una tabla es de proyectos y la otra es de tareas, cada projecto puede tener varias tareas.
El projecto consiste de:
- Crear un CRUD para cada una de las tablas usando Sequelize
- Crear una página dodne se pueda ver que tareas tiene cada projecto y poder agregar y quitar tareas al projecto.

Las tablas son:
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `priority` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `done` tinyint(1) DEFAULT '0',
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
