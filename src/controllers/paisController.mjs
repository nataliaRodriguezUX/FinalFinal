import { obtenerTodosLosPaises, 
    
  crearPais, actualizarPais, borrarPaisPorId,
   borrarPaisPorNombre,obtenerPaisPorId } from "../services/PaisService.mjs";
 // obtenerPaisesMayoresDe30, obtenerPaisPorAtributo,obtenerPaisPorId
import { renderizarPais, renderizarListaPaises } from "../views/responseViews.mjs";
import _ from 'lodash'; // Asegúrate de tener lodash instalado



export async function  obtenerPaisPorIdController(req, res) {
 try{ 
     const {id}=req.params;
     const pais =await obtenerPaisPorId(id);
     if (!pais)
         return res.status(404).send ({mensaje:'Pais no encontrado'});
     const paisFormateado=renderizarPais(pais)
     res.status(200).json(paisFormateado);

 } catch (error){
     res.status(500).send ({mensaje: 'Error al obtener el pais', error:error.message})
 }
 
}









export async function  obtenerTodosLosPaisesController(req, res) {
 //necesito inicializar las variables, antes de llamar a la fncion
 //con los paises, para sacar los totales
 try {
    const paises = await obtenerTodosLosPaises();

    // Calcular totales
    let totalPoblacion = 0;
    let totalArea = 0;
    let sumaGini = 0;
    let cantidadGini = 0;

    paises.forEach(pais => {
      totalPoblacion += pais.population || 0;
      totalArea += pais.area || 0;

      if (pais.gini && typeof pais.gini === 'object') {
        const valores = Object.values(pais.gini);
        if (valores.length > 0 && typeof valores[0] === 'number') {
          sumaGini += valores[0];
          cantidadGini++;
        }
      }
    });

    const promedioGini = cantidadGini > 0 ? (sumaGini / cantidadGini).toFixed(2) : null;

    // Enviar a la vista
    res.render('dashboard', {
      paises,
      totalPoblacion,
      totalArea,
      promedioGini,
   //   mensaje: req.flash('mensaje') 
    });

  } catch (error) {
    res.status(500).send({
      mensaje: 'Error al obtener los países',
      error: error.message
    });
  }
}



///****************VER ESTOOOOOOOOOOOOO */



    
      export async function crearPaisController(req, res) {
        try {
          
          // Extraer y preparar campos
          const nombreNativoOficial = req.body.nativeNameOfficial?.trim();
          const capital = req.body.capital?.split(',').map(c => c.trim()).filter(c => c !== '');
          const borders = req.body.borders?.split(',').map(b => b.trim()).filter(b => b !== '');
          const area = Number(req.body.area);
          const population = Number(req.body.population);
       /////////   const timezones = req.body.timezones?.split(',').map(t => t.trim()).filter(t => t !== '');
          const creador = req.body.creador?.trim();
      
          let gini;
          try {
            gini = JSON.parse(req.body.gini);
          } catch (err) {
            return res.status(400).render('addPais', {
              pais: req.body,
              errores: ["El índice Gini debe estar en formato JSON válido, por ejemplo: {\"2021\": 42.9}"]
            });
          }
      
          // Validaciones obligatorias
          const errores = [];
          if (!nombreNativoOficial) errores.push("El nombre nativo oficial ESP es obligatorio.");
          if (!capital || capital.length === 0) errores.push("Debe haber al menos una capital.");
          if (!borders || borders.length === 0) errores.push("Debe haber al menos un país limítrofe.");
          if (isNaN(area) || area <= 0) errores.push("Área debe ser un número positivo.");
          if (isNaN(population) || population <= 0) errores.push("Población debe ser un número positivo.");
          if (!gini || Object.keys(gini).length === 0) errores.push("El índice Gini es obligatorio.");
          if (!creador) errores.push("El campo creador es obligatorio.");
      
          if (errores.length > 0) {
            return res.status(400).render('addPais', {
              pais: req.body,
              errores
            });
          }
      
          // Armar el objeto a enviar al servicio
          const datosPais = {
            name: {
              nativeName: {
                spa: {
                  official: nombreNativoOficial
                }
              }
            },
            capital,
            borders,
            area,
            population,
            gini,
           /// timezones,
            creador
          };
      
          // Guardar país
          await crearPais(datosPais);
      
          res.redirect('/api/dashboard');
      
        } catch (error) {
          res.status(500).send({
            mensaje: "Error al crear el país",
            error: error.message
          });
        }}
            
 




