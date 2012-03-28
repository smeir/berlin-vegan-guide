

BVApp.utils.Format = {
    /**
     *
     * @param distance in meter
     */
    formatDistance: function(distance){
        if(BVApp.utils.Settings.distanceUnit == "metric"){
            if(distance <1000){
                return distance.toFixed(0) + " m";
            }
            var d = (distance/1000).toFixed(1).toString();
            return  d.replace(".",",") + " km";
        }else{
            var yard = distance * 1.0936;
            if(yard<1000){
                return  yard.toFixed(0) + " yd";
            }else{
                return (yard/1760).toFixed(1) + " mi"; 
            }

        }
    },
    calcDist :function (lon1,lat1,lon2,lat2) {
        var r = 3963.0;
        var multiplier = 1;
        return multiplier * r * Math.acos(Math.sin(lat1/57.2958) *
                Math.sin(lat2/57.2958) +  Math.cos(lat1/57.2958) *
                Math.cos(lat2/57.2958) * Math.cos(lon2/57.2958 -
                lon1/57.2958));
    }
}