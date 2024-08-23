import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { People } from '../models/people';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  personDetails = new Subject<any>();

  // Private BehaviorSubject to hold the data
  private peopleSubject: BehaviorSubject<People[]> = new BehaviorSubject<People[]>([]);

  // Observable to expose the data
  public people$: Observable<People[]> = this.peopleSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Method to update the people data
  updatePeople(people: People[]): void {
    this.peopleSubject.next(people);
  }
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
