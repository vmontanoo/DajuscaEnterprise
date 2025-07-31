const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware básico
app.use(express.json());
app.use(express.static('.'));

// Ruta de prueba
app.get('/', (req, res) => {
    console.log('✅ Solicitud recibida en /');
    res.sendFile(path.join(__dirname, 'dajusca.html'));
});

// Ruta de prueba de API
app.get('/api/test', (req, res) => {
    console.log('✅ API test funcionando');
    res.json({ 
        success: true, 
        message: 'Servidor funcionando correctamente', 
        timestamp: new Date() 
    });
});

// Endpoint simple para formularios
app.post('/api/submit-order', (req, res) => {
    console.log('📋 Orden recibida (modo prueba)');
    res.json({
        success: true,
        message: 'Orden recibida exitosamente en modo prueba',
        orderId: `TEST-${Date.now()}`
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor de prueba iniciado`);
    console.log(`📱 Puerto: ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});

console.log('🔧 Iniciando servidor de prueba...');