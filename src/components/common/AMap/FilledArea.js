import React from 'react';
import PropTypes from 'prop-types';
import APILoader from 'react-amap/lib/utils/APILoader'

class FilledArea extends React.Component {
  constructor (props) {
  	super(props)

  	this.loader = new APILoader(props.amapkey).load();
  }
  componentDidMount() {
    this.loader.then(() => {
      const { AMap } = window;
      const {
        location,
        __map__,
        areaStyle
      } = this.props;

      const polygonStyle = {
        strokeWeight: 1,
        fillOpacity: 0.4,
        strokeColor: '#01BCEB',
        fillColor: '#002b3e',
        ...areaStyle
      }

      AMap.service('AMap.DistrictSearch', function() {
        var opts = {
          subdistrict: 1, //返回下一级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'city', //查询行政级别为 市
        };
        //实例化DistrictSearch
        var district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
        //行政区查询
        district.search(location, function(status, result) {
          let bounds = result.districtList[0].boundaries;
          // console.log(bounds);
          var polygons = [];
          if (bounds) {
            for (var i = 0, l = bounds.length; i < l; i++) {
              //生成行政区划polygon
              var polygon = new AMap.Polygon({
                map: __map__,
                path: bounds[i],
                ...polygonStyle
              });
              polygons.push(polygon);
            }
          }
        });
      });
    })

  }

  render() {
    return null;
  }
}

export default FilledArea;

FilledArea.propTypes = {
  location: PropTypes.string.isRequired,
  areaStyle: PropTypes.object
};
