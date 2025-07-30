-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS DAJUSCA
-- SQL Server
-- ============================================

-- Crear la base de datos (opcional si ya existe)
-- CREATE DATABASE DAJUSCA_DB;
-- GO

USE DAJUSCA_DB;
GO

-- ============================================
-- TABLA: Clientes
-- ============================================
CREATE TABLE Clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    telefono NVARCHAR(20),
    empresa NVARCHAR(100),
    direccion NVARCHAR(255),
    ciudad NVARCHAR(50),
    fecha_registro DATETIME2 DEFAULT GETDATE(),
    activo BIT DEFAULT 1
);

-- ============================================
-- TABLA: Categorías de Muebles
-- ============================================
CREATE TABLE Categorias (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE,
    descripcion NVARCHAR(255),
    icono NVARCHAR(50), -- Para Font Awesome
    activo BIT DEFAULT 1
);

-- Insertar categorías iniciales
INSERT INTO Categorias (nombre, descripcion, icono) VALUES
('repisas', 'Repisas flotantes y modulares', 'fas fa-layer-group'),
('gaveteros', 'Gaveteros modernos y funcionales', 'fas fa-archive'),
('closets', 'Closets empotrados personalizados', 'fas fa-door-open'),
('entretenimiento', 'Centros de entretenimiento para TV', 'fas fa-tv'),
('cocina', 'Cocinas integrales completas', 'fas fa-utensils'),
('escritorios', 'Escritorios ejecutivos y de trabajo', 'fas fa-desktop');

-- ============================================
-- TABLA: Muebles
-- ============================================
CREATE TABLE Muebles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    categoria NVARCHAR(50) NOT NULL,
    descripcion NTEXT,
    precio_desde DECIMAL(10,2) NOT NULL,
    imagen_url NVARCHAR(255),
    dimensiones_min NVARCHAR(100), -- ej: "50x30x20"
    dimensiones_max NVARCHAR(100), -- ej: "300x250x80"
    materiales_disponibles NVARCHAR(255), -- JSON o CSV
    colores_disponibles NVARCHAR(255), -- JSON o CSV
    tiempo_fabricacion_dias INT DEFAULT 15,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    FOREIGN KEY (categoria) REFERENCES Categorias(nombre)
);

-- Insertar muebles iniciales
INSERT INTO Muebles (nombre, categoria, descripcion, precio_desde, imagen_url, dimensiones_min, dimensiones_max, materiales_disponibles, colores_disponibles) VALUES
('Repisas Flotantes', 'repisas', 'Elegantes repisas flotantes que maximizan el espacio', 45000.00, '/images/products/repisas/repisa-flotante.jpg', '50x20x15', '200x40x25', 'madera,metal', '#8B4513,#D2691E,#654321'),
('Gaveteros Modernos', 'gaveteros', 'Gaveteros funcionales con diseño contemporáneo', 180000.00, '/images/products/gaveteros/gavetero-moderno.jpg', '60x40x80', '120x60x150', 'madera,metal', '#8B4513,#654321,#2F4F4F'),
('Closet Empotrado Premium', 'closets', 'Closet empotrado de lujo con acabados de primera calidad. Incluye sistema de iluminación LED, barras cromadas, cajones con guías telescópicas y espejo de cuerpo completo. Diseño modular adaptable a cualquier espacio.', 1200000.00, '/images/products/closets/closet-premium.jpg', '150x60x220', '400x80x250', 'MDF,Melamina,Aluminio,Vidrio Templado', 'Blanco Mate,Roble Claro,Nogal,Wengué'),
('Centros de Entretenimiento', 'entretenimiento', 'Muebles para TV con estilo y funcionalidad', 320000.00, '/images/products/entretenimiento/centro-tv.jpg', '100x30x40', '250x50x80', 'madera,metal,vidrio', '#8B4513,#2F4F4F,#000000'),
('Cocinas Integrales', 'cocina', 'Cocinas completas diseñadas a tu medida', 1500000.00, '/images/products/cocinas/cocina-integral.jpg', '200x60x200', '500x80x250', 'madera,metal', '#8B4513,#FFFFFF,#654321'),
('Escritorios Ejecutivos', 'escritorios', 'Espacios de trabajo para la productividad', 280000.00, '/images/products/escritorios/escritorio-ejecutivo.jpg', '100x50x70', '200x80x80', 'madera,metal,vidrio', '#8B4513,#654321,#4A4A4A');

