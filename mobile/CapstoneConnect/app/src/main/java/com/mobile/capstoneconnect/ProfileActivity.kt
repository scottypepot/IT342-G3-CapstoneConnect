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

            private fun updateChips(chipGroup: ChipGroup, items: MutableSet<String>) {
                chipGroup.removeAllViews()
                for (item in items) {
                    val chip = Chip(this)
                    chip.text = item
                    chip.isCloseIconVisible = false
                    chipGroup.addView(chip)
                }
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

                if (!imageUri.isNullOrEmpty()) {
                    profileImage.setImageURI(Uri.parse(imageUri))
                }

                nameEdit.setText(UserProfile.name ?: "")
                roleEdit.setText(UserProfile.role ?: "")
                aboutEdit.setText(UserProfile.about ?: "")

                // Initialize selections from UserProfile
                selectedSkills.clear()
                selectedSkills.addAll((UserProfile.skills ?: "").split(",").map { it.trim() }.filter { it.isNotEmpty() })
                selectedInterests.clear()
                selectedInterests.addAll((UserProfile.interests ?: "").split(",").map { it.trim() }.filter { it.isNotEmpty() })

                updateChips(skillsChipGroup, selectedSkills)
                updateChips(interestsChipGroup, selectedInterests)

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
                    UserProfile.name = nameEdit.text.toString()
                    UserProfile.role = roleEdit.text.toString()
                    UserProfile.about = aboutEdit.text.toString()
                    UserProfile.skills = selectedSkills.joinToString(", ")
                    UserProfile.interests = selectedInterests.joinToString(", ")
                    Toast.makeText(this, "Profile saved!", Toast.LENGTH_SHORT).show()
                }

                // Logout button logic
                findViewById<Button>(R.id.logoutButton).setOnClickListener {
                    UserProfile.clear()
                    val intent = Intent(this, MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
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
            }
        }