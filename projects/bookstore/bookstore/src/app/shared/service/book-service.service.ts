import { Injectable } from '@angular/core';
import {Book} from "../models/book";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
  books: Book[] | undefined;
  constructor(private httpClient: HttpClient) { }

  getBooks() : Observable<Book [] | undefined> {
    return this.httpClient.get<Book []>('http://localhost:8080/bookstore');
  }
}
