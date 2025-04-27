package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class SetupActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page)

        findViewById<Button>(R.id.setupNextButton).setOnClickListener {
            startActivity(Intent(this, SetupActivity2::class.java))
        }
    }
}