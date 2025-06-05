import { SettlementStatus, PaymentStatus } from "../../interfaces/payments-interfaces";
import { AlertController, ToastController } from "@ionic/angular";
import { PaymentsService } from "src/app/pages/payments/payments.service";
import { DeliveryService } from "src/app/pages/deliveries/delivery.service";
import { Injectable } from "@angular/core";



@Injectable({ providedIn: 'root' })
export class AlertSettlementStatus {


  settlementStatus = SettlementStatus
  settlementStatusSelected: SettlementStatus | null = null;
//   changeSettlementstatus: boolean = false

  payload = {}


  constructor(
    private deliveryService: DeliveryService,
        private paymentsService: PaymentsService,
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


    async openStatusAlert(payment_id: number) {
        const alert = await this.alertCtrl.create({
          header: 'Seleccionar Estado de Pago',
          inputs: [
            // {
            //   name: 'CLEARED',
            //   type: 'radio',
            //   label: 'ACLARADO',
            //   value: this.settlementStatus.CLEARED
            // },
            {
              name: 'PENDING',
              type: 'radio',
              label: 'PENDIENTE',
              value: this.settlementStatus.PENDING
            },
            {
              name: 'SETTLED',
              type: 'radio',
              label: 'ENTREGADO',
              value: this.settlementStatus.SETTLED
            },
            {
              name: 'TRANSFERRED_TO_CLIENT',
              type: 'radio',
              label: 'TRANSF CLIENTE',
              value: this.settlementStatus.TRANFERRED_TO_CLIENT
            },
            {
              name:"TRANSFER_TO_OFFICE",
              type: 'radio',
              label: 'TRANSF OFICINA',
              value: this.settlementStatus.TRANSFER_TO_OFFICE
            }
          ],
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Aceptar',
              handler: selected => {
                this.settlementStatusSelected = selected;
                console.log("este es el payment_id recibido en el alert: ", payment_id);

                TODO: 'CREAR PAYLOAD CON EL PAMENTS STATUS Y SETTLEMENT STATUS'

                

                if (selected == this.settlementStatus.SETTLED) {
                  
                  this.payload= {
                    settlement_status: selected,
                    payment_status: PaymentStatus.OFFICE,
                    payment_type: "CASH"
                  }

                }
                if (selected == this.settlementStatus.TRANFERRED_TO_CLIENT) {

                  this.payload= {
                    settlement_status: selected,
                    payment_status: PaymentStatus.CLIENT_RECIEVED_TRANSFER,
                    payment_type: 'TRANSFER'
                  }
                  
                }

                if (selected == this.settlementStatus.TRANSFER_TO_OFFICE) {
                  
                  this.payload = {
                    settlement_status: selected,
                    payment_status: PaymentStatus.OFFICE_RECIEVED_TRANSFER,
                    payment_type: 'TRANSFER'

                  }
                }

                if (selected == this.settlementStatus.PENDING) {
                  this.payload = {
                    settlement_status: selected,
                    payment_status: PaymentStatus.COURIER,
                    payment_type: 'PENDING'

                  }
                }

                
                this.paymentsService.updatePaymentStatus(payment_id, this.payload).subscribe({
                  next: (resp)=>{
                    console.log("resp del alert", resp);
                    
                    this.alertMessage("Estado actualizado correctamente")
                    this.presentToast("Estado actualizado correctamente") 
                  },
                  error: (err)=>{
                    this.alertMessage(`Error: ${err.error.message}`)
                    this.presentToast(`Error: ${err.error.message}`, 'danger')
                  }
    
                })
                console.log('Estado seleccionado:', selected, this.settlementStatusSelected);
              }
            }
          ]
        });
    
        await alert.present();
      }



}

