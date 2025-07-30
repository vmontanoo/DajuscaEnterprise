-- =====================================================
-- BASE DE DATOS PARA EMPRENDIMIENTO DE FABRICACIÓN DE MUEBLES
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS muebles_db;
USE muebles_db;

-- =====================================================
-- TABLAS MAESTRAS
-- =====================================================

-- Tabla de categorías de muebles
CREATE TABLE categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de materiales
CREATE TABLE materiales (
    id_material INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo_material ENUM('Madera', 'Metal', 'Vidrio', 'Tela', 'Cuero', 'Plastico', 'Otro') NOT NULL,
    unidad_medida ENUM('Metro', 'Metro2', 'Metro3', 'Kilogramo', 'Litro', 'Unidad') NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock_actual DECIMAL(10,2) DEFAULT 0,
    stock_minimo DECIMAL(10,2) DEFAULT 0,
    proveedor VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id_proveedor INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(50),
    pais VARCHAR(50) DEFAULT 'Colombia',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    tipo_cliente ENUM('Individual', 'Empresa') NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    documento VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(50),
    fecha_nacimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notas TEXT
);

-- =====================================================
-- TABLAS DE PRODUCTOS
-- =====================================================

-- Tabla de productos/muebles
CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    codigo_producto VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    descripcion TEXT,
    dimensiones VARCHAR(100), -- Ej: "200x80x75 cm"
    peso DECIMAL(6,2),
    color VARCHAR(50),
    acabado VARCHAR(50),
    precio_venta DECIMAL(10,2) NOT NULL,
    costo_fabricacion DECIMAL(10,2),
    tiempo_fabricacion_dias INT DEFAULT 7,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 1,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Tabla de materiales por producto (BOM - Bill of Materials)
CREATE TABLE producto_materiales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    id_material INT NOT NULL,
    cantidad_necesaria DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2),
    notas TEXT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material),
    UNIQUE KEY unique_producto_material (id_producto, id_material)
);

-- =====================================================
-- TABLAS DE VENTAS
-- =====================================================

-- Tabla de cotizaciones
CREATE TABLE cotizaciones (
    id_cotizacion INT PRIMARY KEY AUTO_INCREMENT,
    numero_cotizacion VARCHAR(20) UNIQUE NOT NULL,
    id_cliente INT NOT NULL,
    fecha_cotizacion DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Vencida') DEFAULT 'Pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Tabla de detalle de cotizaciones
CREATE TABLE cotizacion_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cotizacion INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    especificaciones_personalizadas TEXT,
    FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de pedidos/órdenes
CREATE TABLE pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    numero_pedido VARCHAR(20) UNIQUE NOT NULL,
    id_cliente INT NOT NULL,
    id_cotizacion INT,
    fecha_pedido DATE NOT NULL,
    fecha_entrega_estimada DATE,
    fecha_entrega_real DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    anticipo DECIMAL(10,2) DEFAULT 0,
    saldo_pendiente DECIMAL(10,2) DEFAULT 0,
    estado ENUM('Pendiente', 'En Produccion', 'Terminado', 'Entregado', 'Cancelado') DEFAULT 'Pendiente',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion)
);

-- Tabla de detalle de pedidos
CREATE TABLE pedido_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    especificaciones_personalizadas TEXT,
    estado_fabricacion ENUM('Pendiente', 'En Proceso', 'Terminado') DEFAULT 'Pendiente',
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- TABLAS DE PRODUCCIÓN
-- =====================================================

-- Tabla de órdenes de producción
CREATE TABLE ordenes_produccion (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    id_pedido INT,
    id_producto INT NOT NULL,
    cantidad_producir INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    estado ENUM('Planificada', 'En Proceso', 'Terminada', 'Cancelada') DEFAULT 'Planificada',
    responsable VARCHAR(100),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de consumo de materiales en producción
CREATE TABLE produccion_materiales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_material INT NOT NULL,
    cantidad_planificada DECIMAL(10,2) NOT NULL,
    cantidad_utilizada DECIMAL(10,2) DEFAULT 0,
    costo_unitario DECIMAL(10,2),
    fecha_consumo DATE,
    FOREIGN KEY (id_orden) REFERENCES ordenes_produccion(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material)
);

-- =====================================================
-- TABLAS DE INVENTARIO
-- =====================================================

-- Tabla de movimientos de inventario de materiales
CREATE TABLE movimientos_inventario (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_material INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida', 'Ajuste') NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2),
    motivo VARCHAR(100),
    referencia VARCHAR(50), -- Número de factura, orden, etc.
    fecha_movimiento DATE NOT NULL,
    usuario VARCHAR(50),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material)
);

