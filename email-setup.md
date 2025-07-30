# 📧 Configuración de Email para DAJUSCA

## 🚀 Configuración Rápida

### 1. **Variables de Entorno (.env)**

Actualiza tu archivo `.env` con tus credenciales de email:

```env
# Configuración de Email
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
OWNER_EMAIL=propietario@dajusca.com

# Configuración SMTP (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### 2. **Configuración de Gmail**

Para usar Gmail, necesitas crear una **contraseña de aplicación**:

1. Ve a [Google Account Settings](https://myaccount.google.com/)
2. Selecciona "Seguridad" → "Verificación en 2 pasos"
3. Habilita la verificación en 2 pasos si no está activada
4. Busca "Contraseñas de aplicaciones"
5. Genera una nueva contraseña para "Correo"
6. Usa esta contraseña en `EMAIL_PASSWORD`

### 3. **Proveedores de Email Alternativos**

#### **Outlook/Hotmail**
```env
EMAIL_USER=tu_email@outlook.com
EMAIL_PASSWORD=tu_contraseña
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### **Yahoo Mail**
```env
EMAIL_USER=tu_email@yahoo.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### **SendGrid (Recomendado para producción)**
```env
EMAIL_USER=apikey
EMAIL_PASSWORD=tu_sendgrid_api_key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

#### **Mailgun**
```env
EMAIL_USER=postmaster@tu-dominio.mailgun.org
EMAIL_PASSWORD=tu_mailgun_password
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
```

## 🛠️ Funcionalidades Implementadas

### **📨 Emails Automáticos**
- **Para el Propietario**: Notificación detallada con toda la información del cliente
- **Para el Cliente**: Email de confirmación profesional con información de contacto

### **🎨 Plantillas HTML**
- Diseño responsive que funciona en todos los dispositivos
- Colores y branding coherente con DAJUSCA
- Información organizada y fácil de leer

### **⚡ Características Avanzadas**
- Priorización automática de emails (cotizaciones = alta prioridad)
- Validación de formularios en tiempo real
- Mensajes de estado y notificaciones
- Integración opcional con base de datos
- Manejo de errores robusto

## 🧪 Pruebas

### **Verificar Configuración**
```bash
curl http://localhost:3000/api/email/verify
```

### **Probar Envío de Email**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario",
    "email": "test@ejemplo.com",
    "telefono": "+57 300 123 4567",
    "tipoConsulta": "cotizacion",
    "mensaje": "Este es un mensaje de prueba"
  }'
```

## 🚨 Solución de Problemas

### **Error: "Invalid login"**
- Verifica que la contraseña de aplicación sea correcta
- Asegúrate de haber habilitado la verificación en 2 pasos

### **Error: "Connection timeout"**
- Verifica tu conexión a internet
- Confirma que el puerto SMTP esté abierto

### **Error: "Authentication failed"**
- Revisa las credenciales en el archivo `.env`
- Verifica que el email y la contraseña sean correctos

### **Emails no llegan**
- Revisa la carpeta de spam
- Confirma que `OWNER_EMAIL` esté configurado correctamente
- Verifica los logs del servidor para errores

## 🔧 Personalización

### **Modificar Plantillas de Email**
Edita `services/emailService.js` para personalizar:
- Colores y diseño
- Texto de los emails
- Información adicional
- Acciones recomendadas

### **Agregar Campos al Formulario**
1. Actualiza el HTML en `public/index.html`
2. Modifica la validación en `public/dajusca-script.js`
3. Actualiza el endpoint en `server.js`
4. Incluye los nuevos campos en las plantillas de email

## 📊 Monitoreo

El sistema registra automáticamente:
- ✅ Emails enviados exitosamente
- ❌ Errores en el envío
- 📝 Datos de contacto en base de datos (opcional)
- 🕒 Timestamps de todas las operaciones

## 🌟 Características Premium

Para uso en producción, considera:
- **SendGrid** o **Mailgun** para mayor confiabilidad
- **Templates dinámicos** con más personalización
- **Webhooks** para tracking de apertura de emails
- **CRM integration** para gestión de leads
- **Auto-responders** con secuencias de emails