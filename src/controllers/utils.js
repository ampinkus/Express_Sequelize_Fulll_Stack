// utils.js to get the path of the current directory and avoid to clutter the code in the .js files

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename); // la ruta completa del archivo utils 
const __dirname = path.dirname(__filename);
console.log(__dirname);  // el directorio donde está el archivo utils

export { __filename, __dirname };