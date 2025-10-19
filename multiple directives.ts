// src/app/shared/directives/disabled-if-no-permission.directive.ts
import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy } from ‘@angular/core’;
import { AuthService } from ‘../../core/services/auth.service’;
import { Subject, takeUntil } from ‘rxjs’;

/**

- Directive pour désactiver un élément si l’utilisateur n’a pas la permission requise
- 
- Usage:
- <button [appDisabledIfNoPermission]=”‘product.update’”>Modifier</button>
- <button [appDisabledIfNoRole]=”[‘admin’, ‘manager’]”>Gérer</button>
  */

@Directive({
selector: ‘[appDisabledIfNoPermission]’,
standalone: true
})
export class DisabledIfNoPermissionDirective implements OnInit, OnDestroy {
@Input() appDisabledIfNoPermission: string = ‘’;
@Input() disabledMessage?: string;

private destroy$ = new Subject<void>();

constructor(
private el: ElementRef,
private renderer: Renderer2,
private authService: AuthService
) {}

ngOnInit(): void {
this.authService.currentUser$
.pipe(takeUntil(this.destroy$))
.subscribe(() => {
this.updateState();
});
}

private updateState(): void {
const hasPermission = this.authService.hasPermission(this.appDisabledIfNoPermission);

```
if (!hasPermission) {
  // Désactiver l'élément
  this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  this.renderer.addClass(this.el.nativeElement, 'disabled-no-permission');
  
  // Ajouter un titre (tooltip) personnalisé ou par défaut
  const message = this.disabledMessage || 'Vous n\'avez pas la permission requise';
  this.renderer.setAttribute(this.el.nativeElement, 'title', message);
  
  // Empêcher les clics
  this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
  this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
  this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
} else {
  // Activer l'élément
  this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
  this.renderer.removeClass(this.el.nativeElement, 'disabled-no-permission');
  this.renderer.removeAttribute(this.el.nativeElement, 'title');
  this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
  this.renderer.removeStyle(this.el.nativeElement, 'opacity');
  this.renderer.removeStyle(this.el.nativeElement, 'cursor');
}
```

}

ngOnDestroy(): void {
this.destroy$.next();
this.destroy$.complete();
}
}

@Directive({
selector: ‘[appDisabledIfNoRole]’,
standalone: true
})
export class DisabledIfNoRoleDirective implements OnInit, OnDestroy {
@Input() appDisabledIfNoRole: string[] = [];
@Input() disabledMessage?: string;

private destroy$ = new Subject<void>();

constructor(
private el: ElementRef,
private renderer: Renderer2,
private authService: AuthService
) {}

ngOnInit(): void {
this.authService.currentUser$
.pipe(takeUntil(this.destroy$))
.subscribe(() => {
this.updateState();
});
}

private updateState(): void {
const hasRole = this.authService.hasRole(this.appDisabledIfNoRole);

```
if (!hasRole) {
  // Désactiver l'élément
  this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  this.renderer.addClass(this.el.nativeElement, 'disabled-no-role');
  
  // Ajouter un titre (tooltip)
  const message = this.disabledMessage || `Rôle requis: ${this.appDisabledIfNoRole.join(' ou ')}`;
  this.renderer.setAttribute(this.el.nativeElement, 'title', message);
  
  // Styles de désactivation
  this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
  this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
  this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
} else {
  // Activer l'élément
  this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
  this.renderer.removeClass(this.el.nativeElement, 'disabled-no-role');
  this.renderer.removeAttribute(this.el.nativeElement, 'title');
  this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
  this.renderer.removeStyle(this.el.nativeElement, 'opacity');
  this.renderer.removeStyle(this.el.nativeElement, 'cursor');
}
```

}

ngOnDestroy(): void {
this.destroy$.next();
this.destroy$.complete();
}
}