export async function borrarPaisNombreController(req, res) {
 const { nombrePais } = req.params; // Nombre del superhéroe que se quiere borrar

 try {
     const paisBorrado = await borrarPaisPorNombre(nombrePais);

     if (!paisBorrado) {
         return res.status(404).send({ mensaje: 'País no encontrado' });
     }

     // Devolver el pais borrado
     res.status(200).json(paisBorrado);
 } catch (error) {
     res.status(500).send({ mensaje: 'Error al borrar el País', error: error.message });
 }


}

export async function borrarPaisIdController(req, res) {
 const { id } = req.params; //id a borrar

 try {
     const paisBorrado = await borrarPaisPorId(id);

     if (!paisBorrado) {
         return res.status(404).send({ mensaje: 'País no encontrado' });
     }

     // Devolver el país borrado
     res.redirect ('/api/dashboard')
 } catch (error) {
     res.status(500).send({ mensaje: 'Error al borrar el país', error: error.message });
 }

 
}
/*Evita usar .trim() sobre campos indefinidos.
No borra campos si no vienen en el req.body.
Compara correctamente valores nuevos vs. actuales.
Usa _.get y _.set para manejar propiedades anidadas sin romper la estructura.*/


export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);
    if (!pais) return res.status(404).send({ mensaje: 'País no encontrado.' });

    const {
    // nameOfficial,
      nativeNameOfficial,
    //  nameCommon,
     // nombreNativoOficial, este es en español
     // independent,
     // unMember,
      capital,
      borders,
      area,
      population,
     // currencies,
      gini,
    ///  timezones, se muestra en el dash
    //  continents,
      creador
    } = req.body;

    const limpiarTexto = str => typeof str === 'string' ? str.trim() : undefined;
    const toNumberOrUndefined = value => {
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    const datosActualizados = {};

    // Campos anidados (name)
   // const nombreOficialLimpio = limpiarTexto(nameOfficial);
    //if (nombreOficialLimpio !== undefined) datosActualizados['name.official'] = nombreOficialLimpio;


    const nombreNativoLimpio = limpiarTexto(nativeNameOfficial);
   if (nombreNativoLimpio !== undefined) datosActualizados['name.nativeName.spa.official'] = nombreNativoLimpio;

    /*const nombreComunLimpio = limpiarTexto(nameCommon);
    if (nombreComunLimpio !== undefined) datosActualizados['name.common'] = nombreComunLimpio;*/

    ///const nombreNativoLimpio = limpiarTexto(nombreNativoOficial);
   /// if (nombreNativoLimpio !== undefined) datosActualizados['name.nativeName.spa.official'] = nombreNativoLimpio;

    // Booleanos
   /* if ('independent' in req.body) datosActualizados.independent = independent === 'true';
    if ('unMember' in req.body) datosActualizados.unMember = unMember === 'true';*/

    // Arrays
    if ('capital' in req.body && typeof capital === 'string') {
      datosActualizados.capital = capital.split(',').map(c => c.trim());
    }
    if ('borders' in req.body && typeof borders === 'string') {
      datosActualizados.borders = borders.split(',').map(b => b.trim());
    }
    /*if ('timezones' in req.body && typeof timezones === 'string') {
      datosActualizados.timezones = timezones.split(',').map(t => t.trim());
    }*/
   /* if ('continents' in req.body && typeof continents === 'string') {
      datosActualizados.continents = continents.split(',').map(c => c.trim());
    }*/

    // Números
    if ('area' in req.body) {
      const num = Number(area);
      datosActualizados.area = isNaN(num) ? undefined : num;
    }
    if ('population' in req.body) {
      const num = Number(population);
      datosActualizados.population = isNaN(num) ? undefined : num;
    }

  // if ('area' in req.body) datosActualizados.area = toNumberOrUndefined(area);
    //if ('population' in req.body) datosActualizados.population = toNumberOrUndefined(population);

    // Objetos JSON
    // Evita procesar currencies o gini si no son válidos o están vacíos
    if ('gini' in req.body && typeof gini === 'string') {
      const giniSinEspacios = gini.trim();
    
      if (giniSinEspacios !== '' && giniSinEspacios !== '{}') {
        try {
          const parsedGini = JSON.parse(giniSinEspacios);
          if (!_.isEqual(pais.gini, parsedGini)) {
            datosActualizados.gini = parsedGini;
          }
        } catch {
          console.warn("❗ Error al parsear gini");
        }
      } else {
        console.warn("⚠️ Gini vacío o sin datos útiles");
      }
    }

    // Otros campos simples
    const creadorLimpio = limpiarTexto(creador);
    if (creadorLimpio !== undefined) datosActualizados.creador = creadorLimpio;

    //  Comparar solo lo que cambió
    const cambios = {};
    for (const [clave, valorNuevo] of Object.entries(datosActualizados)) {
      const valorActual = _.get(pais, clave);
      if (!_.isEqual(valorActual, valorNuevo)) {
        _.set(cambios, clave, valorNuevo);
      }
    }

    if (Object.keys(cambios).length > 0) {
      await actualizarPais(id, cambios);
      console.log("✅ Cambios guardados:", cambios);
    
      if (req.headers.accept?.includes('text/html')) {
       //// req.flash('mensaje', 'País actualizado correctamente');
        return res.redirect('/api/dashboard');
      } else {
        return res.json({ estado: 'ok', mensaje: 'País actualizado correctamente', cambios });
      }
    
    } else {
      console.log("🔍 No hubo cambios que guardar.");
    
      if (req.headers.accept?.includes('text/html')) {
      //  req.flash('mensaje', 'No se realizaron cambios.');
        return res.redirect('/api/dashboard');
      } else {
        return res.json({ estado: 'ok', mensaje: 'No hubo cambios que guardar' });
      }
    }
  

  } catch (error) {
    console.error('❌ Error al actualizar el país:', error.message);
    res.status(500).send({ mensaje: 'Error al actualizar el país', error: error.message });
  }
}







