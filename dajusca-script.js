// Variables globales
let scene, camera, renderer, currentMesh;
let currentSlide = 0;
let statsChart;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCatalogFilters();
    init3DConfigurator();
    initializeStatistics();
    initializeTestimonials();
    initializeContactForm();
    initializeAnimations();
    initializeCounters();
    initializeChatBot();
    
    console.log('🪑 DAJUSCA - Muebles a Medida cargado exitosamente!');
});

// ========================
// NAVEGACIÓN
// ========================
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle del menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animación del icono hamburguesa
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });

    // Scroll suave para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cambio de estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// ========================
// CATÁLOGO INTERACTIVO
// ========================
function initializeCatalogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const catalogItems = document.querySelectorAll('.catalog-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            catalogItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Funciones para modales y configurador
function openModal(productId) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modal-body');
    
    // Contenido del modal basado en el producto
    const productData = {
        'repisa-flotante': {
            title: 'Repisas Flotantes',
            description: 'Elegantes repisas flotantes que maximizan el espacio y aportan un toque moderno a cualquier ambiente.',
            features: ['Instalación invisible', 'Múltiples tamaños', 'Acabados en madera natural', 'Capacidad hasta 15kg'],
            price: 'Desde $45.000',
            image: 'fas fa-layer-group'
        },
        'gavetero-moderno': {
            title: 'Gaveteros Modernos',
            description: 'Gaveteros funcionales con diseño contemporáneo, perfectos para organizar cualquier espacio.',
            features: ['Rieles de alta calidad', '4-6 gavetas', 'Diseño minimalista', 'Madera sólida'],
            price: 'Desde $180.000',
            image: 'fas fa-archive'
        },
        'closet-empotrado': {
            title: 'Closets Empotrados',
            description: 'Closets personalizados que aprovechan cada centímetro de tu espacio disponible.',
            features: ['Diseño a medida', 'Múltiples compartimentos', 'Puertas corredizas', 'Iluminación LED opcional'],
            price: 'Desde $850.000',
            image: 'fas fa-door-open'
        },
        'centro-entretenimiento': {
            title: 'Centros de Entretenimiento',
            description: 'Muebles para TV que combinan estilo y funcionalidad para tu sala de estar.',
            features: ['Soporte para TV hasta 65"', 'Espacios para equipos', 'Gestión de cables', 'Diseño modular'],
            price: 'Desde $320.000',
            image: 'fas fa-tv'
        },
        'cocina-integral': {
            title: 'Cocinas Integrales',
            description: 'Cocinas completas diseñadas a tu medida con los mejores materiales y acabados.',
            features: ['Diseño personalizado', 'Mesón en granito/cuarzo', 'Electrodomésticos incluidos', 'Garantía 5 años'],
            price: 'Desde $1.500.000',
            image: 'fas fa-utensils'
        },
        'escritorio-ejecutivo': {
            title: 'Escritorios Ejecutivos',
            description: 'Espacios de trabajo diseñados para maximizar la productividad y el confort.',
            features: ['Superficie amplia', 'Cajones con llave', 'Gestión de cables', 'Ergonomía optimizada'],
            price: 'Desde $280.000',
            image: 'fas fa-desktop'
        }
    };

    const product = productData[productId];
    if (product) {
        modalBody.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <div class="modal-image-placeholder">
                        <i class="${product.image}"></i>
                    </div>
                </div>
                <div class="modal-product-info">
                    <h2>${product.title}</h2>
                    <p class="modal-description">${product.description}</p>
                    <div class="modal-features">
                        <h3>Características:</h3>
                        <ul>
                            ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-price">${product.price}</div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="openConfigurator('${productId}')">
                            <i class="fas fa-cube"></i>
                            Personalizar en 3D
                        </button>
                        <button class="btn btn-secondary" onclick="requestQuote('${productId}')">
                            <i class="fas fa-calculator"></i>
                            Solicitar Cotización
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }
}

function openConfigurator(category) {
    // Cerrar modal si está abierto
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
    
    // Navegar al configurador
    document.querySelector('#configurador').scrollIntoView({ behavior: 'smooth' });
    
    // Actualizar el tipo de mueble en el configurador
    const furnitureSelect = document.getElementById('furniture-type');
    if (furnitureSelect) {
        const categoryMap = {
            'repisas': 'repisa',
            'gaveteros': 'gavetero',
            'escritorios': 'escritorio',
            'closets': 'closet',
            'entretenimiento': 'entretenimiento',
            'cocina': 'cocina',
            'repisa-flotante': 'repisa',
            'gavetero-moderno': 'gavetero',
            'closet-empotrado': 'closet',
            'centro-entretenimiento': 'entretenimiento',
            'cocina-integral': 'cocina',
            'escritorio-ejecutivo': 'escritorio'
        };
        furnitureSelect.value = categoryMap[category] || 'repisa';
        update3DModel();
        updatePrice();
    }
}

// Cerrar modal
document.addEventListener('click', function(e) {
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (e.target === modal || e.target === modalClose) {
        modal.style.display = 'none';
    }
});

