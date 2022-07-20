import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root' //todos los servicios van a poder ser utilizados desde todas partes
})
export class HeroService {
  

  private heroesUrl = 'api/heroes';  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })//asi le pasamos cabecera
  };
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
 
    getHeroes(): Observable<Hero[]> {
      return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap(_ => this.log('fetched heroes')),
          catchError(this.handleError<Hero[]>('getHeroes', []))
        );//operador diamante <Hero[]> es obligatorio si ponemos un 
    }

    getHero(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
    }
    /** PUT: update the hero on the server ACTUALIZAR*/
updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}
/** POST: add a new hero to the server  AÑADIR */
addHero(hero: Hero): Observable<Hero> {
  return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
    tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
    catchError(this.handleError<Hero>('addHero'))
  );
}
/** DELETE: delete the hero from the server BORRAR */
deleteHero(id: number): Observable<Hero> {
  const url = `${this.heroesUrl}/${id}`;

  return this.http.delete<Hero>(url, this.httpOptions).pipe(
    tap(_ => this.log(`deleted hero id=${id}`)),
    catchError(this.handleError<Hero>('deleteHero'))
  );
}
/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  // si el térrmino de la búsqueda está vacío, pues se devuelve un Observable que mite un array vacío
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }//metodo get de http
  return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
    tap((x) =>
    //esta condicion se cumploe cuando x.length es TRue, es deir, cuando x.length es mayor que 0
      x.length
        ? this.log(`found heroes matching "${term}"`)
        : this.log(`no heroes matching "${term}"`)
    ),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}

  private handleError<T>(operation = 'operation', result?: T) {//T valor genérico
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);//servicio del mensaje

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Registrar un mensaje de HeroService con MessageService */
private log(message: string) {
  this.messageService.add(`HeroService: ${message}`);
}
  
}
