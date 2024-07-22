import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonCol, IonRow, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Game } from '../interfaces/game';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonRow, IonCol, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, CommonModule]
})
export class Tab2Page implements OnInit{

  public games: Game[] = [];
  public facilGames: Game[] = [];
  public medioGames: Game[] = [];
  public dificilGames: Game[] = [];


  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.traer().subscribe(g => {
      this.games = g;

      this.games.forEach(game => {
        switch (game.tipo) {
          case "facil":
            this.facilGames.push(game);
            break;
          case "medio":
            this.medioGames.push(game);
            break;
          case "dificil":
            this.dificilGames.push(game);
            break;

        }
      })
      this.ordenarPorTiempo(this.facilGames)
      this.ordenarPorTiempo(this.medioGames)
      this.ordenarPorTiempo(this.dificilGames)

      this.facilGames = this.facilGames.slice(0, 5);
      this.medioGames = this.medioGames.slice(0, 5);
      this.dificilGames = this.dificilGames.slice(0, 5);
    });
  }

  ordenarPorTiempo(games: Game[]) {
    games.sort((a: Game, b: Game) => {
      return a.tiempo - b.tiempo;
    });
  }

  

}
