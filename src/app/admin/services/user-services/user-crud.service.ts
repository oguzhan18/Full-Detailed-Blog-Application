import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserCrudService {
  constructor(private firestore: AngularFirestore ,  private ngxLoader: NgxSpinnerService, ) { }

  getAll(key) {
    return this.firestore.collection(key,ref=> ref.where('role', '==', 'user')).snapshotChanges().pipe(
      debounceTime(1000)
      //distinctUntilChanged() // or try this, ignores equal data
     );
  }

  create(dateObject: any, key) {
    return this.firestore.collection(key).doc(dateObject.email).set(dateObject);
  }
  
  getSingle(id,key){
   return this.firestore.collection(key).doc(id).ref.get()
  }
  update(dateObject: any, key,id) {
    delete dateObject.id;
    return this.firestore.doc(key + "/" + id).update(dateObject);
  }
  delete(objId: string, key) {
    return this.firestore.doc(key + "/" + objId).delete();
  }

  startLoader() {
    this.ngxLoader.show();
  }

  stopLoader() {
    this.ngxLoader.hide();
  }
  
}

