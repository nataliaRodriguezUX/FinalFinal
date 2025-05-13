export function renderizarPais(pais) {
    return {
      "Nombre Oficial": pais.name?.nativeName?.spa?.official || "No disponible",
      Capital: pais.capital?.join(', ') || "No especificada",
      Fronteras: pais.borders?.join(', ') || "Sin fronteras",
      Área: pais.area ? `${pais.area.toLocaleString()} km²` : "No disponible",
      Población: pais.population ? pais.population.toLocaleString() : "No disponible",
      Gini: pais.gini ? JSON.stringify(pais.gini) : "No disponible",
      "Zonas Horarias": pais.timezones?.join(', ') || "No especificadas",
      Creador: pais.creador || "No informado"
    };
  }

//  Esta función recibe un array de países y los transforma en su versión "formateada"
// "renderizarPais" es otra función que toma un país individual y devuelve su estructura limpia para mostrar o enviar por API

export function renderizarListaPaises(paises){
  //  Usa .map para recorrer cada país del array
  // Por cada país, aplica la función "renderizarPais"
  // El resultado es un nuevo array con todos los países ya formateados
    return paises.map(pais=>renderizarPais(pais))
}