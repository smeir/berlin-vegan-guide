
BVApp.models.LocationStore = Ext.extend(Ext.data.ArrayStore, {
    nowOpenFilter: null,
    veganDeclaredFilter: null,
    organicFilter:null,
    wheelchairFilter:null,
    dogsAllowedFilter: null,
    deliveryFilter:null,
    noReviewFilter:null,
    notOmnivorFilter:null,

    constructor : function(config){
        var me = this;
        this.nowOpenFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return me.isNowOpen(record);
            }
        });
        this.veganDeclaredFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("vegan") == "2" || record.get("vegan") == "4" || record.get("vegan") == "5";
            }
        });
        this.notOmnivorFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("vegan") == "3" || record.get("vegan") == "4" || record.get("vegan") == "5";
            }
        });
        this.organicFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("organic") == "1";
            }
        });
        this.wheelchairFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("wheelchair") == "1";
            }
        });
        this.dogsAllowedFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("dog") == "1";
            }
        });
        this.deliveryFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("delivery") == "1";
            }
        });

        this.noReviewFilter = new Ext.util.Filter({
            filterFn: function(record) {
                return record.get("nameID") !== "";
            }
        });

        BVApp.models.LocationStore.superclass.constructor.call(this,config);
    },

    updateDistance: function(){
        var p1 = new LatLon(BVApp.utils.CurrentGeoPosition.latitude,BVApp.utils.CurrentGeoPosition.longitude);
        this.each(function(record){
            var p2 = new LatLon(record.get("lat"),record.get("long"));
            var distance = p1.distanceTo(p2) * 1000;
            record.set("distance",distance);
            record.set("distanceStr",BVApp.utils.Format.formatDistance(distance));
        });
    },
    isNowOpen: function(record){
        var isOpen=true;
        var timeArray=null;
        var bv_open = [record.get("mo"),record.get("tues"),record.get("wed"),record.get("thur"),record.get("fri"),record.get("sat"),record.get("sun")];

        var currentDate = new Date();
        var currentDay = currentDate.getDay()-1;
        if(currentDay == -1) currentDay = 6; // sonntag
        var afterMidnight = false;
        if(currentDate.getHours()<6) afterMidnight = true; // vor 6 Uhr werden oeffnungszeiten vom Vortag genommen
        var currentDayMinute = currentDate.getHours() * 60 + currentDate.getMinutes(); // aktuelle Minute im Tag

        if(afterMidnight){
            currentDay--;
            if(currentDay == -1) currentDay = 6; // vorgänger vom montag ist sonntag
        }
        var timeStr = bv_open[currentDay];
        timeStr = timeStr.split(" ").join(""); // remove spaces
        if(timeStr ==""){
            isOpen=false;
        }else if (!afterMidnight){
            timeArray = timeStr.split("-");
            var openMinute = this.getDayMinute(timeArray[0]);
            var closeMinute = 23*60+59; //open end  = bis 0 uhr
            if(timeArray.length>1){
                if(openMinute < this.getDayMinute(timeArray[1])){ // nur wenn open < close, setze close, ansonsten ist 0 uhr defautl, ist false z.B. bei 12:00 - 03:00 Uhr ab
                    closeMinute = this.getDayMinute(timeArray[1]);
                }
            }
            if(currentDayMinute<openMinute || currentDayMinute>closeMinute){
                isOpen=false;
            }
        }else{ // nach Mitternacht
            timeArray = timeStr.split("-");
            if(timeArray.length>1){ // es gibt eine enduhrzeit
                if(this.getDayMinute(timeArray[0])<this.getDayMinute(timeArray[1])){ // wenn open<close, dann nicht über mitternacht auf, daher geschlossen
                    isOpen = false;
                }
                if(currentDayMinute > this.getDayMinute(timeArray[1])){ // wenn aktuelle stunde, größer als enduhrzeit -> geschlossen
                    isOpen = false;
                }
            }else{ // keine enduhrzeit also geschlossen
                isOpen = false;
            }
        }
        return isOpen;
    },
    getDayMinute: function(time){
        var timeArray = time.split(":"); // z.B: 12:20 Uhr
        var dayMinute = timeArray[0] * 60;
        if(timeArray.length>1){
            dayMinute = dayMinute + parseInt(timeArray[1]);
        }
        return dayMinute;
    }
});