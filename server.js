const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir archivos estáticos desde la raíz
app.use('/uploads', express.static('uploads')); // Servir archivos subidos

// Configuración de la base de datos SQL Server
const dbConfig = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_DATABASE || 'DAJUSCA_DB',
    user: process.env.DB_USER || 'tu_usuario',
    password: process.env.DB_PASSWORD || 'tu_password',
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
// CONFIGURACIÓN MULTER PARA ARCHIVOS
// ========================

// Crear directorio si no existe
const uploadDir = process.env.UPLOAD_DIR || 'uploads/orders';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Crear directorios para catálogo y galería
const catalogUploadDir = 'uploads/catalog';
const galleryUploadDir = 'uploads/gallery';

if (!fs.existsSync(catalogUploadDir)) {
    fs.mkdirSync(catalogUploadDir, { recursive: true });
}

if (!fs.existsSync(galleryUploadDir)) {
    fs.mkdirSync(galleryUploadDir, { recursive: true });
}

// Configuración de almacenamiento para órdenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único con timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'order-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configuración de almacenamiento para catálogo
const catalogStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, catalogUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'catalog-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configuración de almacenamiento para galería
const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, galleryUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para archivos de imagen (PNG, JPG, JPEG, WebP)
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (PNG, JPG, JPEG, WebP)'), false);
    }
};

// Filtro para solo archivos PNG (para órdenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PNG'), false);
    }
};

// Configurar multer para órdenes
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB por defecto
    },
    fileFilter: fileFilter
});

// Configurar multer para catálogo
const catalogUpload = multer({
    storage: catalogStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB para imágenes de catálogo
    },
    fileFilter: imageFilter
});

// Configurar multer para galería
const galleryUpload = multer({
    storage: galleryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB para imágenes de galería
    },
    fileFilter: imageFilter
});

// ========================
// CONFIGURACIÓN NODEMAILER
// ========================

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verificar configuración de email (opcional)
let emailConfigured = false;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter.verify((error, success) => {
        if (error) {
            console.log('❌ Error en configuración de email:', error);
            emailConfigured = false;
        } else {
            console.log('✅ Servidor de email configurado correctamente');
            emailConfigured = true;
        }
    });
} else {
    console.log('⚠️ Email no configurado - Modo testing activado');
}