-- ============================================
-- TABLA: Proyectos
-- ============================================
CREATE TABLE Proyectos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_proyecto NVARCHAR(100) NOT NULL,
    descripcion NTEXT,
    cliente_id INT NOT NULL,
    mueble_id INT NOT NULL,
    dimensiones_finales NVARCHAR(100),
    material_usado NVARCHAR(50),
    color_usado NVARCHAR(20),
    precio_final DECIMAL(10,2),
    fecha_inicio DATETIME2,
    fecha_completado DATETIME2,
    estado NVARCHAR(20) DEFAULT 'pendiente', -- pendiente, en_proceso, completado, cancelado
    imagen_principal NVARCHAR(255),
    mostrar_galeria BIT DEFAULT 0,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id),
    FOREIGN KEY (mueble_id) REFERENCES Muebles(id)
);

-- Insertar proyectos ejemplo
INSERT INTO Clientes (nombre, email, telefono, empresa) VALUES
('María González', 'maria@email.com', '300-123-4567', 'Apartamento Zona Rosa'),
('Carlos Mendoza', 'carlos@email.com', '301-234-5678', 'Casa Campestre'),
('Ana Rodríguez', 'ana@email.com', '302-345-6789', 'Penthouse'),
('Roberto Silva', 'roberto@email.com', '303-456-7890', 'TechStart Solutions'),
('Familia Rodríguez', 'familia@email.com', '304-567-8901', 'Casa Familiar'),
('Empresa TechCorp', 'info@techcorp.com', '305-678-9012', 'TechCorp');

INSERT INTO Proyectos (nombre_proyecto, descripcion, cliente_id, mueble_id, estado, fecha_completado, mostrar_galeria) VALUES
('Closet Moderno', 'Closet empotrado con puertas corredizas', 5, 3, 'completado', '2024-01-15', 1),
('Cocina Integral Downtown', 'Cocina completa para apartamento moderno', 1, 5, 'completado', '2024-02-20', 1),
('Centro de Entretenimiento Familiar', 'Mueble para TV de 65 pulgadas', 5, 4, 'completado', '2024-03-10', 1),
('Oficina Ejecutiva TechCorp', 'Escritorios para oficina corporativa', 6, 6, 'completado', '2024-03-25', 1),
('Gavetero Vintage', 'Gavetero estilo vintage para estudio', 2, 2, 'completado', '2024-04-05', 1),
('Sistema de Repisas Librería', 'Repisas modulares para librería', 3, 1, 'completado', '2024-04-20', 1);

-- ============================================
-- TABLA: Testimonios
-- ============================================
CREATE TABLE Testimonios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_cliente NVARCHAR(100) NOT NULL,
    empresa_cliente NVARCHAR(100),
    tipo_proyecto NVARCHAR(50),
    testimonio NTEXT NOT NULL,
    calificacion INT CHECK (calificacion >= 1 AND calificacion <= 5) DEFAULT 5,
    proyecto_id INT,
    fecha_testimonio DATETIME2 DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    FOREIGN KEY (proyecto_id) REFERENCES Proyectos(id)
);

-- Insertar testimonios
INSERT INTO Testimonios (nombre_cliente, empresa_cliente, tipo_proyecto, testimonio, calificacion, proyecto_id) VALUES
('María González', 'Apartamento Zona Rosa', 'Cocina Integral', 'DAJUSCA transformó completamente nuestra cocina. El diseño es espectacular y la calidad de los materiales es excepcional. Superaron todas nuestras expectativas.', 5, 2),
('Carlos Mendoza', 'Casa Campestre', 'Closet Empotrado', 'El closet que nos diseñaron aprovecha cada centímetro del espacio. Es funcional, elegante y exactamente lo que necesitábamos. Excelente trabajo y atención al detalle.', 5, 1),
('Ana Rodríguez', 'Penthouse', 'Centro de Entretenimiento', 'Profesionalismo de principio a fin. El centro de entretenimiento que crearon es la pieza central de nuestra sala. Calidad premium y diseño innovador.', 5, 3),
('Roberto Silva', 'TechStart Solutions', 'Oficina Corporativa', 'Los escritorios ejecutivos que nos hicieron para la oficina son perfectos. Combinan funcionalidad y elegancia. Nuestro equipo está encantado con los nuevos espacios de trabajo.', 5, 4);

