// aquí se programan las funciones de las rutas de la API
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from '../models/project.js';
import { Task } from "../models/Task.js";

// About to test the EJS template engine
export const home = (req, res) => {
  
  res.render('./projects/projects.ejs'); // renders the page about.ejs with the title "About"
}
  

// para capturar los errores colocamos todos los métodos en un try catch
// obtener todos los proyectos de la base de datos projects
export const getProjects = async (req, res) => {
  try {
    //test de un error
    // throw new Error('test error');
    const projects = await Project.findAll(); // buscar todos los proyectos
    res.json(projects);
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// crear un proyecto nuevo en la bas de datos de projects
export const createProject = async (req, res) => {
  try {
    // se obtienen los datos del body
    // console.log(req.body);
    // quiero extraer los datos del body, uso un deconstruct
  const { name, priority, description } = req.body;
  // guardo los datos enviados en la base, newProject representa la fila que se ha guardado 
  // en la tabla projects. The Sequelize command await Project.create() is used to create a 
  // new instance of the Project model and insert a new record into the corresponding table in the database. 
  const newProject = await Project.create(
    { name, 
      priority, 
      description 
    });
  res.json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modificar un proyecto de la base de datos projects
export const updateProject = async (req, res) => { 
  try {
      // se obtiene el id del proyecto que se quiere eliminar
      const { id } = req.params;
      // se obtienen los datos del body
      const { name, priority, description } = req.body;
      // se busca el proyecto con el id para mostrar el proyecto modificado
      const project = await Project.findByPk(id); // find by primary key 
      // se actualiza el proyecto con los datos del body, si un dato falta el mismo no se borra. 
      await Project.update({ name, priority, description }, { where: { id } });
      res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// eliminar un proyecto de la base de datos projects
export const deleteProject = async (req, res) => {
  try {
      // se obtiene el id del proyecto que se quiere eliminar
      const { id } = req.params; // we get the id from the URL: http://localhost:4000/projects/2 
      await Project.destroy({ where: { id } });
      res.sendStatus(204); // solo digo que todo salio bien
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}

// obtener un proyecto de la base de datos projects
export const getProject = async (req, res) => {
  try {  
    // traigo el id desde req.params
    const { id } = req.params;
    // busco el proyecto con el id
    const project = await Project.findOne({ where: { id } });
    // si no encuentra el proyecto envío un error
    if (!project) {
       return res.status(404).json({ message: 'Project not found' });
    }
    res.send(project);    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

//obtener todas las tareas que pertenecen a un proyecto
export async function getProjectTasks(req, res) {
  const { id } = req.params;
  try {
    const tasks = await Task.findAll({
      attributes: ["id", "projectId", "name", "done"],
      where: { projectId: id },
    });
    res.json(tasks);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}


/*
Different update methods
The choice between Method 1 and Method 2 depends on the specific requirements and preferences of your 
application. Both methods are valid and can be suitable in different scenarios. 
Let's explore the characteristics of each method:
### Method 1 (Updating using Sequelize Instance):

export async function updateTask(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      attributes: ["name", "projectId", "done", "id"],
      where: { id },
    });
    task.set(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

**Pros:**
1. **Granular Control:** Using Sequelize instance methods (like `set` and `save`) provides 
fine-grained control over the update process. You can selectively update specific fields based 
on the request body.
2. **Validation:** If you have Sequelize model validation logic, it will be automatically 
triggered when using instance methods, helping to maintain data integrity.

**Cons:**
1. **Multiple Database Queries:** This method involves two queries – one to find the 
existing record and another to update it. Depending on the size of your dataset, 
this may have a performance impact.


### Method 2 (Updating using `update`):

export const updateProject = async (req, res) => { 
  try {
    const { id } = req.params;
    const { name, priority, description } = req.body;
    const project = await Project.findByPk(id);
    await Project.update({ name, priority, description }, { where: { id } });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

**Pros:**
1. **Single Query:** Using `update` allows you to perform the update operation in a single query, 
potentially offering better performance.
2. **Simplicity:** This method may be perceived as more straightforward and concise.

**Cons:**
1. **Bypasses Instance Methods:** If you have logic in Sequelize instance methods that should 
be executed during an update, using `update` will bypass those methods.

### Considerations:
- **Use Case:** If you need fine-grained control and want to leverage Sequelize instance methods 
or have custom logic associated with updating a record, Method 1 might be more appropriate.
  
- **Performance:** If performance is a critical concern, and you don't need the benefits of 
Sequelize instance methods, Method 2 with a single `update` query might be preferred.

- **Validation:** Consider whether you want Sequelize model validation to be applied 
during the update process. If yes, Method 1 is more suitable.

Ultimately, choose the method that aligns with your application's requirements, maintainability, 
and performance considerations.

User
For the method 1 could you elaborate this and give me an example?
If you have Sequelize model validation logic, it will be automatically 
triggered when using instance methods, helping to maintain data integrity.

Certainly! Sequelize allows you to define validation rules for your model attributes using the `validate` 
option when defining a model. These validation rules are executed automatically when you call instance 
methods like `save()`. This helps ensure that the data stored in your database adheres to the 
specified rules, contributing to data integrity.
Here's an example of how you can define validation rules for a Sequelize model:

// Example Project model with validation
const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Project name cannot be null.',
      },
      len: {
        args: [3, 50],
        msg: 'Project name must be between 3 and 50 characters.',
      },
    },
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Project priority cannot be null.',
      },
      isInt: {
        msg: 'Priority must be an integer.',
      },
      min: {
        args: 1,
        msg: 'Priority must be at least 1.',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Description must be at most 255 characters.',
      },
    },
  },
});

// Example usage of the Project model
const createProject = async () => {
  try {
    // Creating a project with invalid data
    const invalidProject = await Project.create({
      name: 'A', // Fails length validation
      priority: 'High', // Fails type validation
      description: 'This is a very long description that exceeds the limit set by validation rules.',
    });

    // This code won't be reached due to validation errors
    console.log('Invalid project:', invalidProject.get());
  } catch (error) {
    // SequelizeValidationError will be thrown with details of validation errors
    console.error('Validation error:', error.errors);
  }
};

// Call the example function
createProject();

In this example:
- The `Project` model has three attributes: `name`, `priority`, and `description`.
- Validation rules are defined using the `validate` option for each attribute.
- If an attempt is made to create a project with invalid data, Sequelize will throw 
a `SequelizeValidationError` containing details about the validation errors.

By using Sequelize instance methods like `save()` or `set()`, these validation rules are 
automatically triggered, helping to maintain data integrity by ensuring that only valid 
data is stored in the database. If you were to update a project using the `set()` method, 
Sequelize would also validate the changes based on these rules before the `save()` method is called.

This ensures that your data adheres to the specified constraints, reducing the risk of storing 
inconsistent or incorrect data in the database.
*/
