import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { LocalStorageService } from './services/local-storage.service';
import { FooterComponent } from './components/footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { EncrDecrService } from './services/EncrDecrService.service';




@NgModule({
  declarations: [
    FooterComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule
  ],
  exports: [
    
    FooterComponent,
    NgxSpinnerModule,
  ],
  providers: [
    LocalStorageService,
    EncrDecrService
  ],
})
export class SharedModule { }
