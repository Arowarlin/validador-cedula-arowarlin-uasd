require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./supabaseClient');
const ValidadorCedula = require('./validator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/info', (req, res) => {
  res.json({
    proyecto: 'Validador de Cédula Dominicana',
    autor: 'Arowarlin',
    universidad: 'Universidad Autónoma de Santo Domingo (UASD)',
    algoritmo: 'Módulo 10',
    version: '1.0.0',
    endpoints: {
      validar: '/api/validar',
      historial: '/api/historial',
      estadisticas: '/api/estadisticas'
    }
  });
});

app.post('/api/validar', async (req, res) => {
  try {
    const { cedula } = req.body;
    
    if (!cedula) {
      return res.status(400).json({
        error: 'El campo cedula es requerido'
      });
    }
    
    const resultado = ValidadorCedula.validarCedula(cedula);
    const informacion = ValidadorCedula.extraerInformacion(cedula);
    
    const { data, error } = await supabase
      .from('validaciones')
      .insert([
        {
          cedula: resultado.cedula || cedula.replace(/\D/g, ''),
          valido: resultado.valido,
          digito_verificador: resultado.digitoVerificador,
          digito_calculado: resultado.digitoCalculado,
          mensaje: resultado.mensaje || resultado.error,
          fecha: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Error al guardar en Supabase:', error);
    }
    
    res.json({
      ...resultado,
      informacion: informacion,
      id: data ? data[0].id : null
    });
    
  } catch (error) {
    console.error('Error en validación:', error);
    res.status(500).json({
      error: 'Error en el servidor',
      detalle: error.message
    });
  }
});

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
    console.error('Error al obtener historial:', error);
    res.status(500).json({
      error: 'Error al obtener historial',
      detalle: error.message
    });
  }
});

app.get('/api/estadisticas', async (req, res) => {
  try {
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
      total: total,
      validas: validas,
      invalidas: invalidas,
      porcentajeValidas: parseFloat(porcentajeValidas)
    });
    
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      detalle: error.message
    });
  }
});

app.delete('/api/historial/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('validaciones')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    res.json({
      mensaje: 'Validación eliminada correctamente',
      id: id
    });
    
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({
      error: 'Error al eliminar',
      detalle: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  Servidor corriendo en puerto ${PORT}`);
  console.log(`  Arowarlin - UASD`);
  console.log(`========================================`);
});