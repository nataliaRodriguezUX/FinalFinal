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
    .withMessage('El nombre oficial debe tener entre 3 y 90 letras.'),

   body('capital')
  .if(body('capital').exists()) // Solo aplica la validación si 'capital' existe en el cuerpo de la solicitud.
  .custom(value => {
    // Verifica si el valor es null, undefined o vacío.
    if (value === null || value === undefined || value.trim() === '') {
      throw new Error('El campo "capital" es obligatorio y no puede estar vacío.');
    }

    // Verifica que el valor sea una cadena de texto.
    if (typeof value !== 'string') {
      throw new Error('El campo "capital" debe ser una cadena de texto.');
    }

    // Validación de caracteres permitidos: solo letras, comas y espacios.
    const caracteresValidos = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ,\s]+$/;
    if (!caracteresValidos.test(value)) {
      throw new Error('El campo "capital" solo puede contener letras, espacios y comas.');
    }

    // Separar las capitales por comas y limpiar espacios adicionales.
    const arr = value.split(',').map(c => c.trim());

    // Verifica que no haya capitales vacías entre las comas.
    if (arr.some(cap => cap === '')) {
      throw new Error('No puede haber capitales vacías (como "Lima,,Quito").');
    }

    // Verifica que cada capital tenga entre 3 y 90 caracteres.
    if (arr.some(cap => cap.length < 3 || cap.length > 90)) {
      throw new Error('Cada capital debe tener entre 3 y 90 caracteres.');
    }

    // Si todas las validaciones pasan, retorna true.
    return true;
  }),
    

  body('borders')
    .if(body('borders').exists())
    .custom(value => {
      // Divide la cadena de texto de capital en un array, 
      // usando las comas como separadores, y elimina los espacios extra en cada capital.
      const arr = value.split(',').map(b => b.trim());
     // Verifica si alguna de las capitales tiene una longitud 
     // menor a 3 caracteres o mayor a 90 caracteres.
      if (arr.some(codigo => !/^[A-Z]{3}$/.test(codigo))) {
        throw new Error('Cada código de frontera debe tener exactamente 3 letras MAYUSCULAS.');
      }
      return true;
    }),
   body('area')
  .if(body('area').exists())  // Solo valida si 'area' está presente en la solicitud
  .custom(value => {
    // Verifica si el valor es undefined, null o está vacío
    if (value === undefined || value === null || value.trim() === '') {
      throw new Error('El campo "area" es obligatorio y no puede estar vacío.');
    }

    // Verifica que el valor sea un número flotante válido
    if (isNaN(value)) {
      throw new Error('El campo "area" debe ser un número válido.');
    }

    // Verifica que el valor sea un número flotante (que puede ser decimal)
    if (!Number(value) || isNaN(parseFloat(value))) {
      throw new Error('El campo "area" debe ser un número flotante.');
    }

    // Verifica que el valor sea mayor o igual a 0
    if (Number(value) < 0) {
      throw new Error('El área debe ser un número mayor o igual a 0.');
    }

    return true;
  }),

  body('population')
  .if(body('population').exists())
  .custom(value => {
    // Verifica que el valor sea un número válido
    if (isNaN(value)) {
      throw new Error('La población debe ser un número válido.');
    }

    // Verifica que el valor sea un número entero
    if (!Number.isInteger(Number(value))) {
      throw new Error('La población debe ser un número entero.');
    }

    // Verifica que la población sea mayor o igual a 0
    if (Number(value) < 0) {
      throw new Error('La población debe ser un número entero mayor o igual a 0.');
    }

    return true;
  }),

 /* Verifica que gini sea una cadena de texto que contenga un JSON válido.
  Si no es un JSON válido, lanza un error con el mensaje 'El índice Gini debe ser una cadena JSON válida.'.
  Luego, valida que el JSON contenga años entre 1900 y el año actual, 
  y que los valores sean números entre 0 y 100.
  Si alguna validación falla, lanza el error correspondiente.*/

  body('gini')
  .if(body('gini').exists()) // Aplica solo si 'gini' existe
  .custom(value => {
    let giniObj;

    // Si el valor es un string, intenta parsearlo (caso: formulario HTML o JSON como string)
    if (typeof value === 'string') {
      if (value === '') {
        throw new Error('El índice Gini no puede estar vacío.');
      }
      try {
        giniObj = JSON.parse(value);
      } catch (error) {
        throw new Error('El índice Gini debe estar en formato JSON válido. Ejemplo: {"2021": 42.9}');
      }
    } else if (typeof value === 'object' && value !== null) {
      // Si el valor es un objeto válido (caso: Postman)
      giniObj = value;
    } else {
      throw new Error('El índice Gini debe ser un objeto JSON válido.');
    }

    const claves = Object.keys(giniObj);
    const valores = Object.values(giniObj);
    const anioActual = new Date().getFullYear();

    // Verificar que no esté vacío
    if (claves.length === 0 || valores.length === 0) {
      throw new Error('El índice Gini no puede estar vacío.');
    }

    // Validar las claves (años) y valores (índices Gini)
    for (let i = 0; i < claves.length; i++) {
      const clave = claves[i];
      const valor = valores[i];

      // Verifica que las claves sean años válidos (4 dígitos)
      if (!/^\d{4}$/.test(clave)) {
        throw new Error(`La clave "${clave}" debe ser un año de 4 dígitos.`);
      }

      const anio = parseInt(clave, 10);

      // Verifica que el año esté dentro del rango válido (1900 - año actual)
      if (anio < 1900 || anio > anioActual) {
        throw new Error(`El año "${clave}" debe estar entre 1900 y ${anioActual}.`);
      }

      // Verifica que el valor del índice Gini esté en el rango de 0 a 100
      if (typeof valor !== 'number' || valor < 0 || valor > 100) {
        throw new Error(`El valor del índice Gini para el año ${clave} debe ser un número entre 0 y 100.`);
      }
    }

    return true; // Si todas las validaciones son correctas
  }),


  /* body('gini')
  .if(body('gini').exists())
  .custom(value => {
    let giniObj;

    // Si el valor es string, intenta parsearlo (caso: formulario HTML)
    if (typeof value === 'string') {
      try {
        giniObj = JSON.parse(value.trim());
      } catch {
        throw new Error('El índice Gini debe estar en formato JSON válido. Ejemplo: {"2021": 42.9}');
      }
    } else if (typeof value === 'object' && value !== null) {
      // Si ya es objeto (caso: Postman)
      giniObj = value;
    } else {
      throw new Error('El índice Gini debe ser un objeto JSON válido.');
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
  }), */
  /* body('gini')
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
    }), */

    

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
