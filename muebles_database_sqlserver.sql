-- =====================================================
-- BASE DE DATOS PARA EMPRENDIMIENTO DE FABRICACIÓN DE MUEBLES
-- SQL SERVER VERSION
-- =====================================================

-- Crear la base de datos
CREATE DATABASE muebles_db;
GO

USE muebles_db;
GO

-- =====================================================
-- TABLAS MAESTRAS
-- =====================================================

-- Tabla de categorías de muebles
CREATE TABLE categorias (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL UNIQUE,
    descripcion NTEXT,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);

-- Tabla de materiales
CREATE TABLE materiales (
    id_material INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    tipo_material NVARCHAR(20) NOT NULL CHECK (tipo_material IN ('Madera', 'Metal', 'Vidrio', 'Tela', 'Cuero', 'Plastico', 'Otro')),
    unidad_medida NVARCHAR(20) NOT NULL CHECK (unidad_medida IN ('Metro', 'Metro2', 'Metro3', 'Kilogramo', 'Litro', 'Unidad')),
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock_actual DECIMAL(10,2) DEFAULT 0,
    stock_minimo DECIMAL(10,2) DEFAULT 0,
    proveedor NVARCHAR(100),
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE()
);

-- Trigger para actualizar fecha_actualizacion en materiales
CREATE TRIGGER tr_materiales_update
ON materiales
AFTER UPDATE
AS
BEGIN
    UPDATE materiales 
    SET fecha_actualizacion = GETDATE()
    FROM materiales m
    INNER JOIN inserted i ON m.id_material = i.id_material;
END;
GO

-- Tabla de proveedores
CREATE TABLE proveedores (
    id_proveedor INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    contacto NVARCHAR(100),
    telefono NVARCHAR(20),
    email NVARCHAR(100),
    direccion NTEXT,
    ciudad NVARCHAR(50),
    pais NVARCHAR(50) DEFAULT 'Colombia',
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE()
);

-- Tabla de clientes
CREATE TABLE clientes (
    id_cliente INT IDENTITY(1,1) PRIMARY KEY,
    tipo_cliente NVARCHAR(20) NOT NULL CHECK (tipo_cliente IN ('Individual', 'Empresa')),
    nombre NVARCHAR(100) NOT NULL,
    documento NVARCHAR(20) UNIQUE,
    telefono NVARCHAR(20),
    email NVARCHAR(100),
    direccion NTEXT,
    ciudad NVARCHAR(50),
    fecha_nacimiento DATE,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    notas NTEXT
);

-- =====================================================
-- TABLAS DE PRODUCTOS
-- =====================================================

-- Tabla de productos/muebles
CREATE TABLE productos (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    codigo_producto NVARCHAR(20) UNIQUE NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    id_categoria INT NOT NULL,
    descripcion NTEXT,
    dimensiones NVARCHAR(100), -- Ej: "200x80x75 cm"
    peso DECIMAL(6,2),
    color NVARCHAR(50),
    acabado NVARCHAR(50),
    precio_venta DECIMAL(10,2) NOT NULL,
    costo_fabricacion DECIMAL(10,2),
    tiempo_fabricacion_dias INT DEFAULT 7,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 1,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    fecha_actualizacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Trigger para actualizar fecha_actualizacion en productos
CREATE TRIGGER tr_productos_update
ON productos
AFTER UPDATE
AS
BEGIN
    UPDATE productos 
    SET fecha_actualizacion = GETDATE()
    FROM productos p
    INNER JOIN inserted i ON p.id_producto = i.id_producto;
END;
GO

-- Tabla de materiales por producto (BOM - Bill of Materials)
CREATE TABLE producto_materiales (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    id_material INT NOT NULL,
    cantidad_necesaria DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2),
    notas NTEXT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material),
    CONSTRAINT unique_producto_material UNIQUE (id_producto, id_material)
);

-- =====================================================
-- TABLAS DE VENTAS
-- =====================================================

