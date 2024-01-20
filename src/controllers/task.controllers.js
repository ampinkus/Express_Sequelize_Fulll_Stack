// aquí se programan las funciones de las rutas de la API
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from "../models/project.js";
import { Task } from "../models/Task.js";
import path from "path";
import { Op } from "sequelize";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// para capturar los errores colocamos todos los métodos en un try catch

// obtener todas las tareas activas de la base de datos tasks
export const getActiveTasks = async (req, res) => {
  try {
    const { sort, order } = req.query; // obtener la información para ordenar las tareas
    let orderCriteria = [["name", "ASC"]]; // Ordenamiento por defecto
    let titulo = "Tareas Activas";

    // Controlo si los parámetros de ordenamiento son proporcionados
    if (sort && order) {
      // Validar que la columna de ordenamiento sea una de las permitidas
      const allowedColumns = ["name", "done", "projectId", "description" ];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]]; // configurar el criterio de ordenamiento
      } else {
        // Si la columna de ordenamiento inválida
        return res.status(400).send("Invalid sort column");
      }
    }

    const tasks = await Task.findAll({
      where: {
        active: 1, // Filtrar por estado activo
      },
      order: orderCriteria, // usar el criterio de ordenamiento
    });
    res.render(path.join(__dirname, "../views/tasks/activeTasks.ejs"), {
      tasks,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener todos las tareas inactivas de la base de datos tasks
export const getInactiveTasks = async (req, res) => {
  try {
    const { sort, order } = req.query; // para el ordenamiento se sigue el procedimiento de la API anterior
    let orderCriteria = [["name", "ASC"]]; 
    let titulo = "Tareas Inactivas";


    if (sort && order) {
      const allowedColumns = ["name", "done", "projectId", "description" ];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]]; 
      } else {
        return res.status(400).send("Invalid sort column");
      }
    }

    const tasks = await Task.findAll({
      where: {
        active: 0, // Filtrar por estado inactivo
      },
      order: orderCriteria,
    });
    res.render(path.join(__dirname, "../views/tasks/inactiveTasks.ejs"), {
      tasks,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Búsqueda en la página de tareas activas
export const findActiveTasks = async (req, res) => {
  try {
    // Obtener el término de búsqueda
    let searchTerm = req.body.search;
    let titulo = "Tareas Activas";

    // Usa sequelize para encontrar proyectos con similar nombre, Id de Proyecto o descripción
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { projectId: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 1, // Filtrar por estado activo
      },
    });

    // Renderizar las tareas activas con el resultado de la búsqueda y agregando el título
    res.render(path.join(__dirname, "../views/tasks/activeTasks.ejs"), {
      tasks,
      titulo,
    });
  } catch (error) {
    // manejar los errores que puedan ocurrir durante la consulta a la base de datos
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Búsqueda en la página de tareas inactivas
export const findInactiveTasks = async (req, res) => {
  try {
    // La implementación es similar a la API anterior
    let searchTerm = req.body.search;
    let titulo = "Tareas Inactivas";

    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { projectId: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 1, // Filtrar por estado activo
      },
    });
    res.render(path.join(__dirname, "../views/tasks/inactiveTasks.ejs"), {
      tasks,
      titulo,
    });
  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Agregar una tarea mostrando la forma addTask
export const addTask = async (req, res) => {
  res.render(path.join(__dirname, "../views/tasks/addTask.ejs"));
};

// crear una tarea nueva en la base de datos de tareas
export const createTask = async (req, res) => {
  try {
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Tareas Activas";
    // se obtienen los datos del body
    // console.log(req.body);
    // quiero extraer los datos del body, uso un deconstruct
    const { name, projectId, description, comment } = req.body;
    // guardo los datos enviados en la base, newProject representa la fila que se ha guardado
    // en la tabla projects. The Sequelize command await Project.create() is used to create a
    // new instance of the Project model and insert a new record into the corresponding table in the database.
    // The await keyword is used to wait for the asynchronous operation to complete before moving on to the next line of code.
    const newTask = await Task.create({
      name,
      projectId,
      description,
      comment,
    });
    // renderizo la vista projects/activeProjects.ejs
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

// modificar una tarea de la base de datos tareas, presento en el formulario modifyTasks.ejs la tarea que se quiere modificar
export const modifyTask = async (req, res) => {
  try {
    let titulo = "Tareas Activas"
    // Use Sequelize to find a user by ID
   const task = await Task.findOne({
    where: {
      id: req.params.id,
    },
  });

    if (task) {
      // If the user is found, render the 'modifyProject' view
      res.render(path.join(__dirname, "../views/tasks/modifyTask.ejs"), {
        task,
        titulo,
      });
    } else {
      // Handle the case where the user with the specified ID is not found
      res.status(404).send('Task not found');
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error('Error retrieving task:', error);
    res.status(500).send('Internal Server Error');
  }
};

// actualizo la tarea en base a los datos del formulario modifyTasks.ejs 
export const updateTask = async (req, res) => {
  try {
    // let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    // let titulo = "Proyectos Activos";
      // Use Sequelize to find a user by ID
   const task = await Task.findOne({
    where: {
      id: req.params.id,
    },
  });
    const { name, projectId, description, comment } = req.body;

    // Check if the task exists
    if (!task) {
      return res.status(404).send('Task not found');
    }

    // Update the task
    await task.update({
      name,
      projectId,
      description,
      comment,
    });
    // mostrar la versión actualizada de la tarea modificada en la tabla de tareas activas
    await getActiveTasks(req, res);
    res.render(path.join(__dirname, "../views/tasks/activeTasks.ejs"), {
    });
    
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating task:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Pasar de activo a inactivo una tarea de la base de datos tareas
export const inactivateTask = async (req, res) => {
  try {
    // se obtiene el id de la tarea que se quiere desactivar
    const { id } = req.params;
    
    // Actualizar el valor de la columna 'active' a 0 en lugar de eliminar la tarea
    await Task.update({ active: 0 }, { where: { id } });
    // llamo a la vista tasks/activeTasks.ejs con las dos lineas de código siguientes:
    await getActiveTasks(req, res);
    res.render(path.join(__dirname, "../views/tasks/activeTasks.ejs"), {
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
    await Task.update({ active: 1 }, { where: { id } });
    // llamo a la vista tasks/inactiveTasks.ejs con las dos lineas de código siguientes:
    await getInactiveTasks(req, res);
    res.render(path.join(__dirname, "../views/tasks/inactiveTasks.ejs"), {
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
    const task = await Task.findOne({ where: { id } });
    // si no encuentra el proyecto envío un error
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.render(path.join(__dirname, "../views/tasks/viewTask.ejs"), {
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


