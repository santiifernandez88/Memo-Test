import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, AlertController, IonCol, IonRow, IonButton, IonGrid, IonIcon } from '@ionic/angular/standalone';
import { Subscription, interval } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dificil',
  templateUrl: './dificil.page.html',
  styleUrls: ['./dificil.page.scss'],
  standalone: true,
  imports: [IonIcon, IonGrid, IonButton, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DificilPage implements OnInit, OnDestroy {

  public imgManzana: string = 'assets/vaca.png';
  public imgBanana: string = 'assets/leon.png';
  public imgCoco: string = 'assets/perro.png';
  public imgDurazno: string = 'assets/elefante.png';
  public imgFrutilla: string = 'assets/mono.png';
  public imgPalta: string = 'assets/caracol.png';
  public imgUva: string = 'assets/pajaro.png';
  public imgAnana: string = 'assets/gato.png';

  public arrayRespuesta: string[] = [this.imgManzana, this.imgBanana, this.imgCoco, this.imgDurazno, this.imgFrutilla, this.imgPalta, this.imgUva, this.imgAnana, this.imgManzana, this.imgBanana, this.imgCoco, this.imgDurazno, this.imgFrutilla, this.imgPalta, this.imgUva, this.imgAnana];
  public pregunta: string = 'assets/pregunta.png';
  public arrayGame: string[] = [this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta];
  public active = true;
  private timerId: any;

  public selected: string[] = [];
  public selectedIndex: number[] = [];

  public seconds: number = 0;
  private subscription!: Subscription;

  constructor(private gameService: GameService, private alertController: AlertController, private router: Router) { addIcons({arrowBackCircleOutline}) }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.arrayRespuesta = this.shuffleArray(this.arrayRespuesta);
    this.subscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds >= 30) {
        this.endGame();
      }
    });
  }

  shuffleArray(array: string[]): string[] {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  async selectPic(index: number) {
    if (this.active && !this.selectedIndex.includes(index, 1)) {
      this.selected.push(this.arrayRespuesta[index]);
      this.selectedIndex.push(index);
      this.arrayGame[index] = this.arrayRespuesta[index];
      if (this.selected.length == 2) {
        if (this.selected[0] == this.selected[1]) {
          this.selectedIndex = [];
          this.selected = [];
          this.active = true;
          if (!this.arrayGame.includes(this.pregunta)) {
            const alert = await this.alertController.create({
              message: '¡¡¡ GANASTE !!!',
              buttons: [
                {
                  text: 'Aceptar',
                  handler: () => {
                    this.saveGame();
                  }
                }
              ]
            });
            await alert.present();
          }
        } else {
          this.active = false;
          this.timerId = setTimeout(() => {
            this.arrayGame[this.selectedIndex[0]] = this.pregunta;
            this.arrayGame[this.selectedIndex[1]] = this.pregunta;
            this.selectedIndex = [];
            this.selected = [];
            this.active = true;
          }, 2000);
        }
      }
    }
  }

  saveGame() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.gameService.saveGame(this.seconds, 'dificil');
    }
  }

  async endGame() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const alert = await this.alertController.create({
      message: 'Se acabó el tiempo Perdiste',
      buttons: [
        {
          text: 'Reinciar',
          handler: () => {
            this.reset();
          }
        }
      ]
    });
    await alert.present();
  }

  reset() {
    this.arrayGame = [this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta];
    this.selectedIndex = [];
    this.selected = [];
    this.active = true;
    this.arrayRespuesta = this.shuffleArray(this.arrayRespuesta);
    clearTimeout(this.timerId);
    this.seconds = 0;
    this.subscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds >= 30) {
        this.endGame();
      }
    });
  }

  back(){
    this.router.navigate(['tabs/tab1']);
  }
}
