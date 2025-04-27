package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SetupActivity3 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page3)

        findViewById<Button>(R.id.setupPage3BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage3NextButton).setOnClickListener {
            startActivity(Intent(this, SetupActivity4::class.java))
        }
    }
}