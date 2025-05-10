package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.Observer
import com.bumptech.glide.Glide
import com.mobile.capstoneconnect.network.UserMatch
import com.mobile.capstoneconnect.util.ApiResult
import com.mobile.capstoneconnect.viewmodel.UserViewModel

class FindActivity : AppCompatActivity() {
    private val userViewModel: UserViewModel by viewModels()
    private var matchList: List<com.mobile.capstoneconnect.network.MatchUser> = emptyList()
    private var currentIndex = 0
    private var userMatches: List<UserMatch> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.find_page)

        // edge‐to‐edge padding
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val sysBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(sysBars.left, sysBars.top, sysBars.right, sysBars.bottom)
            insets
        }
        val flipContainer = findViewById<FrameLayout>(R.id.flipContainer)
        val frontView   = findViewById<View>(R.id.card_front)

        // ensure a strong 3D effect
        flipContainer.cameraDistance = resources.displayMetrics.density * 8000

        frontView.rotationY = 0f
        frontView.visibility = View.VISIBLE

        // Bottom navigation setup
        val bottomNav = findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.bottomNavigationView)
        bottomNav.selectedItemId = R.id.navigation_find
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_find -> true // Already on this page
                R.id.navigation_message -> {
                    startActivity(Intent(this, NMessagesActivity::class.java))
                    true
                }
                R.id.navigation_profile -> {
                    val intent = Intent(this, ProfileActivity::class.java)
                    intent.putExtra("accessToken", SessionManager.accessToken)
                    intent.putExtra("userId", SessionManager.userId ?: -1L)
                    startActivity(intent)
                    true
                }
                else -> false
            }
        }

        val profileImage = findViewById<ImageView>(R.id.profileImage)
        val userName = findViewById<TextView>(R.id.userName)
        val userRole = findViewById<TextView>(R.id.userRole)
        val btnAccept = findViewById<ImageButton>(R.id.btnAccept)
        val btnReject = findViewById<ImageButton>(R.id.btnReject)

        // Fetch matches if session is valid
        val userId = SessionManager.userId
        if (userId != null && userId != -1L) {
            userViewModel.fetchPotentialMatches(userId)
            userViewModel.fetchUserMatches(userId)
        } else {
            Toast.makeText(this, "Missing user session. Please log in again.", Toast.LENGTH_LONG).show()
        }

        // Observe matches
        userViewModel.matches.observe(this, Observer { result: ApiResult<List<com.mobile.capstoneconnect.network.MatchUser>> ->
            when (result) {
                is ApiResult.Success -> {
                    matchList = result.data
                    currentIndex = 0
                    showCurrentMatch(profileImage, userName, userRole)
                }
                is ApiResult.Error -> {
                    Toast.makeText(this, "Failed to load matches: ${result.message}", Toast.LENGTH_SHORT).show()
                    clearProfileCard(profileImage, userName, userRole)
                }
                is ApiResult.Loading -> {
                    // Optionally show loading spinner
                }
            }
        })

        userViewModel.userMatches.observe(this, Observer { result ->
            if (result is ApiResult.Success) {
                userMatches = result.data
            }
        })

        btnAccept.setOnClickListener {
            try {
                if (matchList.isNotEmpty() && currentIndex < matchList.size) {
                    val match = matchList[currentIndex]
                    sendAcceptMatch(match.id)
                } else {
                    Toast.makeText(this, "No match to accept.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
            }
        }
        btnReject.setOnClickListener {
            try {
                if (matchList.isNotEmpty() && currentIndex < matchList.size) {
                    val match = matchList[currentIndex]
                    sendRejectMatch(match.id)
                } else {
                    Toast.makeText(this, "No match to reject.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun showCurrentMatch(profileImage: ImageView, userName: TextView, userRole: TextView) {
        if (currentIndex >= matchList.size) {
            userName.text = "No more matches!"
            userRole.text = ""
            profileImage.setImageResource(R.drawable.ic_profile_placeholder)
            return
        }
        val match = matchList[currentIndex]
        userName.text = match.fullName ?: "Unknown"
        userRole.text = match.role ?: ""
        val imageUrl = match.profilePicture
        if (!imageUrl.isNullOrEmpty()) {
            Glide.with(this).load(imageUrl).placeholder(R.drawable.ic_profile_placeholder).into(profileImage)
        } else {
            profileImage.setImageResource(R.drawable.ic_profile_placeholder)
        }
    }

    private fun clearProfileCard(profileImage: ImageView, userName: TextView, userRole: TextView) {
        userName.text = ""
        userRole.text = ""
        profileImage.setImageResource(R.drawable.ic_profile_placeholder)
    }

    private fun sendAcceptMatch(matchedUserId: Long?) {
        if (matchedUserId == null || SessionManager.userId == null) return
        val userId = SessionManager.userId!!
        val token = SessionManager.accessToken
        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Missing access token.", Toast.LENGTH_SHORT).show()
            return
        }
        // POST /api/users/{userId}/matches
        val apiService = com.mobile.capstoneconnect.network.ApiClient.retrofit.create(com.mobile.capstoneconnect.network.ApiService::class.java)
        val call = apiService.createMatch("Bearer $token", userId, mapOf("matchedUserId" to matchedUserId))
        call.enqueue(object : retrofit2.Callback<okhttp3.ResponseBody> {
            override fun onResponse(call: retrofit2.Call<okhttp3.ResponseBody>, response: retrofit2.Response<okhttp3.ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@FindActivity, "Match request sent!", Toast.LENGTH_SHORT).show()
                    currentIndex++
                    showCurrentMatch(findViewById(R.id.profileImage), findViewById(R.id.userName), findViewById(R.id.userRole))
                } else {
                    Toast.makeText(this@FindActivity, "Failed to match: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: retrofit2.Call<okhttp3.ResponseBody>, t: Throwable) {
                Toast.makeText(this@FindActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun sendRejectMatch(matchedUserId: Long?) {
        if (matchedUserId == null || SessionManager.userId == null) return
        val userId = SessionManager.userId!!
        val token = SessionManager.accessToken
        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Missing access token.", Toast.LENGTH_SHORT).show()
            return
        }
        // Find the matchId for this user pair
        val match = userMatches.find {
            (it.userId == matchedUserId || it.matchedUserId == matchedUserId) &&
            (it.userId == userId || it.matchedUserId == userId)
        }
        val matchId = match?.matchId
        if (matchId == null) {
            Toast.makeText(this, "No match record found for this user.", Toast.LENGTH_SHORT).show()
            return
        }
        val apiService = com.mobile.capstoneconnect.network.ApiClient.retrofit.create(com.mobile.capstoneconnect.network.ApiService::class.java)
        val call = apiService.updateMatchStatus("Bearer $token", matchId.toString(), mapOf("status" to "PASSED", "userId" to userId.toString()))
        call.enqueue(object : retrofit2.Callback<Void> {
            override fun onResponse(call: retrofit2.Call<Void>, response: retrofit2.Response<Void>) {
                if (response.isSuccessful) {
                    currentIndex++
                    showCurrentMatch(findViewById(R.id.profileImage), findViewById(R.id.userName), findViewById(R.id.userRole))
                    Toast.makeText(this@FindActivity, "Passed on this profile.", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@FindActivity, "Failed to pass: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onFailure(call: retrofit2.Call<Void>, t: Throwable) {
                Toast.makeText(this@FindActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
