// aquí se programan las funciones de las rutas de la API
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from "../models/project.js";
import { Task } from "../models/Task.js";
import path from "path";
import { Op } from "sequelize";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// para capturar los errores colocamos todos los métodos en un try catch
// obtener todos los proyectos activos de la base de datos projects

export const getActiveProjects = async (req, res) => {
  try {
    const { sort, order } = req.query; // get the status from the call of the API
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Proyectos Activos";

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

// obtener todos los proyectos inactivos de la base de datos projects
export const getInactiveProjects = async (req, res) => {
  try {
    const { sort, order} = req.query; // get the status from the call of the API
    let orderCriteria = [["name", "ASC"]]; // Default sorting criteria
    let titulo = "Proyectos Inactivos";

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

// Find User by Search in active projects
export const findActiveProject = async (req, res) => {
  try {
    // Get the search term
    let searchTerm = req.body.search;
    let titulo = "Proyectos Activos";

    // Use Sequelize to find projects with similar name, priority or description
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

    // Render the 'activeProjects' template with the retrieved projects
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

// Find project by Search in inactive project 
export const findInactiveProject = async (req, res) => {
  try {
    // Get the search term
    let searchTerm = req.body.search;
    let titulo = "Proyectos Inactivos";

    // Use Sequelize to find projects with similar name, priority or description
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

    // Render the 'inactiveProjects' template with the retrieved projects
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

//Agregar un proyecto mostrando la forma addProject
export const addProject = async (req, res) => {
  res.render(path.join(__dirname, "../views/projects/addProject.ejs"));
};

// crear un proyecto nuevo en la base de datos de projects
export const createProject = async (req, res) => {
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

// modificar un proyecto de la base de datos projects, presento en el formulario modifyProject.ejs el proyecto que se quiere modificar
export const modifyProject = async (req, res) => {
  try {
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

// actualizo el proyecto en base a los datos del formulario modifyProject.ejs 
export const updateProject = async (req, res) => {
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

    // Check if the user exists
    if (!project) {
      return res.status(404).send('User not found');
    }

    // Update the user
    await project.update({
      name,
      priority,
      description,
      comment,
    });
    // mostrar la versión actualizada del proyecto modificado en la tabla de proyectos activos
    await getActiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
    });
    
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Pasar de activo a inactivo un proyecto de la base de datos projects
export const inactivateProject = async (req, res) => {
  try {
    // se obtiene el id del proyecto que se quiere desactivar
    const { id } = req.params;
    
    // Actualizar el valor de la columna 'active' a 0 en lugar de eliminar el proyecto
    await Project.update({ active: 0 }, { where: { id } });
    // llamo a la vista projects/activeProjects.ejs con las dos lineas de código siguientes:
    await getActiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pasar de inactivo a activo un proyecto de la base de datos projects
export const activateProject = async (req, res) => {
  try {
    // se obtiene el id del proyecto que se quiere activar
    const { id } = req.params;
    
    // Actualizar el valor de la columna 'active' a 0 en lugar de eliminar el proyecto
    await Project.update({ active: 1 }, { where: { id } });
    // llamo a la vista projects/inactiveProjects.ejs con las dos lineas de código siguientes:
    await getInactiveProjects(req, res);
    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), {
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ver un proyecto de la base de datos projects
export const viewProject = async (req, res) => {
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
