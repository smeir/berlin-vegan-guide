package org.berlin_vegan.bvapp;
 

import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.TextView;
import android.widget.Toast;
import com.phonegap.DroidGap;

import java.text.DecimalFormat;


public class App extends DroidGap implements LocationListener {
    public static final String TAG = "bvapp.App";
    private double latitute=52.518611;
    private double longitude=13.408056;
    private LocationManager locationManager;
    private String provider;

    /** Called when the activity is first created. */   
    @Override 
    public void onCreate(Bundle savedInstanceState) {                          
        super.onCreate(savedInstanceState);              
        
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        this.setIntegerProperty("loadUrlTimeoutValue", 70000);
        super.loadUrl("file:///android_asset/www/index.html", 2000); 
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        provider = locationManager.getBestProvider(criteria, true);
        if (provider == null) {
            provider = locationManager.getBestProvider(criteria, false);
        }
        if (provider == null) {
            provider = LocationManager.GPS_PROVIDER;
        }
        Location location = locationManager.getLastKnownLocation(provider);

        if (location != null) {
            onLocationChanged(location);
        }
        appView.addJavascriptInterface(this, "bvappObj");
    }

    /* Request updates at startup */
    @Override
    protected void onResume() {
        super.onResume();
        if (provider != null) {
            locationManager.requestLocationUpdates(provider, 1000, 0, this);
        }
    }

    /* Remove the locationlistener updates when Activity is paused */
    @Override
    protected void onPause() {
        super.onPause();
        locationManager.removeUpdates(this);
    }

    @Override
    public void onLocationChanged(Location location) {
        latitute = location.getLatitude();
        longitude = location.getLongitude();
        Log.d(TAG, "onLocationChanged(" + latitute + "," + longitude + ")");
    }
    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        Log.d(TAG, "onStatusChanged("+provider+","+ status + ")");
    }

    @Override
    public void onProviderEnabled(String provider) {
        Log.d(TAG, "onProviderEnabled("+provider+")");
    }

    @Override
    public void onProviderDisabled(String provider) {
        Log.d(TAG, "onProviderDisabled("+provider+")");
    }

    @JavascriptInterface
    public double getLatitute() {
        Log.d(TAG, "getLatitute" + latitute);
        return latitute;
    }
    @JavascriptInterface
    public double getLongitute() {
        Log.d(TAG, "getLongitute:"+ longitude);
        return longitude;
    }
}