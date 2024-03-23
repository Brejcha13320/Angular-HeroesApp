import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.scss',
})
export class HeroPageComponent implements OnInit {
  hero?: Hero;

  constructor(
    private router: Router,
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        delay(1000),
        switchMap(({ id }) => this.heroesService.getHeroe(id))
      )
      .subscribe((hero) => {
        if (!hero) return this.router.navigate(['./heroes/list']);
        this.hero = hero;
        return;
      });
  }

  goBack() {
    this.router.navigateByUrl('/heroes/list');
  }
}
