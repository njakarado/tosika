// src/app/shared/directives/has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from ‘@angular/core’;
import { AuthService } from ‘../../core/services/auth.service’;

@Directive({
selector: ‘[appHasRole]’,
standalone: true
})
export class HasRoleDirective implements OnInit {
@Input() appHasRole: string[] = [];

constructor(
private templateRef: TemplateRef<any>,
private viewContainer: ViewContainerRef,
private authService: AuthService
) {}

ngOnInit(): void {
this.updateView();
}

private updateView(): void {
if (this.authService.hasRole(this.appHasRole)) {
this.viewContainer.createEmbeddedView(this.templateRef);
} else {
this.viewContainer.clear();
}
}
}

// src/app/shared/directives/has-permission.directive.ts
@Directive({
selector: ‘[appHasPermission]’,
standalone: true
})
export class HasPermissionDirective implements OnInit {
@Input() appHasPermission: string = ‘’;

constructor(
private templateRef: TemplateRef<any>,
private viewContainer: ViewContainerRef,
private authService: AuthService
) {}

ngOnInit(): void {
this.updateView();
}

private updateView(): void {
if (this.authService.hasPermission(this.appHasPermission)) {
this.viewContainer.createEmbeddedView(this.templateRef);
} else {
this.viewContainer.clear();
}
}
}