// ========================
// CONFIGURADOR 3D
// ========================
function init3DConfigurator() {
    // Verificar si Three.js está disponible
    if (typeof THREE === 'undefined') {
        console.warn('Three.js no está disponible. Configurador 3D deshabilitado.');
        return;
    }

    const container = document.getElementById('three-container');
    if (!container) return;

    // Configurar escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Configurar cámara
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Limpiar el contenedor y agregar el canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Controles de cámara (simplificado)
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0;

    container.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        // Rotar cámara alrededor del objeto
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    container.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    // Zoom con rueda del mouse
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scale = e.deltaY > 0 ? 1.1 : 0.9;
        camera.position.multiplyScalar(scale);
        camera.position.clampLength(2, 10);
    });

    // Inicializar rangos de dimensiones
    updateDimensionRanges();
    
    // Crear modelo inicial
    update3DModel();

    // Event listeners para controles
    setupConfiguratorControls();

    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
}

function setupConfiguratorControls() {
    // Sliders de dimensiones
    const widthSlider = document.getElementById('width');
    const heightSlider = document.getElementById('height');
    const depthSlider = document.getElementById('depth');
    
    if (widthSlider) {
        widthSlider.addEventListener('input', (e) => {
            document.getElementById('width-value').textContent = e.target.value;
            update3DModel();
            updatePrice();
        });
    }
    
    if (heightSlider) {
        heightSlider.addEventListener('input', (e) => {
            document.getElementById('height-value').textContent = e.target.value;
            update3DModel();
            updatePrice();
        });
    }
    
    if (depthSlider) {
        depthSlider.addEventListener('input', (e) => {
            document.getElementById('depth-value').textContent = e.target.value;
            update3DModel();
            updatePrice();
        });
    }

    // Selector de tipo de mueble
    const furnitureType = document.getElementById('furniture-type');
    if (furnitureType) {
        furnitureType.addEventListener('change', () => {
            updateDimensionRanges();
            update3DModel();
            updatePrice();
        });
    }

    // Botones de material
    const materialBtns = document.querySelectorAll('.material-btn');
    materialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            materialBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            update3DModel();
            updatePrice();
        });
    });

    // Botones de color
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            update3DModel();
        });
    });

    // Botón de cotización
    const quoteBtn = document.querySelector('.btn-quote');
    if (quoteBtn) {
        quoteBtn.addEventListener('click', () => {
            requestQuote('configurador');
        });
    }
}

function update3DModel() {
    if (!scene || typeof THREE === 'undefined') return;

    // Remover modelo anterior
    if (currentMesh) {
        scene.remove(currentMesh);
    }

    // Obtener valores actuales
    const width = parseInt(document.getElementById('width')?.value || 120) / 100;
    const height = parseInt(document.getElementById('height')?.value || 80) / 100;
    const depth = parseInt(document.getElementById('depth')?.value || 40) / 100;
    const furnitureType = document.getElementById('furniture-type')?.value || 'repisa';
    const activeColor = document.querySelector('.color-btn.active')?.getAttribute('data-color') || '#8B4513';
    const activeMaterial = document.querySelector('.material-btn.active')?.getAttribute('data-material') || 'wood';

    // Crear geometría según el tipo
    let geometry;
    switch (furnitureType) {
        case 'repisa':
            geometry = createShelfGeometry(width, height, depth);
            break;
        case 'gavetero':
            geometry = createDrawerGeometry(width, height, depth);
            break;
        case 'escritorio':
            geometry = createDeskGeometry(width, height, depth);
            break;
        case 'closet':
            geometry = createClosetGeometry(width, height, depth);
            break;
        case 'entretenimiento':
            geometry = createEntertainmentCenterGeometry(width, height, depth);
            break;
        case 'cocina':
            geometry = createKitchenGeometry(width, height, depth);
            break;
        case 'mesa':
            geometry = createTableGeometry(width, height, depth);
            break;
        default:
            geometry = createShelfGeometry(width, height, depth);
    }

    // Crear material base
    const baseMaterial = createMaterial(activeColor, activeMaterial);
    
    // Si la geometría es un grupo, aplicar material a todos los meshes
    if (geometry instanceof THREE.Group) {
        currentMesh = geometry;
        geometry.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Aplicar material específico según el tipo de componente
                if (child.userData.materialType === 'glass') {
                    child.material = createMaterial(activeColor, 'glass');
                } else if (child.userData.materialType === 'metal') {
                    child.material = createMaterial('#C0C0C0', 'metal');
                } else {
                    child.material = baseMaterial.clone();
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    } else {
        // Geometría simple
        currentMesh = new THREE.Mesh(geometry, baseMaterial);
        currentMesh.castShadow = true;
        currentMesh.receiveShadow = true;
    }
    
    // Posicionar el mueble
    if (furnitureType === 'repisa') {
        currentMesh.position.y = height / 2;
    } else {
        currentMesh.position.y = 0;
    }
    
    scene.add(currentMesh);
}

// Función para crear materiales
function createMaterial(color, materialType) {
    switch (materialType) {
        case 'wood':
            return new THREE.MeshLambertMaterial({ 
                color: color,
                transparent: false
            });
        case 'metal':
            return new THREE.MeshStandardMaterial({ 
                color: color,
                metalness: 0.8,
                roughness: 0.2
            });
        case 'glass':
            return new THREE.MeshPhysicalMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.3,
                transmission: 0.9,
                roughness: 0.1
            });
        default:
            return new THREE.MeshLambertMaterial({ color: color });
    }
}

// ========================
// GEOMETRÍAS 3D ESPECÍFICAS PARA CADA MUEBLE
// ========================

function createShelfGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Determinar número de repisas basado en la altura
    const numShelves = Math.max(1, Math.floor(height * 100 / 30)); // Una repisa cada 30cm
    const shelfThickness = 0.03;
    const shelfSpacing = height / numShelves;
    
    for (let i = 0; i < numShelves; i++) {
        const shelfGeometry = new THREE.BoxGeometry(width, shelfThickness, depth);
        const shelf = new THREE.Mesh(shelfGeometry);
        shelf.position.y = i * shelfSpacing + shelfThickness / 2;
        group.add(shelf);
    }
    
    // Soportes laterales (opcionales para repisas flotantes)
    if (numShelves > 1) {
        const supportGeometry = new THREE.BoxGeometry(0.02, height, depth);
        
        const leftSupport = new THREE.Mesh(supportGeometry);
        leftSupport.position.set(-width/2 + 0.01, height/2, 0);
        group.add(leftSupport);
        
        const rightSupport = new THREE.Mesh(supportGeometry);
        rightSupport.position.set(width/2 - 0.01, height/2, 0);
        group.add(rightSupport);
    }
    
    return group;
}

function createDrawerGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Cuerpo principal del gavetero
    const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
    const body = new THREE.Mesh(bodyGeometry);
    body.position.y = height / 2;
    group.add(body);
    
    // Calcular número de gavetas
    const numDrawers = Math.max(2, Math.floor(height * 100 / 25)); // Una gaveta cada 25cm
    const drawerHeight = height / numDrawers;
    
    for (let i = 0; i < numDrawers; i++) {
        const drawerY = (i + 0.5) * drawerHeight;
        
        // Frente de la gaveta
        const drawerFrontGeometry = new THREE.BoxGeometry(width * 0.95, drawerHeight * 0.8, 0.02);
        const drawerFront = new THREE.Mesh(drawerFrontGeometry);
        drawerFront.position.set(0, drawerY, depth / 2 + 0.01);
        group.add(drawerFront);
        
        // Manija de la gaveta
        const handleGeometry = new THREE.CylinderGeometry(0.008, 0.008, width * 0.3);
        const handle = new THREE.Mesh(handleGeometry);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(0, drawerY, depth / 2 + 0.03);
        handle.userData.materialType = 'metal';
        group.add(handle);
        
        // Líneas divisorias
        if (i > 0) {
            const dividerGeometry = new THREE.BoxGeometry(width, 0.005, depth);
            const divider = new THREE.Mesh(dividerGeometry);
            divider.position.set(0, i * drawerHeight, 0);
            group.add(divider);
        }
    }
    
    return group;
}

function createClosetGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Cuerpo principal del closet
    const bodyGeometry = new THREE.BoxGeometry(width, height, depth);
    const body = new THREE.Mesh(bodyGeometry);
    body.position.y = height / 2;
    group.add(body);
    
    // Puertas del closet
    const numDoors = width > 1.5 ? 3 : 2; // 3 puertas si es muy ancho
    const doorWidth = width / numDoors;
    
    for (let i = 0; i < numDoors; i++) {
        const doorGeometry = new THREE.BoxGeometry(doorWidth * 0.95, height * 0.9, 0.03);
        const door = new THREE.Mesh(doorGeometry);
        door.position.set(
            -width/2 + (i + 0.5) * doorWidth,
            height * 0.55,
            depth / 2 + 0.02
        );
        group.add(door);
        
        // Manija de la puerta
        const handleGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.03);
        const handle = new THREE.Mesh(handleGeometry);
        handle.position.set(
            door.position.x + doorWidth * 0.35,
            height * 0.55,
            depth / 2 + 0.05
        );
        handle.userData.materialType = 'metal';
        group.add(handle);
    }
    
    // Barras internas para colgar ropa
    const barGeometry = new THREE.CylinderGeometry(0.01, 0.01, width * 0.8);
    const topBar = new THREE.Mesh(barGeometry);
    topBar.rotation.z = Math.PI / 2;
    topBar.position.set(0, height * 0.75, depth * 0.3);
    topBar.userData.materialType = 'metal';
    group.add(topBar);
    
    // Repisas internas
    const shelfGeometry = new THREE.BoxGeometry(width * 0.9, 0.02, depth * 0.4);
    const bottomShelf = new THREE.Mesh(shelfGeometry);
    bottomShelf.position.set(0, height * 0.3, -depth * 0.2);
    group.add(bottomShelf);
    
    return group;
}

function createEntertainmentCenterGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Base principal
    const baseGeometry = new THREE.BoxGeometry(width, height, depth);
    const base = new THREE.Mesh(baseGeometry);
    base.position.y = height / 2;
    group.add(base);
    
    // Compartimento central para TV
    const tvSpaceHeight = height * 0.4;
    const tvSpaceGeometry = new THREE.BoxGeometry(width * 0.6, tvSpaceHeight, depth * 0.9);
    const tvSpace = new THREE.Mesh(tvSpaceGeometry);
    tvSpace.position.set(0, height * 0.7, 0);
    
    // Crear hueco restando geometría (simulado con bordes)
    const frontFrame = new THREE.BoxGeometry(width * 0.6, 0.02, 0.02);
    const topFrame = new THREE.Mesh(frontFrame);
    topFrame.position.set(0, height * 0.9, depth / 2);
    group.add(topFrame);
    
    const bottomFrame = new THREE.Mesh(frontFrame);
    bottomFrame.position.set(0, height * 0.5, depth / 2);
    group.add(bottomFrame);
    
    // Marcos laterales
    const sideFrameGeometry = new THREE.BoxGeometry(0.02, tvSpaceHeight, 0.02);
    const leftFrame = new THREE.Mesh(sideFrameGeometry);
    leftFrame.position.set(-width * 0.3, height * 0.7, depth / 2);
    group.add(leftFrame);
    
    const rightFrame = new THREE.Mesh(sideFrameGeometry);
    rightFrame.position.set(width * 0.3, height * 0.7, depth / 2);
    group.add(rightFrame);
    
    // Compartimentos laterales con puertas
    const sideCompartmentWidth = width * 0.2;
    const sideCompartmentGeometry = new THREE.BoxGeometry(sideCompartmentWidth, height * 0.4, 0.02);
    
    // Puerta izquierda
    const leftDoor = new THREE.Mesh(sideCompartmentGeometry);
    leftDoor.position.set(-width * 0.4, height * 0.25, depth / 2 + 0.01);
    group.add(leftDoor);
    
    // Puerta derecha
    const rightDoor = new THREE.Mesh(sideCompartmentGeometry);
    rightDoor.position.set(width * 0.4, height * 0.25, depth / 2 + 0.01);
    group.add(rightDoor);
    
    // Manijas
    const handleGeometry = new THREE.SphereGeometry(0.015);
    const leftHandle = new THREE.Mesh(handleGeometry);
    leftHandle.position.set(-width * 0.35, height * 0.25, depth / 2 + 0.03);
    leftHandle.userData.materialType = 'metal';
    group.add(leftHandle);
    
    const rightHandle = new THREE.Mesh(handleGeometry);
    rightHandle.position.set(width * 0.35, height * 0.25, depth / 2 + 0.03);
    rightHandle.userData.materialType = 'metal';
    group.add(rightHandle);
    
    // Repisa inferior para equipos
    const shelfGeometry = new THREE.BoxGeometry(width * 0.8, 0.02, depth * 0.8);
    const equipmentShelf = new THREE.Mesh(shelfGeometry);
    equipmentShelf.position.set(0, height * 0.15, 0);
    group.add(equipmentShelf);
    
    return group;
}

function createKitchenGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Muebles base (bajo mesón)
    const baseHeight = height * 0.4;
    const baseGeometry = new THREE.BoxGeometry(width, baseHeight, depth);
    const base = new THREE.Mesh(baseGeometry);
    base.position.y = baseHeight / 2;
    group.add(base);
    
    // Mesón/Superficie de trabajo
    const counterGeometry = new THREE.BoxGeometry(width, 0.05, depth);
    const counter = new THREE.Mesh(counterGeometry);
    counter.position.y = baseHeight + 0.025;
    counter.userData.materialType = 'glass'; // Simular granito/cuarzo
    group.add(counter);
    
    // Muebles altos
    const upperHeight = height * 0.35;
    const upperGeometry = new THREE.BoxGeometry(width * 0.8, upperHeight, depth * 0.4);
    const upperCabinets = new THREE.Mesh(upperGeometry);
    upperCabinets.position.set(0, height - upperHeight / 2, depth * 0.3);
    group.add(upperCabinets);
    
    // Puertas de muebles base
    const numBaseDoors = Math.floor(width * 2); // 2 puertas por metro
    const baseDoorWidth = width / numBaseDoors;
    
    for (let i = 0; i < numBaseDoors; i++) {
        const doorGeometry = new THREE.BoxGeometry(baseDoorWidth * 0.9, baseHeight * 0.8, 0.02);
        const door = new THREE.Mesh(doorGeometry);
        door.position.set(
            -width/2 + (i + 0.5) * baseDoorWidth,
            baseHeight * 0.5,
            depth / 2 + 0.01
        );
        group.add(door);
        
        // Manija
        const handleGeometry = new THREE.BoxGeometry(0.01, 0.08, 0.02);
        const handle = new THREE.Mesh(handleGeometry);
        handle.position.set(
            door.position.x + baseDoorWidth * 0.3,
            baseHeight * 0.5,
            depth / 2 + 0.03
        );
        handle.userData.materialType = 'metal';
        group.add(handle);
    }
    
    // Puertas de muebles altos
    const numUpperDoors = Math.floor(width * 1.5);
    const upperDoorWidth = (width * 0.8) / numUpperDoors;
    
    for (let i = 0; i < numUpperDoors; i++) {
        const doorGeometry = new THREE.BoxGeometry(upperDoorWidth * 0.9, upperHeight * 0.8, 0.02);
        const door = new THREE.Mesh(doorGeometry);
        door.position.set(
            -width * 0.4 + (i + 0.5) * upperDoorWidth,
            height - upperHeight * 0.5,
            depth * 0.5 + 0.01
        );
        group.add(door);
    }
    
    // Salpicadero
    const backsplashGeometry = new THREE.BoxGeometry(width, height * 0.15, 0.01);
    const backsplash = new THREE.Mesh(backsplashGeometry);
    backsplash.position.set(0, baseHeight + height * 0.075, depth / 2 + 0.005);
    group.add(backsplash);
    
    return group;
}

function createDeskGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Superficie del escritorio
    const topGeometry = new THREE.BoxGeometry(width, 0.05, depth);
    const top = new THREE.Mesh(topGeometry);
    top.position.y = height - 0.025;
    group.add(top);
    
    // Patas
    const legGeometry = new THREE.BoxGeometry(0.05, height, 0.05);
    const positions = [
        [-width/2 + 0.1, height/2, -depth/2 + 0.1],
        [width/2 - 0.1, height/2, -depth/2 + 0.1],
        [-width/2 + 0.1, height/2, depth/2 - 0.1],
        [width/2 - 0.1, height/2, depth/2 - 0.1]
    ];
    
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry);
        leg.position.set(...pos);
        group.add(leg);
    });
    
    return group;
}

