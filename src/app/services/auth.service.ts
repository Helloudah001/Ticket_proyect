import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioRegistrado: any = null; // Cambiado a un objeto

  constructor() { }

  loginUser(credential: any) {
    return new Promise((acccept, reject) => {
      // Verifica las credenciales ingresadas
      if (
        this.usuarioRegistrado &&
        credential.email === this.usuarioRegistrado.email &&
        credential.password === this.usuarioRegistrado.password
      ) {
        acccept('Credenciales correctas');
      } else {
        reject('Credenciales incorrectas');
      }
    });
  }

  registrarUsuario(credential: any) {
    return new Promise((acccept, reject) => {
      // Simula el registro exitoso
      const nuevoUsuario = {
        email: credential.email,
        password: credential.password,
        nombre: credential.nombre,
        apellido: credential.apellido,
      };

      // Almacena el nuevo usuario en el objeto
      this.usuarioRegistrado = nuevoUsuario;

      acccept(nuevoUsuario);
    });
  }
}
