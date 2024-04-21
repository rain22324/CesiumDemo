<template>
  <div class="home">
    <div class="back" @click="goToFarm">回到农场</div>
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
// import router from '@/router'
window.CESIUM_BASE_URL = '/Cesium'

import * as Cesium from 'cesium';
import "../../../public/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://ion.cesium.com/tokens.
// Replace `your_access_token` with your Cesium ion access token.

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZDAwYzk3ZC1iMGM2LTQyNTctOTM1YS1mNjdhZmI5Y2Q2MWUiLCJpZCI6MTk4MTY2LCJpYXQiOjE3MDkwMTcyODN9.u7dr96zqf19e79K6HOoZWzl_hRUcQDnO024IVEunbWc';

export default {
  name: "",
  components: {},
  data() {
    return {
      viewer: null
    };
  },
  computed: {},
  methods: {
    async init() {
      // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
      this.viewer = new Cesium.Viewer('cesiumContainer', {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        infoBox: false,
        // shadows: true
      });

      const TDU_Key = "74f5d643156af91ec138ca4b3947b463"; // 天地图申请的密钥
      // 在线天地图影像服务
      const TDT_IMG_W =
        "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default&format=tiles&tk=" +
        TDU_Key;
      // 在线天地图影像中文标记服务(墨卡托投影)
      const TDT_CIA_W =
        "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        "&style=default.jpg&tk=" +
        TDU_Key;
      this.viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          // 调用影像地图中文服务
          url: TDT_IMG_W, // url地址
          layer: "img_w", // WMTS请求的层名称
          style: "default", // WMTS请求的样式名称
          format: "tiles", // MIME类型，用于从服务器检索图像
          tileMatrixSetID: "GoogleMapsCompatible", //	用于WMTS请求的TileMatrixSet的标识符
          subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 天地图8个服务器
          minimumLevel: 0, // 最小层级
          maximumLevel: 18, // 最大层级
        })
      );
      // this.viewer.imageryLayers.addImageryProvider(
      //   new Cesium.WebMapTileServiceImageryProvider({
      //     // 影像注记
      //     url: TDT_CIA_W,
      //     subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      //     layer: "cia_w",
      //     style: "default",
      //     format: "image/jpeg",
      //     tileMatrixSetID: "GoogleMapsCompatible",
      //   })
      // );

      // Add Cesium OSM Buildings, a global 3D buildings layer.
      const buildingTileset = await Cesium.createOsmBuildingsAsync();

      this.viewer.scene.primitives.add(buildingTileset);

      buildingTileset.style = new Cesium.Cesium3DTileStyle({
        color: "rgba(255, 255, 255, .6)"
      });

      this.viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(106.395130, 29.298034, 600),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-15.0),
        }
      });

      const stripeMaterial = new Cesium.StripeMaterialProperty({
        evenColor: Cesium.Color.WHITE.withAlpha(0.5),
        oddColor: Cesium.Color.BLUE.withAlpha(0.5),
        repeat: 5.0,
      });

      // 多边形
      const polygon = this.viewer.entities.add({
        polygon: {
          // 定义多边形的层次结构，包含多边形的顶点位置。
          hierarchy: {
            positions: Cesium.Cartesian3.fromDegreesArray([106.395130, 29.328034, 106.408230, 29.318034, 106.405130, 29.311534]),
          },
          // 设置多边形的材质颜色。
          material: stripeMaterial,
          // 设置多边形相对于地形的高度。
          // 设置多边形 extrudedHeight 属性，形成立体效果。
          // extrudedHeight: 200000,
          // 是否显示多边形轮廓。
          outline: true,
          // 设置多边形轮廓颜色。
          outlineColor: Cesium.Color.WHITE,
          // 是否填充多边形内部。
          fill: false,
        }
      })
      // 矩形
      const rectangle = this.viewer.entities.add({
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(106.395130, 29.308034, 106.408230, 29.318034),
          material: stripeMaterial,
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          fill: false
        }
      })
      // 圆形
      const circle = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(106.395130, 29.308034),
        ellipse: {
          semiMinorAxis: 25,
          semiMajorAxis: 25,
          rotation: Cesium.Math.toRadians(-40.0),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 4,
          stRotation: Cesium.Math.toRadians(90),
          material: stripeMaterial,
          fill: false
        }
      })
      // 模型
      // const model = this.viewer.entities.add({
      //   position: Cesium.Cartesian3.fromDegrees(106.395130, 29.308034),
      //   orientation: Cesium.Transforms.headingPitchRollQuaternion(
      //     Cesium.Cartesian3.fromDegrees(106.395130, 29.308034),
      //     new Cesium.HeadingPitchRoll(-90, 0.0, 0.0)
      //   ),
      //   model: {
      //     uri: "/assets/models/CesiumAir/Cesium_Air.glb",
      //     minimumPixelSize: 100,
      //     maximumScale: 10000,
      //     show: true
      //   }
      // })
      // 标签
      const label = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(106.395130, 29.308034),
        label: {
          text: 'cesium',
          font: '20px monospace',
          fillColor: Cesium.Color.WHITE,
        }
      })
      // 组合
      const entity = this.viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(106.395130, 29.308034, 100), // 定位实体的位置
        billboard: { // 添加一个billboard，即一个图片标记
          image: '/images/dev_icon.png', // 指定图片路径
          scale: 0.3, // 图片缩放比例
          // color: Cesium.Color.RED, // 图片颜色
        },
        label: { // 添加文本标签
          text: '电磁阀', // 标签文本内容
          font: '13px', // 字体大小
          fillColor: Cesium.Color.WHITE, // 文本颜色
          pixelOffset: new Cesium.Cartesian2(0, -40), // 文本相对于标记的偏移量
        },
        polyline: { // 添加多段线
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([106.395130, 29.308034, 0, 106.395130, 29.308034, 100]), // 线段的两个点，带高度
          material: Cesium.Color.WHEAT, // 线段的材质颜色
        },
      })

      const breed = this.viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(106.405130, 29.311534, 0), // 定位实体的位置
        billboard: { // 添加一个billboard，即一个图片标记
          image: '/images/dev_icon.png', // 指定图片路径
          scale: 0.3, // 图片缩放比例
          // color: Cesium.Color.RED, // 图片颜色
        },
        label: { // 添加文本标签
          text: '小麦', // 标签文本内容
          font: '13px', // 字体大小
          fillColor: Cesium.Color.WHITE, // 文本颜色
          pixelOffset: new Cesium.Cartesian2(0, -40), // 文本相对于标记的偏移量
        }
      })
    },
    goToFarm() {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(106.395130, 29.298034, 600),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-15.0),
        }
      });
    }
  },
  created() {},
  mounted() {
    this.init();
  },
}
</script>

<style lang='less' scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  .back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9990;
    cursor: pointer;
  }
  #cesiumContainer {
    width: 100%;
    height: 100%;
  }
}
</style>