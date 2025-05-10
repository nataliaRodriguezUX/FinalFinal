

document.addEventListener('DOMContentLoaded', () => {
const form = document.querySelector('form');
const bordersInput = document.getElementById('borders');
const errorMsg = document.getElementById('borders-error');
const capitalInput = document.getElementById('capital');
const capitalError = document.getElementById('capital-error');
const giniInput = document.getElementById('gini');
const giniError = document.getElementById('gini-error');
// const nameInput = document.querySelector('input[name="nameOfficial"]');
//const nameOfficial = document.getElementById('nameOfficial-error');

const creadorInput = document.querySelector('input[name="creador"]');
const creadorError = document.getElementById('creador-error');

const areaInput = document.querySelector('input[name="area"]');
const areaError = document.getElementById('area-error');

const populationInput = document.querySelector('input[name="population"]');
const populationError = document.getElementById('population-error');
const nativeNameOfficialInput = document.getElementById('nativeNameOfficial');
const nativenameoOfficialError = document.getElementById('nativeNameOfficial-error');


function marcarInput(input, esValido) {
  input.classList.toggle('border-green-500', esValido);
  input.classList.toggle('border-red-500', !esValido);
}

function validarBordes() {
  const value = bordersInput.value.trim();
  const codigos = value.split(',').map(c => c.trim());
  const todosValidos = codigos.every(codigo => /^[A-Z]{3}$/.test(codigo));
  const esValido = todosValidos && value !== '';
  errorMsg.classList.toggle('hidden', esValido);
  marcarInput(bordersInput, esValido);
  return esValido;
}


function validarNativeNameSpaOfficial() {
const value = nativeNameOfficialInput.value.trim();
const esValido = value.length >= 3;
document.getElementById('nativeNameOfficial-error').classList.toggle('hidden', esValido);
marcarInput(nativeNameOfficialInput, esValido);
return esValido;
}

nativeNameOfficialInput.addEventListener('input', validarNativeNameSpaOfficial);






function validarCapitales() {
  const value = capitalInput.value.trim();
  const capitales = value.split(',').map(c => c.trim());
  const todasValidas = capitales.every(cap => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,90}$/.test(cap));
  const esValido = todasValidas && value !== '';
  capitalError.textContent = "❌ Cada capital debe tener solo letras (sin números ni símbolos) y entre 3 y 90 caracteres.";
  capitalError.classList.toggle('hidden', esValido);
  marcarInput(capitalInput, esValido);
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
return esValido;
}



function validarTextoObligatorio(input) {
const esValido = input.value.trim().length >= 3;
marcarInput(input, esValido);
const mensajeError = input.parentElement.querySelector('.mensaje-error');
if (mensajeError) {
  mensajeError.classList.toggle('hidden', esValido);
}

return esValido;
}

function validarNumeroPositivo(input) {
const valor = parseFloat(input.value);
const esValido = !isNaN(valor) && valor >= 0;
marcarInput(input, esValido);

const mensajeError = input.parentElement.querySelector('.mensaje-error');
if (mensajeError) {
mensajeError.classList.toggle('hidden', esValido);
}

return esValido;
}

bordersInput.addEventListener('input', function () {
  this.value = this.value.toUpperCase();
  validarBordes();
});

capitalInput.addEventListener('input', validarCapitales);
giniInput.addEventListener('input', validarGini);
nativeNameOfficialInput.addEventListener('input', () => validarTextoObligatorio(nativeNameOfficialInput));
creadorInput.addEventListener('input', () => validarTextoObligatorio(creadorInput));
areaInput.addEventListener('input', () => validarNumeroPositivo(areaInput));
populationInput.addEventListener('input', () => validarNumeroPositivo(populationInput));

form.addEventListener('submit', function (e) {
  const validoBordes = validarBordes();
  const validoCapitales = validarCapitales();
  const validoGini = validarGini();
  const validoNombre = validarTextoObligatorio(nativeNameOfficialInput);
  const validoCreador = validarTextoObligatorio(creadorInput);
  const validoArea = validarNumeroPositivo(areaInput);
  const validoPoblacion = validarNumeroPositivo(populationInput);

  if (!validoBordes || !validoCapitales || !validoGini || !validoNombre || !validoCreador || !validoArea || !validoPoblacion) {
    e.preventDefault();
  }
});

// Validación en tiempo real para campos requeridos que no tienen validación personalizada
const camposRequeridos = document.querySelectorAll('.campo-requerido');
camposRequeridos.forEach(input => {
  if (
    input !== bordersInput &&
    input !== capitalInput &&
    input !== giniInput &&
    input !== nativeNameOfficialInput &&
    input !== creadorInput &&
    input !== areaInput &&
    input !== populationInput
  ) {
    input.addEventListener('input', () => {
      marcarInput(input, input.value.trim() !== '');
    });
  }
});
});
