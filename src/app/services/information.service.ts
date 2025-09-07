import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Information, InformationRequest } from '../models/information.model';

@Injectable({
  providedIn: 'root'
})
export class InformationService {
  private readonly API_URL = 'http://localhost:8080/api/information';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Information[]> {
    return this.http.get<Information[]>(this.API_URL);
  }

  getById(id: number): Observable<Information> {
    return this.http.get<Information>(`${this.API_URL}/${id}`);
  }

  create(request: InformationRequest): Observable<Information> {
    return this.http.post<Information>(this.API_URL, request);
  }

  update(id: number, request: InformationRequest): Observable<Information> {
    return this.http.put<Information>(`${this.API_URL}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  search(query: string): Observable<Information[]> {
    return this.http.get<Information[]>(`${this.API_URL}/search?q=${query}`);
  }

  searchByTags(tags: string[]): Observable<Information[]> {
    const tagsQuery = tags.join(',');
    return this.http.get<Information[]>(`${this.API_URL}/search/tags?tags=${tagsQuery}`);
  }
}
