# Gestión de Imágenes para DAJUSCA

## 📋 Funcionalidades Implementadas

He implementado un sistema completo de gestión de imágenes para tu sitio web de DAJUSCA que permite subir, gestionar y mostrar imágenes reales tanto en el catálogo de productos como en la galería de proyectos realizados.

## 🚀 Características Principales

### 1. **Catálogo de Productos con Imágenes Reales**
- Subida de imágenes de productos
- Gestión de información del producto (nombre, categoría, descripción, precio)
- Visualización dinámica de productos con imágenes reales
- Sistema de filtrado por categorías

### 2. **Galería de Proyectos Realizados**
- Subida de imágenes de proyectos completados
- Información del proyecto (nombre, cliente, categoría, descripción)
- Galería visual atractiva con overlays informativos

### 3. **Panel de Administración**
- Sistema de login seguro para administradores
- Interfaz intuitiva para gestionar contenido
- Capacidad de eliminar imágenes
- Controles administrativos ocultos para usuarios normales

## 🔧 Configuración Técnica

### Estructura de Directorios
```
/uploads/
  /catalog/     # Imágenes del catálogo
  /gallery/     # Imágenes de la galería
  /orders/      # Imágenes de órdenes (ya existía)
```

### Formatos de Imagen Soportados
- **Catálogo y Galería**: PNG, JPG, JPEG, WebP
- **Órdenes**: Solo PNG (mantiene configuración original)
- **Tamaño máximo**: 5MB para catálogo y galería, 10MB para órdenes

## 🎯 Cómo Usar el Sistema

### Para Administradores:

#### 1. **Acceder al Panel Administrativo**
1. Ve al final de la página web (footer)
2. Haz clic en el ícono de engranaje (⚙️) en la esquina inferior derecha
3. Ingresa las credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `dajusca2024`

#### 2. **Gestionar Catálogo**
1. Inicia sesión como administrador
2. Haz clic en "Gestionar Catálogo" en el panel superior
3. Completa el formulario:
   - Selecciona la imagen del producto
   - Ingresa el nombre del producto
   - Selecciona la categoría
   - Agrega una descripción
   - Especifica el precio
4. Haz clic en "Subir Producto"

#### 3. **Gestionar Galería**
1. Desde el panel administrativo, haz clic en "Gestionar Galería"
2. Completa el formulario:
   - Selecciona la imagen del proyecto
   - Ingresa el nombre del proyecto
   - Selecciona la categoría
   - Especifica el nombre del cliente
   - Agrega una descripción del proyecto
3. Haz clic en "Subir Proyecto"

#### 4. **Eliminar Contenido**
- Con sesión iniciada, verás botones de eliminar (🗑️) en cada imagen
- Haz clic para eliminar y confirma la acción

### Para Visitantes:
- Verán las imágenes reales en lugar de placeholders
- Pueden filtrar productos por categoría
- Pueden ver la galería de proyectos completados
- No tienen acceso a controles administrativos

## 🛡️ Seguridad

### Credenciales de Administrador
- **Usuario**: `admin`
- **Contraseña**: `dajusca2024`

> ⚠️ **Importante**: Cambia estas credenciales en producción modificando la función `handleAdminLogin` en `dajusca-script.js`

### Validaciones Implementadas
- Verificación de tipos de archivo
- Límites de tamaño de archivo
- Validación de campos requeridos
- Protección contra acceso no autorizado

## 📡 API Endpoints

### Catálogo
- `POST /api/upload-catalog-image` - Subir imagen de producto
- `GET /api/catalog-images` - Obtener lista de imágenes
- `DELETE /api/catalog-image/:filename` - Eliminar imagen

### Galería
- `POST /api/upload-gallery-image` - Subir imagen de proyecto
- `GET /api/gallery-images` - Obtener lista de imágenes
- `DELETE /api/gallery-image/:filename` - Eliminar imagen

## 🎨 Comportamiento del Sistema

### Sin Imágenes Subidas
- El sitio muestra placeholders con iconos por defecto
- Mantiene toda la funcionalidad visual original

### Con Imágenes Subidas
- Las imágenes reales reemplazan los placeholders
- Se mantiene el diseño responsivo
- Efectos hover y animaciones funcionan normalmente

## 🔄 Fallback System

Si no hay imágenes subidas o hay problemas de conexión:
1. El sistema automáticamente muestra elementos por defecto
2. Mantiene la funcionalidad completa del sitio
3. Los usuarios no experimentan errores visuales

## 📱 Responsive Design

- Todas las funcionalidades son completamente responsivas
- El panel administrativo se adapta a dispositivos móviles
- Las imágenes se optimizan automáticamente para diferentes tamaños de pantalla

## 🚀 Para Empezar

1. **Inicia el servidor**:
   ```bash
   npm start
   ```

2. **Accede a la web**: `http://localhost:3000`

3. **Inicia sesión como admin** usando las credenciales proporcionadas

4. **Comienza a subir imágenes** de tus productos y proyectos reales

## 💡 Consejos de Uso

### Para Mejores Resultados:
- Usa imágenes de alta calidad (1200x800px o superior)
- Mantén un estilo visual consistente
- Optimiza las imágenes antes de subirlas para mejor rendimiento
- Organiza los productos por categorías apropiadas

### Mantenimiento:
- Revisa regularmente el espacio de almacenamiento
- Realiza copias de seguridad de la carpeta `/uploads/`
- Actualiza las credenciales de administrador regularmente

## 🔧 Personalización Avanzada

### Cambiar Credenciales de Admin
Edita el archivo `dajusca-script.js`, línea aproximada 2100:
```javascript
if (username === 'TU_USUARIO' && password === 'TU_PASSWORD') {
    // ...
}
```

### Modificar Categorías
Edita los archivos HTML para agregar/quitar categorías en los formularios y filtros.

### Personalizar Validaciones
Modifica las configuraciones de Multer en `server.js` para cambiar:
- Tipos de archivo permitidos
- Tamaños máximos
- Rutas de almacenamiento

¡Tu sistema de gestión de imágenes está listo para usar! 🎉