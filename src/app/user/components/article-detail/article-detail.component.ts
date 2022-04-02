import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  articleData: any
  article_id = null;
  url = encodeURIComponent(window.location.href)
  constructor(private activatedRoute: ActivatedRoute,private toastService:ToastrService,
    private meta:Meta,
     private crudService: CrudService, private router: Router,
     @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.article_id = data.id
        this.getArticle(this.article_id)
      }
    })
  }

  getArticle(article_id) {
    if (isPlatformBrowser(this.platformId)) {
    this.crudService.startLoader()
    this.crudService.getSingle(article_id,"article").then(data=>{
      
      this.articleData =  data.data()
      this.meta.addTags([
        { name: 'keywords', content: this.articleData.title}, 
        { name: 'og:title', content:  this.articleData.title},
        { name: 'title', content:  this.articleData.title},
        { name: 'description', content: this.articleData.body},
        { name: 'og:image', content:this.articleData.imgUrl },
        { name: 'og:description', content:this.articleData.body },
        { name: 'twitter:image:src', content:this.articleData.imgUrl },
        { name: 'og:image', content:this.articleData.imgUrl },
        { name: 'og:image', content:this.articleData.imgUrl },
        { name: 'robots', content: 'index,follow,max-image-preview:large' },
        { name: 'og:type', content: 'Website' },
        { name: 'author', content: 'Mehul Kothari' },
        { name: 'article:author', content: 'Mehul Kothari' },
        { name: 'twitter:creator', content: 'Mehul Kothari' },
        { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
        { charset: 'UTF-8' }

      ])
      this.articleData.id =  data.id
      this.crudService.stopLoader()
    },e=>{
      this.toastService.error("Blog verisi gelmiyor!!!", "Error")
      this.crudService.stopLoader()
    })
  }
  }
  shareLink() {
    let title = this.articleData.title
    let text = this.articleData.title
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
    this.router.navigateByUrl("/user/article-list")
  }

}