/*antesss
export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);
    if (!pais) return res.status(404).send({ mensaje: 'País no encontrado.' });

    const {
      nameOfficial ,
      nameCommon ,
      nombreNativoOficial ,
      independent,
      unMember,
      capital,
      borders,
      area,
      population,
      currencies,
      gini,
      timezones,
      continents,
      creador 
    } = req.body;

    const toNumberOrUndefined = value => {
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    const datosActualizados = {};

    // Campos anidados (name)
    if (nameOfficial !== null) datosActualizados['name.official'] = nameOfficial || "";
    if (nameCommon !== null) datosActualizados['name.common'] = nameCommon || "";
    if (nombreNativoOficial !== null)
      datosActualizados['name.nativeName.spa.official'] = nombreNativoOficial || "";

    // Booleanos
    if ('independent' in req.body) datosActualizados.independent = independent === 'true';
    if ('unMember' in req.body) datosActualizados.unMember = unMember === 'true';

    
*/

export const modificarPaisFormularioController = async (req, res) => {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);

    if (!pais) {
      return res.status(404).send({ mensaje: 'País no encontrado' });
    }

    // ✅ Convertir Map a objeto plano para que EJS lo interprete bien

   /* if (pais.name?.nativeName instanceof Map) {
      pais.name.nativeName = Object.fromEntries(pais.name.nativeName.entries());
    }*/

    if (pais.name?.nativeName?.spa instanceof Map) {
      pais.name.nativeName.spa = Object.fromEntries(pais.name.nativeName.spa.entries());
    }
/*
    if (pais.languages instanceof Map) {
      pais.languages = Object.fromEntries(pais.languages.entries());
    }

    if (pais.gini instanceof Map) {
      pais.gini = Object.fromEntries(pais.gini.entries());
    }

    if (pais.currencies instanceof Map) {
      pais.currencies = Object.fromEntries(pais.currencies.entries());
    }*/

    res.render('editPais', {
      pais,
      errores: []// req.flash('errores') || []
    });

  } catch (error) {
    res.status(500).send({
      mensaje: 'Error al cargar el formulario de edición',
      error: error.message
    });
  }
};


