import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-videos',
  templateUrl: './add-edit-videos.component.html',
  styleUrls: ['./add-edit-videos.component.css']
})
export class AddEditVideosComponent implements OnInit {
  urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
  author :any
  videoForm: FormGroup;
  video_id: any;
  firestoreKey = "videos"
  videoData: any;
  isLoading = false
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
    
 private localStorgaeService:LocalStorageService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.createVideoForm()
  this.author = await this.localStorgaeService.getDataFromIndexedDB("userData")
  this.videoForm.patchValue({
    uuid: this.author.uuid,
  })
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.video_id = data.id
        this.getVideo(this.video_id)
      }

    })
  
  }

  createVideoForm() {
    this.videoForm = this.fb.group({

      title: ["", Validators.required],
      url: ["",[ Validators.required,Validators.pattern(this.urlPattern)]],
      thumbnail: [""],
      date: [new Date()],
      creator: ["user"],
      uuid:[this.author?.uuid]
    });
  }

  getVideo(video_id) {
    this.isLoading = true
    this.crudService.startLoader()

    this.crudService.getSingle(video_id, this.firestoreKey).then(data => {
      this.crudService.stopLoader()
      if(data.data()){

      this.videoData = data.data()
      this.videoData.key = data.id
      this.isLoading = false
      this.setVideoFormValues(this.videoData)
      }
      else{
        this.isLoading = false
        this.toastService.error("Video verisi gelmiyor!!! ", "Error")
      }
    }, e => {
      this.crudService.stopLoader()
      this.isLoading = false
      this.toastService.error("Video verisi gelmiyor!!!", "Error")
    })
  }

  setVideoFormValues(videoData) {
    if(this.author.role == "admin" || (this.author.role=="user" && this.author.uuid == videoData.uuid)){
    this.videoForm.patchValue({
      title: videoData?.title,
      url: videoData?.url,
      thumbnail: videoData?.thumbnail,
      date: videoData?.date,
      creator: videoData.creator,
      uuid:videoData?.uuid
    })
  }
  else{
    this.toastService.error("Belgeye erişim izniniz yok", "Permission Error")
  }
  }
  async onBlurVideoFeild() {
    let videoUrl = this.videoForm.value.url

    if (videoUrl) {
      var thumbnail = await this.get_youtube_thumbnail(videoUrl, 'medium');
      this.videoForm.patchValue({
        thumbnail: thumbnail
      })
    }
  }

  get_youtube_thumbnail(url, quality) {
    if (url) {
      var video_id, result;
      if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)) {
        video_id = result.pop();
      }
      else if (result = url.match(/youtu.be\/(.{11})/)) {
        video_id = result.pop();
      }

      if (video_id) {
        if (typeof quality == "undefined") {
          quality = 'high';
        }

        var quality_key = 'maxresdefault'; // Max quality
        if (quality == 'low') {
          quality_key = 'sddefault';
        } else if (quality == 'medium') {
          quality_key = 'mqdefault';
        } else if (quality == 'high') {
          quality_key = 'hqdefault';
        }

        var thumb_nail = "http://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
        return thumb_nail;
      }
    }
    return false;
  }
  submitForm() {
    let videoObject = {
      title: this.videoForm.value.title,
      creator: this.videoForm.value.creator,
      date: this.videoForm.value.date,
      url: this.videoForm.value.url,
      thumbnail: this.videoForm.value.thumbnail,
      uuid:this.videoForm.value.uuid
    }

    if (this.video_id) {
      this.updateVideo(videoObject)
    }
    else {
      this.createVideo(videoObject)
    }
  }

  async createVideo(videoObject) {
    this.crudService.startLoader();
    this.crudService.create(videoObject, this.firestoreKey).then(result => {
      this.router.navigateByUrl("/admin/video-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Video Oluşturma Hatası", "Error")
    })

  }


  updateVideo(videoObject) {
    this.crudService.startLoader()
    this.crudService.update(videoObject, this.firestoreKey, this.video_id).then(data => {
      this.router.navigateByUrl("/admin/video-list")
    }, e => {
      this.crudService.stopLoader()
      this.toastService.error("Video Oluşturma Hatası", "Error")
    })
  }

  get f() {
    return this.videoForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("/admin/video-list")
  }
}
