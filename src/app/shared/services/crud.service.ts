import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private firestore: AngularFirestore ,  private ngxLoader: NgxSpinnerService, ) { }

  getAll(key) {
    return this.firestore.collection(key).snapshotChanges().pipe(
      debounceTime(1000)
      //distinctUntilChanged() // or try this, ignores equal data
     );
  }

  create(dateObject: any, key) {
    return this.firestore.collection(key).add(dateObject);
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

  addAbout(key,data){
    return this.firestore.collection(key).add(data);
  }
  startLoader() {
    this.ngxLoader.show();
  }

  stopLoader() {
    this.ngxLoader.hide();
  }


  deleteUser(){

  }


  updateUser(){

  }

  
}
