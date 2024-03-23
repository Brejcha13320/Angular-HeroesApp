import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.scss',
})
export class NewPageComponent implements OnInit {
  heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  publishers: { id: Publisher; value: string }[] = [
    {
      id: Publisher.DCComics,
      value: 'DC - Comics',
    },
    {
      id: Publisher.MarvelComics,
      value: 'Marvel - Comics',
    },
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroe(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/');
        this.heroForm.patchValue(hero);
        return;
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit() {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO: Mostrar snackbar
        this.showSnackbar(`${hero.superhero} updated`);
      });
      return;
    } else {
      this.heroesService.addHero(this.currentHero).subscribe((hero) => {
        //TODO: Mostrar snackbar y navegar a /heroes/edit/hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} created`);
      });
      return;
    }
  }

  onDeleteHero() {
    if (!this.currentHero) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted)
      )
      .subscribe(() => {
        this.router.navigate(['/heroes']);
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return;
    //   this.heroesService
    //     .deleteHeroById(this.currentHero.id)
    //     .subscribe((wasDeleted) => {
    //       if (wasDeleted) {
    //         this.router.navigate(['/heroes']);
    //       }
    //     });
    // });
  }

  showSnackbar(message: string) {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
