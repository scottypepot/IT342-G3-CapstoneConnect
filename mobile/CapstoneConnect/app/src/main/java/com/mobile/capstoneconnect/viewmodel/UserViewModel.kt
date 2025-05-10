package com.mobile.capstoneconnect.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.mobile.capstoneconnect.network.AuthenticatedUser
import com.mobile.capstoneconnect.network.UserProfile
import com.mobile.capstoneconnect.network.MatchUser
import com.mobile.capstoneconnect.network.ProfileUpdateRequest
import com.mobile.capstoneconnect.network.UserMatch
import com.mobile.capstoneconnect.repository.UserRepository
import com.mobile.capstoneconnect.util.ApiResult
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class UserViewModel : ViewModel() {
    private val repository = UserRepository()

    private val _authUser = MutableLiveData<ApiResult<AuthenticatedUser>>()
    val authUser: LiveData<ApiResult<AuthenticatedUser>> = _authUser

    private val _userProfile = MutableLiveData<ApiResult<UserProfile>>()
    val userProfile: LiveData<ApiResult<UserProfile>> = _userProfile

    private val _matches = MutableLiveData<ApiResult<List<MatchUser>>>()
    val matches: LiveData<ApiResult<List<MatchUser>>> = _matches

    private val _firstTimeUpdate = MutableLiveData<ApiResult<Boolean>>()
    val firstTimeUpdate: LiveData<ApiResult<Boolean>> = _firstTimeUpdate

    private val _userMatches = MutableLiveData<ApiResult<List<UserMatch>>>()
    val userMatches: LiveData<ApiResult<List<UserMatch>>> = _userMatches

    fun fetchAuthenticatedUser(token: String) {
        _authUser.value = ApiResult.Loading
        repository.getAuthenticatedUser(token).enqueue(object : Callback<AuthenticatedUser> {
            override fun onResponse(call: Call<AuthenticatedUser>, response: Response<AuthenticatedUser>) {
                if (response.isSuccessful) {
                    _authUser.value = ApiResult.Success(response.body()!!)
                } else {
                    _authUser.value = ApiResult.Error("Auth failed: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<AuthenticatedUser>, t: Throwable) {
                _authUser.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }

    fun fetchUserProfile(id: Long) {
        _userProfile.value = ApiResult.Loading
        val token = SessionManager.accessToken
        if (token == null) {
            _userProfile.value = ApiResult.Error("No access token available")
            return
        }
        repository.getUserProfile(token, id).enqueue(object : Callback<UserProfile> {
            override fun onResponse(call: Call<UserProfile>, response: Response<UserProfile>) {
                if (response.isSuccessful) {
                    _userProfile.value = ApiResult.Success(response.body()!!)
                } else {
                    val errorBody = response.errorBody()?.string()
                    android.util.Log.e("UserViewModel", "Profile fetch failed: HTTP ${response.code()} - ${response.message()} - $errorBody")
                    _userProfile.value = ApiResult.Error("Profile failed: HTTP ${response.code()} - ${response.message()} - $errorBody")
                }
            }
            override fun onFailure(call: Call<UserProfile>, t: Throwable) {
                android.util.Log.e("UserViewModel", "Profile fetch error", t)
                _userProfile.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }

    fun updateUserProfile(id: Long, updates: ProfileUpdateRequest) {
        _userProfile.value = ApiResult.Loading
        val token = SessionManager.accessToken
        if (token == null) {
            _userProfile.value = ApiResult.Error("No access token available")
            return
        }
        repository.updateUserProfile(token, id, updates).enqueue(object : Callback<UserProfile> {
            override fun onResponse(call: Call<UserProfile>, response: Response<UserProfile>) {
                if (response.isSuccessful) {
                    _userProfile.value = ApiResult.Success(response.body()!!)
                } else {
                    _userProfile.value = ApiResult.Error("Update failed: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<UserProfile>, t: Throwable) {
                _userProfile.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }

    fun fetchPotentialMatches(id: Long) {
        _matches.value = ApiResult.Loading
        val token = SessionManager.accessToken
        if (token == null) {
            _matches.value = ApiResult.Error("No access token available")
            return
        }
        repository.getPotentialMatches(token, id).enqueue(object : Callback<List<MatchUser>> {
            override fun onResponse(call: Call<List<MatchUser>>, response: Response<List<MatchUser>>) {
                if (response.isSuccessful) {
                    _matches.value = ApiResult.Success(response.body()!!)
                } else {
                    _matches.value = ApiResult.Error("Matches failed: ${response.message()}")
                }
            }
            override fun onFailure(call: Call<List<MatchUser>>, t: Throwable) {
                _matches.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }

    fun updateFirstTimeUser(id: Long, isFirstTime: Boolean) {
        _firstTimeUpdate.value = ApiResult.Loading
        val token = SessionManager.accessToken
        if (token == null) {
            _firstTimeUpdate.value = ApiResult.Error("No access token available")
            return
        }
        repository.updateFirstTimeUser(token, id, isFirstTime).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    _firstTimeUpdate.value = ApiResult.Success(true)
                } else {
                    _firstTimeUpdate.value = ApiResult.Error("Failed to update firstTimeUser")
                }
            }
            override fun onFailure(call: Call<Void>, t: Throwable) {
                _firstTimeUpdate.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }

    fun fetchUserMatches(userId: Long) {
        _userMatches.value = ApiResult.Loading
        val token = SessionManager.accessToken
        if (token == null) {
            _userMatches.value = ApiResult.Error("No access token available")
            return
        }
        repository.getUserMatches(token, userId).enqueue(object : retrofit2.Callback<List<UserMatch>> {
            override fun onResponse(call: retrofit2.Call<List<UserMatch>>, response: retrofit2.Response<List<UserMatch>>) {
                if (response.isSuccessful) {
                    _userMatches.value = ApiResult.Success(response.body()!!)
                } else {
                    _userMatches.value = ApiResult.Error("User matches failed: ${response.message()}")
                }
            }
            override fun onFailure(call: retrofit2.Call<List<UserMatch>>, t: Throwable) {
                _userMatches.value = ApiResult.Error(t.message ?: "Unknown error")
            }
        })
    }
}
