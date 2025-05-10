package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.mobile.capstoneconnect.util.ApiResult
import com.mobile.capstoneconnect.viewmodel.UserViewModel

class SetupActivity8 : AppCompatActivity() {
    private val userViewModel: UserViewModel by viewModels()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page8)

        val nextButton = findViewById<Button>(R.id.setupPage8NextButton)

        nextButton.setOnClickListener {
            // Always set SessionManager.userId from intent if not set
            if (SessionManager.userId == null) {
                val userIdFromIntent = intent.getLongExtra("USER_ID", -1L)
                if (userIdFromIntent != -1L) {
                    SessionManager.userId = userIdFromIntent
                }
            }
            val userId = SessionManager.userId
            if (userId == null) {
                Toast.makeText(this, "User ID is missing. Please log in again.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            userViewModel.updateFirstTimeUser(userId, false)
        }

        userViewModel.firstTimeUpdate.observe(this) { result ->
            when (result) {
                is ApiResult.Success -> {
                    // Navigate to Find page after successful update
                    val intent = Intent(this, FindActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                is ApiResult.Error -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_SHORT).show()
                }
                is ApiResult.Loading -> {
                    // Optionally show loading
                }
            }
        }
    }
}