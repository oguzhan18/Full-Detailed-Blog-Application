import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-video-listing',
  templateUrl: './video-listing.component.html',
  styleUrls: ['./video-listing.component.css']
})
export class VideoListingComponent implements OnInit {

  searchText
  videoList = []
config:any
  constructor(
    private router: Router, 
    private crudService: CrudService,
     private toastrService: ToastrService,
     private sanitizer: DomSanitizer) { 
      this.config = {
        itemsPerPage: 4,
        currentPage: 1,
        totalItems: this.videoList.length
      };
     }

  ngOnInit(): void {
    this.loadVideos()
  }

  async loadVideos() {

    this.crudService.startLoader()
    this.crudService.getAll("videos").subscribe(data => {
      this.crudService.stopLoader()
      this.videoList = data.map(e => {
        let url =  e.payload.doc.data()['url']
        const videoId = this.getVideoId(url);
        if(videoId){
          url  = "https://www.youtube.com/embed/" + videoId
        }

        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          url: url,
          creator: e.payload.doc.data()['creator'],
          date: e.payload.doc.data()['date'],
          thumbnail: e.payload.doc.data()['thumbnail'],
        };
      })
    }, e => {
      this.crudService.stopLoader()
      this.toastrService.error("Video verisi gelmyor", "Error")
    });
  }

   getVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}

  formatDate(date){
    let formatedDate = date.toDate()
    return formatedDate
  }

  editArticle(video){
    window.open(video.url, '_blank')
  }

  byPassURL(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  pageChanged(event){
    this.config.currentPage = event;
  }
}
