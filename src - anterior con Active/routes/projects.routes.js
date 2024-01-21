// Rutas para la página de Proyectos
// tengo que importar e instanciar el modulo router de express
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde project.controller.js
import { getActiveProjects, getInactiveProjects, findActiveProject, findInactiveProject, addProject, createProject, updateProject, modifyProject, inactivateProject, activateProject, viewProject, getProjectTasks } from '../controllers/project.controller.js';

//Creo una instancia de la clase Router
const router = Router();

// Creo las rutas
// Obtener los proyectos activos
router.get('/activeProjects',getActiveProjects) // llamo la función getActiveProject
// Obtener los proyectos inactivos
router.get('/inactiveProjects', getInactiveProjects) // llamo la función getInactiveProject
// Buscar un proyecto entre los proyectos activos
router.post('/activeProjects',findActiveProject)  
// Buscar un proyecto entre los proyectos inactivos
router.post('/inactiveProjects',findInactiveProject) 

// Ingresar en el formulario un proyecto nuevo
router.get('/addProject', addProject);
// Agregar a la base de datos el proyecto ingresado al formulario con la ruta /addProject
router.post('/createProject',createProject) 

// Abrir formulario para modificar un proyecto
router.get('/modifyProject/:id',modifyProject)
// Modificar un proyecto
router.post('/updateProject/:id',updateProject)

// Pasar un proyecto de activo a inactivo
router.post('/inactivateProject/:id',inactivateProject)
// Pasar un proyecto de inactivo a activo
router.post('/activateProject/:id',activateProject)

// Obtener un proyecto en base al id tomado del formulario de proyectos activos  
router.get('/viewProject/:id',viewProject)

// tengo que exportar las rutas
export default router;