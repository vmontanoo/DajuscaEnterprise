-- =====================================================
-- CONSULTAS ÚTILES PARA EL NEGOCIO DE MUEBLES
-- SQL SERVER VERSION
-- =====================================================

USE muebles_db;
GO

-- =====================================================
-- CONSULTAS DE INVENTARIO
-- =====================================================

-- 1. Ver productos con bajo stock
SELECT 
    codigo_producto,
    nombre,
    categoria,
    stock_actual,
    stock_minimo,
    estado_stock
FROM vista_productos_completa
WHERE estado_stock IN ('BAJO STOCK', 'SIN STOCK')
ORDER BY stock_actual ASC;

-- 2. Ver materiales que necesitan reabastecimiento
SELECT 
    nombre,
    tipo_material,
    stock_actual,
    stock_minimo,
    estado_stock,
    proveedor,
    valor_inventario
FROM vista_stock_materiales
WHERE estado_stock IN ('REABASTECER', 'AGOTADO')
ORDER BY stock_actual ASC;

-- 3. Valor total del inventario de materiales
SELECT 
    tipo_material,
    COUNT(*) as cantidad_materiales,
    SUM(valor_inventario) as valor_total
FROM vista_stock_materiales
GROUP BY tipo_material
ORDER BY valor_total DESC;

-- =====================================================
-- CONSULTAS DE VENTAS
-- =====================================================

-- 4. Pedidos pendientes de entrega
SELECT 
    numero_pedido,
    cliente,
    fecha_pedido,
    fecha_entrega_estimada,
    total,
    estado,
    dias_para_entrega
FROM vista_pedidos_clientes
WHERE estado IN ('Pendiente', 'En Produccion')
ORDER BY fecha_entrega_estimada ASC;

-- 5. Ventas del mes actual
SELECT 
    YEAR(fecha_pedido) as año,
    MONTH(fecha_pedido) as mes,
    COUNT(*) as total_pedidos,
    SUM(total) as ventas_totales,
    AVG(total) as ticket_promedio
FROM pedidos
WHERE fecha_pedido >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
    AND estado != 'Cancelado'
GROUP BY YEAR(fecha_pedido), MONTH(fecha_pedido);

-- 6. Top 10 productos más vendidos
SELECT TOP 10
    p.codigo_producto,
    p.nombre,
    c.nombre as categoria,
    SUM(pd.cantidad) as total_vendido,
    SUM(pd.subtotal) as ingresos_totales
FROM pedido_detalles pd
JOIN productos p ON pd.id_producto = p.id_producto
JOIN categorias c ON p.id_categoria = c.id_categoria
JOIN pedidos pe ON pd.id_pedido = pe.id_pedido
WHERE pe.estado != 'Cancelado'
GROUP BY p.codigo_producto, p.nombre, c.nombre
ORDER BY total_vendido DESC;

-- 7. Clientes con mayor volumen de compras
SELECT TOP 10
    cl.nombre,
    cl.telefono,
    cl.email,
    COUNT(pe.id_pedido) as total_pedidos,
    SUM(pe.total) as compras_totales,
    AVG(pe.total) as ticket_promedio
FROM clientes cl
JOIN pedidos pe ON cl.id_cliente = pe.id_cliente
WHERE pe.estado != 'Cancelado'
GROUP BY cl.nombre, cl.telefono, cl.email
ORDER BY compras_totales DESC;

-- =====================================================
-- CONSULTAS DE PRODUCCIÓN
-- =====================================================

-- 8. Órdenes de producción en proceso
SELECT 
    op.numero_orden,
    p.codigo_producto,
    p.nombre as producto,
    op.cantidad_producir,
    op.fecha_inicio,
    op.fecha_fin_estimada,
    op.responsable,
    op.estado,
    DATEDIFF(day, GETDATE(), op.fecha_fin_estimada) as dias_restantes
FROM ordenes_produccion op
JOIN productos p ON op.id_producto = p.id_producto
WHERE op.estado IN ('Planificada', 'En Proceso')
ORDER BY op.fecha_fin_estimada ASC;

-- 9. Materiales necesarios para órdenes de producción activas
SELECT 
    m.nombre as material,
    m.unidad_medida,
    SUM(pm.cantidad_planificada) as cantidad_total_necesaria,
    m.stock_actual,
    CASE 
        WHEN m.stock_actual >= SUM(pm.cantidad_planificada) THEN 'SUFICIENTE'
        ELSE 'INSUFICIENTE'
    END as disponibilidad,
    (SUM(pm.cantidad_planificada) - m.stock_actual) as faltante
FROM produccion_materiales pm
JOIN ordenes_produccion op ON pm.id_orden = op.id_orden
JOIN materiales m ON pm.id_material = m.id_material
WHERE op.estado IN ('Planificada', 'En Proceso')
GROUP BY m.nombre, m.unidad_medida, m.stock_actual
HAVING SUM(pm.cantidad_planificada) > 0
ORDER BY disponibilidad ASC, faltante DESC;

