import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { FileUpload, FileuploadService } from '@app/shared/services/fileupload.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-gallery',
  templateUrl: './add-edit-gallery.component.html',
  styleUrls: ['./add-edit-gallery.component.css']
})
export class AddEditGalleryComponent implements OnInit {
  galleryForm: FormGroup;
  gallery_id: null;
  galleryData: any
  config: any;
  author: any

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;

  @ViewChild('myckeditor') myckeditor: any;
  downloadURL: any;
  isUploading: boolean = false;
  showModal: any;
  isUploaded: boolean;
  selectedFilesGallery: any;
  selectedImages: any = [];
  gallerycurrentFileUpload: FileUpload;
  galleryimagePaths =[]
  urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
  shouldUndoAction: boolean;
  copyGalleryImagesPaths: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
    private storage: AngularFireStorage,
    private localStorageService: LocalStorageService,
  ) {
    this.config = Object.assign({}, { containerClass: "theme-dark-blue" });

  }

  async ngOnInit(): Promise<void> {
    this.creategalleryForm()
    this.author = await this.localStorageService.getDataFromIndexedDB("userData")
    this.galleryForm.patchValue({
      uuid: this.author.uuid,
      author: this.author.email
    })
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.gallery_id = data.id
        this.getGallery(this.gallery_id)
      }

    })

    this.config.extraPlugins = 'colorbutton , justify'

  }

  creategalleryForm() {
    this.galleryForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      body: [""],
      addUrl: [null,Validators.pattern(this.urlPattern)],
      date: [new Date()],
      author: [this.author?.email],
      eventDate: [new Date()],
      isPublic: [false],
      uuid: [this.author?.uuid]
    });
  }

  deleteImage(img){
    this.copyGalleryImagesPaths =JSON.parse(JSON.stringify(this.galleryimagePaths ));
    this.shouldUndoAction =true
    this.galleryimagePaths.splice(this.galleryimagePaths.indexOf(img), 1);
    this.toastService.success("Image removed Successfully","Success")
  }

  restoreImages(){
    this.shouldUndoAction =false
    this.galleryimagePaths = JSON.parse(JSON.stringify(this.copyGalleryImagesPaths ));
  }
  deleteAllImg(){
    this.copyGalleryImagesPaths =JSON.parse(JSON.stringify(this.galleryimagePaths ));
    this.shouldUndoAction =true
    this.galleryimagePaths=[]
  }

  getGallery(gallery_id) {
    this.crudService.startLoader()
    this.crudService.getSingle(gallery_id, "gallery").then(data => {
      this.crudService.stopLoader()
      if (data.data()) {
        this.galleryData = data.data()
        this.galleryData.id = data?.id
        this.setgalleryFormValues(this.galleryData)

      }
      else {
        this.toastService.error("Error Fetching Gallery", "Error")
      }



    }, e => {
      this.toastService.error("Error Fetching Gallery", "Error")
      this.crudService.stopLoader()
    })
  }

  setgalleryFormValues(galleryData) {
    if (this.author.role == "admin" || (this.author.role == "user" && this.author.uuid == galleryData.uuid)) {
      this.galleryForm.patchValue({
        title: galleryData?.title,
        body: galleryData?.body,
        date: galleryData?.date,
        author: galleryData?.author,
        imgUrl:galleryData.imgUrl,
        isPublic: galleryData.isPublic ? galleryData.isPublic : false,
        uuid: galleryData?.uuid
      })
      this.galleryimagePaths = galleryData.imgUrl
      this.copyGalleryImagesPaths =JSON.parse(JSON.stringify(this.galleryimagePaths));
    }

    else {
      this.toastService.error("You dont have permission to access the document", "Permission Error")
    }

  }


  addUrl(){
    this.galleryForm.value
   this.galleryimagePaths.push(this.galleryForm.value.addUrl)
   this.copyGalleryImagesPaths =JSON.parse(JSON.stringify(this.galleryimagePaths ));
   this.galleryForm.patchValue({
     addUrl:null
   })
   
  }

  async submitForm() {
    let body = this.galleryForm.value.body

    let galleryObject = {
      title: this.galleryForm.value.title,
      body: this.galleryForm.value.body,
      author: this.galleryForm.value.author,
      eventDate:this.galleryForm.value.eventDate,
      date: this.galleryForm.value.date,
      isPublic: this.galleryForm.value.isPublic,
      imgUrl: this.galleryimagePaths,
      uuid: this.galleryForm.value.uuid
    }
    if (this.gallery_id) {
      this.updateGallery(galleryObject)
    }
    else {
      this.creategallery(galleryObject)
    }
  }

  async creategallery(galleryObject) {
    this.crudService.startLoader()
    this.crudService.create(galleryObject, "gallery").then(data => {
      this.router.navigateByUrl("/admin/gallery-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Error Creating gallery", "Error")
    })
  }

  updateGallery(galleryObject) {
    this.crudService.startLoader()
    this.crudService.update(galleryObject, "gallery", this.gallery_id).then(data => {
      this.router.navigateByUrl("/admin/gallery-list")

    }, e => {
      this.toastService.error("Error Updating gallery", "Error")
      this.crudService.stopLoader()
    })
  }

  get f() {
    return this.galleryForm.controls;
  }

  goBack() {

    if (this.isUploading) {
      history.pushState(null, null, location.href);
      this.showModal = true
    }
    else {
      this.router.navigateByUrl("/admin/gallery-list")
    }
  }

  goBackTogallery() {
    this.router.navigateByUrl("/admin/gallery-list")
  }

  selectFiles(event) {
   
    this.selectedFilesGallery = event.target.files
    this.selectedImages =[]
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedImages.push(event.target.files[i]);
    }
   
  }

  uploadMutlipleFiles() {
    this.isUploading = true
    this.percentage = 0
    let imagePaths = []

    this.selectedImages.map(async img => {

      this.gallerycurrentFileUpload = new FileUpload(img);
      const filePath = `gallery/`+img.name;
      const fileRef = this.storage.ref(filePath);
      
      const task = this.storage.upload(filePath, img);
      this.percentage = await task.percentageChanges().toPromise();
      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            const singleImgPath = await fileRef.getDownloadURL().toPromise();
            this.galleryimagePaths.push(singleImgPath);
            this.copyGalleryImagesPaths =JSON.parse(JSON.stringify(this.galleryimagePaths ));
            imagePaths.push(singleImgPath)
            if (imagePaths.length == this.selectedImages.length) {

              console.log("gall",this.galleryimagePaths)
              this.toastService.success("File Uploaded Successfully", "Success")
            }
          })
        ).subscribe(url => {
          if (url) {
            this.selectedFiles = null;
            
          }
        },
          e => {
            this.toastService.error(e, "Error")
          });
 
    })
  }

  selectFile(event): void {
    this.isUploading = true
    this.percentage = 0
    this.selectedFiles = event.target.files;
    const file = event.target.files[0];
    this.currentFileUpload = new FileUpload(file);
    const filePath = `gallery`+file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            this.addUrlToEditor(this.fb)
            task.percentageChanges().subscribe(percentage => {
              this.isUploading = false
              this.percentage = Math.round(percentage);
              this.percentage = percentage
            }, e => {
              this.toastService.error(e, "Error")
              this.isUploading = false
            })
          });
        })
      )
      .subscribe(url => {
        if (url) {
          this.selectedFiles = null;
          event.target.value = "";
        }
      },
        e => {
          this.toastService.error(e, "Error")
        });
  }


  addUrlToEditor(url) {
    if (url) {
      var style = " <img src='" + url + "'  style='max-width: 100%;' class='img-responsive'>";

      let innerHtml = this.galleryForm.value.body
      this.myckeditor.instance.insertHtml(style)
      this.galleryForm.patchValue({ 'body': innerHtml });
    }
  }

  hideModal() {
    this.isUploading = false
    this.showModal = false
  }

}

