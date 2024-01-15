// Index solo arranca la aplicación
import app from "./app.js";
// importo la instancia sequelize para poder comunicarme con la base de datos que cree en el archivo database
import {sequelize} from "./database/database.js";

// define the port number from the environment variables or use port 4000
const port = process.env.PORT || 3000;

// creo una función main que sea asíncrona.
async function main() { 
    try {
     // para sincronizar las bases de datos con sequelize y quedarse escuchando en el puerto 4000   
    await sequelize.sync({alter:true});// apply the changes to the table without dropping the old one
    // await sequelize.sync({force:false});// During development to avoid to modify the tables
    app.listen(port);
    console.log(`Server is running on port ${port}`);   
    }catch(error) {
        console.error('Unable to connect to the database:',error);  
    }
}

main();