/*
export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);
    if (!pais) return res.status(404).send({ mensaje: 'País no encontrado.' });

    const {
      nameOfficial = null,
      nameCommon = null,
      nombreNativoOficial = null,
      independent,
      unMember,
      capital,
      borders,
      area,
      population,
      currencies,
      gini,
      timezones,
      continents,
      creador = null
    } = req.body;

    const toNumberOrUndefined = value => {
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    const datosActualizados = {};

    // Campos del objeto `name`
    if (nameOfficial !== null) datosActualizados['name.official'] = nameOfficial.trim() || "";
    if (nameCommon !== null) datosActualizados['name.common'] = nameCommon.trim() || "";
    if (nombreNativoOficial !== null) datosActualizados['name.nativeName.spa.official'] = nombreNativoOficial.trim() || "";

    // Booleanos
    if ('independent' in req.body) datosActualizados.independent = independent === 'true';
    if ('unMember' in req.body) datosActualizados.unMember = unMember === 'true';

    // Arrays
    if ('capital' in req.body) datosActualizados.capital = capital ? capital.split(',').map(c => c.trim()) : [];
    if ('borders' in req.body) datosActualizados.borders = borders ? borders.split(',').map(b => b.trim()) : [];
    if ('timezones' in req.body) datosActualizados.timezones = timezones ? timezones.split(',').map(t => t.trim()) : [];
    if ('continents' in req.body) datosActualizados.continents = continents ? continents.split(',').map(c => c.trim()) : [];

    // Números
    if ('area' in req.body) datosActualizados.area = toNumberOrUndefined(area) ?? null;
    if ('population' in req.body) datosActualizados.population = toNumberOrUndefined(population) ?? null;

    // Objetos complejos
    if ('currencies' in req.body) {
      datosActualizados.currencies = currencies ? JSON.parse(currencies) : {};
    }

    if ('gini' in req.body) {
      datosActualizados.gini = gini ? JSON.parse(gini) : {};
    }

    // Texto
    if (creador !== null) datosActualizados.creador = creador.trim() || "";

    // Validación de campos requeridos
    const camposRequeridos = {
      "name.official": datosActualizados["name.official"],
      capital: datosActualizados.capital,
      borders: datosActualizados.borders,
      area: datosActualizados.area,
      population: datosActualizados.population,
      gini: datosActualizados.gini, // <-- habilitar si hacés gini requerido
    };

  
      )
      .map(([clave]) => clave);

    if (camposFaltantes.length > 0) {
      return res.status(400).send({
        mensaje: `Faltan campos requeridos: ${camposFaltantes.join(", ")}`,
      });
    }

    // Actualización
    await actualizarPais(id, datosActualizados);
    console.log("✅ Cambios guardados:", datosActualizados);

    res.redirect('/api/dashboard');
  } catch (error) {
    console.error('Error al actualizar el país:', error.message);
    res.status(500).send({ mensaje: 'Error al actualizar el país', error: error.message });
  }
}*/

