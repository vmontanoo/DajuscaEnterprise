# 🗄️ DAJUSCA - Conexión con Base de Datos SQL Server

Esta guía te ayudará a conectar tu página web de DAJUSCA con tu base de datos SQL Server.

## 📋 **Requisitos Previos**

- ✅ **Node.js** (versión 16 o superior)
- ✅ **SQL Server** funcionando en tu PC
- ✅ **SQL Server Management Studio** (SSMS)
- ✅ Página web de DAJUSCA creada

## 🚀 **Paso 1: Configurar la Base de Datos**

### **1.1 Crear la Base de Datos**
```sql
-- En SQL Server Management Studio, ejecuta:
CREATE DATABASE DAJUSCA_DB;
```

### **1.2 Ejecutar el Script de Creación**
1. Abre **SQL Server Management Studio**
2. Conecta a tu servidor local
3. Abre el archivo `database_setup.sql`
4. Ejecuta todo el script (F5)

Esto creará:
- ✅ **8 Tablas**: Clientes, Muebles, Proyectos, Testimonios, etc.
- ✅ **Datos de ejemplo** para testing
- ✅ **Índices** para optimización
- ✅ **Vistas** y **Procedimientos almacenados**

## 🔧 **Paso 2: Configurar el Backend**

### **2.1 Crear Estructura de Carpetas**
```
proyecto/
├── public/
│   ├── dajusca.html
│   ├── dajusca-styles.css
│   └── dajusca-script.js
├── server.js
├── package.json
├── .env
└── database_setup.sql
```

### **2.2 Mover Archivos**
```bash
# Crear carpeta public y mover archivos de la web
mkdir public
mv dajusca.html public/
mv dajusca-styles.css public/
mv dajusca-script.js public/
```

### **2.3 Instalar Dependencias**
```bash
# Instalar Node.js si no lo tienes
# Descargar desde: https://nodejs.org

# Instalar dependencias del proyecto
npm install
```

### **2.4 Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos reales
```

Edita el archivo `.env`:
```env
DB_SERVER=localhost
DB_DATABASE=DAJUSCA_DB
DB_USER=tu_usuario_sql_server
DB_PASSWORD=tu_password_sql_server
PORT=3000
```

## ▶️ **Paso 3: Ejecutar el Sistema**

### **3.1 Iniciar el Servidor**
```bash
# Desarrollo (con auto-restart)
npm run dev

# Producción
npm start
```

### **3.2 Verificar Conexión**
- ✅ Servidor: `http://localhost:3000`
- ✅ API: `http://localhost:3000/api/muebles`
- ✅ Página web: `http://localhost:3000`

## 🔌 **Endpoints de la API**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/muebles` | Obtener catálogo completo |
| `GET` | `/api/muebles/categoria/:categoria` | Filtrar por categoría |
| `POST` | `/api/cotizaciones` | Guardar cotización del configurador 3D |
| `GET` | `/api/testimonios` | Obtener testimonios de clientes |
| `GET` | `/api/estadisticas` | Obtener estadísticas de la empresa |
| `GET` | `/api/galeria` | Obtener galería de trabajos |
| `POST` | `/api/contacto` | Procesar formulario de contacto |

## 🔄 **Paso 4: Actualizar JavaScript del Frontend**

Agrega estas funciones al final de `dajusca-script.js`:

```javascript
// ========================
// CONEXIÓN CON BACKEND
// ========================

// Cargar catálogo desde la base de datos
async function loadCatalogFromDB() {
    try {
        const response = await fetch('/api/muebles');
        const data = await response.json();
        
        if (data.success) {
            updateCatalogUI(data.data);
        }
    } catch (error) {
        console.error('Error cargando catálogo:', error);
    }
}

// Cargar testimonios desde la base de datos
async function loadTestimonialsFromDB() {
    try {
        const response = await fetch('/api/testimonios');
        const data = await response.json();
        
        if (data.success) {
            updateTestimonialsUI(data.data);
        }
    } catch (error) {
        console.error('Error cargando testimonios:', error);
    }
}

// Cargar estadísticas desde la base de datos
async function loadStatisticsFromDB() {
    try {
        const response = await fetch('/api/estadisticas');
        const data = await response.json();
        
        if (data.success) {
            updateStatisticsUI(data.data);
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// Enviar cotización al backend
async function saveQuoteToServer(quoteData) {
    try {
        const response = await fetch('/api/cotizaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quoteData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Cotización guardada exitosamente', 'success');
            return result.cotizacion_id;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error guardando cotización:', error);
        showNotification('Error al guardar la cotización', 'error');
    }
}

// Enviar formulario de contacto al backend
async function sendContactForm(formData) {
    try {
        const response = await fetch('/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            return true;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error enviando formulario:', error);
        showNotification('Error al enviar el mensaje', 'error');
        return false;
    }
}

// Inicializar datos desde la base de datos
document.addEventListener('DOMContentLoaded', function() {
    loadCatalogFromDB();
    loadTestimonialsFromDB();
    loadStatisticsFromDB();
});
```

