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

export function renderizarListaPaises(paises){
    return paises.map(pais=>renderizarPais(pais))
}