# 🪪 Validador de Cédula Dominicana - Arowarlin UASD

[![Deploy](https://img.shields.io/badge/deploy-render-success)](https://validador-cedula-arowarlin.onrender.com)
[![Database](https://img.shields.io/badge/database-supabase-green)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

Sistema web completo para validar cédulas de identidad y electoral de la República Dominicana utilizando el algoritmo de **Módulo 10**, con almacenamiento en la nube y estadísticas en tiempo real.

---

## 👨‍💻 Autor

**Arowarlin**  
Universidad Autónoma de Santo Domingo (UASD)

---

## 🌐 Demo en Vivo

🚀 **[Ver Demo](https://validador-cedula-arowarlin.onrender.com)**

> **Nota**: El plan gratuito de Render puede tardar 30-60 segundos en cargar si la aplicación está dormida.

---

## ✨ Características

- ✅ **Validación en tiempo real** - Algoritmo Módulo 10
- 📊 **Estadísticas en vivo** - Total, válidas, inválidas, porcentaje
- 📜 **Historial completo** - Todas las validaciones almacenadas
- 🎨 **Interfaz moderna** - Diseño responsive y atractivo
- ☁️ **Base de datos en la nube** - Supabase PostgreSQL
- 🚀 **API RESTful** - Endpoints documentados
- 📱 **Mobile-first** - Funciona en todos los dispositivos
- 🔒 **Seguro** - Row Level Security habilitado

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │  ← HTML + CSS + JavaScript
│   (index.html)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend       │  ← Node.js + Express
│   (server.js)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Database      │  ← Supabase PostgreSQL
│   (validaciones)│
└─────────────────┘
```

---

## 📁 Estructura del Proyecto

```
validador-cedula-arowarlin-uasd/
│
├── server.js              # Servidor Express principal
├── validator.js           # Lógica del algoritmo Módulo 10
├── supabaseClient.js      # Cliente de Supabase
├── package.json           # Dependencias
├── .env                   # Variables de entorno (NO subir a Git)
├── .env.example           # Ejemplo de variables
├── schema.sql             # Esquema de base de datos
│
├── public/
│   └── index.html         # Frontend completo
│
├── docs/
│   ├── SUPABASE_SETUP.md  # Guía de configuración Supabase
│   └── RENDER_DEPLOY.md   # Guía de despliegue Render
│
├── README.md              # Este archivo
└── LICENSE                # Licencia MIT
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18 o superior
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Render](https://render.com) (opcional, para despliegue)

### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/validador-cedula-arowarlin-uasd.git
cd validador-cedula-arowarlin-uasd

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 4. Iniciar servidor
npm start
```

La aplicación estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### 1. Configurar Supabase

Sigue la guía completa en: **[SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**

**Resumen rápido:**

1. Crea un proyecto en Supabase
2. Ejecuta el script `schema.sql` en el SQL Editor
3. Copia las credenciales al archivo `.env`

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### 2. Desplegar en Render

Sigue la guía completa en: **[RENDER_DEPLOY.md](docs/RENDER_DEPLOY.md)**

**Resumen rápido:**

1. Sube el proyecto a GitHub
2. Conecta Render con tu repositorio
3. Configura las variables de entorno
4. ¡Despliega!

---

## 📖 API Documentation

### Base URL

```
Local: http://localhost:3000
Producción: https://validador-cedula-arowarlin.onrender.com
```

### Endpoints

#### 1. Información del Servicio

```http
GET /api/info
```

**Respuesta:**
```json
{
  "proyecto": "Validador de Cédula Dominicana",
  "autor": "Arowarlin",
  "universidad": "UASD",
  "algoritmo": "Módulo 10",
  "version": "1.0.0"
}
```

#### 2. Validar Cédula

```http
POST /api/validar
Content-Type: application/json

{
  "cedula": "00121344577"
}
```

**Respuesta (válida):**
```json
{
  "valido": true,
  "cedula": "00121344577",
  "digitoVerificador": 7,
  "digitoCalculado": 7,
  "mensaje": "Cédula válida",
  "informacion": {
    "secuencia": "001",
    "numeroDocumento": "2134457",
    "digitoVerificador": "7",
    "cedulaFormateada": "001-2134457-7"
  },
  "id": 123
}
```

#### 3. Obtener Historial

```http
GET /api/historial?limit=20
```

**Respuesta:**
```json
{
  "total": 20,
  "validaciones": [
    {
      "id": 123,
      "cedula": "00121344577",
      "valido": true,
      "fecha": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 4. Obtener Estadísticas

```http
GET /api/estadisticas
```

**Respuesta:**
```json
{
  "total": 1000,
  "validas": 850,
  "invalidas": 150,
  "porcentajeValidas": 85.0
}
```

---

## 💡 Algoritmo Módulo 10

### Explicación

El algoritmo valida el dígito verificador de cédulas dominicanas de 11 dígitos.

### Pasos del Algoritmo

1. **Extraer los primeros 10 dígitos**
2. **Multiplicar alternadamente por 1 y 2**
3. **Sumar todos los productos**
4. **Calcular módulo 10**
5. **Dígito verificador = 10 - módulo** (o 0 si módulo es 0)

### Ejemplo Práctico

Para la cédula `001-2134457-7`:

```
Posición:  0   1   2   3   4   5   6   7   8   9
Dígito:    0   0   1   2   1   3   4   4   5   7
Factor:    1   2   1   2   1   2   1   2   1   2
          ─────────────────────────────────────────
Producto:  0   0   1   4   1   6   4   8   5   14

Suma: 0+0+1+4+1+6+4+8+5+14 = 43
Módulo: 43 % 10 = 3
Dígito Verificador: 10 - 3 = 7 ✓
```

El último dígito (7) coincide con el calculado, por lo tanto es **válida**.

---

## 🧪 Testing

### Cédulas de Prueba

**Válidas:**
```
001-2134457-7
402-1234567-4
001-0000000-0
```

**Inválidas:**
```
001-2134457-4  (dígito incorrecto)
123-4567890-9  (dígito incorrecto)
001-234567-8   (longitud incorrecta)
```

### Probar con cURL

```bash
# Validar cédula válida
curl -X POST https://validador-cedula-arowarlin.onrender.com/api/validar \
  -H "Content-Type: application/json" \
  -d '{"cedula": "00121344577"}'

# Obtener estadísticas
curl https://validador-cedula-arowarlin.onrender.com/api/estadisticas

# Obtener historial
curl https://validador-cedula-arowarlin.onrender.com/api/historial?limit=10
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Supabase** - Base de datos PostgreSQL en la nube
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Flexbox, Grid, Gradientes)
- **JavaScript ES6+** - Lógica del cliente
- **Fetch API** - Peticiones HTTP

### DevOps
- **Git** - Control de versiones
- **GitHub** - Repositorio remoto
- **Render** - Hosting y despliegue
- **Supabase** - Base de datos y backend

---

## 📊 Base de Datos

### Esquema de la Tabla `validaciones`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL | ID único (Primary Key) |
| cedula | VARCHAR(11) | Número de cédula |
| valido | BOOLEAN | ¿Es válida? |
| digito_verificador | INTEGER | Dígito ingresado |
| digito_calculado | INTEGER | Dígito calculado |
| mensaje | TEXT | Mensaje del resultado |
| fecha | TIMESTAMPTZ | Fecha de validación |
| created_at | TIMESTAMPTZ | Fecha de creación |

### Índices

- `idx_validaciones_cedula` - Búsqueda por cédula
- `idx_validaciones_fecha` - Ordenamiento por fecha
- `idx_validaciones_valido` - Filtrado por validez

---

## 🔒 Seguridad

- ✅ **Row Level Security** (RLS) habilitado en Supabase
- ✅ **CORS** configurado apropiadamente
- ✅ **Variables de entorno** para credenciales
- ✅ **Validación de entrada** en el servidor
- ✅ **HTTPS** en producción (automático con Render)

---

## 📱 Responsive Design

La aplicación se adapta a:

- 📱 Móviles (320px - 768px)
- 📱 Tablets (768px - 1024px)
- 💻 Desktop (1024px+)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -m 'Agregar mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

```
MIT License - Copyright (c) 2024 Arowarlin - UASD
```

---

## 🎓 Propósito Académico

Este proyecto fue desarrollado como parte de un proyecto académico en la **Universidad Autónoma de Santo Domingo (UASD)** para demostrar:

- ✅ Implementación de algoritmos de validación
- ✅ Desarrollo full-stack con Node.js
- ✅ Integración con bases de datos en la nube
- ✅ Despliegue de aplicaciones web
- ✅ Desarrollo de APIs RESTful
- ✅ Buenas prácticas de programación

---

## 📞 Contacto

**Arowarlin**  
Universidad Autónoma de Santo Domingo (UASD)

- 📧 Email: arowarlin@uasd.edu.do
- 🐙 GitHub: [@arowarlin](https://github.com/arowarlin)
- 🏫 Universidad: [UASD](https://uasd.edu.do)

---

## 🌟 Agradecimientos

- **UASD** - Por la formación académica
- **Supabase** - Por la infraestructura de base de datos
- **Render** - Por el hosting gratuito
- **JCE** - Por la especificación del formato de cédulas

---

## 📚 Referencias

- [Junta Central Electoral (JCE)](https://jce.gob.do)
- [Algoritmo de Luhn](https://en.wikipedia.org/wiki/Luhn_algorithm)
- [Supabase Documentation](https://supabase.com/docs)
- [Render Documentation](https://render.com/docs)
- [Express.js Guide](https://expressjs.com)

---

## 🎯 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Autenticación de usuarios
- [ ] Exportar historial a CSV/Excel
- [ ] Gráficos de estadísticas
- [ ] API rate limiting
- [ ] Modo oscuro

### Versión 2.0 (Futuro)
- [ ] Validación por lotes (múltiples cédulas)
- [ ] Integración con API oficial JCE
- [ ] Aplicación móvil (React Native)
- [ ] Dashboard de administración
- [ ] Webhooks para integraciones

---

**⭐ Si te gustó este proyecto, considera darle una estrella en GitHub**

---

**Desarrollado con ❤️ por Arowarlin | UASD 2024**

🔗 **[https://validador-cedula-arowarlin.onrender.com](https://validador-cedula-arowarlin.onrender.com)**