/**

- Directive combinée pour désactiver selon le rôle OU la permission
- Plus flexible pour des cas complexes
  */
  @Directive({
  selector: ‘[appDisabledIfUnauthorized]’,
  standalone: true
  })
  export class DisabledIfUnauthorizedDirective implements OnInit, OnDestroy {
  @Input() requiredRoles?: string[];
  @Input() requiredPermission?: string;
  @Input() disabledMessage?: string;
  @Input() requireAll: boolean = false; // true = AND, false = OR

private destroy$ = new Subject<void>();

constructor(
private el: ElementRef,
private renderer: Renderer2,
private authService: AuthService
) {}

ngOnInit(): void {
this.authService.currentUser$
.pipe(takeUntil(this.destroy$))
.subscribe(() => {
this.updateState();
});
}

private updateState(): void {
let isAuthorized = false;

```
if (this.requireAll) {
  // Mode AND : doit avoir le rôle ET la permission
  const hasRole = this.requiredRoles ? this.authService.hasRole(this.requiredRoles) : true;
  const hasPermission = this.requiredPermission ? this.authService.hasPermission(this.requiredPermission) : true;
  isAuthorized = hasRole && hasPermission;
} else {
  // Mode OR : doit avoir le rôle OU la permission
  const hasRole = this.requiredRoles ? this.authService.hasRole(this.requiredRoles) : false;
  const hasPermission = this.requiredPermission ? this.authService.hasPermission(this.requiredPermission) : false;
  isAuthorized = hasRole || hasPermission;
}

if (!isAuthorized) {
  this.disableElement();
} else {
  this.enableElement();
}
```

}

private disableElement(): void {
this.renderer.setAttribute(this.el.nativeElement, ‘disabled’, ‘true’);
this.renderer.addClass(this.el.nativeElement, ‘disabled-unauthorized’);

```
const message = this.disabledMessage || 'Accès non autorisé';
this.renderer.setAttribute(this.el.nativeElement, 'title', message);

this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
```

}

private enableElement(): void {
this.renderer.removeAttribute(this.el.nativeElement, ‘disabled’);
this.renderer.removeClass(this.el.nativeElement, ‘disabled-unauthorized’);
this.renderer.removeAttribute(this.el.nativeElement, ‘title’);
this.renderer.removeStyle(this.el.nativeElement, ‘pointer-events’);
this.renderer.removeStyle(this.el.nativeElement, ‘opacity’);
this.renderer.removeStyle(this.el.nativeElement, ‘cursor’);
}

ngOnDestroy(): void {
this.destroy$.next();
this.destroy$.complete();
}
}

/**

- Directive pour désactiver uniquement si l’utilisateur n’est pas connecté
  */
  @Directive({
  selector: ‘[appDisabledIfNotAuthenticated]’,
  standalone: true
  })
  export class DisabledIfNotAuthenticatedDirective implements OnInit, OnDestroy {
  @Input() disabledMessage?: string;

private destroy$ = new Subject<void>();

constructor(
private el: ElementRef,
private renderer: Renderer2,
private authService: AuthService
) {}

ngOnInit(): void {
this.authService.currentUser$
.pipe(takeUntil(this.destroy$))
.subscribe(() => {
this.updateState();
});
}

private updateState(): void {
const isAuthenticated = this.authService.isAuthenticated();

```
if (!isAuthenticated) {
  this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  this.renderer.addClass(this.el.nativeElement, 'disabled-not-authenticated');
  
  const message = this.disabledMessage || 'Vous devez être connecté';
  this.renderer.setAttribute(this.el.nativeElement, 'title', message);
  
  this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
  this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
  this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
} else {
  this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
  this.renderer.removeClass(this.el.nativeElement, 'disabled-not-authenticated');
  this.renderer.removeAttribute(this.el.nativeElement, 'title');
  this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
  this.renderer.removeStyle(this.el.nativeElement, 'opacity');
  this.renderer.removeStyle(this.el.nativeElement, 'cursor');
}
```

}

ngOnDestroy(): void {
this.destroy$.next();
this.destroy$.complete();
}
}