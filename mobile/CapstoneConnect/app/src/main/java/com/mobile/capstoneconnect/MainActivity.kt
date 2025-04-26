package com.mobile.capstoneconnect

import android.app.Dialog
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Find the button
        val btnGetStarted = findViewById<Button>(R.id.btnGetStarted)

        // Set click listener
        btnGetStarted.setOnClickListener {
            // Show the modal dialog instead of starting a new activity
            showSignUpModal()
        }
    }

    private fun showSignUpModal() {
        // Create a Dialog
        val dialog = Dialog(this)
        dialog.setContentView(R.layout.modal_signup)

        // Find elements in the modal layout
        val btnSignUpMicrosoft = dialog.findViewById<Button>(R.id.btnSignUpMicrosoft)
        val logoImage = dialog.findViewById<ImageView>(R.id.logoImage)

        // Handle Microsoft sign up button click
        btnSignUpMicrosoft.setOnClickListener {
            // Here you can trigger your Microsoft login functionality
            // Example: openMicrosoftLogin()
            dialog.dismiss() // Close modal
        }

        // Show the dialog
        dialog.show()
    }
}
