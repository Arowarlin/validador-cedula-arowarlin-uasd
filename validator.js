class ValidadorCedula {
  
  static validarFormato(cedula) {
    const cedulaLimpia = cedula.replace(/\D/g, '');
    
    if (cedulaLimpia.length !== 11) {
      return {
        valido: false,
        error: 'La cédula debe tener 11 dígitos'
      };
    }
    
    return {
      valido: true,
      cedulaLimpia: cedulaLimpia
    };
  }
  
  static calcularDigitoVerificador(cedula) {
    const digitos = cedula.substring(0, 10).split('').map(Number);
    let suma = 0;
    
    for (let i = 0; i < digitos.length; i++) {
      let multiplicador = (i % 2 === 0) ? 1 : 2;
      suma += digitos[i] * multiplicador;
    }
    
    const modulo = suma % 10;
    const digitoVerificador = modulo === 0 ? 0 : 10 - modulo;
    
    return digitoVerificador;
  }
  
  static validarCedula(cedula) {
    const formatoResult = this.validarFormato(cedula);
    
    if (!formatoResult.valido) {
      return formatoResult;
    }
    
    const cedulaLimpia = formatoResult.cedulaLimpia;
    const digitoIngresado = parseInt(cedulaLimpia[10]);
    const digitoCalculado = this.calcularDigitoVerificador(cedulaLimpia);
    
    const esValida = digitoIngresado === digitoCalculado;
    
    return {
      valido: esValida,
      cedula: cedulaLimpia,
      digitoVerificador: digitoIngresado,
      digitoCalculado: digitoCalculado,
      mensaje: esValida ? 'Cédula válida' : 'Cédula inválida - dígito verificador incorrecto'
    };
  }
  
  static extraerInformacion(cedula) {
    const cedulaLimpia = cedula.replace(/\D/g, '');
    
    if (cedulaLimpia.length !== 11) {
      return null;
    }
    
    const secuencia = cedulaLimpia.substring(0, 3);
    const numeroDocumento = cedulaLimpia.substring(3, 10);
    const digitoVerificador = cedulaLimpia[10];
    
    return {
      secuencia: secuencia,
      numeroDocumento: numeroDocumento,
      digitoVerificador: digitoVerificador,
      cedulaFormateada: `${secuencia}-${numeroDocumento}-${digitoVerificador}`
    };
  }
}

module.exports = ValidadorCedula;