
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonInput, IonButton, IonSpinner
} from '@ionic/angular';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonInput, IonButton, IonSpinner
  ]
})
export class RegistroPage {

  public registroForm: FormGroup;
  public isSubmitting = signal(false);
  public modoOscuro = signal(false);
  public fechaMaxima = this.obtenerFechaHoy();

  public ultimoRegistro: {
    nombre: string;
    email: string;
    fechaNacimiento: string;
  } | null = null;

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

  // Punto 6: fecha máxima de hoy
  private obtenerFechaHoy(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  // Punto 7: activar o desactivar modo oscuro
  public cambiarModoOscuro(): void {
    const nuevoModo = !this.modoOscuro();
    this.modoOscuro.set(nuevoModo);

    document.documentElement.classList.toggle(
      'ion-palette-dark',
      nuevoModo
    );
  }

  // Punto 10: obtener el hash de la contraseña
  private async protegerContrasena(
    password: string
  ): Promise<string> {
    const datos = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest('SHA-256', datos);

    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Punto 8: descargar los datos en PDF
  public descargarPDF(): void {
    if (!this.ultimoRegistro) {
      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text('Datos del registro', 20, 25);

    pdf.setFontSize(12);
    pdf.text(`Nombre: ${this.ultimoRegistro.nombre}`, 20, 45);
    pdf.text(`Correo: ${this.ultimoRegistro.email}`, 20, 55);
    pdf.text(
      `Fecha de nacimiento: ${this.ultimoRegistro.fechaNacimiento}`,
      20,
      65
    );

    pdf.save('registro-usuario.pdf');
  }

  // Punto 5: enviar el formulario
  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const datos = this.registroForm.getRawValue();

      // La contraseña nunca se imprime en texto plano
      const hash = await this.protegerContrasena(datos.password);

      console.log('Contraseña protegida (SHA-256):', hash);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Guardamos los datos antes de limpiar el formulario
      this.ultimoRegistro = {
        nombre: datos.nombre,
        email: datos.email,
        fechaNacimiento: datos.fechaNacimiento
      };

      alert('El formulario se ha enviado correctamente.');

      this.registroForm.reset();

    } catch (error) {
      console.error('Error al procesar el formulario', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