-- ============================================
-- TABLA: Cotizaciones
-- ============================================
CREATE TABLE Cotizaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_cliente NVARCHAR(100) NOT NULL,
    email_cliente NVARCHAR(100) NOT NULL,
    telefono_cliente NVARCHAR(20),
    tipo_mueble NVARCHAR(50) NOT NULL,
    dimensiones NVARCHAR(255), -- JSON con width, height, depth
    material NVARCHAR(50),
    color NVARCHAR(20),
    precio_estimado DECIMAL(10,2),
    mensaje NTEXT,
    fecha_solicitud DATETIME2 DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'pendiente', -- pendiente, procesada, convertida
    notas_internas NTEXT
);

-- ============================================
-- TABLA: Contactos
-- ============================================
CREATE TABLE Contactos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    telefono NVARCHAR(20),
    tipo_mueble NVARCHAR(50),
    mensaje NTEXT NOT NULL,
    fecha_contacto DATETIME2 DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'nuevo', -- nuevo, contactado, convertido
    notas_internas NTEXT
);

-- ============================================
-- TABLA: Configuraciones del Sistema
-- ============================================
CREATE TABLE Configuraciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    clave NVARCHAR(50) NOT NULL UNIQUE,
    valor NVARCHAR(255) NOT NULL,
    descripcion NVARCHAR(255),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE()
);

-- Insertar configuraciones iniciales
INSERT INTO Configuraciones (clave, valor, descripcion) VALUES
('empresa_nombre', 'DAJUSCA', 'Nombre de la empresa'),
('empresa_email', 'info@dajusca.com', 'Email principal de contacto'),
('empresa_telefono', '+57 (1) 234-5678', 'Teléfono principal'),
('empresa_direccion', 'Calle 45 #23-67, Bogotá, Colombia', 'Dirección física'),
('precio_base_m3', '50000', 'Precio base por metro cúbico'),
('tiempo_fabricacion_promedio', '15', 'Días promedio de fabricación'),
('descuento_maximo', '15', 'Porcentaje máximo de descuento'),
('iva_porcentaje', '19', 'Porcentaje de IVA');

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================
CREATE INDEX IX_Muebles_Categoria ON Muebles(categoria);
CREATE INDEX IX_Proyectos_Estado ON Proyectos(estado);
CREATE INDEX IX_Proyectos_Cliente ON Proyectos(cliente_id);
CREATE INDEX IX_Cotizaciones_Estado ON Cotizaciones(estado);
CREATE INDEX IX_Cotizaciones_Fecha ON Cotizaciones(fecha_solicitud);
CREATE INDEX IX_Contactos_Estado ON Contactos(estado);
CREATE INDEX IX_Contactos_Fecha ON Contactos(fecha_contacto);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de estadísticas generales
CREATE VIEW Vista_Estadisticas AS
SELECT 
    (SELECT COUNT(*) FROM Proyectos WHERE estado = 'completado') as trabajos_realizados,
    (SELECT COUNT(DISTINCT cliente_id) FROM Proyectos) as clientes_satisfechos,
    (SELECT COUNT(DISTINCT categoria) FROM Muebles WHERE activo = 1) as variedades_muebles,
    (SELECT AVG(CAST(calificacion AS DECIMAL(3,2))) FROM Testimonios WHERE activo = 1) as calificacion_promedio;

-- Vista de proyectos para galería
CREATE VIEW Vista_Galeria AS
SELECT 
    p.id,
    p.nombre_proyecto,
    p.descripcion,
    p.fecha_completado,
    p.imagen_principal,
    m.categoria,
    m.nombre as tipo_mueble,
    c.nombre as nombre_cliente,
    c.empresa as empresa_cliente
FROM Proyectos p
INNER JOIN Muebles m ON p.mueble_id = m.id
INNER JOIN Clientes c ON p.cliente_id = c.id
WHERE p.estado = 'completado' AND p.mostrar_galeria = 1;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento para obtener estadísticas de trabajos por categoría
CREATE PROCEDURE SP_EstadisticasPorCategoria
AS
BEGIN
    SELECT 
        m.categoria,
        COUNT(*) as cantidad_proyectos,
        AVG(p.precio_final) as precio_promedio,
        MAX(p.fecha_completado) as ultimo_proyecto
    FROM Proyectos p
    INNER JOIN Muebles m ON p.mueble_id = m.id
    WHERE p.estado = 'completado'
    GROUP BY m.categoria
    ORDER BY cantidad_proyectos DESC;
END;

-- Procedimiento para crear cotización desde configurador
CREATE PROCEDURE SP_CrearCotizacion
    @nombre_cliente NVARCHAR(100),
    @email_cliente NVARCHAR(100),
    @telefono_cliente NVARCHAR(20),
    @tipo_mueble NVARCHAR(50),
    @dimensiones NVARCHAR(255),
    @material NVARCHAR(50),
    @color NVARCHAR(20),
    @precio_estimado DECIMAL(10,2),
    @mensaje NTEXT
