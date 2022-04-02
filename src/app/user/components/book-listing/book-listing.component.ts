import { Component, OnInit } from '@angular/core';

import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-listing',
  templateUrl: './book-listing.component.html',
  styleUrls: ['./book-listing.component.css']
})
export class BookListingComponent implements OnInit {

  config:any
  searchText
  bookList = []

  constructor(
    private crudService: CrudService, 
    private toastrService: ToastrService) { 
      this.config = {
        itemsPerPage: 4,
        currentPage: 1,
        totalItems: this.bookList.length
      };
    }

  ngOnInit(): void {
    this.loadBooks()
  }

  async loadBooks() {
    this.crudService.startLoader()
    this.crudService.getAll("books").subscribe(data => {
      this.crudService.stopLoader()
      this.bookList = data.map(e => {
        let url =  e.payload.doc.data()['url']
        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          url: url,
          author: e.payload.doc.data()['author'],
          date: e.payload.doc.data()['date'],
          thumbnail: e.payload.doc.data()['thumbnail'],
          description:e.payload.doc.data()['description']
        };
      })
    }, e => {
      this.crudService.stopLoader()
      this.toastrService.error("Ürün verileri gelmiyor", "Error")
    });
  }

  formatDate(date){
    let formatedDate = date.toDate()
    return formatedDate
  }

  viewBook(book){
    window.open(book.url, '_blank')
  }
  pageChanged(event){
    this.config.currentPage = event;
  }
}
