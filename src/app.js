// app es la aplicación y tiene la configuración de express y el servidor
// importo express
import express from 'express';
import morgan from "morgan";

// importo las rutas de project y task. Tengo que usar el .js porque son archivos
import projectRoutes from './routes/projects.routes.js';
import taskRoutes from './routes/tasks.routes.js';

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

// Export the app function using CommonJS syntax
export default app;