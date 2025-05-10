package com.mobile.capstoneconnect.network

import okhttp3.ResponseBody
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
    fun getUserProfile(@Header("Authorization") token: String, @Path("id") id: Long): Call<UserProfile>

    // Update user profile
    @PUT("/api/users/{id}/profile")
    fun updateUserProfile(
        @Header("Authorization") token: String,
        @Path("id") id: Long,
        @Body updates: ProfileUpdateRequest
    ): Call<UserProfile>

    // Get potential matches
    @GET("/api/users/{id}/potential-matches")
    fun getPotentialMatches(
        @Header("Authorization") token: String,
        @Path("id") id: Long
    ): Call<List<MatchUser>>

    // Update firstTimeUser flag
    @PUT("/api/users/{id}/first-time")
    fun updateFirstTimeUser(
        @Header("Authorization") token: String,
        @Path("id") id: Long,
        @Body body: Map<String, Boolean>
    ): Call<Void>

    // Accept a match (swipe right)
    @POST("/api/users/{userId}/matches")
    fun createMatch(
        @Header("Authorization") token: String,
        @Path("userId") userId: Long,
        @Body body: Map<String, Long>
    ): Call<ResponseBody>

    // Reject/pass a match (swipe left)
    @PUT("/api/matches/{matchId}/status")
    fun updateMatchStatus(
        @Header("Authorization") token: String,
        @Path("matchId") matchId: String,
        @Body body: Map<String, String>
    ): Call<Void>

    // Get user matches (with matchId)
    @GET("/api/users/{userId}/matches")
    fun getUserMatches(
        @Header("Authorization") token: String,
        @Path("userId") userId: Long
    ): Call<List<UserMatch>>

    // Add more endpoints as needed (chat, etc)
}
