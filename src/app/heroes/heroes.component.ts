import { MessageService } from './../message.service';
import { HeroService } from './../hero.service';
import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[]=[];

  // este el constructor de la clase
  constructor(private heroService: HeroService) {
  }

  // este el constructor de Angular
  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().
      subscribe(heroes => this.heroes = heroes);
  }
  add(name: string): void {
    name = name.trim();
    if (!name) { 
      return;//finaliza el metodo inmediatamente
     }
//esta linea se ejecuta si la longitud de name es mayor que 0
    this.heroService.addHero({ name } as Hero) //objeto que tiene como nombre la propiedad name | es lo mismo que { name: name}
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
