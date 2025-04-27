package com.mobile.capstoneconnect

            import android.content.Intent
            import android.os.Bundle
            import android.widget.Button
            import androidx.appcompat.app.AppCompatActivity

            class SetupActivity7 : AppCompatActivity() {
                override fun onCreate(savedInstanceState: Bundle?) {
                    super.onCreate(savedInstanceState)
                    setContentView(R.layout.setup_page7)

                    findViewById<Button>(R.id.setupPage7BackButton).setOnClickListener {
                        finish()
                    }

                    findViewById<Button>(R.id.setupPage7NextButton).setOnClickListener {
                        startActivity(Intent(this, SetupActivity8::class.java))
                    }
                }
            }