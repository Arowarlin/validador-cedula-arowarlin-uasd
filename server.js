// ============================================
// IMPORTS Y CONFIGURACIÓN INICIAL
// ============================================
require('dotenv').config();
const express = require('express');
const path = require('path');
const { validarCedula } = require('./validator');

const app = express();
const PORT = process.env.PORT || 10000;

// Almacenamiento en memoria (temporal, se borra al reiniciar)
let validaciones = [];

// ============================================
// MIDDLEWARES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS para desarrollo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de información del proyecto
app.get('/api/info', (req, res) => {
  res.json({
    proyecto: 'Validador de Cédula Dominicana',
    autor: 'Arowarlin',
    universidad: 'UASD',
    algoritmo: 'Módulo 10',
    version: '1.0.0',
    almacenamiento: 'Memoria (temporal)',
    endpoints: [
      'GET /api/info',
      'POST /api/validar',
      'GET /api/historial',
      'GET /api/estadisticas'
    ]
  });
});

// Ruta para validar cédula
app.post('/api/validar', async (req, res) => {
  try {
    const { cedula } = req.body;

    if (!cedula) {
      return res.status(400).json({
        error: 'Cédula es requerida',
        mensaje: 'Debe proporcionar una cédula para validar'
      });
    }

    // Validar la cédula usando el algoritmo
    const resultado = validarCedula(cedula);

    // Guardar en memoria
    const registro = {
      id: validaciones.length + 1,
      cedula: cedula.replace(/\D/g, ''),
      valido: resultado.valido,
      digitoVerificador: resultado.digitoVerificador,
      digitoCalculado: resultado.digitoCalculado,
      mensaje: resultado.mensaje,
      fecha: new Date().toISOString()
    };

    validaciones.unshift(registro); // Agregar al inicio

    // Limitar a últimas 100 validaciones
    if (validaciones.length > 100) {
      validaciones = validaciones.slice(0, 100);
    }

    // Retornar resultado
    res.json({
      ...resultado,
      id: registro.id
    });

  } catch (error) {
    console.error('Error en /api/validar:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Ocurrió un error al procesar la validación',
      detalles: error.message
    });
  }
});

// Ruta para obtener el historial
app.get('/api/historial', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const historial = validaciones.slice(0, limit);

    res.json({
      total: historial.length,
      validaciones: historial
    });

  } catch (error) {
    console.error('Error en /api/historial:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo obtener el historial',
      detalles: error.message
    });
  }
});

// Ruta para obtener estadísticas
app.get('/api/estadisticas', (req, res) => {
  try {
    const total = validaciones.length;
    const validas = validaciones.filter(v => v.valido).length;
    const invalidas = total - validas;
    const porcentajeValidas = total > 0 ? ((validas / total) * 100).toFixed(2) : 0;

    res.json({
      total,
      validas,
      invalidas,
      porcentajeValidas: parseFloat(porcentajeValidas)
    });

  } catch (error) {
    console.error('Error en /api/estadisticas:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudieron obtener las estadísticas',
      detalles: error.message
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// RUTA CATCH-ALL PARA SPA
// ============================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`✓ Servidor corriendo en puerto ${PORT}`);
  console.log('✓ Arowarlin - UASD');
  console.log('✓ Almacenamiento: Memoria (temporal)');
  console.log('========================================');
});

// Manejo de errores del proceso
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
});

