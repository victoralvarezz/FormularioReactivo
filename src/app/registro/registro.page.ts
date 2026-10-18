
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner
} from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner
  ]
})
export class RegistroPage {

  public registroForm: FormGroup;
  public isSubmitting = signal<boolean>(false);

  // Fecha máxima permitida: hoy
  public fechaMaxima = this.obtenerFechaHoy();

  private fb = inject(FormBuilder);

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],

      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],

      fechaNacimiento: ['', [
        Validators.required,
        (control) => {
          if (control.value && control.value > this.fechaMaxima) {
            return { fechaFutura: true };
          }
          return null;
        }
      ]]
    });
  }

  get f() {
    return this.registroForm.controls;
  }

  // Obtener la fecha actual en formato AAAA-MM-DD
  private obtenerFechaHoy(): string {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  public async onSubmit(): Promise<void> {

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      console.log('Formulario validado y enviado (simulación)');

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('El formulario se ha enviado correctamente.');

      this.registroForm.reset();

    } catch (error) {
      console.error('Error al procesar el formulario', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
