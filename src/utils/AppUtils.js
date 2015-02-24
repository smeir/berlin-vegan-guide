BVApp.utils.AppUtils = {



    android : false,
    //public
    loadFile: function(fileName,callback){
        console.log("loadFile");
        callback(BVApp.models.Data[fileName]);
        /* Ext.Ajax.request({
            url: fileName,
            success: function(response, opts) {
                callback(response.responseText);
            },
            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
                */
    },
    sendEMail: function(email,subject,body){
        console.log("enter sendEMail");
        if(this.isPhoneGap()){
            if(this.isIPhone()){
             window.plugins.emailComposer.showEmailComposer(subject,body,email);
            }else if(this.isAndroid()){
                bvappObj.sendEMail(email, subject, body);
            }
        }else{
            this.alertMessage(BVApp.Main.getLangString("OptionsHint"),BVApp.Main.getLangString("EMailOnlyInNativeApp"));
        }

    },
    dialTelNumber: function(number){
        console.log("enter dialTelNumber");
        if(this.isAndroid()){
            bvappObj.dialTelNumber(number);
        }
    },
    doNavigation: function(lat,lon){
        console.log("doNavigation not implemented");

    },
    doNavigationToAdress: function(address){
        console.log("enter doNavigationToAdress");
        if(this.isAndroid()){
            bvappObj.doNavigation(address);
        }
    },
    isIPhone: function(){
        return device.name.indexOf("iPhone") !== -1 || device.platform.indexOf("iPhone") !== -1;
    },
    isAndroid: function(){
        return this.android;
    },
    isPhoneGap: function(){
        //return (typeof device !== "undefined");
        return this.isAndroid() || this.isIPhone();
    },
    alertMessage: function(title,message){
        if(this.isPhoneGap()){
            if(this.isIPhone()) {
                navigator.notification.alert(message,Ext.emptyFn,title);
            }{
                bvappObj.alert(message,title);
            }

        }else{
            Ext.Msg.alert(title,message, Ext.emptyFn);
        }

    },

    hasConnection: function(){
        var connection = true;
        if(this.isPhoneGap()){
            var networkState = navigator.network.connection.type;
            if(networkState == Connection.NONE){
                connection = false;
            }

        }
     return connection;
    },
    quitApp: function(){
        if(this.isAndroid()){
            bvappObj.exitApp();
        }
        if (navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
        } else if (navigator.device && navigator.device.exitApp) {
            navigator.device.exitApp();
        }
    },
    getUserLanguage: function(){
        /*PhoneGap on Android would always return EN in navigator.*language.
         so parse userAggent
         UserAgent: Mozilla/5.0 (Linux; U; Android 2.3.3; de-de; Nexus S Build/GRI54)
         AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
         */
            
        var lang ="de";
        var result;
        if(navigator.userAgent.match(/android/i)){
            result = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i);
            if(result && result.length == 2){
                lang = result[1];
            }

        }else{
            if(navigator.language.indexOf("en") !== -1){
                lang = "en";
            }

        }
        if(lang !== "de" && lang !== "en"){
            lang = "en"; // en default for all unknow languages
        }
        return lang;

    }
    /*,
    loadGoogleMaps: function(){
        var e = document.createElement("script");
        e.src = "http://maps.google.com/maps/api/js?sensor=true";
        e.type="text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    }*/
};