package com.mobile.capstoneconnect

   import android.app.Dialog
   import android.content.Intent
   import android.os.Bundle
   import android.widget.Button
   import android.widget.EditText
   import android.widget.ImageView
   import android.widget.Toast
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
           val editTextUsername = dialog.findViewById<EditText>(R.id.editTextUsername)
           val editTextPassword = dialog.findViewById<EditText>(R.id.editTextPassword)
           val btnSignIn = dialog.findViewById<Button>(R.id.btnSignIn)
           val logoImage = dialog.findViewById<ImageView>(R.id.logoImage)

           // Handle sign in button click
           btnSignIn.setOnClickListener {
               val username = editTextUsername.text.toString().trim()
               val password = editTextPassword.text.toString().trim()

               if (username.isEmpty() || password.isEmpty()) {
                   Toast.makeText(this, "Please enter both username and password", Toast.LENGTH_SHORT).show()
               } else {
                   // Here you would validate login credentials with your backend
                   Toast.makeText(this, "Login successful", Toast.LENGTH_SHORT).show()
                   dialog.dismiss() // Close modal after success

                   // Start with the notification activity first
                   val intent = Intent(this, NotificationActivity::class.java)
                   startActivity(intent)
               }
           }

           // Show the dialog
           dialog.show()
       }
   }