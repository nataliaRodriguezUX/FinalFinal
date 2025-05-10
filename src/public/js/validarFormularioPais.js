document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  const nativeNameOfficialInput = document.getElementById('nativeNameOfficial');
  const capitalInput = document.getElementById('capital');
  const bordersInput = document.getElementById('borders');
  const areaInput = document.getElementById('area');
  const populationInput = document.getElementById('population');
  const giniInput = document.getElementById('gini');
  const creadorInput = document.getElementById('creador');

  const capitalError = document.getElementById('capital-error');
  const bordersError = document.getElementById('borders-error');
  const giniError = document.getElementById('gini-error');
  const nombreError = document.getElementById('nativeNameOfficial-error');

  function marcarInput(input, esValido) {
    input.classList.toggle('border-green-500', esValido);
    input.classList.toggle('border-red-500', !esValido);
  }

  function mostrarMensajeError(input, esValido) {
    const mensaje = input.parentElement.querySelector('.mensaje-error');
    if (mensaje) {
      mensaje.classList.toggle('hidden', esValido);
    }
  }

  function validarTexto(input, errorElemento) {
    const valor = input.value.trim();
    const esValido = valor.length >= 3;
    marcarInput(input, esValido);
    errorElemento?.classList.toggle('hidden', esValido);
    mostrarMensajeError(input, esValido);
    return esValido;
  }

  function validarCapitales() {
    const value = capitalInput.value.trim();
    const capitales = value.split(',').map(c => c.trim());
    const todasValidas = capitales.every(cap => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,90}$/.test(cap));
    const esValido = todasValidas && value !== '';
    capitalError.classList.toggle('hidden', esValido);
    marcarInput(capitalInput, esValido);
    return esValido;
  }

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

  function validarNumero(input) {
    const valor = parseFloat(input.value);
    const esValido = !isNaN(valor) && valor >= 0;
    marcarInput(input, esValido);
    mostrarMensajeError(input, esValido);
    return esValido;
  }

  function validarGini() {
    let esValido = false;
    try {
      const json = JSON.parse(giniInput.value.trim());
      const claves = Object.keys(json);
      const valores = Object.values(json);
      const anioActual = new Date().getFullYear();

      const clavesValidas = claves.length > 0 &&
        claves.every(clave => /^\d{4}$/.test(clave) && +clave >= 1900 && +clave <= anioActual);

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
  nativeNameOfficialInput.addEventListener('input', () => validarTexto(nativeNameOfficialInput, nombreError));
  capitalInput.addEventListener('input', validarCapitales);
  bordersInput.addEventListener('input', validarBordes);
  giniInput.addEventListener('input', validarGini);
  creadorInput.addEventListener('input', () => validarTexto(creadorInput));
  areaInput.addEventListener('input', () => validarNumero(areaInput));
  populationInput.addEventListener('input', () => validarNumero(populationInput));

  form.addEventListener('submit', (e) => {
    const valido =
      validarTexto(nativeNameOfficialInput, nombreError) &&
      validarCapitales() &&
      validarBordes() &&
      validarNumero(areaInput) &&
      validarNumero(populationInput) &&
      validarGini() &&
      validarTexto(creadorInput);

    if (!valido) e.preventDefault();
  });
});
