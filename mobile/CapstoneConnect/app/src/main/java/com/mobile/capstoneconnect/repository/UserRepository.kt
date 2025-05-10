package com.mobile.capstoneconnect.repository

import com.mobile.capstoneconnect.network.ApiClient
import com.mobile.capstoneconnect.network.ApiService
import com.mobile.capstoneconnect.network.AuthenticatedUser
import com.mobile.capstoneconnect.network.UserProfile
import com.mobile.capstoneconnect.network.MatchUser
import com.mobile.capstoneconnect.network.ProfileUpdateRequest
import com.mobile.capstoneconnect.network.UserMatch
import retrofit2.Call

class UserRepository {
    private val apiService = ApiClient.retrofit.create(ApiService::class.java)

    fun getAuthenticatedUser(token: String): Call<AuthenticatedUser> {
        return apiService.getAuthenticatedUser("Bearer $token")
    }

    fun getUserProfile(token: String, id: Long): Call<UserProfile> {
        return apiService.getUserProfile("Bearer $token", id)
    }

    fun updateUserProfile(token: String, id: Long, updates: ProfileUpdateRequest): Call<UserProfile> {
        return apiService.updateUserProfile("Bearer $token", id, updates)
    }

    fun getPotentialMatches(token: String, id: Long): Call<List<MatchUser>> {
        return apiService.getPotentialMatches("Bearer $token", id)
    }

    fun updateFirstTimeUser(token: String, id: Long, isFirstTime: Boolean): Call<Void> {
        return apiService.updateFirstTimeUser("Bearer $token", id, mapOf("firstTimeUser" to isFirstTime))
    }

    fun getUserMatches(token: String, userId: Long): Call<List<UserMatch>> {
        return apiService.getUserMatches("Bearer $token", userId)
    }
}
