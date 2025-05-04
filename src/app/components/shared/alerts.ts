import { AlertController, ToastController } from "@ionic/angular";



export class Alerts {

    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
    ){}

async alertMessage(message: string ){
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: `${message}`,
      buttons: ['OK']})

      alert.present();
  }

  async presentToast(message:string, color = 'success') {
    const toast = await this.toastCtrl.create({
      color: color,
      message: message,
      duration: 3000
    });
    toast.present();
  }

}

