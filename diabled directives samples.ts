// src/app/features/examples/disabled-directives-examples.component.ts
import { Component } from ‘@angular/core’;
import { CommonModule } from ‘@angular/common’;
import {
DisabledIfNoPermissionDirective,
DisabledIfNoRoleDirective,
DisabledIfUnauthorizedDirective,
DisabledIfNotAuthenticatedDirective
} from ‘../../shared/directives/disabled-if-no-permission.directive’;

@Component({
selector: ‘app-disabled-examples’,
standalone: true,
imports: [
CommonModule,
DisabledIfNoPermissionDirective,
DisabledIfNoRoleDirective,
DisabledIfUnauthorizedDirective,
DisabledIfNotAuthenticatedDirective
],
template: `
<div class="examples-container">
<h1>Exemples de Directives Disabled avec RBAC</h1>

```
  <!-- Exemple 1: Désactiver selon la permission -->
  <section class="example-section">
    <h2>1. Désactiver selon la Permission</h2>
    <p>Ce bouton est désactivé si l'utilisateur n'a pas la permission 'product.update'</p>
    
    <button 
      class="btn btn-primary"
      [appDisabledIfNoPermission]="'product.update'"
    >
      Modifier le produit
    </button>

    <button 
      class="btn btn-danger"
      [appDisabledIfNoPermission]="'product.delete'"
      [disabledMessage]="'Seuls les administrateurs peuvent supprimer'"
    >
      Supprimer le produit
    </button>
  </section>

  <!-- Exemple 2: Désactiver selon le rôle -->
  <section class="example-section">
    <h2>2. Désactiver selon le Rôle</h2>
    <p>Ces boutons sont désactivés si l'utilisateur n'a pas le bon rôle</p>
    
    <button 
      class="btn btn-warning"
      [appDisabledIfNoRole]="['admin']"
    >
      Accès Admin uniquement
    </button>

    <button 
      class="btn btn-info"
      [appDisabledIfNoRole]="['admin', 'manager']"
      [disabledMessage]="'Réservé aux gestionnaires'"
    >
      Gestion des stocks
    </button>
  </section>

  <!-- Exemple 3: Désactiver avec conditions combinées -->
  <section class="example-section">
    <h2>3. Conditions Combinées (OR)</h2>
    <p>Désactivé si l'utilisateur n'a NI le rôle NI la permission</p>
    
    <button 
      class="btn btn-success"
      [appDisabledIfUnauthorized]
      [requiredRoles]="['admin', 'manager']"
      [requiredPermission]="'product.create'"
      [requireAll]="false"
    >
      Créer un produit (Admin OU Manager OU Permission)
    </button>
  </section>

  <!-- Exemple 4: Désactiver avec conditions combinées (AND) -->
  <section class="example-section">
    <h2>4. Conditions Combinées (AND)</h2>
    <p>Désactivé si l'utilisateur n'a pas TOUS les critères requis</p>
    
    <button 
      class="btn btn-dark"
      [appDisabledIfUnauthorized]
      [requiredRoles]="['admin']"
      [requiredPermission]="'user.delete'"
      [requireAll]="true"
      [disabledMessage]="'Nécessite le rôle Admin ET la permission user.delete'"
    >
      Supprimer un utilisateur (Admin ET Permission)
    </button>
  </section>

  <!-- Exemple 5: Désactiver si non connecté -->
  <section class="example-section">
    <h2>5. Désactiver si Non Connecté</h2>
    <p>Ces éléments sont désactivés pour les utilisateurs non authentifiés</p>
    
    <button 
      class="btn btn-primary"
      appDisabledIfNotAuthenticated
    >
      Ajouter au panier
    </button>

    <button 
      class="btn btn-secondary"
      appDisabledIfNotAuthenticated
      [disabledMessage]="'Connectez-vous pour accéder à cette fonctionnalité'"
    >
      Mes commandes
    </button>
  </section>

  <!-- Exemple 6: Sur d'autres éléments (input, select, etc.) -->
  <section class="example-section">
    <h2>6. Autres Éléments HTML</h2>
    <p>Les directives fonctionnent aussi sur input, select, textarea, etc.</p>
    
    <div class="form-group">
      <label>Prix du produit (Admin/Manager uniquement)</label>
      <input 
        type="number" 
        class="form-control"
        [appDisabledIfNoRole]="['admin', 'manager']"
        placeholder="Entrer le prix"
      >
    </div>

    <div class="form-group">
      <label>Catégorie (Permission requise)</label>
      <select 
        class="form-control"
        [appDisabledIfNoPermission]="'product.update'"
      >
        <option>Électronique</option>
        <option>Vêtements</option>
        <option>Maison</option>
      </select>
    </div>

    <div class="form-group">
      <label>Description (Connecté uniquement)</label>
      <textarea 
        class="form-control"
        appDisabledIfNotAuthenticated
        rows="3"
        placeholder="Entrer la description"
      ></textarea>
    </div>
  </section>

  <!-- Exemple 7: Sur des liens -->
  <section class="example-section">
    <h2>7. Sur des Liens</h2>
    
    <a 
      href="/admin/dashboard" 
      class="btn btn-link"
      [appDisabledIfNoRole]="['admin']"
    >
      Tableau de bord Admin
    </a>

    <a 
      href="/products/new" 
      class="btn btn-link"
      [appDisabledIfNoPermission]="'product.create'"
    >
      Créer un nouveau produit
    </a>
  </section>

  <!-- Exemple 8: Avec des icônes -->
  <section class="example-section">
    <h2>8. Boutons avec Icônes</h2>
    
    <button 
      class="btn btn-icon btn-edit"
      [appDisabledIfNoPermission]="'product.update'"
      title="Modifier"
    >
      ✏️
    </button>

    <button 
      class="btn btn-icon btn-delete"
      [appDisabledIfNoRole]="['admin']"
      title="Supprimer"
    >
      🗑️
    </button>

    <button 
      class="btn btn-icon btn-settings"
      [appDisabledIfUnauthorized]
      [requiredRoles]="['admin', 'manager']"
      title="Paramètres"
    >
      ⚙️
    </button>
  </section>

  <!-- Exemple 9: Dans un tableau -->
  <section class="example-section">
    <h2>9. Dans un Tableau d'Actions</h2>
    
    <table class="table">
      <thead>
        <tr>
          <th>Produit</th>
          <th>Prix</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Laptop Pro</td>
          <td>999€</td>
          <td>
            <button 
              class="btn btn-sm btn-primary"
              [appDisabledIfNoPermission]="'product.update'"
            >
              Modifier
            </button>
            <button 
              class="btn btn-sm btn-danger"
              [appDisabledIfNoRole]="['admin']"
            >
              Supprimer
            </button>
          </td>
        </tr>
        <tr>
          <td>Smartphone X</td>
          <td>599€</td>
          <td>
            <button 
              class="btn btn-sm btn-primary"
              [appDisabledIfNoPermission]="'product.update'"
            >
              Modifier
            </button>
            <button 
              class="btn btn-sm btn-danger"
              [appDisabledIfNoRole]="['admin']"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Exemple 10: Boutons groupés -->
  <section class="example-section">
    <h2>10. Groupe de Boutons</h2>
    
    <div class="btn-group">
      <button 
        class="btn btn-outline-primary"
        appDisabledIfNotAuthenticated
      >
        Voir
      </button>
      <button 
        class="btn btn-outline-warning"
        [appDisabledIfNoPermission]="'product.update'"
      >
        Modifier
      </button>
      <button 
        class="btn btn-outline-danger"
        [appDisabledIfNoRole]="['admin']"
      >
        Supprimer
      </button>
    </div>
  </section>

  <!-- Info sur l'utilisateur actuel -->
  <section class="info-section">
    <h3>💡 Info</h3>
    <p>Les boutons sont automatiquement désactivés selon vos permissions.</p>
    <p>Passez la souris sur un bouton désactivé pour voir le message.</p>
    <p><strong>Changez de compte pour tester les différents comportements !</strong></p>
  </section>
</div>
```

`, styles: [`
.examples-container {
max-width: 1200px;
margin: 0 auto;
padding: 2rem;
}

```
h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.example-section {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.example-section h2 {
  font-size: 1.5rem;
  color: #1976d2;
  margin-bottom: 1rem;
}

.example-section p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
  margin: 0.5rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary { background: #1976d2; color: white; }
.btn-secondary { background: #757575; color: white; }
.btn-success { background: #388e3c; color: white; }
.btn-danger { background: #d32f2f; color: white; }
.btn-warning { background: #f57c00; color: white; }
.btn-info { background: #0288d1; color: white; }
.btn-dark { background: #424242; color: white; }
.btn-link { 
  background: transparent; 
  color: #1976d2; 
  text-decoration: underline;
}

.btn-outline-primary {
  background: transparent;
  color: #1976d2;
  border: 2px solid #1976d2;
}

.btn-outline-warning {
  background: transparent;
  color: #f57c00;
  border: 2px solid #f57c00;
}

.btn-outline-danger {
  background: transparent;
  color: #d32f2f;
  border: 2px solid #d32f2f;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-icon {
  width: 45px;
  height: 45px;
  padding: 0;
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-edit { background: #f57c00; }
.btn-delete { background: #d32f2f; }
.btn-settings { background: #757575; }

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #1976d2;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.table th {
  background: #f5f5f5;
  font-weight: 600;
  color: #555;
}

.table tbody tr:hover {
  background: #fafafa;
}

.btn-group {
  display: inline-flex;
  gap: 0;
}

.btn-group .btn {
  margin: 0;
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.btn-group .btn:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.info-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.info-section h3 {
  margin-top: 0;
  font-size: 1.5rem;
}

.info-section p {
  margin: 0.5rem 0;
  color: white;
}

/* Styles pour les éléments désactivés */
:global(.disabled-no-permission),
:global(.disabled-no-role),
:global(.disabled-unauthorized),
:global(.disabled-not-authenticated) {
  position: relative;
}
```

`]
})
export class DisabledDirectivesExamplesComponent {}