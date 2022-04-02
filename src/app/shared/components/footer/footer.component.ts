import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  url = encodeURIComponent(window.location.href)
  constructor() { }

  ngOnInit(): void {
  }

  shareLink() {
    let title = "My Wesbite"
    let text ="My website description"
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

}
