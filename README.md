# Sistema de Comentarios y Reacciones

## Descripción
API GraphQL desarrollada con Node.js, TypeScript y MongoDB que implementa un sistema de gestión de usuarios, comentarios y reacciones.

## Características
- 👥 Gestión de usuarios con roles (superadmin, usuario regular)
- 💬 Sistema de comentarios con respuestas anidadas
- 👍 Sistema de reacciones a comentarios
- 🔐 Autenticación JWT
- 🛡️ Control de acceso basado en roles

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## Instalación

1. Clonar el repositorio:


## Control de Acceso

### Roles de Usuario
- **Superadmin**
  - Crear, modificar y eliminar usuarios
  - Acceso total al sistema
- **Usuario Regular**
  - Crear y gestionar sus propios comentarios
  - Agregar/eliminar reacciones
  - Ver información básica de otros usuarios

## Seguridad
- Autenticación mediante JWT
- Passwords hasheados con bcrypt
- Validación de entrada en todas las operaciones
- Control de acceso basado en roles

## Manejo de Errores
El sistema implementa manejo de errores personalizado para:
- Errores de autenticación
- Errores de autorización
- Errores de validación
- Errores de base de datos
