package com.mobile.capstoneconnect

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import androidx.appcompat.app.AlertDialog

class SetupActivity5 : AppCompatActivity() {
    private var selectedImageUri: String? = null

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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.setup_page5)

        selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

        val nameInput = findViewById<EditText>(R.id.setupPage5InputName)
        val roleInput = findViewById<EditText>(R.id.setupPage5InputRole)
        val aboutInput = findViewById<EditText>(R.id.setupPage5InputAbout)
        val selectSkillsButton = findViewById<Button>(R.id.setupPage5SelectSkillsButton)
        val selectInterestsButton = findViewById<Button>(R.id.setupPage5SelectInterestsButton)
        val skillsChipGroup = findViewById<ChipGroup>(R.id.setupPage5SkillsChipGroup)
        val interestsChipGroup = findViewById<ChipGroup>(R.id.setupPage5InterestsChipGroup)
        val nextButton = findViewById<Button>(R.id.setupPage5NextButton)
        val backButton = findViewById<Button>(R.id.setupPage5BackButton)

        // Skills selection dialog
        selectSkillsButton.setOnClickListener {
            val checkedItems = skillsList.map { selectedSkills.contains(it) }.toBooleanArray()
            AlertDialog.Builder(this)
                .setTitle("Select Skills")
                .setMultiChoiceItems(skillsList.toTypedArray(), checkedItems) { _, which, isChecked ->
                    if (isChecked) selectedSkills.add(skillsList[which])
                    else selectedSkills.remove(skillsList[which])
                }
                .setPositiveButton("OK") { _, _ ->
                    updateChips(skillsChipGroup, selectedSkills)
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        // Interests selection dialog (max 4)
        selectInterestsButton.setOnClickListener {
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
                }
                .setNegativeButton("Cancel", null)
                .show()
        }

        nextButton.setOnClickListener {
            val name = nameInput.text.toString().trim()
            val role = roleInput.text.toString().trim()
            val about = aboutInput.text.toString().trim()
            val skills = selectedSkills.joinToString(", ")
            val interests = selectedInterests.joinToString(", ")

            if (name.isBlank() || role.isBlank() || about.isBlank() || skills.isBlank() || interests.isBlank()) {
                Toast.makeText(this, "Please fill out all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val intent = Intent(this, SetupActivity6::class.java).apply {
                putExtra("USER_NAME", name)
                putExtra("USER_ROLE", role)
                putExtra("USER_ABOUT", about)
                putExtra("USER_SKILLS", skills)
                putExtra("USER_INTERESTS", interests)
                putExtra("SELECTED_IMAGE_URI", selectedImageUri)
            }

            Toast.makeText(this, "Proceeding to next page", Toast.LENGTH_SHORT).show()
            startActivity(intent)
        }

        backButton.setOnClickListener {
            finish()
        }
    }

    private fun updateChips(chipGroup: ChipGroup, items: MutableSet<String>) {
        chipGroup.removeAllViews()
        for (item in items.toList()) {
            val chip = Chip(this)
            chip.text = item
            chip.isCloseIconVisible = true
            chip.setOnCloseIconClickListener {
                items.remove(item)
                updateChips(chipGroup, items)
            }
            chipGroup.addView(chip)
        }
    }
}