// app es la aplicación y tiene la configuración de express y el servidor
// importo express
import express from 'express';
import morgan from "morgan";
import path from 'path';  // Import the 'path' module
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from './utils.js';

// Tengo que importar todas las rutas de la API. Tengo que usar el .js porque son archivos
import projectRoutes from './routes/projects.routes.js';
import taskRoutes from './routes/tasks.routes.js';
import homeRoutes from './routes/home.routes.js';

//creo una app con express
const app = express();

// middlewares
// cada vez que le mando al servidor un dato en formato JSON lo guarda en un req.body
app.use(express.json());  
// log de las peticiones
app.use(morgan("dev"));
// Add this middleware to serve static files (styles.css, images....)
app.use('/public', express.static(path.join(__dirname, 'public')));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));


// quiero que app use las rutas
app.use(projectRoutes);
app.use(taskRoutes);
app.use(homeRoutes);

//settings
app.set('views', path.join(__dirname, 'views'));  // Set the view path
app.set('view engine', 'ejs');  // Set the view engine to EJS

// Export the app function using CommonJS syntax
export default app;