// aquí se programan las funciones de las rutas de la API
import path from "path";
// importo __filename y __dirname de utils para obtener la ruta del archivo actual
import { __filename, __dirname } from "./utils.js";

// Renderizo la pagina de inicio
export const index = async (req, res) => {
  res.render(path.join(__dirname, "../views/home/index.ejs"));
}