package com.mobile.capstoneconnect.repository

import com.mobile.capstoneconnect.network.ApiClient
import com.mobile.capstoneconnect.network.ApiService
import com.mobile.capstoneconnect.network.AuthenticatedUser
import com.mobile.capstoneconnect.network.UserProfile
import com.mobile.capstoneconnect.network.MatchUser
import retrofit2.Call

class UserRepository {
    private val apiService = ApiClient.retrofit.create(ApiService::class.java)

    fun getAuthenticatedUser(token: String): Call<AuthenticatedUser> {
        return apiService.getAuthenticatedUser("Bearer $token")
    }

    fun getUserProfile(id: Long): Call<UserProfile> {
        return apiService.getUserProfile(id)
    }

    fun updateUserProfile(id: Long, updates: Map<String, Any>): Call<UserProfile> {
        return apiService.updateUserProfile(id, updates)
    }

    fun getPotentialMatches(id: Long): Call<List<MatchUser>> {
        return apiService.getPotentialMatches(id)
    }

    fun updateFirstTimeUser(id: Long, isFirstTime: Boolean): Call<Void> {
        return apiService.updateFirstTimeUser(id, mapOf("firstTimeUser" to isFirstTime))
    }
}
