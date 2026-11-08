package com.mahdi.spidervpn;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import libXray.DialerController;
import libXray.LibXray;

public class SpiderVpnService extends VpnService {
    public static final String ACTION_CONNECT = "com.mahdi.spidervpn.CONNECT";
    public static final String ACTION_DISCONNECT = "com.mahdi.spidervpn.DISCONNECT";
    public static final String EXTRA_CONFIG = "config";
    public static final String PREFS = "spider_runtime";
    private static final String TAG = "SpiderVPN";
    private static final int NOTIFICATION_ID = 4108;

    private ParcelFileDescriptor vpnInterface;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private volatile boolean stopping = false;

    private final DialerController dialerController = new DialerController() {
        @Override public boolean protectFd(long fd) {
            return SpiderVpnService.this.protect((int) fd);
        }
    };

    private void setStatus(String status, String error) {
        getSharedPreferences(PREFS, MODE_PRIVATE).edit()
                .putString("status", status)
                .putString("error", error == null ? "" : error)
                .apply();
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_NOT_STICKY;
        String action = intent.getAction();
        if (ACTION_DISCONNECT.equals(action)) {
            worker.execute(this::disconnectCore);
            return START_NOT_STICKY;
        }
        if (ACTION_CONNECT.equals(action)) {
            String link = intent.getStringExtra(EXTRA_CONFIG);
            startForeground(NOTIFICATION_ID, buildNotification("Connecting"));
            setStatus("connecting", "");
            worker.execute(() -> connectCore(link));
        }
        return START_NOT_STICKY;
    }

    private Notification buildNotification(String state) {
        String channelId = "spider_vpn_status";
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel = new NotificationChannel(channelId, "Spider VPN", NotificationManager.IMPORTANCE_LOW);
            nm.createNotificationChannel(channel);
        }
        Intent open = new Intent(this, MainActivity.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 23) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, flags);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, channelId) : new Notification.Builder(this);
        return b.setContentTitle("Spider VPN").setContentText(state)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentIntent(pi).setOngoing(true).build();
    }

    private void connectCore(String shareLink) {
        try {
            if (shareLink == null || shareLink.trim().isEmpty()) throw new Exception("Configuration is empty");
            disconnectCoreInternal(false);

            Builder builder = new Builder();
            builder.setSession("Spider VPN");
            builder.setMtu(1500);
            builder.addAddress("10.10.0.1", 32);
            builder.addRoute("0.0.0.0", 0);
            builder.addDnsServer("1.1.1.1");
            // IPv6 is routed through the same TUN where supported.
            builder.addAddress("fd00:1:1::1", 128);
            builder.addRoute("::", 0);

            vpnInterface = builder.establish();
            if (vpnInterface == null) throw new Exception("Android could not establish the VPN interface");

            LibXray.registerDialerController(dialerController);
            LibXray.registerListenerController(dialerController);
            LibXray.setDNS(dialerController, "1.1.1.1:53");

            JSONObject convertRequest = new JSONObject();
            convertRequest.put("apiVersion", 3);
            convertRequest.put("method", "convertShareLinksToXrayJson");
            JSONObject convertPayload = new JSONObject();
            convertPayload.put("text", shareLink.trim());
            convertRequest.put("payload", convertPayload);

            JSONObject convertResponse = new JSONObject(LibXray.invoke(convertRequest.toString()));
            if (!convertResponse.optBoolean("success", false)) {
                throw new Exception(convertResponse.optString("error", "Could not parse this configuration"));
            }
            JSONObject xrayConfig = convertResponse.optJSONObject("data");
            if (xrayConfig == null || xrayConfig.optJSONArray("outbounds") == null
                    || xrayConfig.getJSONArray("outbounds").length() == 0) {
                throw new Exception("The configuration did not contain a usable outbound");
            }

            JSONObject env = xrayConfig.optJSONObject("env");
            if (env == null) env = new JSONObject();
            env.put("xray.tun.fd", String.valueOf(vpnInterface.getFd()));
            xrayConfig.put("env", env);

            JSONArray inbounds = new JSONArray();
            JSONObject tun = new JSONObject();
            tun.put("tag", "spider-tun");
            tun.put("port", 0);
            tun.put("protocol", "tun");
            JSONObject settings = new JSONObject();
            settings.put("name", "spider0");
            settings.put("mtu", 1500);
            tun.put("settings", settings);
            inbounds.put(tun);
            xrayConfig.put("inbounds", inbounds);

            JSONObject runRequest = new JSONObject();
            runRequest.put("apiVersion", 3);
            runRequest.put("method", "runXray");
            JSONObject runPayload = new JSONObject();
            runPayload.put("xrayJson", xrayConfig.toString());
            runRequest.put("payload", runPayload);

            JSONObject runResponse = new JSONObject(LibXray.invoke(runRequest.toString()));
            if (!runResponse.optBoolean("success", false)) {
                throw new Exception(runResponse.optString("error", "Xray failed to start"));
            }

            setStatus("connected", "");
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            nm.notify(NOTIFICATION_ID, buildNotification("Connected"));
            Log.i(TAG, "Xray started successfully");
        } catch (Exception e) {
            Log.e(TAG, "VPN start failed", e);
            disconnectCoreInternal(false);
            setStatus("error", e.getMessage());
            stopForeground(true);
            stopSelf();
        }
    }

    private void disconnectCore() {
        disconnectCoreInternal(true);
    }

    private void disconnectCoreInternal(boolean updateState) {
        try {
            JSONObject req = new JSONObject();
            req.put("apiVersion", 3);
            req.put("method", "stopXray");
            LibXray.invoke(req.toString());
        } catch (Exception e) {
            Log.w(TAG, "Xray stop returned an error", e);
        }
        try { LibXray.resetDNS(); } catch (Throwable ignored) {}
        if (vpnInterface != null) {
            try { vpnInterface.close(); } catch (IOException e) { Log.w(TAG, "TUN close failed", e); }
            vpnInterface = null;
        }
        if (updateState) {
            setStatus("disconnected", "");
            stopForeground(true);
            stopSelf();
        }
    }

    @Override public void onRevoke() {
        worker.execute(this::disconnectCore);
        super.onRevoke();
    }

    @Override public void onDestroy() {
        stopping = true;
        disconnectCoreInternal(true);
        worker.shutdown();
        super.onDestroy();
    }
}