-- =====================================================
-- CONSULTAS FINANCIERAS
-- =====================================================

-- 10. Resumen financiero mensual
SELECT 
    YEAR(fecha) as año,
    MONTH(fecha) as mes,
    SUM(ingresos) as total_ingresos,
    SUM(gastos) as total_gastos,
    (SUM(ingresos) - SUM(gastos)) as utilidad_neta
FROM (
    -- Ingresos por ventas
    SELECT fecha_pedido as fecha, total as ingresos, 0 as gastos
    FROM pedidos 
    WHERE estado = 'Entregado'
    
    UNION ALL
    
    -- Gastos operativos
    SELECT fecha_gasto as fecha, 0 as ingresos, monto as gastos
    FROM gastos
) resumen
GROUP BY YEAR(fecha), MONTH(fecha)
ORDER BY año DESC, mes DESC;

-- 11. Cuentas por cobrar
SELECT 
    pe.numero_pedido,
    cl.nombre as cliente,
    pe.total,
    ISNULL(SUM(pc.monto), 0) as pagado,
    (pe.total - ISNULL(SUM(pc.monto), 0)) as saldo_pendiente,
    pe.fecha_pedido,
    DATEDIFF(day, pe.fecha_pedido, GETDATE()) as dias_vencido
FROM pedidos pe
JOIN clientes cl ON pe.id_cliente = cl.id_cliente
LEFT JOIN pagos_clientes pc ON pe.id_pedido = pc.id_pedido
WHERE pe.estado IN ('Terminado', 'Entregado')
GROUP BY pe.numero_pedido, cl.nombre, pe.total, pe.fecha_pedido, pe.id_pedido
HAVING (pe.total - ISNULL(SUM(pc.monto), 0)) > 0
ORDER BY dias_vencido DESC;

-- 12. Gastos por categoría en el mes actual
SELECT 
    categoria_gasto,
    COUNT(*) as cantidad_gastos,
    SUM(monto) as total_gastado,
    AVG(monto) as gasto_promedio
FROM gastos
WHERE fecha_gasto >= DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)
GROUP BY categoria_gasto
ORDER BY total_gastado DESC;

-- =====================================================
-- CONSULTAS DE ANÁLISIS
-- =====================================================

-- 13. Análisis de rentabilidad por producto
SELECT 
    codigo_producto,
    nombre,
    categoria,
    precio_venta,
    costo_fabricacion,
    utilidad,
    margen_porcentaje,
    CASE 
        WHEN margen_porcentaje >= 40 THEN 'ALTA RENTABILIDAD'
        WHEN margen_porcentaje >= 20 THEN 'RENTABILIDAD MEDIA'
        ELSE 'BAJA RENTABILIDAD'
    END as clasificacion_rentabilidad
FROM vista_productos_completa
WHERE activo = 1
ORDER BY margen_porcentaje DESC;

-- 14. Tendencia de ventas por categoría (últimos 6 meses)
SELECT 
    c.nombre as categoria,
    YEAR(pe.fecha_pedido) as año,
    MONTH(pe.fecha_pedido) as mes,
    COUNT(pd.id) as productos_vendidos,
    SUM(pd.subtotal) as ingresos
FROM pedido_detalles pd
JOIN productos p ON pd.id_producto = p.id_producto
JOIN categorias c ON p.id_categoria = c.id_categoria
JOIN pedidos pe ON pd.id_pedido = pe.id_pedido
WHERE pe.fecha_pedido >= DATEADD(month, -6, GETDATE())
    AND pe.estado != 'Cancelado'
GROUP BY c.nombre, YEAR(pe.fecha_pedido), MONTH(pe.fecha_pedido)
ORDER BY año DESC, mes DESC, categoria;

-- 15. Tiempo promedio de fabricación por categoría
SELECT 
    c.nombre as categoria,
    AVG(p.tiempo_fabricacion_dias) as tiempo_promedio_dias,
    MIN(p.tiempo_fabricacion_dias) as tiempo_minimo,
    MAX(p.tiempo_fabricacion_dias) as tiempo_maximo,
    COUNT(p.id_producto) as total_productos
FROM productos p
JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.activo = 1
GROUP BY c.nombre
ORDER BY tiempo_promedio_dias DESC;

-- =====================================================
-- CONSULTAS PARA REPORTES
-- =====================================================

-- 16. Reporte de ventas diarias (última semana)
SELECT 
    CAST(pe.fecha_pedido AS DATE) as fecha,
    DATENAME(weekday, pe.fecha_pedido) as dia_semana,
    COUNT(pe.id_pedido) as pedidos,
    SUM(pe.total) as ventas_totales
FROM pedidos pe
WHERE pe.fecha_pedido >= DATEADD(day, -7, GETDATE())
    AND pe.estado != 'Cancelado'
