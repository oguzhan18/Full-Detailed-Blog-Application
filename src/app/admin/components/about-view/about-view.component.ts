import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-about-view',
  templateUrl: './about-view.component.html',
  styleUrls: ['./about-view.component.css']
})
export class AboutViewComponent implements OnInit {
  aboutSection:any

  constructor(private router:Router,
    private crudService: CrudService, 
    private toastService: ToastrService) { }

  ngOnInit(): void {
    this.getAboutSection()
  }

  async getAboutSection() {
    this.crudService.startLoader()
    this.crudService.getAll("about").subscribe(data => {
       this.aboutSection = data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['body'],
          date: e.payload.doc.data()['date'],
        };
      })
  
      this.aboutSection = this.aboutSection[0]
      this.crudService.stopLoader()
    },e=>{
      this.crudService.stopLoader()
    });
  }

  EditAbout(key){
    if(key){
      this.router.navigateByUrl("/admin/edit-about/"+key)
    }
  
    else{
      this.router.navigateByUrl("/admin/edit-about/"+"none")
    }
  }

}
