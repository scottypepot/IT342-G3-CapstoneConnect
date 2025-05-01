package com.mobile.capstoneconnect

import android.app.Activity
import android.content.Context
import com.microsoft.identity.client.AuthenticationCallback
import com.microsoft.identity.client.ISingleAccountPublicClientApplication
import com.microsoft.identity.client.IPublicClientApplication
import com.microsoft.identity.client.SingleAccountPublicClientApplication
import com.microsoft.identity.client.exception.MsalException

object AuthManager {
    private const val SCOPES = "User.Read"
    private var msalApp: ISingleAccountPublicClientApplication? = null

    /**
     * Initialize MSAL. Must be called once (e.g. in Application.onCreate or before first sign-in).
     */
    fun init(context: Context, onReady: (success: Boolean, error: String?) -> Unit) {
        SingleAccountPublicClientApplication.createSingleAccountPublicClientApplication(
            context,
            R.raw.msal_config,
            object : IPublicClientApplication.ISingleAccountApplicationCreatedListener {
                override fun onCreated(application: ISingleAccountPublicClientApplication) {
                    msalApp = application
                    onReady(true, null)
                }
                override fun onError(exception: MsalException) {
                    onReady(false, exception.message)
                }
            }
        )
    }

    /** Kick off interactive sign-in */
    fun signIn(activity: Activity, callback: AuthenticationCallback) {
        msalApp?.signIn(activity, null, arrayOf(SCOPES), callback)
            ?: throw IllegalStateException("MSAL not initialized")
    }

    /** Sign out the single cached account */
    fun signOut(onComplete: (success: Boolean, error: String?) -> Unit) {
        msalApp?.signOut(
            object : ISingleAccountPublicClientApplication.SignOutCallback {
                override fun onSignOut() {
                    onComplete(true, null)
                }
                override fun onError(exception: MsalException) {
                    onComplete(false, exception.message)
                }
            }
        ) ?: onComplete(false, "MSAL not initialized")
    }
}