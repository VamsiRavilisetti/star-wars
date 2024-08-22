import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  personDetails = new Subject<any>();
  constructor(private http: HttpClient) { }

  private apiUrl = 'https://swapi.dev/api/people/'

  getAllPeopleData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPeopleWithId(id: any) {
    return this.http.get<any>(this.apiUrl + id);
  }
  getItems(url: any) {
    return this.http.get<any>(url)
  }
}
