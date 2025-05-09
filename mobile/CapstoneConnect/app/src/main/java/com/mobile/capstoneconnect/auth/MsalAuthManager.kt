package com.mobile.capstoneconnect.auth

import android.app.Activity
import android.content.Context
import com.microsoft.identity.client.*
import com.microsoft.identity.client.exception.MsalException

class MsalAuthManager(context: Context) {
    private val msalApp: ISingleAccountPublicClientApplication
    private var authCallback: ((String?) -> Unit)? = null

    init {
        // Use context.resources.getIdentifier to get the resource ID for msal_config.json
        val configId = context.resources.getIdentifier("msal_config", "raw", context.packageName)
        msalApp = PublicClientApplication.createSingleAccountPublicClientApplication(
            context,
            configId
        )
    }

    fun signIn(activity: Activity, callback: (String?) -> Unit) {
        authCallback = callback
        // Request the backend API scope, not just User.Read
        msalApp.signIn(activity, null, arrayOf("api://90b56d71-38f4-4a50-9395-c331c2b6a8c0/.default"), object : AuthenticationCallback {
            override fun onSuccess(authenticationResult: IAuthenticationResult) {
                callback(authenticationResult.accessToken)
            }
            override fun onError(exception: MsalException) {
                callback(null)
            }
            override fun onCancel() {
                callback(null)
            }
        })
    }

    fun signOut(callback: () -> Unit) {
        msalApp.signOut(object : ISingleAccountPublicClientApplication.SignOutCallback {
            override fun onSignOut() { callback() }
            override fun onError(e: MsalException) { callback() }
        })
    }
}
