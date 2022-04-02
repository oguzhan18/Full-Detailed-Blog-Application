import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.css']
})
export class ViewArticleComponent implements OnInit {
  articleData: any
  article_id = null;
  url = encodeURIComponent(window.location.href)
  constructor(private activatedRoute: ActivatedRoute, 
    private crudService: CrudService, 
    private router: Router,
    private toastService: ToastrService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.article_id = data.id
        this.getArticle(this.article_id)
      }
    })
  }


  getArticle(article_id) {
    this.crudService.startLoader()
    this.crudService.getSingle(article_id,"article").then(data=>{
      this.articleData =  data.data()
      this.articleData.id =  data.id
      this.crudService.stopLoader()
    },e=>{
      this.toastService.error("Post gelmiyor!!!", "Error")
      this.crudService.stopLoader()
    })
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
    this.router.navigateByUrl("/admin/article-list")
  }

}

