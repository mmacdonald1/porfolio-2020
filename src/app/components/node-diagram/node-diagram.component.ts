import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation  } from '@angular/core';
import { NodeDiagramService } from '../../services/node-diagram.service';
import {D3Sankey} from  '../../models/D3Sankey';
import {SVGElementTypes} from  '../../models/SVGElementTypes';
import * as d3 from 'd3';
import * as d3Sankey from './d3-sankey-master/src/index.js';
import * as d3Tip from 'd3-tip';

@Component({
  selector: 'app-node-diagram',
  templateUrl: './node-diagram.component.html',
  styleUrls: ['./node-diagram.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodeDiagramComponent implements OnInit {

  @ViewChild('nodediagram', {static: true}) chartElement: ElementRef;

  //canvas width
  width = 650;
  //canvas height
  height = 600;
  //sankey data reference declaration
  sankeyJSON;
  //clicked node 
  currentSelection;
  //dropdown options and associated data
  mean= [0.27, 0.2, 2, 0.00, 0.00, 0.00];
  oneMin=[10.00, 10, 10, 0.00, 0.00, 0.00];
  fiveMin=[9.99, 10, 10, 0.00, 0.00, 0.00];
  fifteenMin=[8.96, 9.4, 19, 0.00, 0.00, 0.00];
  //initial dropdown values
  msgIn= this.mean[0];
  bytesIn= this.mean[1];
  bytesOut= this.mean[2];
  bytesRej= this.mean[3];
  failedFetch= this.mean[4];
  failedProd= this.mean[5];


  constructor(private nodeDiagramService: NodeDiagramService) {
    //setting imported sankey data to property
    this.sankeyJSON = this.nodeDiagramService.getSankey()
  }

  ngOnInit() {
    //on init draw the diagram and set up event listners
    this.drawChart()
  }
  
  // This is a massive function because d3 written to be in html. 
  // Anything I couldn't extract out because I needed an original SVG element is here
  drawChart() {
    //setting up the d3 zoom 
    const zoom = d3.zoom()
    .scaleExtent([0, 0])
    .on("zoom", zoomed);

    //on zoom transform function
    function zoomed() {
      if(typeof d3.event.transform.k === "number"){
        diagram.attr("transform", d3.event.transform);
      }
    }

    //select Angular ViewChild element, append svg tag 
    //set svg height and width
    //set canvas to be a viewbox so we can zoom
    var svg = d3.select(this.chartElement.nativeElement)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr("viewBox", `0, 0, ${this.width}, ${this.height}`)
    .call(zoom);

    // prevent mousepad zoom and panning
    svg.on("wheel.zoom", null);
    svg.on("mousedown.zoom", null);

    // add a diagram layer to svg, 
    // according to examples it seems easier to grab
    var diagram =  svg.append('g')
      .attr('id', 'diagram')

    //set up the on show tooltip
    // var tip = d3Tip()
    //   .attr('class', 'd3-tip')
    //   .direction('s')
    //   .html(`<div class="tooltip"><select id='dropdown'>
    //     <option value='mean'>Mean</option>
    //     <option value='oneMin'>1 min</option>
    //     <option value='fiveMin'>5 min</option>
    //     <option value='fifteenMin'>15 min</option>
    //   </select> <br/> <div class="tooltip-info"><p id="top-info-text" class="info-text">${this.msgIn} Messages in /sec</p> 
    //   <br/> <p class="info-text">${this.bytesIn}m Bytes In</p> <br/> <p class="info-text">${this.bytesOut}m Bytes Out</p> 
    //   <br/> <p class="info-text">${this.bytesRej} Bytes rejected/ sec</p> <br/> <p class="info-text">${this.failedFetch} Failed fetch request / sec</p>
    //   <br/> <p class="info-text">${this.failedProd} Failed produce requested/sec</p></div></div>`
    //   )
    // //add to svg
    // svg.call(tip);
   

    //initialize sankey with nodeWidth, nodePadding, and extent (padding 30px)
    var sankey = d3Sankey.sankey()
        .nodeWidth(25)
        .nodePadding(40)
        .extent([[30, 30], [this.width-30, this.height-30]]);

    
    // run data through sankey formatter
    sankey(this.sankeyJSON);


    //define definition tag (svg specific concept)
    var defs = diagram.append("defs");

    //define warning gradient
    let radialGradientWarning= defs.append("radialGradient")
      .attr("id", "radial-gradient-warning")
      .attr("cx", "50%")
      .attr("cy","50%")
      .attr("r", "50%")

    //define warning gradient colors
      radialGradientWarning.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#ffcc66");

      radialGradientWarning.append("stop")
      .attr("offset", "90%")
      .attr("stop-color", "#EFEFEF");

    //define danger gradient
    let radialGradientDanger= defs.append("radialGradient")
    .attr("id", "radial-gradient-danger")
    .attr("cx", "50%")
    .attr("cy","50%")
    .attr("r", "50%")

    //define danger gradient colors
    radialGradientDanger.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "red");

    radialGradientDanger.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "#EFEFEF");

      //define selected gradient
      let radialGradientSelected= defs.append("radialGradient")
      .attr("id", "radial-gradient-selected")
      .attr("cx", "50%")
      .attr("cy","50%")
      .attr("r", "50%")

      //define selected gradient colors
      radialGradientSelected.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#6678DD");
  
        radialGradientSelected.append("stop")
      .attr("offset", "90%")
      .attr("stop-color", "#EFEFEF");



    //build path group and set attributes
    var link = diagram.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll("path")

    //define each link 
    //(Note: I have modified sankeyLinkHorizontal for this specific graph)
    link = link
    .data(this.sankeyJSON.links)
    .enter().append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke-width", 2)
    .attr("id", function (d,i) { return `${i}-link` })
    .attr("class", "links")


    //build node group and set attributes
    var node = diagram.append("g")
        .attr("class", "nodes")
        .attr("font-family", "tahoma")
        .attr("font-size", 10)
        .selectAll("g")

      //define each node
      node = node
          .data(this.sankeyJSON.nodes)
          .enter().append("g")
          .attr("id", function (d,i){ return `${i}-node`})
          .on("click",(d:D3Sankey,i:any)=>{
            // grab the node group by id
            let contextNode = document.getElementById(`${i}-node`)
            // check if node is active (means it is currently visible)
            if (d.active) { 
              // if the last selected node is different 
              // and this node is a broker 
              if(this.currentSelection !== i && d.type === "broker"){
                //set new selected node styles
                this.handleClickHex(d,i)
                //zoom element to middle
                // and at the end show tooltip and dropdown event listener  
                diagram.transition().duration(750).call(
                  zoom.transform,
                  d3.zoomIdentity.translate(this.width / 2, this.height / 2).scale(1).translate(-d.x1, -d.y1),
                ).on("end", ()=>{
                  // tip.show(d,contextNode)
                  // let dropdown= document.getElementById("dropdown")
                  // dropdown.addEventListener("change",this.dropdownChange) 
                } )
              }else{
                //if if the node was already selected reset graph 
                //let handleClickHex set selected consumer or producer
                //hide tooltip
                diagram.transition().duration(0).call(
                  zoom.transform,
                  d3.zoomIdentity
                );
                this.handleClickHex(d,i)
                // tip.hide(d,contextNode)
              }
            }else{
              //if not visible no event listener please
              return null
            }

          
          });

      
        
      //define circle and add styles based on node health -- defined in data.json
      node.append("circle")
      .attr("r", 30)
      .attr("id", function (d,i) { return `${i}-gradient` })
      .attr("class", "gradients")
      .attr("opacity", function (d: any) { 
        if(d.health==="regular"){
          return "0"
        }else{
          return "0.4"
        }
      })
      .attr("cx", function (d: any) { return d.x0 + (d.value/2) -2; })
      .attr("cy", function (d: any) { return d.y0 + (d.value/2) -3; })
      .style("fill", function (d: any) { 
        if(d.health === "warning"){
          return "url(#radial-gradient-warning)"
        }
        else if(d.health === "danger"){
          return "url(#radial-gradient-danger)"
        }else{
          return "url(#radial-gradient-selected)"
        }
      })
    

      //put the polygon on top and define attributes
      node.append("polygon")
      .attr("points", function (d: any) {
        // top top-right bottom-right bottom bottom-left top-left
        return `${d.x0 + (d.value/2)-2},${d.y0-2} ${d.x0 + d.value -3},${d.y0+(d.value/4)-2} ${d.x0 +d.value -3},${d.y1-(d.value/4)-2} ${d.x0+(d.value/2)-2},${d.y1-2} ${d.x0-1},${d.y1-(d.value/4)-2} ${d.x0-1},${d.y0+(d.value/4)-2}`
      })
      .attr("fill", function (d: any) { return "#fff" })
      .attr("id", function (d,i) { return `${i}-polygon` })
      .attr("class", function (d:any) {return "polygons " + d.health})
      .attr("stroke", "#707070")
      .attr("stroke-width", 4)


      //put on text and hide it
      //node name
      node.append("text")
      .attr("class", function (d:any) {return "text"})
      .attr("id", function (d,i) { return `${i}-text` })
      .attr("x", function (d: any) { return d.x0 + (d.value/2)-2; })
      .attr("y", function (d: any) { return d.y1 + d.value +20; })
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .text(function (d: any) {return d.name})

      //call for random dot every 200ms
      setInterval(()=>{ 
        this.handleDots()
      }, 200);
    }
  //called when polygon node is clicked
  handleClickHex=(d, i)=>{
    // if the clicked polygon is not already selected
    if(this.currentSelection !== i){
      //set selected node index
      this.currentSelection=i
      //reset chart
      this.revertChart()
      //set everything to non-visible styles
      this.greyItAll()
      //find and style the proper connected nodes and links
      this.highlight_node_links(d,i)
      //style the clicked node
      this.setSelectedPolygon(d,i)
    }else{
      //if the polygon was selected set property to none selected
      //reset the chart
      this.currentSelection=null;
      this.revertChart()
    }
    
  }

  setSelectedPolygon=(d,i)=>{
    let polygon = document.getElementById(`${i}-polygon`)
    //change stroke color, width, size
    //set selected node active to true
    d3.select(polygon)
    .attr("class", "selected polygons")
    .attr("opacity", 1)
    .attr("stroke-width", 6)
    .attr("points", function (d: any) {
      d.active = true
      // top top-right bottom-right bottom bottom-left top-left
      return `${d.x0 + (d.value/2)-2},${d.y0-2-5} ${d.x0 + d.value -3 +4},${d.y0+(d.value/4)-2-2} ${d.x0 +d.value -3 +4},${d.y1-(d.value/4)-2+2} ${d.x0+(d.value/2)-2},${d.y1-2+5} ${d.x0-1-4},${d.y1-(d.value/4)-2+2} ${d.x0-1-4},${d.y0+(d.value/4)-2-2}`
    })

    //Bring in selected gradient
    let gradient = document.getElementById(`${i}-gradient`)
    d3.select(gradient)
    .attr("opacity", 0.4)
    .style("fill", "url(#radial-gradient-selected)")
    .attr("r","40")

    // Bring in the text
    let text = document.getElementById(`${i}-text`)
    d3.select(text)
    .attr("opacity",1)
  }

  highlight_node_links=(node,i)=>{
    //this one is a doozy attachNodes1 is where 
    //I am pushing the nodes connected to the node you clicked on
    //if you are a producer though we will also need the nodes 
    //connected to the attachedNodes
    //We are highlighting links as we go
    let currentIndex =i
    let attachedNodes1=[];
    let totalAttachedNodes=[]

    var traverse = [{
                      linkType : "sourceLinks",
                      nodeType : "target"
                    },{
                      linkType : "targetLinks",
                      nodeType : "source"
                    }];
    //first level 
    traverse.forEach((step)=>{
      node[step.linkType].forEach((link)=> {
        this.highlight_link(link.index);
        if(link.target.index === currentIndex){
          attachedNodes1.push(link.source)
          totalAttachedNodes.push(link.source)
        }else{
          attachedNodes1.push(link.target)
          totalAttachedNodes.push(link.target)
        }
      });
      //second level
      attachedNodes1.forEach((aNode)=>{
        aNode[step.linkType].forEach(link=> {
            if(node.type === "producer" && link.source.type !== "producer"){
              totalAttachedNodes.push(link.target)
              this.highlight_link(link.index);
            }else if(node.type === "consumer"){
              totalAttachedNodes.push(link.source)
              this.highlight_link(link.index);
            }
        })
      })
      
    });
    //send nodes to be styled
    this.correspondingNodes(totalAttachedNodes)
  
  }

  //style selected links and set as active
  highlight_link=(i)=>{
    let link = document.getElementById(`${i}-link`)
    d3.select(link)
    .style("stroke-opacity", function(d:any){
      d.active=true
      return 0.6
    })
  }
  
  correspondingNodes=(attachedNodes)=>{
    //for each node we are styling polygon and gradient 
    //and setting polygon to active
    attachedNodes.forEach(node => {
      let polygon = document.getElementById(`${node.index}-polygon`)
      let gradient = document.getElementById(`${node.index}-gradient`)
      //set correspondingNodes active to true
      d3.select(polygon)
      .attr("fill", "#707070")
      .attr("class", "selected-sub polygons")
      .attr("opacity", function(d:any){
        d.active = true
        return 1
      })

      d3.select(gradient)
      .attr("opacity", 0)
    })
  }


  revertChart=()=>{
    //everything we styled we are reseting
    let allPolygons = Array.from(document.getElementsByClassName('polygons'))
    let allGradients = Array.from(document.getElementsByClassName('gradients'))
    let allLinks = Array.from(document.getElementsByClassName('links'))
    let allText= Array.from(document.getElementsByClassName('text'))
    let allDots = Array.from(document.getElementsByClassName('dots'))

    allDots.forEach(dot=>{
      d3.select(dot)
      .attr("opacity", 1)
    })
   
    allPolygons.forEach(poly=>{
      d3.select(poly)
      .attr("fill", "#fff")
      .attr("class",  function (d:any) {return "polygons " + d.health})
      .attr("opacity", 1)
      .attr("stroke-width", 4)
      .attr("points", function (d: any) {
        d.active=true
        // top top-right bottom-right bottom bottom-left top-left
        return `${d.x0 + (d.value/2)-2},${d.y0-2} ${d.x0 + d.value -3},${d.y0+(d.value/4)-2} ${d.x0 +d.value -3},${d.y1-(d.value/4)-2} ${d.x0+(d.value/2)-2},${d.y1-2} ${d.x0-1},${d.y1-(d.value/4)-2} ${d.x0-1},${d.y0+(d.value/4)-2}`
      })
     })
    allGradients.forEach(grad=>{
      d3.select(grad)
      .attr("r","30")
      .attr("opacity", function (d: any) { 
        if(d.health==="regular"){
          return "0"
        }else{
          return "0.4"
        }
      })
      .style("fill", function (d: any) { 
        if(d.health === "warning"){
          return "url(#radial-gradient-warning)"
        }
        else if(d.health === "danger"){
          return "url(#radial-gradient-danger)"
        }else{
          return "url(#radial-gradient-selected)"
        }
      })
    })
  
    allLinks.forEach(link=>{
      d3.select(link)
      .style("stroke-opacity", function(d:any) {
        d.active=true
        return 0.2
      })
    })

    allText.forEach(text=>{
      d3.select(text)
      .attr("opacity",0)
    })
    
  }

  greyItAll=()=>{
    //make all elements opacity 0 and set active to false
    let allPolygons = Array.from(document.getElementsByClassName('polygons'))
    let allGradients = Array.from(document.getElementsByClassName('gradients'))
    let allLinks = Array.from(document.getElementsByClassName('links'))
    let allDots = Array.from(document.getElementsByClassName('dots'))

    allDots.forEach(dot=>{
      d3.select(dot)
      .attr("opacity", 0)
    })
   //set polygon opacity and active to false
    allPolygons.forEach(poly=>{
      d3.select(poly)
      .attr("opacity", function (d:any) {
        d.active = false
        return 0
      })
     })
    allGradients.forEach(grad=>{
      d3.select(grad)
      .attr("opacity", 0) 
    })
    allLinks.forEach(link=>{
      d3.select(link)
      .style("stroke-opacity", function(d:any){
        d.active = false
        return 0
      })
    })
  }
  
  assignBrokerInfoValues=(prop)=>{
    //on change of dropdown set new info values
    this.msgIn= prop[0];
    this.bytesIn= prop[1];
    this.bytesOut= prop[2];
    this.bytesRej= prop[3];
    this.failedFetch= prop[4];
    this.failedProd= prop[5];
    //refresh the DOM
    let redrawTooltip = document.getElementsByClassName('tooltip-info')
    redrawTooltip[0].innerHTML=`<p id="top-info-text" class="info-text">${this.msgIn} Messages in /sec</p> 
    <br/> <p class="info-text">${this.bytesIn}m Bytes In</p> <br/> <p class="info-text">${this.bytesOut}m Bytes Out</p> 
    <br/> <p class="info-text">${this.bytesRej} Bytes rejected/ sec</p> <br/> <p class="info-text">${this.failedFetch} Failed fetch request / sec</p>
    <br/> <p class="info-text">${this.failedProd} Failed produce requested/sec</p>`

  }

  dropdownChange =(e)=>{
    //grab changed select value from DOM 
    //and send the property with the right array
    let dropdown= document.getElementById("dropdown") as HTMLSelectElement;
    let selectedVal= dropdown.options[dropdown.selectedIndex].value
    switch(selectedVal) {
      case "oneMin":
        this.assignBrokerInfoValues(this.oneMin)
        break;
      case "fiveMin":
        this.assignBrokerInfoValues(this.fiveMin)
        break;
      case "fifteenMin":
        this.assignBrokerInfoValues(this.fifteenMin)
      break;
      default:
        this.assignBrokerInfoValues(this.mean)
    }
  }

  handleDots=()=>{
    //determine total num of nodes 
    let numNodes = this.sankeyJSON.nodes.length;
    // num of dots per function call
    let numDots=1

    //for the num of dots make a dot for each
    for(let i=0; i<numDots; i++){
      let currNode = this.generateNode(numNodes)
      let currNodeIndex;
      let type;
      let active;
      d3.select(currNode).each(function(d:D3Sankey){
        type = d.type
        currNodeIndex = d.index
        active = d.active
      })
      let poly = document.getElementById(`${currNodeIndex}-polygon`)
      //if not consumer and visible make a dot
      if(type !== "consumer" && active){
        let dot = d3.select(currNode)
        .append('circle')
        .attr("class","dots")
        .attr("r", 4)
        .attr("fill", "#707070")
        .transition()
        .duration(5000)
        .attrTween("transform",this.translateAlongPath(currNode))
        .remove();
        //put the polygon on top
        d3.select(poly).raise()
      }
    }

  }

  generateNode = (numNodes) =>{
    // generate a random number based on number of nodes
    // send back the node with that index
    let r = Math.floor(Math.random() * Math.floor(numNodes-1));
    let randomNode = document.getElementById(`${r}-node`)
    return randomNode
  }

  translateAlongPath = (currNode) =>{
    //get all the source paths for the random node
    let paths = this.findLinks(currNode)
    //pick a random source path
    let n = Math.floor(Math.random() * Math.floor(paths.length));
    let chosenPathRef = paths[n]
    //if that path is visible translate the dot along the path
    if(chosenPathRef.active){
      let chosenPathHtml = document.getElementById(`${chosenPathRef.index}-link`) as unknown as SVGElementTypes
      var l = chosenPathHtml.getTotalLength();
      return function(d, i, a) {
        return function(t) {
          var p = chosenPathHtml.getPointAtLength(t * l);
          return "translate(" + (p.x) + "," + p.y + ")";
        };
      };
    }
  }

  findLinks = (node) =>{
    //find and retrun sourceLinks
    let attachedLinks1=[];
    let nodeRef;

    d3.select(node).each(function(d){nodeRef=d})

    //first level 
      if(nodeRef["sourceLinks"][0]){
        nodeRef["sourceLinks"].forEach((link)=> {
          attachedLinks1.push(link)
        });
      }      
      return attachedLinks1
  }

}




