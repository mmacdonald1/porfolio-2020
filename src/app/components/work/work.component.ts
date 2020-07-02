import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  projects= [
    {
      name:"Hustler", 
      technologies:"React, Redux, Redux Thunk, React Router, Rails, Postgresql", 
      description:"A notecard creating and quizzing app", 
      url:"https://hustler-frontend.herokuapp.com/", 
      githubRepo:"https://github.com/mmacdonald1/hustler-frontend",
      imageList:["assets/Hustler1.png","assets/Hustler2.png","assets/Hustler3.png"]
    },  
    {
      name:"Rails Cookbook", 
      technologies:"Ruby on Rails, Bootstrap", 
      description:"A personal cookbook that your friends can view", 
      url:"https://rails-cookbook.herokuapp.com/", 
      githubRepo:"https://github.com/mmacdonald1/rails-cookbook",
      imageList:["assets/Cookbook1.png","assets/Cookbook2.png","assets/Cookbook3.png"]
    },
    {
      name:"Github API Project", 
      technologies:"React, ReactStrap", 
      description:"A simple UI to find Github profile information", 
      url:"https://mmacdonald1.github.io/Github-API-Project/", 
      githubRepo:"https://github.com/mmacdonald1/Github-API-Project",
      imageList:["assets/Git1.png"]
    }, 
    {
      name:"Leg Work", 
      technologies:"MySQL, Sequelize, Passport, Handlebars, Express, Node, JavaScript, Bootstrap", 
      description:"An application manager to help ease the job search process", 
      url:"https://legwork.herokuapp.com/", 
      githubRepo:"https://github.com/mmacdonald1/Leg-Work",
      imageList:["assets/Leg2.png","assets/Leg3.png","assets/Leg4.png"]
    }
  ]

  myIndex = 0
  myIndex2=0
  myIndex3=0
  constructor() { }

  ngOnInit() {
    this.carousel();
    this.carousel1();
    this.carousel3();
  }

  carousel = () =>{
    var i;
  var x = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  this.myIndex++;
  if (this.myIndex > x.length) {this.myIndex = 1}   
  x[this.myIndex-1].style.display = "block";  
  setTimeout(this.carousel, 2000); // Change image every 2 seconds
  }
  carousel1 = () =>{
    var i;
  var x = document.getElementsByClassName("mySlides1") as HTMLCollectionOf<HTMLElement>;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  this.myIndex2++;
  if (this.myIndex2 > x.length) {this.myIndex2 = 1}   
  x[this.myIndex2-1].style.display = "block";  
  setTimeout(this.carousel1, 2000); // Change image every 2 seconds
  }

  carousel3 = () =>{
    var i;
  var x = document.getElementsByClassName("mySlides3") as HTMLCollectionOf<HTMLElement>;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  this.myIndex3++;
  if (this.myIndex3 > x.length) {this.myIndex3 = 1}   
  x[this.myIndex3-1].style.display = "block";  
  setTimeout(this.carousel3, 2000); // Change image every 2 seconds
  }

}
