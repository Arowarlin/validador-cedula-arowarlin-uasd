/**
 * Validador de Cédula de Identidad Dominicana
 * Implementación del Algoritmo Módulo 10
 * 
 * @author Arowarlin - UASD
 */

/**
 * Valida una cédula dominicana usando el algoritmo Módulo 10
 * @param {string} cedula - Número de cédula (con o sin guiones)
 * @returns {Object} Resultado de la validación
 */
function validarCedula(cedula) {
  try {
    // Limpiar la cédula: remover guiones y espacios
    const cedulaLimpia = cedula.replace(/\D/g, '');

    // Validar longitud
    if (cedulaLimpia.length !== 11) {
      return {
        valido: false,
        cedula: cedula,
        digitoVerificador: null,
        digitoCalculado: null,
        mensaje: 'La cédula debe tener exactamente 11 dígitos',
        informacion: null
      };
    }

    // Extraer partes de la cédula
    const secuencia = cedulaLimpia.substring(0, 3);
    const numeroDocumento = cedulaLimpia.substring(3, 10);
    const digitoVerificador = parseInt(cedulaLimpia.substring(10, 11));

    // Aplicar algoritmo Módulo 10
    const primeros10Digitos = cedulaLimpia.substring(0, 10);
    let suma = 0;

    // Multiplicar cada dígito alternadamente por 1 y 2
    for (let i = 0; i < primeros10Digitos.length; i++) {
      const digito = parseInt(primeros10Digitos[i]);
      const factor = (i % 2 === 0) ? 1 : 2;
      const producto = digito * factor;
      suma += producto;
    }

    // Calcular módulo 10
    const modulo = suma % 10;
    
    // Calcular dígito verificador esperado
    const digitoCalculado = modulo === 0 ? 0 : (10 - modulo);

    // Validar
    const esValida = digitoVerificador === digitoCalculado;

    return {
      valido: esValida,
      cedula: cedulaLimpia,
      digitoVerificador: digitoVerificador,
      digitoCalculado: digitoCalculado,
      mensaje: esValida 
        ? 'Cédula válida según algoritmo Módulo 10' 
        : `Dígito verificador incorrecto. Se esperaba ${digitoCalculado}`,
      informacion: {
        secuencia: secuencia,
        numeroDocumento: numeroDocumento,
        digitoVerificador: digitoVerificador.toString(),
        cedulaFormateada: `${secuencia}-${numeroDocumento}-${digitoVerificador}`
      },
      algoritmo: {
        primeros10Digitos: primeros10Digitos,
        suma: suma,
        modulo: modulo,
        calculo: `(10 - ${modulo}) = ${digitoCalculado}`
      }
    };

  } catch (error) {
    return {
      valido: false,
      cedula: cedula,
      digitoVerificador: null,
      digitoCalculado: null,
      mensaje: `Error al procesar la cédula: ${error.message}`,
      informacion: null
    };
  }
}

/**
 * Formatea una cédula al formato XXX-XXXXXXX-X
 * @param {string} cedula - Número de cédula
 * @returns {string} Cédula formateada
 */
function formatearCedula(cedula) {
  const cedulaLimpia = cedula.replace(/\D/g, '');
  
  if (cedulaLimpia.length !== 11) {
    return cedula;
  }

  return `${cedulaLimpia.substring(0, 3)}-${cedulaLimpia.substring(3, 10)}-${cedulaLimpia.substring(10)}`;
}

/**
 * Genera ejemplos de cédulas válidas e inválidas
 * @returns {Object} Ejemplos de cédulas
 */
function obtenerEjemplos() {
  return {
    validas: [
      '001-2134457-7',
      '402-1234567-4',
      '001-0000000-0'
    ],
    invalidas: [
      '001-2134457-4',
      '123-4567890-9',
      '001-234567-8'
    ]
  };
}

// Exportar funciones
module.exports = {
  validarCedula,
  formatearCedula,
  obtenerEjemplos
};
