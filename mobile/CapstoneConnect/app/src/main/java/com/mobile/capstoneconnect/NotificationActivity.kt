package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class NotificationActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.notification_page)

        findViewById<Button>(R.id.allowNotificationButton).setOnClickListener {
            // Proceed to the first setup page
            startActivity(Intent(this, SetupActivity::class.java))
            finish()
        }

        findViewById<android.widget.TextView>(R.id.notNowText).setOnClickListener {
            // Also allow skipping to setup if user taps "Not now"
            startActivity(Intent(this, SetupActivity::class.java))
            finish()
        }
    }
}