GROUP BY CAST(pe.fecha_pedido AS DATE), DATENAME(weekday, pe.fecha_pedido)
ORDER BY fecha DESC;

-- 17. Estado de cotizaciones
SELECT 
    estado,
    COUNT(*) as cantidad,
    SUM(total) as valor_total,
    AVG(total) as valor_promedio
FROM cotizaciones
WHERE fecha_cotizacion >= DATEADD(month, -3, GETDATE())
GROUP BY estado
ORDER BY cantidad DESC;

-- 18. Productos más cotizados pero no vendidos
SELECT 
    p.codigo_producto,
    p.nombre,
    COUNT(cd.id) as veces_cotizado,
    AVG(cd.precio_unitario) as precio_promedio_cotizado,
    ISNULL(ventas.total_vendido, 0) as total_vendido
FROM cotizacion_detalles cd
JOIN productos p ON cd.id_producto = p.id_producto
JOIN cotizaciones c ON cd.id_cotizacion = c.id_cotizacion
LEFT JOIN (
    SELECT 
        pd.id_producto,
        SUM(pd.cantidad) as total_vendido
    FROM pedido_detalles pd
    JOIN pedidos pe ON pd.id_pedido = pe.id_pedido
    WHERE pe.estado != 'Cancelado'
    GROUP BY pd.id_producto
) ventas ON p.id_producto = ventas.id_producto
WHERE c.fecha_cotizacion >= DATEADD(month, -6, GETDATE())
GROUP BY p.codigo_producto, p.nombre, ventas.total_vendido
HAVING COUNT(cd.id) >= 3 AND ISNULL(ventas.total_vendido, 0) = 0
ORDER BY veces_cotizado DESC;

-- =====================================================
-- PROCEDIMIENTOS PARA REPORTES AUTOMÁTICOS
-- =====================================================

-- 19. Procedimiento para generar reporte de stock bajo
CREATE PROCEDURE sp_ReporteStockBajo
AS
BEGIN
    SELECT 
        'PRODUCTOS' as tipo,
        codigo_producto as codigo,
        nombre,
        CAST(stock_actual AS NVARCHAR) as stock_actual,
        CAST(stock_minimo AS NVARCHAR) as stock_minimo,
        estado_stock
    FROM vista_productos_completa
    WHERE estado_stock IN ('BAJO STOCK', 'SIN STOCK')
    
    UNION ALL
    
    SELECT 
        'MATERIALES' as tipo,
        CAST(id_material AS NVARCHAR) as codigo,
        nombre,
        CAST(stock_actual AS NVARCHAR) as stock_actual,
        CAST(stock_minimo AS NVARCHAR) as stock_minimo,
        estado_stock
    FROM vista_stock_materiales
    WHERE estado_stock IN ('REABASTECER', 'AGOTADO')
    
    ORDER BY tipo, estado_stock;
END;
GO

-- 20. Procedimiento para calcular comisiones de vendedores (si aplica)
CREATE PROCEDURE sp_CalcularComisiones
    @fecha_inicio DATE,
    @fecha_fin DATE,
    @porcentaje_comision DECIMAL(5,2) = 5.0
AS
BEGIN
    SELECT 
        'Vendedor General' as vendedor, -- Puedes agregar campo vendedor a la tabla pedidos
        COUNT(pe.id_pedido) as pedidos_cerrados,
        SUM(pe.total) as ventas_totales,
        SUM(pe.total) * (@porcentaje_comision / 100) as comision_calculada
    FROM pedidos pe
    WHERE pe.fecha_pedido BETWEEN @fecha_inicio AND @fecha_fin
        AND pe.estado = 'Entregado'
    GROUP BY 'Vendedor General'; -- Cambiar por campo real cuando agregues vendedores
END;
GO

-- =====================================================
-- INSTRUCCIONES DE USO
-- =====================================================

/*
CÓMO USAR ESTAS CONSULTAS:

1. CONSULTAS DIARIAS:
   - Ejecuta las consultas 1, 2, 4 y 8 cada mañana para revisar el estado del negocio

2. CONSULTAS SEMANALES:
   - Ejecuta las consultas 5, 6, 10 y 16 para análisis semanal

3. CONSULTAS MENSUALES:
   - Ejecuta las consultas 7, 12, 13 y 14 para reportes mensuales

4. PARA EJECUTAR PROCEDIMIENTOS:
   EXEC sp_ReporteStockBajo;
   EXEC sp_CalcularComisiones '2024-01-01', '2024-01-31', 5.0;

5. PERSONALIZACIÓN:
   - Puedes modificar los períodos de tiempo en las consultas
   - Agregar filtros adicionales según tus necesidades
   - Crear nuevas consultas basadas en estos ejemplos

6. AUTOMATIZACIÓN:
   - Puedes programar estas consultas como trabajos (SQL Server Agent Jobs)
   - Crear alertas automáticas para stock bajo
   - Generar reportes automáticos por email
*/