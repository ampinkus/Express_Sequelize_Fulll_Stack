// aquí se programan las funciones de las rutas de la API
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from "../models/project.js";
import { Task } from "../models/Task.js";
import path from "path";
import { Op } from "sequelize";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// About to test the EJS template engine
export const home = (req, res) => {
  res.render("index.ejs"); // renders the page index.ejs
};

// para capturar los errores colocamos todos los métodos en un try catch
// obtener todos los proyectos activos de la base de datos projects
export const getActiveProjects = async (req, res) => {
  try {
    const { sort, order, activo } = req.query; // get the status from the call of the API
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
    const { sort, order, activo } = req.query; // get the status from the call of the API
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

// Find User by Search in active users
export const findActiveUser = async (req, res) => {
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

    // Render the 'activeProjects' template with the retrieved users
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

// Find User by Search in inactive users
export const findInactiveUser = async (req, res) => {
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

    // Render the 'inactiveProjects' template with the retrieved users
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

// Render the addProject.ejs file
export const addProject = async(req, res) => {
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
    const { name, priority, description } = req.body;
    // guardo los datos enviados en la base, newProject representa la fila que se ha guardado
    // en la tabla projects. The Sequelize command await Project.create() is used to create a
    // new instance of the Project model and insert a new record into the corresponding table in the database.
    const newProject = await Project.create({ name, priority, description});
    const projects = await Project.findAll({
      where: {
        active: 1, // Filter by active status
      },
      order: orderCriteria, // Use the custom sorting criteria
    });
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    })
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
};

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
};

// obtener un proyecto de la base de datos projects
export const getProject = async (req, res) => {
  try {
    // traigo el id desde req.params
    const { id } = req.params;
    // busco el proyecto con el id
    const project = await Project.findOne({ where: { id } });
    // si no encuentra el proyecto envío un error
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.send(project);
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
