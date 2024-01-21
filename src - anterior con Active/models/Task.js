// en la carpeta models se incluyen los archivos que crean las tablas de la base de datos
// para poder usar los Datatypes
import { DataTypes } from "sequelize"; 
// importo la instancia sequelize para poder comunicarme con la base de datos
import {sequelize} from '../database/database.js';

// creo la tabla tasks, se define como un objeto, y la exporto como Tasks
// para poder usarla en otros módulos
export const Task = sequelize.define(
    "task",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      comment: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );   