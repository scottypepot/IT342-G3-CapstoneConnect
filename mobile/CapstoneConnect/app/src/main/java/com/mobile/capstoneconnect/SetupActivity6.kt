package com.mobile.capstoneconnect

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SetupActivity6 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page6)

        val name = intent.getStringExtra("USER_NAME") ?: "N/A"
        val role = intent.getStringExtra("USER_ROLE") ?: "N/A"
        val about = intent.getStringExtra("USER_ABOUT") ?: "N/A"
        val skills = intent.getStringExtra("USER_SKILLS") ?: "N/A"

        findViewById<TextView>(R.id.setupPage6DisplayName).text = name
        findViewById<TextView>(R.id.setupPage6DisplayRole).text = role
        findViewById<TextView>(R.id.setupPage6DisplayAbout).text = about
        findViewById<TextView>(R.id.setupPage6DisplaySkills).text = skills

        findViewById<Button>(R.id.setupPage6BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage6FinishButton).setOnClickListener {
            // You can implement final save/submit logic here
            finish() // or navigate to dashboard
        }
    }
}
