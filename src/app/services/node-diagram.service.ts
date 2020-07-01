import { Injectable } from '@angular/core';
var sankeyJSON = require('../../assets/data.json');

@Injectable({
  providedIn: 'root'
})
export class NodeDiagramService {

  sankey;

  constructor() {
    this.setSankey()
  }

  setSankey=()=>{
    this.sankey= sankeyJSON
  }

  getSankey=()=>{
    return this.sankey
  }

}

