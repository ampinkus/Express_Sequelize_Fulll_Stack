// aquí se programan las funciones de las rutas de la API
import path from "path";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";


// para capturar los errores colocamos todos los métodos en un try catch
// obtener todos los proyectos activos de la base de datos projects
export const index = async (req, res) => {
  res.render(path.join(__dirname, "../views/home/index.ejs"));
}