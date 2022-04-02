import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  eventList = []
  isUser
  uuid
  isAdmin
  userData


  constructor(
    private router: Router,
    private crudService: CrudService,
    private toastrService: ToastrService,
    private localStorgaeService:LocalStorageService) { }

  async ngOnInit(): Promise<void> {
    this.userData = await this.localStorgaeService.getDataFromIndexedDB("userData")
    this.isUser = this.userData.role==  "user"
    this.isAdmin = this.userData.role !==  "user"
    this.uuid = this.userData.uuid
    this.getEvents()
  }

  async getEvents() {
    this.crudService.startLoader()
    this.crudService.getAll("events").subscribe(async data => {
      this.crudService.stopLoader()
      this.eventList = await data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          url: e.payload.doc.data()['url'],
          organizer: e.payload.doc.data()['organizer'],
          date: e.payload.doc.data()['date'],
          startTime: e.payload.doc.data()['startTime'],
          endTime: e.payload.doc.data()['endTime'],
          uuid: e.payload.doc.data()["uuid"]
        };

      })
      if (this.isUser) {
        this.eventList = this.eventList.filter(data => {
          return data.uuid == this.uuid
        })
      }
      this.crudService.stopLoader()
    }
      , e => {
        this.crudService.stopLoader()
        this.toastrService.error("Etkinlik bilgileri gelmiyor!!!", "Error")
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

  formatDate(date) {
    let formatedDate = date.toDate()
    return formatedDate
  }

  editEvent(event) {
    this.router.navigateByUrl("/admin/edit-event/" + event.key)
  }

  async deleteEvent(event) {
    this.crudService.startLoader()
    this.crudService.delete(event.key, "events").then(data => {
      this.crudService.stopLoader()
      this.getEvents();
    }, e => {
      this.crudService.stopLoader()
      this.toastrService.error("Etkinlik bilgileri gelmiyor!!!", "Error")
    })
  }

  addEvent() {
    this.router.navigateByUrl("/admin/add-event")
  }
}
