
BVApp.views.MainTabPanel = Ext.extend(Ext.TabPanel,{    
    tabBar: {
        dock: 'bottom',
        layout: {
            pack: 'justify'
        }
    },

    ui: 'dark',
    cardSwitchAnimation: false,
    scroll:false,
    /**
     * @private
     */
    homePanel: null,
    emergencyPanel: null,
    passportPanel: null,
    favoritesPanel: null,
    optionPanel: null,

    initComponent: function(){
        this.homePanel = new BVApp.views.HomePanel();
        //this.emergencyPanel = new BVApp.views.EmergencyPanel();
        this.passportPanel = new BVApp.views.PassportPanel();
        this.favoritesPanel = new BVApp.views.FavoritesPanel();
        this.optionPanel = new BVApp.views.OptionPanel();

        this.items = [this.homePanel,this.favoritesPanel,this.passportPanel,this.optionPanel];

        this.on("cardswitch", function(cmp , newCard, oldCard, index, animated ){
            if(index==1){ //favorites
                if(this.favoritesPanel.getFavoriteList().getStore().getCount()===0){
                    BVApp.utils.AppUtils.alertMessage(BVApp.Main.getLangString("HelpTitle"),BVApp.Main.getLangString("HelpEmptyFavList"));
                }
            }
        });
        BVApp.views.MainTabPanel.superclass.initComponent.call(this);
    },
    getHomePanel: function(){
        return this.homePanel;
    },
    getFavoritesPanel: function(){
        return this.favoritesPanel;
    }


});