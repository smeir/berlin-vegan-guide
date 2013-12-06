package org.berlin_vegan.bvapp;

import android.util.Log;
import android.webkit.JavascriptInterface;

/**
 * User: smeier
 * Date: 11/10/13
 * Time: 8:50 PM
 */
public class JavaScriptInterface {
    private static final String TAG = "wikiapp.JavaScriptInterface";
    private final App app;

    public JavaScriptInterface(App app) {
        this.app = app;
    }

    @JavascriptInterface
    public double getLatitute(){
        Log.d(TAG, "getLatitute");
        return app.getLatitute();
    }
    @JavascriptInterface
    public double getLongitute(){
        Log.d(TAG, "getLongitute");
        return app.getLongitute();
    }
}
