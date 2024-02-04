import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm: FormGroup;

  validation_message_r = {
    email: [
      { type: "required", message: "El correo es obligatorio" },
      { type: "pattern", message: "Ingresa un correo valido" }
    ],
    password: [
      { type: "required", message: "La contraseña es obligatoria" },
      { type: "minLength", message: "Mínimo 8 caracteres" },
      { type: "maxLength", message: "Máximo 20 caracteres" },
      { type: "pattern", message: "Ingrese una contraseña válida con una mayúscula, una minúscula, un caracter especial y un número" }
    ],
    confirmPassword: [
      { type: "required", message: "La confirmación de contraseña es obligatoria" },
      { type: "passwordMatch", message: "Las contraseñas no coinciden" }
    ],
    nombre: [
      { type: "required", message: "El nombre es obligatorio" },
      { type: "minLength", message: "El nombre debe tener al menos 2 caracteres" },
      { type: "maxLength", message: "El nombre no puede superar los 50 caracteres" }
    ],
    apellido: [
      { type: "required", message: "El apellido es obligatorio" },
      { type: "minLength", message: "El apellido debe tener al menos 2 caracteres" },
      { type: "maxLength", message: "El apellido no puede superar los 50 caracteres" }
    ]
  };

  registroMensaje: any;

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private storage: Storage
  ) {
    this.registroForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)
        ])
      ),
      confirmPassword: new FormControl("", Validators.required),
      nombre: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ])),
      apellido: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]))
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() { }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')!.value;
    const confirmPassword = formGroup.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }

  registrar(registro_data: any) {
    this.authService.registrarUsuario(registro_data).then((usuarioRegistrado: any) => {
      // Almacena los datos del usuario en el servicio de autenticación
      this.authService.usuarioRegistrado = usuarioRegistrado;

      // Almacena los datos del usuario en el almacenamiento local
      this.storage.set('usuarioRegistrado', usuarioRegistrado);

      // Redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
    }).catch(err => {
      // Manejo específico de errores, puedes ajustarlo según tus necesidades
      if (err && err.passwordsDoNotMatch) {
        this.registroMensaje = 'Las contraseñas no coinciden';
      } else {
        this.registroMensaje = err || 'Error desconocido';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
