package com.mobile.capstoneconnect

        import android.content.Intent
        import android.net.Uri
        import android.os.Bundle
        import android.widget.Button
        import android.widget.ImageView
        import androidx.appcompat.app.AppCompatActivity
        import androidx.constraintlayout.widget.ConstraintLayout

        class SetupActivity4 : AppCompatActivity() {
            private var selectedImageUri: String? = null
            private var userId: Long = -1L

            override fun onCreate(savedInstanceState: Bundle?) {
                super.onCreate(savedInstanceState)
                setContentView(R.layout.setup_page4)

                // Get the user ID from the intent
                userId = intent.getLongExtra("USER_ID", -1L)

                // Get the image URI from the intent
                selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

                // Display the image if available
                if (!selectedImageUri.isNullOrEmpty()) {
                    displayImage(Uri.parse(selectedImageUri))
                }

                findViewById<Button>(R.id.setupPage4BackButton).setOnClickListener {
                    finish()
                }

                findViewById<Button>(R.id.setupPage4NextButton).setOnClickListener {
                    val intent = Intent(this, SetupActivity5::class.java)
                    // Pass the image URI to the next activity if needed
                    intent.putExtra("SELECTED_IMAGE_URI", selectedImageUri)
                    intent.putExtra("USER_ID", userId)
                    startActivity(intent)
                }
            }

            private fun displayImage(uri: Uri) {
                val contentCard = findViewById<ConstraintLayout>(R.id.setupPage4ContentCard)

                // Create ImageView for displaying the selected photo
                val imageView = ImageView(this).apply {
                    layoutParams = ConstraintLayout.LayoutParams(
                        ConstraintLayout.LayoutParams.MATCH_PARENT,
                        ConstraintLayout.LayoutParams.MATCH_PARENT
                    )
                    scaleType = ImageView.ScaleType.CENTER_CROP
                }

                // Add the ImageView to the contentCard and display the image
                contentCard.removeAllViews()
                contentCard.addView(imageView)
                imageView.setImageURI(uri)
            }
        }