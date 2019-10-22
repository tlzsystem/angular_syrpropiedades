import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class MercadolibreService {

  urlBase:string = 'https://api.mercadolibre.com/';
  categoria_tipo_inmueble: string = 'categories/MLC1459'
  states_url = 'classified_locations/countries/CL'
  cities_url = 'classified_locations/states/'
  search_url = 'sites/MLC/search?real_estate_agency=no'


  //https://api.mercadolibre.com/sites/MLC/search?category=MLC183186&city=TUxDQ1BST2NhYjU3&real_estate_agency=no&limit=50&offset=0


  constructor(private http: HttpClient) { }


  getTipoInmuebles():Observable<any>{
    return this.http.get(this.urlBase+this.categoria_tipo_inmueble);    
  }
  getCategoriabyId(cat: string):Observable<any>{
    return this.http.get(this.urlBase+'categories/'+cat);  
  }

  getStates(): Observable<any>{
    return this.http.get(this.urlBase+this.states_url);
  }
  getCitiesByState(state: string): Observable<any>{
    return this.http.get(this.urlBase + this.cities_url+ state);
  }
  getInitialUrls(category: string, city: string, offset: number): Observable<any>{
    return this.http.get(this.urlBase + this.search_url+'&category='+category+'&city='+city+'&offset='+offset)
  }


}
