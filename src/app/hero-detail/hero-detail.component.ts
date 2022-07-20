import { HeroService } from './../hero.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input()
  hero?: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location    // al darle al de Location que ponia @angular, se ha podido importar arriba Location | hemos encontrado una ambiguedad entonces esta el ts y angular y en este caso queriamos que fuese de angular.
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //forma de obtener el id de la ruta  | convertir string en numero
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }
  goBack(): void {
    this.location.back();
  }

}
