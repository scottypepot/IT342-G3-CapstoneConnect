package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class SetupActivity3 : AppCompatActivity() {
    // Image picker launcher
    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        if (uri != null) {
            // Image selected, start SetupActivity4 with the image URI
            val intent = Intent(this, SetupActivity4::class.java).apply {
                putExtra("SELECTED_IMAGE_URI", uri.toString())
            }
            startActivity(intent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page3)

        findViewById<Button>(R.id.setupPage3BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage3NextButton).setOnClickListener {
            startActivity(Intent(this, SetupActivity4::class.java))
        }

        findViewById<Button>(R.id.setupPage3UploadPhotoButton).setOnClickListener {
            // Launch image picker when the upload button is clicked
            pickImageLauncher.launch("image/*")
        }
    }
}