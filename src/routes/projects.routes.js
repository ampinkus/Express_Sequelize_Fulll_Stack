// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde project.controller.js
import { getProjects, createProject, updateProject, deleteProject, getProject, getProjectTasks, home } from '../controllers/project.controller.js';

//Creo una instancia de la clase Router
const router = Router();

// creo las rutas
// obtener los proyectos
router.get('/projects',getProjects) // llamo la función getProject
// crear un proyecto
router.post('/projects',createProject) // llamo la función createProject
// modificar un proyecto
router.put('/projects/:id',updateProject)
// eliminar un proyecto
router.delete('/projects/:id',deleteProject)
// obtener un proyecto con su id
router.get('/projects/:id',getProject)

//obtener todas las tareas que pertenecen a un proyecto
router.get("/projects/:id/tasks", getProjectTasks);

// probar EJS
router.get("/", home);

// tengo que exportar las rutas
export default router;