## 📊 **Estructura de la Base de Datos**

### **Tablas Principales:**

1. **Muebles** - Catálogo de productos
2. **Clientes** - Información de clientes
3. **Proyectos** - Trabajos realizados
4. **Testimonios** - Reseñas de clientes
5. **Cotizaciones** - Solicitudes del configurador 3D
6. **Contactos** - Mensajes del formulario
7. **Categorias** - Tipos de muebles
8. **Configuraciones** - Ajustes del sistema

## 🔧 **Solución de Problemas**

### **Error de Conexión a SQL Server**
```bash
# Verificar que SQL Server esté corriendo
services.msc # Buscar "SQL Server"

# Verificar configuración TCP/IP
# SQL Server Configuration Manager > TCP/IP > Enabled
```

### **Error de Autenticación**
```sql
-- Crear usuario SQL Server si usas autenticación mixta
CREATE LOGIN dajusca_user WITH PASSWORD = 'tu_password';
USE DAJUSCA_DB;
CREATE USER dajusca_user FOR LOGIN dajusca_user;
ALTER ROLE db_owner ADD MEMBER dajusca_user;
```

### **Puerto Ocupado**
```bash
# Cambiar puerto en .env
PORT=3001

# O terminar proceso
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 🌐 **Publicar en Internet**

### **Opción 1: Heroku (Recomendado)**
```bash
# Instalar Heroku CLI
# Crear cuenta en heroku.com

heroku create dajusca-app
heroku config:set DB_SERVER=tu_servidor_remoto
heroku config:set DB_DATABASE=DAJUSCA_DB
# ... otras variables
git push heroku main
```

### **Opción 2: VPS (Servidor Dedicado)**
- Contratar VPS (DigitalOcean, AWS, etc.)
- Instalar Node.js y SQL Server
- Subir archivos vía FTP/SSH
- Configurar dominio

### **Opción 3: Hosting Compartido**
- Buscar hosting que soporte Node.js
- Muchos incluyen bases de datos MySQL/PostgreSQL
- Adaptar código para la base de datos disponible

## 📈 **Monitoreo y Mantenimiento**

### **Logs del Sistema**
```bash
# Ver logs en tiempo real
npm run dev

# Logs de producción
pm2 logs dajusca
```

### **Backup de Base de Datos**
```sql
-- Backup automático
BACKUP DATABASE DAJUSCA_DB 
TO DISK = 'C:\Backups\DAJUSCA_backup.bak';
```

### **Actualizar Datos**
```sql
-- Agregar nuevos muebles
INSERT INTO Muebles (nombre, categoria, descripcion, precio_desde) 
VALUES ('Nuevo Mueble', 'categoria', 'Descripción', 100000);

-- Actualizar precios
UPDATE Muebles SET precio_desde = precio_desde * 1.1; -- Aumento 10%
```

## 🎯 **Próximos Pasos**

1. ✅ **Configurar base de datos**
2. ✅ **Instalar y ejecutar backend**
3. ✅ **Conectar frontend con API**
4. 🔄 **Agregar autenticación admin**
5. 🔄 **Panel de administración**
6. 🔄 **Sistema de notificaciones email**
7. 🔄 **Integración con WhatsApp**
8. 🔄 **Sistema de inventario**

---

## 📞 **Soporte**

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la conexión a la base de datos
3. Confirma que todas las dependencias estén instaladas
4. Revisa la configuración del archivo `.env`

¡Tu página web de DAJUSCA ahora está conectada a la base de datos! 🎉