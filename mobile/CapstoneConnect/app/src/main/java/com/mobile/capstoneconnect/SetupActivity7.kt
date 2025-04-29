package com.mobile.capstoneconnect

                import android.content.Intent
                import android.net.Uri
                import android.os.Bundle
                import android.widget.Button
                import android.widget.ImageView
                import androidx.appcompat.app.AppCompatActivity
                import androidx.constraintlayout.widget.ConstraintLayout

                class SetupActivity7 : AppCompatActivity() {
                    private var selectedImageUri: String? = null

                    override fun onCreate(savedInstanceState: Bundle?) {
                        super.onCreate(savedInstanceState)
                        setContentView(R.layout.setup_page7)

                        // Get the image URI from the intent
                        selectedImageUri = intent.getStringExtra("SELECTED_IMAGE_URI")

                        // Display the image if available
                        if (!selectedImageUri.isNullOrEmpty()) {
                            displayImage(Uri.parse(selectedImageUri))
                        }

                        findViewById<Button>(R.id.setupPage7BackButton).setOnClickListener {
                            finish()
                        }

                        findViewById<Button>(R.id.setupPage7NextButton).setOnClickListener {
                            val intent = Intent(this, SetupActivity8::class.java)
                            // Pass the image URI to the next activity if needed
                            intent.putExtra("SELECTED_IMAGE_URI", selectedImageUri)
                            startActivity(intent)
                        }
                    }

                    private fun displayImage(uri: Uri) {
                        val contentCard = findViewById<ConstraintLayout>(R.id.setupPage7ContentCard)

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