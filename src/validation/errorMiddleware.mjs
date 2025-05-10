import { validationResult } from "express-validator";

//Este middleware detecta automáticamente si la petición es HTML o API (según el header Accept).
//"back" en res.redirect('back') vuelve al formulario que envió la petición.
export function manejarErroresDeValidacion(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const mensajes = errores.array();

    // Si acepta HTML (formulario web), redirige con flash
    if (req.headers.accept?.includes('text/html')) {
     // req.flash('errores', mensajes);
      return res.redirect('/api/dashboard'); // redirige a la misma página del formulario
    }

    // Si es una API (ej. Postman), responde con JSON
    return res.status(400).json({
      estado: 'error',
      mensaje: 'Validación fallida',
      errores: mensajes.map(e => ({ campo: e.param, mensaje: e.msg }))
    });
    
  }
  next();
}


/*export function manejarErroresDeValidacion(req, res, next) {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    const mensajes = errores.array().map(error => ({ mensaje: error.msg }));
    return res.status(400).json({
      estado: 'error',
      mensaje: 'Validación fallida',
      errores: mensajes
    });
  }

  next(); // Si no hay errores, continúa con el controlador
}

import { validationResult } from 'express-validator';

export function manejarErroresDeValidacion(req, res, next) {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    req.flash('errores', errores.array());
    return res.redirect('/formulario/actualizarpais/' + req.params.id); // o la ruta correspondiente
  }

  next();
}*/