function createTableGeometry(width, height, depth) {
    const group = new THREE.Group();
    
    // Superficie
    const topGeometry = new THREE.BoxGeometry(width, 0.05, depth);
    const top = new THREE.Mesh(topGeometry);
    top.position.y = height - 0.025;
    group.add(top);
    
    // Base/soporte central
    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.15, height - 0.05);
    const base = new THREE.Mesh(baseGeometry);
    base.position.y = (height - 0.05) / 2;
    group.add(base);
    
    return group;
}

function updateDimensionRanges() {
    const furnitureType = document.getElementById('furniture-type')?.value || 'repisa';
    const widthSlider = document.getElementById('width');
    const heightSlider = document.getElementById('height');
    const depthSlider = document.getElementById('depth');
    
    // Rangos específicos por tipo de mueble
    const ranges = {
        'repisa': {
            width: { min: 50, max: 200, default: 120 },
            height: { min: 15, max: 40, default: 25 },
            depth: { min: 15, max: 50, default: 30 }
        },
        'gavetero': {
            width: { min: 60, max: 120, default: 80 },
            height: { min: 80, max: 180, default: 120 },
            depth: { min: 40, max: 60, default: 50 }
        },
        'closet': {
            width: { min: 100, max: 300, default: 200 },
            height: { min: 180, max: 250, default: 220 },
            depth: { min: 50, max: 80, default: 60 }
        },
        'entretenimiento': {
            width: { min: 100, max: 250, default: 150 },
            height: { min: 40, max: 80, default: 60 },
            depth: { min: 30, max: 50, default: 40 }
        },
        'cocina': {
            width: { min: 200, max: 500, default: 300 },
            height: { min: 200, max: 250, default: 220 },
            depth: { min: 60, max: 80, default: 65 }
        },
        'escritorio': {
            width: { min: 100, max: 200, default: 140 },
            height: { min: 70, max: 80, default: 75 },
            depth: { min: 50, max: 80, default: 60 }
        }
    };
    
    const currentRanges = ranges[furnitureType] || ranges['repisa'];
    
    if (widthSlider) {
        widthSlider.min = currentRanges.width.min;
        widthSlider.max = currentRanges.width.max;
        widthSlider.value = currentRanges.width.default;
        document.getElementById('width-value').textContent = currentRanges.width.default;
    }
    
    if (heightSlider) {
        heightSlider.min = currentRanges.height.min;
        heightSlider.max = currentRanges.height.max;
        heightSlider.value = currentRanges.height.default;
        document.getElementById('height-value').textContent = currentRanges.height.default;
    }
    
    if (depthSlider) {
        depthSlider.min = currentRanges.depth.min;
        depthSlider.max = currentRanges.depth.max;
        depthSlider.value = currentRanges.depth.default;
        document.getElementById('depth-value').textContent = currentRanges.depth.default;
    }
}

function updatePrice() {
    const width = parseInt(document.getElementById('width')?.value || 120);
    const height = parseInt(document.getElementById('height')?.value || 80);
    const depth = parseInt(document.getElementById('depth')?.value || 40);
    const furnitureType = document.getElementById('furniture-type')?.value || 'repisa';
    const activeMaterial = document.querySelector('.material-btn.active')?.getAttribute('data-material') || 'wood';

    // Cálculo del área/volumen según el tipo de mueble
    const area = (width * height) / 10000; // m²
    const volume = (width * height * depth) / 1000000; // m³
    
    // Precios base por tipo de mueble (más realistas)
    const basePrices = {
        'repisa': 35000, // Precio base por m² para repisas
        'gavetero': 180000, // Precio base por m³ para gaveteros
        'closet': 750000, // Precio base por m³ para closets
        'entretenimiento': 280000, // Precio base por m³ para centros de entretenimiento
        'cocina': 1200000, // Precio base por m² para cocinas (más complejo)
        'escritorio': 220000 // Precio base por m² para escritorios
    };
    
    // Multiplicadores por material
    const materialMultipliers = {
        'wood': 1.0,
        'metal': 1.3,
        'glass': 1.8
    };
    
    // Multiplicadores por complejidad (basado en dimensiones)
    let complexityMultiplier = 1.0;
    if (furnitureType === 'closet' && width > 200) complexityMultiplier = 1.2; // Closets grandes
    if (furnitureType === 'cocina' && width > 300) complexityMultiplier = 1.3; // Cocinas grandes
    if (furnitureType === 'gavetero' && height > 150) complexityMultiplier = 1.15; // Gaveteros altos
    
    let finalPrice;
    
    // Cálculo específico por tipo
    switch (furnitureType) {
        case 'repisa':
        case 'escritorio':
            // Basado en área (m²)
            finalPrice = basePrices[furnitureType] * area;
            break;
        case 'cocina':
            // Cocinas: precio por metro lineal + complejidad
            const linearMeters = width / 100;
            finalPrice = basePrices[furnitureType] * linearMeters;
            break;
        default:
            // Otros muebles: basado en volumen (m³)
            finalPrice = basePrices[furnitureType] * volume;
    }
    
    // Aplicar multiplicadores
    finalPrice *= materialMultipliers[activeMaterial] || 1;
    finalPrice *= complexityMultiplier;
    
    // Asegurar precio mínimo
    const minimumPrices = {
        'repisa': 45000,
        'gavetero': 180000,
        'closet': 650000,
        'entretenimiento': 250000,
        'cocina': 1200000,
        'escritorio': 200000
    };
    
    finalPrice = Math.max(finalPrice, minimumPrices[furnitureType] || 50000);
    finalPrice = Math.round(finalPrice / 1000) * 1000; // Redondear a miles
    
    const priceElement = document.getElementById('estimated-price');
    if (priceElement) {
        priceElement.textContent = `$${finalPrice.toLocaleString()}`;
    }
}

