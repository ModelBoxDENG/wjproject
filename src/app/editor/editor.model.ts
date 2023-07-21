import * as THREE from 'three';
// 创建网格模型对象
export function generateObj() {
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  // 漫反射网格材质；MeshLambertMaterial
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent: true, //开启透明
    opacity: 0.5, //设置透明度
  });
  const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  mesh.name = "test1";
  return mesh;
}

//光源设置
export function generateAmbientLight() {
  const light = new THREE.AmbientLight(0x404040, 10); // 柔和的白光
  return light;
}

export function generateGridHelper() {
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  return gridHelper;
}

//坐标系
export function generateAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  return axesHelper;
}