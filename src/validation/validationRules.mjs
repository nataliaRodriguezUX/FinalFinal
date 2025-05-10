import { body } from 'express-validator';


export const validarPais = () => {
  return [
 /* body('nameOfficial')
    .if(body('nameOfficial').exists())
    .isLength({ min: 3, max: 90 })
    .withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.'),*/
   
    body('nativeNameOfficial')
    .if(body('nativeNameOfficial').exists())
    .isLength({ min: 3, max: 90 })
    .withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.'),

  body('capital')
    .if(body('capital').exists())
    .custom(value => {
      const arr = value.split(',').map(c => c.trim());
      if (arr.some(cap => cap.length < 3 || cap.length > 90)) {
        throw new Error('Cada capital debe tener entre 3 y 90 caracteres.');
      }
      return true;
    }),

  body('borders')
    .if(body('borders').exists())
    .custom(value => {
      const arr = value.split(',').map(b => b.trim());
      if (arr.some(codigo => !/^[A-Z]{3}$/.test(codigo))) {
        throw new Error('Cada código de frontera debe tener exactamente 3 letras mayúsculas.');
      }
      return true;
    }),
    body('area')
    .if(body('area').exists())
    .notEmpty().withMessage('El área no puede estar vacía.')
    .isFloat({ min: 0 })
    .withMessage('El área debe ser un número mayor o igual a 0.'),

body('population')
  .if(body('population').exists())
  .isInt({ min: 0 })
  .withMessage('La población debe ser un número entero mayor o igual a 0.'),

/*   body('area')
    .if(body('area').exists())
    .notEmpty().withMessage('El area no puede estar vacia, minimo 0.')
    .isFloat({ gt: 0 })
    .withMessage('El área debe ser un número positivo.'),

  body('population')
    .if(body('population').exists())
    .isInt({ gt: 0 })
    .withMessage('La población debe ser un número entero positivo.'), */

  body('gini')
    .if(body('gini').exists())
    .custom(value => {
      if (typeof value !== 'string') {
        throw new Error('El índice Gini debe ser una cadena JSON válida. Ejemplo: {"2021": 42.9}');
      }
  
      let giniObj;
      const sinEspacios = value.replace(/\s/g, '');
  
      try {
        giniObj = JSON.parse(sinEspacios);
      } catch {
        throw new Error('El índice Gini debe estar en formato JSON válido. Ejemplo: {"2021": 42.9}');
      }
  
      const claves = Object.keys(giniObj);
      const valores = Object.values(giniObj);
      const anioActual = new Date().getFullYear();
  
      if (claves.length === 0 || valores.length === 0) {
        throw new Error('El índice Gini no puede estar vacío.');
      }
  
      for (let i = 0; i < claves.length; i++) {
        const clave = claves[i];
        const valor = valores[i];
  
        if (!/^\d{4}$/.test(clave)) {
          throw new Error(`La clave "${clave}" debe ser un año de 4 dígitos.`);
        }
  
        const anio = parseInt(clave, 10);
        if (anio < 1900 || anio > anioActual) {
          throw new Error(`El año "${clave}" debe estar entre 1900 y ${anioActual}.`);
        }
  
        if (typeof valor !== 'number' || valor < 0 || valor > 100) {
          throw new Error(`El valor del índice Gini para el año ${clave} debe ser un número entre 0 y 100.`);
        }
      }
  
      return true;
    }),

    
  /*body('gini')
    .if(body('gini').exists())
    .custom(value => {
      let giniObj;
      const sinEspacios = value.replace(/\s/g, '');
      try {
        giniObj = JSON.parse(sinEspacios);
      } catch {
        throw new Error('El índice Gini debe estar en formato JSON válido. Ejemplo: {"2021": 42.9}');
      }

      const claves = Object.keys(giniObj);
      const valores = Object.values(giniObj);
      const anioActual = new Date().getFullYear();

      if (claves.length === 0 || valores.length === 0) {
        throw new Error('El índice Gini no puede estar vacío.');
      }

      for (let i = 0; i < claves.length; i++) {
        const clave = claves[i];
        const valor = valores[i];

        if (!/^\d{4}$/.test(clave)) {
          throw new Error(`La clave "${clave}" debe ser un año de 4 dígitos.`);
        }

        const anio = parseInt(clave, 10);
        if (anio < 1900 || anio > anioActual) {
          throw new Error(`El año "${clave}" debe estar entre 1900 y ${anioActual}.`);
        }

        if (typeof valor !== 'number' || valor < 0 || valor > 100) {
          throw new Error(`El valor del índice Gini para el año ${clave} debe ser un número entre 0 y 100.`);
        }
      }

      return true;
    }),*/

  body('creador')
    .if(body('creador').exists())
    .trim()
    .notEmpty().withMessage('El nombre del creador es obligatorioooooo.')
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/).withMessage('El nombre del creador solo debe contener letras y espacios.')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre del creador debe tener entre 3 y 50 caracteres.'),
  ];
}
  /*body('languages')
    .if(body('languages').exists())
    .custom(value => {
      let idiomas;
      try {
        idiomas = JSON.parse(value.replace(/\s/g, ''));
      } catch {
        throw new Error('El campo de idiomas debe ser un JSON válido. Ejemplo: {"spa":"Español"}');
      }

      const tieneEspañol = Object.keys(idiomas).some(cod => cod.toLowerCase() === 'spa');
      if (!tieneEspañol) {
        throw new Error('El campo de idiomas debe incluir el español (código "spa").');
      }

      return true;
    }),*/