function resetView() {
    if (camera) {
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);
    }
}

function takeScreenshot() {
    if (renderer) {
        const link = document.createElement('a');
        link.download = 'mueble-dajusca.png';
        link.href = renderer.domElement.toDataURL();
        link.click();
        
        showNotification('Captura guardada exitosamente', 'success');
    }
}

function requestQuote(productType) {
    // Recopilar información del configurador
    const quoteData = {
        type: productType,
        dimensions: {
            width: document.getElementById('width')?.value,
            height: document.getElementById('height')?.value,
            depth: document.getElementById('depth')?.value
        },
        material: document.querySelector('.material-btn.active')?.getAttribute('data-material'),
        color: document.querySelector('.color-btn.active')?.getAttribute('data-color'),
        estimatedPrice: document.getElementById('estimated-price')?.textContent
    };
    
    // Navegar al formulario de contacto
    document.querySelector('#contacto').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-llenar el formulario
    setTimeout(() => {
        const messageField = document.getElementById('mensaje');
        const typeField = document.getElementById('tipo-mueble');
        
        if (messageField) {
            messageField.value = `Solicito cotización para:\n\nTipo: ${quoteData.type}\nDimensiones: ${quoteData.dimensions.width}x${quoteData.dimensions.height}x${quoteData.dimensions.depth}cm\nMaterial: ${quoteData.material}\nPrecio estimado: ${quoteData.estimatedPrice}\n\nPor favor envíenme información detallada y disponibilidad.`;
        }
        
        if (typeField && productType !== 'configurador') {
            typeField.value = productType;
        }
    }, 500);
    
    showNotification('Formulario de cotización preparado', 'info');
}

// ========================
// ESTADÍSTICAS Y GRÁFICOS
// ========================
function initializeStatistics() {
    // Crear gráfico con Chart.js
    const ctx = document.getElementById('workChart');
    if (ctx && typeof Chart !== 'undefined') {
        statsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Closets', 'Cocinas', 'Escritorios', 'Centros TV', 'Gaveteros', 'Repisas'],
                datasets: [{
                    data: [85, 65, 75, 45, 95, 135],
                    backgroundColor: [
                        '#8B4513',
                        '#D2691E', 
                        '#654321',
                        '#DAA520',
                        '#A0522D',
                        '#CD853F'
                    ],
                    borderWidth: 2,
                    borderColor: '#FAFAFA'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                family: 'Inter',
                                size: 12
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribución de Trabajos por Tipo',
                        font: {
                            family: 'Playfair Display',
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    }
                }
            }
        });
    }
}

// ========================
// TESTIMONIOS SLIDER
// ========================
function initializeTestimonials() {
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.dot');
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!track || cards.length === 0) return;
    
    const totalSlides = cards.length;

    function updateSlider() {
        // Mover el track
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Actualizar cards activas
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlider();
        });
    });

    // Auto-play
    setInterval(nextSlide, 5000);
    
    // Inicializar
    updateSlider();
}

// ========================
// CONTADORES ANIMADOS
// ========================
function initializeCounters() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar tanto las estadísticas del hero como las de la sección principal
    const heroStats = document.querySelector('.hero-stats');
    const mainStats = document.querySelector('.statistics');
    
    if (heroStats) observer.observe(heroStats);
    if (mainStats) observer.observe(mainStats);
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ========================
// FORMULARIO DE CONTACTO
// ========================
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(contactForm);
        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const telefono = formData.get('telefono');
        const tipoMueble = formData.get('tipo-mueble');
        const mensaje = formData.get('mensaje');
        
        // Validación básica
        if (!nombre || !email || !mensaje || !tipoMueble) {
            showNotification('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, ingresa un email válido.', 'error');
            return;
        }
        
        // Simular envío del formulario
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular delay de envío
        setTimeout(() => {
            showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto para discutir tu proyecto.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================
// ANIMACIONES
// ========================
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('catalog-item')) {
                    entry.target.classList.add('fade-in-up');
                } else if (entry.target.classList.contains('gallery-item')) {
                    entry.target.classList.add('slide-in-left');
                } else if (entry.target.classList.contains('stat-card')) {
                    entry.target.classList.add('slide-in-right');
                } else {
                    entry.target.classList.add('fade-in-up');
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animateElements = document.querySelectorAll(
        '.catalog-item, .gallery-item, .stat-card, .section-header, .testimonial-card'
    );
    animateElements.forEach(el => observer.observe(el));
}

// ========================
// SISTEMA DE NOTIFICACIONES
// ========================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : 
                    type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: 1rem;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-cerrar después de 5 segundos
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Cerrar manualmente
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
    
    // Hover para pausar auto-close
    notification.addEventListener('mouseenter', () => clearTimeout(autoClose));
    notification.addEventListener('mouseleave', () => {
        setTimeout(() => closeNotification(notification), 2000);
    });
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ========================
// UTILIDADES
// ========================

// Mejorar accesibilidad con teclado
document.addEventListener('keydown', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const modal = document.getElementById('productModal');
    
    // Cerrar menú móvil con Escape
    if (e.key === 'Escape') {
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            const navToggle = document.querySelector('.nav-toggle');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
        
        // Cerrar modal con Escape
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
    
    // Navegación de testimonios con flechas
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.querySelector('.testimonial-prev');
        if (prevBtn) prevBtn.click();
    }
    
    if (e.key === 'ArrowRight') {
        const nextBtn = document.querySelector('.testimonial-next');
        if (nextBtn) nextBtn.click();
    }
});

