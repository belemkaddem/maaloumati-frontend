import { Routes } from '@angular/router';

import { authGuard } from '../../guards/auth.guard';
import { InformationListComponent } from './information-list/information-list.component';
import { InformationFormComponent } from './information-form/information-form.component';

export const INFORMATION_ROUTES: Routes = [
  {
    path: '',
    component: InformationListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'new',
    component: InformationFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    component: InformationFormComponent,
    canActivate: [authGuard]
  }
];
