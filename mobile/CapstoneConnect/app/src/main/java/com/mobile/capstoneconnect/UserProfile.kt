package com.mobile.capstoneconnect

object UserProfile {
    var imageUri: String? = null
    var name: String? = null
    var role: String? = null
    var about: String? = null
    var skills: String? = null
    var interests: String? = null

    fun clear() {
        imageUri = null
        name = null
        role = null
        about = null
        skills = null
        interests = null
    }
}