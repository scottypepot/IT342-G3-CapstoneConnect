package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SetupActivity4 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page4)

        findViewById<Button>(R.id.setupPage4BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage4NextButton).setOnClickListener {
            startActivity(Intent(this, SetupActivity5::class.java))
        }
    }
}