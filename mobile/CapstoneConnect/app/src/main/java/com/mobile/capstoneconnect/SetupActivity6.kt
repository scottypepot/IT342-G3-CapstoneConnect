package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SetupActivity6 : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page6)

        // Data display logic from second version
        val name = intent.getStringExtra("USER_NAME") ?: "N/A"
        val role = intent.getStringExtra("USER_ROLE") ?: "N/A"
        val about = intent.getStringExtra("USER_ABOUT") ?: "N/A"
        val skills = intent.getStringExtra("USER_SKILLS") ?: "N/A"

        findViewById<TextView>(R.id.setupPage6DisplayName).text = name
        findViewById<TextView>(R.id.setupPage6DisplayRole).text = role
        findViewById<TextView>(R.id.setupPage6DisplayAbout).text = about
        findViewById<TextView>(R.id.setupPage6DisplaySkills).text = skills

        // Back button logic (same in both versions)
        findViewById<Button>(R.id.setupPage6BackButton).setOnClickListener {
            finish()
        }

        // Merged finish button logic: navigation to SetupActivity7 from first version
        findViewById<Button>(R.id.setupPage6NextButton).setOnClickListener {
            // You can implement final save/submit logic here before navigation
            startActivity(Intent(this, SetupActivity7::class.java))

            // Optional: Add flags if you want to clear the back stack
            // intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
    }
}