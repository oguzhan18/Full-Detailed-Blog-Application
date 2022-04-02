import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-about',
  templateUrl: './edit-about.component.html',
  styleUrls: ['./edit-about.component.css']
})
export class EditAboutComponent implements OnInit {
  firestoreKey="about"
  aboutForm
  config:any
  about_id: any;
  aboutSection: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute:ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
  ) { 
    this.config = { uiColor: '#f2f2f2' };
  }

  ngOnInit(): void {
    this.config.extraPlugins = 'colorbutton , justify'
    this.createAboutForm()
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id && data.id!=="none") {
        this.about_id = data.id
        this.getAbout(this.about_id)
      }

    }) 
  }


  getAbout(id){
    this.crudService.startLoader()
    this.crudService.getSingle(id, this.firestoreKey).then(data => {
      this.crudService.stopLoader()
      this.aboutSection = data.data()
      this.aboutSection.key = data.id

      this.setAboutForm(this.aboutSection)
    }, e => {
      this.crudService.stopLoader()

      this.toastService.error("HAkkımızda bilgileri gelmiyor", "Error")
    })
  }

  setAboutForm(aboutData){
    this.aboutForm.patchValue({
      title: aboutData?.title,
      body: aboutData?.body,
      date: aboutData?.date,
    })
  }
  createAboutForm(){
    this.aboutForm = this.fb.group({
      id: [""],
      title: ["About Section", Validators.required],
      body: ["This is about author", Validators.required],
      date: [new Date()],
    });
  }

  submitForm() {
    let aboutObject = {
      title: this.aboutForm.value.title,
      date: this.aboutForm.value.date,
      body: this.aboutForm.value.body
    }

    
    if (this.about_id) {
      this.updateAbout(aboutObject)
    }
    else {
      this.createAbout(aboutObject)
    }
  }

  updateAbout(aboutObject){
    this.crudService.startLoader()
    this.crudService.update(aboutObject, this.firestoreKey, this.about_id).then(data => {
      this.router.navigateByUrl("/admin/about")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Hakkımzda güncellenmedi.", "Error")
    })
  }

  createAbout(aboutObject){
    this.crudService.startLoader();
    this.crudService.create(aboutObject, this.firestoreKey).then(result => {
      this.router.navigateByUrl("/admin/about")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Hakkımızda oluşmadı", "Error")
    })
  }
  get f() {
    return this.aboutForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("/admin/book-list")
  }
}
