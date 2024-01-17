// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde project.controller.js
import { getActiveProjects, getInactiveProjects, findActiveUser,findInactiveUser,addProject, createProject, updateProject,modifyProject, deleteProject, viewProject, getProjectTasks, home } from '../controllers/project.controller.js';

//Creo una instancia de la clase Router
const router = Router();

// creo las rutas
// obtener los proyectos activos
router.get('/activeProjects',getActiveProjects) // llamo la función getActiveProject
// obtener los proyectos inactivos
router.get('/inactiveProjects', getInactiveProjects) // llamo la función getInactiveProject
// buscar un proyecto entre los proyectos activos
router.post('/activeProjects',findActiveUser)  // to use the find form
// buscar un proyecto entre los proyectos inactivos
router.post('/inactiveProjects',findInactiveUser)  // to use the find form
// ingresar en el formulario un proyecto nuevo
router.get('/addProject', addProject);
// agregar a la base de datos el proyecto ingresado al formulario con la ruta /addProject
router.post('/createProject',createProject) // llamo la función createProject

// Abrir formulario para modificar un proyecto
router.get('/modifyProject/:id',modifyProject)
// modificar un proyecto
router.post('/updateProject/:id',updateProject)
// eliminar un proyecto

router.delete('/deleteProject/:id',deleteProject)
// obtener un proyecto en base al id tomado del formulario de proyectos activos  
router.get('/viewProject/:id',viewProject)

//obtener todas las tareas que pertenecen a un proyecto
// router.get("/projects/:id/tasks", getProject);

// probar EJS
router.get("/", home);

// tengo que exportar las rutas
export default router;