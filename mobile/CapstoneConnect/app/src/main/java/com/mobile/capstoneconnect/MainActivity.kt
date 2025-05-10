package com.mobile.capstoneconnect

import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.microsoft.identity.client.AuthenticationCallback
import com.microsoft.identity.client.IAuthenticationResult
import com.microsoft.identity.client.exception.MsalException
import com.mobile.capstoneconnect.util.ApiResult
import com.mobile.capstoneconnect.viewmodel.UserViewModel

class MainActivity : AppCompatActivity() {
    private lateinit var btnGetStarted: Button
    private val userViewModel: UserViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnGetStarted = findViewById(R.id.btnGetStarted)

        // Initialize MSAL (no statusText update)
        AuthManager.init(applicationContext) { _, _ -> }

        btnGetStarted.setOnClickListener {
            showSignUpModal()
        }

        // Observe authentication result
        userViewModel.authUser.observe(this, Observer { result ->
            when (result) {
                is ApiResult.Success -> {
                    val user = result.data
                    // Store userId globally for navigation
                    SessionManager.userId = user.id
                    Toast.makeText(this, "firstTimeUser: ${user.firstTimeUser}", Toast.LENGTH_LONG).show()
                    if (user.firstTimeUser == true) {
                        // Navigate to setup page
                        val intent = Intent(this, SetupActivity::class.java)
                        startActivity(intent)
                    } else {
                        // Navigate to find page
                        val intent = Intent(this, FindActivity::class.java)
                        startActivity(intent)
                    }
                }
                is ApiResult.Error -> {
                    Toast.makeText(this, "Auth error: ${result.message}", Toast.LENGTH_LONG).show()
                }
                is ApiResult.Loading -> {
                    // Show loading (optional)
                }
            }
        })
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
                        // Log the access token for debugging
                        android.util.Log.d("MSAL", "Access Token: ${result.accessToken}")
                        modalStatusText.text = "Hello, ${result.account.username}"
                        // Store access token globally for navigation
                        SessionManager.accessToken = result.accessToken
                        // Fetch authenticated user from backend
                        userViewModel.fetchAuthenticatedUser(result.accessToken)
                        dialog.dismiss()
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