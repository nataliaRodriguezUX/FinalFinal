import express from 'express';
import { connectDB } from './config/dbConfig.mjs';
import PaisRoutes from './routes/PaisRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import session from 'express-session';              // <-- agregar esto
import flash from 'connect-flash';                  // <-- agregar esto
import expressLayouts from 'express-ejs-layouts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
// ---- Conexión a base de datos ----
connectDB();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Middlewares ----
//express.urlencoded({ extended: true })
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

///app.use(express.static('views'));

//Configurar express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');
// ✅ Sesión y Flash
app.use(session({
  secret: 'clave_secreta', // 
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// ✅ Hacer los errores accesibles en todas las vistas
app.use((req, res, next) => {
  res.locals.errores = req.flash('errores');
  next();
});



// ---- Rutas ----
app.use('/api', PaisRoutes);
app.get('/', (req, res) => {
  res.render('index', { title: 'Página principal' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'Nosotros' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contacto' });
});
app.use(express.static('public'));






// ---- Ruta no encontrada ----
app.use((req, res) => {
  res.status(404).send({ mensaje: "Ruta no encontrada" });
});

// ---- Iniciar el servidor ----
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

