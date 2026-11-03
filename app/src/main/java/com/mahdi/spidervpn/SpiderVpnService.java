package com.mahdi.spidervpn;

import android.net.VpnService;
import android.os.ParcelFileDescriptor;
import android.content.Intent;
import android.util.Log;

import java.io.IOException;

public class SpiderVpnService extends VpnService {

    private ParcelFileDescriptor vpnInterface;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        try {
            Builder builder = new Builder();

            builder.setSession("Spider VPN");
            builder.addAddress("10.0.0.2", 32);
            builder.addRoute("0.0.0.0", 0);
            builder.addDnsServer("1.1.1.1");

            vpnInterface = builder.establish();

            if (vpnInterface == null) {
                stopSelf();
                return START_NOT_STICKY;
            }

            Log.i("SpiderVPN", "VPN interface created");

        } catch (Exception e) {
            Log.e("SpiderVPN", "VPN error", e);
            stopSelf();
        }

        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        try {
            if (vpnInterface != null) {
                vpnInterface.close();
                vpnInterface = null;
            }
        } catch (IOException e) {
            Log.e("SpiderVPN", "Close error", e);
        }

        super.onDestroy();
    }
}
