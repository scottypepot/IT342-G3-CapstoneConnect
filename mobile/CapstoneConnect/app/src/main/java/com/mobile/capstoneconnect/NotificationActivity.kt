package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class NotificationActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.notification_page)

        // You can add your notification logic here

        // Automatically proceed to the first setup page after showing notification
        // You can adjust the delay or add a button for manual navigation
        Handler(Looper.getMainLooper()).postDelayed({
            val intent = Intent(this, SetupActivity::class.java)
            startActivity(intent)
        }, 3000) // 3 second delay - adjust as needed
    }
}