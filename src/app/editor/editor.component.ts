import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { generateObj, generateAmbientLight, generateAxesHelper, generateGridHelper } from './editor.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public container: any;
  public scene = new THREE.Scene(); // 三维场景
  public mainCamera: any;
  public renderer = new THREE.WebGLRenderer();
  private width = window.innerWidth;
  private height = window.innerHeight;

  selected = { name: '1234' };
  model = { name: 'Dr IQ' };

  onDownPosition: any;
  onUpPosition: any;
  onDoubleClickPosition: any;
  raycaster: any;
  mouse: any;


  constructor() { }

  ngOnInit(): void {
    this.container = document.getElementById('container');
    this.initScene();
    this.container!.append(this.renderer.domElement);
  }

  initMainCam() {
    this.mainCamera = new THREE.PerspectiveCamera(30, this.width / this.height, 1, 3000);
    this.mainCamera.position.set(292, 223, 185);
    this.mainCamera.lookAt(0, 0, 0);
  }

  initRenderer() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xd3df56, 1);
    this.renderer.debug.checkShaderErrors = true;
    document.body.appendChild(this.renderer.domElement);
  }

  getMousePosition(container: any, x: number, y: number) {

    const rect = container.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];

  }

  getIntersects(point: THREE.Vector2) {

    this.mouse.set((point.x * 2) - 1, - (point.y * 2) + 1);
    this.raycaster.setFromCamera(this.mouse, this.mainCamera);

    const objects: any[] = [];

    this.scene.traverseVisible(function (child: any) {
      objects.push(child);
    });

    return this.raycaster.intersectObjects(objects, false);

  }

  handleClick() {
    if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {

      let intersect = this.getIntersects(this.onUpPosition);
      if (intersect.length > 0) {
        intersect = intersect[0];
        this.selected = intersect.object;

        debugger
      }

    }

  }
  // subscribe mouse click event
  subMouseClick() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.onDownPosition = new THREE.Vector2();
    this.onUpPosition = new THREE.Vector2();
    this.onDoubleClickPosition = new THREE.Vector2();

    let onMouseUp = (event: { clientX: any; clientY: any; }) => {
      const array = this.getMousePosition(this.container, event.clientX, event.clientY);
      this.onUpPosition.fromArray(array);
      this.handleClick();
      document.removeEventListener('mouseup', onMouseUp);
    }

    this.container.addEventListener('mousedown', (event: { target: HTMLCanvasElement; clientX: number; clientY: number; }) => {
      if (event.target !== this.renderer.domElement) return;

      const array = this.getMousePosition(this.container, event.clientX, event.clientY);
      this.onDownPosition.fromArray(array);
      document.addEventListener('mouseup', onMouseUp);
    });
  }



  initScene() {

    this.scene.add(generateObj());
    this.scene.add(generateAmbientLight());
    this.scene.add(generateAxesHelper());
    this.scene.add(generateGridHelper());

    this.initMainCam();
    this.initRenderer();

    // 通过mainCamera调节视角
    const controls = new OrbitControls(this.mainCamera, this.renderer.domElement);

    // 渲染循环
    const render = () => {
      this.renderer.render(this.scene, this.mainCamera);
      requestAnimationFrame(render);
    }
    render();

    // 画布跟随窗口变化
    window.onresize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.mainCamera.aspect = window.innerWidth / window.innerHeight;
      this.mainCamera.updateProjectionMatrix();
    };

    this.subMouseClick();
  }

}