package com.mobile.capstoneconnect

import android.animation.ObjectAnimator
import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class FindActivity : AppCompatActivity() {
    private var isBackVisible = false

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
        val backView    = findViewById<View>(R.id.card_back)

        // ensure a strong 3D effect
        flipContainer.cameraDistance = resources.displayMetrics.density * 8000

        // 1) start back “turned away” at +90°, invisible
        backView.rotationY = 90f
        backView.visibility = View.GONE
        // 2) front starts facing us
        frontView.rotationY = 0f
        frontView.visibility = View.VISIBLE

        flipContainer.setOnClickListener {
            if (!isBackVisible) {
                // --- FLIP FRONT → BACK ---
                // spin front away: 0 → -90
                ObjectAnimator.ofFloat(frontView, "rotationY", 0f, -90f).apply {
                    duration = 200L
                    addListener(object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            frontView.visibility = View.GONE

                            // show back (still at +90°) and spin it back to 0°
                            backView.visibility = View.VISIBLE
                            ObjectAnimator.ofFloat(backView, "rotationY", 90f, 0f)
                                .setDuration(200L)
                                .start()
                        }
                    })
                }.start()
            } else {
                // --- FLIP BACK → FRONT ---
                // spin back away: 0 → +90
                ObjectAnimator.ofFloat(backView, "rotationY", 0f, 90f).apply {
                    duration = 200L
                    addListener(object : AnimatorListenerAdapter() {
                        override fun onAnimationEnd(animation: Animator) {
                            backView.visibility = View.GONE

                            // show front (at -90°) and spin it back to 0°
                            frontView.visibility = View.VISIBLE
                            ObjectAnimator.ofFloat(frontView, "rotationY", -90f, 0f)
                                .setDuration(200L)
                                .start()
                        }
                    })
                }.start()
            }
            isBackVisible = !isBackVisible
        }
    }
}
