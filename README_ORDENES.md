# 📦 Sistema de Órdenes Personalizadas - DAJUSCA

## 🎯 Descripción

Este sistema permite a los clientes enviar solicitudes de muebles personalizados a través de la página web de DAJUSCA. Los clientes pueden cargar una imagen PNG de referencia junto con los detalles del proyecto, y el propietario recibe toda la información por correo electrónico.

## ✨ Características Principales

- 📤 **Carga de archivos PNG**: Solo archivos PNG hasta 10MB
- 📧 **Notificación por email**: Email profesional al propietario con todos los detalles
- 💾 **Almacenamiento en BD**: Las órdenes se guardan en SQL Server
- 📱 **Diseño responsive**: Funciona perfecto en móviles y tablets
- ✅ **Validación completa**: Validación tanto frontend como backend
- 🎨 **Interfaz intuitiva**: Drag & drop para subir archivos

## 🚀 Cómo Usar el Sistema

### Para Clientes:

1. **Ir a la sección "Hacer Pedido"** en la navegación principal
2. **Completar el formulario** con:
   - Nombre completo
   - Teléfono
   - Email
   - Tipo de mueble (opcional)
   - Descripción detallada del proyecto
   - Presupuesto aproximado (opcional)
3. **Subir imagen PNG** arrastrando el archivo o haciendo clic
4. **Aceptar términos** y hacer clic en "Enviar Solicitud"

### Para el Propietario:

1. **Recibir email** con todos los detalles del cliente
2. **Ver imagen adjunta** con la referencia del mueble
3. **Contactar al cliente** usando la información proporcionada

## ⚙️ Configuración del Sistema

### 1. Variables de Entorno (.env)

```env
# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM=tu_email@gmail.com
OWNER_EMAIL=propietario@dajusca.com

# Configuración de archivos
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads/orders
```

### 2. Configuración de Gmail

Para usar Gmail como servidor de correo:

1. **Activar verificación en 2 pasos** en tu cuenta de Gmail
2. **Generar contraseña de aplicación**:
   - Ve a tu cuenta de Google → Seguridad
   - Busca "Contraseñas de aplicaciones"
   - Genera una nueva contraseña para "Otra aplicación"
   - Usa esta contraseña en `EMAIL_PASSWORD`

### 3. Base de Datos

Ejecuta el script `database_setup.sql` para crear la tabla `custom_orders`:

```sql
-- La tabla se crea automáticamente al ejecutar el script
-- Incluye campos para todos los datos del cliente y la orden
```

## 📂 Estructura de Archivos

```
/
├── dajusca.html          # Página principal con formulario
├── dajusca-styles.css    # Estilos CSS para el formulario
├── dajusca-script.js     # JavaScript para validación y envío
├── server.js             # Backend con endpoints
├── .env                  # Variables de entorno
├── uploads/orders/       # Directorio para imágenes subidas
└── README_ORDENES.md     # Esta documentación
```

## 🛠️ Endpoints de la API

### POST `/api/submit-order`

Recibe órdenes personalizadas con archivo adjunto.

**Body (multipart/form-data):**
```javascript
{
  clientName: "string",
  clientPhone: "string", 
  clientEmail: "string",
  furnitureType: "string", // opcional
  projectDescription: "string",
  budget: "string", // opcional
  referenceImage: File // archivo PNG
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Orden enviada exitosamente. Te contactaremos pronto.",
  "orderId": "ORD-1234567890"
}
```

### GET `/api/orders`

Obtiene todas las órdenes (para administración).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "client_name": "Juan Pérez",
      "client_email": "juan@email.com",
      "client_phone": "+57 300 123 4567",
      "furniture_type": "closet",
      "project_description": "...",
      "budget": "500000-1000000",
      "submission_date": "2024-01-15T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

## 🎨 Personalización

### Modificar Estilos

Los estilos están en `dajusca-styles.css` en la sección:
```css
/* SECCIÓN DE ÓRDENES PERSONALIZADAS */
.custom-orders { ... }
```

### Modificar Validaciones

Las validaciones están en `dajusca-script.js` en la función:
```javascript
function validateForm() { ... }
```

### Modificar Email Template

El template del email está en `server.js` en la función:
```javascript
async function sendOrderEmail(orderData, imagePath) { ... }
```

## 🚨 Solución de Problemas

### Email no se envía

1. **Verificar credenciales** en el archivo `.env`
2. **Revisar logs** del servidor para errores específicos
3. **Verificar configuración** de contraseña de aplicación de Gmail

### Archivos no se suben

1. **Verificar permisos** de la carpeta `uploads/orders`
2. **Comprobar tamaño** del archivo (máximo 10MB)
3. **Verificar formato** (solo PNG permitido)

### Base de datos no funciona

1. **Verificar conexión** a SQL Server
2. **Ejecutar script** `database_setup.sql`
3. **Revisar credenciales** de BD en `.env`

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Iniciar servidor en desarrollo
npm run dev

# Iniciar servidor en producción
npm start

# Ver logs del servidor
tail -f server.log

# Limpiar archivos subidos antiguos
find uploads/orders -name "*.png" -mtime +30 -delete
```

## 📊 Base de Datos

### Tabla `custom_orders`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | ID único auto-incremental |
| `client_name` | NVARCHAR(100) | Nombre del cliente |
| `client_phone` | NVARCHAR(20) | Teléfono del cliente |
| `client_email` | NVARCHAR(100) | Email del cliente |
| `furniture_type` | NVARCHAR(50) | Tipo de mueble (opcional) |
| `project_description` | NTEXT | Descripción del proyecto |
| `budget` | NVARCHAR(50) | Rango de presupuesto |
| `image_filename` | NVARCHAR(255) | Nombre del archivo de imagen |
| `submission_date` | DATETIME | Fecha de envío |
| `status` | NVARCHAR(20) | Estado: pending, in_progress, completed, cancelled |
| `notes` | NTEXT | Notas adicionales (opcional) |

## 🔐 Seguridad

- ✅ **Validación de archivos**: Solo PNG permitidos
- ✅ **Límite de tamaño**: Máximo 10MB por archivo
- ✅ **Sanitización**: Datos del formulario validados y limpiados
- ✅ **Nombres únicos**: Los archivos se renombran para evitar conflictos
- ✅ **Validación de email**: Formato de email verificado

## 📞 Soporte

Para cualquier problema o consulta sobre el sistema de órdenes personalizadas, contacta al desarrollador o revisa los logs del servidor para más detalles sobre errores específicos.

---

**DAJUSCA - Muebles a Medida** 🪑✨