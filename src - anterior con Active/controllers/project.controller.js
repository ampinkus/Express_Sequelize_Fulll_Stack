//En este controlador están las funciones de las rutas de project.routes
// tengo que traer los modelos de la base de datos para poder guardar los datos
import { Project } from "../models/project.js";
import { Task } from "../models/Task.js";
import path from "path";
import { Op } from "sequelize";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// para capturar los errores colocamos todos los métodos en un try-catch

// Obtener todos los proyectos activos de la base de datos projects
export const getActiveProjects = async (req, res) => {
  try {
    const { sort, order } = req.query; // Obtener el estatus de ordenamiento
    let orderCriteria = [["name", "ASC"]]; // Criterio de ordenamiento por defecto
    let titulo = "Proyectos Activos";

    // Comprobar si se proveen los parámetros de ordenamiento
    if (sort && order) {
      // Validar que la columna de ordenamiento sea una de las permitidas
      const allowedColumns = ["name", "priority", "description"];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]]; // Configurar el criterio de ordenamiento
      } else {
        // Manejar la columna de ordenamiento inválida
        return res.status(400).send("Invalid sort column");
      }
    }

    const projects = await Project.findAll({
      where: {
        active: 1, // Filtrar por proyectos activos
      },
      order: orderCriteria, // Usa el criterio de ordenamiento
    });
    // Mostramos la vista de proyectos activos
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los proyectos inactivos de la base de datos projects
// la función getInactiveProjects es casi idéntica a getActiveProjects
export const getInactiveProjects = async (req, res) => {
  try {
    const { sort, order} = req.query; 
    let orderCriteria = [["name", "ASC"]];
    let titulo = "Proyectos Inactivos";

    if (sort && order) {
      const allowedColumns = ["name", "priority", "description"];
      if (allowedColumns.includes(sort)) {
        orderCriteria = [[sort, order.toUpperCase()]];
      } else {
        return res.status(400).send("Invalid sort column");
      }
    }

    const projects = await Project.findAll({
      where: {
        active: 0, // Filtrar por proyectos inactivos
      },
      order: orderCriteria, 
    });
    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Buscar un proyecto activo según un criterio de búsqueda en la base de datos
export const findActiveProject = async (req, res) => {
  try {
    // Obtener el criterio de búsqueda
    let searchTerm = req.body.search;
    let titulo = "Proyectos Activos";

    // Usar sequelize para encontrar proyectos similares por nombre, prioridad o descripción
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { priority: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 1, // Filtrar por estado activo
      },
    });

    // Mostrar la vista de proyectos activos con el criterio de búsqueda
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    // Manejo de errores
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Buscar un proyecto inactivo según un criterio de búsqueda en la base de datos 
// la función findInactiveProject es casi idéntica a findActiveProject
export const findInactiveProject = async (req, res) => {
  try {
    let searchTerm = req.body.search;
    let titulo = "Proyectos Inactivos";

    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { priority: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
        active: 0, // Filtrar por estado inactivo
      },
    });

    res.render(path.join(__dirname, "../views/projects/inactiveProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    console.error("Error finding users:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Agregar un proyecto mostrando la forma addProject para ingresar la información
export const addProject = async (req, res) => {
  res.render(path.join(__dirname, "../views/projects/addProject.ejs"));
};

// Crear un proyecto nuevo en la base de datos de projects con lai información del formulario anterior
export const createProject = async (req, res) => {
  try {
    let orderCriteria = [["name", "ASC"]]; // criterio de ordenamiento por defecto
    let titulo = "Proyectos Activos";
    // se obtienen los datos del body quiero extraer los datos del body, uso un deconstruct
    const { name, priority, description, comment } = req.body;
    // guardo los datos enviados en la base, newProject representa la fila que se ha guardado
    // en la tabla projects. El comando Sequelize await Project.create() se utiliza para crear una nueva 
    // instancia del modelo Project e insertar un nuevo registro en la tabla correspondiente de la base de datos. 
    // La palabra clave await se utiliza para esperar a que la operación asíncrona se complete antes de pasar a 
    // la siguiente línea de código.
    const newProject = await Project.create({
      name,
      priority,
      description,
      comment,
    });
    // renderizo la vista projects/activeProjects.ejs
    const projects = await Project.findAll({
      where: {
        active: 1, // Filtror por proyectos activos
      },
      order: orderCriteria, //Uso el criterio de ordenamiento
    });
    res.render(path.join(__dirname, "../views/projects/activeProjects.ejs"), {
      projects,
      titulo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modificar un proyecto de la base de datos projects, presento en el formulario modifyProject.ejs 
// el proyecto que se quiere modificar
export const modifyProject = async (req, res) => {
  try {
    let titulo = "Proyectos Activos"
    // Uso Sequelize para encontrar un proyecto por su ID
   const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });

    if (project) {
      // Si se encontró el proyecto, renderizo la vista modifyProject.ejs
      res.render(path.join(__dirname, "../views/projects/modifyProject.ejs"), {
        project,
        titulo,
      });
    } else {
      // Manejo el caso de que no se encuentre el proyecto
      res.status(404).send('User not found');
    }
  } catch (error) {
    // Manejo el caso de error en la base de datos
    console.error('Error retrieving project:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Actualizo el proyecto en base a los datos del formulario modifyProject.ejs 
export const updateProject = async (req, res) => {
  try {
      // Uso Sequelize para encontrar un proyecto por su ID
   const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });
    const { name, priority, description, comment } = req.body;
    //  Compruebo si se encontró el proyecto
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Actualizo el proyecto
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
    // Manejo el error en la base de datos
    console.error('Error updating project:', error);
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
    
    // Actualizar el valor de la columna 'active' a 1 
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
    // Muestro la vista projects/viewProject.ejs
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
