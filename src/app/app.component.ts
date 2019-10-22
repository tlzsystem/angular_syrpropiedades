import { Component, OnInit } from '@angular/core';
import { MercadolibreService } from './mercadolibre.service';
import { FormControl } from '@angular/forms';
import { ChildrenCategory } from './models/children_category';
import { City } from './models/city';
import { State } from './models/state';
import { FlaskService } from './flask.service';

import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from './adapters/data-adapter';
import { ExcelService } from './excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    MercadolibreService,
    FlaskService,
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})



export class AppComponent implements OnInit{
  title = 'Syr Propiedades';
  selectedOperacion: string = 'Venta';
  operaciones: string[] = ['Venta', 'Arriendo'];
  public isLoadingResults = false;

  public fechaInicio: Date = new Date();
  public fechaFin: Date = new Date();
  public formatedFechaInicio: string;
  public formatedFechaFin: string;

  public total_inicial: number;
  public offset: number;
  public city: City;
  

  tiposVivienda: ChildrenCategory[];
  tiposOperacion: ChildrenCategory[];
  tiposEstado: ChildrenCategory[];
  listaStates: State[];
  listaCities: City[];


  tipoViviendaSelected = new FormControl();
  tipoOperacionSelected = new FormControl();
  tipoEstadoSelected = new FormControl();
  stateSelected = new FormControl();
  citySelected = new FormControl();
  fechaInicioSelected = new FormControl();
  fechaFinSelected = new FormControl();


  constructor(
    private servicio: MercadolibreService,
    private servicioBackend: FlaskService,
    private excelService: ExcelService
  ){}


  ngOnInit(){
    this.fechaInicio.setDate(this.fechaInicio.getDate() - 7);
    this.fechaFin.setDate(this.fechaFin.getDate() + 1);

    this.getTipoVivienda();
    this.getStates();
  }

  iniciarBusquedaURLs(){
    this.total_inicial = 0;
    this.offset = 0;
  
    this.servicio.getInitialUrls(this.tipoEstadoSelected.value.id,this.city.id, this.offset).subscribe(data=>{
        console.log(data);
        this.total_inicial = data.paging.total;
        this.offset = this.offset + 50; 
    });
  }

  sendDataToBackend(){
    this.formatedFechaInicio = this.formatFecha(this.fechaInicio); 
    this.formatedFechaFin = this.formatFecha(this.fechaFin); 
       this.isLoadingResults = true;
      this.servicioBackend.getValores(this.tipoEstadoSelected.value.id, this.city.id, this.formatedFechaInicio, this.formatedFechaFin)
      .subscribe(data=>{
        if (data.length>0){
          console.log(data);
          this.excelService.exportAsExcelFile(data, 'datos');

        }else{
          alert('No hay datos');
        }


          this.isLoadingResults = false;
      });
  }


  getTipoVivienda(): void{
    this.servicio.getTipoInmuebles()
    .subscribe(viviendas =>{
      console.log(viviendas);
      this.tiposVivienda = viviendas.children_categories;
    });
    
  }

  getTipoOperacion(id: string): void{
    this.servicio.getCategoriabyId(id).subscribe(data=>{
      console.log(data);
      this.tiposOperacion = data.children_categories;
    });
  }

  getTipoEstado(id: string): void{
    this.servicio.getCategoriabyId(id).subscribe(data=>{
      console.log(data);
      this.tiposEstado = data.children_categories;
    });
  }

  getStates(): void{
    this.servicio.getStates().subscribe(data =>{
        console.log(data);
        this.listaStates = data.states;
    });
  }

  getCities(id: string): void{
    this.servicio.getCitiesByState(id).subscribe(data =>{
      console.log(data);
      this.listaCities = data.cities;
    });
  }

  handleViviendaChange(vivienda){
    this.getTipoOperacion(vivienda.id);
  }

  handleOperacionChange(operacion){
    this.getTipoEstado(operacion.id);
  }

  handleStateChange(state){
    this.getCities(state.id);
  }

  formatFecha(fecha: Date): string{    
    console.log(fecha);   
    return this.to2digit(fecha.getDate()) + '-' + this.to2digit((fecha.getMonth() + 1 )) + '-' + fecha.getFullYear();
  }
  
  private to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

}
