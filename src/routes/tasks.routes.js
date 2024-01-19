// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde task.controller.js
import { getActiveTasks, getInactiveTasks, findActiveTasks, findInactiveTasks, addTask, createTask, modifyTask, updateTask, inactivateTask, activateTask, viewTask} from '../controllers/task.controllers.js';

//Creo una instancia de la clase Router
const router = Router();

// creo las rutas
// obtener las tareas activos
router.get('/activeTasks',getActiveTasks) // llamo la función getActiveTasks
// obtener las tareas inactivos
router.get('/inactiveTasks', getInactiveTasks) // llamo la función getInactiveTasks
// buscar una tarea entre las tareas activos
router.post('/activeTask',findActiveTasks)  // to use the find form
// buscar una tarea entre las tareas inactivas
router.post('/inactiveTask',findInactiveTasks)  // to use the find form
// ingresar en el formulario una tarea nueva
router.get('/addTask', addTask);
// agregar a la base de datos la tarea ingresada al formulario con la ruta /addTask
router.post('/createTask',createTask) // llamo la función createProject

// Abrir formulario para modificar un tarea
router.get('/modifyTask/:id',modifyTask)
// modificar una tarea
router.post('/updateTask/:id',updateTask)

// pasar una tarea de activa a inactiva
router.post('/inactivateTask/:id',inactivateTask)
// pasar una tarea de inactiva a activa
router.post('/activateTask/:id',activateTask)

// obtener una tarea en base al id tomado del formulario de proyectos activos  
router.get('/viewTask/:id',viewTask)

// tengo que exportar las rutas
export default router;