// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde project.controller.js
import { getActiveProjects, getInactiveProjects, findActiveProject, findInactiveProject, addProject, createProject, updateProject, modifyProject, inactivateProject, activateProject, viewProject, getProjectTasks } from '../controllers/project.controller.js';

//Creo una instancia de la clase Router
const router = Router();

// creo las rutas
// obtener los proyectos activos
router.get('/activeProjects',getActiveProjects) // llamo la función getActiveProject
// obtener los proyectos inactivos
router.get('/inactiveProjects', getInactiveProjects) // llamo la función getInactiveProject
// buscar un proyecto entre los proyectos activos
router.post('/activeProjects',findActiveProject)  // to use the find form
// buscar un proyecto entre los proyectos inactivos
router.post('/inactiveProjects',findInactiveProject)  // to use the find form
// ingresar en el formulario un proyecto nuevo
router.get('/addProject', addProject);
// agregar a la base de datos el proyecto ingresado al formulario con la ruta /addProject
router.post('/createProject',createProject) // llamo la función createProject

// Abrir formulario para modificar un proyecto
router.get('/modifyProject/:id',modifyProject)
// modificar un proyecto
router.post('/updateProject/:id',updateProject)

// pasar un proyecto de activo a inactivo
router.post('/inactivateProject/:id',inactivateProject)
// pasar un proyecto de inactivo a activo
router.post('/activateProject/:id',activateProject)

// obtener un proyecto en base al id tomado del formulario de proyectos activos  
router.get('/viewProject/:id',viewProject)

//obtener todas las tareas que pertenecen a un proyecto
// router.get("/projects/:id/tasks", getProject);


// tengo que exportar las rutas
export default router;