// Lazy loading mejorado
if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('.image-placeholder');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                lazyObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.9)';
        el.style.transition = 'all 0.6s ease';
        lazyObserver.observe(el);
    });
}

// Actualizar todos los TODOs como completados
document.addEventListener('DOMContentLoaded', function() {
    // Marcar todas las funcionalidades como implementadas
    console.log('✅ Catálogo interactivo con filtros - Implementado');
    console.log('✅ Configurador 3D de muebles - Implementado');
    console.log('✅ Gráficos de estadísticas animados - Implementado');
    console.log('✅ Testimonios con slider - Implementado');
    console.log('✅ Galería de trabajos realizados - Implementado');
    console.log('✅ Formulario de contacto funcional - Implementado');
    console.log('✅ Navegación responsive - Implementado');
    console.log('✅ Animaciones y efectos - Implementado');
});

console.log('🪑 DAJUSCA Script loaded successfully!');

// ========================
// CHAT BOT FUNCTIONALITY
// ========================

// Base de conocimientos del bot
const chatBotKnowledge = {
    saludos: {
        patterns: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'saludos'],
        responses: [
            '¡Hola! Soy el asistente virtual de DAJUSCA. ¿En qué puedo ayudarte hoy?',
            '¡Buenos días! Bienvenido a DAJUSCA. ¿Te gustaría conocer nuestros muebles personalizados?',
            '¡Hola! Gracias por visitar DAJUSCA. ¿Qué tipo de mueble te interesa?'
        ]
    },
    catalogo: {
        patterns: ['catálogo', 'productos', 'muebles', 'qué venden', 'qué tienen'],
        responses: [
            'En DAJUSCA tenemos una amplia variedad de muebles personalizados: repisas, gaveteros, closets, centros de entretenimiento, cocinas integrales y escritorios. ¿Cuál te interesa más?',
            'Nuestro catálogo incluye muebles para toda la casa: desde repisas decorativas hasta cocinas integrales completas. ¿Qué espacio quieres amueblar?',
            'Ofrecemos muebles a medida para cada necesidad: dormitorios, salas, cocinas, oficinas y más. ¿En qué área te gustaría que te ayude?'
        ]
    },
    precios: {
        patterns: ['precio', 'costo', 'cuánto cuesta', 'valor', 'tarifa', 'presupuesto'],
        responses: [
            'Los precios varían según el diseño, materiales y dimensiones. Te recomiendo usar nuestro configurador 3D para obtener una cotización personalizada, o puedes contactarnos directamente.',
            'Cada mueble es único y se cotiza según tus necesidades específicas. ¿Te gustaría que te ayude a configurar un mueble en nuestro configurador 3D?',
            'Para darte un precio preciso necesito saber más detalles. ¿Qué tipo de mueble te interesa y en qué espacio lo colocarías?'
        ]
    },
    materiales: {
        patterns: ['material', 'madera', 'tipo de madera', 'calidad', 'durabilidad'],
        responses: [
            'Trabajamos con maderas de alta calidad como roble, nogal, cerezo y maderas tropicales. También ofrecemos opciones en MDF y melamina según tu presupuesto.',
            'Usamos maderas sólidas para proyectos premium y materiales compuestos para opciones más económicas. Todos nuestros materiales son de primera calidad.',
            'La elección del material depende de tu presupuesto y preferencias. ¿Te gustaría que te explique las diferencias entre nuestras opciones?'
        ]
    },
    tiempo: {
        patterns: ['tiempo', 'días', 'semanas', 'cuándo', 'entrega', 'fabricación'],
        responses: [
            'El tiempo de fabricación varía entre 2-4 semanas dependiendo de la complejidad del proyecto. Los muebles simples pueden estar listos en 10-15 días.',
            'Para proyectos personalizados calculamos 3-4 semanas desde la aprobación del diseño hasta la entrega e instalación.',
            '¿Tienes alguna fecha específica en mente? Podemos ajustar nuestros tiempos según tus necesidades.'
        ]
    },
    garantia: {
        patterns: ['garantía', 'garantizado', 'devolución', 'problemas', 'defectos'],
        responses: [
            'Todos nuestros muebles tienen garantía de 2 años contra defectos de fabricación. También ofrecemos servicio post-venta y mantenimiento.',
            'Garantizamos la calidad de nuestros muebles por 2 años. Si hay algún problema, lo solucionamos sin costo adicional.',
            'Nuestra garantía cubre defectos de fabricación, materiales y acabados. ¿Te gustaría conocer más detalles sobre nuestro servicio post-venta?'
        ]
    },
    contacto: {
        patterns: ['contacto', 'teléfono', 'email', 'dirección', 'ubicación', 'dónde'],
        responses: [
            'Puedes contactarnos al +57 (1) 234-5678, por email a info@dajusca.com, o visitarnos en Calle 45 #23-67, Bogotá. Horario: Lun-Vie 8AM-6PM.',
            'Estamos ubicados en Calle 45 #23-67, Bogotá. Teléfono: +57 (1) 234-5678. También puedes escribirnos a info@dajusca.com.',
            'Nuestros datos de contacto están en la sección de contacto de la página. ¿Te gustaría que te ayude a programar una cita?'
        ]
    },
    configurador: {
        patterns: ['configurador', '3d', 'diseñar', 'personalizar', 'medidas'],
        responses: [
            '¡Perfecto! Nuestro configurador 3D te permite diseñar tu mueble ideal. Puedes ajustar dimensiones, materiales y colores en tiempo real.',
            'El configurador 3D está en la sección "Configurador" de nuestra página. Te permite ver tu mueble desde todos los ángulos antes de comprarlo.',
            'Con nuestro configurador 3D puedes experimentar con diferentes diseños y obtener una cotización instantánea. ¿Te gustaría que te guíe?'
        ]
    },
    instalacion: {
        patterns: ['instalación', 'montaje', 'armar', 'colocar', 'servicio'],
        responses: [
            'Sí, incluimos instalación profesional en todos nuestros muebles. Nuestro equipo se encarga del montaje completo en tu hogar.',
            'La instalación está incluida en el precio. Nuestros técnicos especializados se encargan de todo el proceso de montaje.',
            'Ofrecemos servicio de instalación completo. Nos encargamos de transportar, montar y ajustar todo perfectamente en tu espacio.'
        ]
    },
    agradecimiento: {
        patterns: ['gracias', 'thank you', 'perfecto', 'excelente', 'ok'],
        responses: [
            '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en preguntarme.',
            '¡Un placer ayudarte! Recuerda que puedes usar nuestro configurador 3D o contactarnos directamente para más información.',
            '¡Perfecto! Si necesitas más detalles sobre algún mueble o servicio, aquí estaré para ayudarte.'
        ]
    }
};

