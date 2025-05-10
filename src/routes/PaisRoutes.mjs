import express from 'express';
import {   obtenerTodosLosPaisesController,
        crearPaisController, 
        actualizarPaisController, borrarPaisIdController,
         
        modificarPaisFormularioController} from '../controllers/paisController.mjs';
//obtenerPaisPorIdController,borrarPaisIdController, obtenerPaisesPorAtributoController,borrarPaisNombreController
import {validarPais}from '../validation/validationRules.mjs';
import{manejarErroresDeValidacion}from '../validation/errorMiddleware.mjs'

const router =express.Router();
router.put('/pais/actualizar/:id',validarPais(), manejarErroresDeValidacion, actualizarPaisController );

router.post('/pais/crear', validarPais(),manejarErroresDeValidacion, crearPaisController ); 

router.get ('/Pais', obtenerTodosLosPaisesController);
//router.get('/heroes/buscar/:atributo/:valor', obtenerPaisesPorAtributoController);
//router.delete('/heroes/borrar-nombre/:nombreSuperHeroe', borrarPaisNombreController);
router.delete('/pais/eliminar/:id', borrarPaisIdController);
router.get('/dashboard',obtenerTodosLosPaisesController );
//router.get('/heroes/:id', obtenerPaisPorIdController);
router.get('/formulario/actualizarpais/:id',modificarPaisFormularioController)

router.get('/formulario/crear', (req, res) => {
    res.render('addPais', {
        title: 'Crear Paiiiiis',
        pais: {},     // evita el ReferenceError
        errores: []   // también se usa en la vista
    });
});

/*
router.get('/formulario/crear', (req, res) => {
    res.render('addPais', { title: 'Crear Paísssss' }); 
  });*/
  router.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
  });
  

export default router;