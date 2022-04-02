import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserCrudService } from '@app/admin/services/user-services/user-crud.service';
import { CrudService } from '@app/shared/services/crud.service';
import { EncrDecrService } from '@app/shared/services/EncrDecrService.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import firebase from "firebase/app";
import "firebase/firestore";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  secretkey = environment.secretkey
  app2 
  userForm: FormGroup;
  user_id: any;
  userData: any;
  oldUserData: any
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService,
    private userCrudService: UserCrudService,
    private encryptService: EncrDecrService,
    private afs: AngularFirestore,
  ) {
  }

  ngOnInit(): void {
    if (!firebase.apps.length) {
      this.app2 = firebase.initializeApp(environment.firebaseConfig, 'tempApp');
   }else {
      this.app2= firebase.app(); // zaten kayıtla yada  başlatılmışsa, onu kullanın
   }


    this.createUserForm()
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.user_id = data.id
        let key = this.user_id.replace(/\./g, ',');
        this.getUser(this.user_id)
      }

    })

  }

  createUserForm() {
    this.userForm = this.fb.group({

      email: ["", Validators.required],
      password: ["", Validators.required],
      date: [new Date()],
      role: ["user"],
      uuid: [uuidv4()]
    });
  }


  createUser(userinfo) {

    this.userCrudService.startLoader()
    const app2=  firebase.initializeApp(environment.firebaseConfig, 'tempApp');
    app2.auth().createUserWithEmailAndPassword(userinfo.email, userinfo.password).then(data => {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${data.user.uid}`);
      const userData = {
        uuid: data.user.uid,
        email: data.user.email,
        role: 'user',
        date:userinfo.date,
        password: this.userForm.value.password,
      }

       userRef.set(userData, { merge: true }).then(d=>{
        this.deleteInstance(app2)
        this.router.navigateByUrl("/admin/user-list")
       }, e => {
        this.userCrudService.stopLoader()
        this.deleteInstance(app2)
        this.toastService.error("Üye oluşmadı", "Error")
      })
    }, e => {
      this.userCrudService.stopLoader()
      this.deleteInstance(app2)
      this.toastService.error("Üye oluşmadı", "Error")
    })

  
  }

  getUser(key) {
    this.userCrudService.startLoader()
    this.userCrudService.getSingle(key, "users").then(data => {
      this.userData = data.data()
      this.oldUserData = data.data()
      this.setUserFormValues(this.userData)
      this.userCrudService.stopLoader()
    }, e => {
      this.toastService.error("Üye versi gelmiyor", "Error")
      this.userCrudService.stopLoader()
    })
  }

  updateUser(userinfo) {
    this.userCrudService.startLoader()
    const app2=  firebase.initializeApp(environment.firebaseConfig, 'tempApp');
    app2.auth().signInWithEmailAndPassword(this.oldUserData.email, this.oldUserData.password).then(data => {

      data.user.updatePassword(userinfo.password).then(rt => {
        data.user.updateEmail(userinfo.email).then(email => {
          const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${data.user.uid}`);
          const userData = {
            uuid: data.user.uid,
            email: userinfo.email,
            role: 'user',
            password: userinfo.password,
          }
           this.deleteInstance(app2)
           userRef.set(userData, { merge: true }).then(data=>{
             this.router.navigateByUrl("/admin/user-list")

           })
        })

      })
    },e=>{
      this.handleError(app2,e)
      
    })




    // this.userCrudService.startLoader()
    // this.userCrudService.delete(this.user_id, "users").then(data => {
    //   this.userCrudService.create(userData, "users").then(data => {
    //     this.router.navigateByUrl("/admin/user-list")
    //   }, e => {
    //     this.userCrudService.stopLoader()
    //     this.toastService.error("Error Updating User", "Error")
    //   })
    // })

  }

  handleError(appName,e){
    this.userCrudService.stopLoader()
    this.deleteInstance(appName)
    this.toastService.error("Error Updating User", e)
  }

  setUserFormValues(userData) {
    this.userForm.patchValue({
      email: userData?.email,
      // password: this.encryptService.get(this.secretkey, userData?.password),
      password:userData.password,
      date: userData?.date,
      role: userData?.role,
      uuid: userData?.uuid
    })
  }


  deleteInstance(appName){
    appName.delete()
  }


  submitForm() {
    //let password = this.encryptService.set(this.secretkey, this.userForm.value.password);
    let userData = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      date: this.userForm.value.date,
      role: this.userForm.value.role,
      uuid: this.userForm.value.uuid
    }




    if (this.user_id) {
      this.updateUser(userData)
    }
    else {
      this.createUser(userData)
    }
  }


  get f() {
    return this.userForm.controls;
  }

  goBack() {
    this.router.navigateByUrl("/admin/user-list")
  }


}
