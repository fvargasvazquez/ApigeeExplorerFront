import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private baseUrl = 'https://apigeeexplorerback-c0cge5evh6d0dacy.mexicocentral-01.azurewebsites.net/api';
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getEnvironments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/search/environments`);
  }

  search(environment: string, searchTerm: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.baseUrl}/search/${environment}/${searchTerm}`);
  }
}