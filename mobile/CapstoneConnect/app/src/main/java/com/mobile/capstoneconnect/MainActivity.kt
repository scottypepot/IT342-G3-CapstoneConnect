package com.mobile.capstoneconnect

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnGetStarted = findViewById<Button>(R.id.btnGetStarted)
        btnGetStarted.setOnClickListener {
            showSignUpModal()
        }
    }

    private fun showSignUpModal() {
        val dialog = Dialog(this)
        dialog.setContentView(R.layout.modal_signup)

        val btnSignUp = dialog.findViewById<Button>(R.id.btnSignUp)
        val btnShowSignIn = dialog.findViewById<Button>(R.id.btnShowSignIn)

        btnSignUp.setOnClickListener {
            // Registration logic here (add backend later)
            Toast.makeText(this, "Registration successful", Toast.LENGTH_SHORT).show()
            dialog.dismiss()
            showLoginModal() // Automatically show login modal after registration
        }

        btnShowSignIn.setOnClickListener {
            dialog.dismiss()
            showLoginModal()
        }

        dialog.show()
    }

    private fun showLoginModal() {
        val dialog = Dialog(this)
        dialog.setContentView(R.layout.modal_login)

        val btnSignIn = dialog.findViewById<Button>(R.id.btnSignIn)
        val btnShowSignUp = dialog.findViewById<Button>(R.id.btnShowSignUp)

        btnSignIn.setOnClickListener {
            // Login logic here (add backend later)
            Toast.makeText(this, "Login successful", Toast.LENGTH_SHORT).show()
            dialog.dismiss()
            // Redirect to notification page
            startActivity(Intent(this, NotificationActivity::class.java))
            finish()
        }

        btnShowSignUp.setOnClickListener {
            dialog.dismiss()
            showSignUpModal()
        }

        dialog.show()
    }
}