package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class SetupActivity5 : AppCompatActivity() {
    private var selectedImageUri: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page5)

        // Retrieve the image URI passed from SetupActivity4
        selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

        val nameInput = findViewById<EditText>(R.id.setupPage5InputName)
        val roleInput = findViewById<EditText>(R.id.setupPage5InputRole)
        val aboutInput = findViewById<EditText>(R.id.setupPage5InputAbout)
        val skillsInput = findViewById<EditText>(R.id.setupPage5InputSkills)
        val nextButton = findViewById<Button>(R.id.setupPage5NextButton)
        val backButton = findViewById<Button>(R.id.setupPage5BackButton)

        nextButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val role = roleInput.text.toString().trim()
            val about = aboutInput.text.toString().trim()
            val skills = skillsInput.text.toString().trim()

            if (name.isBlank() || role.isBlank() || about.isBlank() || skills.isBlank()) {
                Toast.makeText(this, "Please fill out all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val intent = Intent(this, SetupActivity6::class.java).apply {
                putExtra("USER_NAME", name)
                putExtra("USER_ROLE", role)
                putExtra("USER_ABOUT", about)
                putExtra("USER_SKILLS", skills)

                // Forward the image URI to SetupActivity6
                putExtra("SELECTED_IMAGE_URI", selectedImageUri)
            }

            Toast.makeText(this, "Proceeding to next page", Toast.LENGTH_SHORT).show()
            startActivity(intent)
        }

        backButton.setOnClickListener {
            finish()
        }
    }
}