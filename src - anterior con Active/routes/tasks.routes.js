// Rutas del formulario de tareas

// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde task.controller.js
import { getActiveTasks, getInactiveTasks, findActiveTasks, findInactiveTasks, addTask, createTask, modifyTask, updateTask, inactivateTask, activateTask, viewTask} from '../controllers/task.controllers.js';

//Creo una instancia de la clase Router
const router = Router();

// Creo las rutas
// Obtener las tareas activos
router.get('/activeTasks',getActiveTasks) // Llamo la función getActiveTasks
// Obtener las tareas inactivos
router.get('/inactiveTasks', getInactiveTasks) // Llamo la función getInactiveTasks
// Buscar una tarea entre las tareas activos
router.post('/activeTask',findActiveTasks)  
// Buscar una tarea entre las tareas inactivas
router.post('/inactiveTask',findInactiveTasks)  

// Ingresar en el formulario una tarea nueva
router.get('/addTask', addTask);
// Agregar a la base de datos la tarea ingresada al formulario con la ruta /addTask
router.post('/createTask',createTask) // llamo la función createTask

// Abrir formulario para modificar un tarea
router.get('/modifyTask/:id',modifyTask)
// Modificar una tarea en base al formulario anterior
router.post('/updateTask/:id',updateTask)

// Pasar una tarea de activa a inactiva
router.post('/inactivateTask/:id',inactivateTask)
// Pasar una tarea de inactiva a activa
router.post('/activateTask/:id',activateTask)

// Obtener una tarea en base al id tomado del formulario de proyectos activos  
router.get('/viewTask/:id',viewTask)

// Tengo que exportar las rutas
export default router;