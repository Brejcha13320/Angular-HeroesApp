import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent implements OnInit {
  @Input() hero!: Hero;

  ngOnInit(): void {
    if (!this.hero) throw Error('Hero property is required');
  }
}
