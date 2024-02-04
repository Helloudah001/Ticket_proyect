import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router){

  }
  async canActivate() {
    const usuarioLoggedIn = await this.storage.get('usuarioLoggedIn');
    if(usuarioLoggedIn){
      console.log("Usuario logueado")
      return true;
    }else{
      this.router.navigateByUrl('/login');

      return false;
    }
    
    return true;
  }

}