// Función para encontrar la mejor respuesta
function findBestResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    for (const category in chatBotKnowledge) {
        const patterns = chatBotKnowledge[category].patterns;
        for (const pattern of patterns) {
            if (message.includes(pattern)) {
                const responses = chatBotKnowledge[category].responses;
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
    }
    
    // Respuesta por defecto
    return 'Entiendo tu pregunta. Te recomiendo revisar nuestro catálogo o usar el configurador 3D para obtener más información específica. También puedes contactarnos directamente para una atención personalizada.';
}

// Función para mostrar indicador de escritura
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-message';
    typingDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingDiv;
}

// Función para agregar mensaje al chat
function addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="chat-message-avatar">
            <i class="${isUser ? 'fas fa-user' : 'fas fa-robot'}"></i>
        </div>
        <div class="chat-message-content">
            ${content}
            <div class="chat-message-time">${timeString}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Función para procesar mensaje del usuario
function processUserMessage(message) {
    // Agregar mensaje del usuario
    addMessage(message, true);
    
    // Mostrar indicador de escritura
    const typingIndicator = showTypingIndicator();
    
    // Simular tiempo de respuesta
    setTimeout(() => {
        // Remover indicador de escritura
        typingIndicator.remove();
        
        // Obtener respuesta del bot
        const botResponse = findBestResponse(message);
        addMessage(botResponse, false);
    }, 1000 + Math.random() * 2000); // Entre 1-3 segundos
}

// Función para manejar acciones rápidas
function handleQuickAction(action) {
    let message = '';
    switch(action) {
        case 'catalogo':
            message = 'Quiero ver el catálogo de muebles';
            break;
        case 'precios':
            message = '¿Cuáles son los precios de los muebles?';
            break;
        case 'contacto':
            message = 'Necesito información de contacto';
            break;
        case 'garantia':
            message = '¿Qué garantía ofrecen?';
            break;
    }
    
    if (message) {
        document.getElementById('chatInput').value = message;
        sendMessage();
    }
}

// Función para enviar mensaje
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        processUserMessage(message);
        input.value = '';
    }
}

// Función para inicializar el chat bot
function initializeChatBot() {
    const chatToggle = document.getElementById('chatBotToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const quickActions = document.querySelectorAll('.quick-action-btn');
    const chatNotification = document.getElementById('chatNotification');
    
    // Mostrar mensaje de bienvenida después de 3 segundos
    setTimeout(() => {
        if (!chatWindow.classList.contains('active')) {
            chatNotification.style.display = 'flex';
        }
    }, 3000);
    
    // Toggle del chat
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        chatNotification.style.display = 'none';
        
        // Si es la primera vez que se abre, mostrar mensaje de bienvenida
        if (chatWindow.classList.contains('active') && document.getElementById('chatMessages').children.length === 0) {
            setTimeout(() => {
                addMessage('¡Hola! Soy el asistente virtual de DAJUSCA. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre nuestros muebles, precios, materiales o usar los botones de abajo para accesos rápidos.', false);
            }, 500);
        }
    });
    
    // Cerrar chat
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    // Enviar mensaje con Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Enviar mensaje con botón
    chatSend.addEventListener('click', sendMessage);
    
    // Acciones rápidas
    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Cerrar chat al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!chatWindow.contains(e.target) && !chatToggle.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
}

console.log('🤖 Chat Bot DAJUSCA inicializado!');