// Función para enviar email de orden
async function sendOrderEmail(orderData, imagePath) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.OWNER_EMAIL,
        subject: `🪑 Nueva Orden Personalizada - ${orderData.clientName}`,
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
                <div style="background: linear-gradient(135deg, #e03131, #fd7e14); padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">DAJUSCA</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Nueva Orden Personalizada</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h2 style="color: #333; margin-top: 0; font-size: 24px;">Detalles del Cliente</h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 8px 0; color: #555;"><strong>👤 Nombre:</strong> ${orderData.clientName}</p>
                        <p style="margin: 8px 0; color: #555;"><strong>📧 Email:</strong> <a href="mailto:${orderData.clientEmail}" style="color: #e03131;">${orderData.clientEmail}</a></p>
                        <p style="margin: 8px 0; color: #555;"><strong>📱 Teléfono:</strong> <a href="tel:${orderData.clientPhone}" style="color: #e03131;">${orderData.clientPhone}</a></p>
                        ${orderData.furnitureType ? `<p style="margin: 8px 0; color: #555;"><strong>🪑 Tipo de mueble:</strong> ${orderData.furnitureType}</p>` : ''}
                        ${orderData.budget ? `<p style="margin: 8px 0; color: #555;"><strong>💰 Presupuesto:</strong> ${orderData.budget} COP</p>` : ''}
                    </div>
                    
                    <h3 style="color: #333; margin-top: 30px;">📝 Descripción del Proyecto</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #e03131;">
                        <p style="margin: 0; color: #555; line-height: 1.6;">${orderData.projectDescription}</p>
                    </div>
                    
                    <h3 style="color: #333; margin-top: 30px;">🖼️ Imagen de Referencia</h3>
                    <p style="color: #666; margin: 10px 0;">La imagen de referencia se encuentra adjunta a este correo.</p>
                    
                    <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #e8f5e8, #f0f8ff); border-radius: 10px; text-align: center;">
                        <p style="margin: 0; color: #333; font-weight: 600;">📅 Fecha de solicitud: ${new Date().toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px;">
                        <p style="margin: 0; color: #856404; font-weight: 500;">
                            💡 <strong>Recordatorio:</strong> Responde al cliente lo antes posible para confirmar la recepción de su solicitud y coordinar los siguientes pasos.
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px;">
                    <p>Este correo fue generado automáticamente por el sistema de órdenes de DAJUSCA</p>
                </div>
            </div>
        `,
        attachments: [
            {
                filename: `referencia-${orderData.clientName.replace(/\s+/g, '-')}.png`,
                path: imagePath
            }
        ]
    };

    return transporter.sendMail(mailOptions);
}

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
    res.sendFile(path.join(__dirname, 'public', 'dajusca.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// ========================
// ENDPOINT PARA ÓRDENES PERSONALIZADAS
// ========================

// Endpoint para recibir órdenes con archivo adjunto
app.post('/api/submit-order', upload.single('referenceImage'), async (req, res) => {
    try {
        // Validar que se haya subido un archivo
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere una imagen de referencia'
            });
        }

        // Validar campos requeridos
        const { clientName, clientPhone, clientEmail, projectDescription } = req.body;
        
        if (!clientName || !clientPhone || !clientEmail || !projectDescription) {
            // Eliminar archivo si faltan campos
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        // Preparar datos de la orden
        const orderData = {
            clientName: clientName.trim(),
            clientPhone: clientPhone.trim(),
            clientEmail: clientEmail.trim().toLowerCase(),
            furnitureType: req.body.furnitureType || '',
            projectDescription: projectDescription.trim(),
            budget: req.body.budget || '',
            imagePath: req.file.path,
            imageFileName: req.file.filename,
            submissionDate: new Date()
        };

        // Guardar en base de datos (opcional)
        try {
            if (pool) {
                await pool.request()
                    .input('clientName', sql.NVarChar(100), orderData.clientName)
                    .input('clientPhone', sql.NVarChar(20), orderData.clientPhone)
                    .input('clientEmail', sql.NVarChar(100), orderData.clientEmail)
                    .input('furnitureType', sql.NVarChar(50), orderData.furnitureType)
                    .input('projectDescription', sql.NText, orderData.projectDescription)
                    .input('budget', sql.NVarChar(50), orderData.budget)
                    .input('imageFileName', sql.NVarChar(255), orderData.imageFileName)
                    .input('submissionDate', sql.DateTime, orderData.submissionDate)
                    .query(`
                        INSERT INTO custom_orders 
                        (client_name, client_phone, client_email, furniture_type, 
                         project_description, budget, image_filename, submission_date, status)
                        VALUES 
                        (@clientName, @clientPhone, @clientEmail, @furnitureType,
                         @projectDescription, @budget, @imageFileName, @submissionDate, 'pending')
                    `);
                console.log('✅ Orden guardada en base de datos');
            }
        } catch (dbError) {
            console.log('⚠️ Advertencia: No se pudo guardar en base de datos:', dbError.message);
            // Continúa el proceso aunque falle la BD
        }

        // Enviar email solo si están configuradas las credenciales
        if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.OWNER_EMAIL) {
            try {
                await sendOrderEmail(orderData, req.file.path);
                console.log('✅ Email enviado exitosamente');
                
                res.json({
                    success: true,
                    message: 'Orden enviada exitosamente. Te contactaremos pronto.',
                    orderId: `ORD-${Date.now()}`
                });
            } catch (emailError) {
                console.error('❌ Error enviando email:', emailError);
                res.status(500).json({
                    success: false,
                    message: 'Error al enviar la orden. Por favor, intenta nuevamente o contacta directamente.'
                });
            }
        } else {
            // Si no hay configuración de email, simular éxito para testing
            console.log('⚠️ Email no configurado. Orden recibida pero no enviada.');
            console.log('📄 Datos de la orden:', orderData);
            
            res.json({
                success: true,
                message: 'Orden recibida exitosamente. Te contactaremos pronto.',
                orderId: `ORD-${Date.now()}`,
                note: 'Email no configurado en servidor'
            });
        }

    } catch (error) {
        console.error('❌ Error procesando orden:', error);
        
        // Limpiar archivo subido en caso de error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor. Por favor, intenta nuevamente.'
        });
    }
});

// Endpoint para obtener órdenes (opcional, para administración)
app.get('/api/orders', async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({
                success: false,
                message: 'Base de datos no disponible'
            });
        }

        const result = await pool.request().query(`
            SELECT 
                id,
                client_name,
                client_email,
                client_phone,
                furniture_type,
                project_description,
                budget,
                submission_date,
                status
            FROM custom_orders 
            ORDER BY submission_date DESC
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (err) {
        console.error('Error obteniendo órdenes:', err);
        res.status(500).json({
            success: false,
            message: 'Error al obtener órdenes'
        });
    }
});

