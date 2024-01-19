// aquí se programan las funciones de las rutas de la API
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from "../models/project.js";
import { Task } from "../models/Task.js";
import path from "path";
import { Op } from "sequelize";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// para capturar los errores colocamos todos los métodos en un try catch

// obtener todas las tareas activas de la base de datos Task
export const getActiveTasks = async (req, res) => {
  try {
    const { sort, order } = req.query; // get the status from the call of the API
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Tareas Activas";

    // Check if sort and order parameters are provided
    if (sort && order) {
      // Validate that the provided sort column is one of the allowed columns
      const allowedColumns = ["name", "done", "projectId", "description" ];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]]; // Set the custom sorting criteria
      } else {
        // Handle invalid sort column
        return res.status(400).send("Invalid sort column");
      }
    }

    const tasks = await Task.findAll({
      where: {
        active: 1, // Filter by active status
      },
      order: orderCriteria, // Use the custom sorting criteria
    });
    res.render(path.join(__dirname, "../views/tasks/activeTasks.ejs"), {
      tasks,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener todos las tareas inactivas de la base de datos task
export const getInactiveTasks = async (req, res) => {
  try {
    const { sort, order} = req.query; // get the status from the call of the API
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Tareas Inactivas";

    // Check if sort and order parameters are provided
    if (sort && order) {
      // Validate that the provided sort column is one of the allowed columns
      const allowedColumns = ["name", "priority", "description"];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]]; // Set the custom sorting criteria
      } else {
        // Handle invalid sort column
        return res.status(400).send("Invalid sort column");
      }
    }

    const projects = await Project.findAll({
      where: {
        active: 0, // Filter by active status
      },
      order: orderCriteria, // Use the custom sorting criteria
    });
    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find active tasks by Search in active tasks
export const findActiveTasks = async (req, res) => {
  try {
    // Get the search term
    let searchTerm = req.body.search;
    let titulo = "Tareas Activos";

    // Use Sequelize to find task with similar CORREGIR
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { priority: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 1, // Filter by active status
      },
    });

    // Render the 'activeTask' template with the retrieved tasks
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Find inactive task by Search in inactive tasks
export const findInactiveTasks = async (req, res) => {
  try {
    // Get the search term
    let searchTerm = req.body.search;
    let titulo = "Tareas Inactivas";

    // Use Sequelize to find projects with similar CORREGIR
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { priority: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 0, // Filter by inactive status
      },
    });

    // Render the 'inactiveTasks' template with the retrieved tasks  CORREGIR  
    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), { 
      projects,
      titulo,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Agregar una tarea
export const addTask = async (req, res) => {
  res.render(path.join(__dirname, "../views/projects/addProject.ejs"));
};

// crear una tarea nueva en la base de datos de tareas
export const createTask = async (req, res) => {
  try {
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Proyectos Activos";
    // se obtienen los datos del body
    // console.log(req.body);
    // quiero extraer los datos del body, uso un deconstruct
    const { name, priority, description, comment } = req.body;
    // guardo los datos enviados en la base, newProject representa la fila que se ha guardado
    // en la tabla projects. The Sequelize command await Project.create() is used to create a
    // new instance of the Project model and insert a new record into the corresponding table in the database.
    // The await keyword is used to wait for the asynchronous operation to complete before moving on to the next line of code.
    const newProject = await Project.create({
      name,
      priority,
      description,
      comment,
    });
    // renderizo la vista projects/activeProjects.ejs
    const projects = await Project.findAll({
      where: {
        active: 1, // Filter by active status
      },
      order: orderCriteria, // Use the custom sorting criteria
    });
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modificar una tarea de la base de datos tareas, presento en el formulario modifyTasks.ejs la tarea que se quiere modificar
export const modifyTask = async (req, res) => {
  try {
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Proyectos Activos"
    // Use Sequelize to find a user by ID
   const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });

    if (project) {
      // If the user is found, render the 'modifyProject' view
      res.render(path.join(__dirname, "../views/projects/modifyProject.ejs"), {
        project,
        titulo,
      });
    } else {
      // Handle the case where the user with the specified ID is not found
      res.status(404).send('User not found');
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error retrieving project:', error);
    res.status(500).send('Internal Server Error');
  }
};

// actualizo la tarea en base a los datos del formulario modifyTasks.ejs 
export const updateTask = async (req, res) => {
  try {
    // let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    // let titulo = "Proyectos Activos";
      // Use Sequelize to find a user by ID
   const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });
    const { name, priority, description, comment } = req.body;

    // Check if the task exists
    if (!project) {
      return res.status(404).send('User not found');
    }

    // Update the task
    await project.update({
      name,
      priority,
      description,
      comment,
    });
    // mostrar la versión actualizada de la tarea modificada en la tabla de tareas activos
    await getActiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
    });
    
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Pasar de activo a inactivo una tarea de la base de datos tareas
export const inactivateTask = async (req, res) => {
  try {
    // se obtiene el id de la tarea que se quiere desactivar
    const { id } = req.params;
    
    // Actualizar el valor de la columna 'active' a 0 en lugar de eliminar la tarea
    await Project.update({ active: 0 }, { where: { id } });
    // llamo a la vista tasks/activeTasks.ejs con las dos lineas de código siguientes:
    await getActiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pasar de inactivo a activo una tarea de la base de datos tareas
export const activateTask = async (req, res) => {
  try {
    // se obtiene el id de la tarea que se quiere activar
    const { id } = req.params;
    
    // Actualizar el valor de la columna 'active' a 0 en lugar de eliminar la tarea
    await Project.update({ active: 1 }, { where: { id } });
    // llamo a la vista tasks/inactiveTasks.ejs con las dos lineas de código siguientes:
    await getInactiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), {
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ver una tarea de la base de datos task
export const viewTask = async (req, res) => {
  try {
    // traigo el id desde req.params
    const { id } = req.params;
    // busco el proyecto con el id
    const project = await Project.findOne({ where: { id } });
    // si no encuentra el proyecto envío un error
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.render(path.join(__dirname, "../views/projects/viewProject.ejs"), {
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


