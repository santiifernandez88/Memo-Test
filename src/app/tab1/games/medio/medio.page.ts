import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonButton, AlertController, IonIcon } from '@ionic/angular/standalone';
import { Subscription, interval } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-medio',
  templateUrl: './medio.page.html',
  styleUrls: ['./medio.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MedioPage implements OnInit, OnDestroy {

  public imgMartillo: string = 'assets/lapiz.png';
  public imgSerrucho: string = 'assets/pincel.png';
  public imgPala: string = 'assets/goma.png';
  public imgLlave: string = 'assets/libro.png';
  public imgDesto: string = 'assets/sacapunta.png';
  public imgPinza: string = 'assets/regla.png';

  public arrayRespuesta: string[] = [this.imgMartillo, this.imgMartillo, this.imgSerrucho, this.imgSerrucho, this.imgLlave, this.imgLlave, this.imgDesto, this.imgDesto, this.imgPinza, this.imgPinza];
  public pregunta: string = 'assets/pregunta.png';
  public arrayGame: string[] = [this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta];
  public active = true;
  private timerId = setTimeout(() => {
    this.arrayGame[this.selectedIndex[0]] = this.pregunta;
    this.arrayGame[this.selectedIndex[1]] = this.pregunta;
    this.selectedIndex = [];
    this.selected = [];
    this.active = true;
  }, 2000)

  public selected: string[] = [];
  public selectedIndex: number[] = [];

  public seconds: number = 0;
  private subscription!: Subscription;

  constructor(private alertController: AlertController, private gameService: GameService, private router: Router) { addIcons({ arrowBackCircleOutline})}

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
      this.selected.push(this.arrayRespuesta[index])
      this.selectedIndex.push(index)
      this.arrayGame[index] = this.arrayRespuesta[index]
      if (this.selected.length == 2) {
        this.active = false;
        if (this.selected[0] == this.selected[1]) {
          this.selectedIndex = [];
          this.selected = [];
          this.active = true;
          if (!this.arrayGame.includes(this.pregunta)) {
            const alert = await this.alertController.create({
              message: '¡¡¡ GANASTE !!!',
              htmlAttributes: {
                'aria-label': 'alert dialog',
              },
              buttons: [
                {
                  text: 'Aceptar',
                  handler: () => {
                    this.saveGame()
                  },
                  htmlAttributes: {
                    'aria-label': 'close',
                  },
                },
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
          }, 2000)
        }
      }
    }
  }


  saveGame() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.gameService.saveGame(this.seconds, "medio");
    }
  }

  async endGame() {
    // this.reset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const alert = await this.alertController.create({
      message: 'Se acabó el tiempo Perdiste',
      htmlAttributes: {
        'aria-label': 'alert dialog',
      },
      buttons: [
        {
          text: 'Reinciar',
          handler: () => {
            this.reset()
          },
          htmlAttributes: {
            'aria-label': 'close',
          },
        },
      ]

    });
    await alert.present();
  }

  reset() {
    this.arrayGame = [this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta, this.pregunta];
    this.selectedIndex = [];
    this.selected = [];
    this.active = true;
    this.arrayRespuesta = this.shuffleArray(this.arrayRespuesta);
    clearTimeout(this.timerId);
    this.subscription.unsubscribe();
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
