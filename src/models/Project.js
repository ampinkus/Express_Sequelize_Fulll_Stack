// en la carpeta models se incluyen los archivos que crean las tablas de la base de datos
// para poder usar los Datatypes y definir el tipo de datos. 
import { DataTypes } from "sequelize"; 
// importo la instancia sequelize para poder comunicarme con la base de datos
import {sequelize} from '../database/database.js';
// importo los Task para poder establecer la relación entre ambas tablas
import { Task } from "./Task.js";

// creo la tabla projects, se define como un objeto, y la exporto como Project
// para poder usarla en otros módulos
export const Project = sequelize.define('projects', { 
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.INTEGER,
  },
  description: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
},
{
  timestamps: true,
});


// tengo que establecer la relación entre ambas tablas, cada project tiene muchos tasks.
// el crear un foreign key en la tabla Task, crea un campo en la tabla Tasks que se llama projectId
Project.hasMany(Task, {
  foreignKey: 'projectId', // de la tabla Task la llave foránea es projectId
  sourceKey: 'id', // de la tabla Project la llave primaria es id
})

Task.belongsTo(Project, { 
  foreignKey: "projectId", // es la clave foránea de la tabla Task
  // targetId: "id"
  targetKey: "id",  // de la tabla proyectos la llave primaria es id
});

/*
The provided code establishes a one-to-many relationship between two Sequelize models, Project and Task, 
using foreign key associations. This relationship implies that a single project can have multiple tasks,
while each task belongs to only one project.

Let's break down the code:
Project.hasMany(Task, {...}):
This line is defining a one-to-many association from the Project model to the Task model using the hasMany method.
The foreignKey option specifies the foreign key field in the Task model that will be used to establish the 
relationship. In this case, it's 'projectId'.
The sourceKey option specifies the primary key field in the Project model that will be used as the 
source of the association. In this case, it's 'id'.
This association means that a single Project instance can have multiple associated Task instances, 
and the relationship is based on the projectId field in the Task model corresponding to the id field 
in the Project model.

Task.belongsTo(Project, {...}):
This line is defining a corresponding association from the Task model to the Project model using the 
belongsTo method.
The foreignKey option specifies the foreign key field in the Task model that links to the primary key 
in the Project model. In this case, it's 'projectId'.
The targetId option is incorrectly specified; it should be targetKey. The correct usage is targetKey: "id". 
This option specifies the target key in the associated model (Project in this case).
This association implies that each Task instance belongs to one Project instance, and the relationship is 
established through the projectId field in the Task model, which corresponds to the id field in the Project model.

In summary, after defining these associations, you can use Sequelize's methods like Project.create() and 
Task.create() to create instances and establish relationships between projects and tasks. 
For example, when you create a task associated with a project, Sequelize will automatically set the 
projectId field in the Task table to link it to the appropriate project in the Project table.
*/