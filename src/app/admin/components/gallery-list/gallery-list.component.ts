import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {
  galleryList = []
  isUser 
  uuid 
  isAdmin 

  userData: any
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private crudService: CrudService,
    private toastService: ToastrService,
    private localStorgaeService: LocalStorageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.userData = await this.localStorgaeService.getDataFromIndexedDB("userData")

    this.isUser = this.userData.role == "user"
    this.isAdmin = this.userData.role !== "user"
    this.uuid = this.userData.uuid
    if (this.isUser) {
      this.getUserSpecificgallery()
    }
    else {
      this.getgalleryList()
    }

  }

  getUserSpecificgallery() {
    this.crudService.startLoader()
    this.crudService.getAll("gallery").subscribe(async data => {

      this.galleryList = await data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['body'],
          date: e.payload.doc.data()['date'],
          eventDate: e.payload.doc.data()['eventDate'],
          imgUrl: e.payload.doc.data()['imgUrl'],
          author: e.payload.doc.data()['author'],
          isPublic: e.payload.doc.data()["isPublic"],
          uuid: e.payload.doc.data()["uuid"]

        }
      })
      this.galleryList = this.galleryList.filter(data => {
        return data.uuid == this.uuid
      })
      this.crudService.stopLoader()
    }, e => {
      this.crudService.stopLoader()
    });
  }

  async getgalleryList() {
    this.crudService.startLoader()
    this.crudService.getAll("gallery").subscribe(data => {

      this.galleryList = data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['body'],
          eventDate: e.payload.doc.data()['eventDate'],
          date: e.payload.doc.data()['date'],
          imgUrl: e.payload.doc.data()['imgUrl'],
          author: e.payload.doc.data()['author'],
          isPublic: e.payload.doc.data()["isPublic"]
        };
      })
      this.crudService.stopLoader()
    }, e => {
      console.log(e)
      this.crudService.stopLoader()
    });
  }

  formatData(data) {
    let returnData = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        returnData.push({ ...data[key], key });
      }
    }
    return returnData
  }

  editGallery(gallery) {
    this.router.navigateByUrl("/admin/edit-gallery/" + gallery.key)
  }


  formatDate(date) {
    let formatedDate = date.toDate()
    return formatedDate
  }

  addGallery() {
    this.router.navigateByUrl("/admin/add-gallery")
  }

  viewgallery(gallery) {
    this.router.navigateByUrl("/admin/view-gallery/" + gallery.key)
  }

  onCheckBoxChange(e, gallery) {
    var flag = e.target.checked;
    var alertMessage = "";
    gallery.isPublic = flag
    if (flag)
      alertMessage = "Galleryy visibility changed to public uccessfully";
    else
      alertMessage = "Galleryy visibility changed to private successfully";
    this.updategallery(gallery, alertMessage)
  }

  updategallery(galleryObject, msg) {
    this.crudService.startLoader()
    this.crudService.update(galleryObject, "gallery", galleryObject.key).then(data => {
      this.toastService.success(msg, "Success")
      this.getgalleryList()

    }, e => {
      this.toastService.error("Error Updating gallery", "Error")
      this.crudService.stopLoader()
    })
  }

  deleteGallery(gallery) {
    this.crudService.startLoader()
    this.crudService.delete(gallery.key, "gallery").then(data => {
      this.crudService.stopLoader()
      this.getgalleryList();
    }, e => {
      this.crudService.stopLoader()
      this.toastrService.error("Error Fetching Gallery", "Error")
    })
  }
}

