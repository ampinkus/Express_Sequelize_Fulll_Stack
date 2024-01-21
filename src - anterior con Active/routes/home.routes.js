// Ruta para la página de inicio
// tengo que importar e instanciar la función router
import { Router } from 'express';
// tengo que importar los controladores de las rutas desde project.controller.js
import { index } from '../controllers/home.controller.js';

//Creo una instancia de la clase Router
const router = Router();

// creo las rutas
// obtener los proyectos activos
router.get('/',index) // llamo la función index

// tengo que exportar las rutas
export default router;