package com.mobile.capstoneconnect.network

import retrofit2.Call
import retrofit2.http.*

// Data models (simplified, adjust as needed)
data class UserProfile(
    val id: Long?,
    val fullName: String?,
    val role: String?,
    val about: String?,
    val skills: List<String>?,
    val interests: List<String>?,
    val githubLink: String?,
    val profilePicture: String?
)

data class AuthenticatedUser(
    val id: Long?,
    val name: String?,
    val email: String?,
    val firstTimeUser: Boolean?
)

data class MatchUser(
    val id: Long?,
    val fullName: String?,
    val role: String?,
    val about: String?,
    val skills: List<String>?,
    val interests: List<String>?,
    val githubLink: String?,
    val profilePicture: String?,
    val matchScore: Double?
)

interface ApiService {
    // Get authenticated user (after login)
    @GET("/api/auth/user")
    fun getAuthenticatedUser(@Header("Authorization") token: String): Call<AuthenticatedUser>

    // Get user profile
    @GET("/api/users/{id}/profile")
    fun getUserProfile(@Path("id") id: Long): Call<UserProfile>

    // Update user profile
    @PUT("/api/users/{id}/profile")
    fun updateUserProfile(@Path("id") id: Long, @Body updates: Map<String, Any>): Call<UserProfile>

    // Get potential matches
    @GET("/api/users/{id}/potential-matches")
    fun getPotentialMatches(@Path("id") id: Long): Call<List<MatchUser>>

    // Update firstTimeUser flag
    @PUT("/api/users/{id}/first-time")
    fun updateFirstTimeUser(@Path("id") id: Long, @Body body: Map<String, Boolean>): Call<Void>

    // Add more endpoints as needed (chat, etc)
}
