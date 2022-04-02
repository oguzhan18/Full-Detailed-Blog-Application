import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/shared/services/auth-guard.service';

import { AboutComponent } from './components/about/about.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ArticleListingComponent } from './components/article-listing/article-listing.component';
import { BookListingComponent } from './components/book-listing/book-listing.component';
import { DonateComponent } from './components/donate/donate.component';
import { GalleryDetailComponent } from './components/gallery-detail/gallery-detail.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { LiveEventsComponent } from './components/live-events/live-events.component';
import { UserWrappperComponent } from './components/user-wrappper/user-wrappper.component';
import { VideoListingComponent } from './components/video-listing/video-listing.component';


const routes: Routes = [
  {
    path: '',
    component: UserWrappperComponent,
    children: [
      { path: '', redirectTo: 'article-list', pathMatch: 'full' },
      {
        path:"about",
        component:AboutComponent,
        
      },

      {
        path:"donate",
        component:DonateComponent,
      },
      {
        path: 'article-detail/:id',
        component: ArticleDetailComponent,
      //  canActivate:[UserAuthGuard]
      },
      {
        path: 'gallery-detail/:id',
        component: GalleryDetailComponent,
         canActivate:[AuthGuard]
      },

      {
        path: 'article-list',
        component: ArticleListingComponent,
       // canActivate:[UserAuthGuard]
      },
      {
        path: 'gallery-list',
        component: GalleryListComponent,
        canActivate:[AuthGuard]
      },
      {
        path: 'video-list',
        component: VideoListingComponent,
       // canActivate:[UserAuthGuard]
      },

      {
        path: 'book-list',
        component: BookListingComponent,
       // canActivate:[UserAuthGuard]
      },
      {
        path: 'live-shows',
        component: LiveEventsComponent,
       // canActivate:[UserAuthGuard]
      },
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
