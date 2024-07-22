import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userActive: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    this.auth.onAuthStateChanged((user) => {
      this.userActive = user;
    });
  }

  async Login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.userActive = userCredential.user;
    return userCredential;
  }

  async Register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    this.userActive = userCredential.user;
    return userCredential;
  }

  async getUser() {
    return new Promise<User | null>((resolve) => {
      this.auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  getUserEmail() {
    return this.userActive ? this.userActive.email : null;
  }

  logout() {
    this.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
