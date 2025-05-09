package com.mobile.capstoneconnect

import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class FindActivity : AppCompatActivity() {

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
    }
}
