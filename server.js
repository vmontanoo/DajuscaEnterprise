const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos
app.use(express.static('.', { 
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'public, max-age=0');
        }
    }
}));

// Configuración de la base de datos SQL Server
const dbConfig = {
    server: 'localhost', // o tu IP del servidor
    database: 'DAJUSCA_DB', // nombre de tu base de datos
    user: 'tu_usuario', // tu usuario de SQL Server
    password: 'tu_password', // tu contraseña
    options: {
        encrypt: false, // true si usas Azure
        trustServerCertificate: true // para desarrollo local
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Conexión a la base de datos
let pool;

async function connectDB() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Conectado a SQL Server');
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
    }
}

// Inicializar conexión
connectDB();

// ========================
// RUTAS API PARA DAJUSCA
// ========================

// 1. Obtener todos los muebles del catálogo
app.get('/api/muebles', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT 
                id,
                nombre,
                categoria,
                descripcion,
                precio_desde,
                imagen_url,
                fecha_creacion
            FROM Muebles 
            WHERE activo = 1
            ORDER BY categoria, nombre
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error('Error obteniendo muebles:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el catálogo'
        });
    }
});

// 2. Obtener muebles por categoría
app.get('/api/muebles/categoria/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        const request = pool.request();
        request.input('categoria', sql.VarChar, categoria);
        
        const result = await request.query(`
            SELECT * FROM Muebles 
            WHERE categoria = @categoria AND activo = 1
            ORDER BY nombre
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error('Error obteniendo muebles por categoría:', err);
        res.status(500).json({
            success: false,
            message: 'Error al filtrar muebles'
        });
    }
});

// 3. Guardar cotización del configurador 3D
app.post('/api/cotizaciones', async (req, res) => {
    try {
        const {
            nombre_cliente,
            email_cliente,
            telefono_cliente,
            tipo_mueble,
            dimensiones,
            material,
            color,
            precio_estimado,
            mensaje
        } = req.body;
        
        const request = pool.request();
        request.input('nombre_cliente', sql.VarChar, nombre_cliente);
        request.input('email_cliente', sql.VarChar, email_cliente);
        request.input('telefono_cliente', sql.VarChar, telefono_cliente);
        request.input('tipo_mueble', sql.VarChar, tipo_mueble);
        request.input('dimensiones', sql.VarChar, JSON.stringify(dimensiones));
        request.input('material', sql.VarChar, material);
        request.input('color', sql.VarChar, color);
        request.input('precio_estimado', sql.Decimal(10,2), precio_estimado);
        request.input('mensaje', sql.Text, mensaje);
        
        const result = await request.query(`
            INSERT INTO Cotizaciones (
                nombre_cliente, email_cliente, telefono_cliente,
                tipo_mueble, dimensiones, material, color,
                precio_estimado, mensaje, fecha_solicitud, estado
            ) VALUES (
                @nombre_cliente, @email_cliente, @telefono_cliente,
                @tipo_mueble, @dimensiones, @material, @color,
                @precio_estimado, @mensaje, GETDATE(), 'pendiente'
            );
            SELECT SCOPE_IDENTITY() as id;
        `);
        
        res.json({
            success: true,
            message: 'Cotización guardada exitosamente',
            cotizacion_id: result.recordset[0].id
        });
    } catch (err) {
        console.error('Error guardando cotización:', err);
        res.status(500).json({
            success: false,
            message: 'Error al guardar la cotización'
        });
    }
});

// 4. Obtener testimonios
app.get('/api/testimonios', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT 
                id,
                nombre_cliente,
                empresa_cliente,
                tipo_proyecto,
                testimonio,
                calificacion,
                fecha_testimonio
            FROM Testimonios 
            WHERE activo = 1
            ORDER BY fecha_testimonio DESC
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error('Error obteniendo testimonios:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener testimonios'
        });
    }
});

// 5. Obtener estadísticas de la empresa
app.get('/api/estadisticas', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT 
                (SELECT COUNT(*) FROM Proyectos WHERE estado = 'completado') as trabajos_realizados,
                (SELECT COUNT(DISTINCT cliente_id) FROM Proyectos) as clientes_satisfechos,
                (SELECT COUNT(DISTINCT categoria) FROM Muebles WHERE activo = 1) as variedades_muebles,
                (SELECT 
                    categoria,
                    COUNT(*) as cantidad
                FROM Proyectos p
                INNER JOIN Muebles m ON p.mueble_id = m.id
                WHERE p.estado = 'completado'
                GROUP BY categoria
                FOR JSON PATH
                ) as distribucion_trabajos
        `);
        
        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Error obteniendo estadísticas:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
});

// 6. Obtener galería de trabajos
app.get('/api/galeria', async (req, res) => {
    try {
        const request = pool.request();
        const result = await request.query(`
            SELECT 
                p.id,
                p.nombre_proyecto,
                p.descripcion,
                p.fecha_completado,
                p.imagen_principal,
                m.categoria,
                c.nombre as nombre_cliente,
                c.empresa as empresa_cliente
            FROM Proyectos p
            INNER JOIN Muebles m ON p.mueble_id = m.id
            INNER JOIN Clientes c ON p.cliente_id = c.id
            WHERE p.estado = 'completado' AND p.mostrar_galeria = 1
            ORDER BY p.fecha_completado DESC
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error('Error obteniendo galería:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la galería'
        });
    }
});

// 7. Procesar formulario de contacto
app.post('/api/contacto', async (req, res) => {
    try {
        const {
            nombre,
            email,
            telefono,
            tipo_mueble,
            mensaje
        } = req.body;
        
        const request = pool.request();
        request.input('nombre', sql.VarChar, nombre);
        request.input('email', sql.VarChar, email);
        request.input('telefono', sql.VarChar, telefono);
        request.input('tipo_mueble', sql.VarChar, tipo_mueble);
        request.input('mensaje', sql.Text, mensaje);
        
        await request.query(`
            INSERT INTO Contactos (
                nombre, email, telefono, tipo_mueble, mensaje, fecha_contacto, estado
            ) VALUES (
                @nombre, @email, @telefono, @tipo_mueble, @mensaje, GETDATE(), 'nuevo'
            )
        `);
        
        res.json({
            success: true,
            message: 'Mensaje enviado exitosamente'
        });
    } catch (err) {
        console.error('Error procesando contacto:', err);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje'
        });
    }
});

// Servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Servir archivos estáticos adicionales
app.get('/dajusca-styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dajusca-styles.css'));
});

app.get('/dajusca-script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dajusca-script.js'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${dbConfig.database}`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('Cerrando conexiones...');
    if (pool) {
        await pool.close();
    }
    process.exit(0);
});