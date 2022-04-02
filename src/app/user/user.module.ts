import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ArticleListingComponent } from './components/article-listing/article-listing.component';
import { FormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { HttpClientModule } from '@angular/common/http';
import { UserWrappperComponent } from './components/user-wrappper/user-wrappper.component';
import { SharedModule } from '@app/shared/shared.module';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';
import { VideoListingComponent } from './components/video-listing/video-listing.component';
import { BookListingComponent } from './components/book-listing/book-listing.component';
import { LiveEventsComponent } from './components/live-events/live-events.component';
import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';
import { NumericTextBoxAllModule, TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { AboutComponent } from './components/about/about.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DonateComponent } from './components/donate/donate.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './components/gallery-detail/gallery-detail.component';
import { AuthGuard } from '@app/shared/services/auth-guard.service';



@NgModule({
  declarations: [
    ArticleListingComponent,
    VerifyEmailComponent,
    ForgetPasswordComponent,
    UserWrappperComponent,
    ArticleDetailComponent,
    UserHeaderComponent,
    VideoListingComponent,
    BookListingComponent,
    LiveEventsComponent,
    AboutComponent,
    DonateComponent,
    GalleryListComponent,
    GalleryDetailComponent,
  ],
  imports: [

    CommonModule,
    UserRoutingModule,
    FormsModule,
    HttpClientModule,SharedModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot(), 
    ScheduleAllModule, RecurrenceEditorAllModule, NumericTextBoxAllModule,TextBoxAllModule,DropDownListAllModule,
    MultiSelectAllModule,
    NgxPaginationModule
  ],
  providers:[AuthGuard]
})
export class UserModule { }
