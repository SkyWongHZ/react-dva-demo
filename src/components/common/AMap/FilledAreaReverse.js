import React from 'react';
import PropTypes from 'prop-types';
import APILoader from 'react-amap/lib/utils/APILoader'

class FilledAreaReverse extends React.Component {
  constructor (props) {
  	super(props)

    this.loader = new APILoader({key: props.amapkey, useAMapUI: true}).load();
  }
  componentDidMount() {
    this.loader.then(() => {
      const { AMap, AMapUI } = window;
      const { __map__, location, areaStyle } = this.props;
      let bounds = null;

      const polygonStyle = {
        lineJoin: 'round',
        strokeWeight: 1, //线宽
        strokeColor: '#01BCEB',
        strokeOpacity: 1,
        fillColor: '#051b2c', //填充色
        fillOpacity: 0.7, //填充透明度
        ...areaStyle
      }

      AMap.service('AMap.DistrictSearch', function () {
        var opts = {
          subdistrict: 1,   //返回下一级行政区
          extensions: 'all',  //返回行政区边界坐标组等具体信息
          level: 'city'  //查询行政级别为 市
        };
        //实例化DistrictSearch
        var district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
        //行政区查询
        district.search(location, function (status, result) {
          bounds = result.districtList[0].boundaries;
        });
      });
      AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
        initPage(DistrictExplorer);
      });

      function getAllRings(feature) {

        var coords = feature.geometry.coordinates;
        var rings = [];

        for (var i = 0, len = coords.length; i < len; i++) {
          rings.push(coords[i][0]);
        }

        return rings;
      }

      function getLongestRing(feature) {
        var rings = getAllRings(feature);

        rings.sort(function(a, b) {
          return b.length - a.length;
        });
        return rings[0];

      }

      function initPage(DistrictExplorer) {
        //创建一个实例
        var districtExplorer = new DistrictExplorer({
          map:__map__
        });

        districtExplorer.loadCountryNode(
          //只需加载全国和市，全国的节点包含省级
          function(error, areaNodes) {

            var path = [];

            //首先放置背景区域，这里是大陆的边界
            path.push(getLongestRing(areaNodes.getParentFeature()));

            path.push.apply(path, bounds)

            //绘制带环多边形
            //http://lbs.amap.com/api/javascript-api/reference/overlay#Polygon
            new AMap.Polygon({
              bubble: true,
              map: __map__,
              path: path,
              ...polygonStyle
            });
          });
      }
    })

  }

	render() {
	  return null;
  }
}

export default FilledAreaReverse

FilledAreaReverse.propTypes = {
  location: PropTypes.string.isRequired
}

