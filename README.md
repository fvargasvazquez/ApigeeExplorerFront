# Apigee Explorer V2

Esta es la versión mejorada de Apigee Explorer con una arquitectura más organizada y modular.

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes organizados por funcionalidad
│   │   ├── environment-selector/
│   │   ├── search/
│   │   └── details/         # Componentes de detalles separados
│   │       ├── target-server-details/
│   │       ├── api-proxy-details/
│   │       ├── app-details/
│   │       ├── developer-details/
│   │       ├── product-details/
│   │       ├── keystore-details/
│   │       ├── reference-details/
│   │       └── default-details/
│   ├── models/              # Modelos e interfaces
│   │   ├── search-result.model.ts
│   │   ├── component-type.model.ts
│   │   ├── environment.model.ts
│   │   └── index.ts
│   ├── services/            # Servicios
│   │   ├── api.service.ts
│   │   └── index.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.scss              # Estilos globales
├── index.html
└── main.ts
```

## Mejoras Implementadas

### 1. **Separación de Responsabilidades**
- **Componentes**: Cada componente tiene su propio archivo TypeScript, HTML y SCSS
- **Modelos**: Interfaces y tipos separados en archivos dedicados
- **Servicios**: Lógica de negocio separada de la presentación

### 2. **Componentes de Detalles Modulares**
- Cada tipo de componente (TargetServer, ApiProxy, App, etc.) tiene su propio componente de detalles
- Estilos compartidos para consistencia
- Fácil mantenimiento y extensión

### 3. **Modelos Tipados**
- Interfaces bien definidas para todos los datos
- Funciones utilitarias para obtener iconos y nombres de display
- Configuración centralizada de tipos de componentes

### 4. **Arquitectura Escalable**
- Barrel exports para importaciones limpias
- Estructura de carpetas clara y lógica
- Componentes standalone para mejor tree-shaking

### 5. **Estilos Organizados**
- SCSS separado por componente
- Estilos compartidos para componentes de detalles
- Variables CSS personalizadas
- Clases utilitarias globales

## Comandos

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
```

## Características

- ✅ Componentes separados por funcionalidad
- ✅ CSS/SCSS modular
- ✅ Modelos tipados
- ✅ Servicios organizados
- ✅ Arquitectura escalable
- ✅ Responsive design
- ✅ Material Design
- ✅ Lazy loading de rutas