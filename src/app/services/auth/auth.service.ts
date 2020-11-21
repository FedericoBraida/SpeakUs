import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = {}
  constructor(
    private afAuth: AngularFireAuth, 
    private router: Router, 
    private alertCtrl: AlertController) 
    { 
      this.afAuth.authState.subscribe((user) => {
        console.log("USER", user)
        if (!user) {
          return;
        }
        this.user.name = user.displayName;
        this.user.uid = user.uid;
        this.user.token = user.refreshToken;
      });
    }

  async login(credentials: {email: string, password: string}) {
    await this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
    .then((res) => {
      console.log("RES OK", res);
      this.user.token = res.user.refreshToken
      this.router.navigateByUrl('/home/tabs/tab1')
    })
    .catch( async (res) => {
      console.log("RES ERROR", res);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'El email o la contrasena no es correcta.',
        buttons: ['OK']
      });
  
      await alert.present();
    });
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((res) => {
      console.log("RES OK", res);
      this.user.token = res.user.refreshToken
      this.router.navigateByUrl('/home/tabs/tab1')
    }).catch(async (res) => {
      console.log("RES ERROR", res);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No pudimos establecer coneccion con Google, intente mas tarde.',
        buttons: ['OK']
      });
  
      await alert.present();
    });
  }

  isAuth(): boolean {
    return this.user?.token?.length > 2;
  }

  async logout() {
    this.user = {};
    await this.afAuth.signOut()
    .then((res) => {
      this.router.navigateByUrl('/')
    }).catch(async (res) => {
      console.log("RES ERROR", res);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No obtuvimos respuesta del serividor, intentelo mas tarde.',
        buttons: ['OK']
      });
      await alert.present();
    });

  }
}
