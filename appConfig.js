var appConfig = {
    // paul's server:
    baseApiUri: 'http://86.180.144.6:8080',
    //baseApiUri: 'http://mpanupload242007.northeurope.cloudapp.azure.com:8080',
    //baseApiUri: 'http://52.169.86.102:8080',

    // portfoliopricing (prod)
    //signalRUri: 'http://portfoliogenerationnotificationservice.azurewebsites.net/NotificationServiceHub',
    signalRUri: 'http://localhost:51891/NotificationServiceHub',

    //portfoliopricing (prod)
    //hierarchyApiUri: 'http://http://portfoliogenerationfrontendbackend.azurewebsites.net',
    hierarchyApiUri: 'http://localhost:60258',
    uploadApiUri: 'http://localhost:60564',
    auth0_clientId: 'BpcgVW1USg0wspNuWgJNrJIVqzQUZ2wa',
    auth0_domain: 'ringleader.eu.auth0.com',
    auth0_callbackUrl: 'http://localhost:8585/login_complete',
    auth0_logoutCallbackUrl: 'http://localhost:8585/logout'
}
