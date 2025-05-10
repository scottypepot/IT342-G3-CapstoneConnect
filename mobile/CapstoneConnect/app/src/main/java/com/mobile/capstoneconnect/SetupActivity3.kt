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
                putExtra("USER_ID", userId)
            }
            startActivity(intent)
        }
    }

    private var userId: Long = -1L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page3)

        // Get the user ID from the intent
        userId = intent.getLongExtra("USER_ID", -1L)

        findViewById<Button>(R.id.setupPage3BackButton).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.setupPage3NextButton).setOnClickListener {
            val intent = Intent(this, SetupActivity4::class.java)
            intent.putExtra("USER_ID", userId)
            startActivity(intent)
        }

        findViewById<Button>(R.id.setupPage3UploadPhotoButton).setOnClickListener {
            // Launch image picker when the upload button is clicked
            pickImageLauncher.launch("image/*")
        }
    }
}