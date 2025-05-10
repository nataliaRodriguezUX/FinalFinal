// importar librerías
import express from "express";

import mongoose from "mongoose";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;
// 1. Definimos el esquema y modelo de País
const paisSchema = new mongoose.Schema(
  {
    name: {
      common: { type: String },
      official: { type: String, required: true },

      nativeName: {
        type: Map,
        of: {
          official: { type: String },
          common: { type: String },
        },
      },
    },
    independent: { type: Boolean },
    status: { type: String },
    unMember: { type: Boolean },
    currencies: {
      type: Map,
      of: {
        name: { type: String },
        symbol: { type: String },
      },
    },
    capital: { type: [String], require: true },

    region: { type: String },
    subregion: { type: String },
    languages: {
      type: Map,
      of: String,
    },
    latlng: {
      type: [Number],
      validate: {
        validator: (v) => v.length === 2,
        message:
          "latlng debe tener exactamente dos elementos: [latitud, longitud]",
      },
    },
    landlocked: { type: Boolean },
    borders: { type: [String], required: true },

    area: { type: Number, required: true },

    // emoji 🇦🇷
    /*flag: {
        type: String,
        validate: {
          validator: function(value) {
            return /^\p{Emoji}$/u.test(value); // Solo acepta un único emoji
          },
          message: props => `${props.value} no es un emoji válido`
        },
      },*/
    flag: {
      type: String,
      validate: {
        validator: (value) => /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(value),
        message: (props) => `${props.value} no es un emoji válido`,
      },
      // required: true
    },

    maps: {
      googleMaps: { type: String },
      openStreetMaps: { type: String },
    },
    population: { type: Number, required: true },
    gini: {
      type: Map,
      of: Number,
      // required:true
      // le saco el requerido, porque en la base no todos tienen y me esta frenando
      //esta porqueriaaaaaaaaaaaaaa :(
    },

    fifa: { type: String },
    timezones: { type: [String], required: true },

    continents: [String],
    /* flags: {
        png: { type: String },
        svg: { type: String },
        alt: { type: String }
      },*/
    flags: {
      png: {
        type: String,
        required: true,
        match: /^https?:\/\/.+\.(png)$/i, // verifica que sea URL terminada en .png
      },
      svg: {
        type: String,
        required: true,
        match: /^https?:\/\/.+\.(svg)$/i, // verifica que sea URL terminada en .svg
      },
      alt: {
        type: String,
      },
    },

    startOfWeek: { type: String },
    capitalInfo: {
      latlng: {
        type: [Number],
        validate: {
          validator: (v) => v.length === 2,
          message:
            "capitalInfo.latlng debe tener exactamente dos elementos: [latitud, longitud]",
        },
      },
    },
    creador: { type: String, required: true },
  },
 // { collection: "paises" }
);

const Pais = mongoose.model("Pais", paisSchema, "Grupo-08");

//  conectandoooo a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://Grupo-08:grupo08@cursadanodejs.ls9ii.mongodb.net/Node-js"
    );
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.log("Error al conectar a MongoDB", error);
    process.exit(1);
  }
}

//  proceso  los paíseeees
async function procesarPaises() {
  const respuesta = await fetch("https://restcountries.com/v3.1/all");
  const paises = await respuesta.json();

  const paisesEspanol = paises.filter(
    (pais) => pais.languages && pais.languages.spa
  );

 /// cargo em un Array los att a eliminar
  const propiedadesAEliminar = [
    "translations",
    "tld",
    "cca2",
    "ccn3",
    "cca3",
    "cioc",
    "idd",
    "altSpellings",
    "car",
    "coatOfArms",
    "postalCode",
    "demonyms",
  ];
  // me  aseguro de que contenga al menos 1 de los lenjuajes: español
  const paisesProcesados = paisesEspanol.map((pais) => {
    const nuevoPais = { ...pais };
    propiedadesAEliminar.forEach((prop) => {
      delete nuevoPais[prop];
    });
    nuevoPais.creador = "Nata"; // Nombre de miiiiiiiiii
    return nuevoPais;
  });

  return paisesProcesados;
}

//  Guardar los países en MongoDB
async function guardarPaisesEnDB() {
  await connectDB();

  const paises = await procesarPaises();

  try {
    // await Pais.deleteMany({}); // limpia la colección antes
    await Pais.insertMany(paises);
    console.log("Paises insertados okissss, en la bd");
  } catch (error) {
    console.error(" Error insertando paíseeeees:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Se guardan los paises consmidos de la api
guardarPaisesEnDB();

// Endpoint que al fin no use porque al ejecutar, no hizo falta
/*
app.get("/procesar-paises", async (req, res) => {
  try {
    await procesarPaises();
    res.send("Países procesados y guardadooooos en MongoDB");
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Error procesaaaaando países");
  }
});*/


//// levando el  servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(` Servidor escuchando en http://localhost:${PORT}`);
});







//este fue el primer test de codigoooooo


/*import express from 'express';
import fetch from 'node-fetch';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

// 1. Definir esquema de Mongoose
const paisSchema = new mongoose.Schema({}, { strict: false });
const Pais = mongoose.model('Pais', paisSchema);

// 2. Conectar a MongoDB
export async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://Grupo-08:grupo08@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('Conexión exitosa a MongoDB');
    } catch  (error) {
        console.log('Error al conectar a MongoDB', error);
        process.exit(1)
    }
}


// 3. Función para procesar países
async function procesarPaises() {
  const respuesta = await fetch('https://restcountries.com/v3.1/all');
  const paises = await respuesta.json();
  //con esto me aseguro de que spa exista y no este vacio
  const paisesEspanol = paises.filter(pais => pais.languages && pais.languages.spa && pais.languages.spa.trim() !== '');

  //const paisesEspanol = paises.filter(pais => pais.languages && pais.languages.spa);

  const propiedadesAEliminar = [
    'translations', 'tld', 'cca2', 'ccn3', 'cca3', 'cioc', 'idd', 'altSpellings',
    'car', 'coatOfArms', 'postalCode', 'demonyms'
  ];

  const paisesProcesados = paisesEspanol.map(pais => {
    const nuevoPais = { ...pais };
    propiedadesAEliminar.forEach(prop => {
      delete nuevoPais[prop];
    });
    nuevoPais.creador = "Nata"; // Solicitado por Martin :)
    return nuevoPais;
  });

  //await Pais.deleteMany({}); // Limpiar colección antes de insertar
  await Pais.insertMany(paisesProcesados);
}

// 4. Endpoint
app.get('/procesar-paises', async (req, res) => {
  try {
    await procesarPaises();
    res.send('✅ Países procesados y guardados en MongoDB');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('❌ Error procesando países');
  }
});

// 5. Arrancar servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
/*
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});*/
