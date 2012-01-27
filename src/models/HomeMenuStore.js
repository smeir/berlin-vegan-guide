Ext.regModel("HomeMenu", {
    fields: ["Text", "Icon"]
});

BVApp.models.HomeMenuStore = Ext.extend(Ext.data.Store, {
    constructor: function (config) {
        if (!config) {
            config = {}
        }
        Ext.apply(config, {
            model: "HomeMenu",
            data: [{
                Text: BVApp.Main.getLangString("Restaurants"),
                Icon: "phone2.png",
                classID: "restaurants",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Imbiss"),
                Icon: "berlinmap.png",
                classID: "imbiss",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Cafes"),
                Icon: "emergency.png",
                classID: "cafes",
                disabled: false
            },{
                Text: BVApp.Main.getLangString("IceCafes"),
                Icon: "globe2.png",
                classID: "icecafes",
                disabled: false
            },
            {
                Text: BVApp.Main.getLangString("Shopping"),
                Icon: "phone2.png",
                classID: "shopping",
                disabled: false
            }],
            autoLoad: true,
            autoDestroy: true
        });
        BVApp.models.HomeMenuStore.superclass.constructor.call(this, config);
    }
});