import PaisRepository from "../repositories/PaisRepository.mjs";


export async function obtenerPaisPorId(id) {
    return await PaisRepository.obtenerPorId(id);
}

export async function obtenerTodosLosPaises() {
    return await PaisRepository.obtenerTodos();
}

/*export async function obtenerPaisesPorAtributo(atributo, valor) {
    return await PaisRepository.buscarPorAtributo(atributo, valor);
}*/
/*
export async function obtenerSuperheroesMayoresDe30() {
    return await SuperHeroRepository.obtenerMayoresDe30();
    }*/

export async function crearPais(datosPais) {
    return await PaisRepository.insertarPais(datosPais);
    }
 
    export async function actualizarPais(id, nuevosDatos) {
        return await PaisRepository.actualizarPais(id, nuevosDatos);
    }

    export async function borrarPaisPorNombre(nombrePais) {
        return await PaisRepository.borrarPorNombre(nombrePais);
    }
    export async function borrarPaisPorId(id) {
        return await PaisRepository.borrarPorId(id);
    }