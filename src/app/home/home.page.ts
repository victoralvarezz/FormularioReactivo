
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
export class HomePage {

  public registroForm: FormGroup;

  public isSubmitting = signal<boolean>(false);

  private fb = inject(FormBuilder);

  constructor() {

    // Creo el formulario y sus validaciones
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

      // Campo nuevo: fecha de nacimiento
      fechaNacimiento: ['', [
        Validators.required
      ]]

    });
  }

  get f() {
    return this.registroForm.controls;
  }

  // Método que se ejecuta al enviar el formulario
  public async onSubmit(): Promise<void> {

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {

      console.log('Formulario validado y enviado (simulación)');

      // Simulo el envío durante 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Muestro el mensaje que pide el profesor
      alert('El formulario se ha enviado correctamente.');

      // Limpio los campos
      this.registroForm.reset();

    } catch (error) {

      console.error('Error al procesar el formulario', error);

    } finally {

      this.isSubmitting.set(false);

    }
  }
}
