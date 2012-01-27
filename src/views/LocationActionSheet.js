
BVApp.views.LocationActionSheet = Ext.extend(Ext.ActionSheet,{

    //Ext.data.Model
    currentRestaurant:null,
    locationPanel: null,

    /**
     * @private
     */
    favStore :null,
    initComponent: function () {
        this.favStore = Ext.StoreMgr.lookup(BVApp.Main.favoriteStoreID);
        var items = [{
                text: this.locationPanel.isFavorite(this.currentRestaurant) ? BVApp.Main.getLangString("ActionRemoveFromFavorites") : BVApp.Main.getLangString("ActionAddAsFavorites"),
                handler: this.doFavorite,
                scope:this
                //ui: 'decline'
            }/*,{
                text: BVApp.Main.getLangString("ActionSendAsEMail"),
                handler: this.doSendAsEMail,
                scope:this
            }*/
        ];
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

    doCancel: function(){
        this.hide();
    },

    doFavorite: function(){
        this.locationPanel.doFavorite();
        this.hide();
    },
    doReportError: function(){
        this.locationPanel.doReportError();
        this.hide();
    },
    doSendAsEMail: function(){
        var subject = this.currentRestaurant.get("name");
        var body = "";
        BVApp.utils.AppUtils.sendEMail(BVApp.Main.errorEMail,subject,body);
        this.hide();
    }

});