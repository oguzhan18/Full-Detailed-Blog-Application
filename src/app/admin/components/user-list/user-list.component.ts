import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserCrudService } from '@app/admin/services/user-services/user-crud.service';
import firebase from "firebase/app";
import "firebase/firestore";
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  UserList = []

  constructor(
    private router: Router,
    private userCrudService: UserCrudService,
    private toastrService: ToastrService,
    private afAuth:AngularFireAuth) { }

  ngOnInit(): void {
    this.getAllUserList()
  }

  async getAllUserList() {
    this.userCrudService.startLoader()
    this.afAuth.authState.subscribe(async user => {

    this.userCrudService.getAll("users").subscribe(data => {
      this.userCrudService.stopLoader()
      this.UserList = data.map(e => {
        return {
          key: e.payload.doc.id,
          email: e.payload.doc.data()['email'],
          password: e.payload.doc.data()['password'],
          date: e.payload.doc.data()['date'],
          
        };
      })

    }, e => {
      console.log(e)
      this.userCrudService.stopLoader()
      this.toastrService.error("Üye bilgileri gelmiyor!!!", "Error")
    });
  })
  }

  formatData(data) {
    let returnData = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        returnData.push({ ...data[key], key });
      }
    }
    return returnData
  }

  editUser(user) {
    this.router.navigateByUrl("/admin/edit-user/" + user.key)
  }

  async deleteUser(userData) {
    this.userCrudService.startLoader()
    if(firebase.app.name=="tempApp"){
      await firebase.app('tempApp').delete()
    }
    let app2 = firebase.initializeApp(environment.firebaseConfig, 'tempApp');

    app2.auth().signInWithEmailAndPassword(userData.email,userData.password).then(data=>{
      data.user.delete().then(d=>{
        this.userCrudService.delete(userData.key, "users").then(data => {
          this.userCrudService.stopLoader()
          this.deleteInstance(app2)
          this.getAllUserList();
        })
      })
    }, e => {
      this.userCrudService.stopLoader()
      this.toastrService.error("Üye bilgileri gelmiyor!!!", "Error")
      this.deleteInstance(app2)
    })

  }


  deleteInstance(appName){
    appName.delete()
  }
  addUser() {
    this.router.navigateByUrl("/admin/add-user")
  }

}

