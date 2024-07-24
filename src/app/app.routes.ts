import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { roleGuard } from './guards/role.guards';
import { loginGuard } from './guards/login.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./shared/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./business/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'carreras',
        loadComponent: () => import('./business/carreras/carreras.component').then(m => m.CarrerasComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'facultades',
        loadComponent: () => import('./business/faculties/faculties.component').then(m => m.FacultiesComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'materias',
        loadComponent: () => import('./business/materias/materias.component').then(m => m.MateriasComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'aulas',
        loadComponent: () => import('./business/aulas/aulas.component').then(m => m.AulasComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./business/departamento/departamento.component').then(m => m.DepartamentoComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'docentes',
        loadComponent: () => import('./business/docente/docente.component').then(m => m.DocenteComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'sesionesclase',
        loadComponent: () => import('./business/sesion-clase/sesion-clase.component').then(m => m.SesionClaseComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'programacionesacademicas',
        loadComponent: () => import('./business/programacion-academica/programacion-academica.component').then(m => m.ProgramacionAcademicaComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'estadosasistencia',
        loadComponent: () => import('./business/estado-asistencia/estado-asistencia.component').then(m => m.EstadoAsistenciaComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'asistencias',
        loadComponent: () => import('./business/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'licencias',
        loadComponent: () => import('./business/licencia/licencia.component').then(m => m.LicenciaComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'reportes',
        loadComponent: () => import('./business/reportes/reportes.component').then(m => m.ReporteComponent),
        canActivate: [roleGuard],
        data: { expectedRole: 'ADMIN' }
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
