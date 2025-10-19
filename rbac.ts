// src/app/core/services/auth.service.ts
import { Injectable } from ‘@angular/core’;
import { HttpClient } from ‘@angular/common/http’;
import { BehaviorSubject, Observable, tap } from ‘rxjs’;
import { Router } from ‘@angular/router’;

export interface User {
id: number;
username: string;
email: string;
role: ‘admin’ | ‘manager’ | ‘client’;
token?: string;
}

export interface LoginCredentials {
email: string;
password: string;
}

@Injectable({
providedIn: ‘root’
})
export class AuthService {
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

private readonly TOKEN_KEY = ‘auth_token’;
private readonly USER_KEY = ‘current_user’;
private apiUrl = ‘http://localhost:3000/api’; // À adapter

constructor(
private http: HttpClient,
private router: Router
) {
this.loadUserFromStorage();
}

private loadUserFromStorage(): void {
const userStr = localStorage.getItem(this.USER_KEY);
if (userStr) {
try {
const user = JSON.parse(userStr);
this.currentUserSubject.next(user);
} catch (e) {
this.logout();
}
}
}

login(credentials: LoginCredentials): Observable<User> {
return this.http.post<User>(`${this.apiUrl}/auth/login`, credentials).pipe(
tap(user => {
if (user.token) {
localStorage.setItem(this.TOKEN_KEY, user.token);
localStorage.setItem(this.USER_KEY, JSON.stringify(user));
this.currentUserSubject.next(user);
}
})
);
}

register(userData: any): Observable<User> {
return this.http.post<User>(`${this.apiUrl}/auth/register`, userData);
}

logout(): void {
localStorage.removeItem(this.TOKEN_KEY);
localStorage.removeItem(this.USER_KEY);
this.currentUserSubject.next(null);
this.router.navigate([’/login’]);
}

getToken(): string | null {
return localStorage.getItem(this.TOKEN_KEY);
}

getCurrentUser(): User | null {
return this.currentUserSubject.value;
}

isAuthenticated(): boolean {
return !!this.getToken() && !!this.getCurrentUser();
}

hasRole(roles: string[]): boolean {
const user = this.getCurrentUser();
return user ? roles.includes(user.role) : false;
}

hasPermission(permission: string): boolean {
const user = this.getCurrentUser();
if (!user) return false;

```
const permissions: Record<string, string[]> = {
  admin: ['*'], // Tous les droits
  manager: [
    'product.read',
    'product.create',
    'product.update',
    'order.read',
    'order.update'
  ],
  client: [
    'product.read',
    'order.create',
    'order.read.own'
  ]
};

const userPermissions = permissions[user.role] || [];
return userPermissions.includes('*') || userPermissions.includes(permission);
```

}
}