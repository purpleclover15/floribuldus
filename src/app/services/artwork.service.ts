// artwork.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ArtworkService {
  constructor(private http: HttpClient) {}

  getArtworks() {
    return this.http.get<any[]>('/assets/data.json');
  }
}