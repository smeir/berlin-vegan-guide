package org.berlin_vegan.bvapp;

import android.webkit.JavascriptInterface;

/**
 * User: smeier
 * Date: 12/3/13
 * Time: 9:12 PM
 */
public class Device {

    @JavascriptInterface
    public String getVersion() {
        return android.os.Build.VERSION.RELEASE;
    }
    @JavascriptInterface
    public String getPlatform() {
        return  "Android";
    }
    @JavascriptInterface
    public String getName() {
        return android.os.Build.MODEL;
    }
}