// ========================
// API ENDPOINTS PARA IMÁGENES
// ========================

// Endpoint para subir imagen de catálogo
app.post('/api/upload-catalog-image', catalogUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se ha proporcionado ninguna imagen'
            });
        }

        const { productId, productName, productCategory } = req.body;
        
        const imageData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            productId: productId || null,
            productName: productName || 'Sin nombre',
            productCategory: productCategory || 'general'
        };

        res.json({
            success: true,
            message: 'Imagen de catálogo subida exitosamente',
            image: {
                filename: req.file.filename,
                url: `/uploads/catalog/${req.file.filename}`,
                productId: productId,
                productName: productName,
                productCategory: productCategory
            }
        });

    } catch (error) {
        console.error('❌ Error subiendo imagen de catálogo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir la imagen del catálogo'
        });
    }
});

// Endpoint para subir imagen de galería
app.post('/api/upload-gallery-image', galleryUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se ha proporcionado ninguna imagen'
            });
        }

        const { projectName, projectCategory, clientName, description } = req.body;
        
        const imageData = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
            projectName: projectName || 'Proyecto sin nombre',
            projectCategory: projectCategory || 'general',
            clientName: clientName || 'Cliente',
            description: description || ''
        };

        res.json({
            success: true,
            message: 'Imagen de galería subida exitosamente',
            image: {
                filename: req.file.filename,
                url: `/uploads/gallery/${req.file.filename}`,
                projectName: projectName,
                projectCategory: projectCategory,
                clientName: clientName,
                description: description
            }
        });

    } catch (error) {
        console.error('❌ Error subiendo imagen de galería:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir la imagen de la galería'
        });
    }
});

// Endpoint para obtener imágenes de catálogo
app.get('/api/catalog-images', async (req, res) => {
    try {
        const catalogDir = 'uploads/catalog';
        
        if (!fs.existsSync(catalogDir)) {
            return res.json({
                success: true,
                images: []
            });
        }

        const files = fs.readdirSync(catalogDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => ({
                filename: file,
                url: `/uploads/catalog/${file}`,
                uploadDate: fs.statSync(path.join(catalogDir, file)).mtime
            }))
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        res.json({
            success: true,
            images: images
        });

    } catch (error) {
        console.error('❌ Error obteniendo imágenes de catálogo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las imágenes del catálogo'
        });
    }
});

// Endpoint para obtener imágenes de galería
app.get('/api/gallery-images', async (req, res) => {
    try {
        const galleryDir = 'uploads/gallery';
        
        if (!fs.existsSync(galleryDir)) {
            return res.json({
                success: true,
                images: []
            });
        }

        const files = fs.readdirSync(galleryDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => ({
                filename: file,
                url: `/uploads/gallery/${file}`,
                uploadDate: fs.statSync(path.join(galleryDir, file)).mtime
            }))
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        res.json({
            success: true,
            images: images
        });

    } catch (error) {
        console.error('❌ Error obteniendo imágenes de galería:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las imágenes de la galería'
        });
    }
});

// Endpoint para eliminar imagen de catálogo
app.delete('/api/catalog-image/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads/catalog', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Imagen eliminada exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagen no encontrada'
            });
        }

    } catch (error) {
        console.error('❌ Error eliminando imagen de catálogo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la imagen'
        });
    }
});

// Endpoint para eliminar imagen de galería
app.delete('/api/gallery-image/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join('uploads/gallery', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Imagen eliminada exitosamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagen no encontrada'
            });
        }

    } catch (error) {
        console.error('❌ Error eliminando imagen de galería:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la imagen'
        });
    }
});

// Ruta principal para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dajusca.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
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