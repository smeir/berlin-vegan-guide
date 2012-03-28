
BVApp.views.LocationPanel = Ext.extend(Ext.Panel,{

    /**
     * @private
     */
    toolbar: null,
    switcherToolbar: null,
    switcherSegmentedButton: null,
    descriptionPanel: null,
    detailsPanel:null,
    mapPanel:null,
    descriptionButton: null,
    detailsButton:null,
    mapButton:null,
    currentRestaurant:null,
    needsMapRefresh:true,
    favoritesButton: null,
    telCallButton: null,
    favStore: null,

    initComponent: function () {
        this.favStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteStoreID);
        var me=this;
        this.descriptionPanel = new BVApp.views.LocationDescriptionPanel();
        this.detailsPanel = new BVApp.views.LocationDetailsPanel();
        //TODO
        /*Ext.EventManager.addEventListener("telbutton","click",function(){
            BVApp.utils.AppUtils.dialTelNumber("00303");
        });*/
        var toolBarItems = [];
        if(!BVApp.utils.AppUtils.isAndroid()){ // add back button on non android platforms
            toolBarItems.push({
                text: BVApp.Main.getLangString("Back"),
                ui: 'back',
                handler: this.doBack,
                scope: this
            });
        }
        toolBarItems.push({
                xtype: "spacer"
        });

        if(BVApp.utils.AppUtils.isAndroid()){
            this.favoritesButton = new Ext.Button({
                iconMask: true,
                iconCls: 'favorites',
                handler: this.doFavorite,
                scope:this
            });
            toolBarItems.push(this.favoritesButton);
            this.telCallButton = new Ext.Button({
                iconMask: true,
                iconCls: 'phone1',
                handler: this.doTelCall,
                scope:this
            });
            toolBarItems.push(this.telCallButton);

            toolBarItems.push({
                iconMask: true,
                iconCls: 'compass3',
                handler: this.doNavigation,
                scope:this
            });
            toolBarItems.push({
                iconMask: true,
                iconCls: 'warning_black',
                handler: this.doReportError,
                scope:this
            });

        }else{
            toolBarItems.push({
                iconMask:true,
                iconCls:'action',
                handler:this.doAction,
                scope:this
            });
        }

        this.toolbar = new Ext.Toolbar({
            dock: 'top',
            items: toolBarItems
        });
        this.descriptionButton = new Ext.Button({
            scope:this,
            pressed: true,
            text: BVApp.Main.getLangString("Description"),
            handler: this.descriptionButtonClicked
        });
        this.detailsButton = new Ext.Button({
            scope:this,
            text   : '&nbsp;&nbsp;&nbsp;' + BVApp.Main.getLangString("Details") +'&nbsp;&nbsp;&nbsp;',
            handler: this.detailsButtonClicked
        });

        this.switcherSegmentedButton = new Ext.SegmentedButton({
            allowMultiple: false,
            items: [this.descriptionButton,this.detailsButton]
        });

        this.switcherToolbar = new Ext.Toolbar({
            dock: 'bottom',
            items: [this.switcherSegmentedButton],
            layout: {
                type: 'hbox',
                pack: 'center'
            }
        });
        Ext.apply(this, {
            autoDestroy: true,
            layout: "card",
            items: [this.descriptionPanel,this.detailsPanel],
            dockedItems: [this.toolbar,this.switcherToolbar],
            cardSwitchAnimation: false
        });
        BVApp.views.LocationPanel.superclass.initComponent.call(this);
    },
    constructor: function (a) {
        this.addEvents("back");
        BVApp.views.LocationPanel.superclass.constructor.call(this, a)
    },
    doBack: function(button,event){
        this.fireEvent("back");
    },
    doAction: function(button,event){
        var s = new BVApp.views.LocationActionSheet({
            currentRestaurant: this.currentRestaurant,
            locationPanel: this

        });
        s.show();
    },

    /**
     *
     * @param restaurant Ext.Data.Model
     */
    updateRestaurant: function(restaurant){
       if(typeof(google) !== 'undefined' && this.mapPanel === null){
            this.mapPanel = new BVApp.views.LocationMapPanel();
            this.mapButton = new Ext.Button({
                scope:this,
                text   : '&nbsp;&nbsp;'+BVApp.Main.getLangString("Map")+'&nbsp;&nbsp;&nbsp;&nbsp;',
                handler: this.mapButtonClicked
            });
            this.switcherSegmentedButton.add(this.mapButton);
        }
        this.currentRestaurant = restaurant;
        this.needsMapRefresh =true;
        this.toolbar.setTitle(Ext.util.Format.ellipsis(restaurant.get("name"),BVApp.Main.maxToolbarLetters));
        if(this.favoritesButton!=null){
            this.toggleButton(this.favoritesButton,this.isFavorite());
        }
        if(this.telCallButton!=null){
            var tel = this.currentRestaurant.get("telephone");
            if(tel.length>0){ // show only if telephone number available
                this.telCallButton.show();
            }else{
                this.telCallButton.hide();
            }
        }
        this.descriptionPanel.update({text: ""}); // delete before ajax call
        var openTimes = this.getOpenTimesData(restaurant);

        var detailData = Ext.apply({},restaurant.data,{
            currentLat: BVApp.utils.CurrentGeoPosition.latitude,
            currentLong: BVApp.utils.CurrentGeoPosition.longitude,
            openTimes: openTimes
        });

        this.detailsPanel.update(detailData);
        if(this.descriptionButton.el !== undefined){ // beim ersten mal noch nicht gerendert, so kein el vorhanden
            this.switcherSegmentedButton.setPressed(this.descriptionButton,true,true);
            this.setActiveItem(this.descriptionPanel);
        }
        if(restaurant.get("nameID") !== ""){
            var file = 'reviews/' + BVApp.utils.Settings.language +"/" + restaurant.get("nameID")+'.html';
            var fileDE = 'reviews/de/' + restaurant.get("nameID")+'.html';
            var me = this.descriptionPanel;
            BVApp.utils.AppUtils.loadFile(file,function(result){
                if(result === "" || result === undefined){ // file not found, try the german as backup
                    BVApp.utils.AppUtils.loadFile(fileDE,function(result){
                        me.update({
                            text: "<b>" + BVApp.Main.getLangString("TranslationNotAvailable","en") + "</b><br/><br/>" + result
                        });
                    });
                }
                else{
                    me.update({
                        text: result
                    });
                }
            });
        }else{
            this.descriptionPanel.update({
                text: BVApp.Main.getLangString("DescriptionNotAvailable")
            });
            if(this.detailsButton.el !== undefined){ // beim ersten mal noch nicht gerendert, so kein el vorhanden
                this.switcherSegmentedButton.setPressed(this.detailsButton,true,true);
                this.setActiveItem(this.detailsPanel);
            }

        }

    },
    /** returns an Array with calculate open times, including translation
     * [{
            day: "Mo-Di",
            time:"20 - 12 Uhr"
        },{
            day: "Mi-Do",
            time:"20 - 12 Uhr"
        }];
     * @param restaurant Restaurant Record
     */
    getOpenTimesData: function(restaurant){
        var resultArray = new Array();
        var openNames = [
            BVApp.Main.getLangString("DetailsMo"),
            BVApp.Main.getLangString("DetailsTues"),
            BVApp.Main.getLangString("DetailsWed"),
            BVApp.Main.getLangString("DetailsThur"),
            BVApp.Main.getLangString("DetailsFri"),
            BVApp.Main.getLangString("DetailsSat"),
            BVApp.Main.getLangString("DetailsSun")
        ];
        var openTimes = [restaurant.get("mo"),restaurant.get("tues"),restaurant.get("wed"),
            restaurant.get("thur"),restaurant.get("fri"),restaurant.get("sat"),restaurant.get("sun")
        ];

        var equalStart=-1;
            for ( var i = 0; i <= 6; i++) {

                if(openTimes[i] === openTimes[i+1]){ // nachfolger identisch,mach weiter
                    if(equalStart == -1){
                        equalStart = i;
                    }

                }else{
                    if(equalStart === -1){ // aktueller Tag ist einmalig
                        if(openTimes[i] === ""){  // geschlossen
                            resultArray.push({
                                day: openNames[i],
                                time: BVApp.Main.getLangString("DetailsClosed")
                            });

                        }else{
                            resultArray.push({
                                day: openNames[i],
                                time: openTimes[i] + " " + BVApp.Main.getLangString("DetailsOClock")
                            });
                        }

                    }else{// es gibt zusammenhängende Tage
                        if(openTimes[i] ===""){
                            resultArray.push({
                                day: openNames[equalStart] + "-" +openNames[i],
                                time: BVApp.Main.getLangString("DetailsClosed")
                            });
                        }else{
                             resultArray.push({
                                day: openNames[equalStart] + "-" + openNames[i],
                                time: openTimes[i] + " " + BVApp.Main.getLangString("DetailsOClock")
                            });
                        }
                        equalStart=-1;
                    }
                }
            }
        return resultArray;
    },
    descriptionButtonClicked: function(button,event){
        this.setActiveItem(this.descriptionPanel);
    },
    detailsButtonClicked: function(button,event){
        this.setActiveItem(this.detailsPanel);
    },
    mapButtonClicked: function(button,event){
        this.setActiveItem(this.mapPanel);
        if(this.needsMapRefresh){
            this.mapPanel.showRoute(
                    BVApp.utils.CurrentGeoPosition.latitude,
                    BVApp.utils.CurrentGeoPosition.longitude,
                    this.currentRestaurant.get("lat"),
                    this.currentRestaurant.get("long")
                    );
            this.needsMapRefresh=false;
        }

    },
    isFavorite: function(){
        var record = this.favStore.findRecord("lat",this.currentRestaurant.get("lat")); // if already fav?
        return record!==null;
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
        if(this.favoritesButton!=null){
            this.toggleButton(this.favoritesButton,this.isFavorite());
        }
        var favListStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteListStoreID);
        favListStore.updateFromFavorites();

    },
    doNavigation: function(){
        var lon = this.currentRestaurant.get("long");
        var lat = this.currentRestaurant.get("lat");
        BVApp.utils.AppUtils.doNavigation(lat,lon);
    },
    doTelCall: function(){
        var tel = this.currentRestaurant.get("telephone");
        if(tel.length >0){
            BVApp.utils.AppUtils.dialTelNumber(tel);
        }
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
    },
    /**
     *
     * @param {Ext.Button} button
     * @param {Boolean} selected
     */
    toggleButton: function(button,selected) {
        if (selected) {
            button.addCls("x-button-toogle-on");
            button.removeCls("x-button-toogle-off");
        } else {
            button.addCls("x-button-toogle-off");
            button.removeCls("x-button-toogle-on");
        }
    }
});