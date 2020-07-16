import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {Model} from './model';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';


@Component({
  selector: 'socketClient-log-monitor',
  templateUrl: './log-monitor.component.html',
  styleUrls: ['./log-monitor.component.css']
})
export class LogMonitorComponent implements OnInit {
  name = 'Angular';
  
  productForm: FormGroup;
  moveOrDelete=false;
  logFiles = [];
  createdRulesArray=[];
  deletedFiles=[];
  movedFiles=[];
  selectedLog;
  createRule=false;
  move=false;
  whattodo;
  days=false;
  size=false;
  noOfDays;
  sizeInMb;
  delete=false;
  ruleCreated=false;
  fName=false;
  fSize=false;
  old=false;
  num=false;

  constructor(private socket: Socket,private fb:FormBuilder) { 
    this.productForm = this.fb.group({
      ruleName: '',
      fileNameModifire:[''],
      fileName:'',
      fileSize:'',
      fileOld:'',
      fileNum:'',
      deleteOrBackup:'',
      
      conditionsForLog: this.fb.array([]) ,
    });
  }
  ngOnInit(): void {
    this.socket.emit('watchDocument', null);
 
    this.getAllDocuments();
    this.getAllChanges();

  }
  getAllChanges() {
    this.socket.on('deleted', (fname) => this.deletedFiles.push(fname));
    this.socket.on('moved', (fname) => this.movedFiles.push(fname));

    console.log(this.logFiles)
  
  }
  quantities() : FormArray {
    return this.productForm.get("conditionsForLog") as FormArray
  }
   
  newQuantity(): FormGroup {
    return this.fb.group({
      andor:'',
      COndition1:['']
    })
  }
   
  addQuantity() {
    this.quantities().push(this.newQuantity());
   this. createRule=true;
  //  this.fName=false;
  //  this.fSize=false;
  }
   
  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }
   
  onSubmit() {
    this.createdRulesArray.push(this.productForm.value)
    this.socket.emit('createRule', this.productForm.value);
    console.log(this.productForm.value);
  }
  getAllDocuments() {
    this.socket.emit("getAllDocuments", null)
    this.socket.on('allDocuments', (allFIles) => this.logFiles=allFIles);
    console.log(this.logFiles)
  }
  selected(value){
    this.selectedLog=value;
    console.log(this.selectedLog)
    this.createRule=true;
  }
  // moveOrDelete(value){
  //   if(value==='backup')
  //   {this.move=true}
  //   if(value==='delete'){
  //     this.delete=true
  //    // this.move=true
  //   }
  //   console.log(value);

  // }
  sizeorDays(value){
    this.moveOrDelete=true;
    if(value==='fSize'){
      this.size=true
    }
    if(value==='fOld'){
      this.old=true;
    }
    if(value==='fNumber'){
      this.num=true;
    }


  }
  createRules(){
    this.ruleCreated=true;
    var rule:Model={ fileName:this.selectedLog,move:this.move,delete:this.delete,size:this.sizeInMb,days:this.noOfDays}
    this.createdRulesArray.push(rule);
    console.log(this.selectedLog, this.move,this.noOfDays,this.sizeInMb)
    this.createRule=false;
    this.sizeInMb='';
    this.noOfDays='';
    this.move=false;
    this.delete=false;
    this.size=false;
    this.days=false;

  }
  Conditions(value){
    if(value==='fName'){
      this.fName=true;
    }
    if(value==='fSize'){
      this.size=true;
    }
  }
}
