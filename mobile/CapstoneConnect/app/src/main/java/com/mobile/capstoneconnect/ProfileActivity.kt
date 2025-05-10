package com.mobile.capstoneconnect

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.*
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.appcompat.app.AlertDialog
import androidx.activity.viewModels
import androidx.lifecycle.Observer
import com.mobile.capstoneconnect.viewmodel.UserViewModel
import com.mobile.capstoneconnect.util.ApiResult
import com.mobile.capstoneconnect.AuthManager
import com.mobile.capstoneconnect.network.ProfileUpdateRequest

class ProfileActivity : AppCompatActivity() {

    private val skillsList = listOf(
        "Javascript", "Python", "Java", "C++", "React", "Node.js",
        "UI/UX Design", "Database Management", "Machine Learning", "Mobile Development"
    )
    private val interestsList = listOf(
        "Frontend Development", "Backend Development", "Mobile Development",
        "Artificial Intelligence", "Software Development", "Chatbots",
        "Cybersecurity", "UI/UX Design"
    )

    private val selectedSkills = mutableSetOf<String>()
    private val selectedInterests = mutableSetOf<String>()
    private val userViewModel: UserViewModel by viewModels()
    private var accessToken: String? = null
    private var userId: Long? = null

    private fun updateChips(chipGroup: ChipGroup, items: MutableSet<String>) {
        chipGroup.removeAllViews()
        for (item in items) {
            val chip = Chip(this)
            chip.text = item
            chip.isCloseIconVisible = false
            chipGroup.addView(chip)
        }
    }

    private fun ensureSession(): Boolean {
        if (SessionManager.accessToken.isNullOrEmpty() || SessionManager.userId == null) {
            Toast.makeText(this, "Missing access token or user ID! (Session)", Toast.LENGTH_LONG).show()
            android.util.Log.e("ProfileActivity", "SessionManager missing token or userId: token=${SessionManager.accessToken}, userId=${SessionManager.userId}")
            return false
        }
        return true
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.profile_page)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val imageUri = UserProfile.imageUri
        val nameEdit = findViewById<EditText>(R.id.profileName)
        val roleEdit = findViewById<EditText>(R.id.profileRole)
        val aboutEdit = findViewById<EditText>(R.id.profileAbout)
        val skillsChipGroup = findViewById<ChipGroup>(R.id.profileSkillsChipGroup)
        val interestsChipGroup = findViewById<ChipGroup>(R.id.profileInterestChipGroup)
        val profileImage = findViewById<ImageView>(R.id.profileImage)
        val githubLinkEdit = findViewById<EditText>(R.id.profileGithubLink)

        if (!imageUri.isNullOrEmpty()) {
            profileImage.setImageURI(Uri.parse(imageUri))
        }

        nameEdit.setText(UserProfile.name ?: "")
        roleEdit.setText(UserProfile.role ?: "")
        aboutEdit.setText(UserProfile.about ?: "")

        // Get accessToken and userId from Intent extras
        // Always refresh from SessionManager if possible
        if (SessionManager.accessToken != null && SessionManager.userId != null) {
            accessToken = SessionManager.accessToken
            userId = SessionManager.userId
        } else {
            accessToken = intent.getStringExtra("accessToken")
            userId = intent.getLongExtra("userId", -1L).takeIf { it != -1L }
        }
        if (accessToken == null || userId == null) {
            Toast.makeText(this, "Missing access token or user ID! (Intent)", Toast.LENGTH_LONG).show()
            android.util.Log.e("ProfileActivity", "Intent missing token or userId: token=$accessToken, userId=$userId")
            // Handle missing token or userId (e.g., show error, redirect, etc.)
        } else {
            // Fetch profile from backend if token and id are available
            userViewModel.fetchUserProfile(userId!!)
        }

        // Observe profile data
        userViewModel.userProfile.observe(this, Observer { result ->
            when (result) {
                is ApiResult.Success -> {
                    val profile = result.data
                    android.util.Log.d("ProfileActivity", "Fetched profile: $profile")
                    findViewById<EditText>(R.id.profileName).setText(profile.fullName ?: "")
                    UserProfile.name = profile.fullName ?: ""
                    findViewById<EditText>(R.id.profileRole).setText(profile.role ?: "")
                    findViewById<EditText>(R.id.profileAbout).setText(profile.about ?: "")
                    githubLinkEdit.setText(profile.githubLink ?: "")
                    selectedSkills.clear()
                    selectedSkills.addAll(profile.skills ?: emptyList())
                    selectedInterests.clear()
                    selectedInterests.addAll(profile.interests ?: emptyList())
                    updateChips(findViewById(R.id.profileSkillsChipGroup), selectedSkills)
                    updateChips(findViewById(R.id.profileInterestChipGroup), selectedInterests)
                }
                is ApiResult.Error -> {
                    Toast.makeText(this, "Failed to load profile: ${result.message}", Toast.LENGTH_SHORT).show()
                }
                is ApiResult.Loading -> {}
            }
        })

