////Resumen de acciones - es importante mensionar que es util para edicion y alta de pais//// 
//Aplica validación en tiempo real y al enviar el formulario.
//Usa clases de estilo (como border-red-500) para dar retroalimentación visual.
//Controla que los datos ingresados sean correctos, bien formateados y completos.
//Previene el envío del formulario si algún campo no pasa su validación.


// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {
  // Obtiene una referencia al formulario principal.
  const form = document.querySelector('form');
 // Obtiene referencias a todos los campos de entrada del formulario.
  const nativeNameOfficialInput = document.getElementById('nativeNameOfficial');
  const capitalInput = document.getElementById('capital');
  const bordersInput = document.getElementById('borders');
  const areaInput = document.getElementById('area');
  const populationInput = document.getElementById('population');
  const giniInput = document.getElementById('gini');
  const creadorInput = document.getElementById('creador');
  // Obtiene referencias a los elementos de error visibles junto a los campos.
  const capitalError = document.getElementById('capital-error');
  const bordersError = document.getElementById('borders-error');
  const giniError = document.getElementById('gini-error');
  const nombreError = document.getElementById('nativeNameOfficial-error');
  // Añade o quita clases para marcar el input con verde si es válido o rojo si no lo es.
  function marcarInput(input, esValido) {
    input.classList.toggle('border-green-500', esValido);
    input.classList.toggle('border-red-500', !esValido);
  }
  // Muestra u oculta un mensaje de error general dentro del contenedor del input.
  function mostrarMensajeError(input, esValido) {
    const mensaje = input.parentElement.querySelector('.mensaje-error');
    if (mensaje) {
      mensaje.classList.toggle('hidden', esValido);
    }
  }
   // Valida campos de texto que deben tener al menos 3 caracteres.
  function validarTexto(input, errorElemento) {
    const valor = input.value.trim();
    const esValido = valor.length >= 3;
    marcarInput(input, esValido);
    errorElemento?.classList.toggle('hidden', esValido);
    mostrarMensajeError(input, esValido);
    return esValido;
  }
 // Valida que todas las capitales ingresadas (separadas por coma) tengan solo letras y entre 3 y 90 caracteres.
    function validarCapitales() {
    const value = capitalInput.value.trim();
    const capitales = value.split(',').map(c => c.trim());
    const todasValidas = capitales.every(cap => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,90}$/.test(cap));
    const esValido = todasValidas && value !== '';
    capitalError.classList.toggle('hidden', esValido);
    marcarInput(capitalInput, esValido);
    return esValido;
  }
// Valida que todos los códigos de frontera (separados por coma) sean de 3 letras mayúsculas.
  function validarBordes() {
    bordersInput.value = bordersInput.value.toUpperCase();
    const value = bordersInput.value.trim();
    const codigos = value.split(',').map(c => c.trim());
    const todosValidos = codigos.every(codigo => /^[A-Z]{3}$/.test(codigo));
    const esValido = todosValidos && value !== '';
    bordersError.classList.toggle('hidden', esValido);
    marcarInput(bordersInput, esValido);
    return esValido;
  }

  // Valida que el valor ingresado sea un número mayor o igual a 0 (usado para área y población)
  function validarNumero(input) {
    const valor = parseFloat(input.value);
    const esValido = !isNaN(valor) && valor >= 0;
    marcarInput(input, esValido);
    mostrarMensajeError(input, esValido);
    return esValido;
  }

  // Valida que el campo GINI sea un JSON válido, con claves de año entre 1900 y año actual y valores entre 0 y 100.
  
  function validarGini() {
    let esValido = false;
    try {
      const json = JSON.parse(giniInput.value.trim());
      const claves = Object.keys(json);
      const valores = Object.values(json);
      const anioActual = new Date().getFullYear();
      // Verifica que las claves sean años válidos y que haya al menos una
      const clavesValidas = claves.length > 0 &&
      claves.every(clave => /^\d{4}$/.test(clave) && +clave >= 1900 && +clave <= anioActual);
      // Verifica que todos los valores sean números entre 0 y 100
      const valoresValidos = valores.every(valor => typeof valor === "number" && valor >= 0 && valor <= 100);

      esValido = clavesValidas && valoresValidos;
    } catch {
      esValido = false;
    }

    giniError.classList.toggle('hidden', esValido);
    marcarInput(giniInput, esValido);
    mostrarMensajeError(giniInput, esValido);
    return esValido;
  }

  // Validaciones en tiempo real
  // Ejecuta la validación en cada cambio de los campos.
  nativeNameOfficialInput.addEventListener('input', () => validarTexto(nativeNameOfficialInput, nombreError));
  capitalInput.addEventListener('input', validarCapitales);
  bordersInput.addEventListener('input', validarBordes);
  giniInput.addEventListener('input', validarGini);
  creadorInput.addEventListener('input', () => validarTexto(creadorInput));
  areaInput.addEventListener('input', () => validarNumero(areaInput));
  populationInput.addEventListener('input', () => validarNumero(populationInput));
// -------- VALIDACIÓN FINAL ANTES DE ENVIAR EL FORMULARIO --------//
  form.addEventListener('submit', (e) => {
    const valido =
      validarTexto(nativeNameOfficialInput, nombreError) &&
      validarCapitales() &&
      validarBordes() &&
      validarNumero(areaInput) &&
      validarNumero(populationInput) &&
      validarGini() &&
      validarTexto(creadorInput);
  // Si alguna validación falla, evita que se envíe el formulario
    if (!valido) e.preventDefault();
  });
});