-- Tabla de movimientos de inventario de productos terminados
CREATE TABLE movimientos_productos (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida', 'Ajuste') NOT NULL,
    cantidad INT NOT NULL,
    motivo VARCHAR(100),
    referencia VARCHAR(50),
    fecha_movimiento DATE NOT NULL,
    usuario VARCHAR(50),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- TABLAS FINANCIERAS
-- =====================================================

-- Tabla de gastos operativos
CREATE TABLE gastos (
    id_gasto INT PRIMARY KEY AUTO_INCREMENT,
    categoria_gasto ENUM('Materiales', 'Mano de Obra', 'Servicios', 'Alquiler', 'Herramientas', 'Marketing', 'Transporte', 'Otros') NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_gasto DATE NOT NULL,
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Cheque') DEFAULT 'Efectivo',
    comprobante VARCHAR(50),
    id_proveedor INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

-- Tabla de pagos de clientes
CREATE TABLE pagos_clientes (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta', 'Cheque') DEFAULT 'Efectivo',
    referencia VARCHAR(50),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar categorías básicas
INSERT INTO categorias (nombre, descripcion) VALUES
('Sala', 'Muebles para sala de estar'),
('Comedor', 'Mesas y sillas de comedor'),
('Dormitorio', 'Camas, armarios y mesas de noche'),
('Cocina', 'Muebles y gabinetes de cocina'),
('Oficina', 'Escritorios y muebles de oficina'),
('Baño', 'Muebles para baño'),
('Infantil', 'Muebles para niños'),
('Exterior', 'Muebles para jardín y terraza');

-- Insertar materiales básicos
INSERT INTO materiales (nombre, tipo_material, unidad_medida, precio_unitario, stock_actual, stock_minimo, proveedor) VALUES
('Madera Pino', 'Madera', 'Metro3', 850000.00, 50.00, 10.00, 'Maderas del Norte'),
('Madera Roble', 'Madera', 'Metro3', 1200000.00, 20.00, 5.00, 'Maderas del Norte'),
('MDF 18mm', 'Madera', 'Metro2', 45000.00, 100.00, 20.00, 'Tableros SA'),
('Aglomerado 15mm', 'Madera', 'Metro2', 35000.00, 80.00, 15.00, 'Tableros SA'),
('Herrajes Bisagra', 'Metal', 'Unidad', 8500.00, 200.00, 50.00, 'Herrajes Colombia'),
('Tornillos 4x40mm', 'Metal', 'Kilogramo', 12000.00, 10.00, 2.00, 'Ferretería Central'),
('Pegante PVA', 'Otro', 'Litro', 18000.00, 15.00, 3.00, 'Químicos Industriales'),
('Barniz Transparente', 'Otro', 'Litro', 25000.00, 20.00, 5.00, 'Pinturas del Sur'),
('Laca Blanca', 'Otro', 'Litro', 22000.00, 15.00, 3.00, 'Pinturas del Sur'),
('Vidrio Templado 6mm', 'Vidrio', 'Metro2', 85000.00, 10.00, 2.00, 'Vidrios Especiales');

-- Insertar algunos productos ejemplo
INSERT INTO productos (codigo_producto, nombre, id_categoria, descripcion, dimensiones, precio_venta, costo_fabricacion, tiempo_fabricacion_dias) VALUES
('MESA-COM-001', 'Mesa de Comedor Rectangular', 2, 'Mesa de comedor en madera de roble para 6 personas', '180x90x75 cm', 850000.00, 520000.00, 10),
('SILLA-COM-001', 'Silla de Comedor Tapizada', 2, 'Silla de comedor con respaldo alto y asiento tapizado', '45x50x95 cm', 280000.00, 180000.00, 5),
('CAMA-MAT-001', 'Cama Matrimonial con Cabecero', 3, 'Cama matrimonial en madera con cabecero tapizado', '200x160x120 cm', 1200000.00, 750000.00, 15),
('ESCR-OFI-001', 'Escritorio de Oficina', 5, 'Escritorio moderno con cajones y organizadores', '120x60x75 cm', 650000.00, 420000.00, 8);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de productos con información completa
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id_producto,
    p.codigo_producto,
    p.nombre,
    c.nombre AS categoria,
    p.descripcion,
    p.dimensiones,
    p.precio_venta,
    p.costo_fabricacion,
    (p.precio_venta - p.costo_fabricacion) AS utilidad,
    ROUND(((p.precio_venta - p.costo_fabricacion) / p.precio_venta * 100), 2) AS margen_porcentaje,
    p.stock_actual,
    p.stock_minimo,
    CASE 
        WHEN p.stock_actual <= p.stock_minimo THEN 'BAJO STOCK'
        WHEN p.stock_actual = 0 THEN 'SIN STOCK'
        ELSE 'OK'
    END AS estado_stock,
    p.activo
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria;

-- Vista de pedidos con información del cliente
CREATE VIEW vista_pedidos_clientes AS
SELECT 
    pe.id_pedido,
    pe.numero_pedido,
    cl.nombre AS cliente,
    cl.telefono,
    cl.email,
    pe.fecha_pedido,
    pe.fecha_entrega_estimada,
    pe.total,
    pe.anticipo,
    pe.saldo_pendiente,
    pe.estado,
    DATEDIFF(pe.fecha_entrega_estimada, CURDATE()) AS dias_para_entrega
FROM pedidos pe
JOIN clientes cl ON pe.id_cliente = cl.id_cliente;

-- Vista de materiales con estado de stock
CREATE VIEW vista_stock_materiales AS
SELECT 
    m.id_material,
    m.nombre,
    m.tipo_material,
    m.stock_actual,
    m.stock_minimo,
    m.precio_unitario,
    (m.stock_actual * m.precio_unitario) AS valor_inventario,
    CASE 
        WHEN m.stock_actual <= m.stock_minimo THEN 'REABASTECER'
        WHEN m.stock_actual = 0 THEN 'AGOTADO'
        ELSE 'OK'
    END AS estado_stock,
    m.proveedor
FROM materiales m
WHERE m.activo = TRUE;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

DELIMITER //

-- Procedimiento para calcular el costo de fabricación de un producto
CREATE PROCEDURE CalcularCostoFabricacion(IN producto_id INT)
BEGIN
    DECLARE total_costo DECIMAL(10,2) DEFAULT 0;
    
    SELECT SUM(pm.cantidad_necesaria * pm.costo_unitario) INTO total_costo
    FROM producto_materiales pm
    WHERE pm.id_producto = producto_id;
    
    UPDATE productos 
    SET costo_fabricacion = IFNULL(total_costo, 0)
    WHERE id_producto = producto_id;
    
    SELECT total_costo AS costo_calculado;
END //

-- Procedimiento para actualizar stock de materiales
CREATE PROCEDURE ActualizarStockMaterial(
    IN material_id INT, 
    IN cantidad DECIMAL(10,2), 
    IN tipo ENUM('Entrada', 'Salida'),
    IN motivo VARCHAR(100),
    IN referencia VARCHAR(50)
)
BEGIN
    DECLARE stock_actual DECIMAL(10,2);
    
    -- Obtener stock actual
    SELECT m.stock_actual INTO stock_actual 
    FROM materiales m 
    WHERE m.id_material = material_id;
    
    -- Actualizar stock según el tipo de movimiento
    IF tipo = 'Entrada' THEN
        UPDATE materiales 
        SET stock_actual = stock_actual + cantidad 
        WHERE id_material = material_id;
    ELSE
        UPDATE materiales 
        SET stock_actual = stock_actual - cantidad 
        WHERE id_material = material_id;
    END IF;
    
    -- Registrar el movimiento
    INSERT INTO movimientos_inventario (id_material, tipo_movimiento, cantidad, motivo, referencia, fecha_movimiento)
    VALUES (material_id, tipo, cantidad, motivo, referencia, CURDATE());
    
END //

DELIMITER ;

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices en tablas principales
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_codigo ON productos(codigo_producto);
CREATE INDEX idx_pedidos_cliente ON pedidos(id_cliente);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_materiales_tipo ON materiales(tipo_material);
CREATE INDEX idx_movimientos_material ON movimientos_inventario(id_material);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento);

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
INSTRUCCIONES DE USO:

1. Ejecuta este script en tu servidor MySQL/MariaDB
2. La base de datos incluye todas las tablas necesarias para:
   - Gestión de productos y materiales
   - Control de inventarios
   - Gestión de clientes y proveedores
   - Cotizaciones y pedidos
   - Órdenes de producción
   - Control financiero básico

3. Las vistas creadas te ayudarán a consultar información de manera más fácil

4. Los procedimientos almacenados automatizan tareas comunes

5. Para personalizar según tu negocio específico, puedes:
   - Agregar más categorías de productos
   - Modificar los tipos de materiales
   - Ajustar los campos según tus necesidades
   - Agregar más campos personalizados

6. Recuerda hacer respaldos regulares de tu base de datos
*/