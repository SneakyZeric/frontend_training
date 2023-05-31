import {Component, OnInit} from '@angular/core';
import {Book} from "../shared/models/book";
import {BookServiceService} from "../shared/service/book-service.service";

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss']
})
export class BooklistComponent implements OnInit{

  books: Book[] | undefined;

  constructor(private bs: BookServiceService) {
  }
  ngOnInit() {
    this.bs.getBooks()
      .subscribe(books => {
        this.books = books;
        this.bs.books = books;
      })
  }
}
