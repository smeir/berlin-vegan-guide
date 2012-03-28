
BVApp.utils.CurrentGeoPosition = new Object({
    // default is Berlin Center
    latitude: 52.518611,
    longitude: 13.408056,
    geo: null,
    // error already showed, display it only once
    errorShowed:false,
    /** call the callback only 1 times*/
    callbackCounter:0,
    updateLocation: function(callback){
        var me = this;
        me.callbackCounter=0;
        if(this.geo === null){
            this.geo =new Ext.util.GeoLocation({
                autoUpdate: true,
                scope:this,
                listeners: {
                    locationupdate: function (geo) {
                        BVApp.utils.CurrentGeoPosition.latitude = geo.latitude;
                        BVApp.utils.CurrentGeoPosition.longitude = geo.longitude;
                        if(me.callbackCounter===0){
                            me.callbackCounter=1;
                            callback();
                        }
                    },
                    locationerror: function (   geo,
                                                bTimeout,
                                                bPermissionDenied,
                                                bLocationUnavailable,
                                                message) {
                        if(bPermissionDenied){
                            if(!BVApp.utils.CurrentGeoPosition.errorShowed){
                                BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("PositionAlertTitle"), BVApp.Main.getLangString("PositionAlert"));
                                BVApp.utils.CurrentGeoPosition.errorShowed = true;
                            }
                            if(me.callbackCounter===0){
                                me.callbackCounter=1;
                                callback();
                            }
                        }
                    }
                }
            });
        }
        this.geo.updateLocation();
    }
});
