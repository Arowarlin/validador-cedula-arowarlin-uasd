// ============================================
// IMPORTS Y CONFIGURACIÓN INICIAL
// ============================================
require('dotenv').config();
const express = require('express');
const path = require('path');
const { validarCedula } = require('./validator');
const supabase = require('./supabaseClient');

const app = express();
const PORT = process.env.PORT || 10000;

// ============================================
// MIDDLEWARES
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CRÍTICO: Servir archivos estáticos desde la carpeta 'public'
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

    // Guardar en la base de datos
    const { data, error } = await supabase
      .from('validaciones')
      .insert([
        {
          cedula: cedula.replace(/\D/g, ''),
          valido: resultado.valido,
          digito_verificador: resultado.digitoVerificador,
          digito_calculado: resultado.digitoCalculado,
          mensaje: resultado.mensaje
        }
      ])
      .select();

    if (error) {
      console.error('Error guardando en Supabase:', error);
      // Aún así retornamos el resultado de validación
      return res.json({
        ...resultado,
        nota: 'Validación exitosa pero no se pudo guardar en base de datos'
      });
    }

    // Agregar el ID del registro a la respuesta
    res.json({
      ...resultado,
      id: data[0]?.id
    });

  } catch (error) {
    console.error('Error en /api/validar:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Ocurrió un error al procesar la validación'
    });
  }
});

// Ruta para obtener el historial
app.get('/api/historial', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from('validaciones')
      .select('*')
      .order('fecha', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    res.json({
      total: data.length,
      validaciones: data
    });

  } catch (error) {
    console.error('Error en /api/historial:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'No se pudo obtener el historial'
    });
  }
});

// Ruta para obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
  try {
    // Obtener todas las validaciones
    const { data, error } = await supabase
      .from('validaciones')
      .select('valido');

    if (error) {
      throw error;
    }

    const total = data.length;
    const validas = data.filter(v => v.valido).length;
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
      mensaje: 'No se pudieron obtener las estadísticas'
    });
  }
});

// ============================================
// RUTA CATCH-ALL PARA SPA
// ============================================
// Esta ruta debe ir AL FINAL de todas las rutas de API
// Sirve el index.html para cualquier ruta que no sea de API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('Arowarlin - UASD');
  console.log('========================================');
});
