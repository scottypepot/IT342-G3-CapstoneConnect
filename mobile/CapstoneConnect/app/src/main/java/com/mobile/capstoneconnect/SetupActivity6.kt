package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class SetupActivity6 : AppCompatActivity() {
    private var selectedImageUri: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page6)

        // Get the image URI from the intent
        selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

        // Log the URI for debugging
        println("SetupActivity6 received image URI: $selectedImageUri")

        // Data display logic
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

        findViewById<Button>(R.id.setupPage6NextButton).setOnClickListener {
            val intent = Intent(this, SetupActivity7::class.java)

            // Pass the image URI to page 7
            intent.putExtra("SELECTED_IMAGE_URI", selectedImageUri)

            // Forward other user data if needed
            intent.putExtra("USER_NAME", name)
            intent.putExtra("USER_ROLE", role)
            intent.putExtra("USER_ABOUT", about)
            intent.putExtra("USER_SKILLS", skills)

            startActivity(intent)
        }
    }
}