/*
export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);
    if (!pais) return res.status(404).send({ mensaje: 'País no encontrado.' });

    const {
      nameOfficial = null,
      nameCommon = null,
      nombreNativoOficial = null,
      independent,
      unMember,
      capital,
      borders,
      area,
      population,
      currencies,
      gini,
      timezones,
      continents,
      creador = null
    } = req.body;

    // VALIDACIONES de campos requeridos si vienen en el body
    if ('nameOfficial' in req.body && (!nameOfficial || !nameOfficial.trim())) {
      return res.status(400).send({ mensaje: "El campo 'nameOfficial' es requerido y no puede estar vacío." });
    }

    if ('capital' in req.body && (!capital || !capital.trim())) {
      return res.status(400).send({ mensaje: "El campo 'capital' es requerido y no puede estar vacío." });
    }

    if ('area' in req.body && (!area || isNaN(Number(area)))) {
      return res.status(400).send({ mensaje: "El campo 'area' es requerido y debe ser un número válido." });
    }

    if ('population' in req.body && (!population || isNaN(Number(population)))) {
      return res.status(400).send({ mensaje: "El campo 'population' es requerido y debe ser un número válido." });
    }

    if ('gini' in req.body && (!gini || gini.trim() === '' || gini === '{}')) {
      return res.status(400).send({ mensaje: "El campo 'gini' es requerido y no puede estar vacío." });
    }

    if ('borders' in req.body && (!borders || !borders.trim())) {
      return res.status(400).send({ mensaje: "El campo 'borders' es requerido y no puede estar vacío." });
    }

    // Convertidor de números con fallback
    const toNumberOrUndefined = value => {
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    const datosActualizados = {};

    // Campos del objeto `name`
    if (nameOfficial !== null) datosActualizados['name.official'] = nameOfficial.trim() || "";
    if (nameCommon !== null) datosActualizados['name.common'] = nameCommon.trim() || "";
    if (nombreNativoOficial !== null)
      datosActualizados['name.nativeName.spa.official'] = nombreNativoOficial.trim() || "";

    // Booleanos
    if ('independent' in req.body) datosActualizados.independent = independent === 'true';
    if ('unMember' in req.body) datosActualizados.unMember = unMember === 'true';

    // Arrays
    if ('capital' in req.body) {
      datosActualizados.capital = capital ? capital.split(',').map(c => c.trim()) : [];
    }


    if ('borders' in req.body) {
      datosActualizados.borders = borders ? borders.split(',').map(b => b.trim()) : [];
    }

    if ('timezones' in req.body) {
      datosActualizados.timezones = timezones ? timezones.split(',').map(t => t.trim()) : [];
    }

    if ('continents' in req.body) {
      datosActualizados.continents = continents ? continents.split(',').map(c => c.trim()) : [];
    }

    // Números
    if ('area' in req.body) datosActualizados.area = toNumberOrUndefined(area) ?? null;
    if ('population' in req.body) datosActualizados.population = toNumberOrUndefined(population) ?? null;

    // Objetos complejos
    if ('currencies' in req.body) {
      datosActualizados.currencies = currencies ? JSON.parse(currencies) : {};
    }

    if ('gini' in req.body) {
      datosActualizados.gini = gini ? JSON.parse(gini) : {};
    }

    if (creador !== null) datosActualizados.creador = creador.trim() || "";

    // Comparación para guardar solo si hay cambios
    const cambiosReales = {};
    for (const [clave, valor] of Object.entries(datosActualizados)) {
      const partes = clave.split('.');
      let actual = pais;
      for (const parte of partes) {
        if (actual && parte in actual) {
          actual = actual[parte];
        } else {
          actual = undefined;
          break;
        }
      }
      if (JSON.stringify(valor) !== JSON.stringify(actual)) {
        cambiosReales[clave] = valor;
      }
    }

    if (Object.keys(cambiosReales).length > 0) {
      await actualizarPais(id, cambiosReales);
      console.log("✅ Cambios guardados:", cambiosReales);
    } else {
      console.log("🔍 No hubo cambios que guardar.");
    }

    res.redirect('/api/dashboard');
  } catch (error) {
    console.error('❌ Error al actualizar el país:', error.message);
    res.status(500).send({ mensaje: 'Error al actualizar el país', error: error.message });
  }
}
**










/* este sirve masomenos
export async function actualizarPaisController(req, res) {
  try {
    const { id } = req.params;
    const pais = await obtenerPaisPorId(id);
    if (!pais) return res.status(404).send({ mensaje: 'País no encontrado.' });

    const {
      nameOfficial = null,
      nameCommon = null,
      nombreNativoOficial = null,
      independent,
      unMember,
      capital,
      borders,
      area,
      population,
      currencies,
      gini,
      timezones,
      continents,
      creador = null
    } = req.body;

    const toNumberOrUndefined = value => {
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    const datosActualizados = {};

    // Campos del objeto `name`
    datosActualizados.name = {};
    if (nameOfficial !== null) datosActualizados['name.official'] = nameOfficial.trim() || "";
    if (nameCommon !== null) datosActualizados['name.common'] = nameCommon.trim() || "";
    if (nombreNativoOficial !== null)
      datosActualizados['name.nativeName.spa.official'] = nombreNativoOficial.trim() || "";

    // Booleanos
    if ('independent' in req.body) datosActualizados.independent = independent === 'true';
    if ('unMember' in req.body) datosActualizados.unMember = unMember === 'true';

    // Arrays
    if ('capital' in req.body) {
      datosActualizados.capital = capital ? capital.split(',').map(c => c.trim()) : [];
    }

    if ('borders' in req.body) {
      datosActualizados.borders = borders ? borders.split(',').map(b => b.trim()) : [];
    }

    if ('timezones' in req.body) {
      datosActualizados.timezones = timezones ? timezones.split(',').map(t => t.trim()) : [];
    }

    if ('continents' in req.body) {
      datosActualizados.continents = continents ? continents.split(',').map(c => c.trim()) : [];
    }

    // Números
    if ('area' in req.body) datosActualizados.area = toNumberOrUndefined(area) ?? null;
    if ('population' in req.body) datosActualizados.population = toNumberOrUndefined(population) ?? null;

    // Objetos complejos
    if ('currencies' in req.body) {
      datosActualizados.currencies = currencies ? JSON.parse(currencies) : {};
    }

    if ('gini' in req.body) {
      datosActualizados.gini = gini ? JSON.parse(gini) : {};
    }

    if (creador !== null) datosActualizados.creador = creador.trim() || "";

    // Limpieza final
    const camposConCambios = Object.entries(datosActualizados).filter(([clave, valor]) => {
      const actual = clave.includes('.') ? undefined : pais[clave];
      return JSON.stringify(valor) !== JSON.stringify(actual);
    });

    if (camposConCambios.length > 0) {
      await actualizarPais(id, datosActualizados);
      console.log("✅ Cambios guardados:", datosActualizados);
    } else {
      console.log("🔍 No hubo cambios que guardar.");
    }

    res.redirect('/api/dashboard');
  } catch (error) {
    console.error('❌ Error al actualizar el país:', error.message);
    res.status(500).send({ mensaje: 'Error al actualizar el país', error: error.message });
  }
}*/



