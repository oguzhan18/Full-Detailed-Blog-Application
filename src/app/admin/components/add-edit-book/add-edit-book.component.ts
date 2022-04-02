import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CrudService } from '@app/shared/services/crud.service';
import { FileUpload } from '@app/shared/services/fileupload.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-book',
  templateUrl: './add-edit-book.component.html',
  styleUrls: ['./add-edit-book.component.css']
})
export class AddEditBookComponent implements OnInit {
  @ViewChild('myFileInput') myFileInput;

  
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;
  downloadURL: any;
  
  urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
  author :any
  bookForm: FormGroup;
  book_id: any;
  firestoreKey = "books"
  bookData: any;
  isLoading = false
  showModal: boolean;
  isUploading: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
    private localStorgaeService:LocalStorageService,
    private storage: AngularFireStorage,
    private location: LocationStrategy
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      this.goBack()
  });
  }

  async ngOnInit(): Promise<void> {
    this.createBookForm()
    this.author =  await this.localStorgaeService.getDataFromIndexedDB("userData")
    this.bookForm.patchValue({
      uuid: this.author.uuid,
      author:this.author.email
    })
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.book_id = data.id
        this.getBook(this.book_id)
      }

    })
    
  }

  createBookForm() {
    this.bookForm = this.fb.group({

      title: ["", Validators.required],
      description: [""],
      url: ["", [Validators.required,Validators.pattern(this.urlPattern)]],
      thumbnail: [null],
      date: [new Date()],
      author: [""],
      uuid:[this.author?.uuid]
    });
  }

  getBook(book_id) {
    this.isLoading = true
    this.crudService.startLoader()
    this.crudService.getSingle(book_id, this.firestoreKey).then(data => {
      this.crudService.stopLoader()
      if(data.data()){
     
      this.bookData = data.data()
      this.bookData.key = data.id
      this.isLoading = false
      this.setBookFormValues(this.bookData)
      }
      else{
        this.isLoading = false
      this.toastService.error("Ürün verisi gelmiyor", "Error")
      }
    }, e => {
      this.crudService.stopLoader()
      this.isLoading = false
      this.toastService.error("Ürün verisi gelmiyor", "Error")
    })
  }

  setBookFormValues(bookData) {
    if(this.author.role == "admin" || (this.author.role=="user" && this.author.uuid == bookData.uuid)){
    this.bookForm.patchValue({
      title: bookData?.title,
      description: bookData?.description,
      url: bookData?.url,
      thumbnail: bookData?.thumbnail,
      date: bookData?.date,
      author: bookData.author,
      uuid:bookData?.uuid
    })
  }
  else{
    this.toastService.error("Belgeye erişim izniniz yok", "Permission Error")
  }
  }

  selectFile(event): void {
    this.isUploading = true
    this.percentage = 0
    const file = event.target.files[0];
    this.currentFileUpload = new FileUpload(file);
    const filePath = `books`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`books`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.isUploading = false
              this.fb = url;
            }
            this.addUrlToEditor(url)

            task.percentageChanges().subscribe(percentage => {
              this.percentage = Math.round(percentage);
              this.percentage = percentage
            })
          });
        })
      )
      .subscribe(url => {
        if (url) {
          this.selectedFiles = null;
        }
      });
  }

  addUrlToEditor(url) {
    this.bookForm.patchValue({
      thumbnail:url
    })
  }

  onFileChange(event) { 
    this.myFileInput.nativeElement.value = '';
  }

  submitForm() {
    let bookObject = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      date: this.bookForm.value.date,
      url: this.bookForm.value.url,
      thumbnail: this.bookForm.value.thumbnail,
      description: this.bookForm.value.description,
      uuid:this.bookForm.value.uuid
    }

    if (this.book_id) {
      this.updateBook(bookObject)
    }
    else {
      this.createBook(bookObject)
    }
  }

  async createBook(bookObject) {
    this.crudService.startLoader();
    this.crudService.create(bookObject, this.firestoreKey).then(result => {
      this.router.navigateByUrl("/admin/book-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Ürün oluşturamadın", "Error")
    })

  }

  updateBook(bookObject) {
    this.crudService.startLoader()
    this.crudService.update(bookObject, this.firestoreKey, this.book_id).then(data => {
      this.router.navigateByUrl("/admin/book-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Ürün oluşturamadın", "Error")
    })
  }

  get f() {
    return this.bookForm.controls;
  }

  goBack() {
    history.pushState(null, null, window.location.href);
    if(this.isUploading){
      history.pushState(null, null, location.href);
      this.showModal =  true
    }
    else{
      this.router.navigateByUrl("/admin/book-list")
    }
  }
  goToBook(){
    this.router.navigateByUrl("/admin/book-list")
  }
  
  hideModal(){
    this.isUploading = false
    this.showModal =  false
  }
}

