import { Routes } from '@angular/router';
import { ApartmentComponent } from './components/apartment/apartment.component';
import { ApartmentListComponent } from './components/apartment-list/apartment-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [ { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'apartments', component: ApartmentListComponent, canActivate: [AuthGuard] },
    { path: 'post-apartment', component: ApartmentComponent, canActivate: [AuthGuard] }
];
