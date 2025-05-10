package com.mobile.capstoneconnect.network

data class UserMatch(
    val matchId: Long,
    val userId: Long,
    val matchedUserId: Long,
    val status: String?,
    val matchDate: String?,
    val cooldownUntil: String?,
    val otherUserName: String?,
    val otherUserRole: String?,
    val otherUserProfilePicture: String?
)
