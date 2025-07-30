# 🤖 Chatbot DAJUSCA - Asistente Virtual

## Descripción
Se ha implementado un chatbot inteligente en la página principal de DAJUSCA para atender las preguntas frecuentes de los clientes de manera automática y eficiente.

## Características del Chatbot

### 🎯 Funcionalidades Principales
- **Botón flotante**: Chatbot accesible desde cualquier página
- **Preguntas rápidas**: Botones predefinidos para las consultas más comunes
- **Chat interactivo**: Los usuarios pueden escribir sus propias preguntas
- **Diseño responsive**: Se adapta a dispositivos móviles y desktop
- **Animaciones suaves**: Transiciones y efectos visuales atractivos

### 📋 Preguntas Frecuentes Incluidas
1. **Precios** - Información detallada sobre costos por tipo de mueble
2. **Tiempo de fabricación** - Plazos de entrega por categoría
3. **Materiales** - Tipos de madera y complementos utilizados
4. **Garantía** - Información sobre garantías y servicio post-venta
5. **Muebles a medida** - Proceso de medición y personalización
6. **Contacto** - Información completa de contacto

### 🎨 Diseño y UX
- **Colores consistentes**: Utiliza la paleta de colores de DAJUSCA
- **Iconografía**: Emojis y iconos para mejor comprensión
- **Tipografía**: Fuentes legibles y profesionales
- **Espaciado**: Diseño limpio y fácil de leer

## Implementación Técnica

### 📁 Archivos Modificados
- `dajusca.html` - Estructura HTML del chatbot
- `dajusca-styles.css` - Estilos CSS del chatbot
- `dajusca-script.js` - Funcionalidad JavaScript

### 🔧 Componentes del Chatbot

#### HTML Structure
```html
<div id="chatbot" class="chatbot">
    <div class="chatbot-toggle" id="chatbotToggle">
        <i class="fas fa-comments"></i>
        <span class="chatbot-badge">1</span>
    </div>
    
    <div class="chatbot-container" id="chatbotContainer">
        <!-- Header, Messages, Input -->
    </div>
</div>
```

#### CSS Features
- Posicionamiento fijo en la esquina inferior derecha
- Animaciones de entrada y salida
- Diseño responsive para móviles
- Sombras y efectos visuales

#### JavaScript Functionality
- Base de conocimiento con respuestas predefinidas
- Sistema de mensajes dinámicos
- Manejo de eventos de usuario
- Animaciones y transiciones

## Uso del Chatbot

### Para los Clientes
1. **Abrir el chat**: Hacer clic en el botón flotante con icono de chat
2. **Preguntas rápidas**: Usar los botones predefinidos para consultas comunes
3. **Pregunta personalizada**: Escribir en el campo de texto
4. **Cerrar chat**: Usar el botón X en la esquina superior derecha

### Para los Administradores
- **Modificar respuestas**: Editar el objeto `chatbotKnowledge` en `dajusca-script.js`
- **Agregar preguntas**: Añadir nuevas entradas al objeto de conocimiento
- **Personalizar diseño**: Modificar estilos en `dajusca-styles.css`

## Base de Conocimiento

### Estructura de Datos
```javascript
const chatbotKnowledge = {
    'precios': {
        title: "Título de la respuesta",
        content: "Contenido detallado de la respuesta"
    },
    // Más preguntas...
};
```

### Tipos de Respuesta
- **Información de precios** con rangos por categoría
- **Tiempos de fabricación** con factores que los afectan
- **Especificaciones técnicas** de materiales y acabados
- **Información de contacto** completa
- **Procesos de trabajo** paso a paso

## Beneficios del Chatbot

### Para DAJUSCA
- **Reducción de carga**: Menos llamadas telefónicas repetitivas
- **Disponibilidad 24/7**: Atención automática en cualquier momento
- **Información consistente**: Respuestas estandarizadas
- **Generación de leads**: Captura de información de contacto

### Para los Clientes
- **Respuestas inmediatas**: Sin esperar en línea telefónica
- **Información detallada**: Respuestas completas y estructuradas
- **Facilidad de uso**: Interfaz intuitiva y accesible
- **Disponibilidad**: Acceso desde cualquier dispositivo

## Personalización y Mantenimiento

### Agregar Nuevas Preguntas
1. Añadir nueva entrada al objeto `chatbotKnowledge`
2. Crear botón correspondiente en el HTML
3. Probar la funcionalidad

### Modificar Diseño
- Colores: Variables CSS en `:root`
- Tamaños: Clases CSS específicas del chatbot
- Animaciones: Keyframes y transiciones

### Mejoras Futuras
- Integración con base de datos para respuestas dinámicas
- Sistema de análisis de conversaciones
- Integración con WhatsApp Business
- Chat en vivo con agentes humanos

## Soporte Técnico

Para cualquier problema o mejora del chatbot:
- Revisar la consola del navegador para errores
- Verificar que todos los archivos estén cargados correctamente
- Comprobar la compatibilidad con diferentes navegadores

---

**Desarrollado para DAJUSCA - Muebles a Medida** 🪑