import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-dot-ball',
  templateUrl: './dot-ball.component.html',
  styleUrls: ['./dot-ball.component.scss']
})
export class DotBallComponent implements OnInit {
  @ViewChild('canvas',{static:false}) canvas: ElementRef;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({
    antialias:true
  });
  group = new THREE.Object3D();

  constructor() { }

  ngOnInit() {
    var bgColor = 0xf0f1f2;

// シーン作るぞ
// var scene = new THREE.Scene();
this.scene.fog = new THREE.FogExp2(bgColor, 0.005);

// カメラ作る
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );
this.camera.position.set(0,0,250);

// レンダラ作る
// var renderer = new THREE.WebGLRenderer({
//   antialias:true
// });
this.renderer.setClearColor( bgColor );
this.renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas').appendChild(this.renderer.domElement);

// グループつくる
// var group = new THREE.Object3D();

// 半径
var radius = 180;
var separation = 10;

for ( var s = 0; s <= 180; s+=separation ) {
  // 0 <= s <= 180, なんで -1 <= Math.cos(radianS) <= 1
  // なんで zが -radius <= z <= radius
  var radianS = s*Math.PI / 180;
  var pZ = radius * Math.cos(radianS);

  // 円に沿って点描く
  for ( var t = 0; t < 360; t+=separation ) {
    // 角度をラジアンに
    var radianT = t*Math.PI / 180;
    // 点の座標を計算
    // sin(radianS)は0→1→0の順で変化する
    // radius * sin(radianS)は0→200→0になる
    var pX = radius* Math.sin(radianS) * Math.cos(radianT);
    var pY = radius* Math.sin(radianS) * Math.sin(radianT);

    var geometory = new THREE.SphereGeometry(1.5,6,6);
    var material = new THREE.MeshBasicMaterial({
      color: 0x888888
    });
    var mesh = new THREE.Mesh(geometory, material);
    mesh.position.x = pX;
    mesh.position.y = pY;
    mesh.position.z = pZ;
    this.group.add(mesh);
  }

}

this.scene.add(this.group);

// 毎フレームアップデートするぞ

this.update();
  }

  update=()=> {
    // グループを回転
    var rotateX = this.group.rotation.x + 0.0005;
    var rotateY = this.group.rotation.y + 0.00125;
    var rotateZ = this.group.rotation.z + 0.0025;
    this.group.rotation.set( rotateX, rotateY, rotateZ );
  
    // レンダリング
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene,this.camera);
  
    // 次のアニメーション呼び出す
    requestAnimationFrame(this.update);
  }




}
