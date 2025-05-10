package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SetupActivity2 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page2)

        // Get the user ID from the intent
        val userId = intent.getLongExtra("USER_ID", -1L)

        findViewById<Button>(R.id.setupPage2BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage2NextButton).setOnClickListener {
            val intent = Intent(this, SetupActivity3::class.java)
            intent.putExtra("USER_ID", userId)
            startActivity(intent)
        }
    }
}