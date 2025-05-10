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
            val intent = Intent(this, SetupActivity2::class.java)
            // Pass the user ID from SessionManager
            intent.putExtra("USER_ID", SessionManager.userId)
            startActivity(intent)
        }
    }
}