        // Edit Skills (dropdown)
        findViewById<ImageButton>(R.id.editSkillsButton).setOnClickListener {
            val checkedItems = skillsList.map { selectedSkills.contains(it) }.toBooleanArray()
            AlertDialog.Builder(this)
                .setTitle("Select Skills")
                .setMultiChoiceItems(skillsList.toTypedArray(), checkedItems) { _, which, isChecked ->
                    if (isChecked) selectedSkills.add(skillsList[which])
                    else selectedSkills.remove(skillsList[which])
                }
                .setPositiveButton("OK") { _, _ ->
                    updateChips(skillsChipGroup, selectedSkills)
                    UserProfile.skills = selectedSkills.joinToString(", ")
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        // Edit Interests (dropdown, max 4)
        findViewById<ImageButton>(R.id.editInterestButton).setOnClickListener {
            val checkedItems = interestsList.map { selectedInterests.contains(it) }.toBooleanArray()
            AlertDialog.Builder(this)
                .setTitle("Select Interests (max 4)")
                .setMultiChoiceItems(interestsList.toTypedArray(), checkedItems) { dialog, which, isChecked ->
                    if (isChecked) {
                        if (selectedInterests.size < 4) {
                            selectedInterests.add(interestsList[which])
                        } else {
                            (dialog as AlertDialog).listView.setItemChecked(which, false)
                            Toast.makeText(this, "You can select up to 4 interests only", Toast.LENGTH_SHORT).show()
                        }
                    } else {
                        selectedInterests.remove(interestsList[which])
                    }
                }
                .setPositiveButton("OK") { _, _ ->
                    updateChips(interestsChipGroup, selectedInterests)
                    UserProfile.interests = selectedInterests.joinToString(", ")
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        // Save button logic
        findViewById<Button>(R.id.saveProfileButton).setOnClickListener {
            if (!ensureSession()) return@setOnClickListener
            val githubLink = githubLinkEdit.text.toString()
            val name = nameEdit.text.toString().trim()
            val role = roleEdit.text.toString().trim()
            val about = aboutEdit.text.toString().trim()

            // Validation for required fields (match web)
            when {
                name.isEmpty() -> {
                    Toast.makeText(this, "Please enter your name", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                role.isEmpty() -> {
                    Toast.makeText(this, "Please select your preferred role", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                about.isEmpty() -> {
                    Toast.makeText(this, "Please fill out the About you section", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                selectedSkills.isEmpty() -> {
                    Toast.makeText(this, "Please select at least one skill", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                selectedInterests.isEmpty() -> {
                    Toast.makeText(this, "Please select at least one interest", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
            }
            if (githubLink.isNotEmpty()) {
                val githubRegex = Regex("^https://github\\.com/[a-zA-Z0-9-]+(/[a-zA-Z0-9-]+)*/?")
                if (!githubRegex.matches(githubLink)) {
                    Toast.makeText(this, "Please enter a valid GitHub URL (e.g., https://github.com/capstoneconnect)", Toast.LENGTH_LONG).show()
                    return@setOnClickListener
                }
            }
            // TODO: If a new profile image is selected, upload it to the backend here.
            // After upload, get the returned image URL and set it as profilePicture in the request below.
            // For now, profilePicture is set to null (local-only).

            val updates = ProfileUpdateRequest(
                fullName = name,
                role = role,
                about = about,
                skills = selectedSkills.toList(),
                interests = selectedInterests.toList(),
                githubLink = githubLink,
                profilePicture = null // TODO: Replace with uploaded image URL
            )
            userViewModel.updateUserProfile(userId!!, updates)
        }
        userViewModel.userProfile.observe(this, Observer { result ->
            if (result is ApiResult.Success) {
                Toast.makeText(this, "Profile saved!", Toast.LENGTH_SHORT).show()
            }
        })

        // Logout button logic
        findViewById<Button>(R.id.logoutButton).setOnClickListener {
            AuthManager.signOut { success, error ->
                runOnUiThread {
                    UserProfile.clear()
                    SessionManager.accessToken = null
                    SessionManager.userId = null
                    val intent = Intent(this, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
        }

        // Bottom navigation setup
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigationView)
        bottomNav.selectedItemId = R.id.navigation_profile
        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.navigation_find -> {
                    startActivity(Intent(this, HomeActivity::class.java))
                    true
                }
                R.id.navigation_message -> {
                    startActivity(Intent(this, NMessagesActivity::class.java))
                    true
                }
                R.id.navigation_profile -> true
                else -> false
            }
        }

        // Back button logic
        val backButton = findViewById<ImageButton>(R.id.backButton)
        backButton.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }
    }
}