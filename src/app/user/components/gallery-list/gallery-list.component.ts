import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent implements OnInit {

  
  isFilter = false
  searchText
  articleList = []
  config: any;
  articleListByDate: any
  selectedDate: any;
  constructor(private crudService: CrudService, private router: Router) {
    this.config = {
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: this.articleList.length
    };
  }

  ngOnInit(): void {
    this.loadArticles()
  }


  async loadArticles() {
    this.crudService.startLoader()
    this.crudService.getAll("gallery").subscribe(async data => {
     
      this.articleList = await data.map(e => {
         console.log(e.payload.doc.data())
        let desc
        desc = this.extractContent(e.payload.doc.data()['body'])
        let imgUrl = e.payload.doc.data()['imgUrl']

        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['body'],
          category: e.payload.doc.data()['category'],
          date: e.payload.doc.data()['date'],
          shortDesc: desc,
          evenDate:e.payload.doc.data()['eventDate'],
          imgUrl: imgUrl,
          author: e.payload.doc.data()['author'],
          isPublic: e.payload.doc.data()["isPublic"]
        };
      })
      this.articleList = this.articleList.filter(data => {
        return data.isPublic == true
      })
      console.log(  this.articleList)
      let grouped_items = _.groupBy(this.articleList, (b: any) =>
        moment(b.evenDate.toDate()).startOf('month').format('YYYY/MM'));

      _.values(grouped_items)
        .forEach(arr => arr.sort((a, b) => moment(a.evenDate).day() - moment(b.evenDate).day()));

      this.articleListByDate = grouped_items
      this.crudService.stopLoader()
    }, e => {
      this.crudService.stopLoader()
    });
  }

  formarArticleBody(articles) {
    let updatedArticleList = []
    let publicArticles = []
    let desc
    articles.forEach(article => {
      desc = this.extractContent(article.body)
      article.shortDesc = desc
      article.imgUrl = article.imgUrl ? article.imgUrl : 'https://neilpatel.com/wp-content/uploads/2017/08/blog.jpg'
      article.isPublic = article.isPublic ? article.isPublic : false
      if (article.isPublic) {
        publicArticles.push(article)
      }

      updatedArticleList.push(article)
    });

    return publicArticles
  }

  getArticleByDate(item, date) {

    this.selectedDate = date
    this.isFilter = true
    this.articleList = item.value
    let data = this.articleList.filter(data => {
      return moment(data.evenDate.toDate()).startOf('month').format('YYYY/MM') == date
    })
  }


  clearFilter() {
    this.loadArticles()
    this.selectedDate = ""
    this.isFilter = false

  }
  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

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
    this.router.navigateByUrl("/user/gallery-detail/" + gallery.key)
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
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

toDataURL(url) {
return fetch(url).then((response) => {
        return response.blob();
    }).then(blob => {
        return URL.createObjectURL(blob);
    });
}
  }

