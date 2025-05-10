import mongoose from 'mongoose' ;
const paisSchema = new mongoose.Schema(

{
    name: {
      common: { type: String },
      official: { type: String },

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
      type: [Number]
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
      type: String
     /* validate: {
        validator: (value) => /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(value),
        message: (props) => `${props.value} no es un emoji válido`,
      },*/
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
      validate: {
        validator: function (giniObj) {
          const valores = Array.from(giniObj.values());
          return valores.length > 0 && valores.every(v => v >= 0 && v <= 100);
        },
        message: 'El campo Gini debe tener al menos un valor válido entre 0 y 100.'
      }
    },
   // gini: {
     // type: Map,
      //of: Number,
      // required:true
      // le saco el requerido, porque en la base no todos tienen y me esta frenando
      //esta porqueriaaaaaaaaaaaaaa :(
   // },

    fifa: { type: String },
    timezones: { type: [String] },

    continents: [String],
    /* flags: {
        png: { type: String },
        svg: { type: String },
        alt: { type: String }
      },*/
    flags: {
      png: {
        type: String,
       // required: true,
        match: /^https?:\/\/.+\.(png)$/i, // verifica que sea URL terminada en .png
      },
      svg: {
        type: String,
      //  required: true,
        match: /^https?:\/\/.+\.(svg)$/i, // verifica que sea URL terminada en .svg
      },
      alt: {
        type: String,
      },
    },

    startOfWeek: { type: String },
    capitalInfo: {
      latlng: {
        type: [Number]
       /* validate: {
          validator: (v) => v.length === 2,
          message:
            "capitalInfo.latlng debe tener exactamente dos elementos: [latitud, longitud]",
        },*/
      },
    },
    creador: { type: String, required: true },
  },
 // sesria { collection: "paises" } pero tengo que organizar los docmentos en la misma coleccion
);
const Pais = mongoose.model('Pais', paisSchema, 'Grupo-08');
export  default Pais;




