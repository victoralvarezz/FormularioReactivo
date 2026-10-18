
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-driven',
  templateUrl: './driven.page.html',
  styleUrls: ['./driven.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton
  ]
})
export class DrivenPage {

  // Datos del formulario Template-Driven
  public usuario = {
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: ''
  };

  public fechaMaxima = this.obtenerFechaHoy();

  // Obtener la fecha actual
  private obtenerFechaHoy(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  // Comprobar que la fecha no sea futura
  public fechaFutura(): boolean {
    return (
      this.usuario.fechaNacimiento !== '' &&
      this.usuario.fechaNacimiento > this.fechaMaxima
    );
  }

  // Enviar el formulario
  public enviar(formulario: NgForm): void {

    if (formulario.invalid || this.fechaFutura()) {
      formulario.form.markAllAsTouched();
      return;
    }

    // No mostramos la contraseña en consola
    console.log('Formulario Template-Driven enviado correctamente');

    alert('El formulario Template-Driven se ha enviado correctamente.');

    formulario.resetForm();
  }
}