/*
    // Comparación de campos
    if (pais.name?.official !== req.body.nameOfficial) {
      datosActualizados['name.official'] = req.body.nameOfficial;
    }

    if (pais.name?.common !== req.body.nameCommon) {
      datosActualizados['name.common'] = req.body.nameCommon;
    }

    if (pais.name?.nativeName?.spa?.official !== req.body.nombreNativoOficial) {
      datosActualizados['name.nativeName.spa.official'] = req.body.nombreNativoOficial;
    }

    if (pais.independent !== (req.body.independent === 'true')) {
      datosActualizados.independent = req.body.independent === 'true';
    }

    if (pais.status !== req.body.status) {
      datosActualizados.status = req.body.status;
    }

    if (pais.unMember !== (req.body.unMember === 'true')) {
      datosActualizados.unMember = req.body.unMember === 'true';
    }

    if (JSON.stringify(pais.currencies) !== req.body.currencies) {
      datosActualizados.currencies = JSON.parse(req.body.currencies);
    }

    const capitalNueva = req.body.capital.split(',').map(c => c.trim());
    if (JSON.stringify(pais.capital) !== JSON.stringify(capitalNueva)) {
      datosActualizados.capital = capitalNueva;
    }

    if (pais.region !== req.body.region) {
      datosActualizados.region = req.body.region;
    }

    if (pais.subregion !== req.body.subregion) {
      datosActualizados.subregion = req.body.subregion;
    }

    if (JSON.stringify(pais.languages) !== req.body.languages) {
      datosActualizados.languages = JSON.parse(req.body.languages);
    }

    const latlngNueva = req.body.latlng.split(',').map(Number);
    if (JSON.stringify(pais.latlng) !== JSON.stringify(latlngNueva)) {
      datosActualizados.latlng = latlngNueva;
    }

    if (pais.landlocked !== (req.body.landlocked === 'true')) {
      datosActualizados.landlocked = req.body.landlocked === 'true';
    }

    const bordersNueva = req.body.borders.split(',').map(b => b.trim());
    if (JSON.stringify(pais.borders) !== JSON.stringify(bordersNueva)) {
      datosActualizados.borders = bordersNueva;
    }

    if (pais.area !== Number(req.body.area)) {
      datosActualizados.area = Number(req.body.area);
    }

    if (pais.flag !== req.body.flag) {
      datosActualizados.flag = req.body.flag;
    }

    if (pais.maps?.googleMaps !== req.body.googleMaps) {
      datosActualizados['maps.googleMaps'] = req.body.googleMaps;
    }

    if (pais.maps?.openStreetMaps !== req.body.openStreetMaps) {
      datosActualizados['maps.openStreetMaps'] = req.body.openStreetMaps;
    }

    if (pais.population !== Number(req.body.population)) {
      datosActualizados.population = Number(req.body.population);
    }

    if (JSON.stringify(pais.gini) !== req.body.gini) {
      datosActualizados.gini = JSON.parse(req.body.gini);
    }

    if (pais.fifa !== req.body.fifa) {
      datosActualizados.fifa = req.body.fifa;
    }

    const tzNueva = req.body.timezones.split(',').map(t => t.trim());
    if (JSON.stringify(pais.timezones) !== JSON.stringify(tzNueva)) {
      datosActualizados.timezones = tzNueva;
    }

    const contNueva = req.body.continents.split(',').map(c => c.trim());
    if (JSON.stringify(pais.continents) !== JSON.stringify(contNueva)) {
      datosActualizados.continents = contNueva;
    }

    if (pais.flags?.png !== req.body.png) {
      datosActualizados['flags.png'] = req.body.png;
    }

    if (pais.flags?.svg !== req.body.svg) {
      datosActualizados['flags.svg'] = req.body.svg;
    }

    if (pais.flags?.alt !== req.body.alt) {
      datosActualizados['flags.alt'] = req.body.alt;
    }

    if (pais.startOfWeek !== req.body.startOfWeek) {
      datosActualizados.startOfWeek = req.body.startOfWeek;
    }

    const capitalLatLng = req.body.capitalLatLng.split(',').map(Number);
    if (JSON.stringify(pais.capitalInfo?.latlng) !== JSON.stringify(capitalLatLng)) {
      datosActualizados['capitalInfo.latlng'] = capitalLatLng;
    }

    if (pais.creador !== req.body.creador) {
      datosActualizados.creador = req.body.creador;
    }

    // Si no hay cambios
    if (Object.keys(datosActualizados).length === 0) {
      return res.status(200).send({ mensaje: 'No se realizaron cambios.' });
    }
*/
    /*if ('gini' in req.body && typeof gini === 'string') {
      const giniSinEspacios = gini.trim();
    
      if (giniSinEspacios !== '' && giniSinEspacios !== '{}') {
        try {
          const parsedGini = JSON.parse(giniSinEspacios);
          if (!_.isEqual(pais.gini, parsedGini)) {
            datosActualizados.gini = parsedGini;
          }
        } catch {
          console.warn("❗ Error al parsear gini");
        }
      } else {
        console.warn("⚠️ Gini vacío o sin datos útiles");
      }
    }*/
      /*if ('currencies' in req.body && typeof currencies === 'string' && currencies.trim() !== '') {
      try {
        const parsedCurrencies = JSON.parse(currencies);
        if (!_.isEqual(pais.currencies, parsedCurrencies)) {
          datosActualizados.currencies = parsedCurrencies;
        }
      } catch {
        console.warn("❗ Error al parsear currencies");
      }
      /* try {
        datosActualizados.currencies = JSON.parse(currencies);
      } catch {
        console.warn("❗ Error al parsear currencies");
      }
    }*/
/*
    if ('gini' in req.body && typeof gini === 'string' && gini.trim() !== '') {
      try {
        const parsedGini = JSON.parse(gini);
        if (!_.isEqual(pais.gini, parsedGini)) {
          datosActualizados.gini = parsedGini;
        }
      } catch {
        console.warn("❗ Error al parsear gini");
      }
    }*/
      /*try {
        datosActualizados.gini = JSON.parse(gini);
      } catch {
        console.warn("❗ Error al parsear gini");
      }*/
   





