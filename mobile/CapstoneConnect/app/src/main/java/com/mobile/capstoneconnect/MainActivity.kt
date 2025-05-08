package com.mobile.capstoneconnect

import android.app.Dialog
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.microsoft.identity.client.AuthenticationCallback
import com.microsoft.identity.client.IAuthenticationResult
import com.microsoft.identity.client.exception.MsalException

class MainActivity : AppCompatActivity() {
    private lateinit var btnGetStarted: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnGetStarted = findViewById(R.id.btnGetStarted)

        // Initialize MSAL (no statusText update)
        AuthManager.init(applicationContext) { _, _ -> }

        btnGetStarted.setOnClickListener {
            showSignUpModal()
        }
    }

    private fun showSignUpModal() {
    val dialog = Dialog(this)
    dialog.setContentView(R.layout.modal_signup)

    val btnSignUpMicrosoft = dialog.findViewById<Button>(R.id.btnSignUpMicrosoft)
    val btnSignOutMicrosoft = dialog.findViewById<Button>(R.id.btnSignOutMicrosoft)
    val modalStatusText = dialog.findViewById<TextView>(R.id.modalStatusText)

    btnSignUpMicrosoft.setOnClickListener {
        AuthManager.signIn(this, object : AuthenticationCallback {
            override fun onSuccess(result: IAuthenticationResult) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Hello, ${result.account.username}", Toast.LENGTH_SHORT).show()
                    dialog.dismiss() // Close the modal
                }
            }

            override fun onError(exception: MsalException) {
                runOnUiThread {
                    modalStatusText.text = "Auth failed: ${exception.message}"
                }
            }

            override fun onCancel() {
                runOnUiThread {
                    modalStatusText.text = "User cancelled sign-in."
                }
            }
        })
    }

    btnSignOutMicrosoft.setOnClickListener {
        AuthManager.signOut { success, error ->
            runOnUiThread {
                modalStatusText.text = if (success) "Signed out successfully" else "Sign-out failed: $error"
            }
        }
    }

    dialog.show()
}
}