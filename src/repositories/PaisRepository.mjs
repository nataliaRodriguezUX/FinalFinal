
import Pais from '../models/Pais.mjs';
import IRepository from './IRepository.mjs';
//implementa metodos definidos en la interfaz

class PaisRepository extends IRepository{

    async obtenerPorId(id){
        return await Pais.findById(id);
    }

    /*
    async obtenerTodos(){
        return await Pais.find({});
    }*/
        async obtenerTodos() {
          return await Pais.find({
            'name.nativeName.spa.official': { $exists: true },
           // 'name.official': { $exists: true },

            creador: { $regex: /Nata/i }
          });
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

    async insertarPais(nuevoPais) {
        const paisNuevo = new Pais(nuevoPais);
        return await paisNuevo.save();
    }
     
    async actualizarPais(id, datosActualizados) {
      try {
        const datosLimpiados = {};
        for (const key in datosActualizados) {
          if (datosActualizados[key] !== undefined) {
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
    async borrarPorId(id) {
            return await Pais.findByIdAndDelete(id);
        }
       
       
    }
    
    export default new PaisRepository;