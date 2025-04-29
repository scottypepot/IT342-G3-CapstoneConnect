// File: app/src/main/java/com/mobile/capstoneconnect/HomeActivity.kt
    package com.mobile.capstoneconnect

    import android.content.Intent
    import android.os.Bundle
    import com.google.android.material.bottomnavigation.BottomNavigationView
    import androidx.appcompat.app.AppCompatActivity
    import androidx.core.view.ViewCompat
    import androidx.core.view.WindowInsetsCompat

    class HomeActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.home_page)
            ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
                val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
                insets
            }

            val bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigationView)
            bottomNav.setOnItemSelectedListener { item ->
                when (item.itemId) {
                    R.id.navigation_find -> {
                        startActivity(Intent(this, FindActivity::class.java))
                        true
                    }
                    R.id.navigation_message -> {
                        startActivity(Intent(this, NMessagesActivity::class.java))
                        true
                    }
                    R.id.navigation_profile -> {
                        startActivity(Intent(this, ProfileActivity::class.java))
                        true
                    }
                    else -> false
                }
            }
        }
    }