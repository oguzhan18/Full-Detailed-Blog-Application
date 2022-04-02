import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeEventArgs as DropDownChangeArgs } from '@syncfusion/ej2-angular-dropdowns';
import { EventSettingsModel, View, ScheduleComponent, AgendaService, PopupOpenEventArgs } from '@syncfusion/ej2-angular-schedule';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-inputs';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.css'],
  providers: [AgendaService]
})
export class LiveEventsComponent implements OnInit {
  eventList = []
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public selectedDate: Date = new Date();
  public eventSettings: EventSettingsModel
  public currentView: View = 'Agenda';
  public virtualScroll = false;
  public allowVirtualScroll = false;
  public hideAgenda = true;
  public virtualScrollOptions: Record<string, any>[] = [
    { text: 'True', value: true },
    { text: 'False', value: false }
  ];
  public hideEmptyAgendaDaysOptions: Record<string, any>[] = [
    { text: 'True', value: true },
    { text: 'False', value: false }
  ];
  public fields: Record<string, any> = { text: 'text', value: 'value' };



  constructor(private crudService: CrudService,
    private toastrService: ToastrService) {
    this.eventSettings = { dataSource: this.eventList };
  }

  ngOnInit(): void {
    this.getEvents()
  }
  getEvents() {
    this.crudService.startLoader()
    this.crudService.getAll("events").subscribe(data => {
      this.crudService.stopLoader()
      this.eventList = data.map(e => {
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          url: e.payload.doc.data()['url'],
          organizer: e.payload.doc.data()['organizer'],
          date: e.payload.doc.data()['date'],
          startTime: e.payload.doc.data()['startTime'],
          endTime: e.payload.doc.data()['endTime'],
        };

      })
      this.crudService.stopLoader()
      this.setEventsOnCalender(this.eventList)
    }
      , e => {
        this.crudService.stopLoader()
        this.toastrService.error("Etkinlik Verisi yok", "Error")
      });
  }
  setEventsOnCalender(eventList) {
    let event = []

    eventList.map((data, id) => {
     
      event.push({
        Id: id,
        Subject: data.title,
        StartTime: data.startTime.toDate(),
        EndTime: data.endTime.toDate(),
        url: data.url,

      });
      id++;
    })
    this.eventSettings = { dataSource: event };

  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor' || args.type === 'QuickInfo') {
      args.cancel = true;

    }
  }

}
