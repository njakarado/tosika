// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from ‘@angular/common/http’;
import { inject } from ‘@angular/core’;
import { AuthService } from ‘../services/auth.service’;
import { catchError, throwError } from ‘rxjs’;
import { Router } from ‘@angular/router’;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
const authService = inject(AuthService);
const router = inject(Router);
const token = authService.getToken();

// Cloner la requête et ajouter le token si disponible
let authReq = req;
if (token) {
authReq = req.clone({
setHeaders: {
Authorization: `Bearer ${token}`
}
});
}

return next(authReq).pipe(
catchError((error) => {
// Gérer les erreurs d’authentification
if (error.status === 401) {
authService.logout();
router.navigate([’/login’]);
}

```
  // Gérer les erreurs d'autorisation
  if (error.status === 403) {
    router.navigate(['/unauthorized']);
  }

  return throwError(() => error);
})
```

);
};