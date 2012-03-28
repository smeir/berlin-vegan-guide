/**
 * a list with a "show more" entry on the bottom
 */
BVApp.views.LimitedList = Ext.extend(Ext.List,{
    /**
     * @cfg maxItems shows only the first x items in the listview
     */
    maxItems: 10,
    /**
     * @cfg showMoreText translated text for "show more" item on the end of the list
     */
    showMoreText: "showMore...",


    // private
    completeStore: null,
    bindStoreLimited: function(store){
        console.log("LimitedList:bindStoreLimited" + store);
        this.completeStore = store;
        var limitedStore = store; // default is original store
        if(store !== null && store.getCount()>this.maxItems){
            limitedStore = new Ext.data.ArrayStore({
            });
            for (var i = 0; i < this.maxItems; i++) {
                limitedStore.add(store.getAt(i));
            }
            // add "show more..."
            var showMore = Ext.ModelMgr.create({
                name : this.showMoreText,
                showMore: true,
                lat: 0
            }, 'Location');
            limitedStore.insert(limitedStore.getCount(),showMore);
        }
        this.bindStore(limitedStore);

    },

    // @private, copy of Ext.DataView onTap function, TODO check on every sencha touch update
    onTap: function(e) {
        console.log("onTap");
        var record = null;
        var item = this.findTargetByEvent(e);
        if (item) {
            Ext.fly(item).removeCls(this.pressedCls);
            var index = this.indexOf(item);
            if (this.onItemTap(item, index, e) !== false) {
                if(this.getStore().getAt(index).get("name") === this.showMoreText){ // show more tapped?
                    // show more, add additonal maxItems
                    for(var i=0;i<this.maxItems;i++){
                        record = this.completeStore.getAt(this.getStore().getCount()-1);
                        if(record !== undefined){
                            this.getStore().insert(this.getStore().getCount()-1,record);
                        }
                    }
                    // check if all times are showed, -> remove "show more"
                    if(this.getStore().getCount()-1===this.completeStore.getCount()){
                        this.getStore().removeAt(this.getStore().getCount()-1   )
                    }
                }else{
                    this.fireEvent("itemtap", this, index, item, e);
                }
            }
        }
        else {
            if(this.fireEvent("containertap", this, e) !== false) {
                this.onContainerTap(e);
            }
        }
    }
});