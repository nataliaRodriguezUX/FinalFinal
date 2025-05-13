
import Pais from '../models/Pais.mjs';
import IRepository from './IRepository.mjs';
//implementa metodos definidos en la interfaz


/* crear un nuevo objeto, datosLimpiados, que contiene solo las propiedades de datosActualizados 
que tienen valores válidos (que no son undefined).
 Si alguna propiedad de datosActualizados es undefined, esa propiedad no será añadida a datosLimpiados.*/
class PaisRepository extends IRepository{

    async obtenerPorId(id){
        return await Pais.findById(id);
    }

        async obtenerTodos() {
          return await Pais.find({
            'name.nativeName.spa.official': { $exists: true },
           // 'name.official': { $exists: true },

            creador: { $regex: /Nata/i }
          });
        }
           async insertarPais(nuevoPais) {
        const paisNuevo = new Pais(nuevoPais);
        return await paisNuevo.save();
    }
     
    async actualizarPais(id, datosActualizados) {
      try {
        const datosLimpiados = {};
        /*Es un ciclo que recorre todas las claves (propiedades) del objeto datosActualizados. 
        key representa cada clave del objeto en cada iteración.*/
        for (const key in datosActualizados) {
          if (datosActualizados[key] !== undefined) {
           // Si el valor de la propiedad no es undefined, se asigna la propiedad y su valor al objeto datosLimpiados.
            datosLimpiados[key] = datosActualizados[key];
          }
        }
    
        const paisActualizado = await Pais.findByIdAndUpdate(id, datosLimpiados, {
          new: true,
          runValidators: false
        });
    
        return paisActualizado;
      } catch (error) {
        console.error('Error al actualizar el país:', error.message);
        throw new Error('No se pudo actualizar el país');
      }
    }
      async borrarPorId(id) {
            return await Pais.findByIdAndDelete(id);
        }
//otra opcion seria reemplazar en esta fnc. 
//al atributo del nombre nativo, ya que solo 
//la base de paises lo tiene...jejejjejejeje
    async buscarPorAtributo(atributo, valor){
      return await Pais.find({ [atributo]: valor });
    }

/* *************
    async obtenerMayoresDe30() {
        return await SuperHero.find( { $and : [
            { edad : { $gt : 30 } },
            { planetaOrigen : "Tierra" },
            { $expr: { $gt: [{ $size: "$poderes" }, 2] } } 
        ] } );
        
    }*/

 
    /*async actualizarPais(id,datosActualizados) {
      try {
        const paisActualizado = await Pais.findByIdAndUpdate(id, datosActualizados, {
          new: true,
          runValidators: false
        });
        return paisActualizado;
      } catch (error) {
        console.error('Error al actualizar el país:', error.message);
        throw new Error('No se pudo actualizar el país');
      }   
        }*/
        

    async borrarPorNombre(nombrePais) {
            return await Pais.findOneAndDelete({ 'name.nativeName.spa.official': nombrePais });
        }
  
       
       
    }
    
    export default new PaisRepository;

    
    /*
    async obtenerTodos(){
        return await Pais.find({});
    }*/