/* se validan algunosssssssssssss
export const validarPais = () => [
  // name.nativeName.spa.official
  body('nameOfficial')
    .if(body('nameOfficial').exists())
    .isLength({ min: 3, max: 90 })
    .withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.'),

  body('capital')
    .if(body('capital').exists())
    .custom(value => {
      const arr = value.split(',').map(c => c.trim());
      if (arr.some(cap => cap.length < 3 || cap.length > 90)) {
        throw new Error('Cada capital debe tener entre 3 y 90 caracteres.');
      }
      return true;
    }),

  body('borders')
    .if(body('borders').exists())
    .custom(value => {
      const arr = value.split(',').map(b => b.trim());
      if (arr.some(codigo => !/^[A-Z]{3}$/.test(codigo))) {
        throw new Error('Cada código de frontera debe tener exactamente 3 letras mayúsculas.');
      }
      return true;
    }),

  body('area')
    .if(body('area').exists())
    .isFloat({ gt: 0 })
    .withMessage('El área debe ser un número positivo.'),

  body('population')
    .if(body('population').exists())
    .isInt({ gt: 0 })
    .withMessage('La población debe ser un número entero positivo.'),

  body('gini')
    .if(body('gini').exists())
    .custom(value => {
      let giniObj;
      const sinEspacios = value.replace(/\s/g, '');

      try {
        giniObj = JSON.parse(sinEspacios);
      } catch {
        throw new Error('El índice Gini debe estar en formato JSON válido. Ejemplo: {"2021": 42.9}');
      }

      const claves = Object.keys(giniObj);
      const valores = Object.values(giniObj);
      const anioActual = new Date().getFullYear();

      if (claves.length === 0 || valores.length === 0) {
        throw new Error('El índice Gini no puede estar vacío.');
      }

      for (let i = 0; i < claves.length; i++) {
        const clave = claves[i];
        const valor = valores[i];

        if (!/^\d{4}$/.test(clave)) {
          throw new Error(`La clave "${clave}" debe ser un año de 4 dígitos.`);
        }

        const anio = parseInt(clave, 10);
        if (anio < 1900 || anio > anioActual) {
          throw new Error(`El año "${clave}" debe estar entre 1900 y ${anioActual}.`);
        }

        if (typeof valor !== 'number' || valor < 0 || valor > 100) {
          throw new Error(`El valor del índice Gini para el año ${clave} debe ser un número entre 0 y 100.`);
        }
      }

      return true;
    }),

  body('creador')
    .if(body('creador').exists())
    .trim()
    .notEmpty().withMessage('El nombre del creador es obligatorio.')
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/).withMessage('El nombre del creador solo debe contener letras y espacios.')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre del creador debe tener entre 3 y 50 caracteres.'),
*/
    /********************************************************************** 
 * 
*/
/******************
 * *
 */
















 /* body('languages')
    .if(body('languages').exists())
    .custom(value => {
      let idiomas;
      try {
        idiomas = JSON.parse(value.replace(/\s/g, ''));
      } catch {
        throw new Error('El campo de idiomas debe ser un JSON válido. Ejemplo: {"spa":"Español"}');
      }

      const tieneEspañol = Object.keys(idiomas).some(cod => cod.toLowerCase() === 'spa');
      if (!tieneEspañol) {
        throw new Error('El campo de idiomas debe incluir el español (código "spa").');
      }

      return true;
    }),
  ];*/

  /*body('gini')
    .custom(value => {
      let giniObj;
      try {
        giniObj = JSON.parse(value);
      } catch {
        throw new Error('El índice Gini debe estar en formato JSON válido, ejemplo:"1784":53.9.');
      }

      const valores = Object.values(giniObj);
      if (valores.length === 0) {
        throw new Error('El índice Gini no puede estar vacío.');
      }

      if (valores.some(num => typeof num !== 'number' || num < 0 || num > 100)) {
        throw new Error('Cada valor de Gini debe ser un número entre 0 y 100.');
      }
*/
    

  // creador: requerido
   /* body('creador')
    .trim()
    .notEmpty()
    .withMessage('El nombre del creador es obligatorio.')
    .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/)
    .withMessage('El nombre del creador solo debe contener letras y espacios.')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre del creador debe tener entre 3 y 50 caracteres.'),*/

  /*body('creador')
    .trim()
    .notEmpty()
    .withMessage('El nombre del creador es obligatorio.')
    return true;
  }),*/
 /* body('languages')
    .custom(value => {
      if (!value) throw new Error('El campo de idiomas es obligatorio.');

      let idiomas;
      try {
        idiomas = JSON.parse(value.replace(/\s/g, ''));
      } catch {
        throw new Error('El campo de idiomas debe ser un JSON válido. Ejemplo: {"spa":"Español"}');
      }

      const tieneEspañol = Object.keys(idiomas).some(cod => cod.toLowerCase() === 'spa');
      if (!tieneEspañol) {
        throw new Error('El campo de idiomas debe incluir el español (código "spa").');
      }

      return true;
    }),
*/



 /* return [
    body('nombreSuperHeroe')
      .notEmpty().withMessage("Campo 'nombreSuperHeroe' obligatorio.")
      .isLength({ min: 3, max: 60 }).withMessage("Ingrese un nombre de superhéroe válido con una longitud entre 3 y 60 caracteres.")
      .trim(),

    body('nombreReal')
      .notEmpty().withMessage("Campo 'nombreReal' obligatorio.")
      .isLength({ min: 3, max: 60 }).withMessage("Ingrese un nombre real válido con una longitud entre 3 y 60 caracteres.")
      .trim(),

    body('edad')
      .notEmpty().withMessage("Campo 'edad' obligatorio.")
      .isInt({ min: 0 }).withMessage("Ingrese un número entero no negativo."),

    body('planetaOrigen')
      .optional()
      .isLength({ min: 1, max: 100 }).withMessage("Planeta de origen debe tener entre 1 y 100 caracteres.")
      .trim(),

    body('poderes')
      .notEmpty().withMessage("Campo 'poderes' obligatorio.")
      .custom(value => {
        if (!value || typeof value !== 'string') throw new Error("Poderes inválidos.");
        const poderesArray = value.split(',').map(p => p.trim()).filter(p => p.length >= 3 && p.length <= 60);
        if (poderesArray.length === 0) throw new Error("El campo poderes debe contener al menos un poder válido (entre 3 y 60 caracteres).");
        return true;
      }),

    body('debilidad')
      .optional()
      .custom(value => {
        if (typeof value !== 'string') return true;
        const debilidades = value.split(',').map(d => d.trim());
        if (debilidades.some(d => d.length < 1)) {
          throw new Error("Cada debilidad debe tener al menos 1 carácter.");
        }
        return true;
      }),

    body('aliados')
      .optional()
      .custom(value => {
        if (typeof value !== 'string') return true;
        const aliados = value.split(',').map(a => a.trim());
        if (aliados.some(a => a.length < 1)) {
          throw new Error("Cada aliado debe tener al menos 1 carácter.");
        }
        return true;
      }),

    body('enemigos')
      .optional()
      .custom(value => {
        if (typeof value !== 'string') return true;
        const enemigos = value.split(',').map(e => e.trim());
        if (enemigos.some(e => e.length < 1)) {
          throw new Error("Cada enemigo debe tener al menos 1 carácter.");
        }
        return true;
      }),

  ];*/
