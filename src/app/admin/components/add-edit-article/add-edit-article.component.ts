import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { FileUpload, FileuploadService } from '@app/shared/services/fileupload.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-article',
  templateUrl: './add-edit-article.component.html',
  styleUrls: ['./add-edit-article.component.css']
})
export class AddEditArticleComponent implements OnInit {
  articleForm: FormGroup;
  article_id: null;
  aricleData: any
  config: any;
  author: any

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;

  availableCategory: any = ['Politika', 'Sosyal', 'Finans', 'ERP', 'Mobil','Yazılım','AIFA SOFT','Teknoloji','Oğuzhan ÇART']
  @ViewChild('myckeditor') myckeditor: any;
  downloadURL: any;
  isUploading: boolean = false;
  showModal: any;
  isUploaded: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
    private uploadService: FileuploadService,
    private storage: AngularFireStorage,
    private localStorageService: LocalStorageService,
    private location: LocationStrategy
  ) {
    this.config = { uiColor: '#f2f2f2' };
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      this.goBack()
    });

  }

  async ngOnInit(): Promise<void> {
    this.createArticleForm()
    this.author = await this.localStorageService.getDataFromIndexedDB("userData")
    this.articleForm.patchValue({
      uuid: this.author.uuid,
      author: this.author.email
    })
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.article_id = data.id
        this.getArticle(this.article_id)
      }

    })

    this.config.extraPlugins = 'colorbutton , justify,codesnippet'
    // this.config = {
    //   extraPlugins: 'uploadimage',
    //   uploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',

    //   // Configure your file manager integration. This example uses CKFinder 3 for PHP.
    //   filebrowserBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html',
    //   filebrowserImageBrowseUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.html?type=Images',
    //   filebrowserUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Files',
    //   filebrowserImageUploadUrl: 'https://ckeditor.com/apps/ckfinder/3.4.5/core/connector/php/connector.php?command=QuickUpload&type=Images'
    // }
  }

  createArticleForm() {
    this.articleForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      body: ["", Validators.required],
      date: [new Date()],
      author: [this.author?.email],
      category: ["", Validators.required],
      isPublic: [false],
      uuid: [this.author?.uuid],
      thumbnail:[""]
    });
  }

  getArticle(article_id) {
    this.crudService.startLoader()
    this.crudService.getSingle(article_id, "article").then(data => {
      this.crudService.stopLoader()
      if (data.data()) {
        this.aricleData = data.data()
        this.aricleData.id = data?.id
        this.setArticleFormValues(this.aricleData)

      }
      else {
        this.toastService.error("Blog verisi gelmiyor", "Error")
      }



    }, e => {
      this.toastService.error("Blog verisi gelmiyor", "Error")
      this.crudService.stopLoader()
    })
  }

  setArticleFormValues(articleData) {
    if (this.author.role == "admin" || (this.author.role == "user" && this.author.uuid == articleData.uuid)) {
      this.articleForm.patchValue({
        title: articleData?.title,
        body: articleData?.body,
        date: articleData?.date,
        author: articleData?.author,
        category: articleData?.category,
        isPublic: articleData.isPublic ? articleData.isPublic : false,
        uuid: articleData?.uuid,
        thumbnail:articleData?.thumbnail
      })
    }

    else {
      this.toastService.error("Belgeye erişim izniniz yok", "Permission Error")
    }

  }

  getImages(string) {
    const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
    const images = [];
    let img;
    while ((img = imgRex.exec(string))) {
      images.push(img[1]);
    }
    return images;
  }

  async getMeta(url) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve({ ht: img.height, width: img.width, url: url })
      img.onerror = reject
      img.src = url
    })
  }

  async submitForm() {
    let body = this.articleForm.value.body
    let img = await this.getImages(body)
    let imgUrl = "https://neilpatel.com/wp-content/uploads/2017/08/blog.jpg"
    if (img.length > 0) {
      imgUrl = img[0]
      var p = document.createElement('p')
      p.innerHTML = imgUrl
      imgUrl = p.innerText
    }

    let articleObject = {
      title: this.articleForm.value.title,
      body: this.articleForm.value.body,
      author: this.articleForm.value.author,
      category: this.articleForm.value.category,
      date: this.articleForm.value.date,
      isPublic: this.articleForm.value.isPublic,
      imgUrl: imgUrl,
      uuid: this.articleForm.value.uuid,
      thumbnail:this.articleForm.value.thumbnail
    }
    if (this.article_id) {
      this.updateArticle(articleObject)
    }
    else {
      this.createArticle(articleObject)
    }
  }

  async createArticle(articleObject) {
    this.crudService.startLoader()
    this.crudService.create(articleObject, "article").then(data => {
      this.router.navigateByUrl("/admin/article-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Blog oluşturulamadı!!!", "Error")
    })
  }

  updateArticle(articleObject) {
    this.crudService.startLoader()
    this.crudService.update(articleObject, "article", this.article_id).then(data => {
      this.router.navigateByUrl("/admin/article-list")

    }, e => {
      this.toastService.error("Blog güncellenmedi!!!", "Error")
      this.crudService.stopLoader()
    })
  }

  get f() {
    return this.articleForm.controls;
  }

  goBack() {

    if (this.isUploading) {
      history.pushState(null, null, location.href);
      this.showModal = true
    }
    else {
      this.router.navigateByUrl("/admin/article-list")
    }
  }

  goBackToArticle() {
    this.router.navigateByUrl("/admin/article-list")
  }

  selectFile(event): void {
    this.isUploading = true
    this.percentage = 0
    this.selectedFiles = event.target.files;
    const file = event.target.files[0];
    this.currentFileUpload = new FileUpload(file);
    const filePath = `articles`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`articles/`, file);
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


  upload(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
        this.uploadService.downloadUrl.subscribe(data => {
          this.addUrlToEditor(data)
        })
      },
      error => {

      }
    );
  }

  changeCategory(e) {

    this.articleForm.patchValue({
      category: e.target.value
    })
  }
  addUrlToEditor(url) {
    if (url) {
      var style = " <img src='" + url + "'  style='max-width: 100%;' class='img-responsive'>";

      let innerHtml = this.articleForm.value.body
      this.myckeditor.instance.insertHtml(style)
      this.articleForm.patchValue({ 'body': innerHtml });
    }

  }

  hideModal() {
    this.isUploading = false
    this.showModal = false
  }

}
