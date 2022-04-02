import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.css']
})
export class GalleryDetailComponent implements OnInit {

  galleryData: any
  gallery_id = null;
  url = encodeURIComponent(window.location.href)
  base64Image: string;
  constructor(private activatedRoute: ActivatedRoute,
    private toastService:ToastrService, private crudService: CrudService, 
    private router: Router,
    private httpClient:HttpClient) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.gallery_id = data.id
        this.getGallery(this.gallery_id)
      }
    })
  }

  getGallery(gallery_id) {
    this.crudService.startLoader()
    this.crudService.getSingle(gallery_id,"gallery").then(data=>{
      console.log(data.data())
      this.galleryData =  data.data()
      this.galleryData.id =  data.id
      this.crudService.stopLoader()
    },e=>{
      this.toastService.error("Error Fetching Gallery", "Error")
      this.crudService.stopLoader()
    })
  }
  shareLink() {
    let title = this.galleryData.title
    let text = this.galleryData.title
    let url = this.url
    if (navigator.share !== undefined) {
      navigator
        .share({
          title,
          text,
          url
        })
        .then(() => console.log(""))
        .catch(err => console.error(err));
    }
  }
  goBack() {
    this.router.navigateByUrl("/user/gallery-list")
  }

  async downloadImage(img){
    const a = document.createElement("a");
        a.href = await this.toDataURL(img);
        a.download = "myImage.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  }

  toDataURL(url) {
    return fetch(url).then((response) => {
            return response.blob();
        }).then(blob => {
            return URL.createObjectURL(blob);
        });
}

async downloadAllImages(img){
  img.map(async (data,i)=>{
    const a = document.createElement("a");
    a.href = await this.toDataURL(data);
    a.download = "img"+i+".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  })
  
}



    // this.getBase64ImageFromURL(img).subscribe(base64data => {
    //   console.log(base64data);
    //   this.base64Image = "data:image/jpg;base64," + base64data;
    //   // save image to disk
    //   var link = document.createElement("a");

    //   document.body.appendChild(link); // for Firefox

    //   link.setAttribute("href", this.base64Image);
    //   link.setAttribute("download", "mrHankey.jpg");
    //   link.click();
    // });
  }

  // getBase64ImageFromURL(url: string) {
  //   return Observable.create((observer: Observer<string>) => {
  //     const img: HTMLImageElement = new Image();
  //     img.crossOrigin = "Anonymous";
  //     img.src = url;
  //     if (!img.complete) {
  //       img.onload = () => {
  //         observer.next(this.getBase64Image(img));
  //         observer.complete();
  //       };
  //       img.onerror = err => {
  //         observer.error(err);
  //       };
  //     } else {
  //       observer.next(this.getBase64Image(img));
  //       observer.complete();
  //     }
  //   });
  // }

  // getBase64Image(img: HTMLImageElement) {
  //   const canvas: HTMLCanvasElement = document.createElement("canvas");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   const dataURL: string = canvas.toDataURL("image/png");

  //   return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  // }

