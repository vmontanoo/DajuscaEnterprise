#!/bin/bash

echo "🚀 Iniciando DAJUSCA Website Deploy..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que existen los archivos necesarios
if [ ! -f "public/index.html" ]; then
    echo "❌ Archivos estáticos no encontrados en /public"
    exit 1
fi

# Configurar variables de entorno por defecto
export PORT=${PORT:-3000}
export NODE_ENV=${NODE_ENV:-production}

echo "✅ Configuración completada"
echo "🌐 Iniciando servidor en puerto $PORT..."

# Iniciar servidor
npm start