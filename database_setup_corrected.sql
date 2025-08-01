-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS DAJUSCA
-- SQL Server - VERSIÓN CORREGIDA
-- ============================================

-- Crear la base de datos
CREATE DATABASE muebles_db;
GO

-- Crear el usuario para la aplicación
USE muebles_db;
GO

-- Crear login y usuario
CREATE LOGIN dajusca_user WITH PASSWORD = 'MiClave123';
GO

CREATE USER dajusca_user FOR LOGIN dajusca_user;
GO

-- Otorgar permisos
ALTER ROLE db_datareader ADD MEMBER dajusca_user;
ALTER ROLE db_datawriter ADD MEMBER dajusca_user;
ALTER ROLE db_ddladmin ADD MEMBER dajusca_user;
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
    categoria_id INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(500),
    precio_base DECIMAL(10,2),
    disponible BIT DEFAULT 1,
    imagen_principal NVARCHAR(255),
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(id)
);

-- ============================================
-- TABLA: Órdenes Personalizadas
-- ============================================
CREATE TABLE OrdenesPersonalizadas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre_cliente NVARCHAR(100) NOT NULL,
    telefono_cliente NVARCHAR(20) NOT NULL,
    email_cliente NVARCHAR(100) NOT NULL,
    descripcion_proyecto NVARCHAR(MAX) NOT NULL,
    imagen_referencia NVARCHAR(255),
    presupuesto_estimado NVARCHAR(50),
    fecha_solicitud DATETIME2 DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'pendiente', -- pendiente, en_proceso, completado
    notas_admin NVARCHAR(MAX)
);

-- ============================================
-- TABLA: Galería de Imágenes
-- ============================================
CREATE TABLE Galeria (
    id INT IDENTITY(1,1) PRIMARY KEY,
    mueble_id INT,
    nombre_archivo NVARCHAR(255) NOT NULL,
    ruta_archivo NVARCHAR(500) NOT NULL,
    es_principal BIT DEFAULT 0,
    fecha_subida DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (mueble_id) REFERENCES Muebles(id)
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar algunos muebles de ejemplo
INSERT INTO Muebles (categoria_id, nombre, descripcion, precio_base, imagen_principal) VALUES
(1, 'Repisa Flotante Moderna', 'Repisa flotante de madera de roble, ideal para decoración minimalista', 150000.00, 'repisa_moderna.jpg'),
(2, 'Gavetero Ejecutivo', 'Gavetero de 5 cajones con acabado en nogal', 350000.00, 'gavetero_ejecutivo.jpg'),
(3, 'Closet Empotrado Premium', 'Closet personalizado con puertas corredizas y organizadores internos', 1200000.00, 'closet_premium.jpg'),
(4, 'Centro de Entretenimiento', 'Mueble para TV hasta 65 pulgadas con almacenamiento lateral', 650000.00, 'centro_tv.jpg'),
(5, 'Cocina Integral Clásica', 'Cocina completa con muebles altos y bajos, incluye mesón', 2500000.00, 'cocina_integral.jpg'),
(6, 'Escritorio Ejecutivo', 'Escritorio en L con cajonera lateral y organizadores', 450000.00, 'escritorio_ejecutivo.jpg');

PRINT 'Base de datos muebles_db creada exitosamente con usuario dajusca_user';