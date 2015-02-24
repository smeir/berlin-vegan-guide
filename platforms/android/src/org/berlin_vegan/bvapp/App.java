package org.berlin_vegan.bvapp;


import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import org.apache.cordova.CordovaActivity;


public class App extends CordovaActivity implements LocationListener {
    public static final String TAG = "bvapp.App";
    private double latitute = 0;
    private double longitude = 0;
    private LocationManager locationManager;
    private String provider;
    private boolean gpsEnabled = false;
    private boolean networkEnabled = false;

    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        this.setIntegerProperty("loadUrlTimeoutValue", 70000);
        super.loadUrl("file:///android_asset/www/index.html", 2000);
        initLocationProvider();
        appView.addJavascriptInterface(this, "bvappObj");
        appView.addJavascriptInterface(new Device(), "bvappDevice");
    }

    private void initLocationProvider() {
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        /*if (provider == null) {
            provider = locationManager.getBestProvider(criteria, false);
        }

        */

        gpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        networkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        provider = LocationManager.NETWORK_PROVIDER;


        Log.d(TAG, "gpsEnabled: " + gpsEnabled);
        Log.d(TAG, "networkEnabled: " + networkEnabled);
        Log.d(TAG, "provider: " + provider);

    }

    /* Request updates at startup */
    @Override
    protected void onResume() {
        super.onResume();
        requestLocationUpdates();
    }

    private void requestLocationUpdates() {
        locationManager.requestLocationUpdates(provider, 400, 1, this);
    }

    /* Remove the locationlistener updates when Activity is paused */
    @Override
    protected void onPause() {
        super.onPause();
        removeLocationsUpdates();
    }

    private void removeLocationsUpdates() {
        locationManager.removeUpdates(this);
    }

    @Override
    public void onDestroy() {
        android.os.Process.killProcess(android.os.Process.myPid());
        super.onDestroy();
    }

    @Override
    public void onLocationChanged(Location location) {
        latitute = location.getLatitude();
        longitude = location.getLongitude();
        Log.d(TAG, "onLocationChanged(" + latitute + "," + longitude + ")");
        if (gpsEnabled && !provider.equalsIgnoreCase(LocationManager.GPS_PROVIDER)) {
            provider = LocationManager.GPS_PROVIDER;
            removeLocationsUpdates();
            requestLocationUpdates();
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        Log.d(TAG, "onStatusChanged(" + provider + "," + status + ")");
    }

    @Override
    public void onProviderEnabled(String provider) {
        Log.d(TAG, "onProviderEnabled(" + provider + ")");
    }

    @Override
    public void onProviderDisabled(String provider) {
        Log.d(TAG, "onProviderDisabled(" + provider + ")");
    }

    @JavascriptInterface
    public void dialTelNumber(String number) {
        final Uri uri = Uri.parse("tel:" + number);
        final Intent intent = new Intent(Intent.ACTION_DIAL, uri);
        startActivity(intent);
    }

    @JavascriptInterface
    public void doNavigation(String address) {
        final Uri uri = Uri.parse("geo:0,0?q=" + address);
        final Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        startActivity(intent);
    }

    @JavascriptInterface
    public void sendEMail(String receiver, String subject, String body) {
        final Intent intent = new Intent(Intent.ACTION_SEND);
        intent.setType("text/plain");
        String[] emails = new String[1];
        emails[0] = receiver;
        intent.putExtra(Intent.EXTRA_EMAIL, emails);
        intent.putExtra(Intent.EXTRA_SUBJECT, subject);
        intent.putExtra(Intent.EXTRA_TEXT, body);
        startActivity(intent);
    }

    @JavascriptInterface
    public void alert(final String message, final String title) {
        Runnable runnable = new Runnable() {
            public void run() {
                AlertDialog.Builder dlg = new AlertDialog.Builder(App.this);
                dlg.setMessage(message);
                dlg.setTitle(title);
                dlg.setCancelable(false);
                dlg.setPositiveButton("OK",
                        new AlertDialog.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        });

                dlg.create();
                dlg.show();
            }
        };
        runOnUiThread(runnable);

    }

    @JavascriptInterface
    public double getLatitute() {
        Log.d(TAG, "getLatitute" + latitute);
        return latitute;
    }

    @JavascriptInterface
    public double getLongitute() {
        Log.d(TAG, "getLongitute:" + longitude);
        return longitude;
    }

    @JavascriptInterface
    public void exitApp() {
        finish();
    }

    @JavascriptInterface
    public boolean isGPSLocationEnabled() {
        return gpsEnabled;
    }

    @JavascriptInterface
    public boolean isNetworkLocationEnabled() {
        return networkEnabled;
    }
    @JavascriptInterface
    public String getLocationProvider() {
        return provider;
    }
}