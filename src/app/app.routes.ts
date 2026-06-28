import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtworkDetailComponent } from './gallery/artwork-detail/artwork-detail.component';
import { ExhibitionComponent } from './exhibition/exhibition.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'artwork/:folder', component: ArtworkDetailComponent },
  { path: 'exhibitions/:id', component: ExhibitionComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  ];