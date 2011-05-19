

BVApp.views.LocationMapPanel = Ext.extend(Ext.Panel,{
    /**
     @private
     */
    extMap: null,
    directionsService : null,
    directionsDisplay: null,
    marker: null, // used to show the position of the location if route not available
    initComponent: function () {
        //var center = new google.maps.LatLng(BVApp.utils.CurrentGeoPosition.latitude,BVApp.utils.CurrentGeoPosition.longitude);
        var mapOptions = {
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.extMap = new Ext.Map({
            mapOptions: mapOptions, 
            useCurrentLocation: true
        });
        Ext.apply(this, {
            items : [this.extMap]
        });
        this.directionsService = new google.maps.DirectionsService();
        this.directionsDisplay = new google.maps.DirectionsRenderer();


        BVApp.views.LocationMapPanel.superclass.initComponent.call(this);
    },
    showRoute: function(latSrc,longSrc,latDest,longDest){
        var src = new google.maps.LatLng(latSrc, longSrc);
        var dest = new google.maps.LatLng(latDest, longDest);
        var me = this;

        this.directionsDisplay.setMap(this.extMap.map);
        var request = {
            origin:src,
            destination:dest,
            travelMode: google.maps.DirectionsTravelMode.WALKING
        };
        var myMask = new Ext.LoadMask(this.getId(), {msg:BVApp.Main.getLangString("PleaseWait")});
        myMask.show();
        this.directionsService.route(request, function(result, status) {
            myMask.hide();
            if (status == google.maps.DirectionsStatus.OK) {
                me.directionsDisplay.setDirections(result);
            }else{ // if route navigation doesn't work just so the position of the location
                if(me.marker === null){
                    me.marker = new google.maps.Marker({
                        map: me.extMap.map,
                        position: dest
                    });
                }else{
                    me.marker.setPosition(dest);
                }
                me.extMap.map.setCenter(dest);
            }
        });
    }
});