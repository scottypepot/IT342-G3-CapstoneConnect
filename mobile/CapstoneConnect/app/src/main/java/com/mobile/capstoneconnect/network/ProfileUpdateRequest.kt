package com.mobile.capstoneconnect.network

data class ProfileUpdateRequest(
    val fullName: String?,
    val role: String?,
    val about: String?,
    val skills: List<String>?,
    val interests: List<String>?,
    val githubLink: String? = null,
    val profilePicture: String? = null
)
