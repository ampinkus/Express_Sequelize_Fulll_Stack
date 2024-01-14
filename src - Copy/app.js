// app es la aplicación y tiene la configuración de express y el servidor
// importo express
import express from 'express';
import morgan from "morgan";
import { dirname } from 'path';  // Import the 'dirname' function
import path from 'path';  // Import the 'path' module
import { fileURLToPath } from 'url';  // Import the 'fileURLToPath' function

// importo las rutas de project y task. Tengo que usar el .js porque son archivos
import projectRoutes from './routes/projects.routes.js';
import taskRoutes from './routes/tasks.routes.js';

// define the filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//creo una app con express
const app = express();

// middlewares
// cada vez que le mando al servidor un dato en formato JSON lo guarda en un req.body
app.use(express.json());  
// log de las peticiones
app.use(morgan("dev"));

// quiero que app use las rutas
app.use(projectRoutes);
app.use(taskRoutes);

//settings
app.set('views', path.join(__dirname, 'views'));  // Set the view path
app.set('view engine', 'ejs');  // Set the view engine to EJS

// Export the app function using CommonJS syntax
export default app;