-- Tabla de cotizaciones
CREATE TABLE cotizaciones (
    id_cotizacion INT IDENTITY(1,1) PRIMARY KEY,
    numero_cotizacion NVARCHAR(20) UNIQUE NOT NULL,
    id_cliente INT NOT NULL,
    fecha_cotizacion DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuestos DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    estado NVARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Aprobada', 'Rechazada', 'Vencida')),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Tabla de detalle de cotizaciones
CREATE TABLE cotizacion_detalles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_cotizacion INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    especificaciones_personalizadas NTEXT,
    FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de pedidos/órdenes
CREATE TABLE pedidos (
    id_pedido INT IDENTITY(1,1) PRIMARY KEY,
    numero_pedido NVARCHAR(20) UNIQUE NOT NULL,
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
    estado NVARCHAR(20) DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En Produccion', 'Terminado', 'Entregado', 'Cancelado')),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion)
);

-- Tabla de detalle de pedidos
CREATE TABLE pedido_detalles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento_linea DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    especificaciones_personalizadas NTEXT,
    estado_fabricacion NVARCHAR(20) DEFAULT 'Pendiente' CHECK (estado_fabricacion IN ('Pendiente', 'En Proceso', 'Terminado')),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- TABLAS DE PRODUCCIÓN
-- =====================================================

-- Tabla de órdenes de producción
CREATE TABLE ordenes_produccion (
    id_orden INT IDENTITY(1,1) PRIMARY KEY,
    numero_orden NVARCHAR(20) UNIQUE NOT NULL,
    id_pedido INT,
    id_producto INT NOT NULL,
    cantidad_producir INT NOT NULL,
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    fecha_fin_real DATE,
    estado NVARCHAR(20) DEFAULT 'Planificada' CHECK (estado IN ('Planificada', 'En Proceso', 'Terminada', 'Cancelada')),
    responsable NVARCHAR(100),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla de consumo de materiales en producción
CREATE TABLE produccion_materiales (
    id INT IDENTITY(1,1) PRIMARY KEY,
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
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_material INT NOT NULL,
    tipo_movimiento NVARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad DECIMAL(10,2) NOT NULL,
    costo_unitario DECIMAL(10,2),
    motivo NVARCHAR(100),
    referencia NVARCHAR(50), -- Número de factura, orden, etc.
    fecha_movimiento DATE NOT NULL,
    usuario NVARCHAR(50),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_material) REFERENCES materiales(id_material)
);

-- Tabla de movimientos de inventario de productos terminados
CREATE TABLE movimientos_productos (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo_movimiento NVARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('Entrada', 'Salida', 'Ajuste')),
    cantidad INT NOT NULL,
    motivo NVARCHAR(100),
    referencia NVARCHAR(50),
    fecha_movimiento DATE NOT NULL,
    usuario NVARCHAR(50),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- =====================================================
-- TABLAS FINANCIERAS
-- =====================================================

-- Tabla de gastos operativos
CREATE TABLE gastos (
    id_gasto INT IDENTITY(1,1) PRIMARY KEY,
    categoria_gasto NVARCHAR(20) NOT NULL CHECK (categoria_gasto IN ('Materiales', 'Mano de Obra', 'Servicios', 'Alquiler', 'Herramientas', 'Marketing', 'Transporte', 'Otros')),
    descripcion NVARCHAR(200) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_gasto DATE NOT NULL,
    metodo_pago NVARCHAR(20) DEFAULT 'Efectivo' CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta', 'Cheque')),
    comprobante NVARCHAR(50),
    id_proveedor INT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);

-- Tabla de pagos de clientes
CREATE TABLE pagos_clientes (
    id_pago INT IDENTITY(1,1) PRIMARY KEY,
    id_pedido INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    metodo_pago NVARCHAR(20) DEFAULT 'Efectivo' CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta', 'Cheque')),
    referencia NVARCHAR(50),
    observaciones NTEXT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
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
GO

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
    DATEDIFF(day, GETDATE(), pe.fecha_entrega_estimada) AS dias_para_entrega
FROM pedidos pe
JOIN clientes cl ON pe.id_cliente = cl.id_cliente;
GO

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
WHERE m.activo = 1;
GO

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para calcular el costo de fabricación de un producto
CREATE PROCEDURE CalcularCostoFabricacion
    @producto_id INT
AS
BEGIN
    DECLARE @total_costo DECIMAL(10,2) = 0;
    
    SELECT @total_costo = SUM(pm.cantidad_necesaria * pm.costo_unitario)
    FROM producto_materiales pm
    WHERE pm.id_producto = @producto_id;
    
    UPDATE productos 
    SET costo_fabricacion = ISNULL(@total_costo, 0)
    WHERE id_producto = @producto_id;
    
    SELECT @total_costo AS costo_calculado;
END;
GO

-- Procedimiento para actualizar stock de materiales
CREATE PROCEDURE ActualizarStockMaterial
    @material_id INT,
    @cantidad DECIMAL(10,2),
    @tipo NVARCHAR(20),
    @motivo NVARCHAR(100),
    @referencia NVARCHAR(50)
AS
BEGIN
    DECLARE @stock_actual DECIMAL(10,2);
    
    -- Obtener stock actual
    SELECT @stock_actual = stock_actual 
    FROM materiales 
    WHERE id_material = @material_id;
    
    -- Actualizar stock según el tipo de movimiento
    IF @tipo = 'Entrada'
    BEGIN
        UPDATE materiales 
        SET stock_actual = @stock_actual + @cantidad 
        WHERE id_material = @material_id;
    END
    ELSE
    BEGIN
        UPDATE materiales 
        SET stock_actual = @stock_actual - @cantidad 
        WHERE id_material = @material_id;
    END
    
    -- Registrar el movimiento
    INSERT INTO movimientos_inventario (id_material, tipo_movimiento, cantidad, motivo, referencia, fecha_movimiento)
    VALUES (@material_id, @tipo, @cantidad, @motivo, @referencia, GETDATE());
END;
GO

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
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para obtener el próximo número de pedido
CREATE FUNCTION fn_ProximoNumeroPedido()
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @proximo_numero NVARCHAR(20);
    DECLARE @ultimo_numero INT;
    
    SELECT @ultimo_numero = ISNULL(MAX(CAST(SUBSTRING(numero_pedido, 4, LEN(numero_pedido)) AS INT)), 0)
    FROM pedidos
    WHERE numero_pedido LIKE 'PED%';
    
    SET @proximo_numero = 'PED' + RIGHT('00000' + CAST(@ultimo_numero + 1 AS NVARCHAR), 5);
    
    RETURN @proximo_numero;
END;
GO

-- Función para obtener el próximo número de cotización
CREATE FUNCTION fn_ProximoNumeroCotizacion()
RETURNS NVARCHAR(20)
AS
BEGIN
    DECLARE @proximo_numero NVARCHAR(20);
    DECLARE @ultimo_numero INT;
    
    SELECT @ultimo_numero = ISNULL(MAX(CAST(SUBSTRING(numero_cotizacion, 4, LEN(numero_cotizacion)) AS INT)), 0)
    FROM cotizaciones
    WHERE numero_cotizacion LIKE 'COT%';
    
    SET @proximo_numero = 'COT' + RIGHT('00000' + CAST(@ultimo_numero + 1 AS NVARCHAR), 5);
    
    RETURN @proximo_numero;
END;
GO

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
INSTRUCCIONES DE USO PARA SQL SERVER:

1. Ejecuta este script en SQL Server Management Studio (SSMS) o Azure Data Studio
2. La base de datos incluye todas las tablas necesarias para:
   - Gestión de productos y materiales
   - Control de inventarios
   - Gestión de clientes y proveedores
   - Cotizaciones y pedidos
   - Órdenes de producción
   - Control financiero básico

3. Diferencias principales con MySQL:
   - Se usa IDENTITY en lugar de AUTO_INCREMENT
   - Se usa NVARCHAR en lugar de VARCHAR para soporte Unicode
   - Se usa BIT en lugar de BOOLEAN
   - Se usa DATETIME2 en lugar de TIMESTAMP
   - Se usan CHECK constraints en lugar de ENUM
   - Se usan triggers para actualizar fechas automáticamente

4. Las vistas creadas te ayudarán a consultar información de manera más fácil
5. Los procedimientos almacenados automatizan tareas comunes
6. Las funciones ayudan a generar números automáticos para pedidos y cotizaciones

7. Para personalizar según tu negocio específico, puedes:
   - Agregar más categorías de productos
   - Modificar los tipos de materiales
   - Ajustar los campos según tus necesidades
   - Agregar más campos personalizados

8. Recuerda hacer respaldos regulares de tu base de datos
*/