import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first } from 'rxjs';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY="FaST7G1UnKIwrc0LIqHKDrcgKBkk832L";

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[]=[];
  private _tagsHistory: string[] = [];
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';



  constructor(private http:HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  // metodo que busca lo que se escribe en la caja de texto
  searchTag( tag: string):void {
    if(tag.length ===0) return;
    this.organizeHistory( tag);

    const params = new HttpParams()
    .set('api_key', GIPHY_API_KEY)
    .set('limit', '10')
    .set('q',tag)

   this.http.get<SearchResponse>(`${this.serviceUrl}/search`,{params})
   .subscribe(resp =>{
   this.gifList = resp.data;
   console.log(this.gifList);
   })
  }

  // Metodo que organiza el historial y lo limita a 10 busquedas
  private organizeHistory(tag: string){
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag )
    }
    this._tagsHistory.unshift( tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;
    this._tagsHistory= JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }
}
