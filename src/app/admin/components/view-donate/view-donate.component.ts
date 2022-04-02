import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-donate',
  templateUrl: './view-donate.component.html',
  styleUrls: ['./view-donate.component.css']
})
export class ViewDonateComponent implements OnInit {

  donateSection:any

  constructor(private router:Router,
    private crudService: CrudService, 
    private toastService: ToastrService) { }

  ngOnInit(): void {
    this.getdonateSection()
  }

  async getdonateSection() {
    this.crudService.startLoader()
    this.crudService.getAll("about").subscribe(data => {
       this.donateSection = data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['body'],
          date: e.payload.doc.data()['date'],
        };
      })
  
      this.donateSection = this.donateSection[0]
      this.crudService.stopLoader()
    },e=>{
      this.crudService.stopLoader()
    });
  }

  EditDonate(key){
    if(key){
      this.router.navigateByUrl("/admin/edit-donate/"+key)
    }
  
    else{
      this.router.navigateByUrl("/admin/edit-donate/"+"none")
    }
  }

}


