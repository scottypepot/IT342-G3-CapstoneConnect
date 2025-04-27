package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SetupActivity8 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page8)

        findViewById<Button>(R.id.setupPage8NextButton).setOnClickListener {
            finish() // Or navigate to the main dashboard
        }

        findViewById<Button>(R.id.setupPage8NextButton).setOnClickListener {
            startActivity(Intent(this, HomeActivity::class.java))
        }
    }
}