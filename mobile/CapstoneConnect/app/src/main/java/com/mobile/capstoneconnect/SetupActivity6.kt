package com.mobile.capstoneconnect

        import android.content.Intent
        import android.os.Bundle
        import android.widget.Button
        import android.widget.TextView
        import androidx.appcompat.app.AppCompatActivity

        class SetupActivity6 : AppCompatActivity() {
            private var selectedImageUri: String? = null

            override fun onCreate(savedInstanceState: Bundle?) {
                super.onCreate(savedInstanceState)
                setContentView(R.layout.setup_page6)

                selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

                val name = intent.getStringExtra("USER_NAME") ?: "N/A"
                val role = intent.getStringExtra("USER_ROLE") ?: "N/A"
                val about = intent.getStringExtra("USER_ABOUT") ?: "N/A"
                val skills = intent.getStringExtra("USER_SKILLS") ?: "N/A"
                val interests = intent.getStringExtra("USER_INTERESTS") ?: "N/A"

                findViewById<TextView>(R.id.setupPage6DisplayName).text = name
                findViewById<TextView>(R.id.setupPage6DisplayRole).text = role
                findViewById<TextView>(R.id.setupPage6DisplayAbout).text = about
                findViewById<TextView>(R.id.setupPage6DisplaySkills).text = skills
                findViewById<TextView>(R.id.setupPage6DisplayInterest).text = interests

                findViewById<Button>(R.id.setupPage6BackButton).setOnClickListener {
                    finish()
                }

                findViewById<Button>(R.id.setupPage6NextButton).setOnClickListener {
                    // Save to UserProfile singleton for frontend-only, backend-ready storage
                    UserProfile.imageUri = selectedImageUri
                    UserProfile.name = name
                    UserProfile.role = role
                    UserProfile.about = about
                    UserProfile.skills = skills
                    UserProfile.interests = interests

                    val intent = Intent(this, SetupActivity7::class.java)
                    intent.putExtra("SELECTED_IMAGE_URI", selectedImageUri)
                    intent.putExtra("USER_NAME", name)
                    intent.putExtra("USER_ROLE", role)
                    intent.putExtra("USER_ABOUT", about)
                    intent.putExtra("USER_SKILLS", skills)
                    intent.putExtra("USER_INTERESTS", interests)
                    startActivity(intent)
                }
            }
        }