AS
BEGIN
    INSERT INTO Cotizaciones (
        nombre_cliente, email_cliente, telefono_cliente,
        tipo_mueble, dimensiones, material, color,
        precio_estimado, mensaje, fecha_solicitud, estado
    ) VALUES (
        @nombre_cliente, @email_cliente, @telefono_cliente,
        @tipo_mueble, @dimensiones, @material, @color,
        @precio_estimado, @mensaje, GETDATE(), 'pendiente'
    );
    
    SELECT SCOPE_IDENTITY() as cotizacion_id;
END;

-- ============================================
-- DATOS DE PRUEBA ADICIONALES
-- ============================================

-- Insertar más datos de ejemplo para testing
INSERT INTO Cotizaciones (nombre_cliente, email_cliente, telefono_cliente, tipo_mueble, dimensiones, material, color, precio_estimado, mensaje) VALUES
('Juan Pérez', 'juan@email.com', '310-111-2222', 'escritorio', '{"width":150,"height":75,"depth":60}', 'madera', '#8B4513', 185000, 'Necesito un escritorio para home office'),
('Laura Martínez', 'laura@email.com', '311-222-3333', 'repisa', '{"width":120,"height":25,"depth":30}', 'metal', '#2F4F4F', 75000, 'Repisas para sala de estar'),
('Diego Torres', 'diego@email.com', '312-333-4444', 'gavetero', '{"width":80,"height":120,"depth":50}', 'madera', '#654321', 220000, 'Gavetero para habitación principal');

INSERT INTO Contactos (nombre, email, telefono, tipo_mueble, mensaje) VALUES
('Carmen Silva', 'carmen@email.com', '313-444-5555', 'cocina', 'Interesada en cotización para cocina integral'),
('Miguel Ángel', 'miguel@email.com', '314-555-6666', 'closets', 'Necesito closet para apartamento nuevo'),
('Patricia López', 'patricia@email.com', '315-666-7777', 'otro', 'Consulta sobre muebles para oficina');

PRINT '✅ Base de datos DAJUSCA creada exitosamente';
PRINT '📊 Tablas creadas: Clientes, Categorias, Muebles, Proyectos, Testimonios, Cotizaciones, Contactos, Configuraciones';
PRINT '📈 Vistas creadas: Vista_Estadisticas, Vista_Galeria';
PRINT '⚙️ Procedimientos creados: SP_EstadisticasPorCategoria, SP_CrearCotizacion';
PRINT '🎯 Datos de ejemplo insertados correctamente';

-- ===================================
-- TABLA PARA ÓRDENES PERSONALIZADAS
-- ===================================

-- Tabla para almacenar las órdenes personalizadas de clientes
CREATE TABLE custom_orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    client_name NVARCHAR(100) NOT NULL,
    client_phone NVARCHAR(20) NOT NULL,
    client_email NVARCHAR(100) NOT NULL,
    furniture_type NVARCHAR(50),
    project_description NTEXT NOT NULL,
    budget NVARCHAR(50),
    image_filename NVARCHAR(255),
    submission_date DATETIME NOT NULL DEFAULT GETDATE(),
    status NVARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    notes NTEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Índices para la tabla de órdenes
CREATE INDEX IX_custom_orders_email ON custom_orders(client_email);
CREATE INDEX IX_custom_orders_date ON custom_orders(submission_date);
CREATE INDEX IX_custom_orders_status ON custom_orders(status);

-- Trigger para actualizar updated_at
CREATE TRIGGER TR_custom_orders_update
ON custom_orders
AFTER UPDATE
AS
BEGIN
    UPDATE custom_orders 
    SET updated_at = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

PRINT '📦 Tabla custom_orders creada exitosamente';

-- Verificar la creación
SELECT 'Muebles' as Tabla, COUNT(*) as Registros FROM Muebles
UNION ALL
SELECT 'Clientes', COUNT(*) FROM Clientes
UNION ALL
SELECT 'Proyectos', COUNT(*) FROM Proyectos
UNION ALL
SELECT 'Testimonios', COUNT(*) FROM Testimonios
UNION ALL
SELECT 'Cotizaciones', COUNT(*) FROM Cotizaciones
UNION ALL
SELECT 'Contactos', COUNT(*) FROM Contactos
UNION ALL
SELECT 'Órdenes Personalizadas', COUNT(*) FROM custom_orders;