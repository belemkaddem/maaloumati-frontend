import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/information', pathMatch: 'full' },
  {
    path: 'information',
    loadChildren: () => import('./components/information/information.routes').then(m => m.INFORMATION_ROUTES),
    canActivate: [authGuard]
  }
];
