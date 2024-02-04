import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  validation_message = {
    email: [
      { type: "required", message: "El correo es obligatorio" },
      { type: "pattern", message: "Ingresa un correo valido" }
    ],
    password: [
      { type: "required", message: "La contraseña es obligatoria" },
      { type: "minLength", message: "Minimo 8 caracteres" },
      { type: "maxLength", message: "Maximo 20 caracteres" },
      { type: "pattern", message: "Ingrese una contraseña valida con una mayúscula, una minúscula, un caracter especial y un número" }
    ]
  }
  loginMensaje: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: Storage,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
          )
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
      )
    });
  }

  ngOnInit() {}

  login(login_data: any) {
    console.log(login_data);
    
    this.authService.loginUser(login_data).then((respuesta: any) => {
      this.loginMensaje = respuesta;
  
      // Accede a los datos del usuario registrado desde el servicio de autenticación
      const usuarioRegistrado = this.authService.usuarioRegistrado;
  
      // Verifica las credenciales del usuario
      if (
        usuarioRegistrado &&
        usuarioRegistrado.email === login_data.email &&
        usuarioRegistrado.password === login_data.password
      ) {
        // Almacena el usuario actual en el almacenamiento local
        this.storage.set('usuarioRegistrado', usuarioRegistrado);
  
        // Redirige a la página de inicio
        this.navCtrl.navigateForward('/menu/home');
      } else {
        // Usuario no encontrado
        this.loginMensaje = 'Credenciales incorrectas';
      }
    }).catch(err => {
      this.loginMensaje = err;
    });
  }
  
  

  goToRegistro() {
    this.router.navigateByUrl('/registro');
  }
}
