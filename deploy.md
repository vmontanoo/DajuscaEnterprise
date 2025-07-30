# 🚀 DAJUSCA Deploy Guide

## Opciones de Deploy

### 1. 🔧 Deploy Local (Desarrollo)
```bash
npm install
npm start
```
Sitio disponible en: http://localhost:3000

### 2. ☁️ Deploy en Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Login a Heroku
heroku login

# Crear app
heroku create dajusca-website

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### 3. 🌐 Deploy en Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy en producción
vercel --prod
```

### 4. 📦 Deploy en Netlify
1. Conectar repositorio GitHub a Netlify
2. Configurar build command: `npm run build`
3. Publish directory: `public`

### 5. 🐳 Deploy con Docker
```bash
# Crear imagen
docker build -t dajusca-website .

# Ejecutar contenedor
docker run -p 3000:3000 dajusca-website
```

## 📋 Checklist Pre-Deploy
- ✅ Archivos en carpeta `public/`
- ✅ Dependencies instaladas
- ✅ Variables de entorno configuradas
- ✅ Base de datos conectada (opcional)
- ✅ Tests pasando
- ✅ Chatbot funcionando

## 🔧 Variables de Entorno
```
PORT=3000
NODE_ENV=production
DB_SERVER=localhost
DB_NAME=DAJUSCA_DB
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```