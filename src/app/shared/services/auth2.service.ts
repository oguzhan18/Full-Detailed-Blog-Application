import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '@app/user/models/user.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from './local-storage.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/of'
import Swal from 'sweetalert2';
import { CrudService } from './crud.service';
import { ToastrService } from 'ngx-toastr';
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService2 {
    user$:any;
    user = new BehaviorSubject<any>(null);
    key = environment.firebaseConfig.apiKey
    userdata: User;
    isAuthenticated: any;
    authChange = new Subject<boolean>();
    constructor(private afs: AngularFirestore,
        private router: Router,
        private localStorageService: LocalStorageService,
        private ngxLoader: NgxSpinnerService,
        private afAuth: AngularFireAuth,
        private crudService:CrudService,
        private toastrService:ToastrService) {

            this.user$ = this.afAuth.authState.pipe(
                switchMap(user => {
                    if (user) {
                      return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
                    } else {
                      return Observable.of(null)
                    }
                  })
            )
            
    }

    initAuthListener() {
        this.afAuth.authState.subscribe(async user => {
            const userData = await this.localStorageService.getDataFromIndexedDB("userData")
            this.user.next(userData)
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
           
            } else {

                this.authChange.next(false);
                this.router.navigate(['admin/auth']);
                this.isAuthenticated = false;
            }
        });
    }

    login(authData: any) {
        this.crudService.startLoader()
        this.afAuth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.updateUserData(result.user).then(data=>{
                    this.router.navigate(['/admin/article-list']);
                },e=>{
                    this.crudService.stopLoader()
                    this.toastrService.error(e,"Error")
                })

            })
            .catch(error => {
                this.crudService.stopLoader()
                this.toastrService.error(error,"Error")
            });
    }

    async updateUserData(user) {
       const userData =  await this.getUserData(user)
       if(userData && userData.email && userData.role){
        await this.localStorageService.setDataInIndexedDB("userData",userData)
        this.user.next(userData)
        return userData
       }
       else{
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
        const data = {
            uid: user.uid,
            email: user.email,
            role: 'admin'
          }
         await this.localStorageService.setDataInIndexedDB("userData",data)
         this.user.next(data)
        return userRef.set(data, { merge: true })
       } 
    }

     async getUserData(user){
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
       return  userRef.valueChanges().pipe(take(1)).toPromise();
    }

    async logout() {
        this.afAuth.signOut();
        this.user.next(null);
       await   this.localStorageService.clearDataFromIndexedDB()
        this.router.navigate(['/admin/auth']);
    }

    isAuth() {
        return this.isAuthenticated;
    }

    async sendPasswordResetEmail(passwordResetEmail: string) {
        return await this.afAuth.sendPasswordResetEmail(passwordResetEmail)
          .then(() => {
            this.logout()
            this.router.navigate(['admin/auth']);
            this.success("Reset Password Mail sent");
          })
      }

      error(message) {
        this.ngxLoader.hide();
        Swal.fire({
          title: message.code,
          text: message.message,
          icon: 'error',
          timer: 5000,
          confirmButtonText: "OKAY"
        });
      }
    
      success(message) {
        Swal.fire({
          title: "Success",
          text: message,
          icon: 'success',
          timer: 5000,
          confirmButtonText: "OKAY"
        });
      }

    // async logout() {
    //     this.user.next(null);
    //     this.router.navigate(['/admin/auth']);
    //     this.localStorageService.clearDataFromIndexedDB()
    //     if (this.tokenExpirationTimer) {
    //       clearTimeout(this.tokenExpirationTimer);
    //     }
    //     this.tokenExpirationTimer = null;
    //   }
    
    //   async autoLogout(expirationDuration: number) {
    //     this.tokenExpirationTimer = setTimeout(() => {
    //       this.logout();
    //     }, expirationDuration);
    
    //   }

}
