# Boutique Angular 20 avec RBAC

Application e-commerce complète avec système d’authentification et contrôle d’accès basé sur les rôles (RBAC).

## 🎯 Fonctionnalités

### Authentification & Autorisation

- ✅ Connexion/Déconnexion avec JWT
- ✅ Système RBAC avec 3 rôles : **Admin**, **Manager**, **Client**
- ✅ Guards pour protéger les routes
- ✅ Directives pour contrôler l’affichage (HasRole, HasPermission)
- ✅ Intercepteur HTTP pour ajouter le token automatiquement

### Gestion des Produits

- ✅ Liste des produits avec recherche
- ✅ Détails de produit
- ✅ CRUD complet (Admin/Manager uniquement)
- ✅ Gestion du stock
- ✅ Catégorisation

### Panier d’Achat

- ✅ Ajout/Suppression de produits
- ✅ Modification des quantités
- ✅ Calcul du total
- ✅ Sauvegarde dans localStorage

### Interface Utilisateur

- ✅ Design moderne et responsive
- ✅ Navigation dynamique selon le rôle
- ✅ Indicateur de panier
- ✅ Menu utilisateur

## 🏗️ Architecture du Projet

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── services/
│       ├── auth.service.ts
│       ├── product.service.ts
│       └── cart.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── products/
│   │   ├── product-list/
│   │   └── product-detail/
│   ├── cart/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── product-management/
│   │   └── user-management/
│   └── manager/
│       ├── product-editor/
│       └── order-management/
├── shared/
│   ├── components/
│   │   ├── navbar/
│   │   ├── unauthorized/
│   │   └── not-found/
│   └── directives/
│       └── has-role.directive.ts
├── app.config.ts
└── app.routes.ts
```

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Angular CLI 20

### Étapes

1. **Créer le projet**

```bash
ng new boutique-app --routing --style=scss
cd boutique-app
```

1. **Installer les dépendances supplémentaires** (si nécessaire)

```bash
npm install
```

1. **Créer la structure des dossiers**

```bash
# Core
mkdir -p src/app/core/{guards,interceptors,services}

# Features
mkdir -p src/app/features/{auth/login,auth/register,products/product-list,products/product-detail,cart,admin/dashboard,admin/product-management,admin/user-management,manager/product-editor,manager/order-management,profile}

# Shared
mkdir -p src/app/shared/{components/navbar,components/unauthorized,components/not-found,directives}
```

1. **Copier les fichiers fournis** dans les bons dossiers
1. **Configurer app.component.ts**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {}
```

1. **Lancer l’application**

```bash
ng serve
```

Accédez à `http://localhost:4200`

## 🎭 Rôles et Permissions

### 👑 Admin

**Accès complet à toutes les fonctionnalités**

- Tableau de bord administrateur
- Gestion complète des produits (CRUD)
- Gestion des utilisateurs
- Accès à toutes les commandes

**Permissions :**

- `*` (toutes les permissions)

### 👔 Manager

**Gestion des produits et commandes**

- Création et modification de produits
- Consultation du catalogue
- Gestion des commandes

**Permissions :**

- `product.read`
- `product.create`
- `product.update`
- `order.read`
- `order.update`

### 👤 Client

**Navigation et achat**

- Consultation du catalogue
- Ajout au panier
- Passage de commande
- Consultation de ses propres commandes

**Permissions :**

- `product.read`
- `order.create`
- `order.read.own`

## 🔐 Utilisation du RBAC

### Dans les Routes

```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'] },
  component: AdminComponent
}
```

### Dans les Templates

```html
<!-- Afficher uniquement pour Admin -->
<button *appHasRole="['admin']">Supprimer</button>

<!-- Afficher pour Admin et Manager -->
<div *appHasRole="['admin', 'manager']">
  Gestion des produits
</div>

<!-- Vérifier une permission spécifique -->
<button *appHasPermission="'product.update'">Modifier</button>
```

### Dans les Services

```typescript
constructor(private authService: AuthService) {}

canEditProduct(): boolean {
  return this.authService.hasPermission('product.update');
}

isAdmin(): boolean {
  return this.authService.hasRole(['admin']);
}
```

## 🔌 API Backend

L’application attend un backend REST avec les endpoints suivants :

### Authentification

- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription

### Produits

- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d’un produit
- `POST /api/products` - Créer un produit (Admin/Manager)
- `PUT /api/products/:id` - Modifier un produit (Admin/Manager)
- `DELETE /api/products/:id` - Supprimer un produit (Admin)
- `GET /api/products/search?q=...` - Rechercher des produits

### Format de réponse attendu

**Login:**

```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@shop.com",
  "role": "admin",
  "token": "eyJhbGc..."
}
```

**Produits:**

```json
[
  {
    "id": 1,
    "name": "Produit 1",
    "description": "Description...",
    "price": 29.99,
    "category": "Électronique",
    "imageUrl": "https://...",
    "stock": 50,
    "active": true
  }
]
```

## 🧪 Tests de Développement

Pour tester sans backend, vous pouvez utiliser json-server :

```bash
# Installer json-server
npm install -g json-server

# Créer db.json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@shop.com",
      "password": "admin123",
      "role": "admin"
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "Ordinateur Portable",
      "description": "Ordinateur performant",
      "price": 999.99,
      "category": "Électronique",
      "imageUrl": "https://via.placeholder.com/300",
      "stock": 15,
      "active": true
    }
  ]
}

# Lancer le serveur
json-server --watch db.json --port 3000
```

## 📦 Composants Clés

### AuthService

Gère l’authentification, les rôles et les permissions.

### Guards

- `authGuard` : Vérifie si l’utilisateur est connecté
- `roleGuard` : Vérifie si l’utilisateur a le bon rôle
- `permissionGuard` : Vérifie si l’utilisateur a la permission requise

### Directives

- `*appHasRole` : Affiche l’élément selon le rôle
- `*appHasPermission` : Affiche l’élément selon la permission

## 🎨 Personnalisation

### Changer les couleurs

Modifiez les gradients dans les styles :

```scss
background: linear-gradient(135deg, #votre-couleur1 0%, #votre-couleur2 100%);
```

### Ajouter un nouveau rôle

1. Modifier le type dans `auth.service.ts`:

```typescript
role: 'admin' | 'manager' | 'client' | 'nouveau-role';
```

1. Ajouter les permissions:

```typescript
const permissions: Record<string, string[]> = {
  'nouveau-role': ['permission1', 'permission2']
};
```

1. Créer les routes protégées

## 🚨 Sécurité

⚠️ **Important :**

- Les tokens JWT doivent être stockés de manière sécurisée
- Validez toujours les autorisations côté serveur
- Le RBAC frontend est pour l’UX, la vraie sécurité est côté backend
- Utilisez HTTPS en production
- Implé