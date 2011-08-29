
BVApp.views.LocationActionSheet = Ext.extend(Ext.ActionSheet,{

    //Ext.data.Model
    currentRestaurant:null,

    /**
     * @private
     */
    favStore :null,
    initComponent: function () {
        this.favStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteStoreID);
        var items = [{
                text: this.isFavorite(this.currentRestaurant) ? BVApp.Main.getLangString("ActionRemoveFromFavorites") : BVApp.Main.getLangString("ActionAddAsFavorites"),
                handler: this.doFavorite,
                scope:this
                //ui: 'decline'
            }/*,{
                text: BVApp.Main.getLangString("ActionSendAsEMail"),
                handler: this.doSendAsEMail,
                scope:this
            }*/
        ];
        if(BVApp.utils.AppUtils.isAndroid()){
            var tel = this.currentRestaurant.get("telephone");
            if(tel.length>0){ // show only if telephone number available
                items.push({
                    text: BVApp.Main.getLangString("ActionCall"),
                    handler: this.doTelCall,
                    scope:this
                });
            }
            items.push(({
                    text: BVApp.Main.getLangString("ActionNavigation"),
                    handler: this.doNavigation,
                    scope:this
            }))
        }
        items.push({
            text: BVApp.Main.getLangString("ActionReportError"),
            handler: this.doReportError,
            scope:this
        });
        items.push({
            text: BVApp.Main.getLangString("ActionCancel"),
            ui  : 'confirm',
            handler: this.doCancel,
            scope:this
        });
        Ext.apply(this, {
            items: items
        });
        BVApp.views.LocationActionSheet.superclass.initComponent.call(this);
    },
    doTelCall: function(){
        var tel = this.currentRestaurant.get("telephone");
        if(tel.length >0){
            BVApp.utils.AppUtils.dialTelNumber(tel);
        }
        this.hide();
    },
    doCancel: function(){
        this.hide();
    },
    doNavigation: function(){
        var lon = this.currentRestaurant.get("long");
        var lat = this.currentRestaurant.get("lat");
        BVApp.utils.AppUtils.doNavigation(lat,lon);
        this.hide();
    },
    doFavorite: function(){
        var record = this.favStore.findRecord("lat",this.currentRestaurant.get("lat")); // if already fav?
        if(record === null){
            var fav = new BVApp.models.Favorite({
                id: this.favStore.getCount()+1,
                lat : this.currentRestaurant.get("lat")
            });
            this.favStore.add(fav);
        }else{
            this.favStore.remove(record);
        }
        this.favStore.sync();
        this.hide();
        var favListStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteListStoreID);
        favListStore.updateFromFavorites();
    },
    doReportError: function(){
        var subject = BVApp.Main.getLangString("EMailError") + " " + this.currentRestaurant.get("name") + " , " + this.currentRestaurant.get("street");
        var body ="";
        if(BVApp.utils.AppUtils.isPhoneGap()){
            body += BVApp.Main.getLangString("EMailPleaseEnterErrorDescription") + "\n";
            body += "\n\n\n\n\n";
            body += BVApp.Main.getAppInfoPhoneGapForEMail();            
        }
        BVApp.utils.AppUtils.sendEMail(BVApp.Main.errorEMail,subject,body);
        this.hide();
    },
    doSendAsEMail: function(){
        var subject = this.currentRestaurant.get("name");
        var body = "";
        BVApp.utils.AppUtils.sendEMail(BVApp.Main.errorEMail,subject,body);
        this.hide();
    },
    isFavorite: function(){
        var record = this.favStore.findRecord("lat",this.currentRestaurant.get("lat")); // if already fav?
        return record!==null;
    }

});