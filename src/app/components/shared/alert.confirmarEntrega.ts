import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";


@Injectable({ providedIn: 'root' })
export class Alerts {

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ){}


  async presentToast(message:string, color = 'success') {
    const toast = await this.toastCtrl.create({
      color: color,
      message: message,
      duration: 3000
    });
    toast.present();
  }


  async confirmarEntrega(): Promise<string> {
    return new Promise(async (resolve) => { // <--- Creamos la promesa
      const alert = await this.alertCtrl.create({
        header: 'Confirmación de Entrega',
        subHeader: '¿Estás seguro?',
        message: '¿Confirmas que el domicilio fue entregado exitosamente y conoces el estado del pago?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cancelado por el usuario');
              resolve('no'); // <--- Resolvemos la promesa con "no"
            }
          },
          {
            text: 'Sí, continuar',
            handler: () => {
              this.presentToast("ENTREGA CONFIRMADA", "success");
              resolve('si'); // <--- Resolvemos la promesa con "si"
            }
          }
        ]
      });

      await alert.present();
    });
}
  
}

