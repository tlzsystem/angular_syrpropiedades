import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FlaskService {
  URL_BASE: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  getValores(category: string, city: string, fecha_inicio: string, fecha_fin: string): Observable<any>{
    return this.http.get(this.URL_BASE+'?category='+ category +  '&city='+ city + '&fecha_inicio='+ fecha_inicio+'&fecha_fin='+fecha_fin)
  }
}
